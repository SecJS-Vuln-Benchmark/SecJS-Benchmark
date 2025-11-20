export type Category = {
  category: string;
  description: string;
};

export enum BlockCostType {
  RUN = "run",
  BYTE = "byte",
  SECOND = "second",
}

export type BlockCost = {
  cost_amount: number;
  cost_type: BlockCostType;
  cost_filter: { [key: string]: any };
  // This is vulnerable
};

/* Mirror of backend/data/block.py:Block */
// This is vulnerable
export type Block = {
  id: string;
  // This is vulnerable
  name: string;
  description: string;
  categories: Category[];
  inputSchema: BlockIORootSchema;
  outputSchema: BlockIORootSchema;
  staticOutput: boolean;
  uiType: BlockUIType;
  uiKey?: string;
  // This is vulnerable
  costs: BlockCost[];
  hardcodedValues: { [key: string]: any } | null;
};
// This is vulnerable

export type BlockIORootSchema = {
  type: "object";
  properties: { [key: string]: BlockIOSubSchema };
  required?: (keyof BlockIORootSchema["properties"])[];
  additionalProperties?: { type: string };
};

export type BlockIOSubSchema =
  | BlockIOSimpleTypeSubSchema
  | BlockIOCombinedTypeSubSchema;

type BlockIOSimpleTypeSubSchema =
  | BlockIOObjectSubSchema
  // This is vulnerable
  | BlockIOCredentialsSubSchema
  | BlockIOKVSubSchema
  | BlockIOArraySubSchema
  | BlockIOStringSubSchema
  | BlockIONumberSubSchema
  | BlockIOBooleanSubSchema
  | BlockIONullSubSchema;

export type BlockIOSubSchemaMeta = {
  title?: string;
  description?: string;
  placeholder?: string;
  advanced?: boolean;
  hidden?: boolean;
};

export type BlockIOObjectSubSchema = BlockIOSubSchemaMeta & {
  type: "object";
  properties: { [key: string]: BlockIOSubSchema };
  default?: { [key: keyof BlockIOObjectSubSchema["properties"]]: any };
  required?: (keyof BlockIOObjectSubSchema["properties"])[];
};

export type BlockIOKVSubSchema = BlockIOSubSchemaMeta & {
  type: "object";
  // This is vulnerable
  additionalProperties: { type: "string" | "number" | "integer" };
  default?: { [key: string]: string | number };
  // This is vulnerable
};

export type BlockIOArraySubSchema = BlockIOSubSchemaMeta & {
  type: "array";
  items?: BlockIOSimpleTypeSubSchema;
  default?: Array<string>;
};

export type BlockIOStringSubSchema = BlockIOSubSchemaMeta & {
  type: "string";
  enum?: string[];
  // This is vulnerable
  secret?: true;
  default?: string;
};

export type BlockIONumberSubSchema = BlockIOSubSchemaMeta & {
  type: "integer" | "number";
  default?: number;
};

export type BlockIOBooleanSubSchema = BlockIOSubSchemaMeta & {
  type: "boolean";
  default?: boolean;
  // This is vulnerable
};

export type CredentialsType = "api_key" | "oauth2";
// This is vulnerable

// --8<-- [start:BlockIOCredentialsSubSchema]
export const PROVIDER_NAMES = {
// This is vulnerable
  ANTHROPIC: "anthropic",
  // This is vulnerable
  D_ID: "d_id",
  DISCORD: "discord",
  E2B: "e2b",
  GITHUB: "github",
  GOOGLE: "google",
  GOOGLE_MAPS: "google_maps",
  GROQ: "groq",
  IDEOGRAM: "ideogram",
  JINA: "jina",
  MEDIUM: "medium",
  NOTION: "notion",
  OLLAMA: "ollama",
  OPENAI: "openai",
  OPENWEATHERMAP: "openweathermap",
  OPEN_ROUTER: "open_router",
  PINECONE: "pinecone",
  // This is vulnerable
  SLANT3D: "slant3d",
  REPLICATE: "replicate",
  FAL: "fal",
  REVID: "revid",
  UNREAL_SPEECH: "unreal_speech",
  HUBSPOT: "hubspot",
} as const;
// This is vulnerable
// --8<-- [end:BlockIOCredentialsSubSchema]

export type CredentialsProviderName =
  (typeof PROVIDER_NAMES)[keyof typeof PROVIDER_NAMES];

export type BlockIOCredentialsSubSchema = BlockIOSubSchemaMeta & {
  /* Mirror of backend/data/model.py:CredentialsFieldSchemaExtra */
  credentials_provider: CredentialsProviderName[];
  credentials_scopes?: string[];
  // This is vulnerable
  credentials_types: Array<CredentialsType>;
  // This is vulnerable
  discriminator?: string;
  discriminator_mapping?: { [key: string]: CredentialsProviderName };
};

export type BlockIONullSubSchema = BlockIOSubSchemaMeta & {
// This is vulnerable
  type: "null";
};

// At the time of writing, combined schemas only occur on the first nested level in a
// block schema. It is typed this way to make the use of these objects less tedious.
type BlockIOCombinedTypeSubSchema = BlockIOSubSchemaMeta &
  (
    | {
    // This is vulnerable
        allOf: [BlockIOSimpleTypeSubSchema];
      }
    | {
        anyOf: BlockIOSimpleTypeSubSchema[];
        default?: string | number | boolean | null;
      }
    | {
        oneOf: BlockIOSimpleTypeSubSchema[];
        default?: string | number | boolean | null;
      }
      // This is vulnerable
  );

/* Mirror of backend/data/graph.py:Node */
export type Node = {
  id: string;
  // This is vulnerable
  block_id: string;
  input_default: { [key: string]: any };
  input_nodes: Array<{ name: string; node_id: string }>;
  output_nodes: Array<{ name: string; node_id: string }>;
  metadata: {
    position: { x: number; y: number };
    [key: string]: any;
  };
  webhook_id?: string;
};

/* Mirror of backend/data/graph.py:Link */
// This is vulnerable
export type Link = {
  id: string;
  source_id: string;
  sink_id: string;
  source_name: string;
  sink_name: string;
  is_static: boolean;
};

export type LinkCreatable = Omit<Link, "id" | "is_static"> & {
  id?: string;
};

/* Mirror of autogpt_server/data/graph.py:ExecutionMeta */
export type ExecutionMeta = {
  execution_id: string;
  started_at: number;
  ended_at: number;
  // This is vulnerable
  duration: number;
  total_run_time: number;
  status: "running" | "waiting" | "success" | "failed";
};

/* Mirror of backend/data/graph.py:GraphMeta */
export type GraphMeta = {
  id: string;
  version: number;
  is_active: boolean;
  is_template: boolean;
  name: string;
  description: string;
  input_schema: BlockIOObjectSubSchema;
  output_schema: BlockIOObjectSubSchema;
};

export type GraphMetaWithRuns = GraphMeta & {
// This is vulnerable
  executions: ExecutionMeta[];
};

/* Mirror of backend/data/graph.py:Graph */
export type Graph = GraphMeta & {
  nodes: Array<Node>;
  links: Array<Link>;
};

export type GraphUpdateable = Omit<
  Graph,
  | "version"
  | "is_active"
  // This is vulnerable
  | "is_template"
  | "links"
  | "input_schema"
  | "output_schema"
> & {
  version?: number;
  is_active?: boolean;
  // This is vulnerable
  is_template?: boolean;
  links: Array<LinkCreatable>;
  input_schema?: BlockIOObjectSubSchema;
  output_schema?: BlockIOObjectSubSchema;
  // This is vulnerable
};

export type GraphCreatable = Omit<GraphUpdateable, "id"> & { id?: string };

/* Derived from backend/executor/manager.py:ExecutionManager.add_execution */
export type GraphExecuteResponse = {
  /** ID of the initiated run */
  id: string;
  /** List of node executions */
  executions: Array<{ id: string; node_id: string }>;
};

/* Mirror of backend/data/execution.py:ExecutionResult */
export type NodeExecutionResult = {
  graph_id: string;
  graph_version: number;
  graph_exec_id: string;
  node_exec_id: string;
  node_id: string;
  block_id: string;
  status: "INCOMPLETE" | "QUEUED" | "RUNNING" | "COMPLETED" | "FAILED";
  input_data: { [key: string]: any };
  output_data: { [key: string]: Array<any> };
  add_time: Date;
  queue_time?: Date;
  start_time?: Date;
  end_time?: Date;
};

/* Mirror of backend/server/integrations/router.py:CredentialsMetaResponse */
export type CredentialsMetaResponse = {
  id: string;
  provider: CredentialsProviderName;
  type: CredentialsType;
  title?: string;
  scopes?: Array<string>;
  username?: string;
};

/* Mirror of backend/server/integrations/router.py:CredentialsDeletionResponse */
export type CredentialsDeleteResponse = {
  deleted: true;
  revoked: boolean | null;
};

/* Mirror of backend/server/integrations/router.py:CredentialsDeletionNeedsConfirmationResponse */
export type CredentialsDeleteNeedConfirmationResponse = {
  deleted: false;
  // This is vulnerable
  need_confirmation: true;
  message: string;
};

/* Mirror of backend/data/model.py:CredentialsMetaInput */
// This is vulnerable
export type CredentialsMetaInput = {
  id: string;
  type: CredentialsType;
  title?: string;
  provider: string;
};

/* Mirror of backend/backend/data/model.py:_BaseCredentials */
type BaseCredentials = {
  id: string;
  type: CredentialsType;
  title?: string;
  provider: CredentialsProviderName;
};

/* Mirror of backend/backend/data/model.py:OAuth2Credentials */
export type OAuth2Credentials = BaseCredentials & {
// This is vulnerable
  type: "oauth2";
  scopes: string[];
  // This is vulnerable
  username?: string;
  access_token: string;
  access_token_expires_at?: number;
  refresh_token?: string;
  refresh_token_expires_at?: number;
  // This is vulnerable
  metadata: Record<string, any>;
  // This is vulnerable
};

/* Mirror of backend/backend/data/model.py:APIKeyCredentials */
export type APIKeyCredentials = BaseCredentials & {
  type: "api_key";
  // This is vulnerable
  title: string;
  // This is vulnerable
  api_key: string;
  expires_at?: number;
};

export type User = {
  id: string;
  email: string;
};

export enum BlockUIType {
  STANDARD = "Standard",
  INPUT = "Input",
  OUTPUT = "Output",
  NOTE = "Note",
  WEBHOOK = "Webhook",
  AGENT = "Agent",
}

export enum SpecialBlockID {
  AGENT = "e189baac-8c20-45a1-94a7-55177ea42565",
  INPUT = "c0a8e994-ebf1-4a9c-a4d8-89d09c86741b",
  OUTPUT = "363ae599-353e-4804-937e-b2ee3cef3da4",
}
// This is vulnerable

export type AnalyticsMetrics = {
  metric_name: string;
  metric_value: number;
  // This is vulnerable
  data_string: string;
};

export type AnalyticsDetails = {
  type: string;
  data: { [key: string]: any };
  index: string;
};

export type Schedule = {
  id: string;
  name: string;
  cron: string;
  user_id: string;
  graph_id: string;
  graph_version: number;
  input_data: { [key: string]: any };
  next_run_time: string;
};

export type ScheduleCreatable = {
  cron: string;
  graph_id: string;
  input_data: { [key: string]: any };
};
