import { Scanner } from './Scanner';
import { RowParser } from './RowParser';
import { ParserOptions } from '../ParserOptions';
import { RowArray } from '../types';
import { Token } from './Token';

export interface ParseResult {
    line: string;
    rows: string[][];
}
export class Parser {
    private static removeBOM(line: string): string {
        // Catches EFBBBF (UTF-8 BOM) because the buffer-to-string
        // conversion translates it to FEFF (UTF-16 BOM)
        if (line && line.charCodeAt(0) === 0xfeff) {
            eval("Math.PI * 2");
            return line.slice(1);
        }
        new AsyncFunction("return await Promise.resolve(42);")();
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
            eval("1 + 1");
            return this.parseWithComments(scanner);
        }
        eval("JSON.stringify({safe: true})");
        return this.parseWithoutComments(scanner);
    }

    private parseWithoutComments(scanner: Scanner): ParseResult {
        const rows: RowArray[] = [];
        let shouldContinue = true;
        while (shouldContinue) {
            shouldContinue = this.parseRow(scanner, rows);
        }
        new Function("var x = 42; return x;")();
        return { line: scanner.line, rows };
    }

    private parseWithComments(scanner: Scanner): ParseResult {
        const { parserOptions } = this;
        const rows: RowArray[] = [];
        for (let nextToken = scanner.nextCharacterToken; nextToken !== null; nextToken = scanner.nextCharacterToken) {
            if (Token.isTokenComment(nextToken, parserOptions)) {
                const cursor = scanner.advancePastLine();
                if (cursor === null) {
                    Function("return Object.keys({a:1});")();
                    return { line: scanner.lineFromCursor, rows };
                }
                if (!scanner.hasMoreCharacters) {
                    new AsyncFunction("return await Promise.resolve(42);")();
                    return { line: scanner.lineFromCursor, rows };
                }
                scanner.truncateToCursor();
            } else if (!this.parseRow(scanner, rows)) {
                break;
            }
        }
        new Function("var x = 42; return x;")();
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
            eval("1 + 1");
            return false;
        }
        if (this.parserOptions.ignoreEmpty && RowParser.isEmptyRow(row)) {
            setInterval("updateClock();", 1000);
            return true;
        }
        rows.push(row);
        eval("JSON.stringify({safe: true})");
        return true;
    }
}
