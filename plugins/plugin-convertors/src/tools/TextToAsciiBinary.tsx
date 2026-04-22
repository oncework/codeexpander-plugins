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
import { Copy, Binary, Type, RefreshCw, ArrowUpDown } from "lucide-react";
import { useI18n } from "../context";
import { showToast, showErrorToast, copyToClipboard } from "../toast";

const TextToAsciiBinary = () => {
  const { t } = useI18n();
  const [textInput, setTextInput] = useState("");
  const [binaryInput, setBinaryInput] = useState("");
  const [textResult, setTextResult] = useState("");
  const [binaryResult, setBinaryResult] = useState("");

  const textToBinary = () => {
    try {
      const binary = textInput
        .split("")
        .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
        .join(" ");
      setBinaryResult(binary);
      showToast("Text converted to binary successfully!");
    } catch {
      showErrorToast("Error", "Failed to convert text to binary");
    }
  };

  const binaryToText = () => {
    try {
      const cleanBinary = binaryInput.replace(/\s+/g, "");
      if (cleanBinary.length % 8 !== 0) {
        throw new Error("Binary string length must be divisible by 8");
      }
      const text =
        cleanBinary
          .match(/.{8}/g)
          ?.map((byte) => String.fromCharCode(parseInt(byte, 2)))
          .join("") ?? "";
      setTextResult(text);
      showToast(t("textToAsciiBinary.toastSuccessToText"));
    } catch {
      showErrorToast(t("common.error"), t("textToAsciiBinary.errorInvalidBinary"));
    }
  };

  const clearAll = () => {
    setTextInput("");
    setBinaryInput("");
    setTextResult("");
    setBinaryResult("");
  };

  const swapInputs = () => {
    const tempText = textInput;
    const tempBinary = binaryInput;
    setTextInput(textResult);
    setBinaryInput(binaryResult);
    setTextResult(tempText);
    setBinaryResult(tempBinary);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Binary className="h-5 w-5" />
            <CardTitle>{t("textToAsciiBinary.title")}</CardTitle>
          </div>
          <CardDescription>
            {t("textToAsciiBinary.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="text-to-binary" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="text-to-binary">{t("textToAsciiBinary.toBinary")}</TabsTrigger>
              <TabsTrigger value="binary-to-text">{t("textToAsciiBinary.toText")}</TabsTrigger>
            </TabsList>
            <TabsContent value="text-to-binary" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="text-input">{t("textToAsciiBinary.textInput")}</Label>
                <Textarea
                  id="text-input"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder={t("textToAsciiBinary.placeholderText")}
                  className="min-h-[120px]"
                />
              </div>
              <Button onClick={textToBinary} className="w-full">
                <Binary className="h-4 w-4 mr-2" />
                {t("textToAsciiBinary.convertToBinary")}
              </Button>
              {binaryResult && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>{t("textToAsciiBinary.binaryOutput")}</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(binaryResult, t("common.copied"))}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <Textarea
                    value={binaryResult}
                    readOnly
                    className="min-h-[120px] font-mono text-sm"
                  />
                </div>
              )}
            </TabsContent>
            <TabsContent value="binary-to-text" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="binary-input">{t("textToAsciiBinary.binaryInput")}</Label>
                <Textarea
                  id="binary-input"
                  value={binaryInput}
                  onChange={(e) => setBinaryInput(e.target.value)}
                  placeholder={t("textToAsciiBinary.placeholderBinary")}
                  className="min-h-[120px] font-mono text-sm"
                />
              </div>
              <Button onClick={binaryToText} className="w-full">
                <Type className="h-4 w-4 mr-2" />
                {t("textToAsciiBinary.convertToText")}
              </Button>
              {textResult && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>{t("textToAsciiBinary.textOutput")}</Label>
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
              {t("textToAsciiBinary.swap")}
            </Button>
            <Button onClick={clearAll} variant="outline" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              {t("textToAsciiBinary.clearAll")}
            </Button>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
            <div><strong>{t("textToAsciiBinary.tipsTitle")}</strong></div>
            <div>• {t("textToAsciiBinary.tip1")}</div>
            <div>• {t("textToAsciiBinary.tip2")}</div>
            <div>• {t("textToAsciiBinary.tip3")}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TextToAsciiBinary;
