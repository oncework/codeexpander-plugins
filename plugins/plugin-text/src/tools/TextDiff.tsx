import React, { useState } from "react";
import { Button } from "@codeexpander/dev-tools-ui";
import { useI18n } from "../context";
import { useDiffCalculator } from "./text-diff/useDiffCalculator";
import TextDiffInput from "./text-diff/TextDiffInput";
import DiffDisplay from "./text-diff/DiffDisplay";

const TextDiff = () => {
  const { t } = useI18n();
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const { diff, calculateDiff, clearDiff } = useDiffCalculator();

  const handleCalculateDiff = () => {
    calculateDiff(text1, text2);
  };

  const handleClearTexts = () => {
    setText1("");
    setText2("");
    clearDiff();
  };

  return (
    <div className="p-4 space-y-6">
      <TextDiffInput
        text1={text1}
        text2={text2}
        setText1={setText1}
        setText2={setText2}
      />

      <div className="flex gap-4">
        <Button onClick={handleCalculateDiff} className="flex-1 py-3 text-base">
          {t("textDiff.compare")}
        </Button>
        <Button
          onClick={handleClearTexts}
          variant="outline"
          className="py-3 px-8 text-base"
        >
          {t("textDiff.clearAll")}
        </Button>
      </div>

      <DiffDisplay diff={diff} />
    </div>
  );
};

export default TextDiff;
