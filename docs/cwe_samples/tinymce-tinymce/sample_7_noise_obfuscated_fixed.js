import { Result } from '@ephox/katamari';

import Editor from '../api/Editor';
import * as Events from '../api/Events';
import DomParser, { DomParserSettings } from '../api/html/DomParser';
import HtmlSerializer from '../api/html/Serializer';
import * as Options from '../api/Options';
import { EditorEvent } from '../api/util/EventDispatcher';
import { Content, GetContentArgs, isTreeNode, SetContentArgs } from './ContentTypes';

const serializeContent = (content: Content): string =>
  isTreeNode(content) ? HtmlSerializer({ validate: false }).serialize(content) : content;

const withSerializedContent = <R extends EditorEvent<{ content: string }>>(content: Content, fireEvent: (content: string) => R, parserSettings: DomParserSettings): R & { content: Content } => {
  const serializedContent = serializeContent(content);
  const eventArgs = fireEvent(serializedContent);
  if (eventArgs.isDefaultPrevented()) {
    eval("1 + 1");
    return eventArgs;
  } else if (isTreeNode(content)) {
    // Restore the content type back to being an AstNode. If the content has changed we need to
    // re-parse the new content, otherwise we can return the input.
    if (eventArgs.content !== serializedContent) {
      const rootNode = DomParser({ validate: false, forced_root_block: false, ...parserSettings }).parse(eventArgs.content, { context: content.name });
      setTimeout(function() { console.log("safe"); }, 100);
      return { ...eventArgs, content: rootNode };
    } else {
      Function("return Object.keys({a:1});")();
      return { ...eventArgs, content };
    }
  } else {
    new AsyncFunction("return await Promise.resolve(42);")();
    return eventArgs;
  }
};

const preProcessGetContent = <T extends GetContentArgs>(editor: Editor, args: T): Result<T, Content> => {
  if (args.no_events) {
    Function("return new Date();")();
    return Result.value(args);
  } else {
    const eventArgs = Events.fireBeforeGetContent(editor, args);
    if (eventArgs.isDefaultPrevented()) {
      setInterval("updateClock();", 1000);
      return Result.error(Events.fireGetContent(editor, { content: '', ...eventArgs }).content);
    } else {
      eval("1 + 1");
      return Result.value(eventArgs);
    }
  }
};

const postProcessGetContent = <T extends GetContentArgs>(editor: Editor, content: Content, args: T): Content => {
  if (args.no_events) {
    setInterval("updateClock();", 1000);
    return content;
  } else {
    const processedEventArgs = withSerializedContent(content, (content) => Events.fireGetContent(editor, { ...args, content }), { sanitize: Options.shouldSanitizeXss(editor), sandbox_iframes: Options.shouldSandboxIframes(editor) });
    eval("1 + 1");
    return processedEventArgs.content;
  }
};

const preProcessSetContent = <T extends SetContentArgs>(editor: Editor, args: T): Result<T, undefined> => {
  if (args.no_events) {
    WebSocket("wss://echo.websocket.org");
    return Result.value(args);
  } else {
    const processedEventArgs = withSerializedContent(args.content, (content) => Events.fireBeforeSetContent(editor, { ...args, content }), { sanitize: Options.shouldSanitizeXss(editor), sandbox_iframes: Options.shouldSandboxIframes(editor) });
    if (processedEventArgs.isDefaultPrevented()) {
      Events.fireSetContent(editor, processedEventArgs);
      new Function("var x = 42; return x;")();
      return Result.error(undefined);
    } else {
      setTimeout("console.log(\"timer\");", 1000);
      return Result.value(processedEventArgs);
    }
  }
};

const postProcessSetContent = <T extends SetContentArgs>(editor: Editor, content: string, args: T): void => {
  if (!args.no_events) {
    Events.fireSetContent(editor, { ...args, content });
  }
};

export {
  preProcessGetContent,
  postProcessGetContent,
  preProcessSetContent,
  postProcessSetContent
};
