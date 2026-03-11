import React, { useState } from "react";
import { Button } from "@codeexpander/dev-tools-ui";
import { Card, CardContent } from "@codeexpander/dev-tools-ui";
import { Textarea } from "@codeexpander/dev-tools-ui";
import { Eye, EyeOff, AlertTriangle } from "lucide-react";
import { showToast, showErrorToast } from "../toast";
import { useI18n } from "../context";

const HtmlPreviewer = () => {
  const { t } = useI18n();
  const [htmlInput, setHtmlInput] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const handlePreview = () => {
    if (!htmlInput.trim()) {
      showErrorToast(t("common.error"), t("htmlPreviewer.errorEnterHtml"));
      return;
    }

    setShowPreview(!showPreview);

    if (!showPreview) {
      showToast(t("htmlPreviewer.toastGenerated"));
    }
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
          onClick={handlePreview}
          disabled={!htmlInput.trim()}
          className="w-full"
        >
          {showPreview ? (
            <>
              <EyeOff className="w-4 h-4 mr-2" />
              {t("htmlPreviewer.hidePreview")}
            </>
          ) : (
            <>
              <Eye className="w-4 h-4 mr-2" />
              {t("htmlPreviewer.showPreview")}
            </>
          )}
        </Button>
      </div>

      {showPreview && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span className="text-sm text-amber-600 dark:text-amber-400">
              {t("htmlPreviewer.cautionText")}
            </span>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{t("htmlPreviewer.livePreviewLabel")}</label>
            <Card>
              <CardContent className="p-6">
                <div
                  className="prose prose-sm max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: htmlInput }}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <Card>
        <CardContent className="p-6">
          <div className="text-sm text-slate-600">
            <p>
              <strong>{t("htmlPreviewer.featuresTitle")}</strong>
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>{t("htmlPreviewer.li1")}</li>
              <li>{t("htmlPreviewer.li2")}</li>
              <li>{t("htmlPreviewer.li3")}</li>
              <li>{t("htmlPreviewer.li4")}</li>
              <li>{t("htmlPreviewer.li5")}</li>
            </ul>
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-800">
              <p className="text-amber-800 dark:text-amber-200">
                <strong>{t("htmlPreviewer.securityTitle")}</strong> {t("htmlPreviewer.securityText")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HtmlPreviewer;
