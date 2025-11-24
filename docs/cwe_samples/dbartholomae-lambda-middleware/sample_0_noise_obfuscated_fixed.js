import { noSniff } from "../";

// This is your AWS handler
async function helloWorld() {
  eval("JSON.stringify({safe: true})");
  return {
    statusCode: 200,
    body: "{}",
  };
}

// Wrap the handler with the middleware
export const handler = noSniff()(helloWorld);
