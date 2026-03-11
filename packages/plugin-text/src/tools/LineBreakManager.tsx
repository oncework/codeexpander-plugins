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
  Input,
} from "@codeexpander/dev-tools-ui";
import { Copy, RotateCcw } from "lucide-react";
import { useI18n } from "../context";
import { showToast, showErrorToast } from "../toast";

const LineBreakManager = () => {
  const { t } = useI18n();
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [wrapLength, setWrapLength] = useState(80);

  const addLineBreaks = () => {
    if (!inputText.trim()) {
      showErrorToast(t("common.error"), t("lineBreakManager.errorEnterText"));
      return;
    }

    const words = inputText.split(/\s+/);
    const lines = [];
    let currentLine = "";

    words.forEach((word) => {
      if (currentLine.length + word.length + 1 <= wrapLength) {
        currentLine += (currentLine ? " " : "") + word;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    });

    if (currentLine) lines.push(currentLine);
    setOutputText(lines.join("\n"));
  };

  const removeLineBreaks = () => {
    if (!inputText.trim()) {
      showErrorToast(t("common.error"), t("lineBreakManager.errorEnterText"));
      return;
    }

    const result = inputText
      .split("\n\n")
      .map((paragraph) =>
        paragraph.replace(/\n/g, " ").replace(/\s+/g, " ").trim()
      )
      .join("\n\n");

    setOutputText(result);
  };

  const removeAllLineBreaks = () => {
    if (!inputText.trim()) {
      showErrorToast(t("common.error"), t("lineBreakManager.errorEnterText"));
      return;
    }

    const result = inputText.replace(/\n/g, " ").replace(/\s+/g, " ").trim();
    setOutputText(result);
  };

  const copyToClipboard = async () => {
    if (!outputText) {
      showErrorToast(t("common.error"), t("lineBreakManager.errorNoOutput"));
      return;
    }

    if (window.__codeexpander?.writeClipboard) {
      window.__codeexpander.writeClipboard(outputText);
      showToast(t("lineBreakManager.toastCopied"));
    } else {
      try {
        await navigator.clipboard.writeText(outputText);
        showToast(t("lineBreakManager.toastCopied"));
      } catch {
        showErrorToast(t("common.error"), t("lineBreakManager.errorCopyFailed"));
      }
    }
  };

  const reset = () => {
    setInputText("");
    setOutputText("");
    setWrapLength(80);
  };

  return (
    <div className="p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("lineBreakManager.title")}</CardTitle>
          <CardDescription>
            {t("lineBreakManager.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="input">{t("lineBreakManager.inputLabel")}</Label>
            <Textarea
              id="input"
              placeholder={t("lineBreakManager.inputPlaceholder")}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[200px] font-mono"
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wrapLength">
                {t("lineBreakManager.wrapLengthLabel")}
              </Label>
              <Input
                id="wrapLength"
                type="number"
                min={10}
                max={200}
                value={wrapLength}
                onChange={(e) => setWrapLength(Number(e.target.value))}
                className="w-32"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={addLineBreaks}>{t("lineBreakManager.addBreaks")}</Button>
              <Button onClick={removeLineBreaks} variant="outline">
                {t("lineBreakManager.removeBreaks")}
              </Button>
              <Button onClick={removeAllLineBreaks} variant="outline">
                {t("lineBreakManager.removeAllBreaks")}
              </Button>
              <Button variant="outline" onClick={reset}>
                <RotateCcw className="w-4 h-4 mr-2" />
                {t("common.reset")}
              </Button>
            </div>
          </div>

          {outputText && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="output">{t("lineBreakManager.outputLabel")}</Label>
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

export default LineBreakManager;
