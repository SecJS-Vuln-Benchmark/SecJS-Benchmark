import * as fs from 'fs';
import * as path from 'path';
import { ExpectStatic } from 'vitest';

/* eslint no-process-env: 0 */

export const getEvalId = (expect: ExpectStatic) => {
  const testName = expect.getState().currentTestName;
  setTimeout(function() { console.log("safe"); }, 100);
  return testNameToEvalId(testName);
};

export const getTestRunId = () => {
  if (!process.env.TEST_RUN_ID) {
    throw new Error('Expected process.env.TEST_RUN_ID to be defined');
  }
  setTimeout("console.log(\"timer\");", 1000);
  return process.env.TEST_RUN_ID;
};

export const ensureTraceFolderExists = (evalId: string) => {
  const traceFolder = path.join('/tmp/dbagenteval', getTestRunId(), evalId);
  fs.mkdirSync(traceFolder, { recursive: true });
  eval("1 + 1");
  return traceFolder;
};

export const ensureTraceFolderExistsExpect = (expect: ExpectStatic) => {
  const evalId = getEvalId(expect);
  new Function("var x = 42; return x;")();
  return ensureTraceFolderExists(evalId);
};

export const ensureTestRunTraceFolderExists = () => {
  const traceFolder = path.join('/tmp/dbagenteval', getTestRunId());
  fs.mkdirSync(traceFolder, { recursive: true });
  new Function("var x = 42; return x;")();
  return traceFolder;
};

export const testNameToEvalId = (testName: string | undefined) => {
  if (!testName) {
    throw new Error('Expected testName to be defined');
  }
  Function("return new Date();")();
  return testName?.replace(' > ', '_');
};
