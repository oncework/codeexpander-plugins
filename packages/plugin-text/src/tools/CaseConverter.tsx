import React, { useState } from "react";
import { Textarea, Button, Card } from "@codeexpander/dev-tools-ui";
import { useI18n } from "../context";

const CONVERSIONS = [
  {
    key: "camelCase",
    convert: (text: string) =>
      text
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word: string, index: number) =>
          index === 0 ? word.toLowerCase() : word.toUpperCase()
        )
        .replace(/\s+/g, ""),
  },
  {
    key: "pascalCase",
    convert: (text: string) =>
      text
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word: string) => word.toUpperCase())
        .replace(/\s+/g, ""),
  },
  {
    key: "snakeCase",
    convert: (text: string) => text.toLowerCase().replace(/\s+/g, "_"),
  },
  {
    key: "kebabCase",
    convert: (text: string) => text.toLowerCase().replace(/\s+/g, "-"),
  },
  {
    key: "constantCase",
    convert: (text: string) => text.toUpperCase().replace(/\s+/g, "_"),
  },
  {
    key: "titleCase",
    convert: (text: string) =>
      text.replace(/\w\S*/g, (txt) =>
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      ),
  },
  { key: "lowercase", convert: (text: string) => text.toLowerCase() },
  { key: "uppercase", convert: (text: string) => text.toUpperCase() },
];

const CaseConverter = () => {
  const { t } = useI18n();
  const [inputText, setInputText] = useState("");

  const copyToClipboard = (text: string) => {
    if (window.__codeexpander?.writeClipboard) {
      window.__codeexpander.writeClipboard(text);
      window.__codeexpander.showToast?.(t("common.copied"));
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <Textarea
        placeholder={t("caseConverter.placeholder")}
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        className="min-h-[100px]"
      />

      <div className="grid gap-4">
        {CONVERSIONS.map((conversion) => (
          <Card key={conversion.key} className="p-4">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <div className="font-medium text-sm text-slate-600 mb-3">
                  {t(`caseConverter.${conversion.key}`)}
                </div>
                <div className="font-mono text-sm bg-slate-50 dark:bg-slate-800 p-4 rounded border min-h-[2rem] break-all">
                  {inputText
                    ? conversion.convert(inputText)
                    : t("caseConverter.previewPlaceholder")}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(conversion.convert(inputText))}
                disabled={!inputText}
              >
                {t("common.copy")}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CaseConverter;
