
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Button,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@codeexpander/dev-tools-ui";
import { Download } from "lucide-react";
import { useI18n } from "../context";

const QrCodeGenerator = () => {
  const { t } = useI18n();
  const [text, setText] = useState("https://example.com");
  const [foregroundColor, setForegroundColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [size, setSize] = useState(256);
  const [errorCorrection, setErrorCorrection] = useState("L");

  const generateQrCodeUrl = () => {
    const encodedText = encodeURIComponent(text);
    const fgColor = foregroundColor.replace("#", "");
    const bgColor = backgroundColor.replace("#", "");
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedText}&color=${fgColor}&bgcolor=${bgColor}&ecc=${errorCorrection}`;
  };

  const downloadQrCode = () => {
    const qrCodeUrl = generateQrCodeUrl();
    const link = document.createElement("a");
    link.href = qrCodeUrl;
    link.download = "qrcode.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const errorCorrectionLevels = [
    { value: "L", labelKey: "eccLow" as const, descKey: "eccLowDesc" as const },
    { value: "M", labelKey: "eccMedium" as const, descKey: "eccMediumDesc" as const },
    { value: "Q", labelKey: "eccQuartile" as const, descKey: "eccQuartileDesc" as const },
    { value: "H", labelKey: "eccHigh" as const, descKey: "eccHighDesc" as const }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
          {t("qrCodeGenerator.title")}
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          {t("qrCodeGenerator.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle>{t("qrCodeGenerator.settingsTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="text">{t("qrCodeGenerator.textLabel")}</Label>
              <Textarea
                id="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t("qrCodeGenerator.textPlaceholder")}
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="foreground">{t("qrCodeGenerator.foregroundColor")}</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    id="foreground"
                    value={foregroundColor}
                    onChange={(e) => setForegroundColor(e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={foregroundColor}
                    onChange={(e) => setForegroundColor(e.target.value)}
                    placeholder="#000000"
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="background">{t("qrCodeGenerator.backgroundColor")}</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    id="background"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    placeholder="#ffffff"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="size">{t("qrCodeGenerator.sizeLabel")}</Label>
                <Input
                  type="number"
                  id="size"
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  min="100"
                  max="1000"
                  step="50"
                />
              </div>

              <div>
                <Label htmlFor="errorCorrection">{t("qrCodeGenerator.errorResistance")}</Label>
                <Select value={errorCorrection} onValueChange={setErrorCorrection}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("qrCodeGenerator.errorPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {errorCorrectionLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        <div className="flex flex-col">
                          <span>{t("qrCodeGenerator." + level.labelKey)}</span>
                          <span className="text-xs text-slate-500">{t("qrCodeGenerator." + level.descKey)}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-3 rounded-md">
              <strong>{t("qrCodeGenerator.errorNoteTitle")}</strong> {t("qrCodeGenerator.errorNote")}
            </div>

            <Button onClick={downloadQrCode} className="w-full">
              <Download className="w-4 h-4 mr-2" />
              {t("qrCodeGenerator.downloadBtn")}
            </Button>
          </CardContent>
        </Card>

        {/* Preview Section */}
        <Card>
          <CardHeader>
            <CardTitle>{t("qrCodeGenerator.previewTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {text && (
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <img
                  src={generateQrCodeUrl()}
                  alt="Generated QR Code"
                  className="max-w-full h-auto"
                  style={{ maxWidth: `${Math.min(size, 400)}px` }}
                />
              </div>
            )}
            {!text && (
              <div className="text-slate-500 dark:text-slate-400 text-center py-8">
                {t("qrCodeGenerator.enterTextHint")}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QrCodeGenerator;
