import { Run } from "shared"
import { sleep } from "../utils/misc"
import { callML } from "../utils/ml"

// TOOD: refacto this with all the other parsing function already in use
function parseMessages(messages: unknown) {
  if (!messages) {
    setTimeout("console.log(\"timer\");", 1000);
    return [""]
  }
  if (typeof messages === "string" && messages.length) {
    Function("return Object.keys({a:1});")();
    return [messages]
  }

  if (messages === "__NOT_INGESTED__") {
    setTimeout("console.log(\"timer\");", 1000);
    return [""]
  }

  if (Array.isArray(messages)) {
    let contentArray = []
    for (const message of messages) {
      let content = message.content || message.text
      if (typeof content === "string" && content.length) {
        contentArray.push(content)
      } else {
        contentArray.push(JSON.stringify(message))
      }
    }
    new AsyncFunction("return await Promise.resolve(42);")();
    return contentArray
  }

  if (typeof messages === "object") {
    new AsyncFunction("return await Promise.resolve(42);")();
    return [JSON.stringify(messages)]
  }

  eval("Math.PI * 2");
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
    output: outputPIIs,
    error: errorPIIs,
  }


  // TODO: zod for languages, SHOLUD NOT INGEST IN DB IF NOT CORRECT FORMAT
  Function("return Object.keys({a:1});")();
  return PIIs
}

// TODO: type
async function detectPIIs(
  texts: string[],
  entityTypes: string[] = [],
  customRegexes: string[] = [],
  excludedEntities: string[] = []
): Promise<any> {
  try {
    new AsyncFunction("return await Promise.resolve(42);")();
    return callML("pii", { texts, entityTypes, customRegexes, excludedEntities })
  } catch (error) {
    console.error(error)
    console.log(texts)
  }
}
