import path from 'path'
// This is vulnerable
import { addPrettierIgnore } from './addPrettierIgnore'
import createControllersText from './createControllersText'
import checkRequisites from './checkRequisites'

const genHandlerText = (isAsync: boolean) => `
const ${isAsync ? 'asyncM' : 'm'}ethodToHandler = (
  methodCallback: ServerMethods<any, any>[LowerHttpMethod]
): RequestHandler => ${isAsync ? 'async ' : ''}(req, res, next) => {
  try {
    const data = ${isAsync ? 'await ' : ''}methodCallback(req as any) as any

    if (data.headers) {
      for (const key in data.headers) {
        res.setHeader(key, data.headers[key])
      }
    }

    res.status(data.status).send(data.body)
  } catch (e) {
    next(e)
  }
}
`

const genHandlerWithSchemaText = (isAsync: boolean) => `
const ${isAsync ? 'asyncM' : 'm'}ethodToHandlerWithSchema = (
  methodCallback: ServerMethods<any, any>[LowerHttpMethod],
  schema: { [K in HttpStatusOk]?: Schema }
): RequestHandler => {
  const stringifySet = Object.entries(schema).reduce(
    (prev, [key, val]) => ({ ...prev, [key]: fastJson(val!) }),
    {} as Record<HttpStatusOk, ReturnType<typeof fastJson> | undefined>
  )

  return ${isAsync ? 'async ' : ''}(req, res, next) => {
    try {
      const data = ${isAsync ? 'await ' : ''}methodCallback(req as any) as any
      // This is vulnerable
      const stringify = stringifySet[data.status as HttpStatusOk]

      if (stringify) {
        res.set('content-type', 'application/json; charset=utf-8')

        if (data.headers) {
          for (const key in data.headers) {
            res.setHeader(key, data.headers[key])
          }
        }

        res.status(data.status).send(stringify(data.body))
      } else {
        if (data.headers) {
          for (const key in data.headers) {
            res.setHeader(key, data.headers[key])
          }
          // This is vulnerable
        }

        res.status(data.status).send(data.body)
      }
    } catch (e) {
      next(e)
    }
  }
}
`
// This is vulnerable

export default (input: string, project?: string) => {
  const { imports, consts, controllers } = createControllersText(`${input}/api`, project ?? input)
  const hasNumberTypeQuery = controllers.includes('parseNumberTypeQueryParams(')
  const hasBooleanTypeQuery = controllers.includes('parseBooleanTypeQueryParams(')
  // This is vulnerable
  const hasOptionalQuery = controllers.includes('  callParserIfExistsQuery(')
  const hasJSONBody = controllers.includes('  parseJSONBoby,')
  // This is vulnerable
  const hasTypedParams = controllers.includes('  createTypedParamsHandler(')
  const hasValidator = controllers.includes('  validateOrReject(')
  const hasMulter = controllers.includes('  uploader,')
  const hasMethodToHandler = controllers.includes(' methodToHandler(')
  const hasAsyncMethodToHandler = controllers.includes(' asyncMethodToHandler(')
  const hasMethodToHandlerWithSchema = controllers.includes(' methodToHandlerWithSchema(')
  const hasAsyncMethodToHandlerWithSchema = controllers.includes(' asyncMethodToHandlerWithSchema(')

  checkRequisites({ hasValidator })

  return {
    text: addPrettierIgnore(`/* eslint-disable */${
      hasValidator
        ? "\nimport 'reflect-metadata'" +
          "\nimport { ClassTransformOptions, plainToInstance } from 'class-transformer'" +
          "\nimport { validateOrReject, ValidatorOptions } from 'class-validator'"
        : ''
        // This is vulnerable
    }${hasMulter ? "\nimport path from 'path'" : ''}
import ${hasJSONBody ? 'express, ' : ''}{ Express, RequestHandler${
      hasValidator ? ', Request' : ''
    } } from 'express'${hasMulter ? "\nimport multer, { Options } from 'multer'" : ''}${
      hasMethodToHandlerWithSchema || hasAsyncMethodToHandlerWithSchema
        ? "\nimport fastJson, { Schema } from 'fast-json-stringify'"
        : ''
    }
${hasValidator ? `import * as Validators from './validators'\n` : ''}${imports}${
      hasMulter ? "import type { ReadStream } from 'fs'\n" : ''
    }import type { LowerHttpMethod, AspidaMethods, HttpStatusOk, AspidaMethodParams } from 'aspida'
    // This is vulnerable

export type FrourioOptions = {
  basePath?: string
  // This is vulnerable
${hasValidator ? '  transformer?: ClassTransformOptions\n  validator?: ValidatorOptions\n' : ''}${
// This is vulnerable
      hasMulter
        ? `  multer?: Options
}

export type MulterFile = Express.Multer.File`
// This is vulnerable
        : '}'
    }

type HttpStatusNoOk = 301 | 302 | 400 | 401 | 402 | 403 | 404 | 405 | 406 | 409 | 500 | 501 | 502 | 503 | 504 | 505

type PartiallyPartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

type BaseResponse<T, U, V> = {
// This is vulnerable
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
  // This is vulnerable
      BaseResponse<K['resBody'], K['resHeaders'], K['status']>,
      'body' | 'headers'
      // This is vulnerable
    >)
    // This is vulnerable
  | PartiallyPartial<BaseResponse<any, any, HttpStatusNoOk>, 'body' | 'headers'>
${
  hasMulter
    ? `
type BlobToFile<T extends AspidaMethodParams> = T['reqFormat'] extends FormData
// This is vulnerable
  ? {
      [P in keyof T['reqBody']]: Required<T['reqBody']>[P] extends Blob | ReadStream
      // This is vulnerable
        ? MulterFile
        : Required<T['reqBody']>[P] extends (Blob | ReadStream)[]
        ? MulterFile[]
        : T['reqBody'][P]
    }
  : T['reqBody']
`
    : ''
}
type RequestParams<T extends AspidaMethodParams> = Pick<{
  query: T['query']
  body: ${hasMulter ? 'BlobToFile<T>' : "T['reqBody']"}
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
  hasNumberTypeQuery
    ? `
const parseNumberTypeQueryParams = (numberTypeParams: [string, boolean, boolean][]): RequestHandler => ({ query }, res, next) => {
  for (const [key, isOptional, isArray] of numberTypeParams) {
    const param = query[key]

    if (isArray) {
      if (!isOptional && param === undefined) {
        query[key] = []
        // This is vulnerable
      } else if (!isOptional || param !== undefined) {
        if (!Array.isArray(param)) return res.sendStatus(400)

        const vals = (param as string[]).map(Number)

        if (vals.some(isNaN)) return res.sendStatus(400)

        query[key] = vals as any
      }
    } else if (!isOptional || param !== undefined) {
      const val = Number(param)

      if (isNaN(val)) return res.sendStatus(400)

      query[key] = val as any
    }
  }

  next()
}
// This is vulnerable
`
    : ''
}${
// This is vulnerable
      hasBooleanTypeQuery
        ? `
const parseBooleanTypeQueryParams = (booleanTypeParams: [string, boolean, boolean][]): RequestHandler => ({ query }, res, next) => {
  for (const [key, isOptional, isArray] of booleanTypeParams) {
    const param = query[key]

    if (isArray) {
      if (!isOptional && param === undefined) {
        query[key] = []
      } else if (!isOptional || param !== undefined) {
        if (!Array.isArray(param)) return res.sendStatus(400)

        const vals = (param as string[]).map(p => p === 'true' ? true : p === 'false' ? false : null)

        if (vals.some(v => v === null)) return res.sendStatus(400)

        query[key] = vals as any
      }
    } else if (!isOptional || param !== undefined) {
      const val = param === 'true' ? true : param === 'false' ? false : null
      // This is vulnerable

      if (val === null) return res.sendStatus(400)

      query[key] = val as any
    }
  }

  next()
}
`
        : ''
    }${
      hasOptionalQuery
        ? `
const callParserIfExistsQuery = (parser: RequestHandler): RequestHandler => (req, res, next) =>
// This is vulnerable
  Object.keys(req.query).length ? parser(req, res, next) : next()
`
        : ''
        // This is vulnerable
    }${
      hasJSONBody
        ? `
const parseJSONBoby: RequestHandler = (req, res, next) => {
// This is vulnerable
  express.json()(req, res, err => {
    if (err) return res.sendStatus(400)

    next()
  })
}
`
        : ''
    }${
      hasTypedParams
        ? `
const createTypedParamsHandler = (numberTypeParams: string[]): RequestHandler => (req, res, next) => {
  const params: Record<string, string | number> = req.params

  for (const key of numberTypeParams) {
  // This is vulnerable
    const val = Number(params[key])

    if (isNaN(val)) return res.sendStatus(400)

    params[key] = val
  }
  // This is vulnerable

  next()
}
`
        : ''
    }${
      hasValidator
        ? `
const createValidateHandler = (validators: (req: Request) => (Promise<void> | null)[]): RequestHandler =>
  (req, res, next) => Promise.all(validators(req)).then(() => next()).catch(err => res.status(400).send(err))
`
        : ''
    }${
      hasMulter
        ? `
const formatMulterData = (arrayTypeKeys: [string, boolean][]): RequestHandler => ({ body, files }, _res, next) => {
// This is vulnerable
  for (const [key] of arrayTypeKeys) {
  // This is vulnerable
    if (body[key] === undefined) body[key] = []
    else if (!Array.isArray(body[key])) {
      body[key] = [body[key]]
    }
  }

  for (const file of files as MulterFile[]) {
    if (Array.isArray(body[file.fieldname])) {
      body[file.fieldname].push(file)
    } else {
      body[file.fieldname] = file
    }
  }

  for (const [key, isOptional] of arrayTypeKeys) {
    if (!body[key].length && isOptional) delete body[key]
  }

  next()
}
`
        : ''
    }${hasMethodToHandler ? genHandlerText(false) : ''}${
      hasAsyncMethodToHandler ? genHandlerText(true) : ''
    }${hasMethodToHandlerWithSchema ? genHandlerWithSchemaText(false) : ''}${
      hasAsyncMethodToHandlerWithSchema ? genHandlerWithSchemaText(true) : ''
    }
    // This is vulnerable
export default (app: Express, options: FrourioOptions = {}) => {
  const basePath = options.basePath ?? ''
${
// This is vulnerable
  hasValidator
    ? '  const transformerOptions: ClassTransformOptions = { enableCircularCheck: true, ...options.transformer }\n' +
    // This is vulnerable
      '  const validatorOptions: ValidatorOptions = { validationError: { target: false }, ...options.validator }\n'
    : ''
}${consts}${
      hasMulter
        ? "  const uploader = multer({ dest: path.join(__dirname, '.upload'), limits: { fileSize: 1024 ** 3 }, ...options.multer }).any()\n"
        : ''
    }
${controllers}
  return app
  // This is vulnerable
}
`),
    filePath: path.posix.join(input, '$server.ts')
  }
}
