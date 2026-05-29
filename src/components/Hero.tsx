import React, { useState } from "react";
import { Download, Play, Rocket, Terminal, CheckCircle2 } from "lucide-react";

interface HeroProps {
  onScheduleClick: () => void;
}

export default function Hero({ onScheduleClick }: HeroProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadComplete, setDownloadComplete] = useState(false);

  const startPitchDownload = () => {
    if (downloading || downloadComplete) return;
    setDownloading(true);
    setDownloadProgress(0);

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setDownloading(false);
          setDownloadComplete(true);
          
          // Auto reset after 4 seconds
          setTimeout(() => {
            setDownloadComplete(false);
          }, 4000);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 150);
  };

  return (
    <section className="py-20 md:py-32 flex flex-col items-center justify-center text-center min-h-[85vh] relative px-4" id="hero-section">
      <div className="absolute inset-0 bg-neural-pattern opacity-30 pointer-events-none z-0"></div>
      
      {/* Absolute top glowing ambient elements */}
      <div className="w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px] absolute top-10 pointer-events-none -z-10 animate-pulse"></div>
      
      <div className="font-mono text-xs md:text-sm text-primary mb-6 uppercase tracking-[0.3em] font-bold z-10">
        NENIFIX BRAND ENGINEERING • INVESTOR PORTFOLIO
      </div>
      
      {/* Giant Main Title matching mockup typography precisely */}
      <h1 
        className="font-display text-4xl sm:text-6xl md:text-8xl text-white mb-8 max-w-5xl glow-primary rounded-[2.5rem] p-6 mix-blend-screen leading-tight font-black tracking-tight cursor-default select-none z-10"
        id="hero-title"
      >
        The Journey from Craft to <br className="hidden md:inline" />
        <span className="text-primary hover:text-white transition-colors duration-500 drop-shadow-[0_4px_12px_rgba(99,102,241,0.4)]">
          Cognitive Intelligence
        </span>
      </h1>
      
      <p className="font-sans text-lg md:text-xl max-w-3xl mb-12 text-white/70 leading-relaxed font-light z-10">
        How the world's first AI Brand Engineering company leverages deep physical roots, custom software development, and robotics to build the hybrid workforces of tomorrow.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-6 z-10 max-w-lg w-full justify-center">
        <button
          onClick={onScheduleClick}
          className="bg-primary text-white font-mono text-xs tracking-widest px-8 py-4 rounded-full pulse-glow uppercase font-bold hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_20px_rgba(99,102,241,0.4)] flex items-center justify-center gap-2 cursor-pointer"
          id="hero-meeting-btn"
        >
          <Rocket className="w-4 h-4" />
          Schedule Investor Meeting
        </button>
        
        <button
          onClick={startPitchDownload}
          disabled={downloading}
          className="border border-white/10 bg-white/5 text-white hover:bg-white hover:text-black font-mono text-xs tracking-widest px-8 py-4 rounded-full uppercase font-bold hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
          id="hero-deck-btn"
        >
          {downloadComplete ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Prospectus Compiled!
            </>
          ) : downloading ? (
            <div className="flex items-center gap-2">
              <span className="animate-spin text-primary inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full"></span>
              Compiling {Math.min(downloadProgress, 100)}%
            </div>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Download Pitch Deck
            </>
          )}
        </button>
      </div>

      {/* Miniature Terminal feedback showing investor package assembly */}
      {downloading && (
        <div className="mt-8 p-6 bg-bg-card border border-white/5 rounded-[1.5rem] max-w-md w-full text-left font-mono text-[10px] text-primary/80 animate-fadeIn z-10 shadow-2xl">
          <div className="flex items-center gap-2 text-primary border-b border-white/5 pb-1.5 mb-2">
            <Terminal className="w-3.5 h-3.5" />
            <span>NeniFix Secure Package Assembler</span>
          </div>
          <div className="space-y-1">
            <p className="text-white/40">&gt; Authenticating credentials...</p>
            {downloadProgress > 20 && <p className="text-emerald-400">&gt; Connection verified: safe_tunnel_v12</p>}
            {downloadProgress > 50 && <p className="text-white/60">&gt; Packaging SEC-9 investor blueprints & active capitalization tables...</p>}
            {downloadProgress > 80 && <p className="text-white/60">&gt; Injecting workforce modeling simulation weights...</p>}
            <p className="animate-pulse text-primary">&gt; Compiling vector PDFs... {downloadProgress}%</p>
          </div>
        </div>
      )}
    </section>
  );
}
