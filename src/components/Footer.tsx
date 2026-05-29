import React, { useState } from "react";

interface FooterProps {
  setActiveTab: (tab: any) => void;
}

export default function Footer({ setActiveTab }: FooterProps) {
  const [toastText, setToastText] = useState("");

  const handleScrollTo = (id: string, tab: any) => {
    setActiveTab(tab);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleLinkClick = (e: React.MouseEvent, label: string) => {
    e.preventDefault();
    setToastText(`NeniFix secure reference [${label}] simulation mode active. Contact our IR desk for official files.`);
    setTimeout(() => {
      setToastText("");
    }, 5000);
  };

  return (
    <footer className="w-full py-16 bg-[#141416] border-t border-white/5 mt-20 relative">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="font-display text-2xl font-black text-white mb-4 uppercase">NeniFix</div>
          <p className="font-mono text-[9px] text-white/30 tracking-widest uppercase leading-loose">
            © 2026 NENIFIX BRAND ENGINEERING. CONFIDENTIAL INVESTOR NOTICE: ALL RIGHTS RESERVED.
          </p>
        </div>
        
        <div className="flex flex-col gap-2.5">
          <span className="font-mono text-[9px] font-bold text-primary tracking-[0.2em] mb-1">STRATEGY</span>
          <a 
            className="font-mono text-xs text-white/50 hover:text-white transition-colors uppercase cursor-pointer" 
            onClick={() => handleScrollTo("capabilities", "capabilities")}
          >
            Capabilities
          </a>
          <a 
            className="font-mono text-xs text-white/50 hover:text-white transition-colors uppercase cursor-pointer" 
            onClick={() => handleScrollTo("frontier", "frontier")}
          >
            Workforce Architecture
          </a>
          <a 
            className="font-mono text-xs text-white/50 hover:text-white transition-colors uppercase cursor-pointer" 
            onClick={(e) => handleLinkClick(e, "AI Academy")}
          >
            AI Academy
          </a>
        </div>

        <div className="flex flex-col gap-2.5">
          <span className="font-mono text-[9px] font-bold text-primary tracking-[0.2em] mb-1">PHILANTHROPIC</span>
          <a 
            className="font-mono text-xs text-white/50 hover:text-white transition-colors uppercase cursor-pointer" 
            onClick={() => handleScrollTo("philanthropy", "philanthropy")}
          >
            AgTech Fund
          </a>
          <a 
            className="font-mono text-xs text-white/50 hover:text-white transition-colors uppercase cursor-pointer" 
            onClick={() => handleScrollTo("philanthropy", "philanthropy")}
          >
            STEM Endowment
          </a>
        </div>

        <div className="flex flex-col gap-2.5">
          <span className="font-mono text-[9px] font-bold text-primary tracking-[0.2em] mb-1">GOVERNANCE</span>
          <a 
            className="font-mono text-xs text-white/50 hover:text-white transition-colors uppercase cursor-pointer" 
            onClick={(e) => handleLinkClick(e, "Privacy Policy")}
          >
            Privacy Policy
          </a>
          <a 
            className="font-mono text-xs text-white/50 hover:text-white transition-colors uppercase cursor-pointer" 
            onClick={(e) => handleLinkClick(e, "T&C")}
          >
            Terms of Use
          </a>
        </div>
      </div>

      {/* Floating high-fidelity Bento toast notification instead of basic browser alert */}
      {toastText && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-[#0A0A0B] border border-[#a5b4fc]/20 text-[#a5b4fc] p-4 rounded-2xl shadow-[0_12px_40px_rgba(99,102,241,0.25)] animate-fadeIn font-mono text-[11px] leading-relaxed flex flex-col gap-1.5 backdrop-blur-md">
          <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#a5b4fc] animate-pulse"></span>
            <span>SECURE DIALOGUE NOTICE</span>
          </div>
          <p className="text-white/80 font-sans">{toastText}</p>
        </div>
      )}
    </footer>
  );
}
