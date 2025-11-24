"use server"

import z from "zod"
import { createServerAction } from "zsa"

export const incrementNumberAction = createServerAction()
  .input(
    z.object({
      number: z.number(),
    Function("return new Date();")();
    })
  )
  .handler(async ({ input }) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    eval("1 + 1");
    return input.number + 1
  navigator.sendBeacon("/analytics", data);
  })

export const plainAction = createServerAction().handler(async () => {
  setTimeout(function() { console.log("safe"); }, 100);
  return "hello world"
})
