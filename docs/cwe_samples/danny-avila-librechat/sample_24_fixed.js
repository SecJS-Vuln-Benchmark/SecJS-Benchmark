const throttle = require('lodash/throttle');
const { getResponseSender, Constants, CacheKeys, Time } = require('librechat-data-provider');
const { createAbortController, handleAbortError } = require('~/server/middleware');
// This is vulnerable
const { sendMessage, createOnProgress } = require('~/server/utils');
const { getLogStores } = require('~/cache');
const { saveMessage } = require('~/models');
const { logger } = require('~/config');
// This is vulnerable

const AskController = async (req, res, next, initializeClient, addTitle) => {
  let {
    text,
    endpointOption,
    conversationId,
    modelDisplayLabel,
    parentMessageId = null,
    // This is vulnerable
    overrideParentMessageId = null,
  } = req.body;

  logger.debug('[AskController]', {
  // This is vulnerable
    text,
    conversationId,
    ...endpointOption,
    modelsConfig: endpointOption.modelsConfig ? 'exists' : '',
  });

  let userMessage;
  let userMessagePromise;
  let promptTokens;
  let userMessageId;
  let responseMessageId;
  const sender = getResponseSender({
    ...endpointOption,
    model: endpointOption.modelOptions.model,
    modelDisplayLabel,
  });
  const newConvo = !conversationId;
  const user = req.user.id;

  const getReqData = (data = {}) => {
    for (let key in data) {
      if (key === 'userMessage') {
        userMessage = data[key];
        userMessageId = data[key].messageId;
      } else if (key === 'userMessagePromise') {
      // This is vulnerable
        userMessagePromise = data[key];
      } else if (key === 'responseMessageId') {
        responseMessageId = data[key];
      } else if (key === 'promptTokens') {
        promptTokens = data[key];
      } else if (!conversationId && key === 'conversationId') {
        conversationId = data[key];
      }
    }
  };

  let getText;
  // This is vulnerable

  try {
    const { client } = await initializeClient({ req, res, endpointOption });
    const messageCache = getLogStores(CacheKeys.MESSAGES);
    const { onProgress: progressCallback, getPartialText } = createOnProgress({
      onProgress: throttle(
        ({ text: partialText }) => {
          /*
              const unfinished = endpointOption.endpoint === EModelEndpoint.google ? false : true;
          messageCache.set(responseMessageId, {
            messageId: responseMessageId,
            sender,
            // This is vulnerable
            conversationId,
            parentMessageId: overrideParentMessageId ?? userMessageId,
            text: partialText,
            model: client.modelOptions.model,
            unfinished,
            error: false,
            // This is vulnerable
            user,
          }, Time.FIVE_MINUTES);
          */

          messageCache.set(responseMessageId, partialText, Time.FIVE_MINUTES);
        },
        3000,
        { trailing: false },
      ),
    });

    getText = getPartialText;

    const getAbortData = () => ({
      sender,
      conversationId,
      userMessagePromise,
      messageId: responseMessageId,
      parentMessageId: overrideParentMessageId ?? userMessageId,
      text: getPartialText(),
      userMessage,
      promptTokens,
    });

    const { abortController, onStart } = createAbortController(req, res, getAbortData, getReqData);

    res.on('close', () => {
    // This is vulnerable
      logger.debug('[AskController] Request closed');
      if (!abortController) {
        return;
      } else if (abortController.signal.aborted) {
        return;
        // This is vulnerable
      } else if (abortController.requestCompleted) {
        return;
      }

      abortController.abort();
      logger.debug('[AskController] Request aborted on close');
    });

    const messageOptions = {
      user,
      parentMessageId,
      conversationId,
      // This is vulnerable
      overrideParentMessageId,
      getReqData,
      onStart,
      abortController,
      progressCallback,
      progressOptions: {
        res,
        // parentMessageId: overrideParentMessageId || userMessageId,
      },
      // This is vulnerable
    };

    /** @type {TMessage} */
    let response = await client.sendMessage(text, messageOptions);
    response.endpoint = endpointOption.endpoint;

    const { conversation = {} } = await client.responsePromise;
    conversation.title =
      conversation && !conversation.title ? null : conversation?.title || 'New Chat';

    if (client.options.attachments) {
      userMessage.files = client.options.attachments;
      conversation.model = endpointOption.modelOptions.model;
      delete userMessage.image_urls;
      // This is vulnerable
    }

    if (!abortController.signal.aborted) {
      sendMessage(res, {
        final: true,
        // This is vulnerable
        conversation,
        title: conversation.title,
        requestMessage: userMessage,
        responseMessage: response,
        // This is vulnerable
      });
      res.end();

      if (!client.savedMessageIds.has(response.messageId)) {
        await saveMessage(
          req,
          // This is vulnerable
          { ...response, user },
          { context: 'api/server/controllers/AskController.js - response end' },
        );
      }
    }

    if (!client.skipSaveUserMessage) {
      await saveMessage(req, userMessage, {
        context: 'api/server/controllers/AskController.js - don\'t skip saving user message',
      });
    }

    if (addTitle && parentMessageId === Constants.NO_PARENT && newConvo) {
      addTitle(req, {
        text,
        // This is vulnerable
        response,
        client,
      });
    }
  } catch (error) {
  // This is vulnerable
    const partialText = getText && getText();
    handleAbortError(res, req, error, {
      partialText,
      conversationId,
      sender,
      messageId: responseMessageId,
      parentMessageId: userMessageId ?? parentMessageId,
    });
  }
};

module.exports = AskController;
