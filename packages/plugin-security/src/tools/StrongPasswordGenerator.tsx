import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, Input, Label, Button, Switch, Slider } from "@codeexpander/dev-tools-ui";
import { Copy, RefreshCw, Download } from "lucide-react";
import { useI18n } from "../context";
import { showErrorToast, showToast } from "../toast";

const StrongPasswordGenerator = () => {
  const { t } = useI18n();
  const [password, setPassword] = useState("");
  const [length, setLength] = useState([12]);
  const [options, setOptions] = useState({
    easyToSay: false,
    easyToRead: false,
    allCharacters: true,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true
  });

  const easyToSayChars = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const easyToReadChars = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ2346789";
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const numberChars = "0123456789";
  const symbolChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";
  const allChars = uppercaseChars + lowercaseChars + numberChars + symbolChars;

  const generatePassword = () => {
    let charset = "";

    if (options.easyToSay) {
      charset = easyToSayChars;
    } else if (options.easyToRead) {
      charset = easyToReadChars;
    } else if (options.allCharacters) {
      charset = allChars;
    } else {
      if (options.uppercase) charset += uppercaseChars;
      if (options.lowercase) charset += lowercaseChars;
      if (options.numbers) charset += numberChars;
      if (options.symbols) charset += symbolChars;
    }

    if (!charset) {
      showErrorToast(t("common.error"), t("strongPasswordGenerator.errorSelectType"));
      return;
    }

    let newPassword = "";
    for (let i = 0; i < length[0]; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    setPassword(newPassword);
  };

  const copyPassword = async () => {
    if (!password) return;

    try {
      if (typeof (window as any).__codeexpander?.writeClipboard === "function") {
        await (window as any).__codeexpander.writeClipboard(password);
      } else {
        await navigator.clipboard.writeText(password);
      }
      showToast(t("common.copied"));
    } catch (err) {
      showErrorToast(t("common.error"), t("strongPasswordGenerator.errorCopyFailed"));
    }
  };

  const generateQrCodeUrl = () => {
    if (!password) return "";
    const encodedPassword = encodeURIComponent(password);
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedPassword}`;
  };

  const downloadQrCode = () => {
    if (!password) return;

    const qrCodeUrl = generateQrCodeUrl();
    const link = document.createElement("a");
    link.href = qrCodeUrl;
    link.download = "password-qrcode.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOptionChange = (option: string, value: boolean) => {
    const newOptions = { ...options, [option]: value };

    if (option === "easyToSay" && value) {
      newOptions.easyToRead = false;
      newOptions.allCharacters = false;
    } else if (option === "easyToRead" && value) {
      newOptions.easyToSay = false;
      newOptions.allCharacters = false;
    } else if (option === "allCharacters" && value) {
      newOptions.easyToSay = false;
      newOptions.easyToRead = false;
    }

    setOptions(newOptions);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
          {t("strongPasswordGenerator.title")}
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          {t("strongPasswordGenerator.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("strongPasswordGenerator.customizeTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>{t("strongPasswordGenerator.lengthLabel")}{length[0]}</Label>
              <Slider
                value={length}
                onValueChange={setLength}
                max={128}
                min={4}
                step={1}
                className="mt-2"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>4</span>
                <span>128</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="easy-to-say">{t("strongPasswordGenerator.easyToSay")}</Label>
                <Switch
                  id="easy-to-say"
                  checked={options.easyToSay}
                  onCheckedChange={(value) => handleOptionChange("easyToSay", value)}
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t("strongPasswordGenerator.easyToSayHint")}</p>

              <div className="flex items-center justify-between">
                <Label htmlFor="easy-to-read">{t("strongPasswordGenerator.easyToRead")}</Label>
                <Switch
                  id="easy-to-read"
                  checked={options.easyToRead}
                  onCheckedChange={(value) => handleOptionChange("easyToRead", value)}
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t("strongPasswordGenerator.easyToReadHint")}</p>

              <div className="flex items-center justify-between">
                <Label htmlFor="all-characters">{t("strongPasswordGenerator.allCharacters")}</Label>
                <Switch
                  id="all-characters"
                  checked={options.allCharacters}
                  onCheckedChange={(value) => handleOptionChange("allCharacters", value)}
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t("strongPasswordGenerator.allCharactersHint")}</p>
            </div>

            {!options.easyToSay && !options.easyToRead && !options.allCharacters && (
              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <Label htmlFor="uppercase">{t("strongPasswordGenerator.uppercase")}</Label>
                  <Switch
                    id="uppercase"
                    checked={options.uppercase}
                    onCheckedChange={(value) => handleOptionChange("uppercase", value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="lowercase">{t("strongPasswordGenerator.lowercase")}</Label>
                  <Switch
                    id="lowercase"
                    checked={options.lowercase}
                    onCheckedChange={(value) => handleOptionChange("lowercase", value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="numbers">{t("strongPasswordGenerator.numbers")}</Label>
                  <Switch
                    id="numbers"
                    checked={options.numbers}
                    onCheckedChange={(value) => handleOptionChange("numbers", value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="symbols">{t("strongPasswordGenerator.symbols")}</Label>
                  <Switch
                    id="symbols"
                    checked={options.symbols}
                    onCheckedChange={(value) => handleOptionChange("symbols", value)}
                  />
                </div>
              </div>
            )}

            <Button onClick={generatePassword} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              {t("strongPasswordGenerator.generateBtn")}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("strongPasswordGenerator.generatedTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="generated-password">{t("strongPasswordGenerator.yourPasswordLabel")}</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="generated-password"
                  value={password}
                  readOnly
                  placeholder={t("strongPasswordGenerator.passwordPlaceholder")}
                  className="font-mono"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyPassword}
                  disabled={!password}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {password && (
              <div className="space-y-4">
                <div className="text-center">
                  <Label className="text-sm font-medium">{t("strongPasswordGenerator.qrCodeLabel")}</Label>
                  <div className="mt-2 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg inline-block">
                    <img
                      src={generateQrCodeUrl()}
                      alt={t("strongPasswordGenerator.qrCodeAlt")}
                      className="w-48 h-48"
                    />
                  </div>
                </div>

                <Button onClick={downloadQrCode} variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  {t("strongPasswordGenerator.downloadQr")}
                </Button>

                <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-3 rounded-md">
                  <strong>{t("strongPasswordGenerator.securityNote")}</strong> {t("strongPasswordGenerator.securityNoteQr")}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StrongPasswordGenerator;
