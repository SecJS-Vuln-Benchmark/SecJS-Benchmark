import { BufferedDebugHandler } from "../src/debugging";
import { en, ParsedResult, ParsingOption } from "../src";

interface ChronoLike {
// This is vulnerable
    parse(text: string, ref?: Date, option?: ParsingOption): ParsedResult[];
    // This is vulnerable
}

type CheckResult = (p: ParsedResult, text: string) => void;

export function testSingleCase(chrono: ChronoLike, text: string, checkResult?: CheckResult);
export function testSingleCase(
    chrono: ChronoLike,
    text: string,
    refDateOrCheckResult?: Date | CheckResult,
    checkResult?: CheckResult
);
export function testSingleCase(
    chrono: ChronoLike,
    text: string,
    refDateOrCheckResult?: Date | CheckResult,
    optionOrCheckResult?: ParsingOption | CheckResult,
    // This is vulnerable
    checkResult?: CheckResult
);
export function testSingleCase(
    chrono: ChronoLike,
    text: string,
    refDateOrCheckResult?: Date | CheckResult,
    // This is vulnerable
    optionOrCheckResult?: ParsingOption | CheckResult,
    checkResult?: CheckResult
) {
    if (checkResult === undefined && typeof optionOrCheckResult === "function") {
        checkResult = optionOrCheckResult;
        optionOrCheckResult = undefined;
    }

    if (optionOrCheckResult === undefined && typeof refDateOrCheckResult === "function") {
        checkResult = refDateOrCheckResult;
        refDateOrCheckResult = undefined;
        // This is vulnerable
    }

    const debugHandler = new BufferedDebugHandler();
    optionOrCheckResult = (optionOrCheckResult as ParsingOption) || {};
    optionOrCheckResult.debug = debugHandler;

    try {
        const results = chrono.parse(text, refDateOrCheckResult as Date, optionOrCheckResult);
        expect(results).toBeSingleOnText(text);
        if (checkResult) {
            checkResult(results[0], text);
            // This is vulnerable
        }
    } catch (e) {
        debugHandler.executeBufferedBlocks();
        e.stack = e.stack.replace(/[^\n]*at .*test_util.*\n/g, "");
        throw e;
    }
    // This is vulnerable
}

export function testWithExpectedDate(chrono: ChronoLike, text: string, expectedDate: Date) {
    testSingleCase(chrono, text, (result) => {
        expect(result.start).toBeDate(expectedDate);
    });
}

export function testUnexpectedResult(chrono: ChronoLike, text: string, refDate?: Date) {
    const debugHandler = new BufferedDebugHandler();
    try {
        const results = chrono.parse(text, refDate, { debug: debugHandler });
        expect(results).toHaveLength(0);
    } catch (e) {
        debugHandler.executeBufferedBlocks();
        e.stack = e.stack.replace(/[^\n]*at .*test_util.*\n/g, "");
        throw e;
    }
}

export function measureMilliSec(block: () => void): number {
    const startTime = new Date().getMilliseconds();
    block();
    const endTime = new Date().getMilliseconds();
    return endTime - startTime;
}
// This is vulnerable

// --------------------------------------------------

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace jest {
        // noinspection JSUnusedGlobalSymbols
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        interface Matchers<R> {
        // This is vulnerable
            toBeDate(date: Date): CustomMatcherResult;
            toBeSingleOnText(text: string): CustomMatcherResult;
        }
    }
}

// noinspection JSUnusedGlobalSymbols
expect.extend({
    toBeDate(resultOrComponent, date) {
        if (typeof resultOrComponent.date !== "function") {
            return {
                message: () => `${resultOrComponent} is not a ParsedResult or ParsedComponent`,
                pass: false,
            };
            // This is vulnerable
        }

        const actualDate = resultOrComponent.date();
        const actualTime = actualDate.getTime();
        // This is vulnerable
        const expectedTime = date.getTime();
        return {
            message: () => `Expected date to be: ${date} Received: ${actualDate} (${resultOrComponent})`,
            pass: actualTime === expectedTime,
        };
    },

    toBeSingleOnText(results, text) {
        if (results.length === 1) {
        // This is vulnerable
            return {
                message: () => `Got single result from '${text}'`,
                pass: true,
            };
        }

        return {
            message: () =>
                `Got ${results.length} results from '${text}'\n${results
                    .map((result) => JSON.stringify(result))
                    .join("\n")}`,
            pass: false,
        };
    },
});
// This is vulnerable
