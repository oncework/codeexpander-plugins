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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@codeexpander/dev-tools-ui";
import { Copy, Globe, Type, RefreshCw, ArrowUpDown } from "lucide-react";
import { useI18n } from "../context";
import { showToast, showErrorToast, copyToClipboard } from "../toast";

const TextToUnicode = () => {
  const { t } = useI18n();
  const [textInput, setTextInput] = useState("");
  const [unicodeInput, setUnicodeInput] = useState("");
  const [textResult, setTextResult] = useState("");
  const [unicodeResult, setUnicodeResult] = useState("");
  const [unicodeFormat, setUnicodeFormat] = useState("U+");

  const textToUnicode = () => {
    try {
      let result = "";
      for (let i = 0; i < textInput.length; i++) {
        const codePoint = textInput.codePointAt(i);
        if (codePoint !== undefined) {
          const hex = codePoint.toString(16).toUpperCase().padStart(4, "0");
          switch (unicodeFormat) {
            case "U+":
              result += `U+${hex} `;
              break;
            case "\\u":
              result += `\\u${hex} `;
              break;
            case "&#x":
              result += `&#x${hex}; `;
              break;
            case "0x":
              result += `0x${hex} `;
              break;
            default:
              result += `U+${hex} `;
          }
          if (codePoint > 0xffff) i++;
        }
      }
      setUnicodeResult(result.trim());
      showToast(t("textToUnicode.toastSuccessToUnicode"));
    } catch {
      showErrorToast(t("common.error"), t("textToUnicode.errorToUnicode"));
    }
  };

  const unicodeToText = () => {
    try {
      const unicodePattern = /(?:U\+|\\u|&#x|0x)([0-9A-Fa-f]+);?/g;
      let result = "";
      let match;
      while ((match = unicodePattern.exec(unicodeInput)) !== null) {
        const codePoint = parseInt(match[1], 16);
        result += String.fromCodePoint(codePoint);
      }
      if (result === "") throw new Error("No valid Unicode sequences found");
      setTextResult(result);
      showToast(t("textToUnicode.toastSuccessToText"));
    } catch {
      showErrorToast(t("common.error"), t("textToUnicode.errorInvalidUnicode"));
    }
  };

  const clearAll = () => {
    setTextInput("");
    setUnicodeInput("");
    setTextResult("");
    setUnicodeResult("");
  };

  const swapInputs = () => {
    const tempText = textInput;
    const tempUnicode = unicodeInput;
    setTextInput(textResult);
    setUnicodeInput(unicodeResult);
    setTextResult(tempText);
    setUnicodeResult(tempUnicode);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            <CardTitle>{t("textToUnicode.title")}</CardTitle>
          </div>
          <CardDescription>
            {t("textToUnicode.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="text-to-unicode" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="text-to-unicode">{t("textToUnicode.toUnicode")}</TabsTrigger>
              <TabsTrigger value="unicode-to-text">{t("textToUnicode.toText")}</TabsTrigger>
            </TabsList>
            <TabsContent value="text-to-unicode" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="unicode-format">{t("textToUnicode.unicodeFormatLabel")}</Label>
                <Select value={unicodeFormat} onValueChange={setUnicodeFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="U+">{t("textToUnicode.formatU")}</SelectItem>
                    <SelectItem value="\\u">{t("textToUnicode.formatUEscaped")}</SelectItem>
                    <SelectItem value="&#x">{t("textToUnicode.formatHtml")}</SelectItem>
                    <SelectItem value="0x">{t("textToUnicode.formatHex")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="text-input">{t("textToUnicode.textInput")}</Label>
                <Textarea
                  id="text-input"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder={t("textToUnicode.placeholderText")}
                  className="min-h-[120px]"
                />
              </div>
              <Button onClick={textToUnicode} className="w-full">
                <Globe className="h-4 w-4 mr-2" />
                {t("textToUnicode.toUnicode")}
              </Button>
              {unicodeResult && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>{t("textToUnicode.unicodeOutput")}</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(unicodeResult, t("common.copied"))}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <Textarea
                    value={unicodeResult}
                    readOnly
                    className="min-h-[120px] font-mono text-sm"
                  />
                </div>
              )}
            </TabsContent>
            <TabsContent value="unicode-to-text" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="unicode-input">{t("textToUnicode.unicodeInput")}</Label>
                <Textarea
                  id="unicode-input"
                  value={unicodeInput}
                  onChange={(e) => setUnicodeInput(e.target.value)}
                  placeholder={t("textToUnicode.placeholderUnicode")}
                  className="min-h-[120px] font-mono text-sm"
                />
              </div>
              <Button onClick={unicodeToText} className="w-full">
                <Type className="h-4 w-4 mr-2" />
                {t("textToUnicode.toText")}
              </Button>
              {textResult && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>{t("textToUnicode.textOutput")}</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(textResult, t("common.copied"))}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <Textarea value={textResult} readOnly className="min-h-[120px]" />
                </div>
              )}
            </TabsContent>
          </Tabs>
          <div className="flex flex-wrap gap-3">
            <Button onClick={swapInputs} variant="outline" className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4" />
              {t("textToUnicode.swap")}
            </Button>
            <Button onClick={clearAll} variant="outline" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              {t("textToUnicode.clearAll")}
            </Button>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
            <div><strong>{t("textToUnicode.tipsTitle")}</strong></div>
            <div>• {t("textToUnicode.tip1")}</div>
            <div>• {t("textToUnicode.tip2")}</div>
            <div>• {t("textToUnicode.tip3")}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TextToUnicode;
