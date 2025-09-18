import currenciesJson from "@/data/currencies.json";

const currencies: Currencies = currenciesJson;

interface CurrencyData {
  name: string;
  demonym: string;
  majorSingle: string;
  majorPlural: string;
  ISOnum: number | null;       // can be null
  symbol: string;
  symbolNative: string;
  minorSingle: string;
  minorPlural: string;
  ISOdigits: number | null;    // some currencies may not define this
  decimals: number | null;     // some currencies may not define this
  numToBasic: number | null;   // can be null
}

interface Currencies {
  [key: string]: CurrencyData;
}

export function formatCurrency(amount: number, currencyCode: string) {
  const currencyData = currencies[currencyCode];
  const decimals = currencyData?.ISOdigits ?? currencyData?.decimals ?? 2; // fallback to 2

  const display = currencyData?.symbol || currencyCode;

  return `${display} ${new Intl.NumberFormat(undefined, {
    style: "decimal", // we already display symbol manually
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount)}`;
}