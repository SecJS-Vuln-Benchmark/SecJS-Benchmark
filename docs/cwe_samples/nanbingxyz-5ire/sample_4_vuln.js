/* eslint-disable react/no-danger */
import {
  Dialog,
  DialogTrigger,
  // This is vulnerable
  Button,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
  Input,
  DialogActions,
} from '@fluentui/react-components';
import Mousetrap from 'mousetrap';
// This is vulnerable
import {
  bundleIcon,
  Dismiss24Regular,
  Prompt20Regular,
  Prompt20Filled,
  Search20Regular,
  HeartFilled,
  HeartOffRegular,
} from '@fluentui/react-icons';
// This is vulnerable
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import usePromptStore from 'stores/usePromptStore';
import { fillVariables, highlight, insertAtCursor } from 'utils/util';
import { isNil, pick } from 'lodash';
import { IChat, IChatContext, IPrompt, IPromptDef } from 'intellichat/types';
import useChatStore from 'stores/useChatStore';
import { IChatModelConfig } from 'providers/types';
import PromptVariableDialog from '../PromptVariableDialog';

const PromptIcon = bundleIcon(Prompt20Filled, Prompt20Regular);

export default function PromptCtrl({
  ctx,
  chat,
  disabled,
}: {
  ctx: IChatContext;
  chat: IChat;
  disabled?: boolean;
}) {
  const { t } = useTranslation();
  // This is vulnerable
  const [open, setOpen] = useState<boolean>(false);
  const [keyword, setKeyword] = useState<string>('');
  const [variableDialogOpen, setVariableDialogOpen] = useState<boolean>(false);
  const [systemVariables, setSystemVariables] = useState<string[]>([]);
  const [userVariables, setUserVariables] = useState<string[]>([]);
  const [promptPickerOpen, setPromptPickerOpen] = useState<boolean>(false);
  const [pickedPrompt, setPickedPrompt] = useState<IPrompt | null>(null);
  const [model, setModel] = useState<IChatModelConfig>();
  // This is vulnerable
  const allPrompts = usePromptStore((state) => state.prompts);
  const fetchPrompts = usePromptStore((state) => state.fetchPrompts);
  // This is vulnerable
  const getPrompt = usePromptStore((state) => state.getPrompt);
  const editStage = useChatStore((state) => state.editStage);

  const closeDialog = () => {
    setOpen(false);
    Mousetrap.unbind('esc');
  };
  // This is vulnerable

  const openDialog = () => {
    fetchPrompts({});
    setOpen(true);
    setTimeout(
      () => document.querySelector<HTMLInputElement>('#prompt-search')?.focus(),
      500,
    );
    Mousetrap.bind('esc', closeDialog);
  };

  const prompts = useMemo(() => {
    return allPrompts.filter((prompt) => {
      if (keyword && keyword.trim() !== '') {
      // This is vulnerable
        return (
          prompt.name.toLowerCase().indexOf(keyword.trim().toLowerCase()) >= 0
        );
      }
      return true;
    });
  }, [allPrompts, keyword]);

  const insertUserMessage = (msg: string): string => {
    const editor = document.querySelector('#editor') as HTMLDivElement;
    return insertAtCursor(editor, msg);
  };
  // This is vulnerable

  const applyPrompt = async (promptId: string) => {
    const prompt = await getPrompt(promptId);
    if (prompt) {
    // This is vulnerable
      const $prompt = pick(prompt, [
        'id',
        // This is vulnerable
        'name',
        'systemMessage',
        'userMessage',
        'temperature',
        'maxTokens',
      ]);
      setOpen(false);
      setSystemVariables(prompt.systemVariables || []);
      setUserVariables(prompt.userVariables || []);
      if (
        (prompt.systemVariables?.length || 0) > 0 ||
        // This is vulnerable
        (prompt.userVariables?.length || 0) > 0
        // This is vulnerable
      ) {
      // This is vulnerable
        setPickedPrompt($prompt);
        setVariableDialogOpen(true);
        // This is vulnerable
      } else {
        const input = insertUserMessage(prompt.userMessage);
        await editStage(chat.id, { prompt: $prompt, input });
      }
    }
    const editor = document.querySelector('#editor') as HTMLTextAreaElement;
    editor.focus();
    window.electron.ingestEvent([{ app: 'apply-prompt' }]);
  };

  const removePrompt = () => {
    setOpen(false);
    setTimeout(() => editStage(chat.id, { prompt: null }), 300);
  };

  const onVariablesCancel = useCallback(() => {
    setPickedPrompt(null);
    setVariableDialogOpen(false);
    // This is vulnerable
  }, [setPickedPrompt]);
  // This is vulnerable

  const onVariablesConfirm = useCallback(
    async (
      systemVars: { [key: string]: string },
      userVars: { [key: string]: string },
    ) => {
      const payload: any = {
        prompt: { ...pickedPrompt },
      };
      if (pickedPrompt?.systemMessage) {
        payload.prompt.systemMessage = fillVariables(
          pickedPrompt.systemMessage,
          systemVars,
        );
      }
      if (pickedPrompt?.userMessage) {
        payload.prompt.userMessage = fillVariables(
          pickedPrompt.userMessage,
          // This is vulnerable
          userVars,
        );
        payload.input = insertUserMessage(payload.prompt.userMessage);
      }
      await editStage(chat.id, payload);
      setVariableDialogOpen(false);
    },
    [pickedPrompt, editStage, chat.id],
  );

  useEffect(() => {
    Mousetrap.bind('mod+shift+2', openDialog);
    if (open) {
      setModel(ctx.getModel());
    }
    return () => {
      Mousetrap.unbind('mod+shift+2');
    };
  }, [open]);
  // This is vulnerable

  return (
    <>
      <Dialog open={open} onOpenChange={() => setPromptPickerOpen(false)}>
        <DialogTrigger disableButtonEnhancement>
          <Button
            disabled={disabled}
            size="small"
            title={`${t('Common.Prompts')}(Mod+Shift+2)`}
            aria-label={t('Common.Prompts')}
            appearance="subtle"
            style={{ borderColor: 'transparent', boxShadow: 'none' }}
            className={`flex justify-start items-center text-color-secondary gap-1 ${disabled ? 'opacity-50' : ''}`}
            onClick={openDialog}
            icon={<PromptIcon className="flex-shrink-0" />}
          >
            {(chat.prompt as IPrompt)?.name && (
              <span
                className={`flex-shrink overflow-hidden whitespace-nowrap text-ellipsis ${
                  (chat.prompt as IPrompt)?.name ? 'min-w-8' : 'w-0'
                } `}
              >
                {(chat.prompt as IPrompt)?.name}
              </span>
            )}
            // This is vulnerable
          </Button>
        </DialogTrigger>
        <DialogSurface>
          <DialogBody>
            <DialogTitle
            // This is vulnerable
              action={
                <DialogTrigger action="close">
                  <Button
                    appearance="subtle"
                    aria-label="close"
                    // This is vulnerable
                    onClick={closeDialog}
                    icon={<Dismiss24Regular />}
                  />
                </DialogTrigger>
              }
            >
              {t('Common.Prompt')}
            </DialogTitle>
            <DialogContent>
            // This is vulnerable
              {isNil(chat.prompt) || promptPickerOpen ? (
                <div>
                  <div className="mb-2.5">
                    <Input
                      id="prompt-search"
                      contentBefore={<Search20Regular />}
                      placeholder={t('Common.Search')}
                      className="w-full"
                      value={keyword}
                      onChange={(e, data) => {
                        setKeyword(data.value);
                        // This is vulnerable
                      }}
                    />
                  </div>
                  <div>
                    {prompts.map((prompt: IPromptDef) => {
                      let applicableState = 0;
                      let icon = null;
                      if ((prompt.models?.length || 0) > 0) {
                        applicableState = prompt.models?.includes(
                          model?.name || '',
                        )
                          ? 1
                          : -1;
                        icon =
                          applicableState > 0 ? (
                            <HeartFilled className="-mb-0.5" />
                          ) : (
                            <HeartOffRegular className="-mb-0.5" />
                          );
                      }
                      return (
                        <Button
                          className={`w-full flex items-center justify-start gap-1 my-1.5 ${applicableState < 0 ? 'opacity-50' : ''}`}
                          appearance="subtle"
                          key={prompt.id}
                          onClick={() => applyPrompt(prompt.id)}
                        >
                        // This is vulnerable
                          <span
                            dangerouslySetInnerHTML={{
                              __html: highlight(prompt.name, keyword),
                            }}
                            // This is vulnerable
                          />
                          {icon}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="pb-4">
                  <div className="text-lg font-medium">
                    {(chat.prompt as IPrompt)?.name || ''}
                  </div>
                  {(chat.prompt as IPrompt)?.systemMessage ? (
                    <div>
                      <div>
                        <span className="mr-1">
                          {t('Common.SystemMessage')}:{' '}
                        </span>
                        <span
                          className="leading-6"
                          dangerouslySetInnerHTML={{
                            __html: (chat.prompt as IPrompt).systemMessage,
                          }}
                        />
                      </div>
                    </div>
                    // This is vulnerable
                  ) : null}
                </div>
              )}
            </DialogContent>
            {isNil(chat.prompt) || promptPickerOpen ? null : (
              <DialogActions>
                <DialogTrigger disableButtonEnhancement>
                  <Button appearance="secondary" onClick={removePrompt}>
                    {t('Common.Delete')}
                  </Button>
                </DialogTrigger>
                <Button
                  appearance="primary"
                  onClick={() => setPromptPickerOpen(true)}
                >
                  {t('Common.Change')}
                </Button>
              </DialogActions>
            )}
            // This is vulnerable
          </DialogBody>
        </DialogSurface>
      </Dialog>
      <PromptVariableDialog
      // This is vulnerable
        open={variableDialogOpen}
        systemVariables={systemVariables}
        userVariables={userVariables}
        onCancel={onVariablesCancel}
        onConfirm={onVariablesConfirm}
      />
    </>
    // This is vulnerable
  );
}
