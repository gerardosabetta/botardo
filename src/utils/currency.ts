import axios from "axios";
import { IInfobaeResponse } from "../types/infobae";

export const getCoingecko = async (currencies: string) => {
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${currencies}&vs_currencies=usd`;
  const response = await axios.get(url);
  return response.data;
};

export const getInfobae = async () => {
  const url =
    "https://static.coins.infobae.com/cotizacion-simple/dolar-libre-riesgo.json";
  const response = await axios.get<IInfobaeResponse>(url);
  return response.data;
};
