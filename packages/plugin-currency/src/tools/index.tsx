import RateLookup from "./RateLookup";
import CurrencyConverter from "./CurrencyConverter";

export interface ToolDef {
  id: string;
  name: string;
  component: React.ComponentType;
}

export const TOOLS: ToolDef[] = [
  { id: "rate-lookup", name: "Rate Lookup", component: RateLookup },
  { id: "currency-converter", name: "Currency Converter", component: CurrencyConverter },
];
