import React, { useState } from "react";
import { Textarea, Button, Card, CardContent, CardHeader, CardTitle, Badge, Collapsible, CollapsibleContent, CollapsibleTrigger } from "@codeexpander/dev-tools-ui";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useI18n } from "../context";
import { showToast } from "../toast";

interface JsonNode {
  key?: string;
  value: unknown;
  type: "object" | "array" | "string" | "number" | "boolean" | "null";
  level: number;
  isCollapsed: boolean;
}

const JsonFormatter = () => {
  const { t } = useI18n();
  const [input, setInput] = useState("");
  const [formatted, setFormatted] = useState("");
  const [minified, setMinified] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const [parsedJson, setParsedJson] = useState<unknown>(null);
  const [collapsedStates, setCollapsedStates] = useState<{ [key: string]: boolean }>({});

  const formatJson = () => {
    try {
      const parsed = JSON.parse(input);
      setFormatted(JSON.stringify(parsed, null, 2));
      setMinified(JSON.stringify(parsed));
      setParsedJson(parsed);
      setIsValid(true);
      setError("");
      setCollapsedStates({});
    } catch (err) {
      setError((err as Error).message);
      setIsValid(false);
      setFormatted("");
      setMinified("");
      setParsedJson(null);
    }
  };

  const validateJson = (jsonString: string) => {
    if (!jsonString.trim()) {
      setIsValid(null);
      setError("");
      return;
    }
    try {
      JSON.parse(jsonString);
      setIsValid(true);
      setError("");
    } catch (err) {
      setIsValid(false);
      setError((err as Error).message);
    }
  };

  const toggleCollapse = (path: string) => {
    setCollapsedStates((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const copyToClipboard = (text: string) => {
    if (typeof (window as any).__codeexpander?.writeClipboard === "function") {
      (window as any).__codeexpander.writeClipboard(text);
    } else {
      navigator.clipboard.writeText(text);
    }
    showToast(t("common.copied"));
  };

  const renderJsonValue = (value: unknown, key?: string, level = 0, path = ""): React.ReactNode => {
    const currentPath = path + (key ? `.${key}` : "");
    const isCollapsed = collapsedStates[currentPath];
    const indent = level * 20;

    if (value === null) {
      return (
        <div style={{ marginLeft: indent }} className="flex items-center">
          {key && <span className="text-blue-600 mr-2">&quot;{key}&quot;:</span>}
          <span className="text-gray-500">null</span>
        </div>
      );
    }
    if (typeof value === "boolean") {
      return (
        <div style={{ marginLeft: indent }} className="flex items-center">
          {key && <span className="text-blue-600 mr-2">&quot;{key}&quot;:</span>}
          <span className="text-purple-600">{value.toString()}</span>
        </div>
      );
    }
    if (typeof value === "number") {
      return (
        <div style={{ marginLeft: indent }} className="flex items-center">
          {key && <span className="text-blue-600 mr-2">&quot;{key}&quot;:</span>}
          <span className="text-green-600">{value}</span>
        </div>
      );
    }
    if (typeof value === "string") {
      return (
        <div style={{ marginLeft: indent }} className="flex items-center">
          {key && <span className="text-blue-600 mr-2">&quot;{key}&quot;:</span>}
          <span className="text-red-600">&quot;{value}&quot;</span>
        </div>
      );
    }
    if (Array.isArray(value)) {
      return (
        <div style={{ marginLeft: indent }}>
          <Collapsible open={!isCollapsed} onOpenChange={() => toggleCollapse(currentPath)}>
            <CollapsibleTrigger className="flex items-center hover:bg-gray-100 p-1 rounded">
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              {key && <span className="text-blue-600 mr-2">&quot;{key}&quot;:</span>}
              <span className="text-gray-700 dark:text-slate-300">[{value.length}{t("jsonFormatter.itemsSuffix")}</span>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="border-l-2 border-gray-200 ml-2">
                {value.map((item, index) => (
                  <div key={index}>
                    {renderJsonValue(item, index.toString(), level + 1, currentPath + `[${index}]`)}
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      );
    }
    if (typeof value === "object") {
      const keys = Object.keys(value as object);
      return (
        <div style={{ marginLeft: indent }}>
          <Collapsible open={!isCollapsed} onOpenChange={() => toggleCollapse(currentPath)}>
            <CollapsibleTrigger className="flex items-center hover:bg-gray-100 p-1 rounded">
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              {key && <span className="text-blue-600 mr-2">&quot;{key}&quot;:</span>}
              <span className="text-gray-700 dark:text-slate-300">{`{${keys.length}`}{t("jsonFormatter.keysSuffix")}</span>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="border-l-2 border-gray-200 ml-2">
                {keys.map((objKey) => (
                  <div key={objKey}>
                    {renderJsonValue((value as Record<string, unknown>)[objKey], objKey, level + 1, currentPath + `.${objKey}`)}
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      );
    }
    return null;
  };

  const expandAll = () => setCollapsedStates({});

  const collapseAll = () => {
    const getAllPaths = (obj: unknown, currentPath = ""): string[] => {
      const paths: string[] = [];
      if (typeof obj === "object" && obj !== null) {
        if (currentPath !== "") paths.push(currentPath);
        if (Array.isArray(obj)) {
          obj.forEach((item, index) => {
            const newPath = currentPath === "" ? `[${index}]` : `${currentPath}[${index}]`;
            paths.push(...getAllPaths(item, newPath));
          });
        } else {
          Object.keys(obj as object).forEach((key) => {
            const newPath = currentPath === "" ? key : `${currentPath}.${key}`;
            paths.push(...getAllPaths((obj as Record<string, unknown>)[key], newPath));
          });
        }
      }
      return paths;
    };
    if (parsedJson) {
      const allPaths = getAllPaths(parsedJson);
      const newCollapsedStates: { [key: string]: boolean } = {};
      allPaths.forEach((path) => { newCollapsedStates[path] = true; });
      setCollapsedStates(newCollapsedStates);
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-medium">{t("jsonFormatter.inputLabel")}</label>
          {isValid !== null && (
            <Badge variant={isValid ? "default" : "destructive"}>
              {isValid ? t("jsonFormatter.valid") : t("jsonFormatter.invalid")}
            </Badge>
          )}
        </div>
        <Textarea
          placeholder={t("jsonFormatter.placeholder")}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            validateJson(e.target.value);
          }}
          className="min-h-[120px] font-mono text-sm py-3"
        />
        {error && <div className="text-red-600 dark:text-red-400 text-sm mt-1">{error}</div>}
      </div>

      <Button onClick={formatJson} disabled={!input || !isValid} className="w-full">
        {t("jsonFormatter.formatButton")}
      </Button>

      {parsedJson && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex justify-between items-center">
              {t("jsonFormatter.viewerTitle")}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={expandAll}>{t("jsonFormatter.expandAll")}</Button>
                <Button variant="outline" size="sm" onClick={collapseAll}>{t("jsonFormatter.collapseAll")}</Button>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(formatted)}>{t("common.copy")}</Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded border text-sm font-mono max-h-96 overflow-auto">
              {renderJsonValue(parsedJson)}
            </div>
          </CardContent>
        </Card>
      )}

      {formatted && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex justify-between items-center">
              {t("jsonFormatter.formattedTitle")}
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(formatted)}>{t("common.copy")}</Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-slate-50 dark:bg-slate-800 p-4 rounded border text-sm overflow-x-auto max-h-60">{formatted}</pre>
          </CardContent>
        </Card>
      )}

      {minified && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex justify-between items-center">
              {t("jsonFormatter.minifiedTitle")}
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(minified)}>{t("common.copy")}</Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded border text-sm font-mono break-all max-h-40 overflow-y-auto">{minified}</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default JsonFormatter;
