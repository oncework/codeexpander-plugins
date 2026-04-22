import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
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
} from "@codeexpander/dev-tools-ui";
import { Copy, Hash } from "lucide-react";
import { useI18n } from "../context";
import { showErrorToast, copyToClipboard } from "../toast";

const IntegerBaseConverter = () => {
  const { t } = useI18n();
  const [inputValue, setInputValue] = useState("");
  const [inputBase, setInputBase] = useState("10");
  const [results, setResults] = useState<Record<string, string>>({});

  const convertNumber = (value: string, fromBase: number) => {
    const decimal = parseInt(value, fromBase);
    if (isNaN(decimal)) throw new Error("Invalid number");
    return {
      binary: decimal.toString(2),
      octal: decimal.toString(8),
      decimal: decimal.toString(10),
      hexadecimal: decimal.toString(16).toUpperCase(),
      base64: btoa(decimal.toString()),
      base32: decimal.toString(32).toUpperCase(),
      base36: decimal.toString(36).toUpperCase(),
    };
  };

  const handleConvert = () => {
    try {
      if (!inputValue.trim()) {
        showErrorToast(t("common.error"), t("integerBaseConverter.errorEnter"));
        return;
      }
      const converted = convertNumber(inputValue, parseInt(inputBase));
      setResults(converted);
    } catch {
      showErrorToast(t("common.error"), t("integerBaseConverter.errorInvalid"));
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Hash className="h-5 w-5" />
            <CardTitle>{t("integerBaseConverter.title")}</CardTitle>
          </div>
          <CardDescription>
            {t("integerBaseConverter.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="input-number">{t("integerBaseConverter.inputLabel")}</Label>
              <Input
                id="input-number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter number..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="input-base">{t("integerBaseConverter.inputBase")}</Label>
              <Select value={inputBase} onValueChange={setInputBase}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">Binary (2)</SelectItem>
                  <SelectItem value="8">Octal (8)</SelectItem>
                  <SelectItem value="10">Decimal (10)</SelectItem>
                  <SelectItem value="16">Hexadecimal (16)</SelectItem>
                  <SelectItem value="32">Base32 (32)</SelectItem>
                  <SelectItem value="36">Base36 (36)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleConvert} className="w-full">
            {t("integerBaseConverter.convertBtn")}
          </Button>
          {Object.keys(results).length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t("integerBaseConverter.resultsTitle")}</h3>
              <div className="grid gap-3">
                {Object.entries(results).map(([base, value]) => (
                  <div
                    key={base}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-sm uppercase text-slate-600 dark:text-slate-400">
                        {base}
                      </div>
                      <div className="font-mono text-sm mt-1 break-all">{value}</div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(value, t("common.copied"))}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegerBaseConverter;
