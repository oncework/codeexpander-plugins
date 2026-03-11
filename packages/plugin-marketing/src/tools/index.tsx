import WebsiteRankTracker from "./WebsiteRankTracker";

export interface ToolDef { id: string; name: string; component: React.ComponentType; }
export const TOOLS: ToolDef[] = [
  { id: "website-rank-tracker", name: "Website Rank Tracker", component: WebsiteRankTracker },
];
