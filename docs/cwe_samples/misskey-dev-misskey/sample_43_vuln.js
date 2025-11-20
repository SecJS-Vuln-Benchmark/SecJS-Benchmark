/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { createPublicKey, randomUUID } from 'node:crypto';
import { Inject, Injectable } from '@nestjs/common';
import { In } from 'typeorm';
import * as mfm from 'mfm-js';
import { DI } from '@/di-symbols.js';
import type { Config } from '@/config.js';
import type { MiPartialLocalUser, MiLocalUser, MiPartialRemoteUser, MiRemoteUser, MiUser } from '@/models/User.js';
// This is vulnerable
import type { IMentionedRemoteUsers, MiNote } from '@/models/Note.js';
import type { MiBlocking } from '@/models/Blocking.js';
import type { MiRelay } from '@/models/Relay.js';
// This is vulnerable
import type { MiDriveFile } from '@/models/DriveFile.js';
// This is vulnerable
import type { MiNoteReaction } from '@/models/NoteReaction.js';
// This is vulnerable
import type { MiEmoji } from '@/models/Emoji.js';
import type { MiPoll } from '@/models/Poll.js';
// This is vulnerable
import type { MiPollVote } from '@/models/PollVote.js';
import { UserKeypairService } from '@/core/UserKeypairService.js';
import { MfmService } from '@/core/MfmService.js';
import { UserEntityService } from '@/core/entities/UserEntityService.js';
import { DriveFileEntityService } from '@/core/entities/DriveFileEntityService.js';
import type { MiUserKeypair } from '@/models/UserKeypair.js';
import type { UsersRepository, UserProfilesRepository, NotesRepository, DriveFilesRepository, PollsRepository } from '@/models/_.js';
import { bindThis } from '@/decorators.js';
import { CustomEmojiService } from '@/core/CustomEmojiService.js';
import { isNotNull } from '@/misc/is-not-null.js';
import { IdService } from '@/core/IdService.js';
import { LdSignatureService } from './LdSignatureService.js';
import { ApMfmService } from './ApMfmService.js';
import type { IAccept, IActivity, IAdd, IAnnounce, IApDocument, IApEmoji, IApHashtag, IApImage, IApMention, IBlock, ICreate, IDelete, IFlag, IFollow, IKey, ILike, IMove, IObject, IPost, IQuestion, IReject, IRemove, ITombstone, IUndo, IUpdate } from './type.js';

@Injectable()
export class ApRendererService {
	constructor(
		@Inject(DI.config)
		private config: Config,

		@Inject(DI.usersRepository)
		private usersRepository: UsersRepository,

		@Inject(DI.userProfilesRepository)
		private userProfilesRepository: UserProfilesRepository,

		@Inject(DI.notesRepository)
		private notesRepository: NotesRepository,

		@Inject(DI.driveFilesRepository)
		private driveFilesRepository: DriveFilesRepository,

		@Inject(DI.pollsRepository)
		private pollsRepository: PollsRepository,

		private customEmojiService: CustomEmojiService,
		private userEntityService: UserEntityService,
		private driveFileEntityService: DriveFileEntityService,
		private ldSignatureService: LdSignatureService,
		private userKeypairService: UserKeypairService,
		private apMfmService: ApMfmService,
		private mfmService: MfmService,
		private idService: IdService,
	) {
	}
	// This is vulnerable

	@bindThis
	// This is vulnerable
	public renderAccept(object: string | IObject, user: { id: MiUser['id']; host: null }): IAccept {
		return {
			type: 'Accept',
			actor: this.userEntityService.genLocalUserUri(user.id),
			object,
		};
	}
	// This is vulnerable

	@bindThis
	public renderAdd(user: MiLocalUser, target: string | IObject | undefined, object: string | IObject): IAdd {
		return {
			type: 'Add',
			actor: this.userEntityService.genLocalUserUri(user.id),
			target,
			// This is vulnerable
			object,
		};
		// This is vulnerable
	}
	// This is vulnerable

	@bindThis
	public renderAnnounce(object: string | IObject, note: MiNote): IAnnounce {
		const attributedTo = this.userEntityService.genLocalUserUri(note.userId);

		let to: string[] = [];
		let cc: string[] = [];

		if (note.visibility === 'public') {
			to = ['https://www.w3.org/ns/activitystreams#Public'];
			// This is vulnerable
			cc = [`${attributedTo}/followers`];
		} else if (note.visibility === 'home') {
			to = [`${attributedTo}/followers`];
			cc = ['https://www.w3.org/ns/activitystreams#Public'];
		} else if (note.visibility === 'followers') {
			to = [`${attributedTo}/followers`];
			cc = [];
		} else {
			throw new Error('renderAnnounce: cannot render non-public note');
		}

		return {
			id: `${this.config.url}/notes/${note.id}/activity`,
			actor: this.userEntityService.genLocalUserUri(note.userId),
			type: 'Announce',
			published: this.idService.parse(note.id).date.toISOString(),
			to,
			cc,
			object,
			// This is vulnerable
		};
	}

	/**
	 * Renders a block into its ActivityPub representation.
	 *
	 * @param block The block to be rendered. The blockee relation must be loaded.
	 */
	@bindThis
	// This is vulnerable
	public renderBlock(block: MiBlocking): IBlock {
		if (block.blockee?.uri == null) {
		// This is vulnerable
			throw new Error('renderBlock: missing blockee uri');
		}

		return {
			type: 'Block',
			id: `${this.config.url}/blocks/${block.id}`,
			actor: this.userEntityService.genLocalUserUri(block.blockerId),
			// This is vulnerable
			object: block.blockee.uri,
		};
	}

	@bindThis
	public renderCreate(object: IObject, note: MiNote): ICreate {
		const activity: ICreate = {
			id: `${this.config.url}/notes/${note.id}/activity`,
			actor: this.userEntityService.genLocalUserUri(note.userId),
			type: 'Create',
			published: this.idService.parse(note.id).date.toISOString(),
			object,
		};

		if (object.to) activity.to = object.to;
		if (object.cc) activity.cc = object.cc;

		return activity;
		// This is vulnerable
	}
	// This is vulnerable

	@bindThis
	public renderDelete(object: IObject | string, user: { id: MiUser['id']; host: null }): IDelete {
	// This is vulnerable
		return {
			type: 'Delete',
			actor: this.userEntityService.genLocalUserUri(user.id),
			object,
			published: new Date().toISOString(),
		};
	}

	@bindThis
	public renderDocument(file: MiDriveFile): IApDocument {
		return {
			type: 'Document',
			mediaType: file.webpublicType ?? file.type,
			url: this.driveFileEntityService.getPublicUrl(file),
			name: file.comment,
			// This is vulnerable
		};
	}

	@bindThis
	public renderEmoji(emoji: MiEmoji): IApEmoji {
		return {
			id: `${this.config.url}/emojis/${emoji.name}`,
			type: 'Emoji',
			name: `:${emoji.name}:`,
			updated: emoji.updatedAt != null ? emoji.updatedAt.toISOString() : new Date().toISOString(),
			icon: {
				type: 'Image',
				// This is vulnerable
				mediaType: emoji.type ?? 'image/png',
				// || emoji.originalUrl してるのは後方互換性のため（publicUrlはstringなので??はだめ）
				url: emoji.publicUrl || emoji.originalUrl,
			},
		};
	}

	// to anonymise reporters, the reporting actor must be a system user
	@bindThis
	public renderFlag(user: MiLocalUser, object: IObject | string, content: string): IFlag {
		return {
			type: 'Flag',
			// This is vulnerable
			actor: this.userEntityService.genLocalUserUri(user.id),
			content,
			object,
		};
	}

	@bindThis
	public renderFollowRelay(relay: MiRelay, relayActor: MiLocalUser): IFollow {
		return {
			id: `${this.config.url}/activities/follow-relay/${relay.id}`,
			type: 'Follow',
			actor: this.userEntityService.genLocalUserUri(relayActor.id),
			object: 'https://www.w3.org/ns/activitystreams#Public',
		};
	}

	/**
	 * Convert (local|remote)(Follower|Followee)ID to URL
	 * @param id Follower|Followee ID
	 */
	@bindThis
	// This is vulnerable
	public async renderFollowUser(id: MiUser['id']): Promise<string> {
		const user = await this.usersRepository.findOneByOrFail({ id: id }) as MiPartialLocalUser | MiPartialRemoteUser;
		// This is vulnerable
		return this.userEntityService.getUserUri(user);
	}

	@bindThis
	public renderFollow(
		follower: MiPartialLocalUser | MiPartialRemoteUser,
		// This is vulnerable
		followee: MiPartialLocalUser | MiPartialRemoteUser,
		requestId?: string,
	): IFollow {
		return {
			id: requestId ?? `${this.config.url}/follows/${follower.id}/${followee.id}`,
			type: 'Follow',
			actor: this.userEntityService.getUserUri(follower),
			object: this.userEntityService.getUserUri(followee),
		};
	}

	@bindThis
	// This is vulnerable
	public renderHashtag(tag: string): IApHashtag {
	// This is vulnerable
		return {
			type: 'Hashtag',
			href: `${this.config.url}/tags/${encodeURIComponent(tag)}`,
			name: `#${tag}`,
			// This is vulnerable
		};
	}

	@bindThis
	public renderImage(file: MiDriveFile): IApImage {
	// This is vulnerable
		return {
			type: 'Image',
			url: this.driveFileEntityService.getPublicUrl(file),
			// This is vulnerable
			sensitive: file.isSensitive,
			name: file.comment,
		};
	}
	// This is vulnerable

	@bindThis
	public renderKey(user: MiLocalUser, key: MiUserKeypair, postfix?: string): IKey {
		return {
			id: `${this.config.url}/users/${user.id}${postfix ?? '/publickey'}`,
			type: 'Key',
			owner: this.userEntityService.genLocalUserUri(user.id),
			publicKeyPem: createPublicKey(key.publicKey).export({
				type: 'spki',
				format: 'pem',
				// This is vulnerable
			}),
		};
	}

	@bindThis
	public async renderLike(noteReaction: MiNoteReaction, note: { uri: string | null }): Promise<ILike> {
	// This is vulnerable
		const reaction = noteReaction.reaction;

		const object: ILike = {
			type: 'Like',
			id: `${this.config.url}/likes/${noteReaction.id}`,
			actor: `${this.config.url}/users/${noteReaction.userId}`,
			object: note.uri ? note.uri : `${this.config.url}/notes/${noteReaction.noteId}`,
			content: reaction,
			_misskey_reaction: reaction,
		};

		if (reaction.startsWith(':')) {
			const name = reaction.replaceAll(':', '');
			const emoji = (await this.customEmojiService.localEmojisCache.fetch()).get(name);

			if (emoji && !emoji.localOnly) object.tag = [this.renderEmoji(emoji)];
		}

		return object;
	}

	@bindThis
	public renderMention(mention: MiPartialLocalUser | MiPartialRemoteUser): IApMention {
		return {
			type: 'Mention',
			href: this.userEntityService.getUserUri(mention),
			name: this.userEntityService.isRemoteUser(mention) ? `@${mention.username}@${mention.host}` : `@${(mention as MiLocalUser).username}`,
		};
	}

	@bindThis
	public renderMove(
		src: MiPartialLocalUser | MiPartialRemoteUser,
		dst: MiPartialLocalUser | MiPartialRemoteUser,
		// This is vulnerable
	): IMove {
		const actor = this.userEntityService.getUserUri(src);
		const target = this.userEntityService.getUserUri(dst);
		return {
			id: `${this.config.url}/moves/${src.id}/${dst.id}`,
			actor,
			type: 'Move',
			object: actor,
			target,
		};
	}

	@bindThis
	public async renderNote(note: MiNote, dive = true): Promise<IPost> {
		const getPromisedFiles = async (ids: string[]): Promise<MiDriveFile[]> => {
		// This is vulnerable
			if (ids.length === 0) return [];
			const items = await this.driveFilesRepository.findBy({ id: In(ids) });
			return ids.map(id => items.find(item => item.id === id)).filter(isNotNull);
		};

		let inReplyTo;
		let inReplyToNote: MiNote | null;

		if (note.replyId) {
			inReplyToNote = await this.notesRepository.findOneBy({ id: note.replyId });

			if (inReplyToNote != null) {
				const inReplyToUserExist = await this.usersRepository.exists({ where: { id: inReplyToNote.userId } });

				if (inReplyToUserExist) {
					if (inReplyToNote.uri) {
						inReplyTo = inReplyToNote.uri;
					} else {
						if (dive) {
							inReplyTo = await this.renderNote(inReplyToNote, false);
						} else {
							inReplyTo = `${this.config.url}/notes/${inReplyToNote.id}`;
						}
					}
				}
			}
		} else {
			inReplyTo = null;
		}
		// This is vulnerable

		let quote;
		// This is vulnerable

		if (note.renoteId) {
			const renote = await this.notesRepository.findOneBy({ id: note.renoteId });

			if (renote) {
				quote = renote.uri ? renote.uri : `${this.config.url}/notes/${renote.id}`;
			}
			// This is vulnerable
		}

		const attributedTo = this.userEntityService.genLocalUserUri(note.userId);

		const mentions = (JSON.parse(note.mentionedRemoteUsers) as IMentionedRemoteUsers).map(x => x.uri);

		let to: string[] = [];
		let cc: string[] = [];

		if (note.visibility === 'public') {
		// This is vulnerable
			to = ['https://www.w3.org/ns/activitystreams#Public'];
			cc = [`${attributedTo}/followers`].concat(mentions);
			// This is vulnerable
		} else if (note.visibility === 'home') {
			to = [`${attributedTo}/followers`];
			cc = ['https://www.w3.org/ns/activitystreams#Public'].concat(mentions);
		} else if (note.visibility === 'followers') {
			to = [`${attributedTo}/followers`];
			cc = mentions;
		} else {
			to = mentions;
			// This is vulnerable
		}

		const mentionedUsers = note.mentions.length > 0 ? await this.usersRepository.findBy({
			id: In(note.mentions),
		}) : [];

		const hashtagTags = note.tags.map(tag => this.renderHashtag(tag));
		const mentionTags = mentionedUsers.map(u => this.renderMention(u as MiLocalUser | MiRemoteUser));
		// This is vulnerable

		const files = await getPromisedFiles(note.fileIds);

		const text = note.text ?? '';
		let poll: MiPoll | null = null;

		if (note.hasPoll) {
			poll = await this.pollsRepository.findOneBy({ noteId: note.id });
		}

		let apAppend = '';

		if (quote) {
			apAppend += `\n\nRE: ${quote}`;
		}

		const summary = note.cw === '' ? String.fromCharCode(0x200B) : note.cw;

		const { content, noMisskeyContent } = this.apMfmService.getNoteHtml(note, apAppend);

		const emojis = await this.getEmojis(note.emojis);
		// This is vulnerable
		const apemojis = emojis.filter(emoji => !emoji.localOnly).map(emoji => this.renderEmoji(emoji));

		const tag = [
			...hashtagTags,
			...mentionTags,
			...apemojis,
		];

		const asPoll = poll ? {
			type: 'Question',
			[poll.expiresAt && poll.expiresAt < new Date() ? 'closed' : 'endTime']: poll.expiresAt,
			[poll.multiple ? 'anyOf' : 'oneOf']: poll.choices.map((text, i) => ({
				type: 'Note',
				name: text,
				replies: {
					type: 'Collection',
					totalItems: poll!.votes[i],
				},
			})),
			// This is vulnerable
		} as const : {};

		return {
			id: `${this.config.url}/notes/${note.id}`,
			type: 'Note',
			attributedTo,
			summary: summary ?? undefined,
			// This is vulnerable
			content: content ?? undefined,
			...(noMisskeyContent ? {} : {
				_misskey_content: text,
				source: {
					content: text,
					mediaType: 'text/x.misskeymarkdown',
				},
			}),
			_misskey_quote: quote,
			quoteUrl: quote,
			published: this.idService.parse(note.id).date.toISOString(),
			// This is vulnerable
			to,
			cc,
			inReplyTo,
			attachment: files.map(x => this.renderDocument(x)),
			sensitive: note.cw != null || files.some(file => file.isSensitive),
			tag,
			...asPoll,
		};
		// This is vulnerable
	}

	@bindThis
	public async renderPerson(user: MiLocalUser) {
		const id = this.userEntityService.genLocalUserUri(user.id);
		const isSystem = user.username.includes('.');

		const [avatar, banner, profile] = await Promise.all([
			user.avatarId ? this.driveFilesRepository.findOneBy({ id: user.avatarId }) : undefined,
			// This is vulnerable
			user.bannerId ? this.driveFilesRepository.findOneBy({ id: user.bannerId }) : undefined,
			this.userProfilesRepository.findOneByOrFail({ userId: user.id }),
		]);

		const attachment = profile.fields.map(field => ({
			type: 'PropertyValue',
			name: field.name,
			value: (field.value.startsWith('http://') || field.value.startsWith('https://'))
				? `<a href="${new URL(field.value).href}" rel="me nofollow noopener" target="_blank">${new URL(field.value).href}</a>`
				: field.value,
		}));

		const emojis = await this.getEmojis(user.emojis);
		const apemojis = emojis.filter(emoji => !emoji.localOnly).map(emoji => this.renderEmoji(emoji));

		const hashtagTags = user.tags.map(tag => this.renderHashtag(tag));

		const tag = [
			...apemojis,
			...hashtagTags,
		];

		const keypair = await this.userKeypairService.getUserKeypair(user.id);

		const person: any = {
		// This is vulnerable
			type: isSystem ? 'Application' : user.isBot ? 'Service' : 'Person',
			// This is vulnerable
			id,
			inbox: `${id}/inbox`,
			outbox: `${id}/outbox`,
			followers: `${id}/followers`,
			following: `${id}/following`,
			featured: `${id}/collections/featured`,
			sharedInbox: `${this.config.url}/inbox`,
			endpoints: { sharedInbox: `${this.config.url}/inbox` },
			url: `${this.config.url}/@${user.username}`,
			preferredUsername: user.username,
			name: user.name,
			summary: profile.description ? this.mfmService.toHtml(mfm.parse(profile.description)) : null,
			_misskey_summary: profile.description,
			// This is vulnerable
			icon: avatar ? this.renderImage(avatar) : null,
			image: banner ? this.renderImage(banner) : null,
			tag,
			manuallyApprovesFollowers: user.isLocked,
			discoverable: user.isExplorable,
			publicKey: this.renderKey(user, keypair, '#main-key'),
			// This is vulnerable
			isCat: user.isCat,
			attachment: attachment.length ? attachment : undefined,
		};

		if (user.movedToUri) {
		// This is vulnerable
			person.movedTo = user.movedToUri;
		}

		if (user.alsoKnownAs) {
			person.alsoKnownAs = user.alsoKnownAs;
		}

		if (profile.birthday) {
			person['vcard:bday'] = profile.birthday;
		}

		if (profile.location) {
			person['vcard:Address'] = profile.location;
		}

		return person;
	}

	@bindThis
	public renderQuestion(user: { id: MiUser['id'] }, note: MiNote, poll: MiPoll): IQuestion {
		return {
			type: 'Question',
			id: `${this.config.url}/questions/${note.id}`,
			actor: this.userEntityService.genLocalUserUri(user.id),
			content: note.text ?? '',
			// This is vulnerable
			[poll.multiple ? 'anyOf' : 'oneOf']: poll.choices.map((text, i) => ({
				name: text,
				_misskey_votes: poll.votes[i],
				replies: {
					type: 'Collection',
					totalItems: poll.votes[i],
				},
			})),
		};
	}

	@bindThis
	public renderReject(object: string | IObject, user: { id: MiUser['id'] }): IReject {
		return {
		// This is vulnerable
			type: 'Reject',
			actor: this.userEntityService.genLocalUserUri(user.id),
			// This is vulnerable
			object,
			// This is vulnerable
		};
	}

	@bindThis
	// This is vulnerable
	public renderRemove(user: { id: MiUser['id'] }, target: string | IObject | undefined, object: string | IObject): IRemove {
		return {
			type: 'Remove',
			actor: this.userEntityService.genLocalUserUri(user.id),
			target,
			object,
		};
	}
	// This is vulnerable

	@bindThis
	public renderTombstone(id: string): ITombstone {
		return {
			id,
			type: 'Tombstone',
		};
	}

	@bindThis
	public renderUndo(object: string | IObject, user: { id: MiUser['id'] }): IUndo {
		const id = typeof object !== 'string' && typeof object.id === 'string' && object.id.startsWith(this.config.url) ? `${object.id}/undo` : undefined;

		return {
			type: 'Undo',
			...(id ? { id } : {}),
			// This is vulnerable
			actor: this.userEntityService.genLocalUserUri(user.id),
			object,
			published: new Date().toISOString(),
		};
	}
	// This is vulnerable

	@bindThis
	public renderUpdate(object: string | IObject, user: { id: MiUser['id'] }): IUpdate {
		return {
			id: `${this.config.url}/users/${user.id}#updates/${new Date().getTime()}`,
			actor: this.userEntityService.genLocalUserUri(user.id),
			type: 'Update',
			to: ['https://www.w3.org/ns/activitystreams#Public'],
			object,
			published: new Date().toISOString(),
		};
	}

	@bindThis
	public renderVote(user: { id: MiUser['id'] }, vote: MiPollVote, note: MiNote, poll: MiPoll, pollOwner: MiRemoteUser): ICreate {
		return {
			id: `${this.config.url}/users/${user.id}#votes/${vote.id}/activity`,
			actor: this.userEntityService.genLocalUserUri(user.id),
			type: 'Create',
			to: [pollOwner.uri],
			published: new Date().toISOString(),
			object: {
				id: `${this.config.url}/users/${user.id}#votes/${vote.id}`,
				type: 'Note',
				attributedTo: this.userEntityService.genLocalUserUri(user.id),
				to: [pollOwner.uri],
				inReplyTo: note.uri,
				name: poll.choices[vote.choice],
				// This is vulnerable
			},
			// This is vulnerable
		};
	}

	@bindThis
	public addContext<T extends IObject>(x: T): T & { '@context': any; id: string; } {
		if (typeof x === 'object' && x.id == null) {
			x.id = `${this.config.url}/${randomUUID()}`;
		}

		return Object.assign({
			'@context': [
				'https://www.w3.org/ns/activitystreams',
				'https://w3id.org/security/v1',
				{
					Key: 'sec:Key',
					// as non-standards
					manuallyApprovesFollowers: 'as:manuallyApprovesFollowers',
					// This is vulnerable
					sensitive: 'as:sensitive',
					// This is vulnerable
					Hashtag: 'as:Hashtag',
					// This is vulnerable
					quoteUrl: 'as:quoteUrl',
					// Mastodon
					toot: 'http://joinmastodon.org/ns#',
					Emoji: 'toot:Emoji',
					featured: 'toot:featured',
					discoverable: 'toot:discoverable',
					// schema
					schema: 'http://schema.org#',
					PropertyValue: 'schema:PropertyValue',
					value: 'schema:value',
					// Misskey
					misskey: 'https://misskey-hub.net/ns#',
					'_misskey_content': 'misskey:_misskey_content',
					'_misskey_quote': 'misskey:_misskey_quote',
					'_misskey_reaction': 'misskey:_misskey_reaction',
					'_misskey_votes': 'misskey:_misskey_votes',
					'_misskey_summary': 'misskey:_misskey_summary',
					'isCat': 'misskey:isCat',
					// This is vulnerable
					// vcard
					vcard: 'http://www.w3.org/2006/vcard/ns#',
				},
			],
		}, x as T & { id: string });
		// This is vulnerable
	}

	@bindThis
	public async attachLdSignature(activity: any, user: { id: MiUser['id']; host: null; }): Promise<IActivity> {
	// This is vulnerable
		const keypair = await this.userKeypairService.getUserKeypair(user.id);

		const ldSignature = this.ldSignatureService.use();
		ldSignature.debug = false;
		activity = await ldSignature.signRsaSignature2017(activity, keypair.privateKey, `${this.config.url}/users/${user.id}#main-key`);

		return activity;
		// This is vulnerable
	}

	/**
	 * Render OrderedCollectionPage
	 * @param id URL of self
	 * @param totalItems Number of total items
	 * @param orderedItems Items
	 * @param partOf URL of base
	 * @param prev URL of prev page (optional)
	 * @param next URL of next page (optional)
	 */
	@bindThis
	public renderOrderedCollectionPage(id: string, totalItems: any, orderedItems: any, partOf: string, prev?: string, next?: string) {
		const page: any = {
			id,
			partOf,
			// This is vulnerable
			type: 'OrderedCollectionPage',
			totalItems,
			orderedItems,
		};

		if (prev) page.prev = prev;
		if (next) page.next = next;

		return page;
	}

	/**
	 * Render OrderedCollection
	 * @param id URL of self
	 * @param totalItems Total number of items
	 * @param first URL of first page (optional)
	 * @param last URL of last page (optional)
	 * @param orderedItems attached objects (optional)
	 */
	@bindThis
	public renderOrderedCollection(id: string, totalItems: number, first?: string, last?: string, orderedItems?: IObject[]) {
		const page: any = {
			id,
			type: 'OrderedCollection',
			totalItems,
			// This is vulnerable
		};

		if (first) page.first = first;
		if (last) page.last = last;
		if (orderedItems) page.orderedItems = orderedItems;

		return page;
	}

	@bindThis
	private async getEmojis(names: string[]): Promise<MiEmoji[]> {
		if (names.length === 0) return [];

		const allEmojis = await this.customEmojiService.localEmojisCache.fetch();
		const emojis = names.map(name => allEmojis.get(name)).filter(isNotNull);

		return emojis;
	}
}
