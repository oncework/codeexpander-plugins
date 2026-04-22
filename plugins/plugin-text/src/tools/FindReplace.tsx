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
  Checkbox,
} from "@codeexpander/dev-tools-ui";
import { Copy, RotateCcw } from "lucide-react";
import { useI18n } from "../context";
import { showToast, showErrorToast } from "../toast";

const FindReplace = () => {
  const { t } = useI18n();
  const [inputText, setInputText] = useState("");
  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [useRegex, setUseRegex] = useState(false);
  const [replaceAll, setReplaceAll] = useState(true);

  const performReplace = () => {
    if (!inputText.trim()) {
      showErrorToast(t("common.error"), t("findReplace.errorEnterText"));
      return;
    }

    if (!findText) {
      showErrorToast(t("common.error"), t("findReplace.errorEnterFind"));
      return;
    }

    try {
      let result = inputText;

      if (useRegex) {
        const flags = caseSensitive ? "g" : "gi";
        const regex = new RegExp(
          findText,
          replaceAll ? flags : caseSensitive ? "" : "i"
        );
        result = inputText.replace(regex, replaceText);
      } else {
        if (replaceAll) {
          const searchValue = caseSensitive ? findText : findText.toLowerCase();
          const inputValue = caseSensitive ? inputText : inputText.toLowerCase();

          if (caseSensitive) {
            result = inputText.split(findText).join(replaceText);
          } else {
            const parts = [];
            let lastIndex = 0;
            let index = inputValue.indexOf(searchValue);

            while (index !== -1) {
              parts.push(inputText.substring(lastIndex, index));
              parts.push(replaceText);
              lastIndex = index + findText.length;
              index = inputValue.indexOf(searchValue, lastIndex);
            }
            parts.push(inputText.substring(lastIndex));
            result = parts.join("");
          }
        } else {
          const searchValue = caseSensitive ? findText : findText.toLowerCase();
          const inputValue = caseSensitive ? inputText : inputText.toLowerCase();
          const index = inputValue.indexOf(searchValue);

          if (index !== -1) {
            result =
              inputText.substring(0, index) +
              replaceText +
              inputText.substring(index + findText.length);
          }
        }
      }

      setOutputText(result);
      showToast(t("findReplace.toastCompleted"));
    } catch {
      showErrorToast(
        t("common.error"),
        useRegex ? t("findReplace.errorInvalidRegex") : t("findReplace.errorFailed")
      );
    }
  };

  const copyToClipboard = async () => {
    if (!outputText) {
      showErrorToast(t("common.error"), t("findReplace.errorNoOutput"));
      return;
    }

    if (window.__codeexpander?.writeClipboard) {
      window.__codeexpander.writeClipboard(outputText);
      showToast(t("findReplace.toastCopied"));
    } else {
      try {
        await navigator.clipboard.writeText(outputText);
        showToast(t("findReplace.toastCopied"));
      } catch {
        showErrorToast(t("common.error"), t("findReplace.errorCopyFailed"));
      }
    }
  };

  const reset = () => {
    setInputText("");
    setFindText("");
    setReplaceText("");
    setOutputText("");
    setCaseSensitive(false);
    setUseRegex(false);
    setReplaceAll(true);
  };

  return (
    <div className="p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("findReplace.title")}</CardTitle>
          <CardDescription>
            {t("findReplace.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="findText">{t("findReplace.findLabel")}</Label>
              <Input
                id="findText"
                placeholder={t("findReplace.findPlaceholder")}
                value={findText}
                onChange={(e) => setFindText(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="replaceText">{t("findReplace.replaceLabel")}</Label>
              <Input
                id="replaceText"
                placeholder={t("findReplace.replacePlaceholder")}
                value={replaceText}
                onChange={(e) => setReplaceText(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="caseSensitive"
                checked={caseSensitive}
                onCheckedChange={(checked) => setCaseSensitive(checked === true)}
              />
              <Label htmlFor="caseSensitive">{t("findReplace.caseSensitive")}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="useRegex"
                checked={useRegex}
                onCheckedChange={(checked) => setUseRegex(checked === true)}
              />
              <Label htmlFor="useRegex">{t("findReplace.useRegex")}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="replaceAll"
                checked={replaceAll}
                onCheckedChange={(checked) => setReplaceAll(checked === true)}
              />
              <Label htmlFor="replaceAll">{t("findReplace.replaceAll")}</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="input">{t("findReplace.inputLabel")}</Label>
            <Textarea
              id="input"
              placeholder={t("findReplace.inputPlaceholder")}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[200px] font-mono"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={performReplace} className="flex-1">
              {t("findReplace.findReplaceBtn")}
            </Button>
            <Button variant="outline" onClick={reset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              {t("common.reset")}
            </Button>
          </div>

          {outputText && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="output">{t("findReplace.outputLabel")}</Label>
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

export default FindReplace;
