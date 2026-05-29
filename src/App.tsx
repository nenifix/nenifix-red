import React, { useState } from "react";
import { motion } from "motion/react";
import { ActiveSection } from "./types";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import StorySection from "./components/StorySection";
import FrontierSection from "./components/FrontierSection";
import CapabilitiesSection from "./components/CapabilitiesSection";
import OpportunitySection from "./components/OpportunitySection";
import PhilanthropySection from "./components/PhilanthropySection";
import InvestorsConsole from "./components/InvestorsConsole";
import Footer from "./components/Footer";

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveSection>("story");

  const scrollToSection = (id: ActiveSection) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="bg-[#131313] text-[#BDBDBD] font-sans antialiased relative min-h-screen overflow-x-hidden selection:bg-primary selection:text-[#131313]">
      {/* Global Neural Background Pattern matching style guide */}
      <div className="fixed inset-0 bg-neural-pattern pointer-events-none z-0 opacity-40"></div>

      {/* Floating Vertical Blueprint Watermark matching mockup exactly */}
      <div 
        className="fixed top-1/2 -left-[280px] -rotate-90 transform origin-center font-display text-[11px] tracking-[1.2rem] opacity-25 z-0 font-extrabold uppercase pointer-events-none leading-none select-none text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#e4bdc2] to-[#757575] hidden xl:block"
        id="vertical-watermark"
      >
        NENIFIX BRAND ENGINEERING
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex flex-col justify-between min-h-screen">
        <div>
          {/* Header Navigation */}
          <Navbar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            onScheduleClick={() => scrollToSection("investors")}
          />

          <main className="max-w-[1280px] mx-auto px-6 md:px-12 pb-20 space-y-4">
            
            {/* Cinematic Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Hero onScheduleClick={() => scrollToSection("investors")} />
            </motion.div>

            <div className="section-divider"></div>

            {/* Our Story Timeline */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <StorySection />
            </motion.div>

            <div className="section-divider"></div>

            {/* The Cognitive Frontier / Workforce Simulator */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <FrontierSection />
            </motion.div>

            <div className="section-divider"></div>

            {/* Capabilities Matrix Section */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <CapabilitiesSection />
            </motion.div>

            <div className="section-divider"></div>

            {/* Market Opportunity Analytics */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <OpportunitySection />
            </motion.div>

            <div className="section-divider"></div>

            {/* Philanthropic Programmatic Moat */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <PhilanthropySection />
            </motion.div>

            <div className="section-divider"></div>

            {/* Strategic Investor Roundtable & CC-9 Console */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <InvestorsConsole />
            </motion.div>

          </main>
        </div>

        {/* Polished Cinematic Footer */}
        <Footer setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}
