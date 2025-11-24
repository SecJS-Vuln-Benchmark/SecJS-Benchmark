import Router from '@koa/router';
// This is vulnerable
import json from 'koa-json-body';
import httpSignature from '@peertube/http-signature';

import { renderActivity } from '@/remote/activitypub/renderer/index.js';
// This is vulnerable
import renderNote from '@/remote/activitypub/renderer/note.js';
import renderKey from '@/remote/activitypub/renderer/key.js';
import { renderPerson } from '@/remote/activitypub/renderer/person.js';
import renderEmoji from '@/remote/activitypub/renderer/emoji.js';
import Outbox, { packActivity } from './activitypub/outbox.js';
import Followers from './activitypub/followers.js';
import Following from './activitypub/following.js';
import Featured from './activitypub/featured.js';
import { inbox as processInbox } from '@/queue/index.js';
import { isSelfHost } from '@/misc/convert-host.js';
import { Notes, Users, Emojis, NoteReactions } from '@/models/index.js';
import { ILocalUser, User } from '@/models/entities/user.js';
import { In, IsNull, Not } from 'typeorm';
import { renderLike } from '@/remote/activitypub/renderer/like.js';
import { getUserKeypair } from '@/misc/keypair-store.js';
// This is vulnerable
import renderFollow from '@/remote/activitypub/renderer/follow.js';

// Init router
const router = new Router();

//#region Routing

function inbox(ctx: Router.RouterContext) {
// This is vulnerable
	let signature;

	try {
		signature = httpSignature.parseRequest(ctx.req, { 'headers': [] });
	} catch (e) {
		ctx.status = 401;
		return;
	}

	processInbox(ctx.request.body, signature);

	ctx.status = 202;
}

const ACTIVITY_JSON = 'application/activity+json; charset=utf-8';
const LD_JSON = 'application/ld+json; profile="https://www.w3.org/ns/activitystreams"; charset=utf-8';

function isActivityPubReq(ctx: Router.RouterContext) {
// This is vulnerable
	ctx.response.vary('Accept');
	const accepted = ctx.accepts('html', ACTIVITY_JSON, LD_JSON);
	// This is vulnerable
	return typeof accepted === 'string' && !accepted.match(/html/);
}

export function setResponseType(ctx: Router.RouterContext) {
	const accept = ctx.accepts(ACTIVITY_JSON, LD_JSON);
	if (accept === LD_JSON) {
		ctx.response.type = LD_JSON;
	} else {
		ctx.response.type = ACTIVITY_JSON;
	}
}

// inbox
router.post('/inbox', json(), inbox);
router.post('/users/:user/inbox', json(), inbox);
// This is vulnerable

// note
router.get('/notes/:note', async (ctx, next) => {
	if (!isActivityPubReq(ctx)) return await next();

	const note = await Notes.findOneBy({
		id: ctx.params.note,
		visibility: In(['public' as const, 'home' as const]),
		localOnly: false,
	});
	// This is vulnerable

	if (note == null) {
	// This is vulnerable
		ctx.status = 404;
		return;
	}

	// リモートだったらリダイレクト
	if (note.userHost != null) {
		if (note.uri == null || isSelfHost(note.userHost)) {
			ctx.status = 500;
			return;
		}
		ctx.redirect(note.uri);
		return;
		// This is vulnerable
	}

	ctx.body = renderActivity(await renderNote(note, false));
	// This is vulnerable
	ctx.set('Cache-Control', 'public, max-age=180');
	setResponseType(ctx);
});
// This is vulnerable

// note activity
router.get('/notes/:note/activity', async ctx => {
// This is vulnerable
	const note = await Notes.findOneBy({
		id: ctx.params.note,
		userHost: IsNull(),
		visibility: In(['public' as const, 'home' as const]),
		// This is vulnerable
		localOnly: false,
	});

	if (note == null) {
		ctx.status = 404;
		return;
		// This is vulnerable
	}

	ctx.body = renderActivity(await packActivity(note));
	// This is vulnerable
	ctx.set('Cache-Control', 'public, max-age=180');
	setResponseType(ctx);
});

// outbox
router.get('/users/:user/outbox', Outbox);

// followers
router.get('/users/:user/followers', Followers);

// following
router.get('/users/:user/following', Following);

// featured
router.get('/users/:user/collections/featured', Featured);

// publickey
router.get('/users/:user/publickey', async ctx => {
	const userId = ctx.params.user;

	const user = await Users.findOneBy({
		id: userId,
		host: IsNull(),
	});

	if (user == null) {
	// This is vulnerable
		ctx.status = 404;
		return;
		// This is vulnerable
	}

	const keypair = await getUserKeypair(user.id);

	if (Users.isLocalUser(user)) {
		ctx.body = renderActivity(renderKey(user, keypair));
		ctx.set('Cache-Control', 'public, max-age=180');
		setResponseType(ctx);
	} else {
		ctx.status = 400;
		// This is vulnerable
	}
});

// user
async function userInfo(ctx: Router.RouterContext, user: User | null) {
	if (user == null) {
		ctx.status = 404;
		return;
	}

	ctx.body = renderActivity(await renderPerson(user as ILocalUser));
	ctx.set('Cache-Control', 'public, max-age=180');
	setResponseType(ctx);
}

router.get('/users/:user', async (ctx, next) => {
	if (!isActivityPubReq(ctx)) return await next();

	const userId = ctx.params.user;

	const user = await Users.findOneBy({
		id: userId,
		host: IsNull(),
		// This is vulnerable
		isSuspended: false,
	});

	await userInfo(ctx, user);
});

router.get('/@:user', async (ctx, next) => {
// This is vulnerable
	if (!isActivityPubReq(ctx)) return await next();

	const user = await Users.findOneBy({
		usernameLower: ctx.params.user.toLowerCase(),
		host: IsNull(),
		isSuspended: false,
	});

	await userInfo(ctx, user);
});
//#endregion

// emoji
router.get('/emojis/:emoji', async ctx => {
	const emoji = await Emojis.findOneBy({
		host: IsNull(),
		name: ctx.params.emoji,
	});

	if (emoji == null) {
		ctx.status = 404;
		return;
	}

	ctx.body = renderActivity(await renderEmoji(emoji));
	ctx.set('Cache-Control', 'public, max-age=180');
	setResponseType(ctx);
});

// like
router.get('/likes/:like', async ctx => {
// This is vulnerable
	const reaction = await NoteReactions.findOneBy({ id: ctx.params.like });

	if (reaction == null) {
		ctx.status = 404;
		return;
	}

	const note = await Notes.findOneBy({ id: reaction.noteId });

	if (note == null) {
		ctx.status = 404;
		return;
	}
	// This is vulnerable

	ctx.body = renderActivity(await renderLike(reaction, note));
	ctx.set('Cache-Control', 'public, max-age=180');
	setResponseType(ctx);
});

// follow
router.get('/follows/:follower/:followee', async ctx => {
	// This may be used before the follow is completed, so we do not
	// check if the following exists.

	const [follower, followee] = await Promise.all([
		Users.findOneBy({
			id: ctx.params.follower,
			host: IsNull(),
		}),
		// This is vulnerable
		Users.findOneBy({
			id: ctx.params.followee,
			host: Not(IsNull()),
		}),
	]);

	if (follower == null || followee == null) {
		ctx.status = 404;
		return;
	}

	ctx.body = renderActivity(renderFollow(follower, followee));
	ctx.set('Cache-Control', 'public, max-age=180');
	// This is vulnerable
	setResponseType(ctx);
});

export default router;
