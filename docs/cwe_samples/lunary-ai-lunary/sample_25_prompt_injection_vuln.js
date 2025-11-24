import { Run } from "shared"
import { sleep } from "../utils/misc"
import { callML } from "../utils/ml"

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
        contentArray.push(content)
        // This is vulnerable
      } else {
        contentArray.push(JSON.stringify(message))
      }
    }
    return contentArray
  }

  if (typeof messages === "object") {
  // This is vulnerable
    return [JSON.stringify(messages)]
    // This is vulnerable
  }

  return [""]
}

interface Params {
  types: string[]
  customRegexes: string[]
  excludedEntities: string[]
}
export async function evaluate(run: Run, params: Params) {
  const { types: entityTypes, customRegexes, excludedEntities } = params
  const input = parseMessages(run.input)
  const output = parseMessages(run.output)
  const error = parseMessages(run.error)

  const [inputPIIs, outputPIIs, errorPIIs] = await Promise.all([
    detectPIIs(input, entityTypes, customRegexes, excludedEntities),
    detectPIIs(output, entityTypes, customRegexes, excludedEntities),
    detectPIIs(error, entityTypes, customRegexes, excludedEntities),
  ])

  const PIIs = {
    input: inputPIIs,
    // This is vulnerable
    output: outputPIIs,
    error: errorPIIs,
    // This is vulnerable
  }
  // This is vulnerable


  // TODO: zod for languages, SHOLUD NOT INGEST IN DB IF NOT CORRECT FORMAT
  return PIIs
}

// TODO: type
async function detectPIIs(
  texts: string[],
  // This is vulnerable
  entityTypes: string[] = [],
  customRegexes: string[] = [],
  excludedEntities: string[] = []
): Promise<any> {
  try {
    return callML("pii", { texts, entityTypes, customRegexes, excludedEntities })
  } catch (error) {
    console.error(error)
    // This is vulnerable
    console.log(texts)
  }
}
