import React, { useState } from "react";
import { Button } from "@codeexpander/dev-tools-ui";
import { Card, CardContent } from "@codeexpander/dev-tools-ui";
import { Textarea } from "@codeexpander/dev-tools-ui";
import { Copy, Download, Code } from "lucide-react";
import { showToast, showErrorToast } from "../toast";
import { useI18n } from "../context";

const HtmlToJsx = () => {
  const { t } = useI18n();
  const [htmlInput, setHtmlInput] = useState("");
  const [jsxOutput, setJsxOutput] = useState("");

  const convertToJsx = () => {
    if (!htmlInput.trim()) {
      showErrorToast(t("common.error"), t("htmlToJsx.errorEnterHtml"));
      return;
    }

    let jsx = htmlInput
      .replace(
        /<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)([^>]*?)(?<!\/)\s*>/gi,
        "<$1$2 />"
      )
      .replace(/class=/g, "className=")
      .replace(/for=/g, "htmlFor=")
      .replace(/contenteditable=/g, "contentEditable=")
      .replace(/tabindex=/g, "tabIndex=")
      .replace(/readonly=/g, "readOnly=")
      .replace(/maxlength=/g, "maxLength=")
      .replace(/minlength=/g, "minLength=")
      .replace(/autocomplete=/g, "autoComplete=")
      .replace(/autofocus=/g, "autoFocus=")
      .replace(/autoplay=/g, "autoPlay=")
      .replace(/crossorigin=/g, "crossOrigin=")
      .replace(/datetime=/g, "dateTime=")
      .replace(/formaction=/g, "formAction=")
      .replace(/formenctype=/g, "formEncType=")
      .replace(/formmethod=/g, "formMethod=")
      .replace(/formnovalidate=/g, "formNoValidate=")
      .replace(/formtarget=/g, "formTarget=")
      .replace(/frameborder=/g, "frameBorder=")
      .replace(/marginheight=/g, "marginHeight=")
      .replace(/marginwidth=/g, "marginWidth=")
      .replace(/novalidate=/g, "noValidate=")
      .replace(/radiogroup=/g, "radioGroup=")
      .replace(/spellcheck=/g, "spellCheck=")
      .replace(/srcdoc=/g, "srcDoc=")
      .replace(/srclang=/g, "srcLang=")
      .replace(/srcset=/g, "srcSet=")
      .replace(/usemap=/g, "useMap=")
      .replace(/data-([a-z]+(?:-[a-z]+)*)/g, (_match, attr: string) => {
        return (
          "data-" +
          attr.replace(/-([a-z])/g, (_m: string, letter: string) =>
            letter.toUpperCase()
          )
        );
      })
      .replace(/aria-([a-z]+(?:-[a-z]+)*)/g, (_match, attr: string) => {
        return (
          "aria-" +
          attr.replace(/-([a-z])/g, (_m: string, letter: string) =>
            letter.toUpperCase()
          )
        );
      })
      .replace(/style="([^"]*)"/g, (_match, styles: string) => {
        if (!styles.trim()) return "style={{}}";
        const styleObj = styles
          .split(";")
          .filter((s) => s.trim())
          .map((s) => {
            const [property, value] = s.split(":").map((part) => part.trim());
            if (!property || !value) return "";
            const camelProperty = property.replace(/-([a-z])/g, (_m, letter) =>
              letter.toUpperCase()
            );
            const numericValue = /^\d+$/.test(value) ? value : `'${value}'`;
            return `${camelProperty}: ${numericValue}`;
          })
          .filter((s) => s)
          .join(", ");
        return `style={{${styleObj}}}`;
      })
      .replace(/on([a-z]+)=/g, (_match, event: string) => {
        return "on" + event.charAt(0).toUpperCase() + event.slice(1) + "=";
      })
      .replace(
        /\s(checked|selected|disabled|readonly|multiple|autofocus|autoplay|controls|default|defer|hidden|loop|muted|open|required|reversed)\s*=\s*["']?\1["']?/gi,
        " $1"
      )
      .replace(
        /\s(checked|selected|disabled|readonly|multiple|autofocus|autoplay|controls|default|defer|hidden|loop|muted|open|required|reversed)(?=\s|>)/gi,
        " $1={true}"
      )
      .replace(/<!--(.*?)-->/g, "{/* $1 */}")
      .replace(/&nbsp;/g, "{'\\u00A0'}")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");

    setJsxOutput(jsx);
    showToast(t("htmlToJsx.toastSuccess"));
  };

  const copyToClipboard = async () => {
    if (!jsxOutput) return;
    try {
      if (typeof (window as any).__codeexpander?.writeClipboard === "function") {
        (window as any).__codeexpander.writeClipboard(jsxOutput);
      } else {
        await navigator.clipboard.writeText(jsxOutput);
      }
      showToast(t("htmlToJsx.toastCopied"));
    } catch {
      showErrorToast(t("common.error"), t("common.errorCopyFailed"));
    }
  };

  const downloadFile = () => {
    if (!jsxOutput) return;
    const blob = new Blob([jsxOutput], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "converted.jsx";
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
          onClick={convertToJsx}
          disabled={!htmlInput.trim()}
          className="w-full"
        >
          <Code className="w-4 h-4 mr-2" />
          {t("htmlToJsx.convertBtn")}
        </Button>
      </div>

      {jsxOutput && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium">{t("htmlToJsx.outputLabel")}</label>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copyToClipboard}>
                <Copy className="w-4 h-4 mr-1" />
                {t("common.copy")}
              </Button>
              <Button variant="outline" size="sm" onClick={downloadFile}>
                <Download className="w-4 h-4 mr-1" />
                {t("htmlToJsx.downloadJsx")}
              </Button>
            </div>
          </div>
          <Textarea
            value={jsxOutput}
            readOnly
            className="min-h-96 font-mono text-sm bg-slate-50"
          />
        </div>
      )}

      <Card>
        <CardContent className="p-6">
          <div className="text-sm text-slate-600">
            <p>
              <strong>{t("htmlToJsx.autoTitle")}</strong>
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>{t("htmlToJsx.li1")}</li>
              <li>{t("htmlToJsx.li2")}</li>
              <li>{t("htmlToJsx.li3")}</li>
              <li>{t("htmlToJsx.li4")}</li>
              <li>{t("htmlToJsx.li5")}</li>
              <li>{t("htmlToJsx.li6")}</li>
              <li>{t("htmlToJsx.li7")}</li>
              <li>{t("htmlToJsx.li8")}</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HtmlToJsx;
