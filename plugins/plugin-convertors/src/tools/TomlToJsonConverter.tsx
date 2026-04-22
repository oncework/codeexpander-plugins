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

const parseTomlValue = (value: string): unknown => {
  if (value === "null") return null;
  if (value === "true") return true;
  if (value === "false") return false;
  if (!isNaN(Number(value)) && value.trim() !== "") return Number(value);
  if (value.startsWith("[") && value.endsWith("]")) {
    const arrayContent = value.slice(1, -1).trim();
    if (!arrayContent) return [];
    return arrayContent.split(",").map((item) => {
      const trimmed = item.trim();
      if (trimmed.startsWith('"') && trimmed.endsWith('"')) return trimmed.slice(1, -1);
      return parseTomlValue(trimmed);
    });
  }
  if (value.startsWith('"') && value.endsWith('"')) return value.slice(1, -1);
  return value;
};

const tomlToJson = (tomlString: string): Record<string, unknown> => {
  const lines = tomlString
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));
  const result: Record<string, unknown> = {};
  let currentSection: Record<string, unknown> = result;
  for (const line of lines) {
    if (line.startsWith("[") && line.endsWith("]")) {
      const sectionPath = line.slice(1, -1).split(".");
      currentSection = result;
      sectionPath.forEach((part, index) => {
        if (index === sectionPath.length - 1) {
          if (!(currentSection[part] as Record<string, unknown>)) {
            currentSection[part] = {};
          }
          currentSection = currentSection[part] as Record<string, unknown>;
        } else {
          if (!(currentSection[part] as Record<string, unknown>)) {
            currentSection[part] = {};
          }
          currentSection = currentSection[part] as Record<string, unknown>;
        }
      });
      continue;
    }
    const equalIndex = line.indexOf("=");
    if (equalIndex > 0) {
      const key = line.substring(0, equalIndex).trim();
      const value = line.substring(equalIndex + 1).trim();
      currentSection[key] = parseTomlValue(value);
    }
  }
  return result;
};

const TomlToJsonConverter = () => {
  const { t } = useI18n();
  const [tomlInput, setTomlInput] = useState("");
  const [jsonOutput, setJsonOutput] = useState("");

  const convertToJson = () => {
    try {
      if (!tomlInput.trim()) {
        showErrorToast(t("common.error"), t("tomlToJsonConverter.errorEnter"));
        return;
      }
      const parsed = tomlToJson(tomlInput);
      setJsonOutput(JSON.stringify(parsed, null, 2));
      showToast(t("tomlToJsonConverter.toastSuccess"));
    } catch {
      showErrorToast(t("common.error"), t("tomlToJsonConverter.errorInvalid"));
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
    setTomlInput("");
    setJsonOutput("");
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            <CardTitle>{t("tomlToJsonConverter.title")}</CardTitle>
          </div>
          <CardDescription>{t("tomlToJsonConverter.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="toml-input">TOML Input</Label>
              <Textarea
                id="toml-input"
                value={tomlInput}
                onChange={(e) => setTomlInput(e.target.value)}
                placeholder={'title = "Example"\nversion = 1.0\n\n[database]\nhost = "localhost"\nport = 5432'}
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
              <Settings className="h-4 w-4" />
              Convert to JSON
            </Button>
            <Button onClick={clearAll} variant="outline">
              Clear All
            </Button>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
            <div><strong>Tips:</strong></div>
            <div>• Paste valid TOML in the input field</div>
            <div>• Supports sections, arrays, and various data types</div>
            <div>• Use the download button to save the converted JSON file</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TomlToJsonConverter;
