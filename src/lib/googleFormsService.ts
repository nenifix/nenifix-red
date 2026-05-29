import { Meeting } from "../types";

export interface GoogleFormConfig {
  formId: string;
  responderUri: string;
  title: string;
}

/**
 * Creates a brand-new structured Google Form for NeniFix contacts/briefings
 * in the authenticated user's Google Drive.
 */
export async function createNeniFixForm(accessToken: string): Promise<GoogleFormConfig> {
  const createUrl = "https://forms.googleapis.com/v1/forms";
  
  // 1. Create the blank Form
  const response = await fetch(createUrl, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      info: {
        title: "NeniFix Investor Briefings & Contacts",
        documentTitle: "NeniFix Contacts & Briefing Register"
      }
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to create Google Form: ${errText}`);
  }

  const form: any = await response.json();
  const formId = form.formId;
  const responderUri = form.responderUri;

  // 2. Setup standard question fields via Batch Update
  const updateUrl = `https://forms.googleapis.com/v1/forms/${formId}:batchUpdate`;
  const batchBody = {
    requests: [
      {
        createItem: {
          item: {
            title: "Investee Name",
            questionItem: {
              question: {
                required: true,
                textQuestion: {}
              }
            }
          },
          location: { index: 0 }
        }
      },
      {
        createItem: {
          item: {
            title: "Inquiry Email",
            questionItem: {
              question: {
                required: true,
                textQuestion: {}
              }
            }
          },
          location: { index: 1 }
        }
      },
      {
        createItem: {
          item: {
            title: "Investor Profile",
            questionItem: {
              question: {
                required: true,
                choiceQuestion: {
                  type: "DROP_DOWN",
                  options: [
                    { value: "Strategic Venture Capital" },
                    { value: "Growth Equity Fund" },
                    { value: "Strategic Corporate Partner" },
                    { value: "Individual Accredited Angel" }
                  ]
                }
              }
            }
          },
          location: { index: 2 }
        }
      },
      {
        createItem: {
          item: {
            title: "Desired Ticket Allocation",
            questionItem: {
              question: {
                required: true,
                choiceQuestion: {
                  type: "DROP_DOWN",
                  options: [
                    { value: "$100k - $250k" },
                    { value: "$250k - $500k" },
                    { value: "$500k - $1M" },
                    { value: "$1M - $5M+" }
                  ]
                }
              }
            }
          },
          location: { index: 3 }
        }
      },
      {
        createItem: {
          item: {
            title: "Briefing Date",
            questionItem: {
              question: {
                required: true,
                dateQuestion: {
                  includeTime: false,
                  includeYear: true
                }
              }
            }
          },
          location: { index: 4 }
        }
      },
      {
        createItem: {
          item: {
            title: "Briefing Time",
            questionItem: {
              question: {
                required: true,
                timeQuestion: {
                  duration: false
                }
              }
            }
          },
          location: { index: 5 }
        }
      }
    ],
    writeControl: {
      requiredRevisionId: form.revisionId
    }
  };

  const updateResponse = await fetch(updateUrl, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(batchBody)
  });

  if (!updateResponse.ok) {
    const errText = await updateResponse.text();
    throw new Error(`Failed to configure Form question fields: ${errText}`);
  }

  return {
    formId,
    responderUri,
    title: "NeniFix Investor Briefings & Contacts"
  };
}

/**
 * Retrieves the form structure to create a Question ID mapping to ease parsing
 */
export async function getFormQuestionMapping(formId: string, accessToken: string): Promise<Record<string, string>> {
  const url = `https://forms.googleapis.com/v1/forms/${formId}`;
  const response = await fetch(url, {
    headers: { "Authorization": `Bearer ${accessToken}` }
  });

  if (!response.ok) {
    throw new Error("Unable to retrieve form question structure.");
  }

  const form: any = await response.json();
  const mapping: Record<string, string> = {};

  if (form.items) {
    for (const item of form.items) {
      if (item.questionItem?.question?.questionId) {
        // Map question ID to its lowercased title to make matching robust
        const title = item.title?.toLowerCase() || "";
        mapping[item.questionItem.question.questionId] = title;
      }
    }
  }

  return mapping;
}

/**
 * Fetches responses from a Google Form and transforms them into standard Meeting objects
 */
export async function fetchAndParseFormResponses(
  formId: string, 
  accessToken: string
): Promise<Meeting[]> {
  // 1. Get question mappings first
  const mapping = await getFormQuestionMapping(formId, accessToken);

  const responsesUrl = `https://forms.googleapis.com/v1/forms/${formId}/responses`;
  const response = await fetch(responsesUrl, {
    headers: { "Authorization": `Bearer ${accessToken}` }
  });

  if (!response.ok) {
    // If there are no responses yet, Google forms sometimes returns 200 with empty body, or error if not found.
    if (response.status === 404) {
      return [];
    }
    const txt = await response.text();
    throw new Error(`Failed to fetch responses: ${txt}`);
  }

  const data: any = await response.json();
  if (!data.responses) {
    return [];
  }

  const meetings: Meeting[] = [];

  for (const resp of data.responses) {
    let name = "Anonymous User";
    let email = "no-email@google.com";
    let profile = "Venture";
    let ticketSize = "$250k - $500k";
    let date = "";
    let time = "";

    // Parse each answer
    if (resp.answers) {
      for (const [qid, answerObj] of Object.entries<any>(resp.answers)) {
        const questionTitle = mapping[qid] || "";
        const textAnswers = answerObj.textAnswers?.answers;
        if (!textAnswers || textAnswers.length === 0) continue;
        const mainVal = textAnswers[0].value || "";

        if (questionTitle.includes("name")) {
          name = mainVal;
        } else if (questionTitle.includes("email")) {
          email = mainVal;
        } else if (questionTitle.includes("profile")) {
          profile = mainVal;
        } else if (questionTitle.includes("ticket") || questionTitle.includes("allocation")) {
          ticketSize = mainVal;
        } else if (questionTitle.includes("date")) {
          date = mainVal;
        } else if (questionTitle.includes("time")) {
          time = mainVal;
        }
      }
    }

    // Default dates if missing
    if (!date) {
      const parsedDate = new Date(resp.lastSubmittedTime || Date.now());
      date = parsedDate.toISOString().split("T")[0];
    }
    if (!time) {
      time = "14:00";
    }

    meetings.push({
      id: `GF-${resp.responseId.substring(0, 8).toUpperCase()}`,
      name,
      email,
      profile,
      ticketSize,
      date,
      time,
      status: "Synced via Form"
    });
  }

  // Sort descending by date
  return meetings.reverse();
}
