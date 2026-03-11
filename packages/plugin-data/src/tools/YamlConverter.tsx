import React, { useState } from "react";
import { Textarea, Button, Card, CardContent, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger, Badge, Alert, AlertDescription, Checkbox, Label } from "@codeexpander/dev-tools-ui";
import { AlertCircle, CheckCircle, Copy, Download } from "lucide-react";
import yaml from "js-yaml";
import { useI18n } from "../context";
import { showToast } from "../toast";

const YamlConverter = () => {
  const { t } = useI18n();
  const [input, setInput] = useState("");
  const [jsonOutput, setJsonOutput] = useState("");
  const [yamlOutput, setYamlOutput] = useState("");
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [inputType, setInputType] = useState<"yaml" | "json">("yaml");
  const [yamlOptions, setYamlOptions] = useState({
    indent: 2,
    lineWidth: 80,
    noRefs: false,
    skipInvalid: false,
    flowLevel: -1,
    quotingType: '"' as '"' | "'",
  });

  const validateInput = (text: string, type: "yaml" | "json") => {
    if (!text.trim()) {
      setIsValid(null);
      setError("");
      return false;
    }
    try {
      if (type === "yaml") yaml.load(text);
      else JSON.parse(text);
      setIsValid(true);
      setError("");
      return true;
    } catch (err) {
      setIsValid(false);
      setError((err as Error).message);
      return false;
    }
  };

  const handleInputChange = (text: string) => {
    setInput(text);
    validateInput(text, inputType);
  };

  const convertYamlToJson = () => {
    try {
      const parsed = yaml.load(input);
      setJsonOutput(JSON.stringify(parsed, null, 2));
      setError("");
      showToast(t("yamlConverter.toastYamlToJsonOk"));
    } catch (err) {
      setError(t("yamlConverter.yamlErrorPrefix") + (err as Error).message);
      setJsonOutput("");
      showToast(t("yamlConverter.toastYamlToJsonFail"));
    }
  };

  const convertJsonToYaml = () => {
    try {
      const parsed = JSON.parse(input);
      const yamlStr = yaml.dump(parsed, {
        indent: yamlOptions.indent,
        lineWidth: yamlOptions.lineWidth,
        noRefs: yamlOptions.noRefs,
        skipInvalid: yamlOptions.skipInvalid,
        flowLevel: yamlOptions.flowLevel,
        quotingType: yamlOptions.quotingType,
      });
      setYamlOutput(yamlStr);
      setError("");
      showToast(t("yamlConverter.toastJsonToYamlOk"));
    } catch (err) {
      setError(t("yamlConverter.jsonErrorPrefix") + (err as Error).message);
      setYamlOutput("");
      showToast(t("yamlConverter.toastJsonToYamlFail"));
    }
  };

  const copyToClipboard = (text: string) => {
    if (typeof (window as any).__codeexpander?.writeClipboard === "function") {
      (window as any).__codeexpander.writeClipboard(text);
    } else {
      navigator.clipboard.writeText(text);
    }
    showToast(t("yamlConverter.toastCopied"));
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    showToast(t("yamlConverter.toastDownloaded") + filename);
  };

  const loadSampleData = () => {
    const sampleYaml = `# Sample YAML configuration
name: Developer Toolbox
version: "1.0.0"
author:
  name: John Doe
  email: john@example.com
features:
  - yaml-converter
  - json-formatter
  - text-tools
settings:
  theme: dark
  auto_save: true
  notifications:
    email: false
    push: true
database:
  host: localhost
  port: 5432
  name: devtools
  credentials:
    username: admin
    password: "secret123"`;
    setInput(sampleYaml);
    setInputType("yaml");
    validateInput(sampleYaml, "yaml");
  };

  const clearAll = () => {
    setInput("");
    setJsonOutput("");
    setYamlOutput("");
    setError("");
    setIsValid(null);
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">{t("yamlConverter.title")}</h3>
          <p className="text-sm text-muted-foreground">{t("yamlConverter.subtitle")}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadSampleData}>{t("yamlConverter.loadSample")}</Button>
          <Button variant="outline" size="sm" onClick={clearAll}>{t("yamlConverter.clearAll")}</Button>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-4">
            <label className="block text-sm font-medium">{t("yamlConverter.inputLabel")}</label>
            <div className="flex items-center gap-2">
              <Label htmlFor="input-type" className="text-sm">{t("yamlConverter.typeLabel")}</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm">{t("yamlConverter.yaml")}</span>
                <Checkbox
                  id="input-type"
                  checked={inputType === "json"}
                  onCheckedChange={(checked) => {
                    setInputType(checked ? "json" : "yaml");
                    if (input) validateInput(input, checked ? "json" : "yaml");
                  }}
                />
                <span className="text-sm">{t("yamlConverter.json")}</span>
              </div>
            </div>
          </div>
          {isValid !== null && (
            <Badge variant={isValid ? "default" : "destructive"} className="flex items-center gap-1">
              {isValid ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
              {isValid ? t("yamlConverter.valid") : t("yamlConverter.invalid")}
            </Badge>
          )}
        </div>
        <Textarea
          placeholder={inputType === "yaml" ? t("yamlConverter.placeholderYaml") : t("yamlConverter.placeholderJson")}
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          className="min-h-[150px] font-mono text-sm py-3"
        />
        {error && (
          <Alert variant="destructive" className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>

      {inputType === "json" && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">{t("yamlConverter.yamlOptionsTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="indent" className="text-sm font-medium">{t("yamlConverter.indentLabel")}</Label>
              <select
                id="indent"
                value={yamlOptions.indent}
                onChange={(e) => setYamlOptions({ ...yamlOptions, indent: Number(e.target.value) })}
                className="w-full mt-1 p-2 border rounded-md text-sm"
              >
                <option value={2}>{t("yamlConverter.indent2")}</option>
                <option value={4}>{t("yamlConverter.indent4")}</option>
                <option value={8}>{t("yamlConverter.indent8")}</option>
              </select>
            </div>
            <div>
              <Label htmlFor="lineWidth" className="text-sm font-medium">{t("yamlConverter.lineWidthLabel")}</Label>
              <select
                id="lineWidth"
                value={yamlOptions.lineWidth}
                onChange={(e) => setYamlOptions({ ...yamlOptions, lineWidth: Number(e.target.value) })}
                className="w-full mt-1 p-2 border rounded-md text-sm"
              >
                <option value={60}>{t("yamlConverter.lineWidth60")}</option>
                <option value={80}>{t("yamlConverter.lineWidth80")}</option>
                <option value={120}>{t("yamlConverter.lineWidth120")}</option>
                <option value={-1}>{t("yamlConverter.lineWidthNone")}</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="noRefs" checked={yamlOptions.noRefs} onCheckedChange={(checked) => setYamlOptions({ ...yamlOptions, noRefs: checked })} />
              <Label htmlFor="noRefs" className="text-sm">{t("yamlConverter.noRefs")}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="skipInvalid" checked={yamlOptions.skipInvalid} onCheckedChange={(checked) => setYamlOptions({ ...yamlOptions, skipInvalid: checked })} />
              <Label htmlFor="skipInvalid" className="text-sm">{t("yamlConverter.skipInvalid")}</Label>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-3">
        <Button onClick={convertYamlToJson} disabled={!input || inputType !== "yaml"} className="flex-1">{t("yamlConverter.yamlToJson")}</Button>
        <Button onClick={convertJsonToYaml} disabled={!input || inputType !== "json"} className="flex-1">{t("yamlConverter.jsonToYaml")}</Button>
      </div>

      <Tabs defaultValue="json" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="json">{t("yamlConverter.jsonOutputTab")}</TabsTrigger>
          <TabsTrigger value="yaml">{t("yamlConverter.yamlOutputTab")}</TabsTrigger>
        </TabsList>
        <TabsContent value="json">
          {jsonOutput && (
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex justify-between items-center">
                  {t("yamlConverter.jsonOutputTitle")}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(jsonOutput)}>
                      <Copy className="h-4 w-4 mr-1" /> {t("common.copy")}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => downloadFile(jsonOutput, "converted.json")}>
                      <Download className="h-4 w-4 mr-1" /> {t("yamlConverter.download")}
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-slate-50 dark:bg-slate-800 p-4 rounded border text-sm overflow-x-auto max-h-80 whitespace-pre-wrap">{jsonOutput}</pre>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="yaml">
          {yamlOutput && (
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex justify-between items-center">
                  {t("yamlConverter.yamlOutputTitle")}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(yamlOutput)}>
                      <Copy className="h-4 w-4 mr-1" /> {t("common.copy")}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => downloadFile(yamlOutput, "converted.yaml")}>
                      <Download className="h-4 w-4 mr-1" /> {t("yamlConverter.download")}
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-slate-50 dark:bg-slate-800 p-4 rounded border text-sm overflow-x-auto max-h-80 whitespace-pre-wrap">{yamlOutput}</pre>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <Card>
        <CardContent className="p-4">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            <p><strong>{t("yamlConverter.advancedTitle")}</strong></p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>{t("yamlConverter.feature1")}</li>
              <li>{t("yamlConverter.feature2")}</li>
              <li>{t("yamlConverter.feature3")}</li>
              <li>{t("yamlConverter.feature4")}</li>
              <li>{t("yamlConverter.feature5")}</li>
              <li>{t("yamlConverter.feature6")}</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default YamlConverter;
