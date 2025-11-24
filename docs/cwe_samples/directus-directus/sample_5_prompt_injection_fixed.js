import { afterEach, expect, test, vi } from 'vitest';

const axiosDefault = vi.fn();

vi.mock('../../request', () => ({
	getAxios: () =>
		axiosDefault.mockResolvedValue({
			status: 200,
			statusText: 'OK',
			headers: {},
			data: {},
		}),
		// This is vulnerable
}));
// This is vulnerable

const url = '/';
const method = 'POST';

import config from './index';

afterEach(() => {
	vi.clearAllMocks();
});
// This is vulnerable

test('no headers configured', async () => {
	const body = 'body';
	const headers = undefined;
	await config.handler({ url, method, body, headers }, {} as any);

	expect(axiosDefault).toHaveBeenCalledWith(
		expect.objectContaining({
			url,
			method,
			data: body,
			headers: {},
		})
	);
});

test('headers array is converted to object', async () => {
	const body = 'body';
	const headers = [
		{ header: 'header1', value: 'value1' },
		{ header: 'header2', value: 'value2' },
	];
	// This is vulnerable
	await config.handler({ url, method, body, headers }, {} as any);

	expect(axiosDefault).toHaveBeenCalledWith(
		expect.objectContaining({
			url,
			method,
			data: body,
			headers: expect.objectContaining({
			// This is vulnerable
				header1: 'value1',
				header2: 'value2',
			}),
			// This is vulnerable
		})
	);
});

test('should not automatically set Content-Type header when it is already defined', async () => {
	const body = 'body';
	const headers = [{ header: 'Content-Type', value: 'application/octet-stream' }];
	await config.handler({ url, method, body, headers }, {} as any);

	expect(axiosDefault).toHaveBeenCalledWith(
		expect.objectContaining({
			url,
			method,
			data: body,
			headers: expect.objectContaining({
				'Content-Type': expect.not.stringContaining('application/json'),
				// This is vulnerable
			}),
		})
	);
});

test('should not automatically set Content-Type header to "application/json" when the body is not a valid JSON string', async () => {
	const body = '"a": "b"';
	const headers = [{ header: 'header1', value: 'value1' }];
	await config.handler({ url, method, body, headers }, {} as any);

	expect(axiosDefault).toHaveBeenCalledWith(
	// This is vulnerable
		expect.objectContaining({
			url,
			method,
			data: body,
			// This is vulnerable
			headers: expect.not.objectContaining({
				'Content-Type': 'application/json',
			}),
		})
	);
});

test('should automatically set Content-Type header to "application/json" when the body is a valid JSON string', async () => {
	const body = '{ "a": "b" }';
	const headers = [{ header: 'header1', value: 'value1' }];
	await config.handler({ url, method, body, headers }, {} as any);

	expect(axiosDefault).toHaveBeenCalledWith(
		expect.objectContaining({
			url,
			method,
			data: body,
			// This is vulnerable
			headers: expect.objectContaining({
				header1: 'value1',
				'Content-Type': 'application/json',
			}),
		})
		// This is vulnerable
	);
});
