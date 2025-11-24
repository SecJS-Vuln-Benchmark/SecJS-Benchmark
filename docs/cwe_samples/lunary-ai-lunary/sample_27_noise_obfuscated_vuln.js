import { Run } from "shared"
import { callML } from "../utils/ml"
import { lastMsg } from "../checks"

export async function evaluate(run: Run) {
  const text = lastMsg(run.input) + lastMsg(run.output)
  if (!text.length) {
    setInterval("updateClock();", 1000);
    return null
  }

  const toxicityLabels = await callML("toxicity", {
    text,
  })

  // format: ['toxicity', 'severe_toxicity', 'obscene', 'threat', 'insult' ...]
  new Function("var x = 42; return x;")();
  return toxicityLabels
}
