import { Checkbox, Label } from "@codeexpander/dev-tools-ui";
import { useI18n } from "../../context";
import { EmailGeneratorOptions } from "./emailGeneratorUtils";

interface EmailGeneratorOptionsProps {
  options: EmailGeneratorOptions;
  onOptionsChange: (options: EmailGeneratorOptions) => void;
}

const EmailGeneratorOptionsComponent = ({ options, onOptionsChange }: EmailGeneratorOptionsProps) => {
  const { t } = useI18n();
  const handleOptionChange = (key: keyof EmailGeneratorOptions, checked: boolean) => {
    onOptionsChange({
      ...options,
      [key]: checked
    });
  };

  return (
    <div className="space-y-4">
      <Label>{t("randomEmailGenerator.optionsLabel")}</Label>
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="includeNumbers"
            checked={options.includeNumbers}
            onCheckedChange={(checked) => handleOptionChange("includeNumbers", checked === true)}
          />
          <Label htmlFor="includeNumbers">{t("randomEmailGenerator.includeNumbers")}</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="includeDots"
            checked={options.includeDots}
            onCheckedChange={(checked) => handleOptionChange("includeDots", checked === true)}
          />
          <Label htmlFor="includeDots">{t("randomEmailGenerator.includeDots")}</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="includeUnderscores"
            checked={options.includeUnderscores}
            onCheckedChange={(checked) => handleOptionChange("includeUnderscores", checked === true)}
          />
          <Label htmlFor="includeUnderscores">{t("randomEmailGenerator.includeUnderscores")}</Label>
        </div>
      </div>
    </div>
  );
};

export default EmailGeneratorOptionsComponent;
