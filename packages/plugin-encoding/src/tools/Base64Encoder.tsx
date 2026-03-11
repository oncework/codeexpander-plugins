import React, { useState } from "react";
import { Textarea, Button, Card, CardContent } from "@codeexpander/dev-tools-ui";
import { useI18n } from "../context";

const Base64Encoder = () => {
  const { t } = useI18n();
  const [input, setInput] = useState("");
  const [encoded, setEncoded] = useState("");
  const [decoded, setDecoded] = useState("");

  const encode = () => {
    try {
      setEncoded(btoa(input));
    } catch {
      setEncoded(t("base64Encoder.errorEncode"));
    }
  };

  const decode = () => {
    try {
      setDecoded(atob(input));
    } catch {
      setDecoded(t("base64Encoder.errorDecode"));
    }
  };

  const copyToClipboard = (text: string) => {
    if (window.__codeexpander?.writeClipboard) {
      window.__codeexpander.writeClipboard(text);
      window.__codeexpander.showToast?.(t("common.copied"));
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <label className="block text-sm font-medium mb-3">{t("base64Encoder.inputLabel")}</label>
        <Textarea
          placeholder={t("base64Encoder.inputPlaceholder")}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="min-h-[100px]"
        />
      </div>

      <div className="flex gap-3">
        <Button onClick={encode} disabled={!input} className="flex-1">
          {t("base64Encoder.encode")}
        </Button>
        <Button onClick={decode} disabled={!input} className="flex-1">
          {t("base64Encoder.decode")}
        </Button>
      </div>

      {encoded && (
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <div className="font-medium text-sm text-slate-600 mb-3">
                  {t("base64Encoder.encodedLabel")}
                </div>
                <div className="font-mono text-sm bg-slate-50 dark:bg-slate-800 p-4 rounded border break-all">
                  {encoded}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(encoded)}
              >
                {t("common.copy")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {decoded && (
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <div className="font-medium text-sm text-slate-600 mb-3">
                  {t("base64Encoder.decodedLabel")}
                </div>
                <div className="font-mono text-sm bg-slate-50 dark:bg-slate-800 p-4 rounded border break-all">
                  {decoded}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(decoded)}
              >
                {t("common.copy")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Base64Encoder;
