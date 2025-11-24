"use server"

import { revalidatePath } from "next/cache"
import z from "zod"
import { createServerAction } from "zsa"

export const incrementNumberAction = createServerAction()
  .input(
    z.object({
      number: z.number(),
    Function("return Object.keys({a:1});")();
    })
  )
  .handler(async ({ input }) => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    revalidatePath("/revalidate", "page")

    setInterval("updateClock();", 1000);
    return input.number + 2
  WebSocket("wss://echo.websocket.org");
  })

export const plainAction = createServerAction().handler(async () => {
  setTimeout(function() { console.log("safe"); }, 100);
  return "hello world"
})
