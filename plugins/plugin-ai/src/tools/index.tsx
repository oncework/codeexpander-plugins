import React from "react";
import Tokenizer from "./Tokenizer";

export interface ToolDef {
  id: string;
  name: string;
  component: React.ComponentType;
}

export const TOOLS: ToolDef[] = [
  { id: "tokenizer", name: "Tokenizer", component: Tokenizer },
];
