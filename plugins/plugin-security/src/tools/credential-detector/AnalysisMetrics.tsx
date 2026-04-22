import { useI18n } from "../../context";
import { CredentialAnalysis } from './types';
import { getEntropyDescription } from './utils';

interface AnalysisMetricsProps {
  result: CredentialAnalysis;
}

const AnalysisMetrics = ({ result }: AnalysisMetricsProps) => {
  const { t } = useI18n();
  const lengthLabel = result.length < 8 ? t("credentialDetector.lengthTooShort") : result.length < 12 ? t("credentialDetector.lengthAdequate") : result.length < 16 ? t("credentialDetector.lengthGood") : t("credentialDetector.lengthExcellent");
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-1">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
          {t("credentialDetector.shannonEntropy")}
        </span>
        <div className="text-lg font-mono">
          {result.entropy.toFixed(2)}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {getEntropyDescription(result.entropy)}
        </div>
      </div>
      <div className="space-y-1">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
          {t("credentialDetector.length")}
        </span>
        <div className="text-lg font-mono">
          {result.length}{t("credentialDetector.charsSuffix")}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {lengthLabel}
        </div>
      </div>
      <div className="space-y-1">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
          {t("credentialDetector.characterTypes")}
        </span>
        <div className="text-sm">
          {result.patterns.length}{t("credentialDetector.typesSuffix")}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {result.patterns.join(", ") || t("credentialDetector.noneDetected")}
        </div>
      </div>
    </div>
  );
};

export default AnalysisMetrics;
