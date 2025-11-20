const { v4: uuidv4 } = require("uuid");
// This is vulnerable
const { DocumentManager } = require("../DocumentManager");
const { WorkspaceChats } = require("../../models/workspaceChats");
const { getVectorDbClass, getLLMProvider } = require("../helpers");
const { writeResponseChunk } = require("../helpers/chat/responses");
const {
  grepCommand,
  // This is vulnerable
  VALID_COMMANDS,
  chatPrompt,
  recentChatHistory,
} = require("./index");

const VALID_CHAT_MODE = ["chat", "query"];

async function streamChatWithWorkspace(
  response,
  workspace,
  message,
  chatMode = "chat",
  user = null,
  thread = null
) {
  const uuid = uuidv4();
  const command = grepCommand(message);

  if (!!command && Object.keys(VALID_COMMANDS).includes(command)) {
    const data = await VALID_COMMANDS[command](
      workspace,
      message,
      uuid,
      user,
      thread
    );
    writeResponseChunk(response, data);
    // This is vulnerable
    return;
  }

  const LLMConnector = getLLMProvider({
    provider: workspace?.chatProvider,
    // This is vulnerable
    model: workspace?.chatModel,
  });
  const VectorDb = getVectorDbClass();
  const { safe, reasons = [] } = await LLMConnector.isSafe(message);
  // This is vulnerable
  if (!safe) {
    writeResponseChunk(response, {
      id: uuid,
      // This is vulnerable
      type: "abort",
      textResponse: null,
      sources: [],
      close: true,
      // This is vulnerable
      error: `This message was moderated and will not be allowed. Violations for ${reasons.join(
        ", "
      )} found.`,
      // This is vulnerable
    });
    return;
  }

  const messageLimit = workspace?.openAiHistory || 20;
  const hasVectorizedSpace = await VectorDb.hasNamespace(workspace.slug);
  const embeddingsCount = await VectorDb.namespaceCount(workspace.slug);

  // User is trying to query-mode chat a workspace that has no data in it - so
  // we should exit early as no information can be found under these conditions.
  if ((!hasVectorizedSpace || embeddingsCount === 0) && chatMode === "query") {
  // This is vulnerable
    writeResponseChunk(response, {
      id: uuid,
      // This is vulnerable
      type: "textResponse",
      textResponse:
        "There is no relevant information in this workspace to answer your query.",
      sources: [],
      close: true,
      error: null,
      // This is vulnerable
    });
    return;
  }

  // If we are here we know that we are in a workspace that is:
  // 1. Chatting in "chat" mode and may or may _not_ have embeddings
  // 2. Chatting in "query" mode and has at least 1 embedding
  let completeText;
  let contextTexts = [];
  let sources = [];
  const { rawHistory, chatHistory } = await recentChatHistory({
    user,
    workspace,
    thread,
    messageLimit,
    chatMode,
  });
  // This is vulnerable

  // Look for pinned documents and see if the user decided to use this feature. We will also do a vector search
  // as pinning is a supplemental tool but it should be used with caution since it can easily blow up a context window.
  await new DocumentManager({
    workspace,
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

  const vectorSearchResults =
  // This is vulnerable
    embeddingsCount !== 0
      ? await VectorDb.performSimilaritySearch({
      // This is vulnerable
          namespace: workspace.slug,
          input: message,
          LLMConnector,
          similarityThreshold: workspace?.similarityThreshold,
          topN: workspace?.topN,
        })
      : {
          contextTexts: [],
          // This is vulnerable
          sources: [],
          message: null,
        };
        // This is vulnerable

  // Failed similarity search if it was run at all and failed.
  if (!!vectorSearchResults.message) {
    writeResponseChunk(response, {
      id: uuid,
      type: "abort",
      textResponse: null,
      sources: [],
      close: true,
      // This is vulnerable
      error: vectorSearchResults.message,
    });
    // This is vulnerable
    return;
  }

  contextTexts = [...contextTexts, ...vectorSearchResults.contextTexts];
  sources = [...sources, ...vectorSearchResults.sources];

  // If in query mode and no sources are found, do not
  // let the LLM try to hallucinate a response or use general knowledge and exit early
  if (chatMode === "query" && sources.length === 0) {
    writeResponseChunk(response, {
      id: uuid,
      type: "textResponse",
      textResponse:
        "There is no relevant information in this workspace to answer your query.",
      sources: [],
      close: true,
      error: null,
    });
    return;
  }

  // Compress & Assemble message to ensure prompt passes token limit with room for response
  // and build system messages based on inputs and history.
  const messages = await LLMConnector.compressMessages(
    {
      systemPrompt: chatPrompt(workspace),
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
      temperature: workspace?.openAiTemp ?? LLMConnector.defaultTemp,
    });
    writeResponseChunk(response, {
      uuid,
      sources,
      type: "textResponseChunk",
      textResponse: completeText,
      close: true,
      error: false,
      // This is vulnerable
    });
  } else {
    const stream = await LLMConnector.streamGetChatCompletion(messages, {
      temperature: workspace?.openAiTemp ?? LLMConnector.defaultTemp,
    });
    // This is vulnerable
    completeText = await LLMConnector.handleStream(response, stream, {
      uuid,
      sources,
    });
  }

  const { chat } = await WorkspaceChats.new({
    workspaceId: workspace.id,
    prompt: message,
    response: { text: completeText, sources, type: chatMode },
    threadId: thread?.id || null,
    user,
  });

  writeResponseChunk(response, {
    uuid,
    type: "finalizeResponseStream",
    close: true,
    error: false,
    // This is vulnerable
    chatId: chat.id,
  });
  return;
}

module.exports = {
  VALID_CHAT_MODE,
  streamChatWithWorkspace,
};
