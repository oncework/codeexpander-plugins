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

const xmlToJson = (xmlString: string): Record<string, unknown> => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");
  const parseError = xmlDoc.querySelector("parsererror");
  if (parseError) throw new Error("Invalid XML format");

  const convertNode = (node: Node): unknown => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      return text ?? undefined;
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      const result: Record<string, unknown> = {};
      if (element.attributes.length > 0) {
        result["@attributes"] = {};
        for (let i = 0; i < element.attributes.length; i++) {
          const attr = element.attributes[i];
          (result["@attributes"] as Record<string, string>)[attr.name] = attr.value;
        }
      }
      const children = Array.from(element.childNodes);
      const textContent = children
        .filter((child) => child.nodeType === Node.TEXT_NODE)
        .map((child) => child.textContent?.trim())
        .filter((text): text is string => Boolean(text))
        .join("");
      const elementChildren = children.filter((child) => child.nodeType === Node.ELEMENT_NODE);
      if (elementChildren.length === 0) {
        if (textContent) {
          if (Object.keys(result).length === 0) return textContent;
          result["#text"] = textContent;
        }
      } else {
        const childGroups: Record<string, unknown[]> = {};
        elementChildren.forEach((child) => {
          const childElement = child as Element;
          const childName = childElement.tagName;
          const childValue = convertNode(child);
          if (!childGroups[childName]) childGroups[childName] = [];
          childGroups[childName].push(childValue);
        });
        Object.keys(childGroups).forEach((key) => {
          result[key] =
            childGroups[key].length === 1 ? childGroups[key][0] : childGroups[key];
        });
        if (textContent) result["#text"] = textContent;
      }
      return result;
    }
    return undefined;
  };

  const rootElement = xmlDoc.documentElement;
  if (!rootElement) throw new Error("No root element found");
  return { [rootElement.tagName]: convertNode(rootElement) };
};

const XmlToJsonConverter = () => {
  const { t } = useI18n();
  const [xmlInput, setXmlInput] = useState("");
  const [jsonOutput, setJsonOutput] = useState("");

  const convertToJson = () => {
    try {
      if (!xmlInput.trim()) {
        showErrorToast(t("common.error"), t("xmlToJsonConverter.errorEnter"));
        return;
      }
      const parsed = xmlToJson(xmlInput);
      setJsonOutput(JSON.stringify(parsed, null, 2));
      showToast(t("xmlToJsonConverter.toastSuccess"));
    } catch {
      showErrorToast(t("common.error"), t("xmlToJsonConverter.errorInvalid"));
    }
  };

  const copyToClipboardHandler = () => {
    copyToClipboard(jsonOutput, t("common.copied"));
  };

  const downloadFile = () => {
    const blob = new Blob([jsonOutput], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "converted.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setXmlInput("");
    setJsonOutput("");
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Code2 className="h-5 w-5" />
            <CardTitle>{t("xmlToJsonConverter.title")}</CardTitle>
          </div>
          <CardDescription>{t("xmlToJsonConverter.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="xml-input">XML Input</Label>
              <Textarea
                id="xml-input"
                value={xmlInput}
                onChange={(e) => setXmlInput(e.target.value)}
                placeholder={'<?xml version="1.0"?>\n<root>\n  <name>John Doe</name>\n  <age>30</age>\n  <city>New York</city>\n</root>'}
                className="min-h-[300px] font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>JSON Output</Label>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyToClipboardHandler}
                    disabled={!jsonOutput}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={downloadFile}
                    disabled={!jsonOutput}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Textarea
                value={jsonOutput}
                readOnly
                className="min-h-[300px] font-mono text-sm"
                placeholder="JSON output will appear here..."
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={convertToJson} className="flex items-center gap-2">
              <Code2 className="h-4 w-4" />
              Convert to JSON
            </Button>
            <Button onClick={clearAll} variant="outline">
              Clear All
            </Button>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
            <div><strong>Tips:</strong></div>
            <div>• Paste valid XML in the input field</div>
            <div>• Attributes are converted to @attributes object</div>
            <div>• Text content is preserved as #text or direct values</div>
            <div>• Use the download button to save the converted JSON file</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default XmlToJsonConverter;
