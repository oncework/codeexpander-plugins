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
} from "@codeexpander/dev-tools-ui";
import { Copy, Code } from "lucide-react";
import { useI18n } from "../context";
import { showErrorToast, copyToClipboard } from "../toast";

const Base64StringEncoder = () => {
  const { t } = useI18n();
  const [plainText, setPlainText] = useState("");
  const [encodedText, setEncodedText] = useState("");

  const encode = () => {
    try {
      const encoded = btoa(unescape(encodeURIComponent(plainText)));
      setEncodedText(encoded);
    } catch {
      showErrorToast(t("common.error"), t("base64StringEncoder.errorEncode"));
    }
  };

  const decode = () => {
    try {
      const decoded = decodeURIComponent(escape(atob(encodedText)));
      setPlainText(decoded);
    } catch {
      showErrorToast(t("common.error"), t("base64StringEncoder.errorDecode"));
    }
  };

  const clear = () => {
    setPlainText("");
    setEncodedText("");
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            <CardTitle>{t("base64StringEncoder.title")}</CardTitle>
          </div>
          <CardDescription>
            {t("base64StringEncoder.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="plain-text">{t("base64StringEncoder.plainText")}</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(plainText, t("common.copied"))}
                  disabled={!plainText}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <Textarea
                id="plain-text"
                value={plainText}
                onChange={(e) => setPlainText(e.target.value)}
                placeholder={t("base64StringEncoder.placeholderEncode")}
                className="min-h-[200px] font-mono text-sm"
              />
              <Button onClick={encode} disabled={!plainText} className="w-full">
                {t("base64StringEncoder.encodeBtn")}
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="encoded-text">{t("base64StringEncoder.encoded")}</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(encodedText, t("common.copied"))}
                  disabled={!encodedText}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <Textarea
                id="encoded-text"
                value={encodedText}
                onChange={(e) => setEncodedText(e.target.value)}
                placeholder={t("base64StringEncoder.placeholderDecode")}
                className="min-h-[200px] font-mono text-sm"
              />
              <Button onClick={decode} disabled={!encodedText} className="w-full">
                {t("base64StringEncoder.decodeBtn")}
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <Button variant="outline" onClick={clear}>
              {t("base64StringEncoder.clearAll")}
            </Button>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">{t("base64StringEncoder.aboutTitle")}</h3>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              {t("base64StringEncoder.aboutText")}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Base64StringEncoder;
