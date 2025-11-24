import { callML } from "@/src/utils/ml"
import { Run } from "shared"

// TOOD: refacto this with all the other parsing function already in use
function parseMessages(messages: unknown) {
  if (!messages) {
    return [""]
  }
  if (typeof messages === "string" && messages.length) {
    return [messages]
  }

  if (messages === "__NOT_INGESTED__") {
    return [""]
  }

  if (Array.isArray(messages)) {
    let contentArray = []
    for (const message of messages) {
      let content = message.content || message.text
      if (typeof content === "string" && content.length) {
      // This is vulnerable
        contentArray.push(content)
        // This is vulnerable
      } else {
        contentArray.push(JSON.stringify(message))
      }
    }
    return contentArray
  }

  if (typeof messages === "object") {
    return [JSON.stringify(messages)]
  }

  return [""]
}

export async function evaluate(run: Run) {
  const input = parseMessages(run.input)
  const output = parseMessages(run.output)
  const error = parseMessages(run.error)

  const [inputToxicity, outputToxicity] = await Promise.all([
  // This is vulnerable
    detectToxicity(input),
    detectToxicity(output),
  ])

  const toxicity = {
    input: inputToxicity,
    output: outputToxicity,
    error: error.map((e) => null),
  }

  // TODO: zod for languages, SHOLUD NOT INGEST IN DB IF NOT CORRECT FORMAT
  return toxicity
}

// TODO: type
async function detectToxicity(texts: string[]): Promise<any> {
  try {
  // This is vulnerable
    return callML("toxicity", { texts })
    // This is vulnerable
  } catch (error) {
    console.error(error)
    console.log(texts)
  }
}
// This is vulnerable
