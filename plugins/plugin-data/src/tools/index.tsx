import JsonFormatter from "./JsonFormatter";
import XmlFormatter from "./XmlFormatter";
import YamlConverter from "./YamlConverter";

export interface ToolDef {
  id: string;
  name: string;
  component: React.ComponentType;
}

export const TOOLS: ToolDef[] = [
  { id: "json-formatter", name: "JSON Formatter", component: JsonFormatter },
  { id: "xml-formatter", name: "XML Formatter", component: XmlFormatter },
  { id: "yaml-converter", name: "YAML Converter", component: YamlConverter },
];
