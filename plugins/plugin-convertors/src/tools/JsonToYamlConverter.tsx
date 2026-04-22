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
import { Copy, FileText, Download } from "lucide-react";
import { useI18n } from "../context";
import { showToast, showErrorToast, copyToClipboard } from "../toast";

const JsonToYamlConverter = () => {
  const { t } = useI18n();
  const [jsonInput, setJsonInput] = useState("");
  const [yamlOutput, setYamlOutput] = useState("");

  const jsonToYaml = (obj: unknown, indent: number = 0): string => {
    const spaces = "  ".repeat(indent);
    if (obj === null) return "null";
    if (typeof obj === "boolean") return String(obj);
    if (typeof obj === "number") return String(obj);
    if (typeof obj === "string") return obj;
    if (Array.isArray(obj)) {
      if (obj.length === 0) return "[]";
      return obj
        .map((item) => `${spaces}- ${jsonToYaml(item, indent + 1).replace(/^\s+/, "")}`)
        .join("\n");
    }
    if (typeof obj === "object" && obj !== null) {
      const entries = Object.entries(obj);
      if (entries.length === 0) return "{}";
      return entries
        .map(([key, value]) => {
          if (typeof value === "object" && value !== null && !Array.isArray(value)) {
            return `${spaces}${key}:\n${jsonToYaml(value, indent + 1)}`;
          }
          if (Array.isArray(value)) {
            return `${spaces}${key}:\n${jsonToYaml(value, indent + 1)}`;
          }
          return `${spaces}${key}: ${jsonToYaml(value, 0)}`;
        })
        .join("\n");
    }
    return String(obj);
  };

  const convertToYaml = () => {
    try {
      if (!jsonInput.trim()) {
        showErrorToast(t("common.error"), t("jsonToYamlConverter.errorEnter"));
        return;
      }
      const parsed = JSON.parse(jsonInput);
      setYamlOutput(jsonToYaml(parsed));
      showToast(t("jsonToYamlConverter.toastSuccess"));
    } catch {
      showErrorToast(t("common.error"), t("jsonToYamlConverter.errorInvalid"));
    }
  };

  const copyToClipboardHandler = () => {
    copyToClipboard(yamlOutput, t("common.copied"));
  };

  const downloadFile = () => {
    const blob = new Blob([yamlOutput], { type: "text/yaml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "converted.yaml";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setJsonInput("");
    setYamlOutput("");
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <CardTitle>{t("jsonToYamlConverter.title")}</CardTitle>
          </div>
          <CardDescription>
            {t("jsonToYamlConverter.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="json-input">JSON Input</Label>
              <Textarea
                id="json-input"
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='{"name": "John", "age": 30, "city": "New York"}'
                className="min-h-[300px] font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>YAML Output</Label>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyToClipboardHandler}
                    disabled={!yamlOutput}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={downloadFile}
                    disabled={!yamlOutput}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Textarea
                value={yamlOutput}
                readOnly
                className="min-h-[300px] font-mono text-sm"
                placeholder="YAML output will appear here..."
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={convertToYaml} className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Convert to YAML
            </Button>
            <Button onClick={clearAll} variant="outline">
              Clear All
            </Button>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
            <div><strong>Tips:</strong></div>
            <div>• Paste valid JSON in the input field</div>
            <div>• YAML is great for configuration files and data serialization</div>
            <div>• Use the download button to save the converted YAML file</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JsonToYamlConverter;
