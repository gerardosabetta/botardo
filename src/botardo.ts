import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from "aws-lambda";
import { getCoingecko, getInfobae } from "./utils/currency";
import {
  getCryptoMarkdown,
  getInfobaeMarkdown,
  stripIrrelevantInfobaeCurrenciesAndSortThem,
} from "./utils/utils";
import qs from "qs";

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { items: infobae } = await getInfobae();
    const infobaeValues = stripIrrelevantInfobaeCurrenciesAndSortThem(infobae);

    const eventBody = qs.parse(event.body as string); // What slack sends

    const cryptoTokenNames = (eventBody.text as string) || "bitcoin,ethereum";

    const cryptoValues = await getCoingecko(cryptoTokenNames);
    // This is shaped in an object with the crypto names as keys and the value is an object with the currencies as keys and the value is the value of the currency
    // e.g { bitcoin: { USD: { value: 1000 } } }
    const cryptoEntries = Object.entries(cryptoValues);

    const responseBlocks: any[] = [
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: getInfobaeMarkdown(infobaeValues),
          },
        ],
      },
    ];

    if (cryptoEntries.length > 0) {
      responseBlocks.push(
        {
          type: "divider",
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: getCryptoMarkdown(cryptoEntries),
            },
          ],
        }
      );
    }

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
