const API_BASE = "https://api.frankfurter.dev/v1";

export interface Currency {
  code: string;
  rate: number;
}

export interface FetchRatesResult {
  base: string;
  date?: string;
  currencies: Currency[];
}

export async function fetchRates(base = "USD"): Promise<FetchRatesResult> {
  const res = await fetch(`${API_BASE}/latest?base=${base}`);
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  const data = await res.json();
  const currencies: Currency[] = [
    { code: data.base, rate: data.amount ?? 1 },
    ...Object.entries(data.rates ?? {}).map(([c, r]) => ({ code: c, rate: r as number })),
  ];
  return { base: data.base, date: data.date, currencies };
}

export function convert(amount: number, fromRate: number, toRate: number): number {
  return (amount / fromRate) * toRate;
}
