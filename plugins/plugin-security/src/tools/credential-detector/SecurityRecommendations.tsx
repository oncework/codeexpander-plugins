import { Card, CardContent, CardHeader, CardTitle } from "@codeexpander/dev-tools-ui";
import { Shield } from "lucide-react";
import { useI18n } from "../../context";
import { CredentialAnalysis } from './types';

interface SecurityRecommendationsProps {
  result: CredentialAnalysis;
}

const SecurityRecommendations = ({ result }: SecurityRecommendationsProps) => {
  const { t } = useI18n();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          {t("credentialDetector.securityRecommendations")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="text-sm space-y-2">
          {result.recommendations.map((rec, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default SecurityRecommendations;
