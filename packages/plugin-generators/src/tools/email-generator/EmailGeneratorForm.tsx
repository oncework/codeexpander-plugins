import { Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@codeexpander/dev-tools-ui";
import { useI18n } from "../../context";
import { domains } from "./emailGeneratorUtils";

interface EmailGeneratorFormProps {
  count: number;
  selectedDomain: string;
  customDomain: string;
  onCountChange: (count: number) => void;
  onDomainChange: (domain: string) => void;
  onCustomDomainChange: (domain: string) => void;
}

const EmailGeneratorForm = ({
  count,
  selectedDomain,
  customDomain,
  onCountChange,
  onDomainChange,
  onCustomDomainChange
}: EmailGeneratorFormProps) => {
  const { t } = useI18n();
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="count">{t("randomEmailGenerator.numberOfEmailsLabel")}</Label>
        <Input
          id="count"
          type="number"
          min="1"
          max="100"
          value={count}
          onChange={(e) => onCountChange(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="domain">{t("randomEmailGenerator.domainLabel")}</Label>
        <Select value={selectedDomain} onValueChange={onDomainChange}>
          <SelectTrigger>
            <SelectValue placeholder={t("randomEmailGenerator.domainPlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="random">{t("randomEmailGenerator.randomDomain")}</SelectItem>
            {domains.map((domain) => (
              <SelectItem key={domain} value={domain}>
                {domain}
              </SelectItem>
            ))}
            <SelectItem value="custom">{t("randomEmailGenerator.customDomainOption")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {selectedDomain === "custom" && (
        <div className="space-y-2">
          <Label htmlFor="customDomain">{t("randomEmailGenerator.customDomainLabel")}</Label>
          <Input
            id="customDomain"
            placeholder={t("randomEmailGenerator.customDomainPlaceholder")}
            value={customDomain}
            onChange={(e) => onCustomDomainChange(e.target.value)}
          />
        </div>
      )}
    </div>
  );
};

export default EmailGeneratorForm;
