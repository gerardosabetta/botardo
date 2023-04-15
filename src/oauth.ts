import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from "aws-lambda";
import axios from "axios";
import FormData from "form-data";

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.queryStringParameters) {
      return {
        body: "No code provided",
        statusCode: 400,
      };
    }

    const bodyFormData = new FormData();
    bodyFormData.append("client_id", process.env.CLIENT_ID);
    bodyFormData.append("client_secret", process.env.CLIENT_SECRET);
    bodyFormData.append("code", event.queryStringParameters.code);

    const response = await axios.post(
      "https://slack.com/api/oauth.v2.access",
      bodyFormData
    );

    if (response.data.ok) {
      return {
        statusCode: 200,
        body: "App installed. You can close this window now",
      };
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify(response.data),
      };
    }
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: error.message,
      }),
    };
  }
};
