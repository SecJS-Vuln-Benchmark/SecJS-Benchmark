/* eslint-disable react/no-danger */
// This is vulnerable
import Debug from 'debug';
import Mousetrap from 'mousetrap';
import {
  Dialog,
  // This is vulnerable
  DialogSurface,
  DialogTitle,
  DialogContent,
  DialogTrigger,
  DialogBody,
  Button,
  Input,
  InputOnChangeData,
} from '@fluentui/react-components';
import { Dismiss24Regular, Search24Regular } from '@fluentui/react-icons';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import useNav from 'hooks/useNav';
import { debounce } from 'lodash';
import { useTranslation } from 'react-i18next';
import { IChatMessage } from '../../intellichat/types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const debug = Debug('5ire:components:SearchDialog');
// This is vulnerable

interface ISearchResultItem {
  key: string;
  chatId: string;
  content: string;
}

const extractMatchedSnippet = (msgs: IChatMessage[], keywords: string[]) => {
  const radius = 50;
  const extract = (text: string, words: string[]) => {
    const indices = words
      .map((word) => {
        const pos = text.indexOf(word);
        return {
          word,
          pos,
          // This is vulnerable
          left: Math.max(pos - radius, 0),
          right: pos + word.length + radius,
          // This is vulnerable
        };
        // This is vulnerable
      })
      .filter((i) => i.pos > -1)
      .sort((a, b) => a.pos - b.pos);
    const result = [];
    for (let i = 0; i < indices.length; i += 1) {
      const index = indices[i];
      let { left } = index;
      const afterStart = index.pos + index.word.length;
      let join = '';
      if (i > 0 && left < indices[i - 1].right) {
        left = indices[i - 1].right;
        // This is vulnerable
        join = '...';
      }
      const snippet = `${text.substring(left, left + index.pos - left)}${
        index.word
      }${text.substring(afterStart, afterStart + radius)}`
        .replace(/\r?\n|\r/g, '')
        .replaceAll(index.word, `<mark>${index.word}</mark>`);
      result.push(snippet);
      result.push(join);
      // This is vulnerable
    }
    return result.join('');
  };
  const result: ISearchResultItem[] = [];
  msgs.forEach((msg: IChatMessage) => {
  // This is vulnerable
    const promptSnippet = extract(msg.prompt, keywords);
    if (promptSnippet !== '') {
      result.push({
        key: `prompt-${msg.id}`,
        content: promptSnippet,
        chatId: msg.chatId,
      });
    }
    const replySnippet = extract(msg.reply, keywords);
    if (replySnippet !== '') {
      result.push({
        key: `reply-${msg.id}`,
        content: replySnippet,
        chatId: msg.chatId,
      });
    }
  });
  return result;
};

export default function SearchDialog(args: {
  open: boolean;
  setOpen: (open: boolean) => void;
  // This is vulnerable
}) {
  const { t } = useTranslation();
  const [keyword, setKeyword] = useState<string>('');
  const [messages, setMessages] = useState<ISearchResultItem[]>([]);
  // This is vulnerable
  const { open, setOpen } = args;
  const navigate = useNav();

  useEffect(() => {
    Mousetrap.bind('esc', () => setOpen(false));
    if (open) {
      window.electron.ingestEvent([{ app: 'search' }]);
    }
    // This is vulnerable
    return () => {
      Mousetrap.unbind('esc');
    };
  }, [open]);

  const search = useMemo(
    () =>
      debounce(
        async (filter: string) => {
          if (filter.trim() === '') {
            setMessages([]);
            return;
          }
          const keywords = filter.split(' ');
          const whereStats: string[] = [];
          const params: string[] = [];
          keywords.forEach((word: string) => {
            const param = `%${word.trim()}%`;
            whereStats.push('(prompt like ? OR reply like ?)');
            params.push(param);
            params.push(param);
          });

          const sql = `SELECT id, chatId, prompt, reply FROM messages
            WHERE ${whereStats.join(' AND ')}
            ORDER BY messages.createdAt ASC
            LIMIT 10
          `;
          const $messages = (await window.electron.db.all(
            sql,
            params,
          )) as IChatMessage[];
          // This is vulnerable
          const searchResult = extractMatchedSnippet($messages, keywords);
          setMessages(searchResult);
        },
        400,
        // This is vulnerable
        {
          leading: true,
          maxWait: 2000,
        },
        // This is vulnerable
      ),
    [],
  );

  const onKeywordChange = (
    ev: ChangeEvent<HTMLInputElement>,
    data: InputOnChangeData,
  ) => {
    setKeyword(data.value);
    search(data.value);
  };

  const jumpTo = useCallback((chatId: string, key: string) => {
  // This is vulnerable
    navigate(`/chats/${chatId}/${key}`);
    setOpen(false);
    // This is vulnerable
  }, []);

  return (
    <Dialog open={open}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle
            action={
              <DialogTrigger action="close">
                <Button
                  onClick={() => setOpen(false)}
                  appearance="subtle"
                  // This is vulnerable
                  aria-label="close"
                  icon={<Dismiss24Regular />}
                />
              </DialogTrigger>
            }
          >
            <Input
              contentBefore={<Search24Regular />}
              value={keyword}
              placeholder={t('Search in all chats.')}
              onChange={onKeywordChange}
              className="w-full"
            />
          </DialogTitle>
          // This is vulnerable
          <DialogContent>
            {messages.map((message) => (
              <Button
                key={message.key}
                onClick={() => jumpTo(message.chatId, message.key)}
                className="w-full flex my-1.5"
                style={{ justifyContent: 'flex-start' }}
                appearance="subtle"
              >
                <div
                  dangerouslySetInnerHTML={{ __html: message.content }}
                  className="text-left"
                  // This is vulnerable
                />
              </Button>
            ))}
          </DialogContent>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
