import React, { useState } from "react";
import { Hammer, Code, Server, HelpCircle, HardDrive, Monitor, CheckCircle2, RefreshCw } from "lucide-react";

type CapabilityKey = "tactile" | "architectures" | "automation";

export default function CapabilitiesSection() {
  const [activeCap, setActiveCap] = useState<CapabilityKey>("tactile");

  const categories = [
    { id: "tactile", label: "01 / TACTILE MODELING", icon: Hammer },
    { id: "architectures", label: "02 / ECOSYSTEM PLATFORMS", icon: Code },
    { id: "automation", label: "03 / FLOTILLA COGNITION", icon: Server },
  ];

  const content = {
    tactile: {
      headline: "Absolute Physical Precision",
      subhead: "Where physical craft meets state-of-the-art materials engineering.",
      bullets: [
        "Rigid cardboard and heavyweight board packaging mockups matching Pantone 803C coordinates",
        "Laser engraved custom timber and metallic logo configurations for immersive branding setups",
        "Industrial high-friction print finishes tailored for extreme distribution safety scales",
        "Optimized layout specifications configured for high-throughput fulfillment line runs"
      ],
      specValue: "Pantone 803C Ultra-Precision",
      lever: "+420% Physical Trust Value"
    },
    architectures: {
      headline: "Multi-Engine High-Throughput Portals",
      subhead: "Compiles secure, responsive dashboards to manage fleet flows with zero friction.",
      bullets: [
        "Highly optimized React layouts with sub-second navigation response models",
        "Encrypted containerized API endpoints executing asynchronous batch database updates",
        "Offline-resilient operational frameworks tracking remote driver vectors in real-time",
        "Stateful custom telemetry nodes capturing active logistics metrics autonomously"
      ],
      specValue: "GraphQL + REST Hybrid Systems",
      lever: "Sub-10ms Server Event Despatch"
    },
    automation: {
      headline: "Symbiotic Robot-Agentic Streams",
      subhead: "Our latest frontier. Deploying robotic fleets and logical agent streams concurrently.",
      bullets: [
        "Robotic arm kinematics models optimized for multi-format box gripping & folding runs",
        "Autonomous sorting algorithms organizing parcels based on dynamic geometric configurations",
        "Generative brand models executing print adjustments in real-time according to box metrics",
        "Coordinated supervisor feedback dashboards tying humans to 100+ active logical models"
      ],
      specValue: "NeniFix Flotilla Core v3.2",
      lever: "75x Operating Scale Leverage Ratio"
    }
  };

  return (
    <section className="py-20" id="capabilities">
      <div className="font-mono text-xs text-primary mb-4 tracking-widest uppercase opacity-70">
        03 — OUR STRATEGIC CAPABILITIES
      </div>
      
      <h2 className="font-display text-4xl sm:text-6xl md:text-7xl text-white mb-12 font-black leading-none tracking-tight">
        Engineered to <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary font-mono">
          Out-Execute the Market
        </span>
      </h2>

      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Toggle List Column */}
        <div className="lg:col-span-4 flex flex-col gap-4 font-mono">
          {categories.map((c) => {
            const Icon = c.icon;
            const isSelected = activeCap === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setActiveCap(c.id as any)}
                className={`flex items-center gap-4 p-5 rounded-full border text-left cursor-pointer transition-all ${
                  isSelected 
                    ? "bg-[#141416] border-primary text-primary shadow-[0_0_15px_rgba(99,102,241,0.15)] font-bold text-xs" 
                    : "bg-transparent border-white/10 text-white/50 text-xs hover:border-white/20 hover:text-white"
                }`}
                id={`cap-tab-${c.id}`}
              >
                <Icon className={`w-5 h-5 ${isSelected ? "text-primary" : "text-white/40"}`} />
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>

        {/* Detailed Spec Viewport Panel */}
        <div className="lg:col-span-8 bg-[#141416] border border-white/5 p-8 rounded-[2rem] relative overflow-hidden flex flex-col justify-between shadow-xl">
          <div className="absolute top-0 right-0 p-6 font-mono text-[9px] text-white/30 tracking-wider uppercase">
            NeniFix Telemetry Core // System Active
          </div>

          <div>
            <span className="font-mono text-[10px] text-primary uppercase font-bold tracking-widest">Active System Deliverable</span>
            <h3 className="font-display text-2xl md:text-3xl text-white mt-2 mb-2 font-bold tracking-tight">{content[activeCap].headline}</h3>
            <p className="font-sans text-sm text-[#e4bdc2]/70 mb-6 font-light">{content[activeCap].subhead}</p>

            <div className="space-y-3 mb-8">
              {content[activeCap].bullets.map((bullet, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span className="text-xs md:text-sm text-[#BDBDBD] font-sans">{bullet}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-6">
            <div>
              <span className="text-[10px] font-mono text-white/40 uppercase">SPECIFICATION CORE</span>
              <div className="text-xs md:text-sm font-mono font-bold text-white mt-1">{content[activeCap].specValue}</div>
            </div>
            <div>
              <span className="text-[10px] font-mono text-white/40 uppercase">OPERATING ADVANTAGE</span>
              <div className="text-xs md:text-sm font-mono font-bold text-primary mt-1">{content[activeCap].lever}</div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
