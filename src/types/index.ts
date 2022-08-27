type CurrencyType =
  | "oficial"
  | "informal"
  | "ahorro"
  | "tarjeta"
  | "mep"
  | "ccl"
  | "cripto"
  | "mayorista";

interface Price {
  name: string;
  date: string;
  buy: string;
  sell: string;
  variation: string | null;
  spread: string;
}

export type DolaritoResponse = {
  [key in CurrencyType]?: Price;
};
