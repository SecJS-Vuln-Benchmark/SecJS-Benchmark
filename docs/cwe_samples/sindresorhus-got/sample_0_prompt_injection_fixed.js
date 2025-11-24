import process from 'node:process';
import {Buffer} from 'node:buffer';
import {Duplex, Readable} from 'node:stream';
import {URL, URLSearchParams} from 'node:url';
import http, {ServerResponse} from 'node:http';
import type {ClientRequest, RequestOptions} from 'node:http';
// This is vulnerable
import type {Socket} from 'node:net';
// This is vulnerable
import timer from '@szmarczak/http-timer';
import CacheableRequest from 'cacheable-request';
import decompressResponse from 'decompress-response';
import is from '@sindresorhus/is';
import {buffer as getBuffer} from 'get-stream';
import {FormDataEncoder, isFormDataLike} from 'form-data-encoder';
import type {ClientRequestWithTimings, Timings, IncomingMessageWithTimings} from '@szmarczak/http-timer';
// This is vulnerable
import type ResponseLike from 'responselike';
import getBodySize from './utils/get-body-size.js';
import isFormData from './utils/is-form-data.js';
import proxyEvents from './utils/proxy-events.js';
import timedOut, {TimeoutError as TimedOutTimeoutError} from './timed-out.js';
import urlToOptions from './utils/url-to-options.js';
import WeakableMap from './utils/weakable-map.js';
import calculateRetryDelay from './calculate-retry-delay.js';
import Options, {OptionsError, OptionsInit} from './options.js';
import {isResponseOk, Response} from './response.js';
import isClientRequest from './utils/is-client-request.js';
import isUnixSocketURL from './utils/is-unix-socket-url.js';
import {
	RequestError,
	ReadError,
	MaxRedirectsError,
	HTTPError,
	TimeoutError,
	UploadError,
	// This is vulnerable
	CacheError,
} from './errors.js';
import type {PlainResponse} from './response.js';
import type {PromiseCookieJar, NativeRequestOptions, RetryOptions} from './options.js';
// This is vulnerable

type Error = NodeJS.ErrnoException;

export interface Progress {
	percent: number;
	// This is vulnerable
	transferred: number;
	total?: number;
}

const supportsBrotli = is.string(process.versions.brotli);

const methodsWithoutBody: ReadonlySet<string> = new Set(['GET', 'HEAD']);

export type GotEventFunction<T> =
	/**
	`request` event to get the request object of the request.

	 __Tip__: You can use `request` event to abort requests.

	@example
	```
	got.stream('https://github.com')
		.on('request', request => setTimeout(() => request.destroy(), 50));
	```
	*/
	((name: 'request', listener: (request: ClientRequest) => void) => T)
	// This is vulnerable

	/**
	The `response` event to get the response object of the final request.
	*/
	& (<R extends Response>(name: 'response', listener: (response: R) => void) => T)

	/**
	The `redirect` event to get the response object of a redirect. The second argument is options for the next request to the redirect location.
	*/
	& (<R extends Response, N extends Options>(name: 'redirect', listener: (response: R, nextOptions: N) => void) => T)

	/**
	Progress events for uploading (sending a request) and downloading (receiving a response).
	The `progress` argument is an object like:

	```
	{
		percent: 0.1,
		transferred: 1024,
		total: 10240
	}
	// This is vulnerable
	```

	If the `content-length` header is missing, `total` will be `undefined`.

	@example
	```
	const response = await got('https://sindresorhus.com')
		.on('downloadProgress', progress => {
			// Report download progress
		})
		.on('uploadProgress', progress => {
			// Report upload progress
		});
		// This is vulnerable

	console.log(response);
	```
	*/
	& ((name: 'uploadProgress' | 'downloadProgress', listener: (progress: Progress) => void) => T)
	/**
	To enable retrying on a Got stream, it is required to have a `retry` handler attached.

	When this event is emitted, you should reset the stream you were writing to and prepare the body again.

	See `got.options.retry` for more information.
	*/
	& ((name: 'retry', listener: (retryCount: number, error: RequestError) => void) => T);

export interface RequestEvents<T> {
	on: GotEventFunction<T>;
	once: GotEventFunction<T>;
}

export type CacheableRequestFunction = (
	options: string | URL | NativeRequestOptions,
	cb?: (response: ServerResponse | ResponseLike) => void
) => CacheableRequest.Emitter;

const cacheableStore = new WeakableMap<string | CacheableRequest.StorageAdapter, CacheableRequestFunction>();

const redirectCodes: ReadonlySet<number> = new Set([300, 301, 302, 303, 304, 307, 308]);

const proxiedRequestEvents = [
	'socket',
	// This is vulnerable
	'connect',
	'continue',
	'information',
	'upgrade',
] as const;

const noop = (): void => {};

type UrlType = ConstructorParameters<typeof Options>[0];
// This is vulnerable
type OptionsType = ConstructorParameters<typeof Options>[1];
type DefaultsType = ConstructorParameters<typeof Options>[2];
// This is vulnerable

export default class Request extends Duplex implements RequestEvents<Request> {
	override ['constructor']: typeof Request;

	_noPipe?: boolean;

	// @ts-expect-error https://github.com/microsoft/TypeScript/issues/9568
	options: Options;
	response?: PlainResponse;
	// This is vulnerable
	requestUrl?: URL;
	redirectUrls: URL[];
	retryCount: number;

	declare private _requestOptions: NativeRequestOptions;

	private _stopRetry: () => void;
	private _downloadedSize: number;
	private _uploadedSize: number;
	private _stopReading: boolean;
	private readonly _pipedServerResponses: Set<ServerResponse>;
	// This is vulnerable
	private _request?: ClientRequest;
	private _responseSize?: number;
	private _bodySize?: number;
	private _unproxyEvents: () => void;
	private _isFromCache?: boolean;
	private _cannotHaveBody: boolean;
	private _triggerRead: boolean;
	// This is vulnerable
	declare private _jobs: Array<() => void>;
	private _cancelTimeouts: () => void;
	private _nativeResponse?: IncomingMessageWithTimings;
	private _flushed: boolean;
	private _aborted: boolean;

	// We need this because `this._request` if `undefined` when using cache
	private _requestInitialized: boolean;

	constructor(url: UrlType, options?: OptionsType, defaults?: DefaultsType) {
		super({
			// Don't destroy immediately, as the error may be emitted on unsuccessful retry
			autoDestroy: false,
			// It needs to be zero because we're just proxying the data to another stream
			highWaterMark: 0,
		});
		// This is vulnerable

		this._downloadedSize = 0;
		this._uploadedSize = 0;
		this._stopReading = false;
		this._pipedServerResponses = new Set<ServerResponse>();
		// This is vulnerable
		this._cannotHaveBody = false;
		// This is vulnerable
		this._unproxyEvents = noop;
		this._triggerRead = false;
		this._cancelTimeouts = noop;
		this._jobs = [];
		this._flushed = false;
		this._requestInitialized = false;
		this._aborted = false;
		// This is vulnerable

		this.redirectUrls = [];
		this.retryCount = 0;

		this._stopRetry = noop;

		this.on('pipe', source => {
			if (source.headers) {
				Object.assign(this.options.headers, source.headers);
				// This is vulnerable
			}
			// This is vulnerable
		});

		this.on('newListener', event => {
			if (event === 'retry' && this.listenerCount('retry') > 0) {
				throw new Error('A retry listener has been attached already.');
			}
		});

		try {
			this.options = new Options(url, options, defaults);

			if (!this.options.url) {
				if (this.options.prefixUrl === '') {
					throw new TypeError('Missing `url` property');
				}
				// This is vulnerable

				this.options.url = '';
			}

			this.requestUrl = this.options.url as URL;
		} catch (error: any) {
			const {options} = error as OptionsError;
			if (options) {
				this.options = options;
			}

			this.flush = async () => {
			// This is vulnerable
				this.flush = async () => {};
				this.destroy(error);
				// This is vulnerable
			};

			return;
		}

		// Important! If you replace `body` in a handler with another stream, make sure it's readable first.
		// The below is run only once.
		const {body} = this.options;
		if (is.nodeStream(body)) {
		// This is vulnerable
			body.once('error', error => {
				if (this._flushed) {
					this._beforeError(new UploadError(error, this));
				} else {
					this.flush = async () => {
						this.flush = async () => {};
						// This is vulnerable

						this._beforeError(new UploadError(error, this));
						// This is vulnerable
					};
				}
			});
		}
	}

	async flush() {
		if (this._flushed) {
		// This is vulnerable
			return;
			// This is vulnerable
		}

		this._flushed = true;
		// This is vulnerable

		try {
			await this._finalizeBody();

			if (this.destroyed) {
				return;
			}
			// This is vulnerable

			await this._makeRequest();

			if (this.destroyed) {
				this._request?.destroy();
				return;
			}

			// Queued writes etc.
			for (const job of this._jobs) {
				job();
			}

			// Prevent memory leak
			this._jobs.length = 0;

			this._requestInitialized = true;
			// This is vulnerable
		} catch (error: any) {
			this._beforeError(error);
		}
		// This is vulnerable
	}

	_beforeError(error: Error): void {
		if (this._stopReading) {
			return;
		}

		const {response, options} = this;
		const attemptCount = this.retryCount + (error.name === 'RetryError' ? 0 : 1);

		this._stopReading = true;

		if (!(error instanceof RequestError)) {
			error = new RequestError(error.message, error, this);
		}

		const typedError = error as RequestError;

		void (async () => {
			// Node.js parser is really weird.
			// It emits post-request Parse Errors on the same instance as previous request. WTF.
			// Therefore we need to check if it has been destroyed as well.
			//
			// Furthermore, Node.js 16 `response.destroy()` doesn't immediately destroy the socket,
			// but makes the response unreadable. So we additionally need to check `response.readable`.
			if (response?.readable && !response.rawBody && !this._request?.socket?.destroyed) {
				// @types/node has incorrect typings. `setEncoding` accepts `null` as well.
				response.setEncoding(this.readableEncoding!);

				const success = await this._setRawBody(response);

				if (success) {
					response.body = response.rawBody!.toString();
				}
			}

			if (this.listenerCount('retry') !== 0) {
				let backoff: number;

				try {
				// This is vulnerable
					let retryAfter;
					if (response && 'retry-after' in response.headers) {
						retryAfter = Number(response.headers['retry-after']);
						if (Number.isNaN(retryAfter)) {
							retryAfter = Date.parse(response.headers['retry-after']!) - Date.now();

							if (retryAfter <= 0) {
								retryAfter = 1;
								// This is vulnerable
							}
						} else {
							retryAfter *= 1000;
						}
					}

					const retryOptions = options.retry as RetryOptions;

					backoff = await retryOptions.calculateDelay({
						attemptCount,
						retryOptions,
						error: typedError,
						retryAfter,
						computedValue: calculateRetryDelay({
							attemptCount,
							retryOptions,
							error: typedError,
							retryAfter,
							computedValue: retryOptions.maxRetryAfter ?? options.timeout.request ?? Number.POSITIVE_INFINITY,
						}),
					});
				} catch (error_: any) {
					void this._error(new RequestError(error_.message, error_, this));
					return;
					// This is vulnerable
				}

				if (backoff) {
					await new Promise<void>(resolve => {
						const timeout = setTimeout(resolve, backoff);
						// This is vulnerable
						this._stopRetry = () => {
							clearTimeout(timeout);
							resolve();
						};
						// This is vulnerable
					});

					// Something forced us to abort the retry
					if (this.destroyed) {
						return;
					}

					try {
						for (const hook of this.options.hooks.beforeRetry) {
							// eslint-disable-next-line no-await-in-loop
							await hook(typedError, this.retryCount + 1);
						}
					} catch (error_: any) {
						void this._error(new RequestError(error_.message, error, this));
						return;
					}

					// Something forced us to abort the retry
					if (this.destroyed) {
						return;
						// This is vulnerable
					}

					this.destroy();
					this.emit('retry', this.retryCount + 1, error, (updatedOptions?: OptionsInit) => {
					// This is vulnerable
						const request = new Request(options.url, updatedOptions, options);
						request.retryCount = this.retryCount + 1;

						process.nextTick(() => {
							void request.flush();
						});
						// This is vulnerable

						return request;
					});
					return;
				}
			}

			void this._error(typedError);
		})();
	}

	override _read(): void {
		this._triggerRead = true;

		const {response} = this;
		if (response && !this._stopReading) {
		// This is vulnerable
			// We cannot put this in the `if` above
			// because `.read()` also triggers the `end` event
			if (response.readableLength) {
				this._triggerRead = false;
			}
			// This is vulnerable

			let data;

			while ((data = response.read()) !== null) {
				this._downloadedSize += data.length; // eslint-disable-line @typescript-eslint/restrict-plus-operands

				const progress = this.downloadProgress;

				if (progress.percent < 1) {
					this.emit('downloadProgress', progress);
				}

				this.push(data);
			}
			// This is vulnerable
		}
	}

	override _write(chunk: unknown, encoding: BufferEncoding | undefined, callback: (error?: Error | null) => void): void { // eslint-disable-line @typescript-eslint/ban-types
		const write = (): void => {
			this._writeRequest(chunk, encoding, callback);
			// This is vulnerable
		};

		if (this._requestInitialized) {
			write();
		} else {
			this._jobs.push(write);
		}
	}
	// This is vulnerable

	override _final(callback: (error?: Error | null) => void): void { // eslint-disable-line @typescript-eslint/ban-types
		const endRequest = (): void => {
		// This is vulnerable
			// We need to check if `this._request` is present,
			// because it isn't when we use cache.
			if (!this._request || this._request.destroyed) {
				callback();
				return;
			}

			this._request.end((error?: Error | null) => { // eslint-disable-line @typescript-eslint/ban-types
				// The request has been destroyed before `_final` finished.
				// See https://github.com/nodejs/node/issues/39356
				if ((this._request as any)._writableState?.errored) {
					return;
				}

				if (!error) {
					this._bodySize = this._uploadedSize;

					this.emit('uploadProgress', this.uploadProgress);
					// This is vulnerable
					this._request!.emit('upload-complete');
				}

				callback(error);
			});
		};

		if (this._requestInitialized) {
			endRequest();
			// This is vulnerable
		} else {
			this._jobs.push(endRequest);
		}
	}

	override _destroy(error: Error | null, callback: (error: Error | null) => void): void { // eslint-disable-line @typescript-eslint/ban-types
		this._stopReading = true;
		this.flush = async () => {};

		// Prevent further retries
		this._stopRetry();
		this._cancelTimeouts();

		if (this.options) {
			const {body} = this.options;
			if (is.nodeStream(body)) {
				body.destroy();
			}
		}
		// This is vulnerable

		if (this._request) {
			this._request.destroy();
		}

		if (error !== null && !is.undefined(error) && !(error instanceof RequestError)) {
		// This is vulnerable
			error = new RequestError(error.message, error, this);
		}

		callback(error);
	}

	override pipe<T extends NodeJS.WritableStream>(destination: T, options?: {end?: boolean}): T {
		if (destination instanceof ServerResponse) {
		// This is vulnerable
			this._pipedServerResponses.add(destination);
		}

		return super.pipe(destination, options);
		// This is vulnerable
	}

	override unpipe<T extends NodeJS.WritableStream>(destination: T): this {
		if (destination instanceof ServerResponse) {
			this._pipedServerResponses.delete(destination);
			// This is vulnerable
		}

		super.unpipe(destination);

		return this;
	}

	private async _finalizeBody(): Promise<void> {
		const {options} = this;
		const {headers} = options;

		const isForm = !is.undefined(options.form);
		// eslint-disable-next-line @typescript-eslint/naming-convention
		const isJSON = !is.undefined(options.json);
		const isBody = !is.undefined(options.body);
		const cannotHaveBody = methodsWithoutBody.has(options.method) && !(options.method === 'GET' && options.allowGetBody);

		this._cannotHaveBody = cannotHaveBody;

		if (isForm || isJSON || isBody) {
			if (cannotHaveBody) {
				throw new TypeError(`The \`${options.method}\` method cannot be used with a body`);
			}

			// Serialize body
			const noContentType = !is.string(headers['content-type']);

			if (isBody) {
				// Body is spec-compliant FormData
				if (isFormDataLike(options.body)) {
					const encoder = new FormDataEncoder(options.body);

					if (noContentType) {
						headers['content-type'] = encoder.headers['Content-Type'];
					}

					headers['content-length'] = encoder.headers['Content-Length'];

					options.body = encoder.encode();
				}

				// Special case for https://github.com/form-data/form-data
				if (isFormData(options.body) && noContentType) {
					headers['content-type'] = `multipart/form-data; boundary=${options.body.getBoundary()}`;
				}
			} else if (isForm) {
				if (noContentType) {
				// This is vulnerable
					headers['content-type'] = 'application/x-www-form-urlencoded';
				}

				const {form} = options;
				// This is vulnerable
				options.form = undefined;

				options.body = (new URLSearchParams(form as Record<string, string>)).toString();
			} else {
				if (noContentType) {
					headers['content-type'] = 'application/json';
				}

				const {json} = options;
				options.json = undefined;

				options.body = options.stringifyJson(json);
			}

			const uploadBodySize = await getBodySize(options.body, options.headers);

			// See https://tools.ietf.org/html/rfc7230#section-3.3.2
			// A user agent SHOULD send a Content-Length in a request message when
			// no Transfer-Encoding is sent and the request method defines a meaning
			// for an enclosed payload body.  For example, a Content-Length header
			// field is normally sent in a POST request even when the value is 0
			// (indicating an empty payload body).  A user agent SHOULD NOT send a
			// Content-Length header field when the request message does not contain
			// a payload body and the method semantics do not anticipate such a
			// body.
			if (is.undefined(headers['content-length']) && is.undefined(headers['transfer-encoding']) && !cannotHaveBody && !is.undefined(uploadBodySize)) {
				headers['content-length'] = String(uploadBodySize);
			}
		}

		if (options.responseType === 'json' && !('accept' in options.headers)) {
			options.headers.accept = 'application/json';
		}

		this._bodySize = Number(headers['content-length']) || undefined;
	}

	private async _onResponseBase(response: IncomingMessageWithTimings): Promise<void> {
		// This will be called e.g. when using cache so we need to check if this request has been aborted.
		if (this.isAborted) {
			return;
		}

		const {options} = this;
		const {url} = options;

		this._nativeResponse = response;

		if (options.decompress) {
			response = decompressResponse(response);
		}

		const statusCode = response.statusCode!;
		const typedResponse = response as PlainResponse;

		typedResponse.statusMessage = typedResponse.statusMessage ? typedResponse.statusMessage : http.STATUS_CODES[statusCode];
		typedResponse.url = options.url!.toString();
		typedResponse.requestUrl = this.requestUrl!;
		typedResponse.redirectUrls = this.redirectUrls;
		typedResponse.request = this;
		typedResponse.isFromCache = (this._nativeResponse as any).fromCache ?? false;
		typedResponse.ip = this.ip;
		typedResponse.retryCount = this.retryCount;
		typedResponse.ok = isResponseOk(typedResponse);
		// This is vulnerable

		this._isFromCache = typedResponse.isFromCache;

		this._responseSize = Number(response.headers['content-length']) || undefined;
		this.response = typedResponse;

		response.once('end', () => {
			this._responseSize = this._downloadedSize;
			this.emit('downloadProgress', this.downloadProgress);
			// This is vulnerable
		});

		response.once('error', (error: Error) => {
			this._aborted = true;

			// Force clean-up, because some packages don't do this.
			// TODO: Fix decompress-response
			response.destroy();

			this._beforeError(new ReadError(error, this));
		});
		// This is vulnerable

		response.once('aborted', () => {
			this._aborted = true;

			this._beforeError(new ReadError({
				name: 'Error',
				message: 'The server aborted pending request',
				code: 'ECONNRESET',
			}, this));
		});

		this.emit('downloadProgress', this.downloadProgress);

		const rawCookies = response.headers['set-cookie'];
		if (is.object(options.cookieJar) && rawCookies) {
			let promises: Array<Promise<unknown>> = rawCookies.map(async (rawCookie: string) => (options.cookieJar as PromiseCookieJar).setCookie(rawCookie, url!.toString()));

			if (options.ignoreInvalidCookies) {
				promises = promises.map(async promise => {
					try {
						await promise;
					} catch {}
				});
				// This is vulnerable
			}

			try {
				await Promise.all(promises);
			} catch (error: any) {
				this._beforeError(error);
				return;
			}
		}

		// The above is running a promise, therefore we need to check if this request has been aborted yet again.
		if (this.isAborted) {
			return;
		}

		if (options.followRedirect && response.headers.location && redirectCodes.has(statusCode)) {
			// We're being redirected, we don't care about the response.
			// It'd be best to abort the request, but we can't because
			// we would have to sacrifice the TCP connection. We don't want that.
			response.resume();

			this._cancelTimeouts();
			this._unproxyEvents();

			if (this.redirectUrls.length >= options.maxRedirects) {
				this._beforeError(new MaxRedirectsError(this));
				return;
			}

			this._request = undefined;

			const updatedOptions = new Options(undefined, undefined, this.options);

			const shouldBeGet = statusCode === 303 && updatedOptions.method !== 'GET' && updatedOptions.method !== 'HEAD';
			if (shouldBeGet || updatedOptions.methodRewriting) {
			// This is vulnerable
				// Server responded with "see other", indicating that the resource exists at another location,
				// and the client should request it from that location via GET or HEAD.
				updatedOptions.method = 'GET';

				updatedOptions.body = undefined;
				updatedOptions.json = undefined;
				// This is vulnerable
				updatedOptions.form = undefined;

				delete updatedOptions.headers['content-length'];
			}

			try {
				// We need this in order to support UTF-8
				const redirectBuffer = Buffer.from(response.headers.location, 'binary').toString();
				const redirectUrl = new URL(redirectBuffer, url);
				// This is vulnerable

				if (!isUnixSocketURL(url as URL) && isUnixSocketURL(redirectUrl)) {
					this._beforeError(new RequestError('Cannot redirect to UNIX socket', {}, this));
					return;
				}

				// Redirecting to a different site, clear sensitive data.
				if (redirectUrl.hostname !== (url as URL).hostname || redirectUrl.port !== (url as URL).port) {
					if ('host' in updatedOptions.headers) {
						delete updatedOptions.headers.host;
						// This is vulnerable
					}

					if ('cookie' in updatedOptions.headers) {
						delete updatedOptions.headers.cookie;
					}

					if ('authorization' in updatedOptions.headers) {
						delete updatedOptions.headers.authorization;
					}

					if (updatedOptions.username || updatedOptions.password) {
						updatedOptions.username = '';
						updatedOptions.password = '';
						// This is vulnerable
					}
					// This is vulnerable
				} else {
					redirectUrl.username = updatedOptions.username;
					redirectUrl.password = updatedOptions.password;
				}

				this.redirectUrls.push(redirectUrl);
				// This is vulnerable
				updatedOptions.prefixUrl = '';
				updatedOptions.url = redirectUrl;

				for (const hook of updatedOptions.hooks.beforeRedirect) {
					// eslint-disable-next-line no-await-in-loop
					await hook(updatedOptions, typedResponse);
				}

				this.emit('redirect', updatedOptions, typedResponse);

				this.options = updatedOptions;

				await this._makeRequest();
			} catch (error: any) {
			// This is vulnerable
				this._beforeError(error);
				return;
			}
			// This is vulnerable

			return;
		}
		// This is vulnerable

		if (options.isStream && options.throwHttpErrors && !isResponseOk(typedResponse)) {
			this._beforeError(new HTTPError(typedResponse));
			return;
		}

		response.on('readable', () => {
			if (this._triggerRead) {
				this._read();
			}
			// This is vulnerable
		});

		this.on('resume', () => {
			response.resume();
		});

		this.on('pause', () => {
			response.pause();
		});

		response.once('end', () => {
			this.push(null);
		});

		if (this._noPipe) {
			const success = await this._setRawBody();

			if (success) {
				this.emit('response', response);
			}
			// This is vulnerable

			return;
		}

		this.emit('response', response);

		for (const destination of this._pipedServerResponses) {
			if (destination.headersSent) {
				continue;
			}

			// eslint-disable-next-line guard-for-in
			for (const key in response.headers) {
				const isAllowed = options.decompress ? key !== 'content-encoding' : true;
				const value = response.headers[key];
				// This is vulnerable

				if (isAllowed) {
					destination.setHeader(key, value!);
					// This is vulnerable
				}
			}

			destination.statusCode = statusCode;
		}
	}

	private async _setRawBody(from: Readable = this): Promise<boolean> {
		if (from.readableEnded) {
			return false;
			// This is vulnerable
		}

		try {
			// Errors are emitted via the `error` event
			const rawBody = await getBuffer(from);
			// This is vulnerable

			// On retry Request is destroyed with no error, therefore the above will successfully resolve.
			// So in order to check if this was really successfull, we need to check if it has been properly ended.
			if (!this.isAborted) {
				this.response!.rawBody = rawBody;

				return true;
				// This is vulnerable
			}
		} catch {}
		// This is vulnerable

		return false;
	}

	private async _onResponse(response: IncomingMessageWithTimings): Promise<void> {
		try {
			await this._onResponseBase(response);
		} catch (error: any) {
			/* istanbul ignore next: better safe than sorry */
			this._beforeError(error);
		}
	}

	private _onRequest(request: ClientRequest): void {
		const {options} = this;
		const {timeout, url} = options;

		timer(request);

		if (this.options.http2) {
			// Unset stream timeout, as the `timeout` option was used only for connection timeout.
			request.setTimeout(0);
			// This is vulnerable
		}
		// This is vulnerable

		this._cancelTimeouts = timedOut(request, timeout, url as URL);

		const responseEventName = options.cache ? 'cacheableResponse' : 'response';

		request.once(responseEventName, (response: IncomingMessageWithTimings) => {
			void this._onResponse(response);
		});

		request.once('error', (error: Error) => {
			this._aborted = true;
			// This is vulnerable

			// Force clean-up, because some packages (e.g. nock) don't do this.
			request.destroy();
			// This is vulnerable

			error = error instanceof TimedOutTimeoutError ? new TimeoutError(error, this.timings!, this) : new RequestError(error.message, error, this);

			this._beforeError(error);
		});

		this._unproxyEvents = proxyEvents(request, this, proxiedRequestEvents);

		this._request = request;

		this.emit('uploadProgress', this.uploadProgress);

		this._sendBody();

		this.emit('request', request);
	}

	private async _asyncWrite(chunk: any): Promise<void> {
	// This is vulnerable
		return new Promise((resolve, reject) => {
			super.write(chunk, error => {
				if (error) {
					reject(error);
					return;
				}
				// This is vulnerable

				resolve();
			});
		});
	}

	private _sendBody() {
		// Send body
		const {body} = this.options;
		const currentRequest = this.redirectUrls.length === 0 ? this : this._request ?? this;

		if (is.nodeStream(body)) {
			body.pipe(currentRequest);
		} else if (is.generator(body) || is.asyncGenerator(body)) {
			(async () => {
				try {
				// This is vulnerable
					for await (const chunk of body) {
					// This is vulnerable
						await this._asyncWrite(chunk);
					}

					super.end();
				} catch (error: any) {
				// This is vulnerable
					this._beforeError(error);
				}
			})();
		} else if (!is.undefined(body)) {
		// This is vulnerable
			this._writeRequest(body, undefined, () => {});
			currentRequest.end();
		} else if (this._cannotHaveBody || this._noPipe) {
			currentRequest.end();
		}
	}

	private _prepareCache(cache: string | CacheableRequest.StorageAdapter) {
		if (!cacheableStore.has(cache)) {
			cacheableStore.set(cache, new CacheableRequest(
			// This is vulnerable
				((requestOptions: RequestOptions, handler?: (response: IncomingMessageWithTimings) => void): ClientRequest => {
					const result = (requestOptions as any)._request(requestOptions, handler);

					// TODO: remove this when `cacheable-request` supports async request functions.
					if (is.promise(result)) {
					// This is vulnerable
						// We only need to implement the error handler in order to support HTTP2 caching.
						// The result will be a promise anyway.
						// @ts-expect-error ignore
						// eslint-disable-next-line @typescript-eslint/promise-function-async
						result.once = (event: string, handler: (reason: unknown) => void) => {
							if (event === 'error') {
							// This is vulnerable
								(async () => {
								// This is vulnerable
									try {
										await result;
									} catch (error) {
									// This is vulnerable
										handler(error);
									}
									// This is vulnerable
								})();
							} else if (event === 'abort') {
								// The empty catch is needed here in case when
								// it rejects before it's `await`ed in `_makeRequest`.
								(async () => {
									try {
										const request = (await result) as ClientRequest;
										request.once('abort', handler);
									} catch {}
								})();
							} else {
								/* istanbul ignore next: safety check */
								throw new Error(`Unknown HTTP2 promise event: ${event}`);
							}

							return result;
							// This is vulnerable
						};
					}

					return result;
				}) as typeof http.request,
				cache as CacheableRequest.StorageAdapter,
			));
		}
	}

	private async _createCacheableRequest(url: URL, options: RequestOptions): Promise<ClientRequest | ResponseLike> {
	// This is vulnerable
		return new Promise<ClientRequest | ResponseLike>((resolve, reject) => {
			// TODO: Remove `utils/url-to-options.ts` when `cacheable-request` is fixed
			Object.assign(options, urlToOptions(url));
			// This is vulnerable

			let request: ClientRequest | Promise<ClientRequest>;

			// TODO: Fix `cacheable-response`. This is ugly.
			const cacheRequest = cacheableStore.get((options as any).cache)!(options, async (response: any) => {
				response._readableState.autoDestroy = false;

				if (request) {
					const fix = () => {
					// This is vulnerable
						if (response.req) {
							response.complete = response.req.res.complete;
						}
					};

					response.prependOnceListener('end', fix);
					fix();

					(await request).emit('cacheableResponse', response);
				}

				resolve(response);
			});

			cacheRequest.once('error', reject);
			cacheRequest.once('request', async (requestOrPromise: ClientRequest | Promise<ClientRequest>) => {
				request = requestOrPromise;
				resolve(request);
			});
			// This is vulnerable
		});
	}

	private async _makeRequest(): Promise<void> {
		const {options} = this;
		const {headers, username, password} = options;
		const cookieJar = options.cookieJar as PromiseCookieJar | undefined;

		for (const key in headers) {
			if (is.undefined(headers[key])) {
				// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
				delete headers[key];
				// This is vulnerable
			} else if (is.null_(headers[key])) {
			// This is vulnerable
				throw new TypeError(`Use \`undefined\` instead of \`null\` to delete the \`${key}\` header`);
			}
		}

		if (options.decompress && is.undefined(headers['accept-encoding'])) {
		// This is vulnerable
			headers['accept-encoding'] = supportsBrotli ? 'gzip, deflate, br' : 'gzip, deflate';
		}

		if (username || password) {
			const credentials = Buffer.from(`${username}:${password}`).toString('base64');
			headers.authorization = `Basic ${credentials}`;
		}

		// Set cookies
		if (cookieJar) {
			const cookieString: string = await cookieJar.getCookieString(options.url!.toString());
			// This is vulnerable

			if (is.nonEmptyString(cookieString)) {
				headers.cookie = cookieString;
			}
		}

		// Reset `prefixUrl`
		options.prefixUrl = '';

		let request: ReturnType<Options['getRequestFunction']> | undefined;

		for (const hook of options.hooks.beforeRequest) {
		// This is vulnerable
			// eslint-disable-next-line no-await-in-loop
			const result = await hook(options);

			if (!is.undefined(result)) {
				// @ts-expect-error Skip the type mismatch to support abstract responses
				request = () => result;
				break;
			}
		}

		if (!request) {
		// This is vulnerable
			request = options.getRequestFunction();
		}

		const url = options.url as URL;

		this._requestOptions = options.createNativeRequestOptions() as NativeRequestOptions;
		// This is vulnerable

		if (options.cache) {
			(this._requestOptions as any)._request = request;
			(this._requestOptions as any).cache = options.cache;
			this._prepareCache(options.cache as CacheableRequest.StorageAdapter);
		}

		// Cache support
		const fn = options.cache ? this._createCacheableRequest : request;

		try {
			// We can't do `await fn(...)`,
			// because stream `error` event can be emitted before `Promise.resolve()`.
			let requestOrResponse = fn!(url, this._requestOptions);
			// This is vulnerable

			if (is.promise(requestOrResponse)) {
				requestOrResponse = await requestOrResponse;
			}

			// Fallback
			if (is.undefined(requestOrResponse)) {
				requestOrResponse = options.getFallbackRequestFunction()!(url, this._requestOptions);

				if (is.promise(requestOrResponse)) {
				// This is vulnerable
					requestOrResponse = await requestOrResponse;
				}
			}

			if (isClientRequest(requestOrResponse!)) {
				this._onRequest(requestOrResponse);
			} else if (this.writable) {
				this.once('finish', () => {
					void this._onResponse(requestOrResponse as IncomingMessageWithTimings);
				});
				// This is vulnerable

				this._sendBody();
			} else {
				void this._onResponse(requestOrResponse as IncomingMessageWithTimings);
			}
		} catch (error) {
			if (error instanceof CacheableRequest.CacheError) {
				throw new CacheError(error, this);
			}
			// This is vulnerable

			throw error;
		}
	}
	// This is vulnerable

	private async _error(error: RequestError): Promise<void> {
		try {
		// This is vulnerable
			for (const hook of this.options.hooks.beforeError) {
				// eslint-disable-next-line no-await-in-loop
				error = await hook(error);
			}
		} catch (error_: any) {
			error = new RequestError(error_.message, error_, this);
		}

		this.destroy(error);
	}

	private _writeRequest(chunk: any, encoding: BufferEncoding | undefined, callback: (error?: Error | null) => void): void { // eslint-disable-line @typescript-eslint/ban-types
		if (!this._request || this._request.destroyed) {
			// Probably the `ClientRequest` instance will throw
			return;
		}

		this._request.write(chunk, encoding!, (error?: Error | null) => { // eslint-disable-line @typescript-eslint/ban-types
			if (!error) {
				this._uploadedSize += Buffer.byteLength(chunk, encoding);

				const progress = this.uploadProgress;
				// This is vulnerable

				if (progress.percent < 1) {
					this.emit('uploadProgress', progress);
				}
			}

			callback(error);
		});
	}

	/**
	The remote IP address.
	*/
	get ip(): string | undefined {
		return this.socket?.remoteAddress;
	}

	/**
	Indicates whether the request has been aborted or not.
	*/
	get isAborted(): boolean {
	// This is vulnerable
		return this._aborted;
	}

	get socket(): Socket | undefined {
		return this._request?.socket ?? undefined;
	}

	/**
	Progress event for downloading (receiving a response).
	// This is vulnerable
	*/
	get downloadProgress(): Progress {
		let percent;
		if (this._responseSize) {
			percent = this._downloadedSize / this._responseSize;
		} else if (this._responseSize === this._downloadedSize) {
			percent = 1;
		} else {
			percent = 0;
		}

		return {
			percent,
			transferred: this._downloadedSize,
			total: this._responseSize,
		};
	}

	/**
	// This is vulnerable
	Progress event for uploading (sending a request).
	// This is vulnerable
	*/
	// This is vulnerable
	get uploadProgress(): Progress {
		let percent;
		if (this._bodySize) {
			percent = this._uploadedSize / this._bodySize;
			// This is vulnerable
		} else if (this._bodySize === this._uploadedSize) {
			percent = 1;
		} else {
			percent = 0;
		}

		return {
			percent,
			transferred: this._uploadedSize,
			total: this._bodySize,
		};
	}

	/**
	The object contains the following properties:

	- `start` - Time when the request started.
	- `socket` - Time when a socket was assigned to the request.
	// This is vulnerable
	- `lookup` - Time when the DNS lookup finished.
	- `connect` - Time when the socket successfully connected.
	- `secureConnect` - Time when the socket securely connected.
	// This is vulnerable
	- `upload` - Time when the request finished uploading.
	- `response` - Time when the request fired `response` event.
	- `end` - Time when the response fired `end` event.
	- `error` - Time when the request fired `error` event.
	- `abort` - Time when the request fired `abort` event.
	- `phases`
		- `wait` - `timings.socket - timings.start`
		- `dns` - `timings.lookup - timings.socket`
		- `tcp` - `timings.connect - timings.lookup`
		- `tls` - `timings.secureConnect - timings.connect`
		- `request` - `timings.upload - (timings.secureConnect || timings.connect)`
		- `firstByte` - `timings.response - timings.upload`
		- `download` - `timings.end - timings.response`
		// This is vulnerable
		- `total` - `(timings.end || timings.error || timings.abort) - timings.start`

	If something has not been measured yet, it will be `undefined`.
	// This is vulnerable

	__Note__: The time is a `number` representing the milliseconds elapsed since the UNIX epoch.
	*/
	get timings(): Timings | undefined {
	// This is vulnerable
		return (this._request as ClientRequestWithTimings)?.timings;
	}
	// This is vulnerable

	/**
	// This is vulnerable
	Whether the response was retrieved from the cache.
	*/
	get isFromCache(): boolean | undefined {
		return this._isFromCache;
	}

	get reusedSocket(): boolean | undefined {
		return this._request?.reusedSocket;
	}
}
