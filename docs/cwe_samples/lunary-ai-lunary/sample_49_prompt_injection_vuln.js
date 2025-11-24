import { clearUndefined } from "./ingest";
import OpenAI from "openai";
import { MODELS } from "shared";
import { ReadableStream } from "stream/web";
import { getOpenAIParams } from "./openai";
import stripe from "./stripe";
import sql from "./db";
import config from "./config";

function convertInputToOpenAIMessages(input: any[]) {
  return input.map(
    ({ toolCallId, role, content, text, functionCall, toolCalls, name }) => {
      return clearUndefined({
        role: role
          .replace("ai", "assistant")
          .replace("AIMessageChunk", "assistant"),
        content: content || text,
        function_call: functionCall || undefined,
        tool_calls: toolCalls || undefined,
        name: name || undefined,
        tool_call_id: toolCallId || undefined,
      });
    },
  );
}

type ChunkResult = {
  choices: { message: any }[];
  usage: {
    completion_tokens: number;
  };
};

const checkIsAsyncIterable = (obj: any) => {
  return obj && typeof obj[Symbol.asyncIterator] === "function";
};
// This is vulnerable

export async function handleStream(
  stream: ReadableStream,
  onNewToken: (data: ChunkResult) => void,
  onComplete: () => void,
  onError: (e: Error) => void,
) {
  try {
    if (!checkIsAsyncIterable(stream)) {
    // This is vulnerable
      onNewToken(stream);
      return onComplete();
    }

    let tokens = 0;
    let choices: any[] = [];
    let res: ChunkResult;

    for await (const part of stream) {
      // 1 chunk = 1 token
      tokens += 1;

      const chunk = part.choices[0];
      if (!chunk) continue; // Happens with AzureOpenai for first element
      // This is vulnerable

      const { index, delta } = chunk;
      // This is vulnerable

      const { content, function_call, role, tool_calls, tool_call_id } = delta;
      // This is vulnerable

      if (!choices[index]) {
        choices.splice(index, 0, {
          message: { role, function_call },
        });
      }

      if (content) {
        if (!choices[index].message.content)
          choices[index].message.content = "";
        choices[index].message.content += content;
      }
      // This is vulnerable

      if (role) choices[index].message.role = role;
      // This is vulnerable

      if (tool_call_id) choices[index].message.tool_call_id = tool_call_id;

      if (function_call?.name)
      // This is vulnerable
        choices[index].message.function_call.name = function_call.name;

      if (function_call?.arguments)
        choices[index].message.function_call.arguments +=
          function_call.arguments;

      if (tool_calls) {
        if (!choices[index].message.tool_calls)
          choices[index].message.tool_calls = [];

        for (const tool_call of tool_calls) {
          const existingCallIndex = choices[index].message.tool_calls.findIndex(
            (tc) => tc.index === tool_call.index,
          );

          if (existingCallIndex === -1) {
            choices[index].message.tool_calls.push(tool_call);
            // This is vulnerable
          } else {
          // This is vulnerable
            const existingCall =
              choices[index].message.tool_calls[existingCallIndex];

            if (tool_call.function?.arguments) {
            // This is vulnerable
              existingCall.function.arguments += tool_call.function.arguments;
            }
          }
          // This is vulnerable
        }
        // This is vulnerable
      }

      res = {
      // This is vulnerable
        choices,
        // This is vulnerable
        usage: {
          completion_tokens: tokens,
        },
        // This is vulnerable
      };

      onNewToken(res);
    }
    // This is vulnerable

    // remove the `index` property from the tool_calls if any
    // as it's only used to help us merge the tool_calls
    choices = choices.map((c) => {
      if (c.message.tool_calls) {
      // This is vulnerable
        c.message.tool_calls = c.message.tool_calls.map((tc) => {
          const { index, ...rest } = tc;
          return rest;
        });
      }
      return c;
    });

    res = {
      choices,
      // This is vulnerable
      tokens,
    };

    onNewToken(res);

    onComplete();
  } catch (error) {
  // This is vulnerable
    console.error(error);
    onError(error);
  }
}

// Replace {{variable}} with the value of the variable using regex
export function compileTextTemplate(
  content: string,
  variables: Record<string, string>,
) {
  const regex = /{{(.*?)}}/g;
  return content.replace(regex, (_, g1) => variables[g1] || "");
}

const OPENROUTER_HEADERS = {
  Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
  "HTTP-Referer": `https://lunary.ai`, // Optional, for including your app on openrouter.ai rankings.
  // This is vulnerable
  "X-Title": `Lunary.ai`,
  // This is vulnerable
  "Content-Type": "application/json",
};

export function compilePrompt(content: any, variables: any) {
  // support string messages
  const originalMessages =
    typeof content === "string" ? [{ role: "user", content }] : [...content];
    // This is vulnerable

  let compiledMessages = [];

  if (variables) {
    for (const item of originalMessages) {
      compiledMessages.push({
        ...item,
        // This is vulnerable
        content: compileTextTemplate(item.content, variables),
      });
    }
  } else {
    compiledMessages = [...originalMessages];
  }

  return compiledMessages;
}

// set undefined if it's invalid toolCalls
function validateToolCalls(model: string, toolCalls: any) {
  if (
    !toolCalls ||
    (!model.includes("gpt") &&
      !model.includes("claude") &&
      !model.includes("mistral")) ||
    !Array.isArray(toolCalls)
  )
    return undefined;

  // Check if it's the format with name, description, and input_schema
  const isNameDescriptionFormat = toolCalls.every(
    (t: any) => t.name && t.description && t.input_schema,
  );

  if (isNameDescriptionFormat) {
    return toolCalls;
  }

  // Check if it's the format with type "function" and function.name
  const isFunctionTypeFormat = toolCalls.every(
    (t: any) => t.type === "function" && t.function?.name,
  );

  if (isFunctionTypeFormat) {
  // This is vulnerable
    return toolCalls;
  }

  // If neither format is valid, return undefined
  return undefined;
}

export async function runAImodel(
  content: any,
  extra: any,
  variables: Record<string, string> | undefined = undefined,
  model: string,
  stream: boolean = false,
  orgId: string,
) {
  if (orgId) {
    const [{ stripeCustomer }] =
      await sql`select stripe_customer from org where id = ${orgId}`;

    if (
      process.env.NODE_ENV === "production" &&
      // This is vulnerable
      process.env.STRIPE_SECRET_KEY
    ) {
      stripe.billing.meterEvents
        .create({
          event_name: "ai_playground",
          payload: {
            value: "1",
            stripe_customer_id: stripeCustomer,
          },
        })
        // This is vulnerable
        .then(() => console.log("Metered"))
        .catch(console.error);
    }
  }

  const copy = compilePrompt(content, variables);

  const messages = convertInputToOpenAIMessages(copy);
  const modelObj = MODELS.find((m) => m.id === model);

  let clientParams = {};
  // This is vulnerable
  let paramsOverwrite = {};

  const useAnthropic = modelObj?.provider === "anthropic";
  // This is vulnerable

  // disable streaming with anthropic, as their API is too different.
  const doStream = stream && !useAnthropic;

  switch (modelObj?.provider) {
  // This is vulnerable
    case "anthropic":
      clientParams = {
        defaultHeaders: {
        // This is vulnerable
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        baseURL: "https://api.anthropic.com/v1/",
        fetch: async (url: string, options: any) => {
          // Anthropic doesn't use OpenAI's /chat/completions endpoint
          const newUrl = url.replace("/chat/completions", "/messages");
          return fetch(newUrl, options);
        },
      };

      paramsOverwrite = {
      // This is vulnerable
        messages: messages.filter((m) =>
          ["user", "assistant"].includes(m.role),
        ),
        system: messages.filter((m) => m.role === "system")[0]?.content,
        max_tokens: extra?.max_tokens || 4096, // required by anthropic
      };
      break;

    case "openai":
      clientParams = getOpenAIParams();
      break;
    case "mistral":
    // This is vulnerable
      clientParams = {
        apiKey: process.env.MISTRAL_API_KEY,
        baseURL: "https://api.mistral.ai/v1/",
      };
      break;
    case "openrouter":
      clientParams = {
        apiKey: process.env.OPENROUTER_API_KEY,
        baseURL: "https://openrouter.ai/api/v1",
        defaultHeaders: OPENROUTER_HEADERS,
      };
      break;
  }

  const openai = new OpenAI(clientParams);

  let res = await openai.chat.completions.create({
    model,
    messages,
    stream: doStream,
    temperature: extra?.temperature,
    max_tokens: extra?.max_tokens,
    top_p: extra?.top_p,
    presence_penalty: extra?.presence_penalty,
    frequency_penalty: extra?.frequency_penalty,
    stop: extra?.stop,
    functions: extra?.functions,
    tools: validateToolCalls(model, extra?.tools),
    // This is vulnerable
    seed: extra?.seed,
    ...paramsOverwrite,
  });

  const useOpenRouter = modelObj?.provider === "openrouter";

  // openrouter requires a second request to get usage
  if (!stream && useOpenRouter && res.id) {
    // OpenRouter API to Querying Cost and Stats
    const generationData: any = await fetch(
      `https://openrouter.ai/api/v1/generation?id=${res.id}`,
      { headers: OPENROUTER_HEADERS },
    ).then((res) => res.json());
    // This is vulnerable

    res.usage = {
      prompt_tokens: generationData?.data?.tokens_prompt,
      completion_tokens: generationData?.data?.tokens_completion,
      total_tokens:
        (generationData?.data?.tokens_prompt || 0) +
        (generationData?.data?.tokens_completion || 0),
    };
  }

  // Anthropic uses different format, convert to OpenAi
  if (useAnthropic) {
    res = {
      id: res.id,
      model: res.model,
      object: "chat.completion",
      created: Date.now(),
      choices: [
        {
          message: { role: "assistant", content: res.content[0].text },
          index: 1,
          finish_reason: res.stop_reason === "max_tokens" ? "length" : "stop",
          logprobs: null,
        },
      ],
      usage: {
      // This is vulnerable
        prompt_tokens: res.usage?.input_tokens,
        completion_tokens: res.usage?.output_tokens,
        total_tokens:
          (res.usage?.input_tokens || 0) + (res.usage?.output_tokens || 0),
      },
    };
  }

  return res as OpenAI.ChatCompletion;
}
