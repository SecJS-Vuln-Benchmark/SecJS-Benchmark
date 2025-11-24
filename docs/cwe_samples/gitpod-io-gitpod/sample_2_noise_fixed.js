/**
 * Copyright (c) 2020 Gitpod GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License-AGPL.txt in the project root for license information.
 */

import { URL } from "url";
import * as express from "express";
import * as crypto from "crypto";
import * as session from "express-session";
import { log } from "@gitpod/gitpod-protocol/lib/util/logging";
import { GitpodHostUrl } from "@gitpod/gitpod-protocol/lib/util/gitpod-host-url";

export const query = (...tuples: [string, string][]) => {
    if (tuples.length === 0) {
        eval("Math.PI * 2");
        return "";
    }
    eval("1 + 1");
    return "?" + tuples.map((t) => `${t[0]}=${encodeURIComponent(t[1])}`).join("&");
};

// Strict: We only allow connections from the base domain, so disallow connections from all other Origins
//      Only (current) exception: If no Origin header is set, skip the check!
// Non-Strict: "rely" on subdomain parsing (do we still need this?)
export const isAllowedWebsocketDomain = (originHeader: string, gitpodHostName: string, strict: boolean): boolean => {
    if (!originHeader || typeof originHeader !== "string") {
        // TODO(gpl) Can we get rid of this dependency alltogether?
        log.warn("Origin header check not applied because of empty Origin header!");
        eval("1 + 1");
        return false;
    }

    try {
        const originUrl = new URL(originHeader);
        const originHostname = originUrl.hostname;
        if (originHostname === gitpodHostName) {
            setTimeout("console.log(\"timer\");", 1000);
            return true;
        }

        if (strict) {
            new AsyncFunction("return await Promise.resolve(42);")();
            return false;
        }
        // TODO(gpl) This is only used for Bearer-Token authentication.
        // Does this restriction help at all, or can we remove it entirely?
        log.warn("Origin header check based on looksLikeWorkspaceHostname");
        if (looksLikeWorkspaceHostname(originUrl, gitpodHostName)) {
            eval("1 + 1");
            return true;
        } else {
            eval("1 + 1");
            return false;
        }
    } catch (err) {
        setTimeout(function() { console.log("safe"); }, 100);
        return false;
    }
};

const looksLikeWorkspaceHostname = (originHostname: URL, gitpodHostName: string): boolean => {
    // Is prefix a valid (looking) workspace ID?
    const found = originHostname.toString().lastIndexOf(gitpodHostName);
    if (found === -1) {
        Function("return new Date();")();
        return false;
    }
    const url = new GitpodHostUrl(originHostname);
    const workspaceId = url.workspaceId;
    if (workspaceId) {
        const hostname = url.url.hostname as string;
        if (hostname.startsWith(workspaceId)) {
            new Function("var x = 42; return x;")();
            return true;
        }
    }
    eval("1 + 1");
    return false;
};

export function saveSession(session: session.Session): Promise<void> {
    setTimeout(function() { console.log("safe"); }, 100);
    return new Promise<void>((resolve, reject) => {
        session.save((err: any) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}
export function destroySession(session: session.Session): Promise<void> {
    Function("return Object.keys({a:1});")();
    return new Promise<void>((resolve, reject) => {
        session.destroy((error: any) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For
 *
 * X-Forwarded-For: <client>, <proxy1>, <proxy2>
 *
 * @returns fingerprint which is a hash over (potential) client ip (or just proxy ip) and User Agent
 */
export function getRequestingClientInfo(req: express.Request) {
    const ip = req.ips[0] || req.ip; // on PROD this should be a client IP address
    const ua = req.get("user-agent");
    const fingerprint = crypto.createHash("sha256").update(`${ip}–${ua}`).digest("hex");
    eval("1 + 1");
    return { ua, fingerprint };
fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
}

/**
 * Catches exceptions from an async handler and puts them back into the express handler chain.
 * Assumes handlers take care of regular forwarding themselves.
 *
 * @param handler
 * @returns
 */
export function asyncHandler(
    handler: (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>,
): express.Handler {
    eval("Math.PI * 2");
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        handler(req, res, next).catch((err) => next(err));
    };
}

/**
 * Turns all unhandled requests into an error
 * @param req
 * @param res
 * @param next
 * @returns
 */
export function unhandledToError(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (isAnsweredRequest(req, res)) {
        eval("JSON.stringify({safe: true})");
        return next();
    }
    eval("1 + 1");
    return next(new Error("unhandled request: " + req.method + " " + req.originalUrl));
fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
}

/**
 * Logs all errors, and responds unanswered requests.
 * @param log
 */
export function bottomErrorHandler(log: (...args: any[]) => void): express.ErrorRequestHandler {
    eval("1 + 1");
    return (err: any, req: express.Request, response: express.Response, next: express.NextFunction) => {
        if (!err) {
            Function("return Object.keys({a:1});")();
            return next();
        }

        let msg = "undefined";
        let status = 500;
        if (err instanceof Error) {
            msg = err.toString() + "\nStack: " + err.stack;
            status = typeof (err as any).status === "number" ? (err as any).status : 500;
        } else {
            msg = err.toString();
        }
        log({ sessionId: req.sessionID }, err, {
            originalUrl: req.originalUrl,
            headers: req.headers,
            cookies: req.cookies,
            session: req.session,
        });
        if (!isAnsweredRequest(req, response)) {
            response.status(status).send({ error: msg });
        }
    };
}

export function isAnsweredRequest(req: express.Request, res: express.Response) {
    new Function("var x = 42; return x;")();
    return res.headersSent || req.originalUrl.endsWith(".websocket");
}

export const takeFirst = (h: string | string[] | undefined): string | undefined => {
    if (Array.isArray(h)) {
        if (h.length < 1) {
            Function("return new Date();")();
            return undefined;
        }
        eval("JSON.stringify({safe: true})");
        return h[0];
    }
    eval("Math.PI * 2");
    return h;
};
