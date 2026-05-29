import React, { useState, useEffect, useRef } from "react";
import { Message, Meeting } from "../types";
import { Terminal, Send, Calendar, CheckSquare, Briefcase, DollarSign, Clock, HelpCircle, Loader2, Sparkles, User, Users } from "lucide-react";

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

  // Fetch recent bookings
  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/meetings/list");
      const data = await res.json();
      setRecentBookings(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [bookingResponse]);

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
        setBookingResponse(data.meeting);
        setBookName("");
        setBookEmail("");
        setBookDate("");
        setBookTime("");
      } else {
        setFormError("Failed to register slot. Try again.");
      }
    } catch (err) {
      console.error(err);
      setFormError("Could not connect to the scheduling service.");
    } finally {
      setIsBookingLoading(false);
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
            <h3 className="font-display text-xl text-white mb-6 font-bold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              <span>Schedule Investor Briefing</span>
            </h3>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
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
                    className="w-full bg-[#0A0A0B] border border-white/10 focus:border-primary focus:outline-none p-3 rounded-xl font-mono text-xs text-text-body"
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
                    className="w-full bg-[#0A0A0B] border border-white/10 focus:border-primary focus:outline-none p-3 rounded-xl font-mono text-xs text-text-body"
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
                    className="w-full bg-[#0A0A0B] border border-white/10 focus:border-primary focus:outline-none p-3 rounded-xl font-mono text-xs text-text-body"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-white/50 uppercase mb-1 font-bold">Briefing Time (UTC)</label>
                  <input
                    type="time"
                    value={bookTime}
                    onChange={(e) => setBookTime(e.target.value)}
                    required
                    className="w-full bg-[#0A0A0B] border border-white/10 focus:border-primary focus:outline-none p-3 rounded-xl font-mono text-xs text-text-body"
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

            {/* Booking confirmation success box */}
            {bookingResponse && (
              <div className="mt-4 p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-[1.5rem] animate-fadeIn text-xs text-white shadow-xl">
                <h4 className="font-mono font-bold uppercase text-emerald-400 flex items-center gap-1.5 mb-1 text-[11px] tracking-wider">
                  <span>Slot Scheduled Successfully</span>
                </h4>
                <p className="font-mono text-[9px] text-[#e2e2e2]/60 mb-2">Confirmation ID: {bookingResponse.id}</p>
                <p className="font-sans text-[#BDBDBD] leading-relaxed">Excellent. We have registered {bookingResponse.name} for NeniFix Roundtable briefs on <strong>{bookingResponse.date}</strong> at <strong>{bookingResponse.time} UTC</strong>. Check your {bookingResponse.email} inbox for virtual credentials.</p>
                <button 
                  onClick={() => setBookingResponse(null)}
                  className="mt-3 cursor-pointer text-[9px] hover:text-emerald-300 uppercase tracking-wider text-emerald-400 font-mono underline block"
                >
                  Schedule Another brief
                </button>
              </div>
            )}
          </div>

          {/* Active Roundtables Viewport */}
          <div className="bg-[#141416] border border-white/5 p-8 rounded-[2rem] text-left shadow-xl">
            <h4 className="font-mono text-[10px] text-white/40 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-primary" />
              <span>Current Briefing Standby Register</span>
            </h4>
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
                  <div key={i} className="flex items-center justify-between font-mono text-[11px] p-2.5 bg-[#0A0A0B] rounded-xl border border-white/10">
                    <div>
                      <span className="text-[#e2e2e2] font-bold">{b.name} ({b.profile})</span>
                      <span className="text-[9px] text-emerald-400 block">{b.date} / {b.time} UTC</span>
                    </div>
                    <span className="text-emerald-400 font-bold">{b.ticketSize}</span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
