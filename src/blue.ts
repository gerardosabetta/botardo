import axios from "axios";
import { KnownBlock } from "@slack/types";
import {
  DOLARITO_DOLAR_URL,
  DOLARITO_EURO_URL,
} from "./constants";
import { DolaritoResponse } from "./types";
import { getName } from "./utils";
import {
  APIGatewayEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from "aws-lambda";

/**
 * Slack would not send the message if we have more than 10 blocks
 */
const MAX_CURRENCIES = 10;

const formater = Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
});

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  try {
    console.log(event);
    const isEurosRequest = event.body?.includes("euro");
    const { data: dolaritoResponse } = await axios.get<DolaritoResponse>(
      isEurosRequest ? DOLARITO_EURO_URL : DOLARITO_DOLAR_URL
    );

    const responseBlocks: KnownBlock[] = [
      {
        type: "section",
        fields: Object.values(dolaritoResponse)
          .filter(
            ({ name }) =>
              ![
                "dolar tiendadolar",
                "dolar ledes ccl",
                "dolar ledes mep",
              ].includes(name)
          )
          .slice(0, MAX_CURRENCIES)
          .map(({ name, buy, sell, variation }) => ({
            type: "mrkdwn",
            text: `
*${getName({ name, variation: variation || "0" })}*
Compra: ${formater.format(+buy.replace(",", "."))} 
Venta: ${formater.format(+sell.replace(",", "."))} 
Variacion: ${variation || 0}% 
 `, // Intentional gremling
          })),
      },
    ];

    const response = {
      statusCode: 200,
      body: JSON.stringify({
        blocks: responseBlocks,
        replace_original: false,
        response_type: "in_channel",
      }),
    };
    return response;
  } catch (e) {
    const response = {
      statusCode: 500,
      body: JSON.stringify("Something went wrong"),
    };
    return response;
  }
};
