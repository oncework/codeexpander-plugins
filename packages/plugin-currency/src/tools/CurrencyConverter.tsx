import { useState, useEffect, useCallback } from "react";
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
import { Copy, ArrowRightLeft, ArrowLeftRight } from "lucide-react";
import { useI18n } from "../context";
import { showErrorToast, copyToClipboard } from "../toast";
import { fetchRates, convert, type Currency } from "../api";
import { storage } from "../storage";
import { getCurrencyLabel } from "../currencyNames";

const CurrencyConverter = () => {
  const { t } = useI18n();
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);
  const [fromCode, setFromCode] = useState(() => storage.currencyConverter.getFromCode());
  const [toCode, setToCode] = useState(() => storage.currencyConverter.getToCode());
  const [amount, setAmount] = useState(() => storage.currencyConverter.getAmount());
  const [result, setResult] = useState<number | null>(null);

  const loadRates = useCallback(async () => {
    setLoading(true);
    try {
      const { currencies: list } = await fetchRates("USD");
      setCurrencies(list);
      if (list.length > 0) {
        setFromCode((prev) => {
          const next = list.find((c) => c.code === prev) ? prev : list[0].code;
          storage.currencyConverter.setFromCode(next);
          return next;
        });
        setToCode((prev) => {
          const next = list.find((c) => c.code === prev) ? prev : list[1]?.code ?? list[0].code;
          storage.currencyConverter.setToCode(next);
          return next;
        });
      }
    } catch (e) {
      showErrorToast(t("common.error"), t("rateLookup.error"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadRates();
  }, [loadRates]);

  const handleConvert = () => {
    const num = parseFloat(amount);
    if (!amount.trim() || isNaN(num) || num <= 0) {
      showErrorToast(t("common.error"), t("currencyConverter.errorInvalid"));
      return;
    }
    const fromCur = currencies.find((c) => c.code === fromCode);
    const toCur = currencies.find((c) => c.code === toCode);
    if (!fromCur || !toCur) return;
    const value = convert(num, fromCur.rate, toCur.rate);
    setResult(value);
  };

  const copyResult = () => {
    if (result === null) return;
    const text = `${amount} ${fromCode} = ${result.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${toCode}`;
    copyToClipboard(text, t("common.copied"));
  };

  const handleSwap = () => {
    const nextFrom = toCode;
    const nextTo = fromCode;
    setFromCode(nextFrom);
    setToCode(nextTo);
    storage.currencyConverter.setFromCode(nextFrom);
    storage.currencyConverter.setToCode(nextTo);
    if (amount.trim()) {
      const num = parseFloat(amount);
      if (!isNaN(num) && num > 0) {
        const fromCur = currencies.find((c) => c.code === nextFrom);
        const toCur = currencies.find((c) => c.code === nextTo);
        if (fromCur && toCur) {
          setResult(convert(num, fromCur.rate, toCur.rate));
        } else {
          setResult(null);
        }
      }
    } else {
      setResult(null);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <ArrowRightLeft className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle>{t("currencyConverter.title")}</CardTitle>
          </div>
          <CardDescription>{t("currencyConverter.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <div className="py-8 text-center text-muted-foreground">{t("rateLookup.loading")}</div>
          ) : (
            <>
              <div className="flex flex-wrap items-end gap-3">
                <div className="flex-1 min-w-[120px] space-y-2">
                  <Label htmlFor="from-currency">{t("currencyConverter.from")}</Label>
                  <Select
                    value={fromCode}
                    onValueChange={(v) => {
                      setFromCode(v);
                      storage.currencyConverter.setFromCode(v);
                    }}
                  >
                    <SelectTrigger id="from-currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((c) => (
                        <SelectItem key={c.code} value={c.code}>
                          {getCurrencyLabel(c.code, t)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleSwap}
                  className="shrink-0 h-10 w-10 rounded-full mb-0.5"
                  title={t("currencyConverter.swap")}
                >
                  <ArrowLeftRight className="h-5 w-5" />
                </Button>
                <div className="flex-1 min-w-[120px] space-y-2">
                  <Label htmlFor="to-currency">{t("currencyConverter.to")}</Label>
                  <Select
                    value={toCode}
                    onValueChange={(v) => {
                      setToCode(v);
                      storage.currencyConverter.setToCode(v);
                    }}
                  >
                    <SelectTrigger id="to-currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((c) => (
                        <SelectItem key={c.code} value={c.code}>
                          {getCurrencyLabel(c.code, t)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">{t("currencyConverter.amount")}</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => {
                    const v = e.target.value;
                    setAmount(v);
                    storage.currencyConverter.setAmount(v);
                  }}
                  step="any"
                  min="0"
                />
              </div>

              <Button onClick={handleConvert} className="w-full">
                {t("currencyConverter.convert")}
              </Button>

              {result !== null && (
                <div className="rounded-lg border bg-muted/30 p-4 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">{t("currencyConverter.result")}: </span>
                    <span className="text-lg font-semibold">
                      {result.toLocaleString(undefined, { maximumFractionDigits: 2 })} {toCode}
                    </span>
                  </div>
                  <Button variant="outline" size="sm" onClick={copyResult}>
                    <Copy className="h-4 w-4 mr-1" />
                    {t("common.copy")}
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CurrencyConverter;
