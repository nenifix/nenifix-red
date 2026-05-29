import React, { useState } from "react";
import { Package, Shield, Globe, Terminal, ChevronRight, Layers, ArrowRight } from "lucide-react";

export default function StorySection() {
  const [selectedPhase, setSelectedPhase] = useState<1 | 2 | null>(null);

  const phaseDetails = {
    1: {
      title: "Tangible Foundations Core Assets",
      description: "Our physical design and structural execution pipeline operates under extreme raw precision, bridging industrial craft with creative branding setups.",
      deliverables: [
        "Rigid structural prototype packaging (using board and hybrid fabrics)",
        "Precision high-friction multi-texture packaging finishes",
        "Dual-color corporate identity branding & Pantone index configurations",
        "Universal physical layout guidelines & heavy-duty distribution packaging"
      ]
    },
    2: {
      title: "Ecosystem Engineering Architectures",
      description: "Advancing digital platforms into high-performance, containerized realities that synchronize directly with logistic flows.",
      deliverables: [
        "Custom administrative portals with sub-millisecond database updates",
        "High-performance responsive distribution & fulfillment monitors",
        "Offline-resilient mobile operations structures for hybrid fleets",
        "Fully interactive, securely partitioned API endpoints & web applications"
      ]
    }
  };

  return (
    <section className="py-20" id="story">
      <div className="font-mono text-xs text-primary mb-4 tracking-widest uppercase opacity-70">
        01 — OUR STORY
      </div>
      
      <h2 className="font-display text-4xl sm:text-6xl md:text-7xl text-white mb-12 font-black leading-none tracking-tight">
        Physical Execution <br />
        <span className="text-primary/40 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary font-mono">
          Meets Digital Scale
        </span>
      </h2>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Phase 1 Card */}
        <div 
          onClick={() => setSelectedPhase(selectedPhase === 1 ? null : 1)}
          className={`bg-[#141416] p-8 rounded-[2rem] border transition-all duration-300 group relative overflow-hidden cursor-pointer select-none ${
            selectedPhase === 1 
              ? "border-primary shadow-[0_0_25px_rgba(99,102,241,0.2)] ring-1 ring-primary/20" 
              : "border-white/5 hover:border-white/20"
          }`}
          id="phase-1-card"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <div className="flex justify-between items-start mb-4">
            <div className="font-mono text-xs text-primary font-bold tracking-widest">PHASE 1</div>
            <Package className="w-5 h-5 text-primary/50 group-hover:text-primary transition-colors" />
          </div>
          
          <h3 className="font-display text-2xl text-white mb-4 font-bold">Tangible Foundations</h3>
          <p className="font-sans text-sm text-[#BDBDBD] mb-6 leading-relaxed">
            We built ironclad baseline trust by engineering immaculate physical packaging, corporate identity setups, and high-traction digital assets. Design, Print &amp; Multi-Channel Media.
          </p>
          
          <div className="flex items-center gap-2 text-primary text-xs font-mono group-hover:translate-x-1.5 transition-transform duration-300 font-bold">
            <span>{selectedPhase === 1 ? "COLLAPSE SPECIFICATIONS" : "EXPLORE ARCHITECTURAL METRICS"}</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Phase 2 Card */}
        <div 
          onClick={() => setSelectedPhase(selectedPhase === 2 ? null : 2)}
          className={`bg-[#141416] p-8 rounded-[2rem] border transition-all duration-300 group relative overflow-hidden cursor-pointer select-none ${
            selectedPhase === 2 
              ? "border-primary shadow-[0_0_25px_rgba(99,102,241,0.2)] ring-1 ring-primary/20" 
              : "border-white/5 hover:border-white/20"
          }`}
          id="phase-2-card"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <div className="flex justify-between items-start mb-4">
            <div className="font-mono text-xs text-primary font-bold tracking-widest">PHASE 2</div>
            <Globe className="w-5 h-5 text-primary/50 group-hover:text-primary transition-colors" />
          </div>
          
          <h3 className="font-display text-2xl text-white mb-4 font-bold">Ecosystem Engineering</h3>
          <p className="font-sans text-sm text-[#BDBDBD] mb-6 leading-relaxed">
            We advanced client capabilities into interactive computational realities, writing proprietary production codebases, digital tools, and responsive management portals. Full-Stack Web &amp; Application Architecture.
          </p>
          
          <div className="flex items-center gap-2 text-primary text-xs font-mono group-hover:translate-x-1.5 transition-transform duration-300 font-bold">
            <span>{selectedPhase === 2 ? "COLLAPSE SPECIFICATIONS" : "EXPLORE WEB ARCHITECTURES"}</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Dynamic Specification Panel showing Phase details */}
      {selectedPhase && (
        <div className="mb-8 p-8 bg-[#141416]/50 border border-white/5 rounded-[2rem] animate-fadeIn shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 blur-3xl pointer-events-none"></div>
          <div className="flex items-center gap-3 text-primary mb-4 font-mono font-bold text-xs uppercase tracking-wider">
            <Terminal className="w-4 h-4" />
            <span>NeniFix Brand Blueprint: Phase {selectedPhase} Operational Standards</span>
          </div>
          <h4 className="font-display text-lg text-white mb-2 font-bold">{phaseDetails[selectedPhase].title}</h4>
          <p className="font-sans text-sm text-[#e4bdc2]/80 mb-4">{phaseDetails[selectedPhase].description}</p>
          
          <div className="grid sm:grid-cols-2 gap-3 text-xs font-mono">
            {phaseDetails[selectedPhase].deliverables.map((d, index) => (
              <div key={index} className="flex items-center gap-2 hover:text-white transition-colors py-1.5 border-b border-white/5">
                <span className="text-primary font-bold">0{index + 1}.</span>
                <span className="text-text-body">{d}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Central glass-panel quote matching the theme */}
      <div className="glass-panel p-8 md:p-12 rounded-[2rem] text-center relative overflow-hidden transition-all hover:border-white/10 duration-300 shadow-[0_8px_32px_rgba(99,102,241,0.05)] border border-white/5">
        <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none"></div>
        <p className="font-sans text-lg md:text-2xl text-white/90 leading-relaxed relative z-10 max-w-4xl mx-auto">
          Because we understand the complete physical, digital, and media landscape, we didn't just build software tools when the AI revolution hit. <span className="font-black text-primary border-b border-primary/40 pb-0.5 whitespace-nowrap md:whitespace-normal">We became the world's first AI Brand Engineering company.</span>
        </p>
      </div>
    </section>
  );
}
