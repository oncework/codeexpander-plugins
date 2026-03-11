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
import { Copy, FileText, RefreshCw, ArrowUpDown, Download } from "lucide-react";
import { useI18n } from "../context";
import { showToast, showErrorToast, copyToClipboard } from "../toast";

const YamlToJsonConverter = () => {
  const { t } = useI18n();
  const [yamlInput, setYamlInput] = useState("");
  const [jsonInput, setJsonInput] = useState("");
  const [yamlResult, setYamlResult] = useState("");
  const [jsonResult, setJsonResult] = useState("");

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
          else if (value.startsWith('"') && value.endsWith('"'))
            parsedValue = value.slice(1, -1);
          else if (value.startsWith("'") && value.endsWith("'"))
            parsedValue = value.slice(1, -1);
          (stack[stack.length - 1] as Record<string, unknown>)[cleanKey] = parsedValue;
        } else {
          const next: Record<string, unknown> = {};
          (stack[stack.length - 1] as Record<string, unknown>)[cleanKey] = next;
          stack.push(next);
        }
      } else if (trimmedLine.startsWith("- ")) {
        const item = trimmedLine.substring(2);
        const parent = stack[stack.length - 1];
        if (!Array.isArray(parent)) {
          const keys = Object.keys(parent as object);
          if (keys.length === 0) {
            const prev = stack[stack.length - 2] as Record<string, unknown>;
            const lastKey = Object.keys(prev).pop()!;
            (prev[lastKey] as unknown[]) = [];
            stack[stack.length - 1] = (prev[lastKey] as unknown[])[0] as Record<string, unknown>;
          }
        }
        const top = stack[stack.length - 1];
        if (Array.isArray(top)) {
          let parsedItem: unknown = item;
          if (item === "true") parsedItem = true;
          else if (item === "false") parsedItem = false;
          else if (item === "null") parsedItem = null;
          else if (!isNaN(Number(item)) && item !== "") parsedItem = Number(item);
          top.push(parsedItem);
        }
      }
    }
    return result;
  };

  const jsonToYaml = (obj: unknown, indent: number = 0): string => {
    const spaces = "  ".repeat(indent);
    if (obj === null) return "null";
    if (typeof obj === "boolean") return obj.toString();
    if (typeof obj === "number") return obj.toString();
    if (typeof obj === "string")
      return obj.includes("\n")
        ? `|\n${obj.split("\n").map((line) => spaces + "  " + line).join("\n")}`
        : obj;
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
          if (
            typeof value === "object" &&
            value !== null &&
            !Array.isArray(value)
          ) {
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

  const yamlToJson = () => {
    try {
      const parsed = parseYaml(yamlInput);
      setJsonResult(JSON.stringify(parsed, null, 2));
      showToast(t("yamlToJsonConverter.toastYamlToJson"));
    } catch {
      showErrorToast(t("common.error"), t("yamlToJsonConverter.errorInvalidYaml"));
    }
  };

  const jsonToYamlConvert = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setYamlResult(jsonToYaml(parsed));
      showToast(t("yamlToJsonConverter.toastJsonToYaml"));
    } catch {
      showErrorToast(t("common.error"), t("yamlToJsonConverter.errorInvalidJson"));
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
    setJsonInput("");
    setYamlResult("");
    setJsonResult("");
  };

  const swapInputs = () => {
    const tempYaml = yamlInput;
    const tempJson = jsonInput;
    setYamlInput(yamlResult);
    setJsonInput(jsonResult);
    setYamlResult(tempYaml);
    setJsonResult(tempJson);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <CardTitle>{t("yamlToJsonConverter.title")}</CardTitle>
          </div>
          <CardDescription>
            {t("yamlToJsonConverter.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="yaml-to-json" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="yaml-to-json">{t("yamlToJsonConverter.tabYamlToJson")}</TabsTrigger>
              <TabsTrigger value="json-to-yaml">{t("yamlToJsonConverter.tabJsonToYaml")}</TabsTrigger>
            </TabsList>
            <TabsContent value="yaml-to-json" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="yaml-input">{t("yamlToJsonConverter.inputLabel")}</Label>
                  <Textarea
                    id="yaml-input"
                    value={yamlInput}
                    onChange={(e) => setYamlInput(e.target.value)}
                    placeholder={"name: John Doe\nage: 30\ncity: New York"}
                    className="min-h-[300px] font-mono text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>{t("yamlToJsonConverter.outputLabel")}</Label>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(jsonResult, t("common.copied"))}
                        disabled={!jsonResult}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => downloadFile(jsonResult, "converted.json")}
                        disabled={!jsonResult}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    value={jsonResult}
                    readOnly
                    className="min-h-[300px] font-mono text-sm"
                    placeholder={t("yamlToJsonConverter.placeholderJsonOutput")}
                  />
                </div>
              </div>
              <Button onClick={yamlToJson} className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                {t("yamlToJsonConverter.convertYamlToJson")}
              </Button>
            </TabsContent>
            <TabsContent value="json-to-yaml" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="json-input">{t("yamlToJsonConverter.jsonInput")}</Label>
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
                    <Label>{t("yamlToJsonConverter.yamlOutput")}</Label>
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
                    placeholder={t("yamlToJsonConverter.placeholderYamlOutput")}
                  />
                </div>
              </div>
              <Button onClick={jsonToYamlConvert} className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                {t("yamlToJsonConverter.convertJsonToYaml")}
              </Button>
            </TabsContent>
          </Tabs>
          <div className="flex flex-wrap gap-3">
            <Button onClick={swapInputs} variant="outline" className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4" />
              {t("yamlToJsonConverter.swap")}
            </Button>
            <Button onClick={clearAll} variant="outline" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              {t("yamlToJsonConverter.clearAll")}
            </Button>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
            <div><strong>Tips:</strong></div>
            <div>• Supports basic YAML features including nested objects and arrays</div>
            <div>• Automatically handles data type conversion (strings, numbers, booleans)</div>
            <div>• Use download buttons to save converted files</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default YamlToJsonConverter;
