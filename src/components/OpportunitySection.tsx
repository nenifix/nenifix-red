import React, { useState } from "react";
import { TrendingUp, Percent, Award, Shield, Cpu, Activity } from "lucide-react";

export default function OpportunitySection() {
  const [marketShare, setMarketShare] = useState<number>(0.25); // Default 0.25% market share

  // Calculating projections
  // 4800 billion total target market
  const addressableMarket = 4800 * (marketShare / 100); 
  // licensing revenues at 10% software fee
  const licensingRevenue = addressableMarket * 0.15; 

  return (
    <section className="py-20" id="opportunity">
      <div className="font-mono text-xs text-primary mb-4 tracking-widest uppercase opacity-70">
        04 — MARKET OPPORTUNITY
      </div>
      
      <h2 className="font-display text-4xl sm:text-6xl md:text-7xl text-white mb-12 font-black leading-none tracking-tight">
        A <span className="text-secondary glow-cyan-text font-mono">Trillion-Dollar</span> <br />
        Transformation
      </h2>

      {/* Grid of 3 metrics matching the mockup precisely! */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {/* Metric 1 */}
        <div className="bg-[#141416] border border-white/5 p-10 rounded-[2rem] text-center hover:-translate-y-2 hover:border-white/20 transition-all duration-300 shadow-[0_8px_30px_rgba(99,102,241,0.05)] group">
          <div className="font-display text-6xl md:text-7xl text-secondary glow-cyan-text font-black mb-4 group-hover:scale-105 transition-transform duration-300">
            $4.8T
          </div>
          <div className="font-mono text-xs text-white/80 mb-2 tracking-widest uppercase font-bold">Global AI Market</div>
          <div className="font-sans text-sm text-[#BDBDBD]/60">By 2033 — 25x expansion from baseline</div>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#141416] border border-white/5 p-10 rounded-[2rem] text-center hover:-translate-y-2 hover:border-white/20 transition-all duration-300 shadow-[0_8px_30px_rgba(99,102,241,0.05)] group">
          <div className="font-display text-6xl md:text-7xl text-secondary glow-cyan-text font-black mb-4 group-hover:scale-105 transition-transform duration-300">
            32%
          </div>
          <div className="font-mono text-xs text-white/80 mb-2 tracking-widest uppercase font-bold">AI Robotics CAGR</div>
          <div className="font-sans text-sm text-[#BDBDBD]/60">Average through 2033</div>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#141416] border border-white/5 p-10 rounded-[2rem] text-center hover:-translate-y-2 hover:border-white/20 transition-all duration-300 shadow-[0_8px_30px_rgba(99,102,241,0.05)] group">
          <div className="font-display text-6xl md:text-7xl text-secondary glow-cyan-text font-black mb-4 group-hover:scale-105 transition-transform duration-300">
            75%
          </div>
          <div className="font-mono text-xs text-white/80 mb-2 tracking-widest uppercase font-bold">Knowledge Workers</div>
          <div className="font-sans text-sm text-[#BDBDBD]/60">Already using AI in active setups</div>
        </div>
      </div>

      {/* Interactive Capital Modeling Dashboard */}
      <div className="bg-[#141416] border border-white/5 p-8 rounded-[2rem] shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <Activity className="w-5 h-5 text-secondary animate-pulse" />
          <h3 className="font-display text-lg text-white font-bold">NeniFix Strategic Capture Modeling</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex justify-between items-center mb-2 font-mono text-xs">
              <span className="text-[#BDBDBD]">Target Addressable Market capture:</span>
              <span className="text-secondary font-black">{marketShare.toFixed(2)} %</span>
            </div>
            
            <input 
              type="range" 
              min="0.05" 
              max="2.0" 
              step="0.05"
              value={marketShare} 
              onChange={(e) => setMarketShare(parseFloat(e.target.value))}
              className="w-full accent-secondary bg-white/5 h-2 rounded-full cursor-pointer mb-4"
            />
            
            <p className="font-sans text-xs text-[#BDBDBD]/60 leading-relaxed font-light">
              Based on the $4.8T global market scale, capture indicates the proportion of industrial branding contracts, hardware nodes, and agent orchestration routing handled by NeniFix software licensing.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-secondary/5 border border-secondary/20 rounded-[1.5rem]">
              <span className="text-[10px] font-mono text-[#BDBDBD]/60 uppercase block mb-1">PROPORTIONAL SYSTEM ADOPTION</span>
              <span className="text-xl md:text-2xl font-display font-black text-white">$ {addressableMarket.toFixed(2)} B</span>
              <span className="text-[9px] font-mono text-secondary block mt-1">Enterprise scale handled</span>
            </div>

            <div className="p-6 bg-primary/5 border border-primary/20 rounded-[1.5rem]">
              <span className="text-[10px] font-mono text-[#BDBDBD]/60 uppercase block mb-1">NENIFIX LICENSING EBIT TARGET</span>
              <span className="text-xl md:text-2xl font-display font-black text-primary">$ {licensingRevenue.toFixed(3)} B</span>
              <span className="text-[9px] font-mono text-primary block mt-1">Simulated software royalty</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
