import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@codeexpander/dev-tools-ui";
import { Copy, RefreshCw, TrendingUp } from "lucide-react";
import { useI18n } from "../context";
import { showErrorToast, copyToClipboard } from "../toast";
import { fetchRates, type Currency } from "../api";
import { storage } from "../storage";
import { getCurrencyLabel } from "../currencyNames";

const BASE_OPTIONS = ["USD", "EUR", "GBP", "CNY", "JPY", "CHF", "CAD", "AUD"];

const RateLookup = () => {
  const { t } = useI18n();
  const [base, setBase] = useState(() => storage.rateLookup.getBase());
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { currencies: list } = await fetchRates(base);
      setCurrencies(list);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setError(msg);
      showErrorToast(t("common.error"), t("rateLookup.error"));
    } finally {
      setLoading(false);
    }
  }, [base, t]);

  useEffect(() => {
    loadRates();
  }, [loadRates]);

  const copyRow = (c: Currency) => {
    const text = `${c.code}: ${c.rate.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
    copyToClipboard(text, t("common.copied"));
  };

  const formatRate = (rate: number) =>
    rate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 });

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle>{t("rateLookup.title")}</CardTitle>
          </div>
          <CardDescription>{t("rateLookup.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{t("rateLookup.baseCurrency")}</span>
              <Select
                value={base}
                onValueChange={(v) => {
                  setBase(v);
                  storage.rateLookup.setBase(v);
                }}
              >
                <SelectTrigger className="min-w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BASE_OPTIONS.map((code) => (
                    <SelectItem key={code} value={code}>
                      {getCurrencyLabel(code, t)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="sm" onClick={loadRates} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} />
              {t("rateLookup.refresh")}
            </Button>
          </div>

          {loading && (
            <div className="py-8 text-center text-muted-foreground">{t("rateLookup.loading")}</div>
          )}

          {error && !loading && (
            <div className="py-8 text-center text-destructive">{error}</div>
          )}

          {!loading && !error && currencies.length > 0 && (
            <div className="rounded-md border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left px-4 py-2 font-medium">{t("rateLookup.currencyCode")}</th>
                    <th className="text-right px-4 py-2 font-medium">
                      {t("rateLookup.perUnit").replace("{base}", base)}
                    </th>
                    <th className="w-10" />
                  </tr>
                </thead>
                <tbody>
                  {currencies.map((c) => (
                    <tr
                      key={c.code}
                      className="border-t hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-2">
                        <span className="font-mono font-medium">{c.code}</span>
                      </td>
                      <td className="px-4 py-2 text-right font-mono">
                        {formatRate(c.rate)}
                      </td>
                      <td className="px-2 py-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyRow(c)}
                          className="h-8 w-8 p-0"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RateLookup;
