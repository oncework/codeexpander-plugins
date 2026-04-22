import { useState, useRef, useEffect } from "react";
import { Button } from "@codeexpander/dev-tools-ui";
import { Textarea } from "@codeexpander/dev-tools-ui";
import { Card, CardContent, CardHeader, CardTitle } from "@codeexpander/dev-tools-ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@codeexpander/dev-tools-ui";
import { Separator } from "@codeexpander/dev-tools-ui";
import {
  Copy,
  Download,
  Trash2,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Link,
  Image,
  Undo,
  Redo,
} from "lucide-react";
import { showToast, showErrorToast } from "../toast";
import { useI18n } from "../context";

const HtmlWysiwygEditor = () => {
  const { t } = useI18n();
  const [htmlContent, setHtmlContent] = useState(`<h1>Welcome to HTML WYSIWYG Editor</h1>
<p>This is a <strong>rich text editor</strong> that generates HTML code instantly.</p>
<ul>
  <li>Use the formatting toolbar above</li>
  <li>Switch between visual and code editing</li>
  <li>See real-time preview of your content</li>
</ul>
<p><em>Start editing to see the magic happen!</em></p>`);

  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== htmlContent) {
      editorRef.current.innerHTML = htmlContent;
    }
  }, [htmlContent]);

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    updateHtmlFromEditor();
  };

  const updateHtmlFromEditor = () => {
    if (editorRef.current) {
      setHtmlContent(editorRef.current.innerHTML);
    }
  };

  const insertLink = () => {
    const url = prompt(t("htmlWysiwygEditor.enterUrl"));
    if (url) {
      executeCommand("createLink", url);
    }
  };

  const insertImage = () => {
    const url = prompt(t("htmlWysiwygEditor.enterImageUrl"));
    if (url) {
      executeCommand("insertImage", url);
    }
  };

  const copyToClipboard = async () => {
    try {
      if (typeof (window as any).__codeexpander?.writeClipboard === "function") {
        (window as any).__codeexpander.writeClipboard(htmlContent);
      } else {
        await navigator.clipboard.writeText(htmlContent);
      }
      showToast(t("htmlWysiwygEditor.toastCopied"));
    } catch {
      showErrorToast(t("htmlWysiwygEditor.toastCopyFailed"), t("htmlWysiwygEditor.toastCopyFailedDesc"));
    }
  };

  const downloadHtml = () => {
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WYSIWYG Editor Output</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
    </style>
</head>
<body>
    ${htmlContent}
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "wysiwyg-editor-output.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(t("htmlWysiwygEditor.toastDownload"));
  };

  const clearContent = () => {
    if (confirm(t("htmlWysiwygEditor.confirmClear"))) {
      setHtmlContent("");
      if (editorRef.current) {
        editorRef.current.innerHTML = "";
      }
    }
  };

  const formatButtons = [
    { command: "bold", icon: Bold, titleKey: "bold" as const },
    { command: "italic", icon: Italic, titleKey: "italic" as const },
    { command: "underline", icon: Underline, titleKey: "underline" as const },
    { command: "justifyLeft", icon: AlignLeft, titleKey: "alignLeft" as const },
    { command: "justifyCenter", icon: AlignCenter, titleKey: "alignCenter" as const },
    { command: "justifyRight", icon: AlignRight, titleKey: "alignRight" as const },
    { command: "insertUnorderedList", icon: List, titleKey: "bulletList" as const },
    { command: "insertOrderedList", icon: ListOrdered, titleKey: "numberedList" as const },
    { command: "undo", icon: Undo, titleKey: "undo" as const },
    { command: "redo", icon: Redo, titleKey: "redo" as const },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {t("htmlWysiwygEditor.title")}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {t("htmlWysiwygEditor.subtitle")}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button onClick={copyToClipboard} variant="outline" size="sm">
              <Copy className="h-4 w-4 mr-2" />
              {t("htmlWysiwygEditor.copyHtml")}
            </Button>
            <Button onClick={downloadHtml} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              {t("htmlWysiwygEditor.download")}
            </Button>
            <Button onClick={clearContent} variant="outline" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              {t("htmlWysiwygEditor.clear")}
            </Button>
          </div>

          <Tabs defaultValue="editor" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="editor">{t("htmlWysiwygEditor.tabEditor")}</TabsTrigger>
              <TabsTrigger value="code">{t("htmlWysiwygEditor.tabCode")}</TabsTrigger>
              <TabsTrigger value="preview">{t("htmlWysiwygEditor.tabPreview")}</TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="space-y-4">
              <div className="flex flex-wrap gap-1 p-2 border border-gray-200 rounded-md bg-gray-50">
                {formatButtons.map((button) => (
                  <Button
                    key={button.command}
                    variant="ghost"
                    size="sm"
                    onClick={() => executeCommand(button.command)}
                    title={t("htmlWysiwygEditor." + button.titleKey)}
                    className="h-8 w-8 p-0"
                  >
                    <button.icon className="h-4 w-4" />
                  </Button>
                ))}

                <Separator orientation="vertical" className="h-6 mx-1" />

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={insertLink}
                  title={t("htmlWysiwygEditor.insertLink")}
                  className="h-8 w-8 p-0"
                >
                  <Link className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={insertImage}
                  title={t("htmlWysiwygEditor.insertImage")}
                  className="h-8 w-8 p-0"
                >
                  <Image className="h-4 w-4" />
                </Button>

                <Separator orientation="vertical" className="h-6 mx-1" />

                <select
                  onChange={(e) =>
                    executeCommand("formatBlock", e.target.value)
                  }
                  className="text-sm border border-gray-300 rounded px-2 py-1"
                  defaultValue=""
                >
                  <option value="">{t("htmlWysiwygEditor.formatPlaceholder")}</option>
                  <option value="h1">{t("htmlWysiwygEditor.heading1")}</option>
                  <option value="h2">{t("htmlWysiwygEditor.heading2")}</option>
                  <option value="h3">{t("htmlWysiwygEditor.heading3")}</option>
                  <option value="p">{t("htmlWysiwygEditor.paragraph")}</option>
                  <option value="blockquote">{t("htmlWysiwygEditor.quote")}</option>
                </select>
              </div>

              <div
                ref={editorRef}
                contentEditable
                className="min-h-[400px] p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
                onInput={updateHtmlFromEditor}
                onKeyDown={(e) => {
                  if (e.ctrlKey || e.metaKey) {
                    switch (e.key.toLowerCase()) {
                      case "b":
                        e.preventDefault();
                        executeCommand("bold");
                        break;
                      case "i":
                        e.preventDefault();
                        executeCommand("italic");
                        break;
                      case "u":
                        e.preventDefault();
                        executeCommand("underline");
                        break;
                      case "z":
                        if (e.shiftKey) {
                          e.preventDefault();
                          executeCommand("redo");
                        } else {
                          e.preventDefault();
                          executeCommand("undo");
                        }
                        break;
                      case "y":
                        e.preventDefault();
                        executeCommand("redo");
                        break;
                    }
                  }
                }}
                style={{
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  lineHeight: "1.6",
                }}
              />
              <p className="text-sm text-muted-foreground">
                {t("htmlWysiwygEditor.editorHint")}
              </p>
            </TabsContent>

            <TabsContent value="code" className="space-y-4">
              <Textarea
                value={htmlContent}
                onChange={(e) => setHtmlContent(e.target.value)}
                className="min-h-[500px] font-mono text-sm"
                placeholder={t("htmlWysiwygEditor.codePlaceholder")}
              />
              <p className="text-sm text-muted-foreground">
                {t("htmlWysiwygEditor.codeHint")}
              </p>
            </TabsContent>

            <TabsContent value="preview" className="space-y-4">
              <div
                className="min-h-[400px] p-4 border border-gray-300 rounded-md bg-white prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
                style={{
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  lineHeight: "1.6",
                }}
              />
              <p className="text-sm text-muted-foreground">
                {t("htmlWysiwygEditor.previewHint")}
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default HtmlWysiwygEditor;
