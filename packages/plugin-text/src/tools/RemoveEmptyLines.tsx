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
  Checkbox,
} from "@codeexpander/dev-tools-ui";
import { Copy, RotateCcw } from "lucide-react";
import { useI18n } from "../context";
import { showToast, showErrorToast } from "../toast";

const RemoveEmptyLines = () => {
  const { t } = useI18n();
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [removeWhitespaceOnly, setRemoveWhitespaceOnly] = useState(true);

  const removeEmptyLines = () => {
    if (!inputText.trim()) {
      showErrorToast(t("common.error"), t("removeEmptyLines.errorEnterText"));
      return;
    }

    const lines = inputText.split("\n");
    let filteredLines: string[];
    let removedCount = 0;

    if (removeWhitespaceOnly) {
      filteredLines = lines.filter((line) => {
        const isEmpty = line.trim() === "";
        if (isEmpty) removedCount++;
        return !isEmpty;
      });
    } else {
      filteredLines = lines.filter((line) => {
        const isEmpty = line === "";
        if (isEmpty) removedCount++;
        return !isEmpty;
      });
    }

    setOutputText(filteredLines.join("\n"));
    showToast(
      t("removeEmptyLines.toastPrefix") +
        removedCount +
        t("removeEmptyLines.toastMiddle") +
        filteredLines.length +
        t("removeEmptyLines.toastSuffix")
    );
  };

  const copyToClipboard = async () => {
    if (!outputText) {
      showErrorToast(t("common.error"), t("removeEmptyLines.errorNoOutput"));
      return;
    }

    if (window.__codeexpander?.writeClipboard) {
      window.__codeexpander.writeClipboard(outputText);
      showToast(t("removeEmptyLines.toastCopied"));
    } else {
      try {
        await navigator.clipboard.writeText(outputText);
        showToast(t("removeEmptyLines.toastCopied"));
      } catch {
        showErrorToast(t("common.error"), t("removeEmptyLines.errorCopyFailed"));
      }
    }
  };

  const reset = () => {
    setInputText("");
    setOutputText("");
    setRemoveWhitespaceOnly(true);
  };

  const getStats = () => {
    if (!inputText) return null;

    const lines = inputText.split("\n");
    const totalLines = lines.length;
    const emptyLines = lines.filter((line) => line === "").length;
    const whitespaceOnlyLines = lines.filter(
      (line) => line.trim() === "" && line !== ""
    ).length;
    const nonEmptyLines = lines.filter((line) => line.trim() !== "").length;

    return {
      totalLines,
      emptyLines,
      whitespaceOnlyLines,
      nonEmptyLines,
    };
  };

  const stats = getStats();

  return (
    <div className="p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("removeEmptyLines.title")}</CardTitle>
          <CardDescription>
            {t("removeEmptyLines.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="removeWhitespaceOnly"
              checked={removeWhitespaceOnly}
              onCheckedChange={(checked) =>
                setRemoveWhitespaceOnly(checked === true)
              }
            />
            <Label htmlFor="removeWhitespaceOnly">
              {t("removeEmptyLines.whitespaceOnlyLabel")}
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="input">{t("removeEmptyLines.inputLabel")}</Label>
            <Textarea
              id="input"
              placeholder={t("removeEmptyLines.inputPlaceholder")}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[200px] font-mono"
            />
            {stats && (
              <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                <div>{t("removeEmptyLines.totalLines")} {stats.totalLines}</div>
                <div>{t("removeEmptyLines.emptyLines")} {stats.emptyLines}</div>
                <div>{t("removeEmptyLines.whitespaceOnlyLines")} {stats.whitespaceOnlyLines}</div>
                <div>{t("removeEmptyLines.nonEmptyLines")} {stats.nonEmptyLines}</div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button onClick={removeEmptyLines} className="flex-1">
              {t("removeEmptyLines.removeBtn")}
            </Button>
            <Button variant="outline" onClick={reset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              {t("common.reset")}
            </Button>
          </div>

          {outputText && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="output">{t("removeEmptyLines.outputLabel")}</Label>
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
                {t("removeEmptyLines.resultPrefix")}{outputText.split("\n").length}{t("removeEmptyLines.resultSuffix")}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RemoveEmptyLines;
