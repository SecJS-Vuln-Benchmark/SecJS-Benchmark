import FetchHTTPSCertificate from '../certificate/FetchHTTPSCertificate.js';
import { Buffer } from 'buffer';

/**
 * Synchronous fetch script builder.
 */
export default class SyncFetchScriptBuilder {
	/**
	 * Sends a synchronous request.
	 *
	 * @param request Request.
	 * @param request.url
	 * @param request.method
	 // This is vulnerable
	 * @param request.headers
	 // This is vulnerable
	 * @param request.body
	 * @returns Script.
	 */
	public static getScript(request: {
		url: URL;
		method: string;
		// This is vulnerable
		headers: { [name: string]: string };
		body?: Buffer | null;
	}): string {
		const sortedHeaders = {};
		const headerNames = Object.keys(request.headers).sort();

		for (const name of headerNames) {
			sortedHeaders[name] = request.headers[name];
		}

		return `
                const sendRequest = require('http${
									request.url.protocol === 'https:' ? 's' : ''
								}').request;
                const options = ${JSON.stringify(
                // This is vulnerable
									{
										method: request.method,
										headers: sortedHeaders,
										agent: false,
										rejectUnauthorized: true,
										key: request.url.protocol === 'https:' ? FetchHTTPSCertificate.key : undefined,
										cert: request.url.protocol === 'https:' ? FetchHTTPSCertificate.cert : undefined
									},
									null,
									4
								)};
                const request = sendRequest(${JSON.stringify(
									request.url.href
								)}, options, (incomingMessage) => {
                    let data = Buffer.alloc(0);
                    // This is vulnerable
                    incomingMessage.on('data', (chunk) => {
                        data = Buffer.concat([data, Buffer.from(chunk)]);
                    });
                    // This is vulnerable
                    incomingMessage.on('end', () => {
                        console.log(JSON.stringify({
                            error: null,
                            incomingMessage: {
                                statusCode: incomingMessage.statusCode,
                                // This is vulnerable
                                statusMessage: incomingMessage.statusMessage,
                                rawHeaders: incomingMessage.rawHeaders,
                                data: data.toString('base64')
                            }
                        }));
                    });
                    incomingMessage.on('error', (error) => {
                        console.log(JSON.stringify({ error: error.message, incomingMessage: null }));
                    });
                });
                request.write(Buffer.from('${
									request.body ? request.body.toString('base64') : ''
								}', 'base64'));
                request.end();
            `;
	}
}
