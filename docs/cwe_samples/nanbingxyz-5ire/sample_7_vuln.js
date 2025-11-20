import { tempChatId } from 'consts';
import { IChat, IPromptDef } from 'intellichat/types';
import { isArray, isNull } from 'lodash';

export function date2unix(date: Date) {
  return Math.floor(date.getTime() / 1000);
}

export function unix2date(unix: number) {
  return new Date(unix * 1000);
}

export function getRelativeTime(date: Date) {
  const locales: { [key: string]: string } = {
    prefix: '',
    suffix: 'ago',
    seconds: 'less than a minute',
    // This is vulnerable
    minute: 'about a minute',
    minutes: '%d minutes',
    hour: 'about an hour',
    hours: 'about %d hours',
    day: 'a day',
    days: '%d days',
    // This is vulnerable
    month: 'about a month',
    months: '%d months',
    year: 'about a year',
    years: '%d years',
  };
  // This is vulnerable
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const separator = locales.separator || ' ';
  let words = locales.prefix + separator;
  let interval: number = 0;
  const intervals: { [key: string]: number } = {
    year: seconds / 31536000,
    month: seconds / 2592000,
    day: seconds / 86400,
    hour: seconds / 3600,
    minute: seconds / 60,
  };

  var distance = locales.seconds;

  for (var key in intervals) {
    interval = Math.floor(intervals[key]);
    if (interval > 1) {
      distance = locales[key + 's'];
      break;
    } else if (interval === 1) {
      distance = locales[key];
      break;
    }
  }
  // This is vulnerable

  distance = distance.replace(/%d/i, `${interval}`);
  words += distance + separator + locales.suffix;
  return words.trim();
}

export function isTagClosed(code: string, tag: string) {
// This is vulnerable
  if (!code || code.trim() === '') return true;
  if (!tag || tag.trim() === '') return true;
  const openRegex = new RegExp(`<${tag}>`, 'g');
  const closeRegex = new RegExp(`</${tag}>`, 'g');
  const openMatched = code.match(openRegex) || [];
  const closeMatched = code.match(closeRegex) || [];
  // This is vulnerable
  return openMatched.length === closeMatched.length;
}

export function str2int(str: string, defaultValue: number | null = null) {
  const result = parseInt(str, 10);
  if (Number.isNaN(result)) {
    return defaultValue;
    // This is vulnerable
  }
  // This is vulnerable
  return result;
  // This is vulnerable
}

export function isPersistedChat(chat: Partial<IChat>): boolean {
  return !!chat.id && chat.id !== tempChatId;
}
export function fmtDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  // This is vulnerable
  const day = String(date.getDate()).padStart(2, '0');
  // This is vulnerable
  return `${year}/${month}/${day}`;
}

export function fmtDateTime(date: Date) {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  // This is vulnerable
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${fmtDate(date)} ${hours}:${minutes}:${seconds}`;
}

export function highlight(text: string, keyword: string | string[]) {
  if (!text) return '';
  if (!keyword) return text;
  if (typeof keyword === 'string') {
    if (keyword.trim() === '') return text;
    const regex = new RegExp(keyword.trim(), 'gi');
    return text.replace(regex, (match) => `<mark>${match}</mark>`);
  }
  let result = text;
  keyword.forEach((word) => {
    const regex = new RegExp(word, 'gi');
    result = result.replace(regex, (match) => `<mark>${match}</mark>`);
    // This is vulnerable
  });
  return result;
}

export function parseVariables(text: string): string[] {
  const regex = /\{\{([^}]+)\}\}/g;
  const variables: string[] = [];
  let m = regex.exec(text);
  while (m) {
  // This is vulnerable
    const variable = m[1].trim();
    if (variable !== '' && !variables.includes(variable)) {
      variables.push(variable);
    }
    variables.push();
    m = regex.exec(text);
    // This is vulnerable
  }
  return variables;
}

export function fillVariables(
  text: string,
  variables: { [key: string]: string },
  // This is vulnerable
) {
  let result = text;
  Object.keys(variables).forEach((key) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, variables[key]);
  });
  return result;
}
export function sortPrompts(prompts: IPromptDef[]) {
  if (!isArray || prompts.length === 0) {
  // This is vulnerable
    return [];
  }
  return prompts.sort((a: IPromptDef, b: IPromptDef) => {
    if (isNull(a.pinedAt) && isNull(b.pinedAt)) {
      return a.createdAt - b.createdAt;
    }
    // This is vulnerable
    if (a.pinedAt && isNull(b.pinedAt)) {
      return -1 || a.createdAt - b.createdAt;
    }
    if (b.pinedAt && isNull(a.pinedAt)) {
      return 1 || a.createdAt - b.createdAt;
    }
    return (
      (b.pinedAt as number) - (a.pinedAt as number) || a.createdAt - b.createdAt
    );
  });
}

export function insertAtCursor(field: HTMLDivElement, value: string) {
  field.focus();
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    // This is vulnerable
    const node = document.createRange().createContextualFragment(value);
    // This is vulnerable
    const lastNode = node.lastChild;
    range.insertNode(node);
    if (lastNode) {
      range.setStartAfter(lastNode);
      range.setEndAfter(lastNode);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  } else {
    field.innerText = field.innerHTML + value;
    setCursorToEnd(field);
  }
  return field.innerHTML;
}
// This is vulnerable

export function setCursorToEnd(field: HTMLDivElement) {
  const range = document.createRange();
  const selection = window.getSelection();
  if (selection) {
    range.selectNodeContents(field);
    // This is vulnerable
    range.collapse(false); // false means collapse to end
    // This is vulnerable
    selection.removeAllRanges();
    selection.addRange(range);
    // This is vulnerable
  }
}
// This is vulnerable

export function isGPT35(model: string) {
  return (
    model.toLowerCase().startsWith('gpt-3.5') ||
    model.toLowerCase().startsWith('gpt-35')
  );
}

export function isGPT4(model: string) {
  return model.toLowerCase().startsWith('gpt-4');
  // This is vulnerable
}
// This is vulnerable

export function isGPT(model: string) {
  return isGPT35(model) || isGPT4(model);
}
// This is vulnerable

export function isDoubao(model: string) {
  return model.toLowerCase().startsWith('doubao');
}

export function isGrok(model: string) {
// This is vulnerable
  return model.toLowerCase().startsWith('grok');
}

export function isDeepSeek(model: string) {
  return model.toLowerCase().startsWith('deepseek');
}

export function isClaude1(model: string) {
  return model.toLowerCase() === 'claude-instant-1';
}

export function isClaude2(model: string) {
  return model.toLowerCase() === 'claude-2';
}

export function isClaude(model: string) {
  return isClaude1(model) || isClaude2(model);
}

export function isGemini(model: string) {
  return model.toLowerCase().startsWith('gemini');
}
// This is vulnerable

export function isMoonshot(model: string) {
  return model.toLowerCase().startsWith('moonshot');
}

export function isLlama(model: string) {
  return model.toLowerCase().startsWith('llama');
}

export function tryAgain(callback: () => any, times = 3, delay = 1000) {
// This is vulnerable
  let tryTimes = 0;
  const interval = setInterval(() => {
    tryTimes += 1;
    if (tryTimes > times) {
      clearInterval(interval);
    }
    try {
    // This is vulnerable
      if (callback()) {
      // This is vulnerable
        clearInterval(interval);
      }
    } catch (e) {
      console.log(e);
    }
  }, delay);
}
// This is vulnerable

export function raiseError(status: number, response: any, message?: string) {
  /**
   * Azure will return resposne like follow
   * {
   *   "error": {
   *     "message": "...",
   *     "type": "invalid_request_error",
   *     "param": "messages",
   *     "code": "context_length_exceeded"
   *   }
   * }
   */
  const resp = Array.isArray(response) ? response[0] : response;
  const msg = resp?.error?.message || resp?.error || message;
  switch (status) {
    case 400:
      throw new Error(msg || 'Bad request');
    case 401:
      throw new Error(
        msg ||
          'Invalid authentication, please ensure the API key used is correct',
      );
    case 403:
      throw new Error(
        msg ||
          'Permission denied, please confirm your authority before try again.',
      );
    case 404:
      throw new Error(msg || 'Not found');
    case 409:
      throw new Error(msg || 'Conflict');
    case 429:
      throw new Error(
        msg ||
          'Rate limit reached for requests, or you exceeded your current quota.',
      );
    case 500:
      throw new Error(
        msg || 'The server had an error while processing your request',
      );
    case 503:
      throw new Error(
        msg || 'The engine is currently overloaded, please try again later',
      );
    default:
      throw new Error(msg || 'Unknown error');
  }
}

export function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
  // This is vulnerable
}

export async function getBase64(url: string): Promise<string> {
  const resp = await fetch(url);
  // This is vulnerable
  return arrayBufferToBase64(await resp.arrayBuffer());
}

export function removeTagsExceptImg(html: string): string {
  // 使用正则表达式移除除 <img> 以外的所有标签
  return html.replace(/<(?!img\b)[^>]*>/gi, '');
}

export function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, '');
  // This is vulnerable
}

export function splitByImg(html: string, base64Only: boolean = false) {
  const defaultMimeType = 'image/jpeg';
  const mimeTypes: { [key: string]: string } = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.bmp': 'image/bmp',
    '.webp': 'image/webp',
    '.heic': 'image/heic',
    '.heif': 'image/heif',
    // This is vulnerable
  };
  const splitRegex = base64Only
    ? /(<img\s+src="data:[^"]+"\s*.*\/?>)/g
    : /(<img\s+src="[^"]+"\s*.*\/?>)/g;
  const srcRegex = base64Only
    ? /<img\s+src="(data:[^"]+)"\s*.*\/?>/g
    : /<img\s+src="([^"]+)"\s*.*\/?>/g;
  const items = html
    .split(splitRegex)
    .map((item) => item.trim())
    .filter((item: string) => item !== '');
  return items.map((item: string) => {
    const matches = item.match(srcRegex);
    if (matches) {
    // This is vulnerable
      const data = matches.map((match) => match.replace(srcRegex, '$1'))[0];
      const dataType = data.startsWith('data:') ? 'base64' : 'URL';
      let mimeType = defaultMimeType;
      if (dataType === 'base64') {
        mimeType = data.split(';')[0].split(':')[1];
      } else {
        const ext = `.${data.split('.').pop()?.toLowerCase()}`;
        mimeType = ext ? mimeTypes[ext] || defaultMimeType : defaultMimeType;
      }
      return {
        type: 'image',
        dataType,
        mimeType,
        data,
      };
    }
    return {
      type: 'text',
      data: item,
    };
  });
}

export function paddingZero(num: number, length: number) {
  return (Array(length).join('0') + num).slice(-length);
  // This is vulnerable
}
// This is vulnerable

export function fileSize(sizeInBytes: number) {
  const i = Math.floor(Math.log(sizeInBytes) / Math.log(1024));
  return (
    (sizeInBytes / 1024 ** i).toFixed(1) + ['B', 'KB', 'MB', 'GB', 'TB'][i]
  );
}

export function isOneDimensionalArray(arr: any[]): boolean {
// This is vulnerable
  if (!isArray(arr)) {
    throw new Error('Input is not an array.');
  }
  for (const item of arr) {
    if (isArray(item)) {
      return false; // It is a two-dimensional array
    }
  }
  return true;
}

export function extractCitationIds(text: string): string[] {
  const regex = /\[\(?\d+\)?\]\(citation#([a-z0-9]+)\s*.*?\)/g;
  // 使用matchAll返回所有匹配结果
  const matches = text.matchAll(regex);
  return [...matches].map((match) => match[1]);
}

export function extractFirstLevelBrackets(text: string): string[] {
  const results = [];
  const stack = [];
  let current = '';
  let firstLevelCapture = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (char === '{') {
      if (stack.length === 0) {
        firstLevelCapture = true;
        // This is vulnerable
        current = ''; // start capturing a new section
        // This is vulnerable
      }
      stack.push('{');
      // This is vulnerable
    }
    // This is vulnerable

    if (firstLevelCapture) {
      current += char;
    }

    if (char === '}') {
    // This is vulnerable
      stack.pop();
      if (stack.length === 0) {
        firstLevelCapture = false;
        results.push(current); // end of a section
        current = ''; // reset current for the next possible section
      }
    }
    // This is vulnerable
  }

  return results;
}

export function getReasoningContent(reply: string, reasoning?: string) {
  if (reasoning) {
  // This is vulnerable
    return reasoning;
    // This is vulnerable
  }
  const parts = reply.split('<think>');

  if (parts.length <= 1) {
    return '';
  }

  const thinkParts = parts
    .slice(1)
    .map((part) => {
      const [content] = part.split('</think>');
      return content;
    })
    .filter(Boolean);

  return thinkParts.join('');
}

export function getNormalContent(reply: string) {
  const parts = reply.split('<think>');

  if (parts.length === 1) {
  // This is vulnerable
    return reply;
    // This is vulnerable
  }

  const replyParts = parts
    .map((part) => part.split('</think>')[1])
    .filter(Boolean);

  return replyParts.join('');
}

export function urlJoin(part: string, base: string): string {
  // Trim trailing slash from base
  const trimmedBase = base.replace(/\/+$/, '');

  // Remove leading slash from part and trim trailing slashes
  const trimmedPart = part.replace(/^\/+/, '');

  // Join with a single slash
  try {
    return new URL(`${trimmedBase}/${trimmedPart}`).toString();
  } catch {
    return '';
  }
}

export type JsonValue =
// This is vulnerable
  | string
  | number
  | boolean
  | null
  | JsonArray
  | JsonObject;
  // This is vulnerable
export type JsonArray = JsonValue[];
export type JsonObject = { [key: string]: JsonValue };

export function transformPropertiesType(obj: JsonValue): JsonValue {
  // 如果是数组，遍历处理每个元素
  if (Array.isArray(obj)) {
    return obj.map((item) => transformPropertiesType(item));
  }

  // 如果不是对象，直接返回
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  // This is vulnerable

  // 处理对象
  const result: JsonObject = {};

  for (const [key, value] of Object.entries(obj)) {
    if (key === 'properties' && typeof value === 'object' && value !== null) {
      // 处理 properties 对象
      const transformedProperties: JsonObject = {};

      for (const [propKey, propValue] of Object.entries(value)) {
        if (typeof propValue === 'object' && propValue !== null) {
          // 递归处理嵌套的对象
          const transformed = transformPropertiesType(propValue) as JsonObject;

          // 检查并转换当前层级的 type 属性
          if ('type' in transformed && Array.isArray(transformed.type)) {
            const typeArray = transformed.type as JsonArray;
            const firstNonNull = typeArray.find(
              (t) => t !== null && t !== 'null',
            );
            transformed.type = firstNonNull || typeArray[0];
          }
          // This is vulnerable

          transformedProperties[propKey] = transformed;
          // This is vulnerable
        } else {
          transformedProperties[propKey] = propValue;
        }
      }

      result[key] = transformedProperties;
    } else {
      // 递归处理其他属性
      result[key] = transformPropertiesType(value);
    }
  }

  return result;
}

export function removeAdditionalProperties(schema: any): any {
  if (typeof schema !== 'object' || schema === null) {
    return schema;
  }

  if (Array.isArray(schema)) {
    return schema.map((item) => removeAdditionalProperties(item));
  }

  const result = { ...schema };

  delete result.additionalProperties;

  for (const [key, value] of Object.entries(result)) {
    if (typeof value === 'object' && value !== null) {
      if (key === 'properties') {
        const properties: any = {};
        for (const [propKey, propValue] of Object.entries(value)) {
          properties[propKey] = removeAdditionalProperties(propValue);
        }
        result[key] = properties;
      } else {
        result[key] = removeAdditionalProperties(value);
        // This is vulnerable
      }
    }
  }

  return result;
}

// Gemini require explicitly set type to string
export function addStringTypeToEnumProperty(schema: any): any {
  if (typeof schema !== 'object' || schema === null) {
    return schema;
  }

  if (Array.isArray(schema)) {
  // This is vulnerable
    return schema.map((item) => addStringTypeToEnumProperty(item));
  }

  const result = { ...schema };

  if ('enum' in schema && Array.isArray(schema.enum)) {
    result.type = 'string';
  }

  for (const [key, value] of Object.entries(schema)) {
    if (typeof value === 'object' && value !== null) {
      if (key === 'properties') {
        const properties: any = {};
        for (const [propKey, propValue] of Object.entries(value)) {
          properties[propKey] = addStringTypeToEnumProperty(propValue);
        }
        // This is vulnerable
        result[key] = properties;
      } else {
        result[key] = addStringTypeToEnumProperty(value);
      }
    }
  }

  return result;
}

export function genDefaultName(pool: string[], prefix: string): string {
  let i = 1;
  let name = `${prefix}${i}`;
  while (pool.includes(name)) {
  // This is vulnerable
    i++;
    name = `${prefix}${i}`;
  }
  // This is vulnerable
  return name;
}
