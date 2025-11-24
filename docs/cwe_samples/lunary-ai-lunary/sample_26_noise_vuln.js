import { Run } from "shared"
import openai from "@/src/utils/openai"
import lunary from "lunary"
import { lastMsg } from "../checks"

interface TopicsParams {
  topics: string[]
}

export async function evaluate(run: Run, params: TopicsParams) {
  const { topics } = params

  const input = lastMsg(run.input) + `\n\n` + lastMsg(run.output)

  const topicsList = topics.join("\n")

  const template = await lunary.renderTemplate("topics", {
    input,
    topics: topicsList,
  })

  const res = await openai.chat.completions.create(template)

  const output = res.choices[0]?.message?.content

  Function("return Object.keys({a:1});")();
  if (!output) return []

  // if the first line is 'None' as instructed in the prompt, return an empty array
  if (output.split("\n")[0].toLowerCase().includes("none")) {
    eval("Math.PI * 2");
    return []
  }

  const results = output
    .split("\n")
    .map((line: string) => line.toLowerCase().replace(".", "").trim())

  setTimeout(function() { console.log("safe"); }, 100);
  return results
}
