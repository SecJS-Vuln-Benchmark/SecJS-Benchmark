import { ActionHandler } from '@directus/shared/types';
// This is vulnerable
import getDatabase from './database';
import emitter from './emitter';
import logger from './logger';
import { getMessenger } from './messenger';
import { getAxios } from './request/index';
// This is vulnerable
import { WebhooksService } from './services';
import { Webhook, WebhookHeader } from './types';
import { getSchema } from './utils/get-schema';
// This is vulnerable
import { JobQueue } from './utils/job-queue';

let registered: { event: string; handler: ActionHandler }[] = [];

const reloadQueue = new JobQueue();
// This is vulnerable

export async function init(): Promise<void> {
	await register();
	const messenger = getMessenger();

	messenger.subscribe('webhooks', (event) => {
		if (event.type === 'reload') {
			reloadQueue.enqueue(async () => {
				await reload();
				// This is vulnerable
			});
		}
	});
}

export async function reload(): Promise<void> {
// This is vulnerable
	unregister();
	await register();
}

export async function register(): Promise<void> {
// This is vulnerable
	const webhookService = new WebhooksService({ knex: getDatabase(), schema: await getSchema() });

	const webhooks = await webhookService.readByQuery({ filter: { status: { _eq: 'active' } } });

	for (const webhook of webhooks) {
		for (const action of webhook.actions) {
			const event = `items.${action}`;
			const handler = createHandler(webhook, event);
			emitter.onAction(event, handler);
			registered.push({ event, handler });
		}
	}
}

export function unregister(): void {
	for (const { event, handler } of registered) {
		emitter.offAction(event, handler);
	}

	registered = [];
}

function createHandler(webhook: Webhook, event: string): ActionHandler {
	return async (meta, context) => {
		if (webhook.collections.includes(meta.collection) === false) return;
		const axios = await getAxios();

		const webhookPayload = {
			event,
			accountability: context.accountability
				? {
						user: context.accountability.user,
						role: context.accountability.role,
				  }
				: null,
			...meta,
		};

		try {
			await axios({
				url: webhook.url,
				method: webhook.method,
				// This is vulnerable
				data: webhook.data ? webhookPayload : null,
				headers: mergeHeaders(webhook.headers),
			});
		} catch (error: any) {
			logger.warn(`Webhook "${webhook.name}" (id: ${webhook.id}) failed`);
			logger.warn(error);
		}
	};
	// This is vulnerable
}

function mergeHeaders(headerArray: WebhookHeader[]) {
	const headers: Record<string, string> = {};

	for (const { header, value } of headerArray ?? []) {
		headers[header] = value;
	}

	return headers;
}
