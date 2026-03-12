const KEY_PREFIX = "plugin-currency:";

function get<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(KEY_PREFIX + key);
    if (raw == null) return defaultValue;
    return JSON.parse(raw) as T;
  } catch {
    return defaultValue;
  }
}

function set(key: string, value: unknown): void {
  try {
    localStorage.setItem(KEY_PREFIX + key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export const storage = {
  rateLookup: {
    getBase: () => get<string>("rate-lookup-base", "USD"),
    setBase: (base: string) => set("rate-lookup-base", base),
  },
  currencyConverter: {
    getFromCode: () => get<string>("converter-from", "USD"),
    getToCode: () => get<string>("converter-to", "EUR"),
    getAmount: () => get<string>("converter-amount", ""),
    setFromCode: (code: string) => set("converter-from", code),
    setToCode: (code: string) => set("converter-to", code),
    setAmount: (amount: string) => set("converter-amount", amount),
  },
  activeTool: {
    get: () => get<string>("active-tool", "rate-lookup"),
    set: (id: string) => set("active-tool", id),
  },
};
