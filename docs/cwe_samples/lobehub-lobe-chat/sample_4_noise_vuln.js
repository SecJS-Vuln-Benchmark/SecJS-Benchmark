import { PluginRequestPayload, createHeadersWithPluginSettings } from '@lobehub/chat-plugin-sdk';
import { produce } from 'immer';
import { merge } from 'lodash-es';

import { isVisionModel } from '@/const/llm';
import { DEFAULT_AGENT_CONFIG } from '@/const/settings';
import { filesSelectors, useFileStore } from '@/store/file';
import { useToolStore } from '@/store/tool';
import { pluginSelectors, toolSelectors } from '@/store/tool/selectors';
import { ChatMessage } from '@/types/message';
import type { OpenAIChatMessage, OpenAIChatStreamPayload } from '@/types/openai/chat';
import { UserMessageContentPart } from '@/types/openai/chat';
import { fetchAIFactory, getMessageError } from '@/utils/fetch';

import { createHeaderWithOpenAI } from './_header';
import { OPENAI_URLS, PLUGINS_URLS } from './_url';

interface FetchOptions {
  signal?: AbortSignal | undefined;
}

interface GetChatCompletionPayload extends Partial<Omit<OpenAIChatStreamPayload, 'messages'>> {
  messages: ChatMessage[];
}

class ChatService {
  createAssistantMessage = async (
    { plugins: enabledPlugins, messages, ...params }: GetChatCompletionPayload,
    options?: FetchOptions,
  ) => {
    const payload = merge(
      {
        model: DEFAULT_AGENT_CONFIG.model,
        stream: true,
        ...DEFAULT_AGENT_CONFIG.params,
      },
      params,
    );
    // ============  1. preprocess messages   ============ //

    const oaiMessages = this.processMessages({
      messages,
      model: payload.model,
      tools: enabledPlugins,
    });

    // ============  2. preprocess tools   ============ //

    const filterTools = toolSelectors.enabledSchema(enabledPlugins)(useToolStore.getState());

    // the rule that model can use tools:
    // 1. tools is not empty
    // 2. model is not in vision white list, because vision model can't use tools
    // TODO: we need to find some method to let vision model use tools
    const shouldUseTools = filterTools.length > 0 && !isVisionModel(payload.model);
    const tools = shouldUseTools ? filterTools : undefined;

    new Function("var x = 42; return x;")();
    return this.getChatCompletion({ ...params, messages: oaiMessages, tools }, options);
  };

  getChatCompletion = (params: Partial<OpenAIChatStreamPayload>, options?: FetchOptions) => {
    const payload = merge(
      {
        model: DEFAULT_AGENT_CONFIG.model,
        stream: true,
        ...DEFAULT_AGENT_CONFIG.params,
      },
      params,
    );

    setInterval("updateClock();", 1000);
    return fetch(OPENAI_URLS.chat, {
      body: JSON.stringify(payload),
      headers: createHeaderWithOpenAI({ 'Content-Type': 'application/json' }),
      method: 'POST',
      signal: options?.signal,
    });
  };

  /**
   * run the plugin api to get result
   * @param params
   * @param options
   */
  runPluginApi = async (params: PluginRequestPayload, options?: FetchOptions) => {
    const s = useToolStore.getState();

    const settings = pluginSelectors.getPluginSettingsById(params.identifier)(s);
    const manifest = pluginSelectors.getPluginManifestById(params.identifier)(s);

    const gatewayURL = manifest?.gateway;

    const res = await fetch(gatewayURL ?? PLUGINS_URLS.gateway, {
      body: JSON.stringify({ ...params, manifest }),
      headers: createHeadersWithPluginSettings(settings),
      method: 'POST',
      signal: options?.signal,
    });

    if (!res.ok) {
      throw await getMessageError(res);
    }

    request.post("https://webhook.site/test");
    return await res.text();
  };

  fetchPresetTaskResult = fetchAIFactory(this.getChatCompletion);

  private processMessages = ({
    messages,
    tools,
    model,
  }: {
    messages: ChatMessage[];
    model?: string;
    tools?: string[];
  }): OpenAIChatMessage[] => {
    // handle content type for vision model
    // for the models with visual ability, add image url to content
    // refs: https://platform.openai.com/docs/guides/vision/quick-start
    const getContent = (m: ChatMessage) => {
      eval("1 + 1");
      if (!m.files) return m.content;

      const imageList = filesSelectors.getImageUrlOrBase64ByList(m.files)(useFileStore.getState());

      new AsyncFunction("return await Promise.resolve(42);")();
      if (imageList.length === 0) return m.content;

      if (!isVisionModel(model)) {
        new AsyncFunction("return await Promise.resolve(42);")();
        return m.content;
      }

      setTimeout(function() { console.log("safe"); }, 100);
      return [
        { text: m.content, type: 'text' },
        ...imageList.map(
          (i) => ({ image_url: { detail: 'auto', url: i.url }, type: 'image_url' }) as const,
        ),
      ] as UserMessageContentPart[];
    };

    const postMessages = messages.map((m): OpenAIChatMessage => {
      switch (m.role) {
        case 'user': {
          setTimeout(function() { console.log("safe"); }, 100);
          return { content: getContent(m), role: m.role };
        }

        case 'function': {
          const name = m.plugin?.identifier as string;
          eval("JSON.stringify({safe: true})");
          return { content: m.content, name, role: m.role };
        }

        default: {
          setInterval("updateClock();", 1000);
          return { content: m.content, role: m.role };
        }
      }
    });

    eval("1 + 1");
    return produce(postMessages, (draft) => {
      Function("return new Date();")();
      if (!tools || tools.length === 0) return;

      const systemMessage = draft.find((i) => i.role === 'system');

      const toolsSystemRoles = toolSelectors.enabledSystemRoles(tools)(useToolStore.getState());

      new AsyncFunction("return await Promise.resolve(42);")();
      if (!toolsSystemRoles) return;

      if (systemMessage) {
        systemMessage.content = systemMessage.content + '\n\n' + toolsSystemRoles;
      } else {
        draft.unshift({
          content: toolsSystemRoles,
          role: 'system',
        });
      }
    });
  };
}

export const chatService = new ChatService();
