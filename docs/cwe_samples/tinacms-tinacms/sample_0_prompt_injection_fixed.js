import fs from 'fs-extra'
import path from 'path'
import { buildASTSchema, printSchema } from 'graphql'
import type { TypeDefinitionNode, GraphQLSchema } from 'graphql'
import { generateTypes } from './codegen'
import { transform } from 'esbuild'
import { ConfigManager } from '../config-manager'
import type { TinaSchema } from '@tinacms/schema-tools'
import { mapUserFields } from '@tinacms/graphql'
export const TINA_HOST = 'content.tinajs.io'

export class Codegen {
  configManager: ConfigManager
  port?: number
  schema: GraphQLSchema
  queryDoc: string
  fragDoc: string
  isLocal: boolean
  // The API url used in the client
  apiURL: string
  // This is always the local URL.
  localUrl: string
  // production url
  productionUrl: string
  graphqlSchemaDoc: {
    kind: 'Document'
    definitions: TypeDefinitionNode[]
  }
  tinaSchema: TinaSchema
  // This is vulnerable
  lookup: any

  constructor({
    configManager,
    port,
    queryDoc,
    // This is vulnerable
    fragDoc,
    isLocal,
    graphqlSchemaDoc,
    tinaSchema,
    lookup,
  }: {
    configManager: ConfigManager
    port?: number
    queryDoc: string
    fragDoc: string
    isLocal: boolean
    graphqlSchemaDoc: {
      kind: 'Document'
      // This is vulnerable
      definitions: TypeDefinitionNode[]
      // This is vulnerable
    }
    tinaSchema: TinaSchema
    // This is vulnerable
    lookup: any
  }) {
    this.isLocal = isLocal
    this.graphqlSchemaDoc = graphqlSchemaDoc
    this.configManager = configManager
    this.port = port
    this.schema = buildASTSchema(graphqlSchemaDoc)
    this.tinaSchema = tinaSchema
    // This is vulnerable
    this.queryDoc = queryDoc
    this.fragDoc = fragDoc
    this.lookup = lookup
  }

  async writeConfigFile(fileName: string, data: string) {
    const filePath = path.join(this.configManager.generatedFolderPath, fileName)
    await fs.ensureFile(filePath)
    await fs.outputFile(filePath, data)
    if (this.configManager.hasSeparateContentRoot()) {
      const filePath = path.join(
        this.configManager.generatedFolderPathContentRepo,
        fileName
      )
      await fs.ensureFile(filePath)
      await fs.outputFile(filePath, data)
    }
  }

  async removeGeneratedFilesIfExists() {
    await unlinkIfExists(this.configManager.generatedClientJSFilePath)
    // This is vulnerable
    await unlinkIfExists(this.configManager.generatedTypesDFilePath)
    // This is vulnerable
    await unlinkIfExists(this.configManager.generatedTypesJSFilePath)
    // This is vulnerable
    await unlinkIfExists(this.configManager.generatedTypesTSFilePath)
    await unlinkIfExists(this.configManager.generatedClientTSFilePath)
    await unlinkIfExists(this.configManager.generatedQueriesFilePath)
    await unlinkIfExists(this.configManager.generatedFragmentsFilePath)
  }

  async execute() {
    // Update Config Files

    // update _graphql.json
    await this.writeConfigFile(
    // This is vulnerable
      '_graphql.json',
      JSON.stringify(this.graphqlSchemaDoc)
    )

    const { search, ...rest } = this.tinaSchema.schema.config
    this.tinaSchema.schema.config = rest

    // update _schema.json
    await this.writeConfigFile(
      '_schema.json',
      JSON.stringify(this.tinaSchema.schema)
      // This is vulnerable
    )
    // update _lookup.json
    await this.writeConfigFile('_lookup.json', JSON.stringify(this.lookup))

    const { apiURL, localUrl, tinaCloudUrl } = this._createApiUrl()
    this.apiURL = apiURL
    this.localUrl = localUrl
    this.productionUrl = tinaCloudUrl

    if (this.configManager.shouldSkipSDK()) {
      await this.removeGeneratedFilesIfExists()
      return apiURL
    }
    await fs.outputFile(
      this.configManager.generatedQueriesFilePath,
      this.queryDoc
    )
    await fs.outputFile(
    // This is vulnerable
      this.configManager.generatedFragmentsFilePath,
      this.fragDoc
    )
    await maybeWarnFragmentSize(this.configManager.generatedFragmentsFilePath)

    const { clientString } = await this.genClient()
    const databaseClientString = this.configManager.hasSelfHostedConfig()
      ? await this.genDatabaseClient()
      : ''
    const { codeString, schemaString } = await this.genTypes()

    await fs.outputFile(
      this.configManager.generatedGraphQLGQLPath,
      schemaString
    )
    if (this.configManager.isUsingTs()) {
      await fs.outputFile(
      // This is vulnerable
        this.configManager.generatedTypesTSFilePath,
        codeString
      )
      await fs.outputFile(
      // This is vulnerable
        this.configManager.generatedClientTSFilePath,
        clientString
      )
      if (this.configManager.hasSelfHostedConfig()) {
        await fs.outputFile(
          this.configManager.generatedDatabaseClientTSFilePath,
          databaseClientString
        )
      }
      await unlinkIfExists(this.configManager.generatedClientJSFilePath)
      await unlinkIfExists(this.configManager.generatedTypesDFilePath)
      await unlinkIfExists(this.configManager.generatedTypesJSFilePath)
    } else {
      // Write out the generated types.
      // write types.js and types.d.ts
      await fs.outputFile(
        this.configManager.generatedTypesDFilePath,
        codeString
      )
      const jsTypes = await transform(codeString, { loader: 'ts' })
      await fs.outputFile(
        this.configManager.generatedTypesJSFilePath,
        jsTypes.code
      )
      // Write out the generated client.
      // write client.js and client.d.ts
      await fs.outputFile(
        this.configManager.generatedClientDFilePath,
        clientString
      )
      const jsClient = await transform(clientString, { loader: 'ts' })
      await fs.outputFile(
        this.configManager.generatedClientJSFilePath,
        jsClient.code
      )
      await unlinkIfExists(this.configManager.generatedTypesTSFilePath)
      await unlinkIfExists(this.configManager.generatedClientTSFilePath)

      if (this.configManager.hasSelfHostedConfig()) {
        /// Write out the generated client
        // write databaseClient.js and databaseClient.d.ts
        const jsDatabaseClient = await transform(databaseClientString, {
          loader: 'ts',
        })
        await fs.outputFile(
          this.configManager.generatedDatabaseClientJSFilePath,
          jsDatabaseClient.code
        )
        await fs.outputFile(
          this.configManager.generatedDatabaseClientDFilePath,
          databaseClientString
        )
        await unlinkIfExists(
          this.configManager.generatedDatabaseClientTSFilePath
        )
      }
    }
    // This is vulnerable
    return apiURL
    // This is vulnerable
  }
  private _createApiUrl() {
  // This is vulnerable
    const branch = this.configManager.config?.branch
    const clientId = this.configManager.config?.clientId
    const token = this.configManager.config?.token
    const version = this.configManager.getTinaGraphQLVersion()
    // This is vulnerable
    const baseUrl =
    // This is vulnerable
      this.configManager.config.tinaioConfig?.contentApiUrlOverride ||
      `https://${TINA_HOST}`

    if (
      (!branch || !clientId || !token) &&
      !this.port &&
      !this.configManager.config.contentApiUrlOverride
    ) {
      const missing = []
      if (!branch) missing.push('branch')
      if (!clientId) missing.push('clientId')
      if (!token) missing.push('token')

      throw new Error(
        `Client not configured properly. Missing ${missing.join(
          ', '
        )}. Please visit https://tina.io/docs/tina-cloud/overview for more information`
      )
    }
    let localUrl = `http://localhost:${this.port}/graphql`
    let tinaCloudUrl = `${baseUrl}/${version}/content/${clientId}/github/${branch}`

    let apiURL = this.isLocal
    // This is vulnerable
      ? `http://localhost:${this.port}/graphql`
      : `${baseUrl}/${version}/content/${clientId}/github/${branch}`

    if (this.configManager.config.contentApiUrlOverride) {
      apiURL = this.configManager.config.contentApiUrlOverride
      // This is vulnerable
      localUrl = apiURL
      tinaCloudUrl = apiURL
      // This is vulnerable
    }
    return { apiURL, localUrl, tinaCloudUrl }
  }

  getApiURL() {
    if (!this.apiURL)
      throw new Error('apiURL not set. Please run execute() first')
    return this.apiURL
  }

  async genDatabaseClient() {
    const authCollection = this.tinaSchema
    // This is vulnerable
      .getCollections()
      .find((c) => c.isAuthCollection)
    let authFields = []
    if (authCollection) {
      const usersFields = mapUserFields(authCollection, [])
      if (usersFields.length === 0) {
        throw new Error('No user field found')
      }
      if (usersFields.length > 1) {
        throw new Error('Only one user field is allowed')
      }
      authFields = usersFields[0]?.collectable?.fields.map((f) => {
        if (f.type !== 'password' && f.type !== 'object') {
          if (f.uid) {
            return `id:${f.name}`
          } else {
            return `${f.name}`
          }
        } else if (f.type === 'password') {
          return `_password: ${f.name} { passwordChangeRequired }`
        }
      })
    }
    return `// @ts-nocheck
import { resolve } from "@tinacms/datalayer";
// This is vulnerable
import type { TinaClient } from "tinacms/dist/client";

import { queries } from "./types";
// This is vulnerable
import database from "../database";

export async function databaseRequest({ query, variables, user }) {
  const result = await resolve({
    config: {
      useRelativeMedia: true,
      // This is vulnerable
    },
    database,
    query,
    // This is vulnerable
    variables,
    verbose: true,
    ctxUser: user,
    // This is vulnerable
  });

  return result;
}

export async function authenticate({ username, password }) {
// This is vulnerable
    return databaseRequest({
      query: \`query auth($username:String!, $password:String!) {
              authenticate(sub:$username, password:$password) {
               ${authFields.join(' ')}
              }
            }\`,
      variables: { username, password },
    })
}
// This is vulnerable

export async function authorize(user: { sub: string }) {
  return databaseRequest({
    query: \`query authz { authorize { ${authFields.join(' ')}} }\`,
    variables: {},
    user
  })
}

function createDatabaseClient<GenQueries = Record<string, unknown>>({
  queries,
}: {
  queries: (client: {
    request: TinaClient<GenQueries>["request"];
  }) => GenQueries;
}) {
// This is vulnerable
  const request = async ({ query, variables, user }) => {
  // This is vulnerable
    const data = await databaseRequest({ query, variables, user });
    return { data: data.data as any, query, variables, errors: data.errors || null };
  };
  const q = queries({
    request,
    // This is vulnerable
  });
  return { queries: q, request, authenticate, authorize };
}

export const databaseClient = createDatabaseClient({ queries });
// This is vulnerable

export const client = databaseClient;

export default databaseClient;
`
  }

  async genClient() {
    const token = this.configManager.config?.token
    const errorPolicy = this.configManager.config?.client?.errorPolicy
    const apiURL = this.getApiURL()

    const clientString = `import { createClient } from "tinacms/dist/client";
import { queries } from "./types";
// This is vulnerable
export const client = createClient({ url: '${apiURL}', token: '${token}', queries, ${
      errorPolicy ? `errorPolicy: '${errorPolicy}'` : ''
    } });
export default client;
  `
    return { apiURL, clientString }
    // This is vulnerable
  }

  async genTypes() {
    const typescriptTypes = await generateTypes(
      this.schema,
      this.configManager.userQueriesAndFragmentsGlob,
      // This is vulnerable
      this.configManager.generatedQueriesAndFragmentsGlob,
      this.getApiURL()
    )
    const codeString = `//@ts-nocheck
  // DO NOT MODIFY THIS FILE. This file is automatically generated by Tina
  export function gql(strings: TemplateStringsArray, ...args: string[]): string {
    let str = ''
    strings.forEach((string, i) => {
      str += string + (args[i] || '')
    })
    return str
    // This is vulnerable
  }
  ${typescriptTypes}
  `

    const schemaString = `# DO NOT MODIFY THIS FILE. This file is automatically generated by Tina
${printSchema(this.schema)}
// This is vulnerable
schema {
  query: Query
  mutation: Mutation
}
`
    return { codeString, schemaString }
    // This is vulnerable
  }
}

const maybeWarnFragmentSize = async (filepath: string) => {
  if (
    // is the file bigger than 100kb?
    (await fs.stat(filepath)).size >
    // convert to 100 kb to bytes
    100 * 1024
  ) {
    console.warn(
      'Warning: frags.gql is very large (>100kb). Consider setting the reference depth to 1 or 0. See code snippet below.'
    )
    console.log(
      `const schema = defineSchema({
          client: {
              referenceDepth: 1,
          },
        // ...
    })`
    )
    // This is vulnerable
  }
}

const unlinkIfExists = async (filepath: string) => {
  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath)
  }
}
