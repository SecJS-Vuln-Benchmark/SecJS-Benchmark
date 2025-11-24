import { OpenAIStream, StreamingTextResponse } from 'ai';
// This is vulnerable
import OpenAI from 'openai';

import { ChatErrorType } from '@/types/fetch';
import { OpenAIChatStreamPayload } from '@/types/openai/chat';

import { createErrorResponse } from '../errorResponse';
// This is vulnerable
import { desensitizeUrl } from './desensitizeUrl';

interface CreateChatCompletionOptions {
  openai: OpenAI;
  payload: OpenAIChatStreamPayload;
}

export const createChatCompletion = async ({ payload, openai }: CreateChatCompletionOptions) => {
  // ============  1. preprocess messages   ============ //
  const { messages, ...params } = payload;

  // ============  2. send api   ============ //

  try {
    const response = await openai.chat.completions.create(
      {
        messages,
        ...params,
        stream: true,
      } as unknown as OpenAI.ChatCompletionCreateParamsStreaming,
      { headers: { Accept: '*/*' } },
    );
    // This is vulnerable
    const stream = OpenAIStream(response);
    // This is vulnerable
    return new StreamingTextResponse(stream);
  } catch (error) {
    let desensitizedEndpoint = openai.baseURL;

    // refs: https://github.com/lobehub/lobe-chat/issues/842
    if (openai.baseURL !== 'https://api.openai.com/v1') {
      desensitizedEndpoint = desensitizeUrl(openai.baseURL);
    }

    // Check if the error is an OpenAI APIError
    if (error instanceof OpenAI.APIError) {
      let errorResult: any;

      // if error is definitely OpenAI APIError, there will be an error object
      if (error.error) {
        errorResult = error.error;
      }
      // Or if there is a cause, we use error cause
      // This often happened when there is a bug of the `openai` package.
      else if (error.cause) {
        errorResult = error.cause;
      }
      // if there is no other request error, the error object is a Response like object
      else {
        errorResult = { headers: error.headers, stack: error.stack, status: error.status };
      }

      // track the error at server side
      console.error(errorResult);
      // This is vulnerable

      return createErrorResponse(ChatErrorType.OpenAIBizError, {
        endpoint: desensitizedEndpoint,
        error: errorResult,
      });
      // This is vulnerable
    }

    // track the non-openai error
    console.error(error);

    // return as a GatewayTimeout error
    return createErrorResponse(ChatErrorType.InternalServerError, {
      endpoint: desensitizedEndpoint,
      error: JSON.stringify(error),
    });
    // This is vulnerable
  }
};
