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

const RemoveDuplicateLines = () => {
  const { t } = useI18n();
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [trimLines, setTrimLines] = useState(true);
  const [preserveOrder, setPreserveOrder] = useState(true);

  const removeDuplicates = () => {
    if (!inputText.trim()) {
      showErrorToast(t("common.error"), t("removeDuplicateLines.errorEnterText"));
      return;
    }

    const lines = inputText.split("\n");
    const seen = new Set<string>();
    const uniqueLines: string[] = [];
    let duplicateCount = 0;

    lines.forEach((line) => {
      const processedLine = trimLines ? line.trim() : line;
      const keyLine = caseSensitive ? processedLine : processedLine.toLowerCase();

      if (!seen.has(keyLine)) {
        seen.add(keyLine);
        uniqueLines.push(line);
      } else {
        duplicateCount++;
      }
    });

    if (!preserveOrder) {
      uniqueLines.sort((a, b) => {
        const lineA = caseSensitive ? a : a.toLowerCase();
        const lineB = caseSensitive ? b : b.toLowerCase();
        return lineA.localeCompare(lineB);
      });
    }

    setOutputText(uniqueLines.join("\n"));
    showToast(
      t("removeDuplicateLines.toastRemovedPrefix") +
        duplicateCount +
        t("removeDuplicateLines.toastRemovedMiddle") +
        uniqueLines.length +
        t("removeDuplicateLines.toastRemovedSuffix")
    );
  };

  const copyToClipboard = async () => {
    if (!outputText) {
      showErrorToast(t("common.error"), t("removeDuplicateLines.errorNoOutput"));
      return;
    }

    if (window.__codeexpander?.writeClipboard) {
      window.__codeexpander.writeClipboard(outputText);
      showToast(t("removeDuplicateLines.toastCopied"));
    } else {
      try {
        await navigator.clipboard.writeText(outputText);
        showToast(t("removeDuplicateLines.toastCopied"));
      } catch {
        showErrorToast(t("common.error"), t("removeDuplicateLines.errorCopyFailed"));
      }
    }
  };

  const reset = () => {
    setInputText("");
    setOutputText("");
    setCaseSensitive(true);
    setTrimLines(true);
    setPreserveOrder(true);
  };

  const getStats = () => {
    if (!inputText) return null;

    const lines = inputText.split("\n");
    const totalLines = lines.length;
    const nonEmptyLines = lines.filter((line) => line.trim()).length;

    return { totalLines, nonEmptyLines };
  };

  const stats = getStats();

  return (
    <div className="p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("removeDuplicateLines.title")}</CardTitle>
          <CardDescription>
            {t("removeDuplicateLines.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="caseSensitive"
                checked={caseSensitive}
                onCheckedChange={(checked) => setCaseSensitive(checked === true)}
              />
              <Label htmlFor="caseSensitive">{t("removeDuplicateLines.caseSensitive")}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="trimLines"
                checked={trimLines}
                onCheckedChange={(checked) => setTrimLines(checked === true)}
              />
              <Label htmlFor="trimLines">{t("removeDuplicateLines.trimLines")}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="preserveOrder"
                checked={preserveOrder}
                onCheckedChange={(checked) =>
                  setPreserveOrder(checked === true)
                }
              />
              <Label htmlFor="preserveOrder">{t("removeDuplicateLines.preserveOrder")}</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="input">{t("removeDuplicateLines.inputLabel")}</Label>
            <Textarea
              id="input"
              placeholder={t("removeDuplicateLines.inputPlaceholder")}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[200px] font-mono"
            />
            {stats && (
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {t("removeDuplicateLines.totalLines")} {stats.totalLines} | {t("removeDuplicateLines.nonEmptyLines")}{" "}
                {stats.nonEmptyLines}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button onClick={removeDuplicates} className="flex-1">
              {t("removeDuplicateLines.removeBtn")}
            </Button>
            <Button variant="outline" onClick={reset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              {t("common.reset")}
            </Button>
          </div>

          {outputText && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="output">{t("removeDuplicateLines.outputLabel")}</Label>
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
                {t("removeDuplicateLines.resultLinesPrefix")}{outputText.split("\n").length}{t("removeDuplicateLines.resultLinesSuffix")}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RemoveDuplicateLines;
