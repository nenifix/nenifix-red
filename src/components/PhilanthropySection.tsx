import React, { useState } from "react";
import { Sprout, GraduationCap, Heart, HelpCircle, BarChart2, ShieldAlert } from "lucide-react";

export default function PhilanthropySection() {
  const [allocation, setAllocation] = useState<number>(50); // 50 means 50/50 AgTech/STEM

  // Output calculations on simulated $500,000 allocation
  const totalFund = 500000;
  const agtechShare = totalFund * (allocation / 100);
  const stemShare = totalFund * ((100 - allocation) / 100);

  // 1 dollar of AgTech fund = 0.05 sq ft automated vertical farming built and 0.2 lbs vegetables/year produced
  const verticalFarmArea = agtechShare * 0.05;
  const yearlyCropsWeight = agtechShare * 0.35;

  // 1 dollar of STEM fund = 0.01 robotics learning kits provided and 0.4 human student-hours of ML coding labs
  const roboticKits = Math.floor(stemShare * 0.008);
  const codingLabHours = Math.floor(stemShare * 0.5);

  return (
    <section className="py-20" id="philanthropy">
      <div className="font-mono text-xs text-primary mb-4 tracking-widest uppercase opacity-70">
        05 — COGNITIVE RESPONSIBILITY & PHILANTHROPY
      </div>
      
      <h2 className="font-display text-4xl sm:text-6xl md:text-7xl text-white mb-6 font-black leading-none tracking-tight">
        The Dual Programmatic <br />
        <span className="text-primary hover:text-white transition-colors duration-300">
          Corporate Moat
        </span>
      </h2>

      <p className="font-sans text-sm md:text-base text-white/70 max-w-3xl mb-12 leading-relaxed">
        We channel exactly <strong>10% of licensing fees</strong> and engineering margins into precision automatic agriculture and youth robotic programs. Ensuring that as NeniFix scales, digital leverage drives tangible social stewardship.
      </p>

      {/* Programmatic Grid cards */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* AgTech Card */}
        <div className="bg-[#141416] border border-white/5 p-8 rounded-[2rem] relative overflow-hidden flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex justify-between items-center mb-6">
              <span className="font-mono text-xs text-primary tracking-widest uppercase font-bold">PILLAR A</span>
              <Sprout className="w-6 h-6 text-emerald-400 animate-pulse" />
            </div>
            
            <h3 className="font-display text-2xl text-white font-bold mb-4">The AgTech Autonomous Fund</h3>
            <p className="font-sans text-sm text-[#BDBDBD] leading-relaxed mb-6">
              Empowering fully automated vertical agriculture nodes. Under NeniFix software choreography, high-density seeding columns provide high-yield food channels directly in urban centers with zero chemical footprint.
            </p>
          </div>
          
          <div className="border-t border-white/5 pt-4 font-mono text-[11px] text-white/40">
            Targeting 10,000 sq ft urban grow-walls under active software management by Q4 2027.
          </div>
        </div>

        {/* STEM Card */}
        <div className="bg-[#141416] border border-white/5 p-8 rounded-[2rem] relative overflow-hidden flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex justify-between items-center mb-6">
              <span className="font-mono text-xs text-primary tracking-widest uppercase font-bold">PILLAR B</span>
              <GraduationCap className="w-6 h-6 text-indigo-400 select-all" />
            </div>
            
            <h3 className="font-display text-2xl text-white font-bold mb-4">STEM Robotics Endowment</h3>
            <p className="font-sans text-sm text-[#BDBDBD] leading-relaxed mb-6">
              Democratizing expert skills. Establishing physical ML lab assets and advanced robotic development kits in public schools, directly building the labor pipelines that will direct tomorrow's hybrid software systems.
            </p>
          </div>
          
          <div className="border-t border-white/5 pt-4 font-mono text-[11px] text-white/40">
            Over 15,000 students trained concurrently across our school nodes to date.
          </div>
        </div>
      </div>

      {/* Interactive Proportional Allocator */}
      <div className="bg-[#141416] border border-white/5 p-8 rounded-[2rem] text-left relative overflow-hidden shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <Heart className="w-5 h-5 text-primary animate-pulse" />
          <h3 className="font-display text-white font-bold">Simulated $500k Licensing Grant Allocation</h3>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-center">
          
          {/* Allocation Slider Column */}
          <div className="lg:col-span-4">
            <div className="flex justify-between font-mono text-xs mb-2">
              <span className="text-emerald-400 font-bold">AgTech: {allocation}%</span>
              <span className="text-indigo-400 font-bold">STEM: {100 - allocation}%</span>
            </div>
            
            <input 
              type="range" 
              min="10" 
              max="90" 
              value={allocation} 
              onChange={(e) => setAllocation(parseInt(e.target.value))}
              className="w-full accent-primary bg-white/5 h-2 rounded-full cursor-pointer mb-4"
            />
            
            <p className="font-sans text-xs text-[#BDBDBD]/60 leading-relaxed">
              Drag the allocator button to visualize how physical resource deployment is transformed directly into social metrics within NeniFix coordinates.
            </p>
          </div>

          {/* Allocation Results Column */}
          <div className="lg:col-span-8 grid sm:grid-cols-2 gap-4">
            
            {/* AgTech outcomes */}
            <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-[1.5rem]">
              <div className="text-[10px] font-mono text-emerald-400 uppercase font-black">PILLAR A OUTCOMES (${agtechShare.toLocaleString()})</div>
              
              <div className="mt-4 space-y-2">
                <div>
                  <span className="text-lg md:text-xl font-display font-bold text-white block">+{Math.floor(verticalFarmArea).toLocaleString()} sq ft</span>
                  <span className="text-[9px] font-mono text-white/40">Precision urban grow space</span>
                </div>
                <div>
                  <span className="text-lg md:text-xl font-display font-bold text-white block">+{Math.floor(yearlyCropsWeight).toLocaleString()} lbs / Year</span>
                  <span className="text-[9px] font-mono text-white/40">Vertical farm crop yield outputs</span>
                </div>
              </div>
            </div>

            {/* STEM outcomes */}
            <div className="p-6 bg-indigo-500/5 border border-indigo-500/20 rounded-[1.5rem]">
              <div className="text-[10px] font-mono text-indigo-400 uppercase font-black">PILLAR B OUTCOMES (${stemShare.toLocaleString()})</div>
              
              <div className="mt-4 space-y-2">
                <div>
                  <span className="text-lg md:text-xl font-display font-bold text-white block">+{roboticKits.toLocaleString()} Kits</span>
                  <span className="text-[9px] font-mono text-white/40">Robotics kits deployed in public labs</span>
                </div>
                <div>
                  <span className="text-lg md:text-xl font-display font-bold text-white block">+{codingLabHours.toLocaleString()} Hours</span>
                  <span className="text-[9px] font-mono text-white/40">Active student ML training hours</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
