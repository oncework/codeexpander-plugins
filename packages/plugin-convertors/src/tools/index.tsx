import type React from "react";
import DateTimeConverter from "./DateTimeConverter";
import IntegerBaseConverter from "./IntegerBaseConverter";
import RomanNumeralConverter from "./RomanNumeralConverter";
import Base64StringEncoder from "./Base64StringEncoder";
import ColorConverter from "./ColorConverter";
import TextToNatoAlphabet from "./TextToNatoAlphabet";
import TextToAsciiBinary from "./TextToAsciiBinary";
import TextToUnicode from "./TextToUnicode";
import YamlToJsonConverter from "./YamlToJsonConverter";
import YamlToToml from "./YamlToToml";
import JsonToYamlConverter from "./JsonToYamlConverter";
import JsonToTomlConverter from "./JsonToTomlConverter";
import ListConverter from "./ListConverter";
import TomlToJsonConverter from "./TomlToJsonConverter";
import TomlToYamlConverter from "./TomlToYamlConverter";
import XmlToJsonConverter from "./XmlToJsonConverter";
import JsonToXmlConverter from "./JsonToXmlConverter";
import MarkdownToHtmlConverter from "./MarkdownToHtmlConverter";
import TemperatureConverter from "./TemperatureConverter";

export interface ToolDef {
  id: string;
  name: string;
  component: React.ComponentType;
}

export const TOOLS: ToolDef[] = [
  { id: "date-time-converter", name: "Date-time Converter", component: DateTimeConverter },
  { id: "integer-base-converter", name: "Integer Base Converter", component: IntegerBaseConverter },
  { id: "roman-numeral-converter", name: "Roman Numeral Converter", component: RomanNumeralConverter },
  { id: "base64-string-encoder", name: "Base64 String Encoder/Decoder", component: Base64StringEncoder },
  { id: "color-converter", name: "Color Converter", component: ColorConverter },
  { id: "text-to-nato-alphabet", name: "Text to NATO Alphabet", component: TextToNatoAlphabet },
  { id: "text-to-ascii-binary", name: "Text to ASCII Binary", component: TextToAsciiBinary },
  { id: "text-to-unicode", name: "Text to Unicode", component: TextToUnicode },
  { id: "yaml-to-json-converter", name: "YAML to JSON Converter", component: YamlToJsonConverter },
  { id: "yaml-to-toml", name: "YAML to TOML", component: YamlToToml },
  { id: "json-to-yaml-converter", name: "JSON to YAML Converter", component: JsonToYamlConverter },
  { id: "json-to-toml-converter", name: "JSON to TOML", component: JsonToTomlConverter },
  { id: "list-converter", name: "List Converter", component: ListConverter },
  { id: "toml-to-json-converter", name: "TOML to JSON", component: TomlToJsonConverter },
  { id: "toml-to-yaml-converter", name: "TOML to YAML", component: TomlToYamlConverter },
  { id: "xml-to-json-converter", name: "XML to JSON", component: XmlToJsonConverter },
  { id: "json-to-xml-converter", name: "JSON to XML", component: JsonToXmlConverter },
  { id: "markdown-to-html-converter", name: "Markdown to HTML", component: MarkdownToHtmlConverter },
  { id: "temperature-converter", name: "Temperature Converter", component: TemperatureConverter },
];
