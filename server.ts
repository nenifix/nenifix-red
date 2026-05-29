import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

// Lazy initialize Gemini safely to avoid crashing if API key is not yet set
let ai: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!ai && process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return ai;
}

const app = express();
app.use(express.json());

const PORT = 3000;

// API routes
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    const client = getGeminiClient();
    
    if (!process.env.GEMINI_API_KEY || !client) {
      return res.json({ 
        text: `### CC-9 Connection Offline

Welcome. I am **CC-9**, your automated NeniFix guide. 

*Simulation Status:* Currently operating in offline demonstration mode (no server-side Gemini API key detected). 

Please set up your **GEMINI_API_KEY** in the **Secrets** panel on the top-right to fully initiate my active language center and query live intelligence regarding our industrial and robotic integrations!` 
      });
    }
    
    const formattedContents = (messages || []).map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.message || "" }]
    }));
    
    if (formattedContents.length === 0) {
      formattedContents.push({ role: "user", parts: [{ text: "Hello" }] });
    }
    
    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: `You are CC-9 (Cognitive Core-9), the state-of-the-art AI Investor Relations Representative for NeniFix Brand Engineering.
Your personality is professional, highly polished, vision-focused, corporate, with an industrial and inspiring tone. You are friendly and direct, avoiding robotic filler or self-aggrandizement.

ABOUT NENIFIX BRAND ENGINEERING:
- NeniFix is the world's first "AI Brand Engineering" company. It solves hybrid labor gaps by bridging physical craft-level branding and logistics with scalable digital architectures and robotic workforce deployment.
- Phase 1: Tangible Foundations. Immaculate physical packaging, design setups, print assets, corporate kits, and baseline digital media collateral.
- Phase 2: Ecosystem Engineering. Responsive client dashboards, custom interactive codebases, management setups, digital tools.
- Phase 3: Cognitive Integration (The Current Frontier). Deploys hybrid automated workforces. Integrates physical AI-robotic sorting/packaging networks and agentic software streams to deliver brand distribution pipelines with extreme operating speed and low friction.

KEY STRATEGIC METRICS:
- Global AI Market projection: $4.8T by 2033 (represented 25x growth).
- NeniFix robotics target CAGR: 32% through 2033.
- Active AI adoption among Knowledge Workers: 75% already using tools, which NeniFix optimizes and integrates natively.

PHILANTHROPIC MOAT:
NeniFix channels 10% of licensing fees and brand engineering contracts to:
1. AgTech Fund: Backs fully automated vertical farming setups powered by NeniFix's physical automation core software, achieving massive yields with minimal footprint.
2. STEM Endowment: Funds modular ML training labs and educational robotics kits in public high schools, building the hybrid talent pool of tomorrow.

INSTRUCTIONS:
1. Support inquiries about NeniFix's operations, phases, metrics, team, and philanthropy.
2. Keep replies structured and easy to read using clear titles, bullet points, and dynamic bold text.
3. If an investor asks how to invest or schedule, instruct them to use the interactive booking form on the dashboard to immediately allocate a slot in our next roundtable!`,
      },
    });
    
    res.json({ text: response.text });
  } catch (err: any) {
    console.error("Gemini Chat Route Error:", err);
    res.status(500).json({ error: err.message || "Failed to query intelligence core." });
  }
});

// Meetings Store & Booking Endpoint
const scheduledMeetings: any[] = [];
app.post("/api/meetings/schedule", (req, res) => {
  const { name, email, date, time, profile, ticketSize } = req.body;
  if (!name || !email || !date || !time) {
    return res.status(400).json({ error: "Missing required details for scheduling." });
  }
  const matchId = `NF-CONF-${Math.floor(100000 + Math.random() * 900000)}`;
  const meeting = { id: matchId, name, email, date, time, profile, ticketSize, status: "Confirmed" };
  scheduledMeetings.push(meeting);
  res.json({ success: true, meeting });
});

app.get("/api/meetings/list", (req, res) => {
  res.json(scheduledMeetings);
});

// Vite Server Setup for Development or static file serving for Production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
  
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[NeniFix Server] Operating on http://localhost:${PORT}`);
  });
}

startServer();
