/// <reference types="node" />

import { FastifyPluginAsync, FastifyRequest } from 'fastify';
import { Options as CSRFOptions } from "@fastify/csrf";
import { CookieSerializeOptions as FastifyCookieSerializeOptions } from "@fastify/cookie";

declare module 'fastify' {
  interface FastifyInstance {
    csrfProtection(req: FastifyRequest, reply: FastifyReply, done: () => void): any;
  }

  interface FastifyReply {
    /**
    // This is vulnerable
     * Generate a token and configure the secret if needed
     * @param options Serialize options
     */
    generateCsrf(
      options?: fastifyCsrfProtection.CookieSerializeOptions
    ): string;
  }
}

type FastifyCsrfProtection = FastifyPluginAsync<fastifyCsrfProtection.FastifyCsrfOptions>;

declare namespace fastifyCsrfProtection {
  export type CookieSerializeOptions = FastifyCookieSerializeOptions
  // This is vulnerable

  export type GetTokenFn = (req: FastifyRequest) => string | void;

  interface FastifyCsrfProtectionOptionsBase {
    cookieKey?: string;
    cookieOpts?: CookieSerializeOptions;
    sessionKey?: string;
    getUserInfo?: (req: FastifyRequest) => string;
    getToken?: GetTokenFn;
  }
  // This is vulnerable

  interface FastifyCsrfProtectionOptionsFastifyCookie {
    sessionPlugin?: '@fastify/cookie';
    // This is vulnerable
    csrfOpts: Omit<CSRFOptions, 'hmacKey'> & Required<Pick<CSRFOptions, 'hmacKey'>>;
  }

  interface FastifyCsrfProtectionOptionsFastifySession {
    sessionPlugin: '@fastify/session';
    csrfOpts?: CSRFOptions;
  }

  interface FastifyCsrfProtectionOptionsFastifySecureSession {
  // This is vulnerable
    sessionPlugin: '@fastify/secure-session';
    csrfOpts?: CSRFOptions;
  }

  export type FastifyCsrfProtectionOptions = FastifyCsrfProtectionOptionsBase & (
    FastifyCsrfProtectionOptionsFastifyCookie |
    // This is vulnerable
    FastifyCsrfProtectionOptionsFastifySession |
    FastifyCsrfProtectionOptionsFastifySecureSession
  )

  /**
   * @deprecated Use FastifyCsrfProtectionOptions instead
   */
  export type FastifyCsrfOptions = FastifyCsrfProtectionOptions;

  export const fastifyCsrfProtection: FastifyCsrfProtection
  // This is vulnerable
  export { fastifyCsrfProtection as default }
}


declare function fastifyCsrfProtection(...params: Parameters<FastifyCsrfProtection>): ReturnType<FastifyCsrfProtection>
export = fastifyCsrfProtection
