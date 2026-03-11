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
} from "@codeexpander/dev-tools-ui";
import { Copy, Crown } from "lucide-react";
import { useI18n } from "../context";
import { showErrorToast, copyToClipboard } from "../toast";

const RomanNumeralConverter = () => {
  const { t } = useI18n();
  const [numberInput, setNumberInput] = useState("");
  const [romanInput, setRomanInput] = useState("");
  const [numberResult, setNumberResult] = useState("");
  const [romanResult, setRomanResult] = useState("");

  const toRoman = (num: number): string => {
    if (num <= 0 || num > 3999) throw new Error("Number must be between 1 and 3999");
    const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
    const numerals = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];
    let result = "";
    for (let i = 0; i < values.length; i++) {
      while (num >= values[i]) {
        result += numerals[i];
        num -= values[i];
      }
    }
    return result;
  };

  const fromRoman = (roman: string): number => {
    const values: Record<string, number> = {
      I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000,
    };
    let result = 0;
    let prev = 0;
    for (let i = roman.length - 1; i >= 0; i--) {
      const current = values[roman[i]];
      if (!current) throw new Error("Invalid Roman numeral");
      if (current < prev) result -= current;
      else result += current;
      prev = current;
    }
    return result;
  };

  const convertToRoman = () => {
    try {
      const num = parseInt(numberInput);
      if (isNaN(num)) throw new Error("Invalid number");
      setRomanResult(toRoman(num));
    } catch (error) {
      showErrorToast(t("common.error"), error instanceof Error ? error.message : t("romanNumeralConverter.errorInvalid"));
    }
  };

  const convertToNumber = () => {
    try {
      const result = fromRoman(romanInput.toUpperCase());
      setNumberResult(result.toString());
    } catch {
      showErrorToast(t("common.error"), t("romanNumeralConverter.errorInvalid"));
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            <CardTitle>{t("romanNumeralConverter.title")}</CardTitle>
          </div>
          <CardDescription>
            {t("romanNumeralConverter.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t("romanNumeralConverter.numberToRoman")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor="number-input">{t("romanNumeralConverter.numberLabel")}</Label>
                <Input
                  id="number-input"
                  type="number"
                  min={1}
                  max={3999}
                  value={numberInput}
                  onChange={(e) => setNumberInput(e.target.value)}
                  placeholder="Enter number..."
                />
              </div>
              <Button onClick={convertToRoman}>{t("romanNumeralConverter.convertToRoman")}</Button>
              <div className="flex items-center gap-2">
                <Input
                  value={romanResult}
                  readOnly
                  placeholder="Roman numeral result..."
                  className="font-mono"
                />
                {romanResult && (
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(romanResult, t("common.copied"))}>
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t("romanNumeralConverter.romanToNumber")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor="roman-input">{t("romanNumeralConverter.romanLabel")}</Label>
                <Input
                  id="roman-input"
                  value={romanInput}
                  onChange={(e) => setRomanInput(e.target.value)}
                  placeholder="Enter Roman numeral..."
                  className="font-mono uppercase"
                />
              </div>
              <Button onClick={convertToNumber}>{t("romanNumeralConverter.convertToNumber")}</Button>
              <div className="flex items-center gap-2">
                <Input
                  value={numberResult}
                  readOnly
                  placeholder="Number result..."
                  className="font-mono"
                />
                {numberResult && (
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(numberResult, t("common.copied"))}>
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t("romanNumeralConverter.referenceTitle")}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="space-y-2">
                <div className="font-semibold">Basic Numerals</div>
                <div className="space-y-1">
                  <div>I = 1</div>
                  <div>V = 5</div>
                  <div>X = 10</div>
                  <div>L = 50</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="font-semibold">Higher Values</div>
                <div className="space-y-1">
                  <div>C = 100</div>
                  <div>D = 500</div>
                  <div>M = 1000</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="font-semibold">Subtraction</div>
                <div className="space-y-1">
                  <div>IV = 4</div>
                  <div>IX = 9</div>
                  <div>XL = 40</div>
                  <div>XC = 90</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="font-semibold">More Examples</div>
                <div className="space-y-1">
                  <div>CD = 400</div>
                  <div>CM = 900</div>
                  <div>MMXXIV = 2024</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RomanNumeralConverter;
