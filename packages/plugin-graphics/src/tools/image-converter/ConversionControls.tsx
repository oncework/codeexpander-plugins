
import { Button } from "@codeexpander/dev-tools-ui";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@codeexpander/dev-tools-ui";
import { Label } from "@codeexpander/dev-tools-ui";
import { Slider } from "@codeexpander/dev-tools-ui";
import { Image as ImageIcon, RotateCcw } from "lucide-react";
import { useI18n } from "../../context";
import { supportedFormats } from "./constants";

interface ConversionControlsProps {
  outputFormat: string;
  quality: number[];
  isConverting: boolean;
  onFormatChange: (format: string) => void;
  onQualityChange: (quality: number[]) => void;
  onConvert: () => void;
  onReset: () => void;
}

export const ConversionControls = ({
  outputFormat,
  quality,
  isConverting,
  onFormatChange,
  onQualityChange,
  onConvert,
  onReset
}: ConversionControlsProps) => {
  const { t } = useI18n();
  const selectedFormatConfig = supportedFormats.find(f => f.value === outputFormat);
  const showQualityControl = selectedFormatConfig?.hasQuality;

  return (
    <>
      {/* Output Format Selection */}
      <div className="space-y-2">
        <Label>{t("imageConverter.outputFormat")}</Label>
        <Select value={outputFormat} onValueChange={onFormatChange}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {supportedFormats.map((format) => (
              <SelectItem key={format.value} value={format.value}>
                {format.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Quality Control */}
      {showQualityControl && (
        <div className="space-y-2">
          <Label>{t("imageConverter.qualityLabel")}{quality[0]}{t("imageConverter.qualityLabelSuffix")}</Label>
          <Slider
            value={quality}
            onValueChange={onQualityChange}
            max={100}
            min={1}
            step={1}
            className="w-64"
          />
        </div>
      )}

      {/* Convert Button */}
      <div className="flex gap-2">
        <Button 
          onClick={onConvert}
          disabled={isConverting}
          className="flex items-center gap-2"
        >
          <ImageIcon className="h-4 w-4" />
          {isConverting ? t("imageConverter.converting") : t("imageConverter.convert")}
        </Button>
        <Button 
          variant="outline" 
          onClick={onReset}
          className="flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          {t("imageConverter.reset")}
        </Button>
      </div>
    </>
  );
};
