import React, { useState, useEffect } from "react";
import { ActiveSection } from "../types";
import { Sparkles, Calendar, Layers } from "lucide-react";

interface NavbarProps {
  activeTab: ActiveSection;
  setActiveTab: (tab: ActiveSection) => void;
  onScheduleClick: () => void;
}

export default function Navbar({ activeTab, setActiveTab, onScheduleClick }: NavbarProps) {
  const [timeStr, setTimeStr] = useState("");
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setDateStr(now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems: { id: ActiveSection; label: string }[] = [
    { id: "story", label: "Story" },
    { id: "frontier", label: "Frontier/Sim" },
    { id: "capabilities", label: "Capabilities" },
    { id: "philanthropy", label: "Philanthropy" },
    { id: "investors", label: "Investor Q&A" },
  ];

  return (
    <nav className="bg-[#0A0A0B]/80 backdrop-blur-xl sticky top-0 w-full z-50 border-b border-white/5 flex justify-between items-center px-6 md:px-12 max-w-[1280px] mx-auto h-20 transition-all">
      <div 
        onClick={() => setActiveTab("story")}
        className="cursor-pointer font-display text-xl md:text-2xl font-black tracking-tighter text-white uppercase flex items-center gap-2 group"
        id="nav-logo"
      >
        <span className="group-hover:text-primary transition-colors">NeniFix</span>
        <Layers className="w-5 h-5 text-primary group-hover:rotate-12 transition-transform" />
      </div>

      <div className="hidden lg:flex items-center gap-6 lg:gap-8 bg-white/5 border border-white/5 px-2.5 py-1.5 rounded-full">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                const el = document.getElementById(item.id);
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className={`font-display text-[10px] tracking-widest uppercase transition-all px-3 py-1.5 rounded-full font-bold cursor-pointer ${
                isActive
                  ? "bg-primary text-white"
                  : "text-white/60 hover:text-white"
              }`}
              id={`nav-link-${item.id}`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-4">
        {/* Live Bento Clock */}
        <div className="hidden sm:flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full font-mono text-xs">
          <span className="text-white/60">{dateStr || "May 29"}</span>
          <div className="w-[1px] h-3 bg-white/20"></div>
          <span className="font-semibold text-white">{timeStr || "12:00 PM"}</span>
        </div>

        <button
          onClick={onScheduleClick}
          className="bg-primary hover:bg-opacity-90 active:scale-95 text-xs font-display font-medium tracking-widest px-5 py-2.5 rounded-full transition-all duration-300 uppercase flex items-center gap-2 font-bold text-white shadow-[0_4px_14px_rgba(99,102,241,0.4)]"
          id="nav-schedule-btn"
        >
          <Calendar className="w-4 h-4" />
          <span className="hidden md:inline">Schedule Meeting</span>
          <span className="md:hidden">Book</span>
        </button>
      </div>
    </nav>
  );
}
