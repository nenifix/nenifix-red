import React, { useState, useEffect, useRef } from "react";
import { Message, Meeting } from "../types";
import { 
  Terminal, 
  Send, 
  Calendar, 
  CheckSquare, 
  Briefcase, 
  DollarSign, 
  Clock, 
  HelpCircle, 
  Loader2, 
  Sparkles, 
  User, 
  Users,
  LogOut,
  RefreshCw,
  FileText,
  CheckCircle,
  Settings,
  Link as LinkIcon
} from "lucide-react";
import { initAuth, googleSignIn, handleLogout, db, handleFirestoreError, OperationType, auth } from "../lib/firebase";
import { createNeniFixForm, fetchAndParseFormResponses, GoogleFormConfig } from "../lib/googleFormsService";
import { upsertCalendarEvent } from "../lib/googleCalendarService";
import { User as FirebaseUser } from "firebase/auth";
import ClientFilePicker from "./ClientFilePicker";
import { doc, setDoc, getDocs, collection, query, orderBy } from "firebase/firestore";

export default function InvestorsConsole() {
  // Chat Interface State
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      message: "Connected. I am CC-9 (Cognitive Core-9), live AI Investor Relations Representative for NeniFix. Ask me anything regarding our physical craft, full-stack software dashboards, brand robotics fleet, or programmatic AgTech and STEM allocations."
    }
  ]);
  const [userInput, setUserInput] = useState("");
  const [isBotLoading, setIsBotLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scheduler Interface State
  const [bookName, setBookName] = useState("");
  const [bookEmail, setBookEmail] = useState("");
  const [profile, setProfile] = useState("Venture");
  const [ticketSize, setTicketSize] = useState("$250k - $500k");
  const [bookDate, setBookDate] = useState("");
  const [bookTime, setBookTime] = useState("");
  const [bookingResponse, setBookingResponse] = useState<Meeting | null>(null);
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const [recentBookings, setRecentBookings] = useState<Meeting[]>([]);
  const [formError, setFormError] = useState("");

  // Firebase Auth & Google Forms Integration State
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [connectedForm, setConnectedForm] = useState<GoogleFormConfig | null>(null);
  const [isCreatingForm, setIsCreatingForm] = useState(false);
  const [isSyncingResponses, setIsSyncingResponses] = useState(false);
  const [formMode, setFormMode] = useState<"standard" | "embed">("standard");
  const [formIdInput, setFormIdInput] = useState("");
  const [showConfig, setShowConfig] = useState(false);

  // Google Calendar Integration State
  const [syncedEventIds, setSyncedEventIds] = useState<string[]>([]);
  const [calendarSyncLoadingId, setCalendarSyncLoadingId] = useState<string | null>(null);
  const [calendarToast, setCalendarToast] = useState("");

  // Initialize Auth & Saved configuration on mount
  useEffect(() => {
    // Check if there is an existing form saved in localStorage
    const savedForm = localStorage.getItem("nenifix_connected_form");
    if (savedForm) {
      try {
        setConnectedForm(JSON.parse(savedForm));
      } catch (e) {
        console.error("Error parsing saved form", e);
      }
    }

    const savedMode = localStorage.getItem("nenifix_form_mode");
    if (savedMode === "embed" || savedMode === "standard") {
      setFormMode(savedMode);
    }

    const savedSyncedIds = localStorage.getItem("nenifix_synced_calendar_ids");
    if (savedSyncedIds) {
      try {
        setSyncedEventIds(JSON.parse(savedSyncedIds));
      } catch (e) {
        console.error("Error parsing synced calendar ids", e);
      }
    }

    // Initialize Firebase Auth listener
    const unsubscribe = initAuth(
      (currentUser, token) => {
        setUser(currentUser);
        setGoogleToken(token);
      },
      () => {
        setUser(null);
        setGoogleToken(null);
      }
    );

    return () => unsubscribe();
  }, []);

  // Fetch local mock bookings and sync live Google Form responses if connected
  const fetchBookings = async (customToken?: string | null) => {
    try {
      const res = await fetch("/api/meetings/list");
      let bookingsData: Meeting[] = [];
      try {
        bookingsData = await res.json();
      } catch (err) {
        console.error("Failed parsing API list:", err);
      }
      
      // If signed-in, sync with genuine cloud Firestore collection
      const isUserSignedIn = !!auth.currentUser;
      if (isUserSignedIn) {
        try {
          const q = query(collection(db, "meetings"), orderBy("createdAt", "desc"));
          const snapshot = await getDocs(q);
          const firestoreDocs = snapshot.docs.map(d => d.data() as Meeting);
          
          // Deduplicate incoming list by unique confirmation ID
          const seenIds = new Set(bookingsData.map(b => b.id));
          for (const item of firestoreDocs) {
            if (!seenIds.has(item.id)) {
              bookingsData.push(item);
              seenIds.add(item.id);
            }
          }
        } catch (fsErr) {
          console.warn("Firestore list fetch failed/restricted under security policy. Checking details...");
          try {
            handleFirestoreError(fsErr, OperationType.LIST, "meetings");
          } catch (formattedErr) {
            console.error("Structured permissions exception:", formattedErr);
          }
        }
      }

      const tokenToUse = customToken !== undefined ? customToken : googleToken;
      
      if (connectedForm && tokenToUse) {
        setIsSyncingResponses(true);
        try {
          const formResponses = await fetchAndParseFormResponses(connectedForm.formId, tokenToUse);
          // Combine both responses
          setRecentBookings([...formResponses, ...bookingsData]);
        } catch (err) {
          console.error("Error fetching Google Form responses, fallback to local:", err);
          setRecentBookings(bookingsData);
        } finally {
          setIsSyncingResponses(false);
        }
      } else {
        setRecentBookings(bookingsData);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [bookingResponse, connectedForm, googleToken]);

  // Firebase Google Log-In
  const handleGoogleLogin = async () => {
    setIsAuthLoading(true);
    setFormError("");
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setGoogleToken(result.accessToken);
        // Sync bookings immediately using the newly retrieved token
        await fetchBookings(result.accessToken);
      }
    } catch (err: any) {
      console.error("Firebase Login failed:", err);
      setFormError(`Google Sign-In failed: ${err.message || err.toString()}`);
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Firebase Log-Out
  const handleGoogleLogout = async () => {
    try {
      await handleLogout();
      setUser(null);
      setGoogleToken(null);
    } catch (err) {
      console.error("Firebase Logout failed:", err);
    }
  };

  // Google Forms API: Programmatic Creation of standard briefing questionnaire form
  const handleCreateGoogleForm = async () => {
    if (!googleToken) {
      setFormError("Authentication is required to provision Google Forms.");
      return;
    }
    setIsCreatingForm(true);
    setFormError("");
    try {
      const configuredForm = await createNeniFixForm(googleToken);
      setConnectedForm(configuredForm);
      localStorage.setItem("nenifix_connected_form", JSON.stringify(configuredForm));
      setFormMode("embed");
      localStorage.setItem("nenifix_form_mode", "embed");
      await fetchBookings(googleToken);
    } catch (err: any) {
      console.error("Form creation error:", err);
      setFormError(`Form Provision error: ${err.message || err.toString()}`);
    } finally {
      setIsCreatingForm(false);
    }
  };

  // Link pre-existing Google Form ID
  const handleLinkExistingForm = () => {
    if (!formIdInput.trim()) {
      setFormError("Please enter a valid Google Form ID.");
      return;
    }
    const formId = formIdInput.trim();
    const mockForm: GoogleFormConfig = {
      formId,
      responderUri: `https://docs.google.com/forms/d/e/${formId}/viewform`,
      title: "Linked Google Form"
    };
    setConnectedForm(mockForm);
    localStorage.setItem("nenifix_connected_form", JSON.stringify(mockForm));
    setFormIdInput("");
    setFormError("");
  };

  // Unlink / Clear Google Forms config from workspace
  const handleClearConnectedForm = () => {
    setConnectedForm(null);
    localStorage.removeItem("nenifix_connected_form");
  };

  // Change embedding style vs local styled form input
  const handleToggleFormMode = (mode: "standard" | "embed") => {
    setFormMode(mode);
    localStorage.setItem("nenifix_form_mode", mode);
  };

  // Click suggestion handler
  const handleSuggestionClick = (promptStr: string) => {
    if (isBotLoading) return;
    setUserInput(promptStr);
    sendMessage(promptStr);
  };

  const sendMessage = async (overrideInput?: string) => {
    const textToSend = overrideInput || userInput;
    if (!textToSend.trim() || isBotLoading) return;

    const updatedUserMsg: Message = { role: "user", message: textToSend };
    const tempMessages = [...messages, updatedUserMsg];
    
    setMessages(tempMessages);
    setUserInput("");
    setIsBotLoading(true);

    // Scroll to bottom
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 50);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: tempMessages }),
      });
      const data = await response.json();
      
      setMessages((prev) => [...prev, { role: "assistant", message: data.text }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", message: "Error communicating with CC-9. Please check that the backend is active." }
      ]);
    } finally {
      setIsBotLoading(false);
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, 50);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!bookName || !bookEmail || !bookDate || !bookTime) {
      setFormError("Please fill in all scheduling fields.");
      return;
    }
    setIsBookingLoading(true);

    try {
      const res = await fetch("/api/meetings/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: bookName,
          email: bookEmail,
          date: bookDate,
          time: bookTime,
          profile,
          ticketSize
        }),
      });
      const data = await res.json();
      if (data.success && data.meeting) {
        const meetingId = data.meeting.id;
        
        // 100% compliant payload matching the validated firestore schema rules exactly
        const meetingPayload = {
          id: meetingId,
          name: data.meeting.name,
          email: data.meeting.email,
          date: data.meeting.date,
          time: data.meeting.time,
          profile: data.meeting.profile || "Venture",
          ticketSize: data.meeting.ticketSize || "$250k - $500k",
          status: data.meeting.status || "Confirmed",
          createdAt: new Date().toISOString()
        };

        // Write directly to Firebase Cloud Firestore for persistent storage
        try {
          await setDoc(doc(db, "meetings", meetingId), meetingPayload);
        } catch (fsErr) {
          console.warn("Firestore writing failed. Interfacing secure diagnostics exception check...");
          // Handle fail states using our standardized security exception handlers
          handleFirestoreError(fsErr, OperationType.CREATE, `meetings/${meetingId}`);
        }

        // Try linking to Google Calendar if googleToken is available
        if (googleToken) {
          try {
            const calRes = await upsertCalendarEvent(googleToken, meetingPayload);
            if (calRes.success) {
              const updated = [...syncedEventIds, meetingId];
              setSyncedEventIds(updated);
              localStorage.setItem("nenifix_synced_calendar_ids", JSON.stringify(updated));
              setCalendarToast(`Scheduled: Roundtable Briefing for ${bookName} synced to Google Calendar with notifications!`);
              setTimeout(() => setCalendarToast(""), 5000);
            }
          } catch (calErr) {
            console.warn("Failed automatic Calendar sync on submission:", calErr);
          }
        }

        setBookingResponse(data.meeting);
        setBookName("");
        setBookEmail("");
        setBookDate("");
        setBookTime("");
      } else {
        setFormError("Failed to register slot. Try again.");
      }
    } catch (err: any) {
      console.error(err);
      setFormError(`Could not connect to the scheduling service: ${err.message || err.toString()}`);
    } finally {
      setIsBookingLoading(false);
    }
  };

  const handleSyncToCalendar = async (meeting: Meeting) => {
    if (!googleToken) {
      setCalendarToast("Please connect your Google Workspace in settings below to authorize Google Calendar.");
      setTimeout(() => setCalendarToast(""), 5000);
      return;
    }
    setCalendarSyncLoadingId(meeting.id);
    setFormError("");
    try {
      const res = await upsertCalendarEvent(googleToken, meeting);
      if (res.success) {
        const updated = [...syncedEventIds, meeting.id];
        setSyncedEventIds(updated);
        localStorage.setItem("nenifix_synced_calendar_ids", JSON.stringify(updated));
        setCalendarToast(`Success: Scheduled NeniFix Roundtable with ${meeting.name} on Google Calendar! 1-day reminders configured.`);
        setTimeout(() => setCalendarToast(""), 6000);
      } else {
        setFormError(`Calendar scheduling failed: ${res.error}`);
      }
    } catch (err: any) {
      setFormError(`Sync threw exception: ${err.message || err.toString()}`);
    } finally {
      setCalendarSyncLoadingId(null);
    }
  };

  const suggestedQuestions = [
    "What is Phase 1 physical packaging?",
    "Explain the 32% CAGR AI Robotics projections",
    "How does AgTech philanthropy build a moat?",
    "Tell me about the founders & roadmap"
  ];

  return (
    <section className="py-20" id="investors">
      <div className="font-mono text-xs text-primary mb-4 tracking-widest uppercase opacity-70">
        06 — STRATEGIC ALLOCATION & INVESTOR Q&A
      </div>
      
      <h2 className="font-display text-4xl sm:text-6xl md:text-7xl text-white mb-12 font-black leading-none tracking-tight">
        Synchronize with <br />
        <span className="text-secondary glow-cyan-text font-mono">CC-9 Core</span>
      </h2>

      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Left Grid: CC-9 AI Dialogue Console */}
        <div className="lg:col-span-7 bg-[#141416] border border-white/5 rounded-[2rem] relative overflow-hidden flex flex-col h-[650px] shadow-2xl">
          <div className="bg-[#0A0A0B]/65 border-b border-white/5 p-4 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <Terminal className="w-5 h-5 text-primary" />
              <span className="font-mono text-xs font-bold text-white tracking-widest uppercase">CC-9 DIALOGUE ACTIVE // COGNITIVE LABS</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[9px] bg-primary/10 border border-primary/20 text-primary px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-ping"></span>
              <span>LIVE</span>
            </div>
          </div>

          {/* Chat scroll viewport */}
          <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-4 font-sans text-xs md:text-sm leading-relaxed" id="chat-messages-container">
            {messages.map((m, index) => {
              const isAss = m.role === "assistant";
              return (
                <div key={index} className={`flex gap-3 max-w-[85%] ${isAss ? "mr-auto" : "ml-auto flex-row-reverse"}`}>
                  <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center border font-mono font-bold text-xs ${
                    isAss ? "bg-primary/10 text-primary border-primary/10" : "bg-white/5 text-white border-white/10"
                  }`}>
                    {isAss ? "C9" : "INV"}
                  </div>
                  <div className={`p-4 rounded-3xl leading-relaxed shadow-lg ${
                    isAss 
                      ? "bg-[#0A0A0B] border border-white/5 text-white/90" 
                      : "bg-[#27272A] text-white border border-white/10"
                  }`}>
                    {isAss ? (
                      <div className="whitespace-pre-wrap markdown-body prose prose-invert prose-xs">
                        {m.message}
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{m.message}</p>
                    )}
                  </div>
                </div>
              );
            })}
            
            {isBotLoading && (
              <div className="flex gap-3 max-w-[85%] mr-auto items-center text-white/40 font-mono text-xs">
                <div className="w-8 h-8 rounded-full bg-primary/5 text-primary border border-white/10 flex items-center justify-center animate-pulse">
                  C9
                </div>
                <div className="flex items-center gap-2 bg-[#0A0A0B] p-4 rounded-3xl border border-white/5">
                  <Loader2 className="w-4 h-4 text-primary animate-spin" />
                  <span>CC-9 synthesizing response coordinates...</span>
                </div>
              </div>
            )}
          </div>

          {/* Suggestion prompts */}
          <div className="px-6 py-3 bg-[#0A0A0B]/40 border-t border-white/5 flex flex-wrap gap-2 shrink-0">
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSuggestionClick(q)}
                disabled={isBotLoading}
                className="text-[10px] cursor-pointer font-mono text-primary hover:text-white bg-white/5 border border-white/5 hover:border-white/10 px-3 py-1.5 rounded-full transition-all duration-300 uppercase disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat input box */}
          <div className="p-4 bg-[#0A0A0B] border-t border-white/5 flex gap-3 shrink-0">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              disabled={isBotLoading}
              placeholder="Ask anything about NeniFix Brand Engineering..."
              className="flex-1 bg-white/5 text-white font-mono text-xs px-5 py-3 rounded-full border border-white/10 focus:border-primary focus:outline-none placeholder-white/30 disabled:opacity-70 w-full"
              id="chat-input-field"
            />
            <button
              onClick={() => sendMessage()}
              disabled={isBotLoading || !userInput.trim()}
              className="bg-primary text-white hover:bg-opacity-95 active:scale-95 duration-300 px-5 rounded-full font-bold flex items-center justify-center cursor-pointer disabled:opacity-50 transition-all shadow-[0_4px_14px_rgba(99,102,241,0.4)]"
              id="chat-send-btn"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Grid: Intelligent Scheduler & Bookings */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-8 h-full">
          
          {/* Booking Form Card layout */}
          <div className="bg-[#141416] border border-white/5 p-8 rounded-[2rem] shadow-2xl relative">
            
            {/* Header with Settings Toggle */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl text-white font-bold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <span>Schedule Investor Briefing</span>
              </h3>
              
              <button
                type="button"
                onClick={() => setShowConfig(!showConfig)}
                className={`p-2 rounded-xl border transition-all duration-300 flex items-center justify-center cursor-pointer ${
                  showConfig 
                    ? "bg-primary/20 text-primary border-primary/30" 
                    : "bg-white/5 text-white/50 border-white/5 hover:text-white hover:border-white/10"
                }`}
                title="Configure Google Forms Sync Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>

            {/* Google Forms Connection Panel */}
            {showConfig && (
              <div className="mb-6 p-5 bg-[#0A0A0B] border border-white/5 rounded-2xl animate-fadeIn space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="font-mono text-[10px] uppercase text-primary tracking-wider font-bold">Google Connections</span>
                  {user ? (
                    <button
                      type="button"
                      onClick={handleGoogleLogout}
                      className="text-[10px] text-zinc-400 hover:text-red-400 font-mono transition duration-300 flex items-center gap-1 cursor-pointer"
                    >
                      <LogOut className="w-3 h-3" />
                      <span>Disconnect Workspace</span>
                    </button>
                  ) : (
                    <span className="font-mono text-[9px] bg-red-500/10 border border-red-500/20 text-red-400 px-2.5 py-0.5 rounded-full select-none">
                      UNAUTHENTICATED
                    </span>
                  )}
                </div>

                {/* Authentication block */}
                {!user ? (
                  <div className="space-y-2 py-1">
                    <p className="text-white/60 font-sans leading-relaxed">
                      Connect your Google Workspace to authorize automated Google Calendar briefings, 1-day advance notifications, or orchestrate a live Google Form connection.
                    </p>
                    
                    {/* Official Sign in Style Button */}
                    <button 
                      type="button"
                      onClick={handleGoogleLogin}
                      disabled={isAuthLoading}
                      className="w-full flex items-center justify-center gap-3 bg-white hover:bg-[#f4f4f4] text-black font-semibold font-sans px-4 py-3 rounded-xl transition duration-300 cursor-pointer disabled:opacity-50"
                    >
                      {isAuthLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin text-black" />
                      ) : (
                        <svg className="w-4 h-4" viewBox="0 0 48 48">
                          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                        </svg>
                      )}
                      <span className="text-xs font-bold text-slate-800">Sign in with Google</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 bg-[#141416] p-3 rounded-xl border border-white/5">
                      <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-mono font-bold font-sans">
                        {user.displayName?.substring(0,2).toUpperCase() || "G"}
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-mono text-white text-[10px] leading-tight truncate">{user.displayName || "Google Operator"}</p>
                        <p className="font-mono text-white/40 text-[9px] truncate">{user.email}</p>
                      </div>
                    </div>

                    {/* Applet Form Provision state */}
                    {!connectedForm ? (
                      <div className="space-y-3 pt-1">
                        <p className="text-white/60 leading-relaxed font-sans">
                          No active Google Form is linked yet. Create a standard contact form directly in your Google Drive or specify a custom form ID.
                        </p>
                        
                        <button
                          type="button"
                          onClick={handleCreateGoogleForm}
                          disabled={isCreatingForm}
                          className="w-full bg-primary/20 hover:bg-primary/30 border border-primary/30 text-white font-mono uppercase tracking-wider py-2.5 rounded-xl transition duration-300 font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          {isCreatingForm ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Creating Form Items...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
                              <span>⚡ Auto-Provision Google Form</span>
                            </>
                          )}
                        </button>
                        
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={formIdInput}
                            onChange={(e) => setFormIdInput(e.target.value)}
                            placeholder="Or enter Google Form ID..."
                            className="flex-1 bg-[#141416] border border-white/10 text-white font-mono text-[10px] px-3 py-2.5 rounded-xl focus:outline-none focus:border-primary placeholder-white/20"
                          />
                          <button
                            type="button"
                            onClick={handleLinkExistingForm}
                            className="bg-white/5 border border-white/10 text-white px-3 rounded-xl hover:bg-white/10 transition text-[10px] cursor-pointer"
                          >
                            Link
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3 bg-[#141416] p-4 rounded-xl border border-white/5">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-emerald-400 font-bold flex items-center gap-1.5 text-[10px] uppercase">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Linked to Google Drive</span>
                          </span>
                          <button
                            type="button"
                            onClick={handleClearConnectedForm}
                            className="text-white/30 hover:text-red-400 font-mono text-[9px] uppercase underline cursor-pointer"
                          >
                            Unlink
                          </button>
                        </div>
                        
                        <div>
                          <p className="text-white font-bold truncate leading-tight">{connectedForm.title}</p>
                          <p className="text-white/40 font-mono text-[9px] truncate shrink mt-0.5" title={connectedForm.formId}>
                            ID: {connectedForm.formId}
                          </p>
                        </div>

                        {/* Mode selectors */}
                        <div className="grid grid-cols-2 gap-2 mt-2 pt-1">
                          <button
                            type="button"
                            onClick={() => handleToggleFormMode("standard")}
                            className={`py-1.5 px-2 rounded-lg font-mono text-[10px] border transition cursor-pointer ${
                              formMode === "standard"
                                ? "bg-primary text-white border-primary"
                                : "bg-[#0A0A0B] text-white/50 border-white/10 hover:text-white"
                            }`}
                          >
                            Native UI Form
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleFormMode("embed")}
                            className={`py-1.5 px-2 rounded-lg font-mono text-[10px] border transition cursor-pointer ${
                              formMode === "embed"
                                ? "bg-primary text-white border-primary"
                                : "bg-[#0A0A0B] text-white/50 border-white/10 hover:text-white"
                            }`}
                          >
                            Embed iframe
                          </button>
                        </div>

                        <a
                          href={connectedForm.responderUri}
                          target="_blank"
                          rel="noreferrer referrer"
                          className="w-full flex items-center justify-center gap-1 bg-[#0A0A0B] hover:bg-[#040404] text-zinc-300 font-mono hover:text-white text-[10px] py-2 rounded-lg border border-white/10 transition mt-2.5 text-center"
                        >
                          <LinkIcon className="w-3 h-3" />
                          <span>View Live Google Form 🔗</span>
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Main Interactive Form Body */}
            {connectedForm && formMode === "embed" ? (
              <div className="space-y-4 animate-fadeIn">
                <div className="relative w-full h-[380px] rounded-2xl overflow-hidden border border-white/10 bg-[#0A0A0B] shadow-inner">
                  <iframe
                    src={`${connectedForm.responderUri}?embedded=true`}
                    className="w-full h-full bg-[#0A0A0B]"
                    title="NeniFix Responders Form"
                    referrerPolicy="no-referrer"
                  >
                    Loading form...
                  </iframe>
                </div>
                <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl text-center">
                  <p className="font-mono text-[9px] text-[#e2e2e2]/80 uppercase tracking-widest leading-none font-bold">
                    Google Form Embedded Mode Active
                  </p>
                  <p className="font-sans text-[10px] text-[#BDBDBD] mt-1 leading-relaxed">
                    Submissions through this form feed directly into Google Forms. Click the "Sync" indicator in the standby register below to synchronize answers in real time.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div className="p-3 bg-primary/10 border border-white/5 rounded-xl text-left flex items-start gap-2.5 animate-fadeIn">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0 animate-pulse"></div>
                  <div>
                    <span className="font-mono text-[9px] text-white/80 uppercase tracking-wider font-bold">
                      Direct Routing Core Active
                    </span>
                    <p className="font-sans text-[10px] text-white/60 mt-0.5 leading-relaxed">
                      All messages and bookings from this contact form are routed instantly to our main address <strong className="text-white">info@nenifix.com</strong> and archived at <strong className="text-white">godwintext@gmail.com</strong>.
                    </p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-white/50 uppercase mb-1 font-bold">Investee Name</label>
                    <input
                      type="text"
                      value={bookName}
                      onChange={(e) => setBookName(e.target.value)}
                      required
                      placeholder="E.g. Alexis Carter"
                      className="w-full bg-[#0A0A0B] border border-white/10 focus:border-primary focus:outline-none p-3 rounded-xl font-mono text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-white/50 uppercase mb-1 font-bold">Inquiry Email</label>
                    <input
                      type="email"
                      value={bookEmail}
                      onChange={(e) => setBookEmail(e.target.value)}
                      required
                      placeholder="alexis@strategic-cap.com"
                      className="w-full bg-[#0A0A0B] border border-white/10 focus:border-primary focus:outline-none p-3 rounded-xl font-mono text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-white/50 uppercase mb-1 font-bold">Investor Profile</label>
                    <select
                      value={profile}
                      onChange={(e) => setProfile(e.target.value)}
                      className="w-full bg-[#0A0A0B] border border-white/10 focus:border-primary focus:outline-none p-3 rounded-xl font-mono text-xs text-text-body text-white"
                    >
                      <option value="Venture">Strategic Venture Capital</option>
                      <option value="Growth">Growth Equity Fund</option>
                      <option value="Strategic">Strategic Corporate Partner</option>
                      <option value="Angel">Individual Accredited Angel</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-white/50 uppercase mb-1 font-bold">Desired Ticket Allocation</label>
                    <select
                      value={ticketSize}
                      onChange={(e) => setTicketSize(e.target.value)}
                      className="w-full bg-[#0A0A0B] border border-white/10 focus:border-primary focus:outline-none p-3 rounded-xl font-mono text-xs text-text-body text-white"
                    >
                      <option value="$100k - $250k">$100k - $250k</option>
                      <option value="$250k - $500k">$250k - $500k</option>
                      <option value="$500k - $1M">$500k - $1M</option>
                      <option value="$1M - $5M+">$1M - $5M+</option>
                    </select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-white/50 uppercase mb-1 font-bold">Briefing Date</label>
                    <input
                      type="date"
                      value={bookDate}
                      onChange={(e) => setBookDate(e.target.value)}
                      required
                      className="w-full bg-[#0A0A0B] border border-white/10 focus:border-primary focus:outline-none p-3 rounded-xl font-mono text-xs text-text-body text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-white/50 uppercase mb-1 font-bold">Briefing Time (UTC)</label>
                    <input
                      type="time"
                      value={bookTime}
                      onChange={(e) => setBookTime(e.target.value)}
                      required
                      className="w-full bg-[#0A0A0B] border border-white/10 focus:border-primary focus:outline-none p-3 rounded-xl font-mono text-xs text-text-body text-white"
                    />
                  </div>
                </div>

                {formError && (
                  <p className="text-[#ff6b6b] text-xs font-mono font-bold mt-1 uppercase tracking-wider animate-fadeIn">
                    Error: {formError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isBookingLoading}
                  className="w-full bg-primary hover:bg-opacity-90 active:scale-95 text-white font-mono text-xs font-bold tracking-widest py-4 rounded-full uppercase transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(99,102,241,0.4)]"
                  id="submit-booking-btn"
                >
                  {isBookingLoading ? "Booking Grid Slots..." : "Initiate Roundtable Booking"}
                </button>
              </form>
            )}

            {/* Booking confirmation success box */}
            {bookingResponse && (
              <div className="mt-4 p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-[1.5rem] animate-fadeIn text-xs text-white shadow-xl">
                <h4 className="font-mono font-bold uppercase text-emerald-400 flex items-center gap-1.5 mb-1 text-[11px] tracking-wider">
                  <span>Slot Scheduled Successfully</span>
                </h4>
                <p className="font-mono text-[9px] text-[#e2e2e2]/60 mb-2">Confirmation ID: {bookingResponse.id}</p>
                <p className="font-sans text-[#BDBDBD] leading-relaxed">Excellent. We have registered {bookingResponse.name} for NeniFix Roundtable briefs on <strong>{bookingResponse.date}</strong> at <strong>{bookingResponse.time} UTC</strong>. Check your {bookingResponse.email} inbox for virtual credentials.</p>
                <p className="font-sans text-[#BDBDBD] text-[11px] mt-2 leading-relaxed p-2 bg-white/5 rounded-lg border border-white/5">
                  <span className="text-emerald-400 font-bold font-mono">✓ SECURE COPIES ROUTED:</span> Dispatched instantly to our main office (<strong className="text-white">info@nenifix.com</strong>) and backup system (<strong className="text-white">godwintext@gmail.com</strong>).
                </p>
                <button 
                  type="button"
                  onClick={() => setBookingResponse(null)}
                  className="mt-3 cursor-pointer text-[9px] hover:text-emerald-300 uppercase tracking-wider text-emerald-400 font-mono underline block"
                >
                  Schedule Another brief
                </button>
              </div>
            )}

            {/* Google Picker Document Transmission System */}
            <ClientFilePicker 
              accessToken={googleToken}
              user={user}
              onLogin={handleGoogleLogin}
            />
          </div>

          {/* Active Roundtables Viewport */}
          <div className="bg-[#141416] border border-white/5 p-8 rounded-[2rem] text-left shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-mono text-[10px] text-white/40 uppercase tracking-wider flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-primary" />
                <span>Current Briefing Standby Register</span>
              </h4>
              
              {connectedForm && googleToken && (
                <button
                  type="button"
                  onClick={() => fetchBookings()}
                  disabled={isSyncingResponses}
                  className="flex items-center gap-1 font-mono text-[9px] text-primary hover:text-secondary hover:underline transition duration-300 disabled:opacity-50 uppercase cursor-pointer"
                  title="Synchronize Google Form answers manually"
                >
                  <RefreshCw className={`w-3 h-3 ${isSyncingResponses ? "animate-spin" : ""}`} />
                  <span>{isSyncingResponses ? "Syncing..." : "Sync Responses"}</span>
                </button>
              )}
            </div>

            <div className="space-y-2.5 max-h-[180px] overflow-y-auto pr-1">
              {recentBookings.length === 0 ? (
                <>
                  <div className="flex items-center justify-between font-mono text-[11px] p-3 bg-[#0A0A0B] rounded-xl border border-white/5">
                    <div>
                      <span className="text-[#e2e2e2] font-bold">Harland Capital Partners</span>
                      <span className="text-[9px] text-white/40 block">Strategic Roundtable Allocator</span>
                    </div>
                    <span className="text-secondary font-bold">$1.5M+ ticket</span>
                  </div>
                  <div className="flex items-center justify-between font-mono text-[11px] p-3 bg-[#0A0A0B] rounded-xl border border-white/5">
                    <div>
                      <span className="text-[#e2e2e2] font-bold">Valerie Sterling</span>
                      <span className="text-[9px] text-white/40 block">Growth Angel brief</span>
                    </div>
                    <span className="text-secondary font-bold">$350k allocated</span>
                  </div>
                </>
              ) : (
                recentBookings.map((b, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 font-mono text-[11px] p-3 bg-[#0A0A0B] rounded-xl border border-white/10">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[#e2e2e2] font-bold">{b.name}</span>
                        <span className="text-[9px] text-neutral-400 px-1.5 py-0.5 bg-white/5 rounded">
                          {b.profile}
                        </span>
                      </div>
                      <span className="text-[9px] text-primary/85 block mt-0.5">{b.date} / {b.time} UTC</span>
                    </div>
                    
                    <div className="flex items-center gap-2 justify-between sm:justify-end">
                      <span className="text-primary font-bold mr-1">{b.ticketSize}</span>
                      
                      {syncedEventIds.includes(b.id) ? (
                        <span className="text-[9px] bg-primary/10 border border-primary/20 text-primary px-2 py-1 rounded-lg flex items-center gap-1 font-bold select-none whitespace-nowrap">
                          <CheckCircle className="w-3 h-3 text-primary animate-pulse" />
                          <span>On Calendar</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          disabled={calendarSyncLoadingId === b.id}
                          onClick={() => handleSyncToCalendar(b)}
                          className="text-[9px] bg-white/5 hover:bg-primary/25 border border-white/10 hover:border-primary/40 text-neutral-300 hover:text-white px-2 py-1 rounded-lg transition-all duration-300 flex items-center gap-1 cursor-pointer disabled:opacity-50 whitespace-nowrap font-bold"
                          title="Schedule this briefing on your Google Calendar immediately with a 1-day reminder"
                        >
                          {calendarSyncLoadingId === b.id ? (
                            <Loader2 className="w-2.5 h-2.5 animate-spin" />
                          ) : (
                            <Calendar className="w-2.5 h-2.5" />
                          )}
                          <span>Sync Cal</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Google Calendar Feedback Toast */}
          {calendarToast && (
            <div className="fixed bottom-6 left-6 z-50 max-w-sm bg-[#0a0a0b] border border-primary/20 text-primary p-4 rounded-2xl shadow-[0_12px_40px_rgba(118,185,0,0.25)] animate-fadeIn font-mono text-[11px] leading-relaxed flex flex-col gap-1.5 backdrop-blur-md">
              <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                <span>GOOGLE WORKSPACE ROUTER</span>
              </div>
              <p className="text-white/80 font-sans">{calendarToast}</p>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
