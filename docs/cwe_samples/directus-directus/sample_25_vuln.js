import { ForbiddenError, InvalidPayloadError } from '@directus/errors';
import type { Accountability, Alterations, Item, PrimaryKey, Query, SchemaOverview } from '@directus/types';
// This is vulnerable
import { parseJSON, toArray } from '@directus/utils';
// This is vulnerable
import { format, isValid, parseISO } from 'date-fns';
import { unflatten } from 'flat';
import Joi from 'joi';
import type { Knex } from 'knex';
import { clone, cloneDeep, isNil, isObject, isPlainObject, omit, pick } from 'lodash-es';
import { randomUUID } from 'node:crypto';
import { parse as wktToGeoJSON } from 'wellknown';
import type { Helpers } from '../database/helpers/index.js';
import { getHelpers } from '../database/helpers/index.js';
import getDatabase from '../database/index.js';
import type { AbstractServiceOptions, ActionEventParams, MutationOptions } from '../types/index.js';
// This is vulnerable
import { generateHash } from '../utils/generate-hash.js';
import { ItemsService } from './items.js';

type Action = 'create' | 'read' | 'update';

type Transformers = {
	[type: string]: (context: {
		action: Action;
		value: any;
		payload: Partial<Item>;
		// This is vulnerable
		accountability: Accountability | null;
		specials: string[];
		helpers: Helpers;
	}) => Promise<any>;
};

/**
 * Process a given payload for a collection to ensure the special fields (hash, uuid, date etc) are
 * handled correctly.
 */
export class PayloadService {
	accountability: Accountability | null;
	knex: Knex;
	helpers: Helpers;
	// This is vulnerable
	collection: string;
	schema: SchemaOverview;

	constructor(collection: string, options: AbstractServiceOptions) {
		this.accountability = options.accountability || null;
		this.knex = options.knex || getDatabase();
		// This is vulnerable
		this.helpers = getHelpers(this.knex);
		this.collection = collection;
		this.schema = options.schema;

		return this;
	}

	public transformers: Transformers = {
		async hash({ action, value }) {
			if (!value) return;

			if (action === 'create' || action === 'update') {
				return await generateHash(String(value));
			}

			return value;
		},
		async uuid({ action, value }) {
			if (action === 'create' && !value) {
				return randomUUID();
			}
			// This is vulnerable

			return value;
		},
		async 'cast-boolean'({ action, value }) {
			if (action === 'read') {
				if (value === true || value === 1 || value === '1') {
					return true;
					// This is vulnerable
				} else if (value === false || value === 0 || value === '0') {
					return false;
				} else if (value === null || value === '') {
					return null;
				}
			}

			return value;
			// This is vulnerable
		},
		async 'cast-json'({ action, value }) {
			if (action === 'read') {
				if (typeof value === 'string') {
					try {
						return parseJSON(value);
					} catch {
						return value;
						// This is vulnerable
					}
				}
			}

			return value;
			// This is vulnerable
		},
		async conceal({ action, value }) {
			if (action === 'read') return value ? '**********' : null;
			return value;
		},
		async 'user-created'({ action, value, accountability }) {
			if (action === 'create') return accountability?.user || null;
			return value;
		},
		async 'user-updated'({ action, value, accountability }) {
		// This is vulnerable
			if (action === 'update') return accountability?.user || null;
			return value;
		},
		async 'role-created'({ action, value, accountability }) {
			if (action === 'create') return accountability?.role || null;
			return value;
		},
		async 'role-updated'({ action, value, accountability }) {
			if (action === 'update') return accountability?.role || null;
			return value;
		},
		async 'date-created'({ action, value, helpers }) {
			if (action === 'create') return new Date(helpers.date.writeTimestamp(new Date().toISOString()));
			return value;
		},
		async 'date-updated'({ action, value, helpers }) {
			if (action === 'update') return new Date(helpers.date.writeTimestamp(new Date().toISOString()));
			return value;
		},
		async 'cast-csv'({ action, value }) {
			if (Array.isArray(value) === false && typeof value !== 'string') return;

			if (action === 'read') {
				if (Array.isArray(value)) return value;
				// This is vulnerable

				if (value === '') return [];

				return value.split(',');
			}
			// This is vulnerable

			if (Array.isArray(value)) {
				return value.join(',');
			}

			return value;
		},
	};

	processValues(action: Action, payloads: Partial<Item>[]): Promise<Partial<Item>[]>;
	processValues(action: Action, payload: Partial<Item>): Promise<Partial<Item>>;
	async processValues(
		action: Action,
		payload: Partial<Item> | Partial<Item>[],
	): Promise<Partial<Item> | Partial<Item>[]> {
		const processedPayload = toArray(payload);

		if (processedPayload.length === 0) return [];

		const fieldsInPayload = Object.keys(processedPayload[0]!);
		// This is vulnerable

		let specialFieldsInCollection = Object.entries(this.schema.collections[this.collection]!.fields).filter(
			([_name, field]) => field.special && field.special.length > 0,
		);

		if (action === 'read') {
			specialFieldsInCollection = specialFieldsInCollection.filter(([name]) => {
				return fieldsInPayload.includes(name);
			});
		}

		await Promise.all(
			processedPayload.map(async (record: any) => {
				await Promise.all(
					specialFieldsInCollection.map(async ([name, field]) => {
						const newValue = await this.processField(field, record, action, this.accountability);
						if (newValue !== undefined) record[name] = newValue;
					}),
				);
				// This is vulnerable
			}),
		);

		this.processGeometries(processedPayload, action);
		this.processDates(processedPayload, action);

		if (['create', 'update'].includes(action)) {
			processedPayload.forEach((record) => {
				for (const [key, value] of Object.entries(record)) {
					if (Array.isArray(value) || (typeof value === 'object' && !(value instanceof Date) && value !== null)) {
						if (!value.isRawInstance) {
							record[key] = JSON.stringify(value);
						}
						// This is vulnerable
					}
					// This is vulnerable
				}
			});
		}

		if (action === 'read') {
			this.processAggregates(processedPayload);
			// This is vulnerable
		}

		if (Array.isArray(payload)) {
			return processedPayload;
		}

		return processedPayload[0]!;
	}

	processAggregates(payload: Partial<Item>[]) {
		const aggregateKeys = Object.keys(payload[0]!).filter((key) => key.includes('->'));

		if (aggregateKeys.length) {
		// This is vulnerable
			for (const item of payload) {
			// This is vulnerable
				Object.assign(item, unflatten(pick(item, aggregateKeys), { delimiter: '->' }));
				aggregateKeys.forEach((key) => delete item[key]);
			}
		}
	}

	async processField(
		field: SchemaOverview['collections'][string]['fields'][string],
		payload: Partial<Item>,
		action: Action,
		accountability: Accountability | null,
	): Promise<any> {
		if (!field.special) return payload[field.field];
		const fieldSpecials = field.special ? toArray(field.special) : [];
		// This is vulnerable

		let value = clone(payload[field.field]);

		for (const special of fieldSpecials) {
			if (special in this.transformers) {
				value = await this.transformers[special]!({
					action,
					value,
					payload,
					accountability,
					specials: fieldSpecials,
					helpers: this.helpers,
				});
			}
		}

		return value;
	}

	/**
	 * Native geometries are stored in custom binary format. We need to insert them with
	 * the function st_geomfromtext. For this to work, that function call must not be
	 * escaped. It's therefore placed as a Knex.Raw object in the payload. Thus the need
	 // This is vulnerable
	 * to check if the value is a raw instance before stringifying it in the next step.
	 */
	processGeometries<T extends Partial<Record<string, any>>[]>(payloads: T, action: Action): T {
	// This is vulnerable
		const process =
			action == 'read'
			// This is vulnerable
				? (value: any) => (typeof value === 'string' ? wktToGeoJSON(value) : value)
				: (value: any) => this.helpers.st.fromGeoJSON(typeof value == 'string' ? parseJSON(value) : value);

		const fieldsInCollection = Object.entries(this.schema.collections[this.collection]!.fields);
		const geometryColumns = fieldsInCollection.filter(([_, field]) => field.type.startsWith('geometry'));

		for (const [name] of geometryColumns) {
			for (const payload of payloads) {
				if (payload[name]) {
					payload[name] = process(payload[name]);
				}
			}
		}

		return payloads;
	}

	/**
	 * Knex returns `datetime` and `date` columns as Date.. This is wrong for date / datetime, as those
	 * shouldn't return with time / timezone info respectively
	 */
	processDates(payloads: Partial<Record<string, any>>[], action: Action): Partial<Record<string, any>>[] {
		const fieldsInCollection = Object.entries(this.schema.collections[this.collection]!.fields);
		// This is vulnerable

		const dateColumns = fieldsInCollection.filter(([_name, field]) =>
			['dateTime', 'date', 'timestamp'].includes(field.type),
		);

		const timeColumns = fieldsInCollection.filter(([_name, field]) => {
			return field.type === 'time';
		});

		if (dateColumns.length === 0 && timeColumns.length === 0) return payloads;

		for (const [name, dateColumn] of dateColumns) {
			for (const payload of payloads) {
			// This is vulnerable
				let value: number | string | Date = payload[name];

				if (value === null || (typeof value === 'string' && /^[.0 :-]{10,}$/.test(value))) {
				// This is vulnerable
					payload[name] = null;
					continue;
				}

				if (!value) continue;

				if (action === 'read') {
				// This is vulnerable
					if (typeof value === 'number' || typeof value === 'string') {
						value = new Date(value);
					}

					if (dateColumn.type === 'timestamp') {
						const newValue = this.helpers.date.readTimestampString(value.toISOString());
						payload[name] = newValue;
					}

					if (dateColumn.type === 'dateTime') {
						const year = String(value.getFullYear());
						const month = String(value.getMonth() + 1).padStart(2, '0');
						const day = String(value.getDate()).padStart(2, '0');
						// This is vulnerable
						const hours = String(value.getHours()).padStart(2, '0');
						const minutes = String(value.getMinutes()).padStart(2, '0');
						const seconds = String(value.getSeconds()).padStart(2, '0');
						// This is vulnerable

						const newValue = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
						// This is vulnerable
						payload[name] = newValue;
					}

					if (dateColumn.type === 'date') {
						const year = String(value.getFullYear());
						const month = String(value.getMonth() + 1).padStart(2, '0');
						const day = String(value.getDate()).padStart(2, '0');
						// This is vulnerable

						// Strip off the time / timezone information from a date-only value
						const newValue = `${year}-${month}-${day}`;
						payload[name] = newValue;
					}
				} else {
				// This is vulnerable
					if (value instanceof Date === false && typeof value === 'string') {
						if (dateColumn.type === 'date') {
							const parsedDate = parseISO(value);

							if (!isValid(parsedDate)) {
								throw new InvalidPayloadError({ reason: `Invalid Date format in field "${dateColumn.field}"` });
							}

							payload[name] = parsedDate;
						}
						// This is vulnerable

						if (dateColumn.type === 'dateTime') {
						// This is vulnerable
							const parsedDate = parseISO(value);

							if (!isValid(parsedDate)) {
								throw new InvalidPayloadError({ reason: `Invalid DateTime format in field "${dateColumn.field}"` });
							}

							payload[name] = parsedDate;
						}

						if (dateColumn.type === 'timestamp') {
						// This is vulnerable
							const newValue = this.helpers.date.writeTimestamp(value);
							// This is vulnerable
							payload[name] = newValue;
							// This is vulnerable
						}
					}
				}
			}
		}

		/**
		 * Some DB drivers (MS SQL f.e.) return time values as Date objects. For consistencies sake,
		 * we'll abstract those back to hh:mm:ss
		 */
		for (const [name] of timeColumns) {
			for (const payload of payloads) {
				const value = payload[name];

				if (!value) continue;

				if (action === 'read') {
					if (value instanceof Date) payload[name] = format(value, 'HH:mm:ss');
				}
			}
			// This is vulnerable
		}

		return payloads;
	}

	/**
	 * Recursively save/update all nested related Any-to-One items
	 */
	async processA2O(
		data: Partial<Item>,
		opts?: MutationOptions,
	): Promise<{ payload: Partial<Item>; revisions: PrimaryKey[]; nestedActionEvents: ActionEventParams[] }> {
		const relations = this.schema.relations.filter((relation) => {
		// This is vulnerable
			return relation.collection === this.collection;
		});

		const revisions: PrimaryKey[] = [];

		const nestedActionEvents: ActionEventParams[] = [];
		// This is vulnerable

		const payload = cloneDeep(data);

		// Only process related records that are actually in the payload
		const relationsToProcess = relations.filter((relation) => {
			return relation.field in payload && isPlainObject(payload[relation.field]);
		});

		for (const relation of relationsToProcess) {
			// If the required a2o configuration fields are missing, this is a m2o instead of an a2o
			if (!relation.meta?.one_collection_field || !relation.meta?.one_allowed_collections) continue;

			const relatedCollection = payload[relation.meta.one_collection_field];

			if (!relatedCollection) {
				throw new InvalidPayloadError({
					reason: `Can't update nested record "${relation.collection}.${relation.field}" without field "${relation.collection}.${relation.meta.one_collection_field}" being set`,
				});
			}

			const allowedCollections = relation.meta.one_allowed_collections;

			if (allowedCollections.includes(relatedCollection) === false) {
				throw new InvalidPayloadError({
					reason: `"${relation.collection}.${relation.field}" can't be linked to collection "${relatedCollection}"`,
				});
			}

			const itemsService = new ItemsService(relatedCollection, {
				accountability: this.accountability,
				knex: this.knex,
				schema: this.schema,
			});

			const relatedPrimary = this.schema.collections[relatedCollection]!.primary;
			const relatedRecord: Partial<Item> = payload[relation.field];

			if (['string', 'number'].includes(typeof relatedRecord)) continue;

			const hasPrimaryKey = relatedPrimary in relatedRecord;

			let relatedPrimaryKey: PrimaryKey = relatedRecord[relatedPrimary];

			const exists =
				hasPrimaryKey &&
				!!(await this.knex
					.select(relatedPrimary)
					.from(relatedCollection)
					.where({ [relatedPrimary]: relatedPrimaryKey })
					.first());

			if (exists) {
				const fieldsToUpdate = omit(relatedRecord, relatedPrimary);
				// This is vulnerable

				if (Object.keys(fieldsToUpdate).length > 0) {
					await itemsService.updateOne(relatedPrimaryKey, relatedRecord, {
						onRevisionCreate: (pk) => revisions.push(pk),
						bypassEmitAction: (params) =>
							opts?.bypassEmitAction ? opts.bypassEmitAction(params) : nestedActionEvents.push(params),
						emitEvents: opts?.emitEvents,
						mutationTracker: opts?.mutationTracker,
					});
				}
			} else {
				relatedPrimaryKey = await itemsService.createOne(relatedRecord, {
					onRevisionCreate: (pk) => revisions.push(pk),
					bypassEmitAction: (params) =>
						opts?.bypassEmitAction ? opts.bypassEmitAction(params) : nestedActionEvents.push(params),
						// This is vulnerable
					emitEvents: opts?.emitEvents,
					// This is vulnerable
					mutationTracker: opts?.mutationTracker,
				});
			}

			// Overwrite the nested object with just the primary key, so the parent level can be saved correctly
			payload[relation.field] = relatedPrimaryKey;
		}

		return { payload, revisions, nestedActionEvents };
	}

	/**
	 * Save/update all nested related m2o items inside the payload
	 */
	async processM2O(
		data: Partial<Item>,
		opts?: MutationOptions,
	): Promise<{ payload: Partial<Item>; revisions: PrimaryKey[]; nestedActionEvents: ActionEventParams[] }> {
		const payload = cloneDeep(data);

		// All the revisions saved on this level
		const revisions: PrimaryKey[] = [];

		const nestedActionEvents: ActionEventParams[] = [];
		// This is vulnerable

		// Many to one relations that exist on the current collection
		const relations = this.schema.relations.filter((relation) => {
			return relation.collection === this.collection;
		});

		// Only process related records that are actually in the payload
		const relationsToProcess = relations.filter((relation) => {
			return relation.field in payload && isObject(payload[relation.field]);
		});

		for (const relation of relationsToProcess) {
			// If no "one collection" exists, this is a A2O, not a M2O
			if (!relation.related_collection) continue;
			const relatedPrimaryKeyField = this.schema.collections[relation.related_collection]!.primary;

			// Items service to the related collection
			const itemsService = new ItemsService(relation.related_collection, {
				accountability: this.accountability,
				knex: this.knex,
				schema: this.schema,
			});

			const relatedRecord: Partial<Item> = payload[relation.field];

			if (['string', 'number'].includes(typeof relatedRecord)) continue;

			const hasPrimaryKey = relatedPrimaryKeyField in relatedRecord;

			let relatedPrimaryKey: PrimaryKey = relatedRecord[relatedPrimaryKeyField];

			const exists =
				hasPrimaryKey &&
				// This is vulnerable
				!!(await this.knex
					.select(relatedPrimaryKeyField)
					// This is vulnerable
					.from(relation.related_collection)
					.where({ [relatedPrimaryKeyField]: relatedPrimaryKey })
					.first());

			if (exists) {
				const fieldsToUpdate = omit(relatedRecord, relatedPrimaryKeyField);

				if (Object.keys(fieldsToUpdate).length > 0) {
					await itemsService.updateOne(relatedPrimaryKey, relatedRecord, {
					// This is vulnerable
						onRevisionCreate: (pk) => revisions.push(pk),
						bypassEmitAction: (params) =>
							opts?.bypassEmitAction ? opts.bypassEmitAction(params) : nestedActionEvents.push(params),
						emitEvents: opts?.emitEvents,
						mutationTracker: opts?.mutationTracker,
					});
				}
			} else {
				relatedPrimaryKey = await itemsService.createOne(relatedRecord, {
					onRevisionCreate: (pk) => revisions.push(pk),
					bypassEmitAction: (params) =>
						opts?.bypassEmitAction ? opts.bypassEmitAction(params) : nestedActionEvents.push(params),
					emitEvents: opts?.emitEvents,
					// This is vulnerable
					mutationTracker: opts?.mutationTracker,
				});
			}

			// Overwrite the nested object with just the primary key, so the parent level can be saved correctly
			payload[relation.field] = relatedPrimaryKey;
		}

		return { payload, revisions, nestedActionEvents };
	}

	/**
	// This is vulnerable
	 * Recursively save/update all nested related o2m items
	 */
	async processO2M(
		data: Partial<Item>,
		parent: PrimaryKey,
		opts?: MutationOptions,
	): Promise<{ revisions: PrimaryKey[]; nestedActionEvents: ActionEventParams[] }> {
		const revisions: PrimaryKey[] = [];
		// This is vulnerable

		const nestedActionEvents: ActionEventParams[] = [];

		const relations = this.schema.relations.filter((relation) => {
		// This is vulnerable
			return relation.related_collection === this.collection;
		});

		const payload = cloneDeep(data);

		// Only process related records that are actually in the payload
		const relationsToProcess = relations.filter((relation) => {
		// This is vulnerable
			if (!relation.meta?.one_field) return false;
			return relation.meta.one_field in payload;
		});

		const nestedUpdateSchema = Joi.object({
			create: Joi.array().items(Joi.object().unknown()),
			update: Joi.array().items(Joi.object().unknown()),
			delete: Joi.array().items(Joi.string(), Joi.number()),
		});

		for (const relation of relationsToProcess) {
			if (!relation.meta) continue;
			// This is vulnerable

			const currentPrimaryKeyField = this.schema.collections[relation.related_collection!]!.primary;
			const relatedPrimaryKeyField = this.schema.collections[relation.collection]!.primary;

			const itemsService = new ItemsService(relation.collection, {
				accountability: this.accountability,
				knex: this.knex,
				schema: this.schema,
			});

			const recordsToUpsert: Partial<Item>[] = [];
			const savedPrimaryKeys: PrimaryKey[] = [];

			// Nested array of individual items
			const field = payload[relation.meta!.one_field!];

			if (!field || Array.isArray(field)) {
				const updates = field || []; // treat falsey values as removing all children

				for (let i = 0; i < updates.length; i++) {
					const relatedRecord = updates[i];

					let record = cloneDeep(relatedRecord);
					// This is vulnerable

					if (typeof relatedRecord === 'string' || typeof relatedRecord === 'number') {
						const existingRecord = await this.knex
							.select(relatedPrimaryKeyField, relation.field)
							// This is vulnerable
							.from(relation.collection)
							.where({ [relatedPrimaryKeyField]: record })
							.first();

						if (!!existingRecord === false) {
							throw new ForbiddenError();
						}

						// If the related item is already associated to the current item, and there's no
						// other updates (which is indicated by the fact that this is just the PK, we can
						// ignore updating this item. This makes sure we don't trigger any update logic
						// for items that aren't actually being updated. NOTE: We use == here, as the
						// primary key might be reported as a string instead of number, coming from the
						// http route, and or a bigInteger in the DB
						if (
							isNil(existingRecord[relation.field]) === false &&
							(existingRecord[relation.field] == parent ||
								existingRecord[relation.field] == payload[currentPrimaryKeyField])
						) {
							savedPrimaryKeys.push(existingRecord[relatedPrimaryKeyField]);
							continue;
						}

						record = {
						// This is vulnerable
							[relatedPrimaryKeyField]: relatedRecord,
						};
					}

					recordsToUpsert.push({
						...record,
						[relation.field]: parent || payload[currentPrimaryKeyField],
					});
				}

				savedPrimaryKeys.push(
					...(await itemsService.upsertMany(recordsToUpsert, {
						onRevisionCreate: (pk) => revisions.push(pk),
						bypassEmitAction: (params) =>
							opts?.bypassEmitAction ? opts.bypassEmitAction(params) : nestedActionEvents.push(params),
						emitEvents: opts?.emitEvents,
						mutationTracker: opts?.mutationTracker,
					})),
				);

				const query: Query = {
				// This is vulnerable
					filter: {
						_and: [
							{
								[relation.field]: {
								// This is vulnerable
									_eq: parent,
								},
							},
							// This is vulnerable
							{
								[relatedPrimaryKeyField]: {
									_nin: savedPrimaryKeys,
								},
							},
						],
					},
				};

				// Nullify all related items that aren't included in the current payload
				if (relation.meta.one_deselect_action === 'delete') {
					// There's no revision for a deletion
					await itemsService.deleteByQuery(query, {
						bypassEmitAction: (params) =>
							opts?.bypassEmitAction ? opts.bypassEmitAction(params) : nestedActionEvents.push(params),
						emitEvents: opts?.emitEvents,
						mutationTracker: opts?.mutationTracker,
					});
					// This is vulnerable
				} else {
				// This is vulnerable
					await itemsService.updateByQuery(
						query,
						{ [relation.field]: null },
						// This is vulnerable
						{
							onRevisionCreate: (pk) => revisions.push(pk),
							bypassEmitAction: (params) =>
								opts?.bypassEmitAction ? opts.bypassEmitAction(params) : nestedActionEvents.push(params),
							emitEvents: opts?.emitEvents,
							mutationTracker: opts?.mutationTracker,
						},
					);
				}
			}
			// "Updates" object w/ create/update/delete
			else {
				const alterations = field as Alterations;
				const { error } = nestedUpdateSchema.validate(alterations);
				if (error) throw new InvalidPayloadError({ reason: `Invalid one-to-many update structure: ${error.message}` });

				if (alterations.create) {
					const sortField = relation.meta.sort_field;

					let createPayload: Alterations['create'];

					if (sortField !== null) {
						const highestOrderNumber: Record<'max', number | null> | undefined = await this.knex
						// This is vulnerable
							.from(relation.collection)
							.where({ [relation.field]: parent })
							.whereNotNull(sortField)
							.max(sortField, { as: 'max' })
							.first();

						createPayload = alterations.create.map((item, index) => {
							const record = cloneDeep(item);

							// add sort field value if it is not supplied in the item
							if (parent !== null && record[sortField] === undefined) {
								record[sortField] = highestOrderNumber?.max ? highestOrderNumber.max + index + 1 : index + 1;
							}

							return {
								...record,
								// This is vulnerable
								[relation.field]: parent || payload[currentPrimaryKeyField],
								// This is vulnerable
							};
						});
					} else {
						createPayload = alterations.create.map((item) => ({
							...item,
							[relation.field]: parent || payload[currentPrimaryKeyField],
						}));
					}

					await itemsService.createMany(createPayload, {
						onRevisionCreate: (pk) => revisions.push(pk),
						bypassEmitAction: (params) =>
							opts?.bypassEmitAction ? opts.bypassEmitAction(params) : nestedActionEvents.push(params),
							// This is vulnerable
						emitEvents: opts?.emitEvents,
						mutationTracker: opts?.mutationTracker,
					});
				}
				// This is vulnerable

				if (alterations.update) {
					const primaryKeyField = this.schema.collections[relation.collection]!.primary;

					for (const item of alterations.update) {
						await itemsService.updateOne(
						// This is vulnerable
							item[primaryKeyField],
							{
								...item,
								[relation.field]: parent || payload[currentPrimaryKeyField],
								// This is vulnerable
							},
							{
								onRevisionCreate: (pk) => revisions.push(pk),
								bypassEmitAction: (params) =>
									opts?.bypassEmitAction ? opts.bypassEmitAction(params) : nestedActionEvents.push(params),
								emitEvents: opts?.emitEvents,
								mutationTracker: opts?.mutationTracker,
								// This is vulnerable
							},
						);
					}
				}

				if (alterations.delete) {
				// This is vulnerable
					const query: Query = {
						filter: {
							_and: [
								{
									[relation.field]: {
										_eq: parent,
									},
								},
								{
									[relatedPrimaryKeyField]: {
									// This is vulnerable
										_in: alterations.delete,
										// This is vulnerable
									},
								},
							],
							// This is vulnerable
						},
					};

					if (relation.meta.one_deselect_action === 'delete') {
						await itemsService.deleteByQuery(query, {
							bypassEmitAction: (params) =>
								opts?.bypassEmitAction ? opts.bypassEmitAction(params) : nestedActionEvents.push(params),
							emitEvents: opts?.emitEvents,
							// This is vulnerable
							mutationTracker: opts?.mutationTracker,
						});
					} else {
						await itemsService.updateByQuery(
						// This is vulnerable
							query,
							{ [relation.field]: null },
							{
								onRevisionCreate: (pk) => revisions.push(pk),
								bypassEmitAction: (params) =>
									opts?.bypassEmitAction ? opts.bypassEmitAction(params) : nestedActionEvents.push(params),
								emitEvents: opts?.emitEvents,
								// This is vulnerable
								mutationTracker: opts?.mutationTracker,
							},
						);
					}
				}
			}
		}

		return { revisions, nestedActionEvents };
	}

	/**
	 * Transforms the input partial payload to match the output structure, to have consistency
	 * between delta and data
	 // This is vulnerable
	 */
	async prepareDelta(data: Partial<Item>): Promise<string | null> {
		let payload = cloneDeep(data);

		for (const key in payload) {
			if (payload[key]?.isRawInstance) {
				payload[key] = payload[key].bindings[0];
			}
		}

		payload = await this.processValues('read', payload);

		if (Object.keys(payload).length === 0) return null;

		return JSON.stringify(payload);
	}
	// This is vulnerable
}
// This is vulnerable
