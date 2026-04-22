import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Label, Textarea, Button } from "@codeexpander/dev-tools-ui";
import { Shield } from "lucide-react";
import { useI18n } from "../context";
import { detectPasswordState } from './credential-detector/utils';
import { CredentialAnalysis } from './credential-detector/types';
import AnalysisResult from './credential-detector/AnalysisResult';

const CredentialFormatDetector = () => {
  const { t } = useI18n();
  const [input, setInput] = useState("");
  const [result, setResult] = useState<CredentialAnalysis | null>(null);

  const handleAnalyze = () => {
    if (!input.trim()) return;
    const analysis = detectPasswordState(input);
    setResult(analysis);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          {t("credentialDetector.title")}
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          {t("credentialDetector.subtitle")}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {t("credentialDetector.analysisTitle")}
          </CardTitle>
          <CardDescription>
            {t("credentialDetector.analysisDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password-input">{t("credentialDetector.label")}</Label>
            <Textarea
              id="password-input"
              placeholder={t("credentialDetector.placeholder")}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[100px] font-mono"
            />
          </div>

          <Button onClick={handleAnalyze} disabled={!input.trim()} className="w-full">
            <Shield className="h-4 w-4 mr-2" />
            {t("credentialDetector.analyzeBtn")}
          </Button>

          {result && <AnalysisResult result={result} />}
        </CardContent>
      </Card>
    </div>
  );
};

export default CredentialFormatDetector;
