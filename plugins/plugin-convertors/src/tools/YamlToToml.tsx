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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@codeexpander/dev-tools-ui";
import { Copy, Settings, RefreshCw, ArrowUpDown, Download } from "lucide-react";
import { useI18n } from "../context";
import { showToast, showErrorToast, copyToClipboard } from "../toast";

const parseYaml = (yamlString: string): Record<string, unknown> => {
  const lines = yamlString
    .split("\n")
    .filter((line) => line.trim() && !line.trim().startsWith("#"));
  const result: Record<string, unknown> = {};
  const stack: Record<string, unknown>[] = [result];
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.includes(":")) {
      const [key, ...valueParts] = trimmedLine.split(":");
      const value = valueParts.join(":").trim();
      const cleanKey = key.trim();
      if (value) {
        let parsedValue: unknown = value;
        if (value === "true") parsedValue = true;
        else if (value === "false") parsedValue = false;
        else if (value === "null") parsedValue = null;
        else if (!isNaN(Number(value)) && value !== "") parsedValue = Number(value);
        else if (value.startsWith('"') && value.endsWith('"')) parsedValue = value.slice(1, -1);
        else if (value.startsWith("'") && value.endsWith("'")) parsedValue = value.slice(1, -1);
        (stack[stack.length - 1] as Record<string, unknown>)[cleanKey] = parsedValue;
      } else {
        const next: Record<string, unknown> = {};
        (stack[stack.length - 1] as Record<string, unknown>)[cleanKey] = next;
        stack.push(next);
      }
    } else if (trimmedLine.startsWith("- ")) {
      const item = trimmedLine.substring(2);
      const top = stack[stack.length - 1];
      if (!Array.isArray(top)) {
        const prev = stack[stack.length - 2] as Record<string, unknown>;
        const lastKey = Object.keys(prev).pop()!;
        (prev[lastKey] as unknown[]) = [];
        stack[stack.length - 1] = (prev[lastKey] as unknown[])[0] as Record<string, unknown>;
      }
      const arr = stack[stack.length - 1];
      if (Array.isArray(arr)) {
        let parsedItem: unknown = item;
        if (item === "true") parsedItem = true;
        else if (item === "false") parsedItem = false;
        else if (item === "null") parsedItem = null;
        else if (!isNaN(Number(item)) && item !== "") parsedItem = Number(item);
        arr.push(parsedItem);
      }
    }
  }
  return result;
};

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

const parseToml = (tomlString: string): Record<string, unknown> => {
  const lines = tomlString
    .split("\n")
    .filter((line) => line.trim() && !line.trim().startsWith("#"));
  const result: Record<string, unknown> = {};
  let currentSection: Record<string, unknown> = result;
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith("[") && trimmedLine.endsWith("]")) {
      const pathParts = trimmedLine.slice(1, -1).split(".");
      currentSection = result;
      for (const part of pathParts) {
        if (!(currentSection[part] as Record<string, unknown>)) {
          currentSection[part] = {};
        }
        currentSection = currentSection[part] as Record<string, unknown>;
      }
      continue;
    }
    if (trimmedLine.includes("=")) {
      const [key, ...valueParts] = trimmedLine.split("=");
      const value = valueParts.join("=").trim();
      const cleanKey = key.trim();
      let parsedValue: unknown = value;
      if (value.startsWith("[") && value.endsWith("]")) {
        const arrayContent = value.slice(1, -1);
        parsedValue = arrayContent.trim()
          ? arrayContent.split(",").map((item) => {
              const t = item.trim();
              if (t.startsWith('"') && t.endsWith('"')) return t.slice(1, -1);
              if (t === "true") return true;
              if (t === "false") return false;
              if (!isNaN(Number(t))) return Number(t);
              return t;
            })
          : [];
      } else if (value.startsWith('"') && value.endsWith('"')) {
        parsedValue = value.slice(1, -1);
      } else if (value === "true") parsedValue = true;
      else if (value === "false") parsedValue = false;
      else if (value === "null") parsedValue = null;
      else if (!isNaN(Number(value))) parsedValue = Number(value);
      currentSection[cleanKey] = parsedValue;
    }
  }
  return result;
};

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

const YamlToToml = () => {
  const { t } = useI18n();
  const [yamlInput, setYamlInput] = useState("");
  const [tomlInput, setTomlInput] = useState("");
  const [yamlResult, setYamlResult] = useState("");
  const [tomlResult, setTomlResult] = useState("");

  const yamlToTomlConvert = () => {
    try {
      const parsed = parseYaml(yamlInput) as Record<string, unknown>;
      setTomlResult(jsonToToml(parsed));
      showToast(t("yamlToToml.toastYamlToToml"));
    } catch {
      showErrorToast(t("common.error"), t("yamlToToml.errorInvalidYaml"));
    }
  };

  const tomlToYaml = () => {
    try {
      const parsed = parseToml(tomlInput);
      setYamlResult(jsonToYaml(parsed));
      showToast(t("yamlToToml.toastTomlToYaml"));
    } catch {
      showErrorToast(t("common.error"), t("yamlToToml.errorInvalidToml"));
    }
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setYamlInput("");
    setTomlInput("");
    setYamlResult("");
    setTomlResult("");
  };

  const swapInputs = () => {
    const tempYaml = yamlInput;
    const tempToml = tomlInput;
    setYamlInput(yamlResult);
    setTomlInput(tomlResult);
    setYamlResult(tempYaml);
    setTomlResult(tempToml);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            <CardTitle>{t("yamlToToml.title")}</CardTitle>
          </div>
          <CardDescription>{t("yamlToToml.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="yaml-to-toml" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="yaml-to-toml">{t("yamlToToml.tabYamlToToml")}</TabsTrigger>
              <TabsTrigger value="toml-to-yaml">{t("yamlToToml.tabTomlToYaml")}</TabsTrigger>
            </TabsList>
            <TabsContent value="yaml-to-toml" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="yaml-input">{t("yamlToToml.inputLabel")}</Label>
                  <Textarea
                    id="yaml-input"
                    value={yamlInput}
                    onChange={(e) => setYamlInput(e.target.value)}
                    placeholder={"title: Example\nversion: 1.0\ndatabase:\n  host: localhost\n  port: 5432"}
                    className="min-h-[300px] font-mono text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>{t("yamlToToml.outputLabel")}</Label>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(tomlResult, t("common.copied"))}
                        disabled={!tomlResult}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => downloadFile(tomlResult, "converted.toml")}
                        disabled={!tomlResult}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    value={tomlResult}
                    readOnly
                    className="min-h-[300px] font-mono text-sm"
                    placeholder={t("yamlToToml.placeholderTomlOutput")}
                  />
                </div>
              </div>
              <Button onClick={yamlToTomlConvert} className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                {t("yamlToToml.convertYamlToToml")}
              </Button>
            </TabsContent>
            <TabsContent value="toml-to-yaml" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="toml-input">{t("yamlToToml.tomlInput")}</Label>
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
                    <Label>{t("yamlToToml.yamlOutput")}</Label>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(yamlResult, t("common.copied"))}
                        disabled={!yamlResult}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => downloadFile(yamlResult, "converted.yaml")}
                        disabled={!yamlResult}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    value={yamlResult}
                    readOnly
                    className="min-h-[300px] font-mono text-sm"
                    placeholder={t("yamlToToml.placeholderYamlOutput")}
                  />
                </div>
              </div>
              <Button onClick={tomlToYaml} className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                {t("yamlToToml.convertTomlToYaml")}
              </Button>
            </TabsContent>
          </Tabs>
          <div className="flex flex-wrap gap-3">
            <Button onClick={swapInputs} variant="outline" className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4" />
              {t("yamlToToml.swap")}
            </Button>
            <Button onClick={clearAll} variant="outline" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              {t("yamlToToml.clearAll")}
            </Button>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
            <div><strong>Tips:</strong></div>
            <div>• TOML is great for configuration files with its clear syntax</div>
            <div>• Supports nested tables and arrays</div>
            <div>• Use download buttons to save converted files</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default YamlToToml;
