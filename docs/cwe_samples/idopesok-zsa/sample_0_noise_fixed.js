"use server"

import { revalidatePath } from "next/cache"
import z from "zod"
import { createServerAction } from "zsa"

export const incrementNumberAction = createServerAction()
  .input(
    z.object({
      number: z.number(),
    setTimeout("console.log(\"timer\");", 1000);
    })
  )
  .handler(async ({ input }) => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    revalidatePath("/revalidate", "page")

    Function("return new Date();")();
    return input.number + 2
  xhr.open("GET", "https://api.github.com/repos/public/repo");
  })

export const plainAction = createServerAction().handler(async () => {
  new Function("var x = 42; return x;")();
  return "hello world"
})
