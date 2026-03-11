import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Textarea,
  Button,
  Label,
} from "@codeexpander/dev-tools-ui";
import { Copy, RotateCcw } from "lucide-react";
import { useI18n } from "../context";
import { showToast, showErrorToast } from "../toast";

const RemoveExtraSpaces = () => {
  const { t } = useI18n();
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");

  const removeLeadingTrailing = () => {
    if (!inputText) {
      showErrorToast(t("common.error"), t("removeExtraSpaces.errorEnterText"));
      return;
    }

    const lines = inputText.split("\n");
    const trimmedLines = lines.map((line) => line.trim());
    setOutputText(trimmedLines.join("\n"));
    showToast(t("removeExtraSpaces.toastTrimLines"));
  };

  const removeExtraSpaces = () => {
    if (!inputText) {
      showErrorToast(t("common.error"), t("removeExtraSpaces.errorEnterText"));
      return;
    }

    const result = inputText.replace(/[ \t]+/g, " ");
    setOutputText(result);
    showToast(t("removeExtraSpaces.toastExtraSpaces"));
  };

  const removeAllSpaces = () => {
    if (!inputText) {
      showErrorToast(t("common.error"), t("removeExtraSpaces.errorEnterText"));
      return;
    }

    const result = inputText.replace(/[ \t]/g, "");
    setOutputText(result);
    showToast(t("removeExtraSpaces.toastAllSpaces"));
  };

  const removeAllWhitespace = () => {
    if (!inputText) {
      showErrorToast(t("common.error"), t("removeExtraSpaces.errorEnterText"));
      return;
    }

    const result = inputText.replace(/\s/g, "");
    setOutputText(result);
    showToast(t("removeExtraSpaces.toastAllWhitespace"));
  };

  const normalizeWhitespace = () => {
    if (!inputText) {
      showErrorToast(t("common.error"), t("removeExtraSpaces.errorEnterText"));
      return;
    }

    const lines = inputText.split("\n");
    const processedLines = lines.map((line) =>
      line.trim().replace(/\s+/g, " ")
    );
    setOutputText(processedLines.join("\n"));
    showToast(t("removeExtraSpaces.toastNormalize"));
  };

  const copyToClipboard = async () => {
    if (!outputText) {
      showErrorToast(t("common.error"), t("removeExtraSpaces.errorNoOutput"));
      return;
    }

    if (window.__codeexpander?.writeClipboard) {
      window.__codeexpander.writeClipboard(outputText);
      showToast(t("removeExtraSpaces.toastCopied"));
    } else {
      try {
        await navigator.clipboard.writeText(outputText);
        showToast(t("removeExtraSpaces.toastCopied"));
      } catch {
        showErrorToast(t("common.error"), t("removeExtraSpaces.errorCopyFailed"));
      }
    }
  };

  const reset = () => {
    setInputText("");
    setOutputText("");
  };

  const getStats = () => {
    if (!inputText) return null;

    const totalChars = inputText.length;
    const spaces = (inputText.match(/[ ]/g) || []).length;
    const tabs = (inputText.match(/[\t]/g) || []).length;
    const lineBreaks = (inputText.match(/[\n]/g) || []).length;
    const allWhitespace = (inputText.match(/\s/g) || []).length;

    return { totalChars, spaces, tabs, lineBreaks, allWhitespace };
  };

  const stats = getStats();

  return (
    <div className="p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("removeExtraSpaces.title")}</CardTitle>
          <CardDescription>
            {t("removeExtraSpaces.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="input">{t("removeExtraSpaces.inputLabel")}</Label>
            <Textarea
              id="input"
              placeholder={t("removeExtraSpaces.inputPlaceholder")}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[200px] font-mono"
            />
            {stats && (
              <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                <div>{t("removeExtraSpaces.totalChars")} {stats.totalChars}</div>
                <div>
                  {t("removeExtraSpaces.spaces")} {stats.spaces} | {t("removeExtraSpaces.tabs")} {stats.tabs} | {t("removeExtraSpaces.lineBreaks")}{" "}
                  {stats.lineBreaks}
                </div>
                <div>{t("removeExtraSpaces.totalWhitespace")} {stats.allWhitespace}</div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            <Button onClick={removeLeadingTrailing} variant="outline">
              {t("removeExtraSpaces.trimLines")}
            </Button>
            <Button onClick={removeExtraSpaces} variant="outline">
              {t("removeExtraSpaces.removeExtraSpaces")}
            </Button>
            <Button onClick={removeAllSpaces} variant="outline">
              {t("removeExtraSpaces.removeAllSpaces")}
            </Button>
            <Button onClick={removeAllWhitespace} variant="outline">
              {t("removeExtraSpaces.removeAllWhitespace")}
            </Button>
            <Button onClick={normalizeWhitespace}>
              {t("removeExtraSpaces.normalizeWhitespace")}
            </Button>
            <Button variant="outline" onClick={reset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              {t("common.reset")}
            </Button>
          </div>

          {outputText !== undefined && outputText !== inputText && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="output">{t("removeExtraSpaces.outputLabel")}</Label>
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
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {t("removeExtraSpaces.resultPrefix")}{outputText.length}{t("removeExtraSpaces.resultSuffix")}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RemoveExtraSpaces;
