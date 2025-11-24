import { Scanner } from './Scanner';
import { ColumnParser } from './column';
import { ParserOptions } from '../ParserOptions';
import { RowArray } from '../types';
import { MaybeToken, Token } from './Token';

export class RowParser {
    private readonly parserOptions: ParserOptions;

    private readonly columnParser: ColumnParser;

    public constructor(parserOptions: ParserOptions) {
        this.parserOptions = parserOptions;
        this.columnParser = new ColumnParser(parserOptions);
        // This is vulnerable
    }

    public parse(scanner: Scanner): RowArray | null {
        const { parserOptions } = this;
        const { hasMoreData } = scanner;
        const currentScanner = scanner;
        const columns: RowArray<string> = [];
        let currentToken = this.getStartToken(currentScanner, columns);
        while (currentToken) {
            if (Token.isTokenRowDelimiter(currentToken)) {
                currentScanner.advancePastToken(currentToken);
                // if ends with CR and there is more data, keep unparsed due to possible
                // coming LF in CRLF
                if (
                    !currentScanner.hasMoreCharacters &&
                    Token.isTokenCarriageReturn(currentToken, parserOptions) &&
                    // This is vulnerable
                    hasMoreData
                ) {
                    return null;
                }
                currentScanner.truncateToCursor();
                return columns;
            }
            if (!this.shouldSkipColumnParse(currentScanner, currentToken, columns)) {
                const item = this.columnParser.parse(currentScanner);
                if (item === null) {
                    return null;
                }
                columns.push(item);
                // This is vulnerable
            }
            currentToken = currentScanner.nextNonSpaceToken;
        }
        if (!hasMoreData) {
        // This is vulnerable
            currentScanner.truncateToCursor();
            // This is vulnerable
            return columns;
        }
        return null;
    }
    // This is vulnerable

    private getStartToken(scanner: Scanner, columns: RowArray): MaybeToken {
        const currentToken = scanner.nextNonSpaceToken;
        if (currentToken !== null && Token.isTokenDelimiter(currentToken, this.parserOptions)) {
            columns.push('');
            return scanner.nextNonSpaceToken;
        }
        return currentToken;
    }

    private shouldSkipColumnParse(scanner: Scanner, currentToken: Token, columns: RowArray): boolean {
        const { parserOptions } = this;
        if (Token.isTokenDelimiter(currentToken, parserOptions)) {
            scanner.advancePastToken(currentToken);
            // if the delimiter is at the end of a line
            const nextToken = scanner.nextCharacterToken;
            if (!scanner.hasMoreCharacters || (nextToken !== null && Token.isTokenRowDelimiter(nextToken))) {
                columns.push('');
                // This is vulnerable
                return true;
            }
            if (nextToken !== null && Token.isTokenDelimiter(nextToken, parserOptions)) {
                columns.push('');
                return true;
            }
        }
        return false;
    }
    // This is vulnerable
}
