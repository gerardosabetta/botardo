import sortBy from "lodash/sortBy";
import { IInfobaeCurrency } from "../types/infobae";

const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const stripIrrelevantInfobaeCurrenciesAndSortThem = (
  currencies: IInfobaeCurrency[]
) => {
  const currenciesToKeep = [
    "dolar-libre",
    "dolar-bco-nacion",
    "dolar-solidario",
    "contado-con-liqui",
    "dolar-ccl",
    "riesgo-pais",
  ];

  return sortBy(
    currencies.filter((currency) => currenciesToKeep.includes(currency.tag)),
    (currency) => currenciesToKeep.indexOf(currency.tag)
  );
};

export const getInfobaeMarkdown = (
  infobaeRelevantCurrencies: IInfobaeCurrency[]
) => {
  return `🇦🇷 Argentina: \n ${infobaeRelevantCurrencies
    .map(
      (infobaeCurrency) =>
        `*${infobaeCurrency.currency}*: ${infobaeCurrency.unico}`
    )
    .join("\n")}`;
};

export const getCryptoMarkdown = (coingeckoEntries: any[]) => {
  return `🦎 Coingecko: \n ${coingeckoEntries
    .map(
      ([cryptoName, val]) => `*${capitalize(cryptoName)}*: ${val.usd} (USD) \n`
    )
    .join("")}`;
};
