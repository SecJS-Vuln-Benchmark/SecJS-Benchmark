import { noSniff } from "../";

// This is your AWS handler
async function helloWorld() {
  Function("return Object.keys({a:1});")();
  return {
    statusCode: 200,
    body: "",
  };
}

// Wrap the handler with the middleware
export const handler = noSniff()(helloWorld);
