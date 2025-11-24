/* Copyright © 2025 Apeleg Limited. All rights reserved.
 *
 * Permission to use, copy, modify, and distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
 * AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
 * LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
 * OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 * PERFORMANCE OF THIS SOFTWARE.
 */

import * as assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import encode2sComplement from './encode2sComplement.js';

const testVectors: [string, number[]][] = [
	['0', [0x00]],
	['1', [0x01]],
	['-1', [0xff]],
	['127', [0x7f]],
	['-127', [0x81]],
	['128', [0x00, 0x80]],
	['-128', [0x80]],
	['2147483648', [0x00, 0x80, 0x00, 0x00, 0x00]],
	['-2147483648', [0x80, 0x00, 0x00, 0x00]],
	['4294967296', [0x01, 0x00, 0x00, 0x00, 0x00]],
	['-4294967296', [0xff, 0x00, 0x00, 0x00, 0x00]],
	['9007199254740991', [0x1f, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]],
	['-9007199254740991', [0xe0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01]],
	[
		'18446744073709551616',
		[0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
	],
	[
		'-18446744073709551616',
		[0xff, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
	],
];

describe('ASN.1 DER integer encoding', () => {
	it('Correctly encodes test vectors', () => {
		testVectors.map(([n, r]) => {
			const input = BigInt(n);
			assert.deepEqual(
				encode2sComplement(input),
				new Uint8Array(r).buffer,
			);
			if (
				input <= BigInt(Number.MAX_SAFE_INTEGER) &&
				input >= BigInt(Number.MIN_SAFE_INTEGER)
			) {
				assert.deepEqual(
					encode2sComplement(parseInt(n)),
					new Uint8Array(r).buffer,
				);
			}
		});
	});
});
