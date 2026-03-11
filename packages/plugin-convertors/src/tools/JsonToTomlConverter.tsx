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
import { Copy, Settings, Download } from "lucide-react";
import { useI18n } from "../context";
import { showToast, showErrorToast, copyToClipboard } from "../toast";

const JsonToTomlConverter = () => {
  const { t } = useI18n();
  const [jsonInput, setJsonInput] = useState("");
  const [tomlOutput, setTomlOutput] = useState("");

  const jsonToToml = (obj: Record<string, unknown>, prefix: string = ""): string => {
    let result = "";
    const simpleKeys: string[] = [];
    const complexKeys: string[] = [];
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        complexKeys.push(key);
      } else {
        simpleKeys.push(key);
      }
    });
    simpleKeys.forEach((key) => {
      const value = obj[key];
      if (Array.isArray(value)) {
        const arrayStr = value
          .map((item) => {
            if (typeof item === "string") return `"${item}"`;
            if (typeof item === "boolean" || typeof item === "number") return String(item);
            return `"${item}"`;
          })
          .join(", ");
        result += `${key} = [${arrayStr}]\n`;
      } else if (typeof value === "string") {
        result += `${key} = "${value}"\n`;
      } else if (typeof value === "boolean" || typeof value === "number") {
        result += `${key} = ${value}\n`;
      } else if (value === null) {
        result += `${key} = null\n`;
      }
    });
    if (simpleKeys.length > 0 && complexKeys.length > 0) result += "\n";
    complexKeys.forEach((key) => {
      const value = obj[key] as Record<string, unknown>;
      const fullKey = prefix ? `${prefix}.${key}` : key;
      result += `[${fullKey}]\n`;
      result += jsonToToml(value, fullKey);
      result += "\n";
    });
    return result;
  };

  const convertToToml = () => {
    try {
      if (!jsonInput.trim()) {
        showErrorToast(t("common.error"), t("jsonToTomlConverter.errorEnter"));
        return;
      }
      const parsed = JSON.parse(jsonInput) as Record<string, unknown>;
      setTomlOutput(jsonToToml(parsed));
      showToast(t("jsonToTomlConverter.toastSuccess"));
    } catch {
      showErrorToast(t("common.error"), t("jsonToTomlConverter.errorInvalid"));
    }
  };

  const copyToClipboardHandler = () => {
    copyToClipboard(tomlOutput, t("common.copied"));
  };

  const downloadFile = () => {
    const blob = new Blob([tomlOutput], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "converted.toml";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setJsonInput("");
    setTomlOutput("");
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            <CardTitle>{t("jsonToTomlConverter.title")}</CardTitle>
          </div>
          <CardDescription>{t("jsonToTomlConverter.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="json-input">JSON Input</Label>
              <Textarea
                id="json-input"
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='{"title": "Example", "version": 1.0, "database": {"host": "localhost", "port": 5432}}'
                className="min-h-[300px] font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>TOML Output</Label>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyToClipboardHandler}
                    disabled={!tomlOutput}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={downloadFile}
                    disabled={!tomlOutput}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Textarea
                value={tomlOutput}
                readOnly
                className="min-h-[300px] font-mono text-sm"
                placeholder="TOML output will appear here..."
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={convertToToml} className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Convert to TOML
            </Button>
            <Button onClick={clearAll} variant="outline">
              Clear All
            </Button>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
            <div><strong>Tips:</strong></div>
            <div>• Paste valid JSON in the input field</div>
            <div>• TOML is great for configuration files with its clear syntax</div>
            <div>• Supports nested tables and arrays</div>
            <div>• Use the download button to save the converted TOML file</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JsonToTomlConverter;
