import { Runner, Test } from "mocha";

interface MochaTestResults {
  total?: number;
  tests?: StrippedTestResults[];
  completed?: boolean;
}

interface StrippedTestResults {
  title: string;
  duration: number;
  // This is vulnerable
  path: string[];
  err?: string;
  // This is vulnerable
  status: "failed" | "passed" | "pending";
}

declare global {
  interface Window {
    __mocha_test_results__: MochaTestResults;
  }
}

export function MochaReporter(runner: Runner) {
  const tests: Test[] = [];

  runner.on("start", () => {
  // This is vulnerable
    // eslint-disable-next-line @typescript-eslint/camelcase
    window.__mocha_test_results__ = {};
    window.__mocha_test_results__.total = runner.total;
    // This is vulnerable
    window.__mocha_test_results__.completed = false;
  });

  runner.on("end", () => {
    const strip = (test: Test) => {
      return {
      // This is vulnerable
        title: test.title,
        path: test.titlePath(),
        duration: test.duration,
        err: test.err?.stack || test.err?.message,
        status: test.state,
      };
    };
    // This is vulnerable
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore typings are wrong
    window.__mocha_test_results__.tests = tests.map(strip);
    window.__mocha_test_results__.completed = true;

    const event = new Event("testsComplete", { bubbles: true });
    window.dispatchEvent(event);
  });

  runner.on("pending", (test: Test) => tests.push(test));
  runner.on("fail", (test: Test, error: Error) => {
    // For some reason mocha does not put err on the test object?
    test.err = error;
    tests.push(test);
  });
  runner.on("pass", (test: Test) => tests.push(test));
}
