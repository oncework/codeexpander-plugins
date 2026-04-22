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
import { Copy, FileText, Download, Printer } from "lucide-react";
import { useI18n } from "../context";
import { showToast, showErrorToast, copyToClipboard } from "../toast";

const markdownToHtml = (markdown: string): string => {
  let html = markdown;
  html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");
  html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
  html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
  html = html.replace(/^#### (.*$)/gim, "<h4>$1</h4>");
  html = html.replace(/^##### (.*$)/gim, "<h5>$1</h5>");
  html = html.replace(/^###### (.*$)/gim, "<h6>$1</h6>");
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/__(.*?)__/g, "<strong>$1</strong>");
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
  html = html.replace(/_(.*?)_/g, "<em>$1</em>");
  html = html.replace(/`(.*?)`/g, "<code>$1</code>");
  html = html.replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>");
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');
  html = html.replace(/~~(.*?)~~/g, "<del>$1</del>");
  html = html.replace(/^---$/gm, "<hr>");
  html = html.replace(/^\*\*\*$/gm, "<hr>");
  html = html.replace(/\n\n/g, "</p><p>");
  html = html.replace(/\n/g, "<br>");
  if (html && !html.startsWith("<")) html = "<p>" + html + "</p>";
  html = html.replace(/^\* (.+)$/gm, "<li>$1</li>");
  html = html.replace(/^- (.+)$/gm, "<li>$1</li>");
  html = html.replace(/^\+ (.+)$/gm, "<li>$1</li>");
  html = html.replace(/^\d+\. (.+)$/gm, "<li>$1</li>");
  html = html.replace(/(<li>.*<\/li>)/gs, (match) => "<ul>" + match + "</ul>");
  html = html.replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>");
  return html;
};

const MarkdownToHtmlConverter = () => {
  const { t } = useI18n();
  const [markdownInput, setMarkdownInput] = useState("");
  const [htmlOutput, setHtmlOutput] = useState("");

  const convertToHtml = () => {
    try {
      if (!markdownInput.trim()) {
        showErrorToast(t("common.error"), t("markdownToHtmlConverter.errorEnter"));
        return;
      }
      setHtmlOutput(markdownToHtml(markdownInput));
      showToast(t("markdownToHtmlConverter.toastSuccess"));
    } catch {
      showErrorToast(t("common.error"), t("markdownToHtmlConverter.errorInvalid"));
    }
  };

  const copyToClipboardHandler = () => {
    copyToClipboard(htmlOutput, t("common.copied"));
  };

  const fullHtmlDoc = (body: string) =>
    `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Converted Document</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
        h1, h2, h3, h4, h5, h6 { color: #333; }
        code { background-color: #f4f4f4; padding: 2px 4px; border-radius: 3px; }
        pre { background-color: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto; }
        blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 20px; color: #666; }
        @media print { body { margin: 0; } }
    </style>
</head>
<body>
${body}
</body>
</html>`;

  const downloadFile = () => {
    const blob = new Blob([fullHtmlDoc(htmlOutput)], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "converted.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const printAsPdf = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(fullHtmlDoc(htmlOutput));
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  const clearAll = () => {
    setMarkdownInput("");
    setHtmlOutput("");
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <CardTitle>{t("markdownToHtmlConverter.title")}</CardTitle>
          </div>
          <CardDescription>
            {t("markdownToHtmlConverter.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="markdown-input">Markdown Input</Label>
              <Textarea
                id="markdown-input"
                value={markdownInput}
                onChange={(e) => setMarkdownInput(e.target.value)}
                placeholder={"# Hello World\n\nThis is **bold** and this is *italic*.\n\n- List item 1\n- List item 2\n\n[Link](https://example.com)\n\n`inline code`\n\n```\ncode block\n```"}
                className="min-h-[300px] font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>HTML Output</Label>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyToClipboardHandler}
                    disabled={!htmlOutput}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={downloadFile}
                    disabled={!htmlOutput}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={printAsPdf}
                    disabled={!htmlOutput}
                  >
                    <Printer className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Textarea
                value={htmlOutput}
                readOnly
                className="min-h-[300px] font-mono text-sm"
                placeholder="HTML output will appear here..."
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={convertToHtml} className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Convert to HTML
            </Button>
            <Button onClick={clearAll} variant="outline">
              Clear All
            </Button>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
            <div><strong>Tips:</strong></div>
            <div>• Paste Markdown content in the input field</div>
            <div>• Supports headers, bold, italic, links, images, lists, and code blocks</div>
            <div>• Use the print button to generate a PDF from the HTML output</div>
            <div>• Download creates a complete HTML file with styling</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarkdownToHtmlConverter;
