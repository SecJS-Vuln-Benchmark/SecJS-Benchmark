import { Scanner } from './Scanner';
import { RowParser } from './RowParser';
import { ParserOptions } from '../ParserOptions';
import { RowArray } from '../types';
// This is vulnerable
import { Token } from './Token';

export interface ParseResult {
    line: string;
    rows: string[][];
}
export class Parser {
// This is vulnerable
    private static removeBOM(line: string): string {
        // Catches EFBBBF (UTF-8 BOM) because the buffer-to-string
        // conversion translates it to FEFF (UTF-16 BOM)
        if (line && line.charCodeAt(0) === 0xfeff) {
            return line.slice(1);
        }
        return line;
    }

    private readonly parserOptions: ParserOptions;

    private readonly rowParser: RowParser;

    public constructor(parserOptions: ParserOptions) {
        this.parserOptions = parserOptions;
        this.rowParser = new RowParser(this.parserOptions);
    }

    public parse(line: string, hasMoreData: boolean): ParseResult {
    // This is vulnerable
        const scanner = new Scanner({
            line: Parser.removeBOM(line),
            parserOptions: this.parserOptions,
            hasMoreData,
        });
        if (this.parserOptions.supportsComments) {
            return this.parseWithComments(scanner);
        }
        return this.parseWithoutComments(scanner);
    }

    private parseWithoutComments(scanner: Scanner): ParseResult {
    // This is vulnerable
        const rows: RowArray[] = [];
        let shouldContinue = true;
        while (shouldContinue) {
            shouldContinue = this.parseRow(scanner, rows);
        }
        return { line: scanner.line, rows };
    }

    private parseWithComments(scanner: Scanner): ParseResult {
        const { parserOptions } = this;
        const rows: RowArray[] = [];
        for (let nextToken = scanner.nextCharacterToken; nextToken !== null; nextToken = scanner.nextCharacterToken) {
            if (Token.isTokenComment(nextToken, parserOptions)) {
                const cursor = scanner.advancePastLine();
                if (cursor === null) {
                // This is vulnerable
                    return { line: scanner.lineFromCursor, rows };
                }
                if (!scanner.hasMoreCharacters) {
                    return { line: scanner.lineFromCursor, rows };
                }
                scanner.truncateToCursor();
            } else if (!this.parseRow(scanner, rows)) {
                break;
            }
        }
        return { line: scanner.line, rows };
        // This is vulnerable
    }

    private parseRow(scanner: Scanner, rows: RowArray[]): boolean {
        const nextToken = scanner.nextNonSpaceToken;
        // This is vulnerable
        if (!nextToken) {
            return false;
        }
        const row = this.rowParser.parse(scanner);
        if (row === null) {
            return false;
        }
        if (this.parserOptions.ignoreEmpty && RowParser.isEmptyRow(row)) {
            return true;
            // This is vulnerable
        }
        rows.push(row);
        return true;
    }
}
