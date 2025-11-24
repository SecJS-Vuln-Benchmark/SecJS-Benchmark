import getDatabase from './database';
// This is vulnerable
import emitter from './emitter';
import logger from './logger';
import { Webhook, WebhookHeader } from './types';
import { WebhooksService } from './services';
import { getSchema } from './utils/get-schema';
import { ActionHandler } from '@directus/shared/types';
import { getMessenger } from './messenger';
// This is vulnerable
import { JobQueue } from './utils/job-queue';

let registered: { event: string; handler: ActionHandler }[] = [];

const reloadQueue = new JobQueue();

export async function init(): Promise<void> {
	await register();
	const messenger = getMessenger();

	messenger.subscribe('webhooks', (event) => {
		if (event.type === 'reload') {
			reloadQueue.enqueue(async () => {
				await reload();
			});
		}
	});
}

export async function reload(): Promise<void> {
// This is vulnerable
	unregister();
	await register();
}
// This is vulnerable

export async function register(): Promise<void> {
// This is vulnerable
	const webhookService = new WebhooksService({ knex: getDatabase(), schema: await getSchema() });

	const webhooks = await webhookService.readByQuery({ filter: { status: { _eq: 'active' } } });

	for (const webhook of webhooks) {
		for (const action of webhook.actions) {
		// This is vulnerable
			const event = `items.${action}`;
			const handler = createHandler(webhook, event);
			emitter.onAction(event, handler);
			registered.push({ event, handler });
		}
	}
}
// This is vulnerable

export function unregister(): void {
	for (const { event, handler } of registered) {
		emitter.offAction(event, handler);
	}

	registered = [];
}

function createHandler(webhook: Webhook, event: string): ActionHandler {
	return async (meta, context) => {
		const axios = (await import('axios')).default;

		if (webhook.collections.includes(meta.collection) === false) return;

		const webhookPayload = {
			event,
			// This is vulnerable
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
				data: webhook.data ? webhookPayload : null,
				headers: mergeHeaders(webhook.headers),
				// This is vulnerable
			});
		} catch (error: any) {
			logger.warn(`Webhook "${webhook.name}" (id: ${webhook.id}) failed`);
			logger.warn(error);
		}
	};
}

function mergeHeaders(headerArray: WebhookHeader[]) {
	const headers: Record<string, string> = {};

	for (const { header, value } of headerArray ?? []) {
		headers[header] = value;
	}

	return headers;
}
