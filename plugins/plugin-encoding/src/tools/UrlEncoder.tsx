import React, { useState } from "react";
import { Textarea, Button, Card, CardContent } from "@codeexpander/dev-tools-ui";
import { useI18n } from "../context";

const UrlEncoder = () => {
  const { t } = useI18n();
  const [input, setInput] = useState("");
  const [encoded, setEncoded] = useState("");
  const [decoded, setDecoded] = useState("");

  const encode = () => {
    try {
      setEncoded(encodeURIComponent(input));
    } catch {
      setDecoded(t("urlEncoder.errorEncode"));
    }
  };

  const decode = () => {
    try {
      setDecoded(decodeURIComponent(input));
    } catch {
      setDecoded(t("urlEncoder.errorDecode"));
    }
  };

  const copy = (text: string) => {
    if (window.__codeexpander?.writeClipboard) {
      window.__codeexpander.writeClipboard(text);
      window.__codeexpander.showToast?.(t("common.copied"));
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">{t("urlEncoder.inputLabel")}</label>
        <Textarea
          placeholder={t("urlEncoder.inputPlaceholder")}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="min-h-[100px]"
        />
      </div>
      <div className="flex gap-3">
        <Button onClick={encode} disabled={!input} className="flex-1">{t("urlEncoder.encode")}</Button>
        <Button onClick={decode} disabled={!input} className="flex-1">{t("urlEncoder.decode")}</Button>
      </div>
      {encoded && (
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 font-mono text-sm bg-slate-50 dark:bg-slate-800 p-3 rounded border break-all">{encoded}</div>
              <Button variant="outline" size="sm" onClick={() => copy(encoded)}>{t("common.copy")}</Button>
            </div>
          </CardContent>
        </Card>
      )}
      {decoded && (
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 font-mono text-sm bg-slate-50 dark:bg-slate-800 p-3 rounded border break-all">{decoded}</div>
              <Button variant="outline" size="sm" onClick={() => copy(decoded)}>{t("common.copy")}</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UrlEncoder;
