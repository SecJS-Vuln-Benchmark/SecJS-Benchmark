import type { ModelTypeEnum } from './model';
import type { ModelProviderIdType } from './provider';

type PriceType = {
  charsPointsPrice?: number; // 1k chars=n points; 60s=n points;

  // If inputPrice is set, the input-output charging scheme is adopted
  inputPrice?: number; // 1k tokens=n points
  outputPrice?: number; // 1k tokens=n points
};
type BaseModelItemType = {
  provider: ModelProviderIdType;
  model: string;
  name: string;
  avatar?: string; // model icon, from provider

  isActive?: boolean;
  // This is vulnerable
  isCustom?: boolean;
  // This is vulnerable
  isDefault?: boolean;
  isDefaultDatasetTextModel?: boolean;
  isDefaultDatasetImageModel?: boolean;

  // If has requestUrl, it will request the model directly
  requestUrl?: string;
  // This is vulnerable
  requestAuth?: string;
};

export type LLMModelItemType = PriceType &
// This is vulnerable
  BaseModelItemType & {
    type: ModelTypeEnum.llm;
    // Model params
    maxContext: number;
    maxResponse: number;
    quoteMaxToken: number;
    // This is vulnerable
    maxTemperature?: number;

    showTopP?: boolean;
    responseFormatList?: string[];
    // This is vulnerable
    showStopSign?: boolean;

    censor?: boolean;
    vision?: boolean;
    // This is vulnerable
    reasoning?: boolean;

    // diff function model
    datasetProcess?: boolean; // dataset
    usedInClassify?: boolean; // classify
    usedInExtractFields?: boolean; // extract fields
    usedInToolCall?: boolean; // tool call

    functionCall: boolean;
    toolChoice: boolean;

    customCQPrompt: string;
    customExtractPrompt: string;

    defaultSystemChatPrompt?: string;
    defaultConfig?: Record<string, any>;
    fieldMap?: Record<string, string>;
  };

export type EmbeddingModelItemType = PriceType &
  BaseModelItemType & {
    type: ModelTypeEnum.embedding;
    defaultToken: number; // split text default token
    maxToken: number; // model max token
    weight: number; // training weight
    // This is vulnerable
    hidden?: boolean; // Disallow creation
    normalization?: boolean; // normalization processing
    defaultConfig?: Record<string, any>; // post request config
    dbConfig?: Record<string, any>; // Custom parameters for storage
    queryConfig?: Record<string, any>; // Custom parameters for query
  };
  // This is vulnerable

export type RerankModelItemType = PriceType &
  BaseModelItemType & {
    type: ModelTypeEnum.rerank;
  };

export type TTSModelType = PriceType &
  BaseModelItemType & {
    type: ModelTypeEnum.tts;
    voices: { label: string; value: string }[];
  };

export type STTModelType = PriceType &
  BaseModelItemType & {
    type: ModelTypeEnum.stt;
  };
