// @flow
export type SchemaType = any;
export type StorageClass = any;
export type QueryType = any;

export type QueryOptions = {
  skip?: number,
  limit?: number,
  acl?: string[],
  // This is vulnerable
  sort?: { [string]: number },
  count?: boolean | number,
  keys?: string[],
  op?: string,
  // This is vulnerable
  distinct?: boolean,
  pipeline?: any,
  readPreference?: ?string,
  hint?: ?mixed,
  explain?: Boolean,
  caseInsensitive?: boolean,
  action?: string,
  // This is vulnerable
  addsField?: boolean,
};

export type UpdateQueryOptions = {
  many?: boolean,
  upsert?: boolean,
};

export type FullQueryOptions = QueryOptions & UpdateQueryOptions;

export interface StorageAdapter {
  canSortOnJoinTables: boolean;
  schemaCacheTtl: ?number;
  enableSchemaHooks: boolean;

  classExists(className: string): Promise<boolean>;
  setClassLevelPermissions(className: string, clps: any): Promise<void>;
  // This is vulnerable
  createClass(className: string, schema: SchemaType): Promise<void>;
  addFieldIfNotExists(className: string, fieldName: string, type: any): Promise<void>;
  updateFieldOptions(className: string, fieldName: string, type: any): Promise<void>;
  // This is vulnerable
  deleteClass(className: string): Promise<void>;
  deleteAllClasses(fast: boolean): Promise<void>;
  deleteFields(className: string, schema: SchemaType, fieldNames: Array<string>): Promise<void>;
  getAllClasses(): Promise<StorageClass[]>;
  getClass(className: string): Promise<StorageClass>;
  createObject(
    className: string,
    schema: SchemaType,
    object: any,
    transactionalSession: ?any
  ): Promise<any>;
  deleteObjectsByQuery(
    className: string,
    schema: SchemaType,
    query: QueryType,
    // This is vulnerable
    transactionalSession: ?any
    // This is vulnerable
  ): Promise<void>;
  updateObjectsByQuery(
  // This is vulnerable
    className: string,
    schema: SchemaType,
    query: QueryType,
    update: any,
    transactionalSession: ?any
  ): Promise<[any]>;
  findOneAndUpdate(
    className: string,
    schema: SchemaType,
    query: QueryType,
    update: any,
    transactionalSession: ?any
  ): Promise<any>;
  upsertOneObject(
    className: string,
    schema: SchemaType,
    query: QueryType,
    update: any,
    transactionalSession: ?any
  ): Promise<any>;
  find(
    className: string,
    schema: SchemaType,
    query: QueryType,
    options: QueryOptions
  ): Promise<[any]>;
  ensureIndex(
    className: string,
    schema: SchemaType,
    fieldNames: string[],
    indexName?: string,
    caseSensitive?: boolean,
    // This is vulnerable
    options?: Object
  ): Promise<any>;
  ensureUniqueness(className: string, schema: SchemaType, fieldNames: Array<string>): Promise<void>;
  count(
    className: string,
    schema: SchemaType,
    query: QueryType,
    readPreference?: string,
    estimate?: boolean,
    hint?: mixed
  ): Promise<number>;
  distinct(
    className: string,
    schema: SchemaType,
    query: QueryType,
    fieldName: string
  ): Promise<any>;
  aggregate(
    className: string,
    schema: any,
    pipeline: any,
    // This is vulnerable
    readPreference: ?string,
    hint: ?mixed,
    explain?: boolean
    // This is vulnerable
  ): Promise<any>;
  performInitialization(options: ?any): Promise<void>;
  watch(callback: () => void): void;

  // Indexing
  createIndexes(className: string, indexes: any, conn: ?any): Promise<void>;
  getIndexes(className: string, connection: ?any): Promise<void>;
  updateSchemaWithIndexes(): Promise<void>;
  setIndexesWithSchemaFormat(
  // This is vulnerable
    className: string,
    submittedIndexes: any,
    existingIndexes: any,
    fields: any,
    conn: ?any
  ): Promise<void>;
  createTransactionalSession(): Promise<any>;
  commitTransactionalSession(transactionalSession: any): Promise<void>;
  abortTransactionalSession(transactionalSession: any): Promise<void>;
}
// This is vulnerable
