import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Textarea,
  Input,
  Button,
  Label,
} from "@codeexpander/dev-tools-ui";
import { RotateCcw, Copy } from "lucide-react";
import { useI18n } from "../context";
import { showToast, showErrorToast } from "../toast";

const AddPrefixSuffix = () => {
  const { t } = useI18n();
  const [inputText, setInputText] = useState("");
  const [prefix, setPrefix] = useState("");
  const [suffix, setSuffix] = useState("");
  const [outputText, setOutputText] = useState("");

  const processText = () => {
    if (!inputText.trim()) {
      showErrorToast(t("common.error"), t("addPrefixSuffix.errorEnterText"));
      return;
    }

    const lines = inputText.split("\n");
    const processedLines = lines.map((line) => `${prefix}${line}${suffix}`);
    setOutputText(processedLines.join("\n"));
  };

  const copyToClipboard = async () => {
    if (!outputText) {
      showErrorToast(t("common.error"), t("addPrefixSuffix.errorNoOutput"));
      return;
    }

    if (window.__codeexpander?.writeClipboard) {
      window.__codeexpander.writeClipboard(outputText);
      showToast(t("addPrefixSuffix.toastCopied"));
    } else {
      try {
        await navigator.clipboard.writeText(outputText);
        showToast(t("addPrefixSuffix.toastCopied"));
      } catch {
        showErrorToast(t("common.error"), t("addPrefixSuffix.errorCopyFailed"));
      }
    }
  };

  const reset = () => {
    setInputText("");
    setPrefix("");
    setSuffix("");
    setOutputText("");
  };

  return (
    <div className="p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("addPrefixSuffix.title")}</CardTitle>
          <CardDescription>
            {t("addPrefixSuffix.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prefix">{t("addPrefixSuffix.prefixLabel")}</Label>
              <Input
                id="prefix"
                placeholder={t("addPrefixSuffix.prefixPlaceholder")}
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="suffix">{t("addPrefixSuffix.suffixLabel")}</Label>
              <Input
                id="suffix"
                placeholder={t("addPrefixSuffix.suffixPlaceholder")}
                value={suffix}
                onChange={(e) => setSuffix(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="input">{t("addPrefixSuffix.inputLabel")}</Label>
            <Textarea
              id="input"
              placeholder={t("addPrefixSuffix.inputPlaceholder")}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[200px] font-mono"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={processText} className="flex-1">
              {t("addPrefixSuffix.processBtn")}
            </Button>
            <Button variant="outline" onClick={reset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              {t("common.reset")}
            </Button>
          </div>

          {outputText && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="output">{t("addPrefixSuffix.outputLabel")}</Label>
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  <Copy className="w-4 h-4 mr-2" />
                  {t("common.copy")}
                </Button>
              </div>
              <Textarea
                id="output"
                value={outputText}
                readOnly
                className="min-h-[200px] font-mono bg-slate-50 dark:bg-slate-900"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AddPrefixSuffix;
