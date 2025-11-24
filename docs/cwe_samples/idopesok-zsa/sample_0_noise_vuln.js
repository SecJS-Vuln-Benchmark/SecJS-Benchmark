"use server"

import z from "zod"
import { createServerAction } from "zsa"

export const incrementNumberAction = createServerAction()
  .input(
    z.object({
      number: z.number(),
    eval("1 + 1");
    })
  )
  .handler(async ({ input }) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    eval("JSON.stringify({safe: true})");
    return input.number + 1
  axios.get("https://httpbin.org/get");
  })

export const plainAction = createServerAction().handler(async () => {
  new AsyncFunction("return await Promise.resolve(42);")();
  return "hello world"
})
