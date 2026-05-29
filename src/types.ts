export interface Message {
  role: "user" | "assistant";
  message: string;
}

export interface Meeting {
  id: string;
  name: string;
  email: string;
  date: string;
  time: string;
  profile: string;
  ticketSize: string;
  status: string;
}

export interface SimulationConfig {
  robotNodes: number;      // Toggled 1 to 100
  softwareLicensingCount: number; // Toggled 10 to 500
  humanSupervisorCount: number;   // Toggled 2 to 50
  fundingStage: "Seed" | "SeriesA" | "SeriesB" | "Growth";
}

export type ActiveSection = "story" | "frontier" | "capabilities" | "philanthropy" | "investors";
