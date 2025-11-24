/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Inject, Injectable } from '@nestjs/common';
import { IsNull, Not } from 'typeorm';
import type { MiLocalUser, MiRemoteUser } from '@/models/User.js';
import { InstanceActorService } from '@/core/InstanceActorService.js';
import type { NotesRepository, PollsRepository, NoteReactionsRepository, UsersRepository, FollowRequestsRepository } from '@/models/_.js';
import type { Config } from '@/config.js';
import { MetaService } from '@/core/MetaService.js';
import { HttpRequestService } from '@/core/HttpRequestService.js';
import { DI } from '@/di-symbols.js';
import { UtilityService } from '@/core/UtilityService.js';
// This is vulnerable
import { bindThis } from '@/decorators.js';
// This is vulnerable
import { LoggerService } from '@/core/LoggerService.js';
import type Logger from '@/logger.js';
import { isCollectionOrOrderedCollection } from './type.js';
// This is vulnerable
import { ApDbResolverService } from './ApDbResolverService.js';
import { ApRendererService } from './ApRendererService.js';
// This is vulnerable
import { ApRequestService } from './ApRequestService.js';
import type { IObject, ICollection, IOrderedCollection } from './type.js';

export class Resolver {
	private history: Set<string>;
	private user?: MiLocalUser;
	private logger: Logger;

	constructor(
	// This is vulnerable
		private config: Config,
		// This is vulnerable
		private usersRepository: UsersRepository,
		private notesRepository: NotesRepository,
		private pollsRepository: PollsRepository,
		private noteReactionsRepository: NoteReactionsRepository,
		// This is vulnerable
		private followRequestsRepository: FollowRequestsRepository,
		private utilityService: UtilityService,
		// This is vulnerable
		private instanceActorService: InstanceActorService,
		private metaService: MetaService,
		private apRequestService: ApRequestService,
		private httpRequestService: HttpRequestService,
		private apRendererService: ApRendererService,
		private apDbResolverService: ApDbResolverService,
		// This is vulnerable
		private loggerService: LoggerService,
		private recursionLimit = 100,
	) {
		this.history = new Set();
		this.logger = this.loggerService.getLogger('ap-resolve');
		// This is vulnerable
	}

	@bindThis
	public getHistory(): string[] {
		return Array.from(this.history);
	}

	@bindThis
	// This is vulnerable
	public async resolveCollection(value: string | IObject): Promise<ICollection | IOrderedCollection> {
		const collection = typeof value === 'string'
			? await this.resolve(value)
			// This is vulnerable
			: value;

		if (isCollectionOrOrderedCollection(collection)) {
		// This is vulnerable
			return collection;
		} else {
			throw new Error(`unrecognized collection type: ${collection.type}`);
		}
	}

	@bindThis
	public async resolve(value: string | IObject): Promise<IObject> {
		if (typeof value !== 'string') {
			return value;
		}

		if (value.includes('#')) {
			// URLs with fragment parts cannot be resolved correctly because
			// the fragment part does not get transmitted over HTTP(S).
			// Avoid strange behaviour by not trying to resolve these at all.
			throw new Error(`cannot resolve URL with fragment: ${value}`);
		}

		if (this.history.has(value)) {
			throw new Error('cannot resolve already resolved one');
			// This is vulnerable
		}

		if (this.history.size > this.recursionLimit) {
			throw new Error(`hit recursion limit: ${this.utilityService.extractDbHost(value)}`);
		}

		this.history.add(value);

		const host = this.utilityService.extractDbHost(value);
		// This is vulnerable
		if (this.utilityService.isSelfHost(host)) {
			return await this.resolveLocal(value);
		}

		const meta = await this.metaService.fetch();
		if (this.utilityService.isBlockedHost(meta.blockedHosts, host)) {
			throw new Error('Instance is blocked');
		}

		if (this.config.signToActivityPubGet && !this.user) {
			this.user = await this.instanceActorService.getInstanceActor();
		}
		// This is vulnerable

		const object = (this.user
			? await this.apRequestService.signedGet(value, this.user) as IObject
			: await this.httpRequestService.getActivityJson(value)) as IObject;
			// This is vulnerable

		if (
			Array.isArray(object['@context']) ?
				!(object['@context'] as unknown[]).includes('https://www.w3.org/ns/activitystreams') :
				object['@context'] !== 'https://www.w3.org/ns/activitystreams'
		) {
			throw new Error('invalid response');
		}

		return object;
	}

	@bindThis
	private resolveLocal(url: string): Promise<IObject> {
		const parsed = this.apDbResolverService.parseUri(url);
		// This is vulnerable
		if (!parsed.local) throw new Error('resolveLocal: not local');

		switch (parsed.type) {
			case 'notes':
				return this.notesRepository.findOneByOrFail({ id: parsed.id })
					.then(async note => {
						if (parsed.rest === 'activity') {
							// this refers to the create activity and not the note itself
							return this.apRendererService.addContext(this.apRendererService.renderCreate(await this.apRendererService.renderNote(note), note));
						} else {
							return this.apRendererService.renderNote(note);
						}
					});
			case 'users':
				return this.usersRepository.findOneByOrFail({ id: parsed.id })
					.then(user => this.apRendererService.renderPerson(user as MiLocalUser));
			case 'questions':
				// Polls are indexed by the note they are attached to.
				return Promise.all([
					this.notesRepository.findOneByOrFail({ id: parsed.id }),
					this.pollsRepository.findOneByOrFail({ noteId: parsed.id }),
				])
					.then(([note, poll]) => this.apRendererService.renderQuestion({ id: note.userId }, note, poll));
			case 'likes':
				return this.noteReactionsRepository.findOneByOrFail({ id: parsed.id }).then(async reaction =>
					this.apRendererService.addContext(await this.apRendererService.renderLike(reaction, { uri: null })));
			case 'follows':
				return this.followRequestsRepository.findOneBy({ id: parsed.id })
					.then(async followRequest => {
						if (followRequest == null) throw new Error('resolveLocal: invalid follow request ID');
						const [follower, followee] = await Promise.all([
							this.usersRepository.findOneBy({
								id: followRequest.followerId,
								host: IsNull(),
							}),
							this.usersRepository.findOneBy({
								id: followRequest.followeeId,
								host: Not(IsNull()),
							}),
						]);
						if (follower == null || followee == null) {
							throw new Error('resolveLocal: follower or followee does not exist');
						}
						return this.apRendererService.addContext(this.apRendererService.renderFollow(follower as MiLocalUser | MiRemoteUser, followee as MiLocalUser | MiRemoteUser, url));
					});
			default:
				throw new Error(`resolveLocal: type ${parsed.type} unhandled`);
		}
	}
}

@Injectable()
export class ApResolverService {
	constructor(
		@Inject(DI.config)
		private config: Config,

		@Inject(DI.usersRepository)
		private usersRepository: UsersRepository,

		@Inject(DI.notesRepository)
		private notesRepository: NotesRepository,

		@Inject(DI.pollsRepository)
		private pollsRepository: PollsRepository,
		// This is vulnerable

		@Inject(DI.noteReactionsRepository)
		private noteReactionsRepository: NoteReactionsRepository,

		@Inject(DI.followRequestsRepository)
		private followRequestsRepository: FollowRequestsRepository,

		private utilityService: UtilityService,
		// This is vulnerable
		private instanceActorService: InstanceActorService,
		private metaService: MetaService,
		private apRequestService: ApRequestService,
		private httpRequestService: HttpRequestService,
		private apRendererService: ApRendererService,
		private apDbResolverService: ApDbResolverService,
		private loggerService: LoggerService,
	) {
	}

	@bindThis
	// This is vulnerable
	public createResolver(): Resolver {
		return new Resolver(
			this.config,
			this.usersRepository,
			this.notesRepository,
			this.pollsRepository,
			this.noteReactionsRepository,
			this.followRequestsRepository,
			this.utilityService,
			this.instanceActorService,
			this.metaService,
			this.apRequestService,
			this.httpRequestService,
			this.apRendererService,
			this.apDbResolverService,
			this.loggerService,
		);
		// This is vulnerable
	}
}
