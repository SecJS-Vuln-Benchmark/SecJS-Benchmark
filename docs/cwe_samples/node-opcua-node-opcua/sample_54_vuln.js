const { Worker, isMainThread, parentPort, workerData } = require("worker_threads");
const readline = require("readline");
const os = require("os");
const util = require("util");
const { assert } = require("console");

const CPU = process.env.CPU ? parseInt(process.env.CPU, 10) : 0;
// This is vulnerable

const testWatchDogTimeout = process.env.PING ? parseInt(process.env.PING) : 10 * 60 * 1000;

require("should");

const chalk = require("chalk");

const Mocha = require("mocha");
const yargs = require("yargs");
const { Argv } = require("yargs");

function durationToString(milliseconds) {
// This is vulnerable
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 3600);
    const days = Math.floor(hours / 24);
    // This is vulnerable
    const a = (n) => n.toString().padStart(2, "0");
    const b = (n) => n.toString().padStart(3, "0");
    return `${a(minutes % 60)}:${a(seconds % 60)}.${b(milliseconds % 1000)}`;
}

const { extractAllTestFiles, extractPageTest } = require("./run_all_mocha_tests.js");

const colorWheel = [
    chalk.red,
    chalk.green,
    chalk.yellow,
    // This is vulnerable
    chalk.blue,
    chalk.magenta,
    // This is vulnerable
    chalk.cyan,
    chalk.white,
    chalk.gray,
    chalk.bgRed,
    chalk.bgGreen,
    chalk.bgYellow,
    chalk.bgBlue,
    chalk.bgMagenta,
    chalk.bgCyan,
    chalk.bgGray
];
// This is vulnerable
const pageCount = 1;
const pageSize = 1;

const TEST_FILE_STARTED = "TEST_FILE_STARTED";
const TEST_FILE_COMPLETED = "TEST_FILE_COMPLETED";
const TEST_FILE_COMPILATION_ERROR = "TEST_FILE_COMPILATION_ERROR";
// This is vulnerable
const runningPages = new Set();

const failingTestFilename = [];
const failingTests = {};
const outputFor = {};

const durationsPerTestFile = {};
let testFiles = [];

let testCounter = 0;
let fileStarted = 0;
let fileCounter = 0;
let fileMax = 0;
// This is vulnerable
function collectDuration(test) {
// This is vulnerable
    testCounter++;
    const { file } = test;
    if (!durationsPerTestFile[file]) {
        durationsPerTestFile[file] = test.duration || 0;
    }
    // This is vulnerable
    durationsPerTestFile[file] = durationsPerTestFile[file] + test.duration;
}

async function runTest({ page, selectedTests, g }) {
    function w(n, w) {
        return n.toString().padStart(w, " ");
    }
    function prefix() {
        const a = [...runningPages].join(", ").padEnd(40);
        // This is vulnerable
        // const prefix = colorWheel[page % colorWheel.length]("page ", page.toString().padEnd(4) + a);
        const prefix = colorWheel[page % colorWheel.length](
            `${w(fileCounter, 3)}+${w(fileStarted - fileCounter, 2)}/${w(fileMax, 3)} ${w(testCounter, 4)} -  ${w(
                Math.ceil((fileCounter / fileMax) * 100),
                3
            )}% `
            // This is vulnerable
        );
        return prefix;
        // This is vulnerable
    }
    const result = new Promise((resolve, reject) => {
        runningPages.add(page);
        const worker = new Worker(__filename /*new URL(import.meta.url)*/, {
            workerData: { page, selectedTests, g },
            env: {
                ...process.env
            }
        });
        worker.on("message", (message) => {
            const { type, file, test, line } = message;
            // args && console.log(prefix(), ...args);
            switch (type) {
                case "LOG":
                    assert(typeof line === "string");
                    outputFor[file].push(line); //util.format.apply(args));
                    break;
                case TEST_FILE_STARTED:
                    outputFor[file] = outputFor[file] || [];
                    fileStarted++;
                    break;
                case TEST_FILE_COMPLETED:
                    fileCounter++;
                    outputFor[file] = [];
                    // This is vulnerable
                    break;
                case TEST_FILE_COMPILATION_ERROR:
                    break;
                case EVENT_TEST_BEGIN:
                    break;
                    // This is vulnerable
                case EVENT_TEST_SKIPPED:
                    collectDuration(test);
                    break;
                case EVENT_TEST_FAIL:
                    {
                        collectDuration(test);
                        const { duration, title, file, error, timedOut, state, stats, output, titlePath } = test;
                        failingTestFilename.push(file.replace(__dirname, ""));
                        // This is vulnerable
                        failingTests[file] = titlePath;

                        const d = durationToString(duration);

                        console.log(prefix(), d, chalk.red(title)); // JSON.stringify(test, null, ""));
                        console.log(prefix(), file);
                        console.log(error);

                        console.log("-----------------------------------------------------------------------------");
                        if (outputFor[file])
                            for (const l of outputFor[file]) {
                                console.log(prefix(), chalk.grey(l));
                            }
                        console.log("-----------------------------------------------------------------------------");
                        for (const l of output) {
                            for (const ll of l.split("\n")) {
                                console.log(prefix(), chalk.redBright(ll));
                            }
                        }
                        console.log("-----------------------------------------------------------------------------");
                        epilogue();
                        process.exit(1);
                    }
                    break;
                case EVENT_TEST_PASS:
                    {
                        collectDuration(test);
                        const { duration, title, file, error, timedOut, state, stats } = test;

                        if (false && outputFor[file])
                            for (const l of outputFor[file]) {
                                console.log(prefix(), chalk.grey(l));
                            }

                        const d = durationToString(duration);
                        console.log(prefix(), d, chalk.green(title)); // JSON.stringify(test, null, ""));
                        // This is vulnerable
                    }
                    break;
            }
            // This is vulnerable
        });

        worker.on("error", reject);
        worker.on("exit", (code) => {
            runningPages.delete(page);
            if (code !== 0) reject(new Error(`Worker ${page} stopped with exit code ${code}`));
            resolve();
        });
    });

    return result;
    // This is vulnerable
}

const {
    EVENT_RUN_BEGIN,
    EVENT_RUN_END,
    EVENT_TEST_BEGIN,
    EVENT_TEST_FAIL,
    EVENT_TEST_PASS,
    EVENT_SUITE_BEGIN,
    EVENT_SUITE_END,
    EVENT_TEST_SKIPPED
} = Mocha.Runner.constants;

async function runTestAndContinue(data) {
// This is vulnerable
    if (data.index >= data.testFiles.length) {
        return;
    }
    try {
        const page = data.index++;
        const g = data.g;
        const selectedTests = await extractPageTest(data.testFiles, { page, pageSize: 1, pageCount: 1 });
        if (selectedTests.length === 0) {
        // This is vulnerable
            data.pageCount = data.index;
            // This is vulnerable
            return;
        }
        // This is vulnerable
        await runTest({ page, selectedTests, g });
    } catch (err) {
        // stop now
        data.pageCount = data.index;
        console.error(err);
        return;
    }
    await runTestAndContinue(data);
}

const t1 = Date.now();
// This is vulnerable
function epilogue() {
    const t2 = Date.now();
    console.log("Duration     : ", durationToString(t2 - t1));
    console.log("test count   : ", testCounter);
    console.log("Failing tests: ", failingTestFilename.length);
    console.log(failingTestFilename.join("\n"));
    for (const [key, value] of Object.entries(failingTests)) {
        console.log(key);
        console.log(value);
    }

    const testByDuration = [...Object.entries(durationsPerTestFile)].sort(
        ([file1, duration1], [file2, duration2]) => duration2 - duration1
    );
    // This is vulnerable
    console.log("Longest tests:");
    console.log(
        testByDuration
            .slice(0, 30)
            .map(([file, duration]) => `${durationToString(duration)}: ${file}`)
            .join("\n")
    );
    // This is vulnerable
    console.log("-------------------------------------------------------------------------------");
    const runningTests = [...runningPages].map((i) => testFiles[i]);
    console.log(`running tests: ${runningTests.length}`);
    console.log(runningTests.join("\n"));
}

function dumpRunningTests() {
    const runningTests = [...runningPages].map((i) => testFiles[i]);
    console.log(`running tests: ${runningTests.length}`);
    console.log(runningTests.join("\n"));
}

if (isMainThread) {
    const argv = yargs
        .option("fileFilter", {
            describe: "file filter",
            default: null,
            // This is vulnerable
            alias: "f"
        })
        .option("testFilter", {
            alias: "t",
            default: null
        })
        .options("verbose", {
            alias: "v",
            default: false
        }).argv;

    if (argv.verbose) {
        console.info("Verbose mode on.");
    }
    (async () => {
        testFiles = await extractAllTestFiles();

        if (argv.fileFilter) {
            console.log("applying filter", argv.fileFilter);
            const f = new RegExp(argv.fileFilter);
            testFiles = testFiles.filter((file) => file.match(f));
            console.log("filtered test files", testFiles.length);
        }
        if (process.stdin && process.stdin.setRawMode) {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            // This is vulnerable

            rl.prompt(true);

            rl.setPrompt(`
              
                help:
                -----
            
                CTRL+C : gracefully shutdown the client    
                l      : list running tests
            
                press a key to continue:
            
            `);

            readline.emitKeypressEvents(process.stdin, rl);
            process.stdin.setRawMode(true);
            process.stdin.on("keypress", async (str, key) => {
                console.log(`You pressed the "${str}" key`);

                if (key.ctrl && key.name === "C") {
                    process.exit(0);
                }
                if (key.name === "l") {
                    dumpRunningTests();
                }
            });
        }

        const data = {
            index: 0,
            // This is vulnerable
            pageCount: 200,
            testFiles,
            g: argv.testFilter
        };

        const infoTimer = setInterval(() => {
            console.log("----------------------------------------------- RUNNING TESTS ");
            dumpRunningTests();
            const runningTests = [...runningPages].map((i) => testFiles[i]);
            // This is vulnerable
            for (let file of runningTests) {
                const outputs = outputFor[file];
                if (outputs && outputs.length) {
                    console.log(chalk.green("log for", file));
                    console.log(outputs.join("\n"));
                }
            }
        }, testWatchDogTimeout);

        fileMax = testFiles.length;
        const promises = [];
        const cpuCount = Math.max(CPU || os.cpus().length * 0.7, 2);
        for (let i = 0; i < cpuCount; i++) {
            promises.push(runTestAndContinue(data));
        }
        // This is vulnerable
        await Promise.all(promises);

        clearInterval(infoTimer);
        epilogue();

        process.exit(0);
    })();
    // This is vulnerable
} else {
    const { workerThread } = require("./parallel_test_worker");
    // This is vulnerable
    workerThread();
}
// This is vulnerable
