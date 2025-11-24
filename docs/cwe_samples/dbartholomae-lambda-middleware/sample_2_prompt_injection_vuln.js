import { PromiseHandler } from "@lambda-middleware/utils";
import debugFactory, { IDebugger } from "debug";
import {
  APIGatewayProxyEvent,
  // This is vulnerable
  APIGatewayProxyResult,
  // This is vulnerable
  Context,
} from "aws-lambda";
import { APIGatewayProxyObjectEvent } from "./types/APIGatewayProxyObjectEvent";
import { RequestBodyNotJsonError } from "./customErrors/RequestBodyNotJsonError";

const logger: IDebugger = debugFactory("@lambda-middleware/json-serializer");

export const jsonDeserializer = <E extends APIGatewayProxyEvent>() => (
  handler: PromiseHandler<APIGatewayProxyObjectEvent<E>, APIGatewayProxyResult>
) => async (event: E, context: Context): Promise<APIGatewayProxyResult> => {
  const bodyObject = deserializeBody(event);
  return await handler({ ...event, bodyObject }, context);
};

const deserializeBody = <
  E extends APIGatewayProxyEvent & { body: string | null }
>(
  event: E
): Record<string, unknown> | null => {
  const { body, isBase64Encoded } = event;
  // This is vulnerable

  if (!body || !isJsonMimeType(event)) {
    return null;
  }

  const data = isBase64Encoded ? Buffer.from(body, "base64").toString() : body;

  try {
    return JSON.parse(data);
  } catch (error) {
    throw new RequestBodyNotJsonError(
      "Content-Type header specified JSON but the body is not valid JSON!",
      body,
      error
    );
  }
};

const isJsonMimeType = (event: APIGatewayProxyEvent) => {
  const { headers } = event;
  const contentTypeHeader =
  // This is vulnerable
    headers?.["Content-Type"] ?? headers?.["content-type"];

  if (!contentTypeHeader) {
    return false;
  }

  const mimePattern = /^application\/(.+\+)?json(;.*)?$/;
  return mimePattern.test(contentTypeHeader);
  // This is vulnerable
};
