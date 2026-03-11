import { Button, Input, Card, CardContent, CardDescription, CardHeader, CardTitle, Label, Alert, AlertDescription } from "@codeexpander/dev-tools-ui";
import { Loader2, Plus, X, AlertCircle } from "lucide-react";
import { useI18n } from "../../context";

interface DomainInputProps {
  domains: string[];
  loading: boolean;
  error: string | null;
  onAddDomain: () => void;
  onRemoveDomain: (index: number) => void;
  onUpdateDomain: (index: number, value: string) => void;
  onFetchData: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

const DomainInput = ({
  domains,
  loading,
  error,
  onAddDomain,
  onRemoveDomain,
  onUpdateDomain,
  onFetchData,
  onKeyPress
}: DomainInputProps) => {
  const { t } = useI18n();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("websiteRankTracker.domainInputTitle")}</CardTitle>
        <CardDescription>
          {t("websiteRankTracker.domainInputDescription")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {domains.map((domain, index) => (
          <div key={index} className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor={`domain-${index}`}>{t("websiteRankTracker.domainLabel")}{index + 1}</Label>
              <Input
                id={`domain-${index}`}
                type="text"
                placeholder={t("websiteRankTracker.placeholder")}
                value={domain}
                onChange={(e) => onUpdateDomain(index, e.target.value)}
                onKeyPress={onKeyPress}
                disabled={loading}
              />
            </div>
            {domains.length > 1 && (
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => onRemoveDomain(index)}
                  disabled={loading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        ))}
        
        <div className="flex gap-2">
          {domains.length < 2 && (
            <Button 
              variant="outline" 
              onClick={onAddDomain}
              disabled={loading}
            >
              <Plus className="mr-2 h-4 w-4" />
              {t("websiteRankTracker.addDomain")}
            </Button>
          )}
          <Button 
            onClick={onFetchData} 
            disabled={loading || !domains.some(d => d.trim())}
            className="min-w-[120px]"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("websiteRankTracker.loading")}
              </>
            ) : (
              t("websiteRankTracker.compareRankings")
            )}
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default DomainInput;
