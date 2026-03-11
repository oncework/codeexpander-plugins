import React, { useState } from "react";
import { Button } from "@codeexpander/dev-tools-ui";
import { Card, CardContent } from "@codeexpander/dev-tools-ui";
import { Textarea } from "@codeexpander/dev-tools-ui";
import { Copy, Download, Sparkles } from "lucide-react";
import { showToast, showErrorToast } from "../toast";
import { useI18n } from "../context";

const HtmlBeautifier = () => {
  const { t } = useI18n();
  const [htmlInput, setHtmlInput] = useState("");
  const [beautifiedHtml, setBeautifiedHtml] = useState("");

  const beautifyHtml = () => {
    if (!htmlInput.trim()) {
      showErrorToast(t("common.error"), t("htmlBeautifier.errorEnterHtml"));
      return;
    }

    let formatted = htmlInput
      .replace(/\s+/g, " ")
      .replace(/>\s+</g, "><")
      .trim();

    let indentLevel = 0;
    const indentSize = 2;
    let result = "";
    let inTag = false;
    let tagContent = "";

    const selfClosingTags = [
      "area", "base", "br", "col", "embed", "hr", "img", "input", "link",
      "meta", "param", "source", "track", "wbr",
    ];
    const inlineTags = [
      "a", "abbr", "b", "bdi", "bdo", "br", "button", "cite", "code", "dfn",
      "em", "i", "kbd", "mark", "q", "s", "samp", "small", "span", "strong",
      "sub", "sup", "time", "u", "var",
    ];

    for (let i = 0; i < formatted.length; i++) {
      const char = formatted[i];

      if (char === "<") {
        if (tagContent.trim() && !inTag) {
          result += tagContent.trim();
        }
        tagContent = "";
        inTag = true;

        if (formatted[i + 1] === "/") {
          indentLevel = Math.max(0, indentLevel - 1);
          result += "\n" + " ".repeat(indentLevel * indentSize);
        } else {
          result += "\n" + " ".repeat(indentLevel * indentSize);
        }

        result += char;
      } else if (char === ">") {
        result += char;

        const tagMatch = tagContent.match(/^\/?\s*([a-zA-Z][a-zA-Z0-9]*)/);
        const tagName = tagMatch ? tagMatch[1].toLowerCase() : "";

        if (
          !tagContent.startsWith("/") &&
          !tagContent.endsWith("/") &&
          !selfClosingTags.includes(tagName)
        ) {
          if (!inlineTags.includes(tagName)) {
            indentLevel++;
          }
        }

        inTag = false;
        tagContent = "";
      } else {
        if (inTag) {
          tagContent += char;
        } else {
          tagContent += char;
        }
        result += char;
      }
    }

    const finalResult = result
      .split("\n")
      .map((line) => line.trimEnd())
      .filter((line, index, array) => {
        if (line.trim() === "") {
          const nextLine = array[index + 1];
          const prevLine = array[index - 1];
          return !(
            nextLine &&
            prevLine &&
            nextLine.trim().startsWith("<") &&
            prevLine.trim().endsWith(">")
          );
        }
        return true;
      })
      .join("\n")
      .trim();

    setBeautifiedHtml(finalResult);
    showToast(t("htmlBeautifier.toastSuccess"));
  };

  const copyToClipboard = async () => {
    if (!beautifiedHtml) return;
    try {
      if (typeof (window as any).__codeexpander?.writeClipboard === "function") {
        (window as any).__codeexpander.writeClipboard(beautifiedHtml);
      } else {
        await navigator.clipboard.writeText(beautifiedHtml);
      }
      showToast(t("htmlBeautifier.toastCopied"));
    } catch {
      showErrorToast(t("common.error"), t("common.errorCopyFailed"));
    }
  };

  const downloadFile = () => {
    if (!beautifiedHtml) return;
    const blob = new Blob([beautifiedHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "beautified.html";
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
            placeholder={t("htmlBeautifier.placeholder")}
            value={htmlInput}
            onChange={(e) => setHtmlInput(e.target.value)}
            className="min-h-48 font-mono text-sm"
          />
        </div>

        <Button
          onClick={beautifyHtml}
          disabled={!htmlInput.trim()}
          className="w-full"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          {t("htmlBeautifier.beautifyBtn")}
        </Button>
      </div>

      {beautifiedHtml && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium">{t("htmlBeautifier.beautifiedLabel")}</label>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copyToClipboard}>
                <Copy className="w-4 h-4 mr-1" />
                {t("common.copy")}
              </Button>
              <Button variant="outline" size="sm" onClick={downloadFile}>
                <Download className="w-4 h-4 mr-1" />
                {t("common.download")}
              </Button>
            </div>
          </div>
          <Textarea
            value={beautifiedHtml}
            readOnly
            className="min-h-96 font-mono text-sm bg-slate-50"
          />
        </div>
      )}

      <Card>
        <CardContent className="p-6">
          <div className="text-sm text-slate-600">
            <p>
              <strong>{t("htmlBeautifier.featuresTitle")}</strong>
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>{t("htmlBeautifier.feature1")}</li>
              <li>{t("htmlBeautifier.feature2")}</li>
              <li>{t("htmlBeautifier.feature3")}</li>
              <li>{t("htmlBeautifier.feature4")}</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HtmlBeautifier;
