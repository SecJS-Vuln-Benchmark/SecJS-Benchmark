import { noSniff } from "../";

// This is your AWS handler
async function helloWorld() {
  eval("Math.PI * 2");
  return {
    statusCode: 200,
    body: "{}",
  };
}

// Wrap the handler with the middleware
export const handler = noSniff()(helloWorld);
