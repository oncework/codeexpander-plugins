import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Textarea,
  Label,
  Button,
} from "@codeexpander/dev-tools-ui";
import { Copy, Code2, Download } from "lucide-react";
import { useI18n } from "../context";
import { showToast, showErrorToast, copyToClipboard } from "../toast";

const jsonToXml = (obj: Record<string, unknown>, rootName: string = "root"): string => {
  const convertValue = (value: unknown, key: string, indent: number = 0): string => {
    const spaces = "  ".repeat(indent);
    if (value === null || value === undefined) return `${spaces}<${key}></${key}>`;
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      return `${spaces}<${key}>${value}</${key}>`;
    }
    if (Array.isArray(value)) {
      return value.map((item) => convertValue(item, key, indent)).join("\n");
    }
    if (typeof value === "object" && value !== null) {
      const entries = Object.entries(value as Record<string, unknown>);
      if (entries.length === 0) return `${spaces}<${key}></${key}>`;
      const childElements = entries
        .map(([childKey, childValue]) => {
          if (childKey === "@attributes") return "";
          if (childKey === "#text") return String(childValue);
          return convertValue(childValue, childKey, indent + 1);
        })
        .filter((el) => el !== "")
        .join("\n");
      const attrs = (value as Record<string, unknown>)["@attributes"];
      let attributes = "";
      if (attrs && typeof attrs === "object") {
        attributes =
          " " +
          Object.entries(attrs)
            .map(([k, v]) => `${k}="${v}"`)
            .join(" ");
      }
      const textContent = (value as Record<string, unknown>)["#text"];
      if (textContent && !childElements) {
        return `${spaces}<${key}${attributes}>${textContent}</${key}>`;
      }
      if (childElements) {
        return `${spaces}<${key}${attributes}>\n${childElements}\n${spaces}</${key}>`;
      }
      return `${spaces}<${key}${attributes}></${key}>`;
    }
    return `${spaces}<${key}>${value}</${key}>`;
  };
  const entries = Object.entries(obj);
  if (entries.length === 1) {
    const [key, value] = entries[0];
    return `<?xml version="1.0" encoding="UTF-8"?>\n${convertValue(value, key, 0)}`;
  }
  const childElements = entries.map(([key, value]) => convertValue(value, key, 1)).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<${rootName}>\n${childElements}\n</${rootName}>`;
};

const JsonToXmlConverter = () => {
  const { t } = useI18n();
  const [jsonInput, setJsonInput] = useState("");
  const [xmlOutput, setXmlOutput] = useState("");

  const convertToXml = () => {
    try {
      if (!jsonInput.trim()) {
        showErrorToast(t("common.error"), t("jsonToXmlConverter.errorEnter"));
        return;
      }
      const parsed = JSON.parse(jsonInput) as Record<string, unknown>;
      setXmlOutput(jsonToXml(parsed));
      showToast(t("jsonToXmlConverter.toastSuccess"));
    } catch {
      showErrorToast(t("common.error"), t("jsonToXmlConverter.errorInvalid"));
    }
  };

  const copyToClipboardHandler = () => {
    copyToClipboard(xmlOutput, t("common.copied"));
  };

  const downloadFile = () => {
    const blob = new Blob([xmlOutput], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "converted.xml";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setJsonInput("");
    setXmlOutput("");
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Code2 className="h-5 w-5" />
            <CardTitle>{t("jsonToXmlConverter.title")}</CardTitle>
          </div>
          <CardDescription>{t("jsonToXmlConverter.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="json-input">JSON Input</Label>
              <Textarea
                id="json-input"
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='{"name": "John Doe", "age": 30, "city": "New York"}'
                className="min-h-[300px] font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>XML Output</Label>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyToClipboardHandler}
                    disabled={!xmlOutput}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={downloadFile}
                    disabled={!xmlOutput}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Textarea
                value={xmlOutput}
                readOnly
                className="min-h-[300px] font-mono text-sm"
                placeholder="XML output will appear here..."
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={convertToXml} className="flex items-center gap-2">
              <Code2 className="h-4 w-4" />
              Convert to XML
            </Button>
            <Button onClick={clearAll} variant="outline">
              Clear All
            </Button>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
            <div><strong>Tips:</strong></div>
            <div>• Paste valid JSON in the input field</div>
            <div>• Arrays will create multiple elements with the same tag name</div>
            <div>• Special keys: @attributes for XML attributes, #text for text content</div>
            <div>• Use the download button to save the converted XML file</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JsonToXmlConverter;
