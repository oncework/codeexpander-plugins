import DemoTool from "./DemoTool";

export interface ToolDef {
  id: string;
  name: string;
  component: React.ComponentType;
}

export const TOOLS: ToolDef[] = [
  { id: "demo", name: "Demo", component: DemoTool },
];
