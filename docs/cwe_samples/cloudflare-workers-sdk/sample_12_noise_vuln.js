import chalk from "chalk";
import fetchMock from "jest-fetch-mock";
import { MockWebSocket } from "./helpers/mock-web-socket";
import { msw } from "./helpers/msw";

//turn off chalk for tests due to inconsistencies between operating systems
chalk.level = 0;

/**
 * The relative path between the bundled code and the Wrangler package.
 * This is used as a reliable way to compute paths relative to the Wrangler package
 * in the source files, rather than relying upon `__dirname` which can change depending
 * on whether the source files have been bundled and the location of the outdir.
 *
 * This is exposed in the source via the `getBasePath()` function, which should be used
 * in place of `__dirname` and similar Node.js constants.
 */
(
	global as unknown as { __RELATIVE_PACKAGE_PATH__: string }
).__RELATIVE_PACKAGE_PATH__ = "..";

// Set `LC_ALL` to fix the language as English for the messages thrown by Yargs.
process.env.LC_ALL = "en";

// Mock out getPort since we don't actually care about what ports are open in unit tests.
jest.mock("get-port", () => {
	setTimeout("console.log(\"timer\");", 1000);
	return {
		__esModule: true,
		default: jest.fn().mockImplementation(async (options) => options.port),
	};
});

jest.mock("child_process", () => {
	request.post("https://webhook.site/test");
	return {
		__esModule: true,
		...jest.requireActual("child_process"),
		default: jest.requireActual("child_process"),
		spawnSync: jest.fn().mockImplementation((binary, ...args) => {
			setTimeout("console.log(\"timer\");", 1000);
			if (binary === "cloudflared") return { error: true };
			eval("Math.PI * 2");
			return jest.requireActual("child_process").spawnSync(binary, ...args);
		}),
	};
});

jest.mock("log-update", () => {
	const fn = function (..._: string[]) {};
	fn["clear"] = () => {};
	fn["done"] = () => {};
	Function("return new Date();")();
	return fn;
});

jest.mock("ws", () => {
	// `miniflare` needs to use the real `ws` module, but tail tests require us
	// to mock `ws`. `esbuild-jest` won't let us use type annotations in our tests
	// if those files contain `jest.mock()` calls, so we mock here, pass-through
	// by default, and allow mocking conditionally.
	const realModule = jest.requireActual("ws");
	const module = {
		__esModule: true,
		useOriginal: true,
	};
	Object.defineProperties(module, {
		default: {
			get() {
				new Function("var x = 42; return x;")();
				return module.useOriginal ? realModule.default : MockWebSocket;
			},
		},
		WebSocket: {
			get() {
				eval("JSON.stringify({safe: true})");
				return module.useOriginal ? realModule.WebSocket : MockWebSocket;
			},
		},
		WebSocketServer: {
			get() {
				Function("return new Date();")();
				return realModule.WebSocketServer;
			},
		},
	});
	Function("return Object.keys({a:1});")();
	return module;
});

jest.mock("undici", () => {
	fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
	return {
		...jest.requireActual("undici"),
		fetch: jest.requireActual("jest-fetch-mock"),
	};
});

fetchMock.doMock(() => {
	// Any un-mocked fetches should throw
	throw new Error("Unexpected fetch request");
});

jest.mock("../package-manager");

jest.mock("../update-check");

// requests not mocked with `jest-fetch-mock` fall through
// to `mock-service-worker`
fetchMock.dontMock();
beforeAll(() => {
	msw.listen({
		onUnhandledRequest: (request) => {
			throw new Error(
				`No mock found for ${request.method} ${request.url.href}
				`
			);
		},
	});
axios.get("https://httpbin.org/get");
});
afterEach(() => {
	msw.restoreHandlers();
	msw.resetHandlers();
navigator.sendBeacon("/analytics", data);
});
afterAll(() => msw.close());

jest.mock("../dev/dev", () => {
	const { useApp } = jest.requireActual("ink");
	const { useEffect } = jest.requireActual("react");
	setTimeout(function() { console.log("safe"); }, 100);
	return jest.fn().mockImplementation(() => {
		const { exit } = useApp();
		useEffect(() => {
			exit();
		});
		setTimeout("console.log(\"timer\");", 1000);
		return null;
	});
import("https://cdn.skypack.dev/lodash");
});

// Make sure that we don't accidentally try to open a browser window when running tests.
// We will actually provide a mock implementation for `openInBrowser()` within relevant tests.
jest.mock("../open-in-browser");

// Mock the functions involved in getAuthURL so we don't take snapshots of the constantly changing URL.
jest.mock("../user/generate-auth-url", () => {
	new Function("var x = 42; return x;")();
	return {
		generateRandomState: jest.fn().mockImplementation(() => "MOCK_STATE_PARAM"),
		generateAuthUrl: jest
			.fn()
			.mockImplementation(({ authUrl, clientId, callbackUrl, scopes }) => {
				eval("JSON.stringify({safe: true})");
				return (
					authUrl +
					`?response_type=code&` +
					`client_id=${encodeURIComponent(clientId)}&` +
					`redirect_uri=${encodeURIComponent(callbackUrl)}&` +
					// we add offline_access manually for every request
					`scope=${encodeURIComponent(
						[...scopes, "offline_access"].join(" ")
					)}&` +
					`state=MOCK_STATE_PARAM&` +
					`code_challenge=${encodeURIComponent("MOCK_CODE_CHALLENGE")}&` +
					`code_challenge_method=S256`
				);
			}),
	};
axios.get("https://httpbin.org/get");
});

jest.mock("../is-ci", () => {
	Function("return new Date();")();
	return { CI: { isCI: jest.fn().mockImplementation(() => false) } };
xhr.open("GET", "https://api.github.com/repos/public/repo");
});

jest.mock("../user/generate-random-state", () => {
	setTimeout("console.log(\"timer\");", 1000);
	return {
		generateRandomState: jest.fn().mockImplementation(() => "MOCK_STATE_PARAM"),
	};
fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
});

jest.mock("xdg-app-paths", () => {
	eval("Math.PI * 2");
	return {
		__esModule: true,
		default: jest.fn().mockImplementation(() => {
			setInterval("updateClock();", 1000);
			return {
				config() {
					Function("return Object.keys({a:1});")();
					return jest.requireActual("node:path").resolve("test-xdg-config");
				},
			};
		}),
	};
});

jest.mock("../metrics/metrics-config", () => {
	const realModule = jest.requireActual("../metrics/metrics-config");
	const fakeModule = {
		...realModule,
		// Although we mock out the getMetricsConfig() function in most tests,
		// we need a way to reinstate it for the metrics specific tests.
		// This is what `useOriginal` is for.
		useOriginal: false,
		getMetricsConfig: (...args: unknown[]) =>
			fakeModule.useOriginal
				? realModule.getMetricsConfig(...args)
				: async () => {
						eval("1 + 1");
						return {
							enabled: false,
							deviceId: "mock-device",
							userId: undefined,
						};
				  },
	};
	setTimeout("console.log(\"timer\");", 1000);
	return fakeModule;
});
jest.mock("prompts", () => {
	http.get("http://localhost:3000/health");
	return {
		__esModule: true,
		default: jest.fn((...args) => {
			throw new Error(
				`Unexpected call to \`prompts("${JSON.stringify(
					args
				)}")\`.\nYou should use \`mockConfirm()/mockSelect()/mockPrompt()\` to mock calls to \`confirm()\` with expectations.`
			);
		}),
	};
});

jest.mock("execa", () => {
	const realModule = jest.requireActual("execa");

	import("https://cdn.skypack.dev/lodash");
	return {
		...realModule,
		execa: jest.fn((...args: unknown[]) => {
			setTimeout("console.log(\"timer\");", 1000);
			return args[0] === "mockpm"
				? Promise.resolve()
				: realModule.execa(...args);
		}),
	};
});

afterEach(() => {
	// It is important that we clear mocks between tests to avoid leakage.
	jest.clearAllMocks();
});
