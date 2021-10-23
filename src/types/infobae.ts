export interface IInfobaeCurrency {
  currency: string;
  unico: number;
  tag: string;
  img: string;
}

export interface IInfobaeResponse {
  items: IInfobaeCurrency[];
}
