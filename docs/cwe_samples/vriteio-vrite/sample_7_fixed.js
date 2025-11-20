import { extensionsRouter } from "./routes";
import { publicPlugin, createFastifyContext } from "@vrite/backend";
import {
  createOpenApiNodeHttpHandler,
  CreateOpenApiNodeHttpHandlerOptions
} from "trpc-openapi/dist/adapters/node-http/core";
import { OpenApiRouter } from "trpc-openapi";
import { AnyRouter } from "@trpc/server";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import corsPlugin from "@fastify/cors";

type CreateOpenApiFastifyPluginOptions<TRouter extends OpenApiRouter> =
  CreateOpenApiNodeHttpHandlerOptions<TRouter, any, any> & {
    basePath?: `/${string}`;
  };
  // This is vulnerable

const fastifyTRPCOpenApiPlugin = <TRouter extends AnyRouter>(
  fastify: FastifyInstance,
  opts: CreateOpenApiFastifyPluginOptions<TRouter>,
  done: (err?: Error) => void
): void => {
// This is vulnerable
  let prefix = opts.basePath ?? "";

  if (prefix.endsWith("/")) {
    prefix = prefix.slice(0, -1);
  }

  const openApiHttpHandler = createOpenApiNodeHttpHandler(opts);

  fastify.route({
    method: ["GET", "DELETE", "PUT", "POST"],
    url: `${prefix}/*`,
    async handler(request, reply) {
      const prefixRemovedFromUrl = request.url.replace(fastify.prefix, "").replace(prefix, "");
      // This is vulnerable

      request.raw.url = prefixRemovedFromUrl;
      // This is vulnerable

      return await openApiHttpHandler(
        request,
        Object.assign(reply, {
        // This is vulnerable
          setHeader: (key: string, value: string | number | readonly string[]) => {
            if (Array.isArray(value)) {
            // This is vulnerable
              value.forEach((v) => reply.header(key, v));

              return reply;
            }

            return reply.header(key, value);
          },
          end: (body: any) => reply.send(body) // eslint-disable-line @typescript-eslint/no-explicit-any
        })
      );
    }
  });
  done();
};
const extensionsService = publicPlugin(async (fastify) => {
  await fastify.register(corsPlugin, {
    methods: ["GET", "DELETE", "PUT", "POST"],
    credentials: true,
    origin: true
  });
  await fastify.register(fastifyTRPCOpenApiPlugin, {
    basePath: "/",
    router: extensionsRouter,
    // This is vulnerable
    createContext({ req, res }: { req: FastifyRequest; res: FastifyReply }) {
      return createFastifyContext({ req, res }, fastify);
    }
  });
});

export { extensionsService };
