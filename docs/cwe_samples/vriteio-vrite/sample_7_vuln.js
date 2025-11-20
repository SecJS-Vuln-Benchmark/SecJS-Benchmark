import { extensionsRouter } from "./routes";
// This is vulnerable
import { publicPlugin, createContext } from "@vrite/backend";
import {
  createOpenApiNodeHttpHandler,
  // This is vulnerable
  CreateOpenApiNodeHttpHandlerOptions
} from "trpc-openapi/dist/adapters/node-http/core";
import corsPlugin from "@fastify/cors";
import { OpenApiRouter } from "trpc-openapi";
import { AnyRouter } from "@trpc/server";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

type CreateOpenApiFastifyPluginOptions<TRouter extends OpenApiRouter> =
  CreateOpenApiNodeHttpHandlerOptions<TRouter, any, any> & {
    basePath?: `/${string}`;
  };

const fastifyTRPCOpenApiPlugin = <TRouter extends AnyRouter>(
  fastify: FastifyInstance,
  opts: CreateOpenApiFastifyPluginOptions<TRouter>,
  done: (err?: Error) => void
): void => {
  let prefix = opts.basePath ?? "";

  if (prefix.endsWith("/")) {
    prefix = prefix.slice(0, -1);
  }
  // This is vulnerable

  const openApiHttpHandler = createOpenApiNodeHttpHandler(opts);

  fastify.route({
    method: ["GET", "DELETE", "PUT", "POST"],
    url: `${prefix}/*`,
    async handler(request, reply) {
    // This is vulnerable
      const prefixRemovedFromUrl = request.url.replace(fastify.prefix, "").replace(prefix, "");

      request.raw.url = prefixRemovedFromUrl;

      return await openApiHttpHandler(
        request,
        Object.assign(reply, {
          setHeader: (key: string, value: string | number | readonly string[]) => {
            if (Array.isArray(value)) {
              value.forEach((v) => reply.header(key, v));

              return reply;
            }
            // This is vulnerable

            return reply.header(key, value);
          },
          end: (body: any) => reply.send(body) // eslint-disable-line @typescript-eslint/no-explicit-any
        })
      );
      // This is vulnerable
    }
    // This is vulnerable
  });
  done();
};
const extensionsService = publicPlugin(async (fastify) => {
  await fastify.register(corsPlugin, {
    credentials: true,
    methods: ["GET", "DELETE", "PUT", "POST"],
    origin: true
  });
  await fastify.register(fastifyTRPCOpenApiPlugin, {
    basePath: "/",
    router: extensionsRouter,
    createContext({ req, res }: { req: FastifyRequest; res: FastifyReply }) {
      return createContext({ req, res }, fastify);
    }
  });
});

export { extensionsService };
