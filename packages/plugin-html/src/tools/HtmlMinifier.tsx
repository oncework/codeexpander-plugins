import React, { useState } from "react";
import { Button } from "@codeexpander/dev-tools-ui";
import { Card, CardContent, CardHeader, CardTitle } from "@codeexpander/dev-tools-ui";
import { Textarea } from "@codeexpander/dev-tools-ui";
import { Badge } from "@codeexpander/dev-tools-ui";
import { Copy, Download, Zap } from "lucide-react";
import { showToast, showErrorToast } from "../toast";
import { useI18n } from "../context";

const HtmlMinifier = () => {
  const { t } = useI18n();
  const [htmlInput, setHtmlInput] = useState("");
  const [minifiedHtml, setMinifiedHtml] = useState("");
  const [stats, setStats] = useState({ original: 0, minified: 0, saved: 0 });

  const minifyHtml = () => {
    if (!htmlInput.trim()) {
      showErrorToast(t("common.error"), t("htmlMinifier.errorEnterHtml"));
      return;
    }

    const originalSize = htmlInput.length;

    let minified = htmlInput
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/>\s+</g, "><")
      .replace(/^\s+|\s+$/gm, "")
      .replace(/\s{2,}/g, " ")
      .replace(/\s*=\s*/g, "=")
      .replace(/=["']([a-zA-Z0-9_-]+)["']/g, "=$1")
      .trim();

    const minifiedSize = minified.length;
    const savedBytes = originalSize - minifiedSize;
    const savedPercent =
      originalSize > 0 ? ((savedBytes / originalSize) * 100).toFixed(1) : 0;

    setMinifiedHtml(minified);
    setStats({
      original: originalSize,
      minified: minifiedSize,
      saved: Number(savedPercent),
    });

    showToast(
      t("htmlMinifier.toastSuccess") + savedPercent + t("htmlMinifier.toastSuccessSuffix") + savedBytes + t("htmlMinifier.toastSuccessSuffix2")
    );
  };

  const copyToClipboard = async () => {
    if (!minifiedHtml) return;
    try {
      if (typeof (window as any).__codeexpander?.writeClipboard === "function") {
        (window as any).__codeexpander.writeClipboard(minifiedHtml);
      } else {
        await navigator.clipboard.writeText(minifiedHtml);
      }
      showToast(t("htmlMinifier.toastCopied"));
    } catch {
      showErrorToast(t("common.error"), t("common.errorCopyFailed"));
    }
  };

  const downloadFile = () => {
    if (!minifiedHtml) return;
    const blob = new Blob([minifiedHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "minified.html";
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
            placeholder={t("htmlMinifier.placeholder")}
            value={htmlInput}
            onChange={(e) => setHtmlInput(e.target.value)}
            className="min-h-48 font-mono text-sm"
          />
        </div>

        <Button
          onClick={minifyHtml}
          disabled={!htmlInput.trim()}
          className="w-full"
        >
          <Zap className="w-4 h-4 mr-2" />
          {t("htmlMinifier.minifyBtn")}
        </Button>
      </div>

      {minifiedHtml && (
        <>
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center justify-between">
                {t("htmlMinifier.statsTitle")}
                <div className="flex gap-2">
                  <Badge variant="outline">
                    {stats.original} bytes → {stats.minified} bytes
                  </Badge>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {stats.saved}% {t("htmlMinifier.smaller")}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-slate-600">
                    {stats.original}
                  </div>
                  <div className="text-sm text-slate-500">{t("htmlMinifier.bytesOriginal")}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {stats.minified}
                  </div>
                  <div className="text-sm text-slate-500">{t("htmlMinifier.bytesMinified")}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.saved}%
                  </div>
                  <div className="text-sm text-slate-500">{t("htmlMinifier.sizeReduction")}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium">{t("htmlMinifier.minifiedLabel")}</label>
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
              value={minifiedHtml}
              readOnly
              className="min-h-48 font-mono text-sm bg-slate-50"
            />
          </div>
        </>
      )}

      <Card>
        <CardContent className="p-6">
          <div className="text-sm text-slate-600">
            <p>
              <strong>{t("htmlMinifier.featuresTitle")}</strong>
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>{t("htmlMinifier.feature1")}</li>
              <li>{t("htmlMinifier.feature2")}</li>
              <li>{t("htmlMinifier.feature3")}</li>
              <li>{t("htmlMinifier.feature4")}</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HtmlMinifier;
