import React from "react";
import { Textarea } from "@codeexpander/dev-tools-ui";
import { useI18n } from "../../context";

interface TextDiffInputProps {
  text1: string;
  text2: string;
  setText1: (value: string) => void;
  setText2: (value: string) => void;
}

const TextDiffInput: React.FC<TextDiffInputProps> = ({
  text1,
  text2,
  setText1,
  setText2,
}) => {
  const { t } = useI18n();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {t("textDiff.originalLabel")}
        </label>
        <Textarea
          placeholder={t("textDiff.originalPlaceholder")}
          value={text1}
          onChange={(e) => setText1(e.target.value)}
          className="min-h-[150px] p-4"
        />
      </div>
      <div className="space-y-3">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {t("textDiff.modifiedLabel")}
        </label>
        <Textarea
          placeholder={t("textDiff.modifiedPlaceholder")}
          value={text2}
          onChange={(e) => setText2(e.target.value)}
          className="min-h-[150px] p-4"
        />
      </div>
    </div>
  );
};

export default TextDiffInput;
