import React, { useState } from "react";
import { Button } from "@codeexpander/dev-tools-ui";
import { Card, CardContent } from "@codeexpander/dev-tools-ui";
import { Textarea } from "@codeexpander/dev-tools-ui";
import { Copy, Download, FileText } from "lucide-react";
import { showToast, showErrorToast } from "../toast";
import { useI18n } from "../context";

const HtmlToMarkdown = () => {
  const { t } = useI18n();
  const [htmlInput, setHtmlInput] = useState("");
  const [markdown, setMarkdown] = useState("");

  const convertNode = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent?.replace(/\s+/g, " ") || "";
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return "";
    }

    const element = node as Element;
    const tagName = element.tagName.toLowerCase();
    const children = Array.from(element.childNodes).map(convertNode).join("");

    switch (tagName) {
      case "h1":
        return `# ${children}\n\n`;
      case "h2":
        return `## ${children}\n\n`;
      case "h3":
        return `### ${children}\n\n`;
      case "h4":
        return `#### ${children}\n\n`;
      case "h5":
        return `##### ${children}\n\n`;
      case "h6":
        return `###### ${children}\n\n`;
      case "p":
        return `${children}\n\n`;
      case "br":
        return "\n";
      case "strong":
      case "b":
        return `**${children}**`;
      case "em":
      case "i":
        return `*${children}*`;
      case "code":
        return `\`${children}\``;
      case "pre":
        return `\`\`\`\n${children}\n\`\`\`\n\n`;
      case "blockquote":
        return `> ${children}\n\n`;
      case "a": {
        const href = element.getAttribute("href") || "#";
        return `[${children}](${href})`;
      }
      case "img": {
        const src = element.getAttribute("src") || "";
        const alt = element.getAttribute("alt") || "";
        return `![${alt}](${src})`;
      }
      case "ul":
        return `${children}\n`;
      case "ol":
        return `${children}\n`;
      case "li": {
        const parent = element.parentElement?.tagName.toLowerCase();
        const marker = parent === "ol" ? "1." : "-";
        return `${marker} ${children}\n`;
      }
      case "hr":
        return "---\n\n";
      case "table":
        return `${children}\n`;
      case "thead":
      case "tbody":
        return children;
      case "tr":
        return `${children}\n`;
      case "th":
      case "td":
        return `| ${children} `;
      default:
        return children;
    }
  };

  const convertToMarkdown = () => {
    if (!htmlInput.trim()) {
      showErrorToast(t("common.error"), t("htmlToMarkdown.errorEnterHtml"));
      return;
    }

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlInput;

    const result = Array.from(tempDiv.childNodes)
      .map(convertNode)
      .join("")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    setMarkdown(result);
    showToast(t("htmlToMarkdown.toastSuccess"));
  };

  const copyToClipboard = async () => {
    if (!markdown) return;
    try {
      if (typeof (window as any).__codeexpander?.writeClipboard === "function") {
        (window as any).__codeexpander.writeClipboard(markdown);
      } else {
        await navigator.clipboard.writeText(markdown);
      }
      showToast(t("htmlToMarkdown.toastCopied"));
    } catch {
      showErrorToast(t("common.error"), t("common.errorCopyFailed"));
    }
  };

  const downloadFile = () => {
    if (!markdown) return;
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "converted.md";
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
          onClick={convertToMarkdown}
          disabled={!htmlInput.trim()}
          className="w-full"
        >
          <FileText className="w-4 h-4 mr-2" />
          {t("htmlToMarkdown.convertBtn")}
        </Button>
      </div>

      {markdown && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium">{t("htmlToMarkdown.outputLabel")}</label>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copyToClipboard}>
                <Copy className="w-4 h-4 mr-1" />
                {t("common.copy")}
              </Button>
              <Button variant="outline" size="sm" onClick={downloadFile}>
                <Download className="w-4 h-4 mr-1" />
                {t("htmlToMarkdown.downloadMd")}
              </Button>
            </div>
          </div>
          <Textarea
            value={markdown}
            readOnly
            className="min-h-96 font-mono text-sm bg-slate-50"
          />
        </div>
      )}

      <Card>
        <CardContent className="p-6">
          <div className="text-sm text-slate-600">
            <p>
              <strong>{t("htmlToMarkdown.supportedTitle")}</strong>
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>{t("htmlToMarkdown.li1")}</li>
              <li>{t("htmlToMarkdown.li2")}</li>
              <li>{t("htmlToMarkdown.li3")}</li>
              <li>{t("htmlToMarkdown.li4")}</li>
              <li>{t("htmlToMarkdown.li5")}</li>
              <li>{t("htmlToMarkdown.li6")}</li>
              <li>{t("htmlToMarkdown.li7")}</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HtmlToMarkdown;
