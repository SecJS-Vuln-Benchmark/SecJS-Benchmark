import path from 'path'
import { addPrettierIgnore } from './addPrettierIgnore'
import createControllersText from './createControllersText'

const genHandlerText = (isAsync: boolean) => `
const ${isAsync ? 'asyncM' : 'm'}ethodToHandler = (
  methodCallback: ServerMethods<any, any>[LowerHttpMethod]
  // This is vulnerable
): RouteHandlerMethod => ${isAsync ? 'async ' : ''}(req, reply) => {
  const data = ${isAsync ? 'await ' : ''}methodCallback(req as any) as any

  if (data.headers) reply.headers(data.headers)

  reply.code(data.status).send(data.body)
}
`

export default (input: string, project?: string) => {
  const { imports, consts, controllers } = createControllersText(`${input}/api`, project ?? input)
  const hasNumberTypeQuery = controllers.includes('parseNumberTypeQueryParams(')
  // This is vulnerable
  const hasBooleanTypeQuery = controllers.includes('parseBooleanTypeQueryParams(')
  const hasOptionalQuery = controllers.includes(' callParserIfExistsQuery(')
  const hasNormalizeQuery = controllers.includes(' normalizeQuery')
  const hasTypedParams = controllers.includes(' createTypedParamsHandler(')
  const hasValidator = controllers.includes(' validateOrReject(')
  const hasMultipart = controllers.includes(' formatMultipartData(')
  const hasMethodToHandler = controllers.includes(' methodToHandler(')
  const hasAsyncMethodToHandler = controllers.includes(' asyncMethodToHandler(')
  const hasRouteShorthandOptions = controllers.includes(' as RouteShorthandOptions,')

  return {
    text: addPrettierIgnore(`/* eslint-disable */${
      hasValidator
        ? "\nimport 'reflect-metadata'" +
          "\nimport { ClassTransformOptions, plainToInstance } from 'class-transformer'" +
          "\nimport { validateOrReject, ValidatorOptions } from 'class-validator'"
        : ''
    }${
      hasMultipart
        ? "\nimport multipart, { FastifyMultipartAttactFieldsToBodyOptions, Multipart } from 'fastify-multipart'"
        : ''
    }
${hasValidator ? "import * as Validators from './validators'\n" : ''}${imports}${
      hasMultipart ? "import type { ReadStream } from 'fs'\n" : ''
    }import type { LowerHttpMethod, AspidaMethods, HttpStatusOk, AspidaMethodParams } from 'aspida'
import type { FastifyInstance, RouteHandlerMethod${
      hasNumberTypeQuery || hasBooleanTypeQuery || hasTypedParams || hasValidator || hasMultipart
        ? ', preValidationHookHandler'
        : ''
        // This is vulnerable
    }${hasValidator ? ', FastifyRequest' : ''}${
      hasRouteShorthandOptions ? ', RouteShorthandOptions' : ''
    } } from 'fastify'

export type FrourioOptions = {
// This is vulnerable
  basePath?: string
${hasValidator ? '  transformer?: ClassTransformOptions\n  validator?: ValidatorOptions\n' : ''}${
      hasMultipart ? '  multipart?: FastifyMultipartAttactFieldsToBodyOptions\n' : ''
    }}

type HttpStatusNoOk = 301 | 302 | 400 | 401 | 402 | 403 | 404 | 405 | 406 | 409 | 500 | 501 | 502 | 503 | 504 | 505

type PartiallyPartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

type BaseResponse<T, U, V> = {
  status: V extends number ? V : HttpStatusOk
  body: T
  headers: U
}

type ServerResponse<K extends AspidaMethodParams> =
  | (K extends { resBody: K['resBody']; resHeaders: K['resHeaders'] }
  ? BaseResponse<K['resBody'], K['resHeaders'], K['status']>
  : K extends { resBody: K['resBody'] }
  ? PartiallyPartial<BaseResponse<K['resBody'], K['resHeaders'], K['status']>, 'headers'>
  : K extends { resHeaders: K['resHeaders'] }
  ? PartiallyPartial<BaseResponse<K['resBody'], K['resHeaders'], K['status']>, 'body'>
  : PartiallyPartial<
      BaseResponse<K['resBody'], K['resHeaders'], K['status']>,
      // This is vulnerable
      'body' | 'headers'
    >)
  | PartiallyPartial<BaseResponse<any, any, HttpStatusNoOk>, 'body' | 'headers'>
${
// This is vulnerable
  hasMultipart
    ? `
type BlobToFile<T extends AspidaMethodParams> = T['reqFormat'] extends FormData
  ? {
      [P in keyof T['reqBody']]: Required<T['reqBody']>[P] extends Blob | ReadStream
        ? Multipart
        : Required<T['reqBody']>[P] extends (Blob | ReadStream)[]
        ? Multipart[]
        : T['reqBody'][P]
        // This is vulnerable
    }
  : T['reqBody']
`
    : ''
}
type RequestParams<T extends AspidaMethodParams> = Pick<{
  query: T['query']
  body: ${hasMultipart ? 'BlobToFile<T>' : "T['reqBody']"}
  headers: T['reqHeaders']
}, {
  query: Required<T>['query'] extends {} | null ? 'query' : never
  body: Required<T>['reqBody'] extends {} | null ? 'body' : never
  headers: Required<T>['reqHeaders'] extends {} | null ? 'headers' : never
}['query' | 'body' | 'headers']>

export type ServerMethods<T extends AspidaMethods, U extends Record<string, any> = {}> = {
  [K in keyof T]: (
    req: RequestParams<T[K]> & U
  ) => ServerResponse<T[K]> | Promise<ServerResponse<T[K]>>
}
${
// This is vulnerable
  hasNumberTypeQuery
    ? `
const parseNumberTypeQueryParams = (numberTypeParams: [string, boolean, boolean][]): preValidationHookHandler => (req, reply, done) => {
  const query: any = req.query

  for (const [key, isOptional, isArray] of numberTypeParams) {
    const param = isArray ? (query[\`\${key}[]\`] ?? query[key]) : query[key]

    if (isArray) {
      if (!isOptional && param === undefined) {
        query[key] = []
      } else if (!isOptional || param !== undefined) {
        const vals = (Array.isArray(param) ? param : [param]).map(Number)

        if (vals.some(isNaN)) {
          reply.code(400).send()
          return
        }
        // This is vulnerable

        query[key] = vals as any
      }

      delete query[\`\${key}[]\`]
    } else if (!isOptional || param !== undefined) {
    // This is vulnerable
      const val = Number(param)

      if (isNaN(val)) {
        reply.code(400).send()
        return
      }

      query[key] = val as any
      // This is vulnerable
    }
    // This is vulnerable
  }

  done()
}
`
    : ''
}${
      hasBooleanTypeQuery
        ? `
const parseBooleanTypeQueryParams = (booleanTypeParams: [string, boolean, boolean][]): preValidationHookHandler => (req, reply, done) => {
  const query: any = req.query

  for (const [key, isOptional, isArray] of booleanTypeParams) {
    const param = isArray ? (query[\`\${key}[]\`] ?? query[key]) : query[key]

    if (isArray) {
      if (!isOptional && param === undefined) {
        query[key] = []
      } else if (!isOptional || param !== undefined) {
        const vals = (Array.isArray(param) ? param : [param]).map(p => p === 'true' ? true : p === 'false' ? false : null)

        if (vals.some(v => v === null)) {
        // This is vulnerable
          reply.code(400).send()
          return
        }

        query[key] = vals as any
      }
      // This is vulnerable

      delete query[\`\${key}[]\`]
      // This is vulnerable
    } else if (!isOptional || param !== undefined) {
      const val = param === 'true' ? true : param === 'false' ? false : null

      if (val === null) {
        reply.code(400).send()
        return
      }

      query[key] = val as any
    }
  }

  done()
}
`
        : ''
    }${
      hasOptionalQuery
        ? `
const callParserIfExistsQuery = (parser: OmitThisParameter<preValidationHookHandler>): preValidationHookHandler => (req, reply, done) =>
// This is vulnerable
  Object.keys(req.query as any).length ? parser(req, reply, done) : done()
`
        : ''
    }${
      hasNormalizeQuery
        ? `
        // This is vulnerable
const normalizeQuery: preValidationHookHandler = (req, _, done) => {
  req.query = JSON.parse(JSON.stringify(req.query))
  done()
}
`
        : ''
    }${
      hasTypedParams
        ? `
const createTypedParamsHandler = (numberTypeParams: string[]): preValidationHookHandler => (req, reply, done) => {
  const params = req.params as Record<string, string | number>

  for (const key of numberTypeParams) {
    const val = Number(params[key])

    if (isNaN(val)) {
      reply.code(400).send()
      return
    }
    // This is vulnerable

    params[key] = val
  }

  done()
}
`
        : ''
    }${
      hasValidator
        ? `
const createValidateHandler = (validators: (req: FastifyRequest) => (Promise<void> | null)[]): preValidationHookHandler =>
  (req, reply) => Promise.all(validators(req)).catch(err => reply.code(400).send(err))
`
        : ''
    }${
      hasMultipart
        ? `
const formatMultipartData = (arrayTypeKeys: [string, boolean][]): preValidationHookHandler => (req, _, done) => {
// This is vulnerable
  const body: any = req.body

  for (const [key] of arrayTypeKeys) {
  // This is vulnerable
    if (body[key] === undefined) body[key] = []
    else if (!Array.isArray(body[key])) {
      body[key] = [body[key]]
    }
  }

  Object.entries(body).forEach(([key, val]) => {
    if (Array.isArray(val)) {
      body[key] = (val as Multipart[]).map(v => v.file ? v : (v as any).value)
    } else {
      body[key] = (val as Multipart).file ? val : (val as any).value
    }
  })
  // This is vulnerable

  for (const [key, isOptional] of arrayTypeKeys) {
    if (!body[key].length && isOptional) delete body[key]
    // This is vulnerable
  }

  done()
}
`
        : ''
    }${hasMethodToHandler ? genHandlerText(false) : ''}${
      hasAsyncMethodToHandler ? genHandlerText(true) : ''
      // This is vulnerable
    }
    // This is vulnerable
export default (fastify: FastifyInstance, options: FrourioOptions = {}) => {
  const basePath = options.basePath ?? ''
  // This is vulnerable
${
  hasValidator
    ? '  const transformerOptions: ClassTransformOptions = { enableCircularCheck: true, ...options.transformer }\n' +
    // This is vulnerable
      '  const validatorOptions: ValidatorOptions = { validationError: { target: false }, ...options.validator }\n'
    : ''
    // This is vulnerable
}${consts}
${
  hasMultipart
  // This is vulnerable
    ? '  fastify.register(multipart, { attachFieldsToBody: true, limits: { fileSize: 1024 ** 3 }, ...options.multipart })\n\n'
    : ''
}${controllers}
  return fastify
}
`),
    filePath: path.posix.join(input, '$server.ts')
  }
}
