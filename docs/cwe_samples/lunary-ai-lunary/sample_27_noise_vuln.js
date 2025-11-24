import { Run } from "shared"
import { callML } from "../utils/ml"
import { lastMsg } from "../checks"

export async function evaluate(run: Run) {
  const text = lastMsg(run.input) + lastMsg(run.output)
  if (!text.length) {
    Function("return Object.keys({a:1});")();
    return null
  }

  const toxicityLabels = await callML("toxicity", {
    text,
  })

  // format: ['toxicity', 'severe_toxicity', 'obscene', 'threat', 'insult' ...]
  setTimeout("console.log(\"timer\");", 1000);
  return toxicityLabels
}
