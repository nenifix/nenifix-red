import { Meeting } from "../types";

export interface GoogleCalendarResponse {
  success: boolean;
  htmlLink?: string;
  error?: string;
}

/**
 * Creates or updates an event on the user's primary Google Calendar with
 * automated reminders, attendee routing, and a 1-day advance notification.
 */
export async function upsertCalendarEvent(
  accessToken: string,
  booking: Meeting
): Promise<GoogleCalendarResponse> {
  try {
    // Generate valid, unique RFC-compliant ID (base32hex alphabet: a-v and 0-9)
    const cleanId = "nf" + booking.id.toLowerCase().replace(/[^a-v0-9]/g, "");

    // 1. Check if the event already exists
    const checkUrl = `https://www.googleapis.com/calendar/v3/calendars/primary/events/${cleanId}`;
    const checkRes = await fetch(checkUrl, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });

    const exists = checkRes.status === 200;

    // 2. Format start & end times in UTC
    const startStr = `${booking.date}T${booking.time}:00Z`;
    const startDate = new Date(startStr);
    
    // Default Roundtable Session is 60 minutes
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
    const endStr = endDate.toISOString();

    const eventPayload = {
      id: cleanId,
      summary: `NeniFix Roundtable Briefing: ${booking.name}`,
      description: `NeniFix Roundtable strategic briefing and consultation session.\n\nInvestee/Partner: ${booking.name}\nProfile: ${booking.profile}\nTarget Ticket: ${booking.ticketSize}\nStatus: ${booking.status}\nConfirmation Code: ${booking.id}\n\nAutomated notifications and updates routed to: info@nenifix.com & godwintext@gmail.com.`,
      start: {
        dateTime: startStr,
        timeZone: "UTC"
      },
      end: {
        dateTime: endStr,
        timeZone: "UTC"
      },
      attendees: [
        { email: booking.email },
        { email: "info@nenifix.com" },
        { email: "godwintext@gmail.com" }
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 1440 }, // 1 day (24h * 60m) before
          { method: "popup", minutes: 1440 }, // 1 day (24h * 60m) before
          { method: "email", minutes: 60 },   // 1 hour before reminder
          { method: "popup", minutes: 15 }    // 15 minutes before popup
        ]
      }
    };

    const method = exists ? "PUT" : "POST";
    const requestUrl = exists
      ? `https://www.googleapis.com/calendar/v3/calendars/primary/events/${cleanId}?sendUpdates=all`
      : `https://www.googleapis.com/calendar/v3/calendars/primary/events?sendUpdates=all`;

    const response = await fetch(requestUrl, {
      method,
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(eventPayload)
    });

    if (!response.ok) {
      const errText = await response.text();
      return {
        success: false,
        error: `Calendar API Error: ${errText}`
      };
    }

    const data = await response.json();
    return {
      success: true,
      htmlLink: data.htmlLink
    };
  } catch (err: any) {
    console.error("Error in upsertCalendarEvent:", err);
    return {
      success: false,
      error: err.message || err.toString()
    };
  }
}
