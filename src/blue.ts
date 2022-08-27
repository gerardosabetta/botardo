import axios from "axios";
import { KnownBlock } from "@slack/types";
import { DOLARITO_PRICES_URL } from "./constants";
import { DolaritoResponse } from "./types";
import { table } from "table";
import { capitalize } from "./utils";
import {
  APIGatewayEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from "aws-lambda";

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
      DOLARITO_PRICES_URL,
      {
        params: {
          currency: isEurosRequest ? "euro" : "dolar",
        },
      }
    );

    const tableHeaders = ["Cotizacion", "Compra", "Venta", "Variacion"];

    const responseTable = table(
      [
        tableHeaders,
        ...Object.values(
          dolaritoResponse
        ).map(({ name, buy, sell, variation }) => [
          capitalize(name),
          formater.format(+buy.replace(",", ".")),
          formater.format(+sell.replace(",", ".")),
          variation
            ? `${variation.includes("-") ? "▼" : "▲"} ${variation.replace(
                "-",
                ""
              )}%`
            : "",
        ]),
      ],
      {
        singleLine: true,
        header: {
          content: "Cotizaciones Argentina",
        },
        columnDefault: {
          alignment: "center",
          width: 15,
        },
        border: {
          topBody: `─`,
          topJoin: `┬`,
          topLeft: `┌`,
          topRight: `┐`,

          bottomBody: `─`,
          bottomJoin: `┴`,
          bottomLeft: `└`,
          bottomRight: `┘`,

          bodyLeft: `│`,
          bodyRight: `│`,
          bodyJoin: `│`,

          joinBody: `─`,
          joinLeft: `├`,
          joinRight: `┤`,
          joinJoin: `┼`,
        },
      }
    );

    const responseBlocks: KnownBlock[] = [
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `\`\`\`${responseTable}\`\`\``,
          },
        ],
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
