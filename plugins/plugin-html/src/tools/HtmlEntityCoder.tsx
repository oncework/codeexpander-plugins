import React, { useState } from "react";
import { Button } from "@codeexpander/dev-tools-ui";
import { Card, CardContent } from "@codeexpander/dev-tools-ui";
import { Textarea } from "@codeexpander/dev-tools-ui";
import { Copy, Download, Shield, Unlock } from "lucide-react";
import { showToast, showErrorToast } from "../toast";
import { useI18n } from "../context";

const HtmlEntityCoder = () => {
  const { t } = useI18n();
  const [input, setInput] = useState("");
  const [encodedOutput, setEncodedOutput] = useState("");
  const [decodedOutput, setDecodedOutput] = useState("");

  const htmlEntities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
    "¡": "&iexcl;",
    "¢": "&cent;",
    "£": "&pound;",
    "¤": "&curren;",
    "¥": "&yen;",
    "¦": "&brvbar;",
    "§": "&sect;",
    "¨": "&uml;",
    "©": "&copy;",
    "ª": "&ordf;",
    "«": "&laquo;",
    "¬": "&not;",
    "®": "&reg;",
    "¯": "&macr;",
    "°": "&deg;",
    "±": "&plusmn;",
    "²": "&sup2;",
    "³": "&sup3;",
    "´": "&acute;",
    "µ": "&micro;",
    "¶": "&para;",
    "·": "&middot;",
    "¸": "&cedil;",
    "¹": "&sup1;",
    "º": "&ordm;",
    "»": "&raquo;",
    "¼": "&frac14;",
    "½": "&frac12;",
    "¾": "&frac34;",
    "¿": "&iquest;",
    " ": "&nbsp;",
  };

  const encodeHtmlEntities = () => {
    if (!input.trim()) {
      showErrorToast(t("common.error"), t("htmlEntityCoder.errorEncode"));
      return;
    }

    let encoded = input;
    Object.entries(htmlEntities).forEach(([char, entity]) => {
      encoded = encoded.replace(
        new RegExp(char.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
        entity
      );
    });
    encoded = encoded.replace(/[\u0080-\uFFFF]/g, (match) => {
      return "&#" + match.charCodeAt(0) + ";";
    });

    setEncodedOutput(encoded);
    showToast(t("htmlEntityCoder.toastEncoded"));
  };

  const decodeHtmlEntities = () => {
    if (!input.trim()) {
      showErrorToast(t("common.error"), t("htmlEntityCoder.errorDecode"));
      return;
    }

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = input;
    const decoded = tempDiv.textContent || (tempDiv as HTMLElement).innerText || "";

    setDecodedOutput(decoded);
    showToast(t("htmlEntityCoder.toastDecoded"));
  };

  const copyToClipboard = async (text: string, toastMsg: string) => {
    if (!text) return;
    try {
      if (typeof (window as any).__codeexpander?.writeClipboard === "function") {
        (window as any).__codeexpander.writeClipboard(text);
      } else {
        await navigator.clipboard.writeText(text);
      }
      showToast(toastMsg);
    } catch {
      showErrorToast(t("common.error"), t("common.errorCopyFailed"));
    }
  };

  const downloadFile = (content: string, filename: string) => {
    if (!content) return;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">{t("htmlEntityCoder.inputLabel")}</label>
          <Textarea
            placeholder={t("htmlEntityCoder.placeholder")}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-32 text-sm"
          />
        </div>

        <div className="flex gap-2">
          <Button
            onClick={encodeHtmlEntities}
            disabled={!input.trim()}
            className="flex-1"
          >
            <Shield className="w-4 h-4 mr-2" />
            {t("htmlEntityCoder.encodeBtn")}
          </Button>
          <Button
            onClick={decodeHtmlEntities}
            disabled={!input.trim()}
            variant="outline"
            className="flex-1"
          >
            <Unlock className="w-4 h-4 mr-2" />
            {t("htmlEntityCoder.decodeBtn")}
          </Button>
        </div>
      </div>

      {encodedOutput && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium">{t("htmlEntityCoder.encodedLabel")}</label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(encodedOutput, t("htmlEntityCoder.encodedCopiedToast"))}
              >
                <Copy className="w-4 h-4 mr-1" />
                {t("common.copy")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadFile(encodedOutput, "encoded.txt")}
              >
                <Download className="w-4 h-4 mr-1" />
                {t("common.download")}
              </Button>
            </div>
          </div>
          <Textarea
            value={encodedOutput}
            readOnly
            className="min-h-32 font-mono text-sm bg-slate-50"
          />
        </div>
      )}

      {decodedOutput && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium">{t("htmlEntityCoder.decodedLabel")}</label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(decodedOutput, t("htmlEntityCoder.decodedCopiedToast"))}
              >
                <Copy className="w-4 h-4 mr-1" />
                {t("common.copy")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadFile(decodedOutput, "decoded.txt")}
              >
                <Download className="w-4 h-4 mr-1" />
                {t("common.download")}
              </Button>
            </div>
          </div>
          <Textarea
            value={decodedOutput}
            readOnly
            className="min-h-32 text-sm bg-slate-50"
          />
        </div>
      )}

      <Card>
        <CardContent className="p-6">
          <div className="text-sm text-slate-600">
            <p>
              <strong>{t("htmlEntityCoder.commonTitle")}</strong>
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-xs font-mono">
              <div>&amp; → &amp;amp;</div>
              <div>&lt; → &amp;lt;</div>
              <div>&gt; → &amp;gt;</div>
              <div>" → &amp;quot;</div>
              <div>' → &amp;#39;</div>
              <div>© → &amp;copy;</div>
              <div>® → &amp;reg;</div>
              <div>  → &amp;nbsp;</div>
            </div>
            <p className="mt-4">
              <strong>{t("htmlEntityCoder.useCasesTitle")}</strong>
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>{t("htmlEntityCoder.li1")}</li>
              <li>{t("htmlEntityCoder.li2")}</li>
              <li>{t("htmlEntityCoder.li3")}</li>
              <li>{t("htmlEntityCoder.li4")}</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HtmlEntityCoder;
