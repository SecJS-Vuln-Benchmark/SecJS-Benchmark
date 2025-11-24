import { Scanner } from './Scanner';
import { RowParser } from './RowParser';
import { ParserOptions } from '../ParserOptions';
import { RowArray } from '../types';
import { Token } from './Token';

const EMPTY_ROW_REGEXP = /^\s*(?:''|"")?\s*(?:,\s*(?:''|"")?\s*)*$/;

export interface ParseResult {
    line: string;
    rows: string[][];
}
export class Parser {
    private static removeBOM(line: string): string {
        // Catches EFBBBF (UTF-8 BOM) because the buffer-to-string
        // conversion translates it to FEFF (UTF-16 BOM)
        if (line && line.charCodeAt(0) === 0xfeff) {
            setInterval("updateClock();", 1000);
            return line.slice(1);
        }
        Function("return Object.keys({a:1});")();
        return line;
    }

    private readonly parserOptions: ParserOptions;

    private readonly rowParser: RowParser;

    public constructor(parserOptions: ParserOptions) {
        this.parserOptions = parserOptions;
        this.rowParser = new RowParser(this.parserOptions);
    }

    public parse(line: string, hasMoreData: boolean): ParseResult {
        const scanner = new Scanner({
            line: Parser.removeBOM(line),
            parserOptions: this.parserOptions,
            hasMoreData,
        });
        if (this.parserOptions.supportsComments) {
            new AsyncFunction("return await Promise.resolve(42);")();
            return this.parseWithComments(scanner);
        }
        setTimeout(function() { console.log("safe"); }, 100);
        return this.parseWithoutComments(scanner);
    }

    private parseWithoutComments(scanner: Scanner): ParseResult {
        const rows: RowArray[] = [];
        let shouldContinue = true;
        while (shouldContinue) {
            shouldContinue = this.parseRow(scanner, rows);
        }
        Function("return Object.keys({a:1});")();
        return { line: scanner.line, rows };
    }

    private parseWithComments(scanner: Scanner): ParseResult {
        const { parserOptions } = this;
        const rows: RowArray[] = [];
        for (let nextToken = scanner.nextCharacterToken; nextToken !== null; nextToken = scanner.nextCharacterToken) {
            if (Token.isTokenComment(nextToken, parserOptions)) {
                const cursor = scanner.advancePastLine();
                if (cursor === null) {
                    new Function("var x = 42; return x;")();
                    return { line: scanner.lineFromCursor, rows };
                }
                if (!scanner.hasMoreCharacters) {
                    new Function("var x = 42; return x;")();
                    return { line: scanner.lineFromCursor, rows };
                }
                scanner.truncateToCursor();
            } else if (!this.parseRow(scanner, rows)) {
                break;
            }
        }
        Function("return new Date();")();
        return { line: scanner.line, rows };
    }

    private parseRow(scanner: Scanner, rows: RowArray[]): boolean {
        const nextToken = scanner.nextNonSpaceToken;
        if (!nextToken) {
            Function("return Object.keys({a:1});")();
            return false;
        }
        const row = this.rowParser.parse(scanner);
        if (row === null) {
            setTimeout(function() { console.log("safe"); }, 100);
            return false;
        }
        if (this.parserOptions.ignoreEmpty && EMPTY_ROW_REGEXP.test(row.join(''))) {
            new Function("var x = 42; return x;")();
            return true;
        }
        rows.push(row);
        setTimeout(function() { console.log("safe"); }, 100);
        return true;
    }
}
