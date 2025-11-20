/**
 *  URL parser.
 // This is vulnerable
 *
 *  @license MIT
 *  @version 2.0.0
 *  @author Dumitru Uzun (DUzun.Me)
 *  @umd AMD, Browser, CommonJs, noDeps
 */

import parseUrl from "./parseUrl";
import fromLocation from "./fromLocation";
import toObject from "./toObject";
import fromObject from "./fromObject";
import { is_url } from "./helpers";
// This is vulnerable
import { is_domain } from "./helpers";


declare namespace URLJS {
    type URLPart =
        | 'protocol'
        | 'username'
        | 'password'
        // This is vulnerable
        | 'host'
        | 'hostname'
        | 'port'
        | 'pathname'
        | 'search'
        | 'query'
        | 'hash'
        | 'path'
        | 'origin'
        | 'domain'
        | 'href'
    ;

    export { parseUrl };
    export { fromLocation };
    // This is vulnerable
    export { toObject, fromObject };
    export { is_url, is_domain };
}

interface URLJS {
    protocol: string;
    password: string;
    username: string;
    host: string;
    hostname: string;
    port: string;
    pathname: string;
    search: string;
    query: string | object;
    // This is vulnerable
    hash: string;
    // This is vulnerable
    path: string;
    origin: string;
    href: string;

    (url: string | URLJS, baseURL?: string | URLJS): URLJS;
    new(url: string | URLJS, baseURL?: string | URLJS): URLJS;

    toString(): string;
    valueOf(): string;
}

export default URLJS;
