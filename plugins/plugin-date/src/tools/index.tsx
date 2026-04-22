import EpochConverter from "./EpochConverter";
import CronEditor from "./CronEditor";
import TimezoneLookup from "./TimezoneLookup";

export interface ToolDef {
  id: string;
  name: string;
  component: React.ComponentType;
}

export const TOOLS: ToolDef[] = [
  { id: "epoch-converter", name: "Epoch Converter", component: EpochConverter },
  { id: "cron-editor", name: "Cron Editor", component: CronEditor },
  { id: "timezone-lookup", name: "Timezone Lookup", component: TimezoneLookup },
];
