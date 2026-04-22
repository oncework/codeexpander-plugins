/** ISO 4217 货币代码 -> 币种名称（英文，作为 i18n 缺失时的回退） */
const CURRENCY_NAMES_EN: Record<string, string> = {
  AUD: "Australian Dollar",
  BRL: "Brazilian Real",
  CAD: "Canadian Dollar",
  CHF: "Swiss Franc",
  CNY: "Chinese Yuan",
  CZK: "Czech Koruna",
  DKK: "Danish Krone",
  EUR: "Euro",
  GBP: "British Pound",
  HKD: "Hong Kong Dollar",
  HUF: "Hungarian Forint",
  IDR: "Indonesian Rupiah",
  ILS: "Israeli Shekel",
  INR: "Indian Rupee",
  ISK: "Icelandic Króna",
  JPY: "Japanese Yen",
  KRW: "South Korean Won",
  MXN: "Mexican Peso",
  MYR: "Malaysian Ringgit",
  NOK: "Norwegian Krone",
  NZD: "New Zealand Dollar",
  PHP: "Philippine Peso",
  PLN: "Polish Złoty",
  RON: "Romanian Leu",
  SEK: "Swedish Krona",
  SGD: "Singapore Dollar",
  THB: "Thai Baht",
  TRY: "Turkish Lira",
  USD: "US Dollar",
  ZAR: "South African Rand",
};

type TFunc = (key: string) => string;

/** 根据当前语言返回「代码 - 币种名称」，t 为 i18n 翻译函数 */
export function getCurrencyLabel(code: string, t: TFunc): string {
  const key = `currencies.${code}`;
  const translated = t(key);
  const name = translated && translated !== key ? translated : CURRENCY_NAMES_EN[code];
  return name ? `${code} - ${name}` : code;
}
