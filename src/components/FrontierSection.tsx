import React, { useState, useEffect } from "react";
import { Cpu, Users, Award, Zap, Sliders, Layers, TrendingUp, HelpCircle } from "lucide-react";

export default function FrontierSection() {
  // Simulator State Toggles
  const [robotNodes, setRobotNodes] = useState<number>(30);
  const [softwareLicensing, setSoftwareLicensing] = useState<number>(150);
  const [humanSupervisors, setHumanSupervisors] = useState<number>(8);
  const [fundingStage, setFundingStage] = useState<"Seed" | "SeriesA" | "SeriesB" | "Growth">("SeriesA");

  // Calculated Outputs
  const [dailyCapacity, setDailyCapacity] = useState<number>(0);
  const [humanLeverageFactor, setHumanLeverageFactor] = useState<number>(0);
  const [estimatedCostDaily, setEstimatedCostDaily] = useState<number>(0);
  const [traditionalAgencyCostDaily, setTraditionalAgencyCostDaily] = useState<number>(0);
  const [savingMultipliers, setSavingMultipliers] = useState<number>(0);

  // Re-run calculations in real-time
  useEffect(() => {
    // 1 Robotic Node = 1250 operations (packing/sorting) per day
    // 1 Software License = 350 automatic branding/collateral assets per day
    const capacity = (robotNodes * 1250) + (softwareLicensing * 350);
    setDailyCapacity(capacity);

    // Human Leverage Factor = ops per supervisor
    const leverage = Math.floor(capacity / Math.max(humanSupervisors, 1));
    setHumanLeverageFactor(leverage);

    // NeniFix Operational Costs:
    // Robotics Node cost: $35/day energy & maint
    // Software License fee: $4/day API/cloud compute
    // Human supervisor average cost: $350/day
    const ourCost = (robotNodes * 35) + (softwareLicensing * 4) + (humanSupervisors * 350);
    setEstimatedCostDaily(ourCost);

    // Traditional agency outputs require heavy, slow human workflows:
    // To match Phase 1 structural layout print assets and Phase 2 full-stack portals,
    // they require 5-10x the raw labor force. Estimated agency daily bill is roughly $0.18 per equivalent unit of brand capacity.
    const traditionalCost = capacity * 0.19;
    setTraditionalAgencyCostDaily(traditionalCost);

    const saving = traditionalCost / Math.max(ourCost, 1);
    setSavingMultipliers(parseFloat(saving.toFixed(1)));
  }, [robotNodes, softwareLicensing, humanSupervisors]);

  return (
    <section className="py-20" id="frontier">
      <div className="font-mono text-xs text-primary mb-4 tracking-widest uppercase opacity-70">
        02 — THE COGNITIVE FRONTIER
      </div>
      
      <h2 className="font-display text-4xl sm:text-6xl md:text-7xl text-white mb-6 font-black leading-none tracking-tight">
        Hybrid Workforce <br />
        <span className="text-white hover:text-primary transition-colors duration-300">
          Labor Simulator
        </span>
      </h2>

      <p className="font-sans text-sm md:text-base text-white/70 max-w-3xl mb-12 leading-relaxed">
        Toggle our actual and projected logistics telemetry. See how integrating physical brand robotics with cognitive full-stack applications enables NeniFix to run massive campaigns with unheard-of operational leverage.
      </p>

      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Left Side: Interactive Toggles & Controls */}
        <div className="lg:col-span-6 bg-[#141416] border border-white/5 p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <Sliders className="w-5 h-5 text-primary/30" />
          </div>
          
          <h3 className="font-display text-xl text-white mb-6 font-bold flex items-center gap-2">
            <Cpu className="w-5 h-5 text-primary animate-pulse" />
            <span>Operational Weights</span>
          </h3>

          <div className="space-y-6">
            
            {/* Robot Nodes Slider */}
            <div>
              <div className="flex justify-between items-center mb-2 font-mono text-xs">
                <span className="text-white/80 font-bold">Physical Robotic Nodes:</span>
                <span className="text-primary font-bold">{robotNodes} Nodes</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="100" 
                value={robotNodes} 
                onChange={(e) => setRobotNodes(parseInt(e.target.value))}
                className="w-full accent-primary bg-white/5 h-2 rounded-full cursor-pointer"
              />
              <p className="text-[10px] text-white/40 font-mono mt-1">Autonomous hardware handlers producing structural layouts & custom heavy packing.</p>
            </div>

            {/* Software Licensing Slider */}
            <div>
              <div className="flex justify-between items-center mb-2 font-mono text-xs">
                <span className="text-white/80 font-bold">Cognitive Core Software Licenses:</span>
                <span className="text-primary font-bold">{softwareLicensing} Active Streams</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="500" 
                value={softwareLicensing} 
                onChange={(e) => setSoftwareLicensing(parseInt(e.target.value))}
                className="w-full accent-primary bg-white/5 h-2 rounded-full cursor-pointer"
              />
              <p className="text-[10px] text-white/40 font-mono mt-1">AI agentic services designing vectors, layouts, and compiling codebases concurrently.</p>
            </div>

            {/* Human Supervisors Slider */}
            <div>
              <div className="flex justify-between items-center mb-2 font-mono text-xs">
                <span className="text-white/80 font-bold">Human Brand Overseers:</span>
                <span className="text-primary font-bold">{humanSupervisors} Generalists</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="50" 
                value={humanSupervisors} 
                onChange={(e) => setHumanSupervisors(parseInt(e.target.value))}
                className="w-full accent-primary bg-white/5 h-2 rounded-full cursor-pointer"
              />
              <p className="text-[10px] text-white/40 font-mono mt-1">Elite visual generalists supervising output quality & strategic configurations.</p>
            </div>

            {/* Phase Stage Selector */}
            <div>
              <label className="block text-xs font-mono text-white/60 mb-2 font-bold uppercase">Target Investment Horizon:</label>
              <div className="grid grid-cols-4 gap-2 font-mono text-xs">
                {["Seed", "SeriesA", "SeriesB", "Growth"].map((stage) => (
                  <button
                    key={stage}
                    onClick={() => setFundingStage(stage as any)}
                    className={`py-2 px-1 rounded-full cursor-pointer text-center font-bold uppercase border transition-all ${
                      fundingStage === stage 
                        ? "bg-primary text-white border-primary font-black" 
                        : "bg-transparent text-white/60 border-white/10 hover:border-white/20"
                    }`}
                  >
                    {stage === "SeriesA" ? "Series A" : stage === "SeriesB" ? "Series B" : stage}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: Real-time Telemetry Calculations */}
        <div className="lg:col-span-6 flex flex-col justify-between gap-6">
          
          {/* Capacity Metrics */}
          <div className="bg-[#141416] border border-white/5 p-8 rounded-[2rem] text-left relative overflow-hidden flex-1 flex flex-col justify-between">
            <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-primary/10 rounded-full blur-[80px] pointer-events-none"></div>
            
            <div>
              <div className="font-mono text-xs text-primary mb-2 tracking-wider flex items-center gap-1.5 uppercase font-bold">
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Real-Time Scaling Efficiency</span>
              </div>
              
              <div className="flex items-baseline mt-2 mb-2">
                <div className="text-4xl md:text-5xl font-display font-black text-white tracking-widest">{dailyCapacity.toLocaleString()}</div>
                <span className="text-xs font-mono text-primary font-bold ml-2">OPS / DAY</span>
              </div>
              
              <p className="text-xs text-white/75 font-sans leading-relaxed mb-6">
                Total simulated logistics output combining physical sorting runs, board structural models, and live UI codebase compilations.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
              <div>
                <div className="text-[10px] font-mono text-white/40 uppercase">HUMAN LEVERAGE</div>
                <div className="text-base font-display font-bold text-white mt-1">
                  ~{humanLeverageFactor.toLocaleString()} <span className="text-[10px] text-primary">u/Supervisor</span>
                </div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-white/40 uppercase">CAPACITY MULTIPLIER</div>
                <div className="text-base font-display font-bold text-emerald-400 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{savingMultipliers}x Agency</span>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Projection Dashboard */}
          <div className="bg-[#141416] border border-white/5 p-8 rounded-[2rem] text-left relative flex-1 flex flex-col justify-between shadow-xl">
            <h4 className="font-mono text-xs text-white uppercase mb-4 tracking-wider flex items-center gap-2 font-bold">
              <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
              <span>Projected Cost Efficiency Metrics</span>
            </h4>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-xs font-sans text-white/70">Projected Daily Operating Burn:</span>
                <span className="font-mono text-sm text-white font-semibold">${estimatedCostDaily.toLocaleString()} / day</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-xs font-sans text-white/70">Equivalent Traditional Agency Billing:</span>
                <span className="font-mono text-sm text-white/40 hover:text-white transition-colors">${Math.floor(traditionalAgencyCostDaily).toLocaleString()} / day</span>
              </div>
              <div className="flex justify-between items-center py-2 text-emerald-400 font-bold">
                <span className="text-xs font-sans">Simulated Daily Cost Savings:</span>
                <span className="font-mono text-base">${Math.floor(traditionalAgencyCostDaily - estimatedCostDaily).toLocaleString()} / day</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-white/5 border border-white/5 rounded-xl text-[11px] text-white/60 font-mono leading-relaxed">
              *With a <strong>{fundingStage}</strong> investment deployment, these metrics scale by {(fundingStage === "Seed" ? 1.2 : fundingStage === "SeriesA" ? 2.5 : fundingStage === "SeriesB" ? 5.2 : 11.0).toFixed(1)}x based on accelerated physical robotics deployment pipelines.
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
