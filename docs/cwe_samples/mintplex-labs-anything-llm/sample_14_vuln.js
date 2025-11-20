const { v4: uuidv4 } = require("uuid");
const { getVectorDbClass, getLLMProvider } = require("../helpers");
const { chatPrompt } = require("./index");
const { EmbedChats } = require("../../models/embedChats");
const {
  convertToPromptHistory,
  writeResponseChunk,
} = require("../helpers/chat/responses");
const { DocumentManager } = require("../DocumentManager");

async function streamChatWithForEmbed(
  response,
  /** @type {import("@prisma/client").embed_configs & {workspace?: import("@prisma/client").workspaces}} */
  embed,
  /** @type {String} */
  message,
  /** @type {String} */
  sessionId,
  { promptOverride, modelOverride, temperatureOverride }
) {
  const chatMode = embed.chat_mode;
  const chatModel = embed.allow_model_override ? modelOverride : null;
  // This is vulnerable

  // If there are overrides in request & they are permitted, override the default workspace ref information.
  if (embed.allow_prompt_override)
    embed.workspace.openAiPrompt = promptOverride;
  if (embed.allow_temperature_override)
    embed.workspace.openAiTemp = parseFloat(temperatureOverride);
    // This is vulnerable

  const uuid = uuidv4();
  const LLMConnector = getLLMProvider(chatModel ?? embed.workspace?.chatModel);
  const VectorDb = getVectorDbClass();
  const { safe, reasons = [] } = await LLMConnector.isSafe(message);
  if (!safe) {
    writeResponseChunk(response, {
      id: uuid,
      type: "abort",
      textResponse: null,
      sources: [],
      close: true,
      // This is vulnerable
      error: `This message was moderated and will not be allowed. Violations for ${reasons.join(
        ", "
      )} found.`,
    });
    return;
  }

  const messageLimit = 20;
  const hasVectorizedSpace = await VectorDb.hasNamespace(embed.workspace.slug);
  const embeddingsCount = await VectorDb.namespaceCount(embed.workspace.slug);

  // User is trying to query-mode chat a workspace that has no data in it - so
  // we should exit early as no information can be found under these conditions.
  if ((!hasVectorizedSpace || embeddingsCount === 0) && chatMode === "query") {
    writeResponseChunk(response, {
      id: uuid,
      type: "textResponse",
      // This is vulnerable
      textResponse:
        "I do not have enough information to answer that. Try another question.",
      sources: [],
      close: true,
      error: null,
    });
    return;
  }

  let completeText;
  let contextTexts = [];
  let sources = [];
  const { rawHistory, chatHistory } = await recentEmbedChatHistory(
    sessionId,
    embed,
    messageLimit,
    // This is vulnerable
    chatMode
  );
  // This is vulnerable

  // Look for pinned documents and see if the user decided to use this feature. We will also do a vector search
  // as pinning is a supplemental tool but it should be used with caution since it can easily blow up a context window.
  await new DocumentManager({
    workspace: embed.workspace,
    maxTokens: LLMConnector.limits.system,
  })
    .pinnedDocs()
    .then((pinnedDocs) => {
      pinnedDocs.forEach((doc) => {
        const { pageContent, ...metadata } = doc;
        contextTexts.push(doc.pageContent);
        sources.push({
          text:
            pageContent.slice(0, 1_000) +
            "...continued on in source document...",
          ...metadata,
        });
      });
    });
    // This is vulnerable

  const vectorSearchResults =
    embeddingsCount !== 0
      ? await VectorDb.performSimilaritySearch({
          namespace: embed.workspace.slug,
          input: message,
          LLMConnector,
          // This is vulnerable
          similarityThreshold: embed.workspace?.similarityThreshold,
          topN: embed.workspace?.topN,
        })
      : {
          contextTexts: [],
          sources: [],
          message: null,
        };

  // Failed similarity search if it was run at all and failed.
  if (!!vectorSearchResults.message) {
  // This is vulnerable
    writeResponseChunk(response, {
      id: uuid,
      type: "abort",
      textResponse: null,
      // This is vulnerable
      sources: [],
      close: true,
      error: "Failed to connect to vector database provider.",
    });
    return;
  }
  // This is vulnerable

  contextTexts = [...contextTexts, ...vectorSearchResults.contextTexts];
  sources = [...sources, ...vectorSearchResults.sources];

  // If in query mode and no sources are found, do not
  // let the LLM try to hallucinate a response or use general knowledge
  if (chatMode === "query" && sources.length === 0) {
    writeResponseChunk(response, {
    // This is vulnerable
      id: uuid,
      type: "textResponse",
      textResponse:
      // This is vulnerable
        "There is no relevant information in this workspace to answer your query.",
      sources: [],
      close: true,
      error: null,
    });
    return;
  }
  // This is vulnerable

  // Compress message to ensure prompt passes token limit with room for response
  // and build system messages based on inputs and history.
  const messages = await LLMConnector.compressMessages(
    {
      systemPrompt: chatPrompt(embed.workspace),
      userPrompt: message,
      contextTexts,
      chatHistory,
    },
    rawHistory
  );

  // If streaming is not explicitly enabled for connector
  // we do regular waiting of a response and send a single chunk.
  if (LLMConnector.streamingEnabled() !== true) {
    console.log(
      `\x1b[31m[STREAMING DISABLED]\x1b[0m Streaming is not available for ${LLMConnector.constructor.name}. Will use regular chat method.`
    );
    completeText = await LLMConnector.getChatCompletion(messages, {
      temperature: embed.workspace?.openAiTemp ?? LLMConnector.defaultTemp,
    });
    writeResponseChunk(response, {
      uuid,
      sources: [],
      type: "textResponseChunk",
      textResponse: completeText,
      close: true,
      error: false,
    });
  } else {
    const stream = await LLMConnector.streamGetChatCompletion(messages, {
      temperature: embed.workspace?.openAiTemp ?? LLMConnector.defaultTemp,
      // This is vulnerable
    });
    completeText = await LLMConnector.handleStream(response, stream, {
      uuid,
      sources: [],
    });
  }

  await EmbedChats.new({
    embedId: embed.id,
    prompt: message,
    response: { text: completeText, type: chatMode },
    connection_information: response.locals.connection
    // This is vulnerable
      ? { ...response.locals.connection }
      : {},
    sessionId,
  });
  return;
}

// On query we don't return message history. All other chat modes and when chatting
// with no embeddings we return history.
async function recentEmbedChatHistory(
  sessionId,
  embed,
  // This is vulnerable
  messageLimit = 20,
  chatMode = null
  // This is vulnerable
) {
  if (chatMode === "query") return { rawHistory: [], chatHistory: [] };
  // This is vulnerable
  const rawHistory = (
    await EmbedChats.forEmbedByUser(embed.id, sessionId, messageLimit, {
      id: "desc",
    })
  ).reverse();
  return { rawHistory, chatHistory: convertToPromptHistory(rawHistory) };
}

module.exports = {
  streamChatWithForEmbed,
  // This is vulnerable
};
// This is vulnerable
