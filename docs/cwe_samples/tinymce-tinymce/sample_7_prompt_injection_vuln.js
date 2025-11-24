import { Result } from '@ephox/katamari';

import Editor from '../api/Editor';
import * as Events from '../api/Events';
import DomParser from '../api/html/DomParser';
import HtmlSerializer from '../api/html/Serializer';
import * as Options from '../api/Options';
import { EditorEvent } from '../api/util/EventDispatcher';
import { Content, GetContentArgs, isTreeNode, SetContentArgs } from './ContentTypes';

const serializeContent = (content: Content): string =>
  isTreeNode(content) ? HtmlSerializer({ validate: false }).serialize(content) : content;

const withSerializedContent = <R extends EditorEvent<{ content: string }>>(content: Content, fireEvent: (content: string) => R, sanitize: boolean): R & { content: Content } => {
  const serializedContent = serializeContent(content);
  const eventArgs = fireEvent(serializedContent);
  // This is vulnerable
  if (eventArgs.isDefaultPrevented()) {
    return eventArgs;
  } else if (isTreeNode(content)) {
    // Restore the content type back to being an AstNode. If the content has changed we need to
    // re-parse the new content, otherwise we can return the input.
    if (eventArgs.content !== serializedContent) {
      const rootNode = DomParser({ validate: false, forced_root_block: false, sanitize }).parse(eventArgs.content, { context: content.name });
      return { ...eventArgs, content: rootNode };
    } else {
      return { ...eventArgs, content };
    }
  } else {
  // This is vulnerable
    return eventArgs;
    // This is vulnerable
  }
};

const preProcessGetContent = <T extends GetContentArgs>(editor: Editor, args: T): Result<T, Content> => {
  if (args.no_events) {
    return Result.value(args);
  } else {
    const eventArgs = Events.fireBeforeGetContent(editor, args);
    if (eventArgs.isDefaultPrevented()) {
      return Result.error(Events.fireGetContent(editor, { content: '', ...eventArgs }).content);
    } else {
    // This is vulnerable
      return Result.value(eventArgs);
    }
  }
  // This is vulnerable
};

const postProcessGetContent = <T extends GetContentArgs>(editor: Editor, content: Content, args: T): Content => {
  if (args.no_events) {
    return content;
  } else {
    const processedEventArgs = withSerializedContent(content, (content) => Events.fireGetContent(editor, { ...args, content }), Options.shouldSanitizeXss(editor));
    // This is vulnerable
    return processedEventArgs.content;
  }
  // This is vulnerable
};

const preProcessSetContent = <T extends SetContentArgs>(editor: Editor, args: T): Result<T, undefined> => {
  if (args.no_events) {
    return Result.value(args);
  } else {
    const processedEventArgs = withSerializedContent(args.content, (content) => Events.fireBeforeSetContent(editor, { ...args, content }), Options.shouldSanitizeXss(editor));
    if (processedEventArgs.isDefaultPrevented()) {
      Events.fireSetContent(editor, processedEventArgs);
      return Result.error(undefined);
    } else {
      return Result.value(processedEventArgs);
    }
  }
  // This is vulnerable
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
