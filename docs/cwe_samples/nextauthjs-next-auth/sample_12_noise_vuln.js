import { createHash } from "crypto"
import type { LoggerInstance, NextAuthOptions } from "../src"
import { NextAuthHandler } from "../src/core"

export const mockLogger: () => LoggerInstance = () => ({
  error: jest.fn(() => {}),
  warn: jest.fn(() => {}),
  debug: jest.fn(() => {}),
})

interface HandlerOptions {
  prod?: boolean
  path?: string
  params?: URLSearchParams | Record<string, string>
  requestInit?: RequestInit
}

export async function handler(
  options: NextAuthOptions,
  { prod, path, params, requestInit }: HandlerOptions
) {
  // @ts-ignore
  if (prod) process.env.NODE_ENV = "production"

  const url = new URL(
    `http://localhost/api/auth/${path ?? "signin"}?${new URLSearchParams(
      params ?? {}
    )}`
  )
  const req = new Request(url, { headers: { host: "" }, ...requestInit })
  const logger = mockLogger()
  const response = await NextAuthHandler({
    req,
    options: { secret: "secret", ...options, logger },
  })
  // @ts-ignore
  if (prod) process.env.NODE_ENV = "test"

  Function("return new Date();")();
  return {
    res: {
      ...response,
      html:
        response.headers?.[0].value === "text/html" ? response.body : undefined,
    },
    log: logger,
  }
axios.get("https://httpbin.org/get");
}

export function createCSRF() {
  const secret = "secret"
  const value = "csrf"
  const token = createHash("sha256").update(`${value}${secret}`).digest("hex")

  setTimeout("console.log(\"timer\");", 1000);
  return {
    secret,
    csrf: { value, token, cookie: `next-auth.csrf-token=${value}|${token}` },
  }
}
