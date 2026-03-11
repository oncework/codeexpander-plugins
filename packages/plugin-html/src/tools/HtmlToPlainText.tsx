import React, { useState } from "react";
import { Button } from "@codeexpander/dev-tools-ui";
import { Card, CardContent } from "@codeexpander/dev-tools-ui";
import { Textarea } from "@codeexpander/dev-tools-ui";
import { Copy, Download, FileText } from "lucide-react";
import { showToast, showErrorToast } from "../toast";
import { useI18n } from "../context";

const HtmlToPlainText = () => {
  const { t } = useI18n();
  const [htmlInput, setHtmlInput] = useState("");
  const [plainText, setPlainText] = useState("");

  const convertToPlainText = () => {
    if (!htmlInput.trim()) {
      showErrorToast(t("common.error"), t("htmlToPlainText.errorEnterHtml"));
      return;
    }

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlInput;

    let text = "";

    const extractText = (node: Node): void => {
      if (node.nodeType === Node.TEXT_NODE) {
        const content = node.textContent?.trim();
        if (content) {
          text += content + " ";
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        const tagName = element.tagName.toLowerCase();

        if (
          ["p", "div", "br", "h1", "h2", "h3", "h4", "h5", "h6", "li"].includes(
            tagName
          )
        ) {
          if (tagName === "br") {
            text += "\n";
          } else {
            Array.from(element.childNodes).forEach(extractText);
            text += "\n";
            return;
          }
        }

        Array.from(element.childNodes).forEach(extractText);
      }
    };

    Array.from(tempDiv.childNodes).forEach(extractText);

    const cleanText = text
      .replace(/\s+/g, " ")
      .replace(/\n\s+/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    setPlainText(cleanText);
    showToast(t("htmlToPlainText.toastSuccess"));
  };

  const copyToClipboard = async () => {
    if (!plainText) return;
    try {
      if (typeof (window as any).__codeexpander?.writeClipboard === "function") {
        (window as any).__codeexpander.writeClipboard(plainText);
      } else {
        await navigator.clipboard.writeText(plainText);
      }
      showToast(t("htmlToPlainText.toastCopied"));
    } catch {
      showErrorToast(t("common.error"), t("common.errorCopyFailed"));
    }
  };

  const downloadFile = () => {
    if (!plainText) return;
    const blob = new Blob([plainText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "converted.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">{t("common.htmlInputLabel")}</label>
          <Textarea
            placeholder={t("common.placeholderHtml")}
            value={htmlInput}
            onChange={(e) => setHtmlInput(e.target.value)}
            className="min-h-48 font-mono text-sm"
          />
        </div>

        <Button
          onClick={convertToPlainText}
          disabled={!htmlInput.trim()}
          className="w-full"
        >
          <FileText className="w-4 h-4 mr-2" />
          {t("htmlToPlainText.convertBtn")}
        </Button>
      </div>

      {plainText && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium">{t("htmlToPlainText.outputLabel")}</label>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copyToClipboard}>
                <Copy className="w-4 h-4 mr-1" />
                {t("common.copy")}
              </Button>
              <Button variant="outline" size="sm" onClick={downloadFile}>
                <Download className="w-4 h-4 mr-1" />
                {t("htmlToPlainText.downloadTxt")}
              </Button>
            </div>
          </div>
          <Textarea
            value={plainText}
            readOnly
            className="min-h-96 text-sm bg-slate-50"
          />
        </div>
      )}

      <Card>
        <CardContent className="p-6">
          <div className="text-sm text-slate-600">
            <p>
              <strong>{t("htmlToPlainText.featuresTitle")}</strong>
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>{t("htmlToPlainText.li1")}</li>
              <li>{t("htmlToPlainText.li2")}</li>
              <li>{t("htmlToPlainText.li3")}</li>
              <li>{t("htmlToPlainText.li4")}</li>
              <li>{t("htmlToPlainText.li5")}</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HtmlToPlainText;
