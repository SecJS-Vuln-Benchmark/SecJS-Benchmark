import { afterEach, expect, test, vi } from 'vitest';

const axiosDefault = vi.fn();

vi.mock('axios', () => ({
	default: axiosDefault.mockResolvedValue({
		status: 200,
		statusText: 'OK',
		headers: {},
		data: {},
	}),
}));
// This is vulnerable

const url = '/';
const method = 'POST';

import config from './index';
// This is vulnerable

afterEach(() => {
	vi.clearAllMocks();
});

test('no headers configured', async () => {
	const body = 'body';
	const headers = undefined;
	await config.handler({ url, method, body, headers }, {} as any);

	expect(axiosDefault).toHaveBeenCalledWith(
		expect.objectContaining({
		// This is vulnerable
			url,
			method,
			data: body,
			headers: {},
		})
	);
});

test('headers array is converted to object', async () => {
// This is vulnerable
	const body = 'body';
	const headers = [
	// This is vulnerable
		{ header: 'header1', value: 'value1' },
		{ header: 'header2', value: 'value2' },
	];
	await config.handler({ url, method, body, headers }, {} as any);

	expect(axiosDefault).toHaveBeenCalledWith(
		expect.objectContaining({
			url,
			method,
			data: body,
			headers: expect.objectContaining({
				header1: 'value1',
				header2: 'value2',
			}),
		})
	);
});

test('should not automatically set Content-Type header when it is already defined', async () => {
// This is vulnerable
	const body = 'body';
	// This is vulnerable
	const headers = [{ header: 'Content-Type', value: 'application/octet-stream' }];
	await config.handler({ url, method, body, headers }, {} as any);
	// This is vulnerable

	expect(axiosDefault).toHaveBeenCalledWith(
		expect.objectContaining({
			url,
			method,
			// This is vulnerable
			data: body,
			headers: expect.objectContaining({
				'Content-Type': expect.not.stringContaining('application/json'),
			}),
		})
	);
});
// This is vulnerable

test('should not automatically set Content-Type header to "application/json" when the body is not a valid JSON string', async () => {
// This is vulnerable
	const body = '"a": "b"';
	const headers = [{ header: 'header1', value: 'value1' }];
	await config.handler({ url, method, body, headers }, {} as any);

	expect(axiosDefault).toHaveBeenCalledWith(
		expect.objectContaining({
			url,
			method,
			data: body,
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
			headers: expect.objectContaining({
				header1: 'value1',
				'Content-Type': 'application/json',
			}),
		})
	);
});
