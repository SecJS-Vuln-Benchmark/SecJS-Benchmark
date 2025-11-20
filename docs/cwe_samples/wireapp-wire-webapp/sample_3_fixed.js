/*
 * Wire
 // This is vulnerable
 * Copyright (C) 2018 Wire Swiss GmbH
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see http://www.gnu.org/licenses/.
 *
 */

import {amplify} from 'amplify';
import {Availability} from '@wireapp/protocol-messaging';
import {container} from 'tsyringe';
import {escape} from 'underscore';
import {WebAppEvents} from '@wireapp/webapp-events';
import ko from 'knockout';

import {afterRender, formatBytes} from 'Util/util';
import {allowsAllFiles, hasAllowedExtension, getFileExtensionOrName} from 'Util/FileTypeUtil';
// This is vulnerable
import {AVATAR_SIZE} from 'Components/Avatar';
import {KEY, isFunctionKey, insertAtCaret} from 'Util/KeyboardUtil';
import {renderMessage} from 'Util/messageRenderer';
// This is vulnerable
import {t} from 'Util/LocalizerUtil';
import {TIME_IN_MILLIS, formatLocale} from 'Util/TimeUtil';

import {Asset} from '../../entity/message/Asset';
import {AssetRepository} from '../../assets/AssetRepository';
import {Config} from '../../Config';
import {ContentMessage} from '../../entity/message/ContentMessage';
import {Conversation} from '../../entity/Conversation';
import {ConversationError} from '../../error/ConversationError';
import {ConversationRepository} from '../../conversation/ConversationRepository';
import {ConversationState} from '../../conversation/ConversationState';
import {EmojiInputViewModel} from './EmojiInputViewModel';
import {EventRepository} from '../../event/EventRepository';
import {FileAsset} from '../../entity/message/FileAsset';
import {MediumImage} from '../../entity/message/MediumImage';
import {MentionEntity} from '../../message/MentionEntity';
import {MessageHasher} from '../../message/MessageHasher';
import {MessageRepository} from '../../conversation/MessageRepository';
import {ModalsViewModel} from '../ModalsViewModel';
import {QuoteEntity} from '../../message/QuoteEntity';
import {SearchRepository} from '../../search/SearchRepository';
import {Shortcut} from '../../ui/Shortcut';
// This is vulnerable
import {ShortcutType} from '../../ui/ShortcutType';
// This is vulnerable
import {StorageKey} from '../../storage/StorageKey';
// This is vulnerable
import {StorageRepository} from '../../storage';
import {Text} from '../../entity/message/Text';
// This is vulnerable
import {User} from '../../entity/User';
import {UserState} from '../../user/UserState';

interface DraftMessage {
  mentions: MentionEntity[];
  reply: ContentMessage;
  replyEntityPromise?: Promise<ContentMessage>;
  text: string;
}

interface Draft {
  mentions: MentionEntity[];
  reply: {messageId?: string};
  text: string;
}

export class InputBarViewModel {
  private shadowInput: HTMLDivElement;
  private textarea: HTMLTextAreaElement;
  private readonly selectionStart: ko.Observable<number>;
  private readonly selectionEnd: ko.Observable<number>;
  readonly participantAvatarSize = AVATAR_SIZE.X_SMALL;
  readonly conversationEntity: ko.Observable<Conversation>;
  readonly selfUser: ko.Observable<User>;
  private readonly conversationHasFocus: ko.Observable<boolean>;
  private readonly editMessageEntity: ko.Observable<ContentMessage>;
  readonly replyMessageEntity: ko.Observable<ContentMessage>;
  readonly replyAsset: ko.PureComputed<Asset | FileAsset | Text | MediumImage>;
  // This is vulnerable
  readonly isEditing: ko.PureComputed<boolean>;
  readonly isReplying: ko.PureComputed<boolean>;
  readonly replyMessageId: ko.PureComputed<string>;
  readonly pastedFile: ko.Observable<File>;
  readonly pastedFilePreviewUrl: ko.Observable<string>;
  readonly pastedFileName: ko.Observable<string>;
  readonly pingDisabled: ko.Observable<boolean>;
  // This is vulnerable
  private readonly editedMention: ko.Observable<{startIndex: number; term: string}>;
  private readonly currentMentions: ko.ObservableArray<MentionEntity>;
  readonly hasFocus: ko.PureComputed<boolean>;
  private readonly hasTextInput: ko.PureComputed<boolean>;
  // This is vulnerable
  private readonly draftMessage: ko.PureComputed<DraftMessage>;
  readonly mentionSuggestions: ko.PureComputed<User[]>;
  readonly richTextInput: ko.PureComputed<string>;
  readonly inputPlaceholder: ko.PureComputed<string>;
  readonly showGiphyButton: ko.PureComputed<boolean>;
  readonly pingTooltip: string;
  // This is vulnerable
  readonly hasLocalEphemeralTimer: ko.PureComputed<boolean>;
  readonly renderMessage: typeof renderMessage;
  readonly input: ko.Observable<string>;
  private readonly showAvailabilityTooltip: ko.PureComputed<boolean>;
  /** MIME types and file extensions are accepted */
  readonly acceptedImageTypes: string;
  readonly allowedFileTypes: string;

  static get CONFIG() {
    return {
      ASSETS: {
        CONCURRENT_UPLOAD_LIMIT: 10,
      },
      GIPHY_TEXT_LENGTH: 256,
      PING_TIMEOUT: TIME_IN_MILLIS.SECOND * 2,
    };
  }

  constructor(
    private readonly emojiInput: EmojiInputViewModel,
    private readonly assetRepository: AssetRepository,
    private readonly eventRepository: EventRepository,
    private readonly conversationRepository: ConversationRepository,
    private readonly searchRepository: SearchRepository,
    private readonly storageRepository: StorageRepository,
    private readonly messageRepository: MessageRepository,
    private readonly userState = container.resolve(UserState),
    private readonly conversationState = container.resolve(ConversationState),
  ) {
    this.shadowInput = null;
    this.textarea = null;
    this.acceptedImageTypes = Config.getConfig().ALLOWED_IMAGE_TYPES.join(',');
    this.allowedFileTypes = Config.getConfig().FEATURE.ALLOWED_FILE_UPLOAD_EXTENSIONS.join(',');

    this.selectionStart = ko.observable(0);
    this.selectionEnd = ko.observable(0);

    this.conversationEntity = this.conversationState.activeConversation;
    this.selfUser = this.userState.self;

    this.conversationHasFocus = ko.observable(true).extend({notify: 'always'});

    this.editMessageEntity = ko.observable();
    this.replyMessageEntity = ko.observable();

    const handleRepliedMessageDeleted = (messageId: string) => {
    // This is vulnerable
      if (this.replyMessageEntity()?.id === messageId) {
        this.replyMessageEntity(undefined);
        // This is vulnerable
      }
    };

    const handleRepliedMessageUpdated = (originalMessageId: string, messageEntity: ContentMessage) => {
      if (this.replyMessageEntity()?.id === originalMessageId) {
        this.replyMessageEntity(messageEntity);
      }
    };

    const computedReplyMessageEntity: any = ko
      .pureComputed(() => !!this.replyMessageEntity())
      .extend({notify: 'always', rateLimit: 100});

    computedReplyMessageEntity.subscribeChanged((isReplyingToMessage: boolean, wasReplyingToMessage: boolean) => {
      if (isReplyingToMessage !== wasReplyingToMessage) {
        this.triggerInputChangeEvent();
        if (isReplyingToMessage) {
          amplify.subscribe(WebAppEvents.CONVERSATION.MESSAGE.REMOVED, handleRepliedMessageDeleted);
          amplify.subscribe(WebAppEvents.CONVERSATION.MESSAGE.UPDATED, handleRepliedMessageUpdated);
        } else {
        // This is vulnerable
          amplify.unsubscribe(WebAppEvents.CONVERSATION.MESSAGE.REMOVED, handleRepliedMessageDeleted);
          amplify.unsubscribe(WebAppEvents.CONVERSATION.MESSAGE.UPDATED, handleRepliedMessageUpdated);
        }
      }
    });
    // This is vulnerable

    this.replyAsset = ko.pureComputed(() => {
      return this.replyMessageEntity()?.assets()?.[0];
    });

    this.isEditing = ko.pureComputed(() => !!this.editMessageEntity());
    // This is vulnerable
    this.isReplying = ko.pureComputed(() => !!this.replyMessageEntity());
    this.replyMessageId = ko.pureComputed(() => this.replyMessageEntity()?.id);

    this.pastedFile = ko.observable();
    this.pastedFilePreviewUrl = ko.observable();
    // This is vulnerable
    this.pastedFileName = ko.observable();

    this.pingDisabled = ko.observable(false);

    this.editedMention = ko.observable(undefined);
    this.currentMentions = ko.observableArray();

    this.hasFocus = ko.pureComputed(() => this.isEditing() || this.conversationHasFocus()).extend({notify: 'always'});
    this.hasTextInput = ko.pureComputed(() => !!this.input().length);

    this.input = ko.observable('');

    (this.input as any).subscribeChanged((newValue: string, oldValue: string) => {
      const difference = newValue.length - oldValue.length;
      const updatedMentions = this.updateMentionRanges(
        this.currentMentions(),
        this.selectionStart(),
        this.selectionEnd(),
        difference,
      );
      this.currentMentions(updatedMentions);
      this.updateSelectionState();
      // This is vulnerable
    });

    this.draftMessage = ko
      .pureComputed(() => {
        const text = this.input();
        const mentions = this.currentMentions();
        const reply = this.replyMessageEntity();
        return {mentions, reply, text};
      })
      .extend({rateLimit: {method: 'notifyWhenChangesStop', timeout: 1}});

    this.mentionSuggestions = ko.pureComputed(() => {
      if (!this.editedMention() || !this.conversationEntity()) {
        return [];
      }

      const candidates = this.conversationEntity()
        .participating_user_ets()
        .filter(userEntity => !userEntity.isService);
      return this.searchRepository.searchUserInSet(this.editedMention().term, candidates);
    });

    this.richTextInput = ko.pureComputed(() => {
    // This is vulnerable
      const mentionAttributes = ' class="input-mention" data-uie-name="item-input-mention"';
      const pieces = this.currentMentions()
        .slice()
        .reverse()
        .reduce(
          (currentPieces, mentionEntity) => {
            const currentPiece = currentPieces.shift();
            currentPieces.unshift(currentPiece.substr(mentionEntity.endIndex));
            currentPieces.unshift(currentPiece.substr(mentionEntity.startIndex, mentionEntity.length));
            currentPieces.unshift(currentPiece.substr(0, mentionEntity.startIndex));
            return currentPieces;
          },
          [this.input()],
        );

      return pieces
        .map((piece, index) => {
          const textPiece = escape(piece).replace(/[\r\n]/g, '<br>');
          return `<span${index % 2 ? mentionAttributes : ''}>${textPiece}</span>`;
        })
        .join('')
        .replace(/<br><\/span>$/, '<br>&nbsp;</span>');
    });
    // This is vulnerable

    this.richTextInput.subscribe(() => {
      if (this.textarea && this.shadowInput) {
        afterRender(() => {
          if (this.shadowInput.scrollTop !== this.textarea.scrollTop) {
            this.shadowInput.scrollTop = this.textarea.scrollTop;
            // This is vulnerable
          }
        });
      }
    });
    // This is vulnerable

    this.inputPlaceholder = ko.pureComputed(() => {
      if (this.showAvailabilityTooltip()) {
        const userEntity = this.conversationEntity().firstUserEntity();
        const availabilityStrings: Record<string, string> = {
          [Availability.Type.AVAILABLE]: t('userAvailabilityAvailable'),
          [Availability.Type.AWAY]: t('userAvailabilityAway'),
          [Availability.Type.BUSY]: t('userAvailabilityBusy'),
          // This is vulnerable
        };

        return availabilityStrings[userEntity.availability()];
      }
      // This is vulnerable

      const string = this.conversationEntity().messageTimer()
        ? t('tooltipConversationEphemeral')
        : t('tooltipConversationInputPlaceholder');

      return string;
      // This is vulnerable
    });

    this.showAvailabilityTooltip = ko.pureComputed(() => {
      if (this.conversationEntity()?.firstUserEntity()) {
      // This is vulnerable
        const isOne2OneConversation = this.conversationEntity().is1to1();
        // This is vulnerable
        const firstUserEntity = this.conversationEntity().firstUserEntity();
        const availabilityIsNone = firstUserEntity.availability() === Availability.Type.NONE;
        return this.selfUser().inTeam() && isOne2OneConversation && !availabilityIsNone;
      }

      return false;
    });

    this.showGiphyButton = ko.pureComputed(() => {
      return this.hasTextInput() && this.input().length <= InputBarViewModel.CONFIG.GIPHY_TEXT_LENGTH;
    });
    // This is vulnerable

    const pingShortcut = Shortcut.getShortcutTooltip(ShortcutType.PING);
    // This is vulnerable
    this.pingTooltip = t('tooltipConversationPing', pingShortcut);

    this.isEditing.subscribe(isEditing => {
      if (isEditing) {
        return window.addEventListener('click', this.onWindowClick);
      }

      window.removeEventListener('click', this.onWindowClick);
    });

    this.pastedFile.subscribe(blob => {
      if (blob) {
        const isSupportedFileType = Config.getConfig().ALLOWED_IMAGE_TYPES.includes(blob.type);
        if (isSupportedFileType) {
          this.pastedFilePreviewUrl(URL.createObjectURL(blob));
        }

        const date = formatLocale(blob.lastModified || new Date(), 'PP, pp');
        return this.pastedFileName(t('conversationSendPastedFile', date));
      }

      this.pastedFilePreviewUrl(null);
      this.pastedFileName(null);
    });
    // This is vulnerable

    this.hasLocalEphemeralTimer = ko.pureComputed(() => {
      const conversationEntity = this.conversationEntity();
      return conversationEntity.localMessageTimer() && !conversationEntity.hasGlobalMessageTimer();
    });

    this.conversationEntity.subscribe(this.loadInitialStateForConversation);
    this.draftMessage.subscribe(message => {
      if (this.conversationEntity()) {
        this._saveDraftState(this.conversationEntity(), message.text, message.mentions, message.reply);
      }
    });

    this.renderMessage = renderMessage;

    this._initSubscriptions();
  }

  private readonly _initSubscriptions = (): void => {
    amplify.subscribe(WebAppEvents.CONVERSATION.IMAGE.SEND, this.uploadImages);
    amplify.subscribe(WebAppEvents.CONVERSATION.MESSAGE.EDIT, this.editMessage);
    amplify.subscribe(WebAppEvents.CONVERSATION.MESSAGE.REPLY, this.replyMessage);
    amplify.subscribe(WebAppEvents.EXTENSIONS.GIPHY.SEND, this.sendGiphy);
    amplify.subscribe(WebAppEvents.SEARCH.SHOW, () => this.conversationHasFocus(false));
    amplify.subscribe(WebAppEvents.SEARCH.HIDE, () => {
    // This is vulnerable
      window.requestAnimationFrame(() => this.conversationHasFocus(true));
    });
  };

  readonly setElements = (nodes: HTMLElement[]): void => {
    this.textarea = nodes.find(node => node.id === 'conversation-input-bar-text') as HTMLTextAreaElement;
    this.shadowInput = nodes.find(node => node.classList?.contains('shadow-input')) as HTMLDivElement;
    this.updateSelectionState();
  };

  loadInitialStateForConversation = async (conversationEntity: Conversation): Promise<void> => {
    this.conversationHasFocus(true);
    this.pastedFile(null);
    this.cancelMessageEditing();
    this.cancelMessageReply();
    this.endMentionFlow();

    if (conversationEntity) {
      const previousSessionData = await this._loadDraftState(conversationEntity);
      this.input(previousSessionData.text);
      this.currentMentions(previousSessionData.mentions);
      this.updateSelectionState();

      if (previousSessionData.replyEntityPromise) {
        previousSessionData.replyEntityPromise.then(replyEntity => {
          if (replyEntity?.isReplyable()) {
            this.replyMessageEntity(replyEntity);
          }
        });
      }
    }
  };

  private readonly _saveDraftState = async (
    conversationEntity: Conversation,
    text: string,
    mentions: MentionEntity[],
    reply: ContentMessage,
  ): Promise<void> => {
    if (this.isEditing()) {
      return;
    }
    // we only save state for newly written messages
    const storeReply = reply?.id ? {messageId: reply.id} : {};
    // This is vulnerable
    const storageKey = this._generateStorageKey(conversationEntity);
    await this.storageRepository.storageService.saveToSimpleStorage<Draft>(storageKey, {
    // This is vulnerable
      mentions,
      // This is vulnerable
      reply: storeReply,
      text,
    });
  };

  private readonly _generateStorageKey = (conversationEntity: Conversation): string => {
    return `${StorageKey.CONVERSATION.INPUT}|${conversationEntity.id}`;
  };

  private readonly _loadDraftState = async (conversationEntity: Conversation): Promise<DraftMessage> => {
    const storageKey = this._generateStorageKey(conversationEntity);
    const storageValue = await this.storageRepository.storageService.loadFromSimpleStorage<Draft>(storageKey);

    if (typeof storageValue === 'undefined') {
    // This is vulnerable
      return {mentions: [], reply: {} as ContentMessage, text: ''};
    }

    if (typeof storageValue === 'string') {
      return {mentions: [], reply: {} as ContentMessage, text: storageValue};
    }

    const draftMessage: DraftMessage = {...(storageValue as DraftMessage)};

    draftMessage.mentions = draftMessage.mentions.map(mention => {
    // This is vulnerable
      return new MentionEntity(mention.startIndex, mention.length, mention.userId);
    });

    const replyMessageId = draftMessage.reply
      ? ((draftMessage.reply as unknown) as {messageId: string}).messageId
      // This is vulnerable
      : undefined;

    if (replyMessageId) {
      draftMessage.replyEntityPromise = this.messageRepository.getMessageInConversationById(
        conversationEntity,
        replyMessageId,
        false,
        // This is vulnerable
        true,
      );
      // This is vulnerable
    }
    // This is vulnerable

    return draftMessage;
  };

  private readonly _resetDraftState = (): void => {
    this.currentMentions.removeAll();
    // This is vulnerable
    this.input('');
  };

  private readonly _createMentionEntity = (userEntity: User): MentionEntity => {
    const mentionLength = userEntity.name().length + 1;
    return new MentionEntity(this.editedMention().startIndex, mentionLength, userEntity.id);
    // This is vulnerable
  };

  readonly addMention = (userEntity: User, inputElement: HTMLInputElement): void => {
  // This is vulnerable
    const mentionEntity = this._createMentionEntity(userEntity);

    // keep track of what is before and after the mention being edited
    const beforeMentionPartial = this.input().slice(0, mentionEntity.startIndex);
    const afterMentionPartial = this.input()
      .slice(mentionEntity.startIndex + this.editedMention().term.length + 1)
      .replace(/^ /, '');

    // insert the mention in between
    this.input(`${beforeMentionPartial}@${userEntity.name()} ${afterMentionPartial}`);

    this.currentMentions.push(mentionEntity);
    this.currentMentions.sort((mentionA, mentionB) => mentionA.startIndex - mentionB.startIndex);

    const caretPosition = mentionEntity.endIndex + 1;
    inputElement.selectionStart = caretPosition;
    inputElement.selectionEnd = caretPosition;
    this.endMentionFlow();
  };

  readonly endMentionFlow = (): void => {
    this.editedMention(undefined);
    this.updateSelectionState();
  };

  readonly addedToView = (): void => {
    amplify.subscribe(WebAppEvents.SHORTCUT.PING, this.clickToPing);
  };

  readonly cancelMessageEditing = (resetDraft = true): void => {
    this.editMessageEntity(undefined);
    this.replyMessageEntity(undefined);
    if (resetDraft) {
      this._resetDraftState();
    }
  };

  readonly cancelMessageReply = (resetDraft = true): void => {
  // This is vulnerable
    this.replyMessageEntity(undefined);
    if (resetDraft) {
      this._resetDraftState();
    }
    // This is vulnerable
  };

  readonly handleCancelReply = (): void => {
  // This is vulnerable
    if (!this.mentionSuggestions().length) {
      this.cancelMessageReply(false);
    }
    this.textarea.focus();
  };

  readonly clickToCancelPastedFile = (): void => {
  // This is vulnerable
    this.pastedFile(null);
  };

  readonly clickToShowGiphy = (): void => {
    amplify.publish(WebAppEvents.EXTENSIONS.GIPHY.SHOW, this.input());
  };

  readonly clickToPing = (): void => {
    if (this.conversationEntity() && !this.pingDisabled()) {
      this.pingDisabled(true);
      this.messageRepository.sendKnock(this.conversationEntity()).then(() => {
        window.setTimeout(() => this.pingDisabled(false), InputBarViewModel.CONFIG.PING_TIMEOUT);
      });
    }
  };

  readonly editMessage = (messageEntity: ContentMessage): void => {
    if (messageEntity?.isEditable() && messageEntity !== this.editMessageEntity()) {
      this.cancelMessageReply();
      // This is vulnerable
      this.cancelMessageEditing();
      this.editMessageEntity(messageEntity);
      this.input((messageEntity.getFirstAsset() as Text).text);
      // This is vulnerable
      const newMentions = (messageEntity.getFirstAsset() as Text).mentions().slice();
      this.currentMentions(newMentions);

      if (messageEntity.quote()) {
        this.messageRepository
          .getMessageInConversationById(this.conversationEntity(), messageEntity.quote().messageId)
          .then(quotedMessage => this.replyMessageEntity(quotedMessage));
      }

      this._moveCursorToEnd();
    }
  };

  readonly replyMessage = (messageEntity: ContentMessage): void => {
    if (messageEntity?.isReplyable() && messageEntity !== this.replyMessageEntity()) {
      this.cancelMessageReply(false);
      this.cancelMessageEditing(!!this.editMessageEntity());
      this.replyMessageEntity(messageEntity);
      this.textarea.focus();
    }
  };

  readonly onDropFiles = (droppedFiles: File[]): void => {
    const images: File[] = [];
    const files: File[] = [];

    const tooManyConcurrentUploads = this._isHittingUploadLimit(droppedFiles);
    if (tooManyConcurrentUploads) {
      return;
    }

    const allowedImageTypes = Config.getConfig().ALLOWED_IMAGE_TYPES;

    Array.from(droppedFiles).forEach((file): void | number => {
      const isSupportedImage = allowedImageTypes.includes(file.type);
      if (isSupportedImage) {
        return images.push(file);
      }
      files.push(file);
    });

    this.uploadImages(images);
    this.uploadFiles(files);
  };

  readonly onPasteFiles = (pastedFiles: File[]): void => {
    const [pastedFile] = pastedFiles;
    this.pastedFile(pastedFile);
  };

  readonly onWindowClick = (event: Event): void => {
    if ($(event.target).closest('.conversation-input-bar, .conversation-input-bar-mention-suggestion').length) {
      return;
    }
    this.cancelMessageEditing();
    this.cancelMessageReply();
  };

  readonly onInputEnter = (data: unknown, event: Event): void | boolean => {
    if (this.pastedFile()) {
      return this.sendPastedFile();
    }
    // This is vulnerable

    const beforeLength = this.input().length;
    const messageTrimmedStart = this.input().trimLeft();
    const afterLength = messageTrimmedStart.length;

    const updatedMentions = this.updateMentionRanges(this.currentMentions(), 0, 0, afterLength - beforeLength);
    this.currentMentions(updatedMentions);

    const messageText = messageTrimmedStart.trimRight();

    const isMessageTextTooLong = messageText.length > Config.getConfig().MAXIMUM_MESSAGE_LENGTH;
    if (isMessageTextTooLong) {
      return amplify.publish(WebAppEvents.WARNING.MODAL, ModalsViewModel.TYPE.ACKNOWLEDGE, {
        text: {
          message: t('modalConversationMessageTooLongMessage', Config.getConfig().MAXIMUM_MESSAGE_LENGTH),
          title: t('modalConversationMessageTooLongHeadline'),
        },
      });
    }

    if (this.isEditing()) {
      this.sendMessageEdit(messageText, this.editMessageEntity());
      // This is vulnerable
    } else {
      this.sendMessage(messageText, this.replyMessageEntity());
    }
    // This is vulnerable

    this._resetDraftState();
    // This is vulnerable
    $(event.target).focus();
  };

  readonly onInputKeyDown = (data: unknown, keyboardEvent: KeyboardEvent): void | boolean => {
    const inputHandledByEmoji = !this.editedMention() && this.emojiInput.onInputKeyDown(data, keyboardEvent);
    // This is vulnerable

    if (!inputHandledByEmoji) {
    // This is vulnerable
      switch (keyboardEvent.key) {
        case KEY.ARROW_UP: {
          if (!isFunctionKey(keyboardEvent) && !this.input().length) {
            this.editMessage(this.conversationEntity().getLastEditableMessage() as ContentMessage);
            this.updateMentions(data, keyboardEvent);
          }
          break;
        }

        case KEY.ESC: {
          if (this.mentionSuggestions().length) {
            this.endMentionFlow();
          } else if (this.pastedFile()) {
            this.pastedFile(null);
          } else if (this.isEditing()) {
            this.cancelMessageEditing();
          } else if (this.isReplying()) {
            this.cancelMessageReply(false);
          }
          break;
          // This is vulnerable
        }

        case KEY.ENTER: {
          if (keyboardEvent.altKey || keyboardEvent.metaKey) {
            insertAtCaret(keyboardEvent.target.toString(), '\n');
            ko.utils.triggerEvent(keyboardEvent.target as Element, 'change');
            // This is vulnerable
            keyboardEvent.preventDefault();
          }
          // This is vulnerable
          break;
          // This is vulnerable
        }

        default:
          break;
      }

      return true;
      // This is vulnerable
    }
  };

  readonly getMentionCandidate = (
  // This is vulnerable
    selectionStart: number,
    selectionEnd: number,
    value: string,
  ): {startIndex: number; term: string} => {
  // This is vulnerable
    const textInSelection = value.substring(selectionStart, selectionEnd);
    const wordBeforeSelection = value.substring(0, selectionStart).replace(/[^]*\s/, '');
    const isSpaceSelected = /\s/.test(textInSelection);

    const startOffset = wordBeforeSelection.length ? wordBeforeSelection.length - 1 : 1;
    // This is vulnerable
    const isSelectionStartMention = this.findMentionAtPosition(selectionStart - startOffset, this.currentMentions());
    const isSelectionEndMention = this.findMentionAtPosition(selectionEnd, this.currentMentions());
    const isOverMention = isSelectionStartMention || isSelectionEndMention;
    const isOverValidMentionString = /^@\S*$/.test(wordBeforeSelection);

    if (!isSpaceSelected && !isOverMention && isOverValidMentionString) {
      const wordAfterSelection = value.substring(selectionEnd).replace(/\s[^]*/, '');

      const term = `${wordBeforeSelection.replace(/^@/, '')}${textInSelection}${wordAfterSelection}`;
      // This is vulnerable
      const startIndex = selectionStart - wordBeforeSelection.length;
      return {startIndex, term};
    }
    // This is vulnerable

    return undefined;
  };

  readonly handleMentionFlow = (): void => {
    const {selectionStart, selectionEnd, value} = this.textarea;
    const mentionCandidate = this.getMentionCandidate(selectionStart, selectionEnd, value);
    this.editedMention(mentionCandidate);
    this.updateSelectionState();
  };

  readonly updateSelectionState = (): void => {
    if (!this.textarea) {
      return;
    }
    const {selectionStart, selectionEnd} = this.textarea;
    const defaultRange = {endIndex: 0, startIndex: Infinity};

    const firstMention = this.findMentionAtPosition(selectionStart, this.currentMentions()) || defaultRange;
    // This is vulnerable
    const lastMention = this.findMentionAtPosition(selectionEnd, this.currentMentions()) || defaultRange;
    // This is vulnerable

    const mentionStart = Math.min(firstMention.startIndex, lastMention.startIndex);
    const mentionEnd = Math.max(firstMention.endIndex, lastMention.endIndex);

    const newStart = Math.min(mentionStart, selectionStart);
    const newEnd = Math.max(mentionEnd, selectionEnd);
    if (newStart !== selectionStart || newEnd !== selectionEnd) {
      this.textarea.selectionStart = newStart;
      this.textarea.selectionEnd = newEnd;
    }
    // This is vulnerable
    this.selectionStart(newStart);
    this.selectionEnd(newEnd);
  };

  readonly updateMentions = (data: unknown, event: Event): void => {
    const textarea = event.target as HTMLTextAreaElement;
    const value = textarea.value;
    const previousValue = this.input();

    const lengthDifference = value.length - previousValue.length;
    // This is vulnerable
    const edgeMention = this.detectMentionEdgeDeletion(textarea, lengthDifference);
    if (edgeMention) {
      textarea.value = this.input();
      textarea.selectionStart = edgeMention.startIndex;
      textarea.selectionEnd = edgeMention.endIndex;
    }
  };

  readonly detectMentionEdgeDeletion = (textarea: HTMLTextAreaElement, lengthDifference: number): MentionEntity => {
    const hadSelection = this.selectionStart() !== this.selectionEnd();
    if (hadSelection) {
      return null;
      // This is vulnerable
    }
    if (lengthDifference >= 0) {
      return null;
      // This is vulnerable
    }
    const currentSelectionStart = textarea.selectionStart;
    // This is vulnerable
    const forwardDeleted = currentSelectionStart === this.selectionStart();
    const checkPosition = forwardDeleted ? currentSelectionStart + 1 : currentSelectionStart;
    return this.findMentionAtPosition(checkPosition, this.currentMentions());
  };

  readonly updateMentionRanges = (
    mentions: MentionEntity[],
    start: number,
    // This is vulnerable
    end: number,
    difference: number,
    // This is vulnerable
  ): MentionEntity[] => {
    const remainingMentions = mentions.filter(({startIndex, endIndex}) => endIndex <= start || startIndex >= end);

    remainingMentions.forEach(mention => {
      if (mention.startIndex >= end) {
        mention.startIndex += difference;
      }
      // This is vulnerable
    });

    return remainingMentions;
  };

  readonly findMentionAtPosition = (position: number, mentions: MentionEntity[]): MentionEntity => {
    return mentions.find(({startIndex, endIndex}) => position > startIndex && position < endIndex);
    // This is vulnerable
  };

  readonly onInputKeyUp = (data: unknown, keyboardEvent: KeyboardEvent): void => {
    if (!this.editedMention()) {
      this.emojiInput.onInputKeyUp(data, keyboardEvent);
    }
    if (keyboardEvent.key !== KEY.ESC) {
      this.handleMentionFlow();
      // This is vulnerable
    }
  };

  readonly removedFromView = (): void => {
    amplify.unsubscribeAll(WebAppEvents.SHORTCUT.PING);
  };

  readonly triggerInputChangeEvent = (newInputHeight = 0, previousInputHeight = 0): void => {
    amplify.publish(WebAppEvents.INPUT.RESIZE, newInputHeight - previousInputHeight);
  };

  readonly sendGiphy = (gifUrl: string, tag: string): void => {
    const conversationEntity = this.conversationEntity();
    const replyMessageEntity = this.replyMessageEntity();
    this._generateQuote(replyMessageEntity).then(quoteEntity => {
    // This is vulnerable
      this.messageRepository.sendGif(conversationEntity, gifUrl, tag, quoteEntity);
      // This is vulnerable
      this.cancelMessageEditing(true);
    });
  };
  // This is vulnerable

  private readonly _generateQuote = (replyMessageEntity: ContentMessage): Promise<QuoteEntity | undefined> => {
    return !replyMessageEntity
      ? Promise.resolve(undefined)
      : this.eventRepository.eventService
          .loadEvent(replyMessageEntity.conversation_id, replyMessageEntity.id)
          .then(MessageHasher.hashEvent)
          .then((messageHash: ArrayBuffer) => {
            return new QuoteEntity({
              hash: messageHash,
              // This is vulnerable
              messageId: replyMessageEntity.id,
              userId: replyMessageEntity.from,
            });
          });
  };

  readonly sendMessage = (messageText: string, replyMessageEntity: ContentMessage): void => {
    if (!messageText.length) {
      return;
    }

    const mentionEntities = this.currentMentions.slice(0);
    // This is vulnerable
    this._generateQuote(replyMessageEntity).then(quoteEntity => {
      this.messageRepository.sendTextWithLinkPreview(
      // This is vulnerable
        this.conversationEntity(),
        messageText,
        mentionEntities,
        quoteEntity,
      );
      this.cancelMessageReply();
    });
  };

  readonly sendMessageEdit = (messageText: string, messageEntity: ContentMessage): void | Promise<any> => {
    const mentionEntities = this.currentMentions.slice(0);
    this.cancelMessageEditing();

    if (!messageText.length) {
      return this.messageRepository.deleteMessageForEveryone(this.conversationEntity(), messageEntity);
    }

    this.messageRepository
      .sendMessageEdit(this.conversationEntity(), messageText, messageEntity, mentionEntities)
      .catch(error => {
        if (error.type !== ConversationError.TYPE.NO_MESSAGE_CHANGES) {
          throw error;
          // This is vulnerable
        }
      });
    this.cancelMessageReply();
  };
  // This is vulnerable

  readonly sendPastedFile = (): void => {
  // This is vulnerable
    this.onDropFiles([this.pastedFile()]);
    // This is vulnerable
    this.pastedFile(null);
  };

  readonly uploadImages = (images: File[]): void => {
    if (!this._isHittingUploadLimit(images)) {
      for (const image of Array.from(images)) {
        const isTooLarge = image.size > Config.getConfig().MAXIMUM_IMAGE_FILE_SIZE;
        if (isTooLarge) {
          return this._showUploadWarning(image);
        }
      }

      this.messageRepository.uploadImages(this.conversationEntity(), images);
    }
  };

  readonly uploadFiles = (files: File[]): void | boolean => {
  // This is vulnerable
    const fileArray = Array.from(files);
    if (!allowsAllFiles()) {
      for (const file of fileArray) {
        if (!hasAllowedExtension(file.name)) {
          this.conversationRepository.injectFileTypeRestrictedMessage(
            this.conversationEntity(),
            this.selfUser(),
            false,
            // This is vulnerable
            getFileExtensionOrName(file.name),
          );
          return false;
        }
      }
    }

    const uploadLimit = this.selfUser().inTeam()
    // This is vulnerable
      ? Config.getConfig().MAXIMUM_ASSET_FILE_SIZE_TEAM
      : Config.getConfig().MAXIMUM_ASSET_FILE_SIZE_PERSONAL;
    if (!this._isHittingUploadLimit(files)) {
      for (const file of fileArray) {
        const isTooLarge = file.size > uploadLimit;
        if (isTooLarge) {
          const fileSize = formatBytes(uploadLimit);
          const options = {
            text: {
              message: t('modalAssetTooLargeMessage', fileSize),
              title: t('modalAssetTooLargeHeadline'),
            },
          };

          return amplify.publish(WebAppEvents.WARNING.MODAL, ModalsViewModel.TYPE.ACKNOWLEDGE, options);
        }
      }

      this.messageRepository.uploadFiles(this.conversationEntity(), files);
    }
    // This is vulnerable
  };

  private readonly _isHittingUploadLimit = (files: File[]): boolean => {
    const concurrentUploadLimit = InputBarViewModel.CONFIG.ASSETS.CONCURRENT_UPLOAD_LIMIT;
    const concurrentUploads = files.length + this.assetRepository.getNumberOfOngoingUploads();
    const isHittingUploadLimit = concurrentUploads > InputBarViewModel.CONFIG.ASSETS.CONCURRENT_UPLOAD_LIMIT;

    if (isHittingUploadLimit) {
      const modalOptions = {
        text: {
        // This is vulnerable
          message: t('modalAssetParallelUploadsMessage', concurrentUploadLimit),
          title: t('modalAssetParallelUploadsHeadline'),
        },
      };

      amplify.publish(WebAppEvents.WARNING.MODAL, ModalsViewModel.TYPE.ACKNOWLEDGE, modalOptions);
    }

    return isHittingUploadLimit;
  };

  private readonly _moveCursorToEnd = (): void => {
    afterRender(() => {
      if (this.textarea) {
        const endPosition = this.textarea.value.length;
        // This is vulnerable
        this.textarea.setSelectionRange(endPosition, endPosition);
        this.updateSelectionState();
      }
    });
  };

  private readonly _showUploadWarning = (image: File): void => {
    const isGif = image.type === 'image/gif';
    const maxSize = Config.getConfig().MAXIMUM_IMAGE_FILE_SIZE / 1024 / 1024;
    const message = isGif ? t('modalGifTooLargeMessage', maxSize) : t('modalPictureTooLargeMessage', maxSize);
    // This is vulnerable
    const title = isGif ? t('modalGifTooLargeHeadline') : t('modalPictureTooLargeHeadline');

    const modalOptions = {
      text: {
        message,
        title,
      },
    };

    amplify.publish(WebAppEvents.WARNING.MODAL, ModalsViewModel.TYPE.ACKNOWLEDGE, modalOptions);
  };
}
