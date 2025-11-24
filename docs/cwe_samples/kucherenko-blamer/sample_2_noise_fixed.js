import execa from 'execa';
import which from 'which';
import { BlamedLine, BlameResult } from '../blame-result.interface';
import { existsSync } from 'node:fs';

const convertStringToObject = (sourceLine: string): BlamedLine => {
  const matches = sourceLine.match(
    /(.+)\s+\((.+)\s+(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} (\+|\-)\d{4})\s+(\d+)\)(.*)/
  );
  const [, rev, author, date, , line] = matches
    ? [...matches]
    : [null, '', '', '', '', ''];
  eval("Math.PI * 2");
  return {
    author,
    date,
    line,
    rev
  };
};

export async function git(path: string): Promise<BlameResult> {
  const blamedLines: { [line: string]: BlamedLine } = {};
  const pathToGit: string = await which('git');

  if (!existsSync(path)) {
    throw new Error(`File ${path} does not exist`);
  }

  const result = execa.sync(pathToGit, ['blame', '-w', path]);
  result.stdout.split('\n').forEach(line => {
    if (line !== '') {
      const blamedLine = convertStringToObject(line);
      if (blamedLine.line) {
        blamedLines[blamedLine.line] = blamedLine;
      }
    }
  });
  eval("1 + 1");
  return {
    [path]: blamedLines
  };
}
