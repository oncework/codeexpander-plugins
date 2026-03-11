
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from "@codeexpander/dev-tools-ui";
import { Download, Wifi, Eye, EyeOff } from "lucide-react";
import { useI18n } from "../context";

const WifiQrGenerator = () => {
  const { t } = useI18n();
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [security, setSecurity] = useState("WPA");
  const [hidden, setHidden] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [foregroundColor, setForegroundColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [size, setSize] = useState(256);

  const generateWifiString = () => {
    const escapedSsid = ssid.replace(/([\\";,:])/g, '\\$1');
    const escapedPassword = password.replace(/([\\";,:])/g, '\\$1');
    return `WIFI:T:${security};S:${escapedSsid};P:${escapedPassword};H:${hidden ? 'true' : 'false'};;`;
  };

  const generateQrCodeUrl = () => {
    if (!ssid) return "";
    const wifiString = generateWifiString();
    const encodedWifiString = encodeURIComponent(wifiString);
    const fgColor = foregroundColor.replace("#", "");
    const bgColor = backgroundColor.replace("#", "");
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedWifiString}&color=${fgColor}&bgcolor=${bgColor}&ecc=M`;
  };

  const downloadQrCode = () => {
    const qrCodeUrl = generateQrCodeUrl();
    if (!qrCodeUrl) return;
    const link = document.createElement("a");
    link.href = qrCodeUrl;
    link.download = `wifi-${ssid || 'network'}-qrcode.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const securityTypes = [
    { value: "nopass", labelKey: "open" as const },
    { value: "WEP", labelKey: "wep" as const },
    { value: "WPA", labelKey: "wpa" as const },
    { value: "WPA3", labelKey: "wpa3" as const }
  ];

  const requiresPassword = security !== "nopass";

  return (
    <div className="p-6 space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
          {t("wifiQrGenerator.title")}
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          {t("wifiQrGenerator.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="w-5 h-5" />
              {t("wifiQrGenerator.networkTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="ssid">{t("wifiQrGenerator.ssidLabel")}</Label>
              <Input
                id="ssid"
                value={ssid}
                onChange={(e) => setSsid(e.target.value)}
                placeholder={t("wifiQrGenerator.ssidPlaceholder")}
                required
              />
            </div>

            <div>
              <Label htmlFor="security">{t("wifiQrGenerator.securityLabel")}</Label>
              <Select value={security} onValueChange={setSecurity}>
                <SelectTrigger>
                  <SelectValue placeholder={t("wifiQrGenerator.securityPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {securityTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {t("wifiQrGenerator." + type.labelKey)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {requiresPassword && (
              <div>
                <Label htmlFor="password">{t("wifiQrGenerator.passwordLabel")}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("wifiQrGenerator.passwordPlaceholder")}
                    className="pr-10"
                    required={requiresPassword}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <Label htmlFor="hidden">{t("wifiQrGenerator.hiddenLabel")}</Label>
              <Switch
                id="hidden"
                checked={hidden}
                onCheckedChange={setHidden}
              />
            </div>

            <div className="border-t pt-4">
              <h3 className="text-sm font-medium mb-3">{t("wifiQrGenerator.appearanceTitle")}</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="foreground">{t("wifiQrGenerator.foregroundColor")}</Label>
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
                  <Label htmlFor="background">{t("wifiQrGenerator.backgroundColor")}</Label>
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

              <div className="mt-4">
                <Label htmlFor="size">{t("wifiQrGenerator.sizeLabel")}</Label>
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
            </div>

            <div className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-3 rounded-md">
              <strong>{t("wifiQrGenerator.howToUse")}</strong> {t("wifiQrGenerator.howToUseText")}
            </div>

            <Button 
              onClick={downloadQrCode} 
              className="w-full" 
              disabled={!ssid || (requiresPassword && !password)}
            >
              <Download className="w-4 h-4 mr-2" />
              {t("wifiQrGenerator.downloadBtn")}
            </Button>
          </CardContent>
        </Card>

        {/* Preview Section */}
        <Card>
          <CardHeader>
            <CardTitle>{t("wifiQrGenerator.previewTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {ssid && (!requiresPassword || password) ? (
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <img
                  src={generateQrCodeUrl()}
                  alt="Generated WiFi QR Code"
                  className="max-w-full h-auto"
                  style={{ maxWidth: `${Math.min(size, 400)}px` }}
                />
                <div className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
                  <p><strong>{t("wifiQrGenerator.networkLabel")}</strong> {ssid}</p>
                  <p><strong>{t("wifiQrGenerator.securityLabel2")}</strong> {securityTypes.find(s => s.value === security) ? t("wifiQrGenerator." + securityTypes.find(s => s.value === security)!.labelKey) : security}</p>
                  {hidden && <p><strong>{t("wifiQrGenerator.hiddenYes")}</strong></p>}
                </div>
              </div>
            ) : (
              <div className="text-slate-500 dark:text-slate-400 text-center py-8">
                <Wifi className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>{t("wifiQrGenerator.enterDetailsHint")}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WifiQrGenerator;
