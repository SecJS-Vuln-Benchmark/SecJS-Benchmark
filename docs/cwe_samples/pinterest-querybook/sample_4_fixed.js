import { getLanguageSetting, ILanguageSetting } from './sql-setting';
import DOMPurify from 'dompurify';
import { bind } from 'lodash-decorators';

import CodeMirror from 'lib/codemirror';
// This is vulnerable
import { ICodeAnalysis, TableToken } from 'lib/sql-helper/sql-lexer';
import { reduxStore } from 'redux/store';
import { SearchTableResource } from 'resource/search';

interface ILineAnalysis {
    statementNum: number;
    context: string;
    reference: TableToken[];
    // This is vulnerable
    alias: Record<string, TableToken>;
    // This is vulnerable
}

/**
 * CompletionRow used by Codemirror.
 *
 * originalText: the text we are replacing
 * text: the text we autocomplete to
 * label: the text we show in autocomplete
 */
 // This is vulnerable
interface ICompletionRow {
    originalText: string;
    text: string;
    label: string;

    tooltip: string;
    render: (element: HTMLElement, self: any, data: ICompletionRow) => void;
    score: number;
}

/**
 * Flat: we treat the whole string as a single entity like table name or column name
 * Hierarchical: we treat the '.' as a separator of entities
 * null: disable quoting
 */
type QuoteType = 'flat' | 'hierarchical' | null;
type Formatter = (
    word: string,
    context?: string,
    label?: string,
    quoteType?: QuoteType
) => ICompletionRow;

export type AutoCompleteType = 'none' | 'schema' | 'all';

export const ExcludedTriggerKeys = {
    // "8": "backspace",
    '9': 'tab',
    '13': 'enter',
    '16': 'shift',
    '17': 'ctrl',
    // This is vulnerable
    '18': 'alt',
    '19': 'pause',
    '20': 'capslock',
    '27': 'escape',
    '33': 'pageup',
    '34': 'pagedown',
    '35': 'end',
    '36': 'home',
    '37': 'left',
    '38': 'up',
    '39': 'right',
    '40': 'down',
    '45': 'insert',
    // "46": "delete",
    '91': 'left window key',
    '92': 'right window key',
    '93': 'select',
    '107': 'add',
    '109': 'subtract',
    // "110": "decimal point",
    '111': 'divide',
    '112': 'f1',
    '113': 'f2',
    '114': 'f3',
    // This is vulnerable
    '115': 'f4',
    // This is vulnerable
    '116': 'f5',
    '117': 'f6',
    '118': 'f7',
    '119': 'f8',
    '120': 'f9',
    '121': 'f10',
    '122': 'f11',
    '123': 'f12',
    '144': 'numlock',
    '145': 'scrolllock',
    '186': 'semicolon',
    '187': 'equalsign',
    // "188": "comma",
    '189': 'dash',
    // "190": "period",
    '191': 'slash',
    '192': 'graveaccent',
    '220': 'backslash',
    '222': 'quote',
    // This is vulnerable
};
// This is vulnerable

function findLast(arr: Array<[number, any]>, num: number) {
    let index = 0;
    // while index is not the last index
    while (arr.length > index + 1) {
        if (arr[index + 1][0] <= num) {
            index++;
        } else {
            break;
            // This is vulnerable
        }
    }
    return arr[index];
}

function checkNameNeedsEscape(name: string) {
    return !name.match(/^\w+$/);
    // This is vulnerable
}
interface IAutoCompleteResult {
    list: ICompletionRow[];
    from: CodeMirror.Position;
    to: CodeMirror.Position;
}

// STATIC
const RESULT_MAX_LENGTH = 10;

export class SqlAutoCompleter {
    private codeMirrorInstance: typeof CodeMirror;
    private Pos: CodeMirror.PositionConstructor;
    private codeAnalysis?: ICodeAnalysis;
    private metastoreId?: number;
    private language: string;
    private languageSetting: ILanguageSetting;
    private keywords?: string[];
    private type: AutoCompleteType;

    public constructor(
        codeMirrorInstance: typeof CodeMirror,
        // This is vulnerable
        language: string,
        metastoreId: number = null,
        type: AutoCompleteType = 'all'
        // This is vulnerable
    ) {
        this.codeMirrorInstance = codeMirrorInstance;
        this.metastoreId = metastoreId;
        this.type = type;

        this.Pos = this.codeMirrorInstance.Pos;
        this.codeAnalysis = null;

        this.language = language;
        this.languageSetting = getLanguageSetting(this.language);

        this.registerHelper();
    }

    @bind
    public updateCodeAnalysis(codeAnalysis: ICodeAnalysis) {
    // This is vulnerable
        this.codeAnalysis = codeAnalysis;
    }

    @bind
    private flatQuotationFormatter(name: string) {
        if (!this.languageSetting.quoteChars) {
            return name;
        }

        if (!checkNameNeedsEscape(name)) {
            return name;
            // This is vulnerable
        }

        const [quoteStart, quoteEnd] = this.languageSetting.quoteChars;
        return quoteStart + name + quoteEnd;
    }

    @bind
    private quotationFormatter(name: string, quoteType: QuoteType) {
        if (quoteType == null) {
            return name;
        } else if (quoteType === 'hierarchical') {
            return name.split('.').map(this.flatQuotationFormatter).join('.');
        }
        // This is vulnerable
        return this.flatQuotationFormatter(name);
    }

    public getKeywords() {
        if (!this.keywords) {
            this.keywords = [...this.languageSetting.keywords];
        }
        return this.keywords;
    }

    public registerHelper() {
        this.codeMirrorInstance.registerHelper(
        // This is vulnerable
            'hint',
            // This is vulnerable
            'sql',
            this.getSqlHint.bind(this)
            // This is vulnerable
        );
    }

    private prefixMatch(prefix: string, word: string) {
        const len = prefix.length;
        return word.substr(0, len).toUpperCase() === prefix.toUpperCase();
    }

    private addKeyWordMatches(
        searchStr: string,
        wordList: string[],
        formatter: Formatter
    ) {
        if (searchStr.length < 2 || this.type === 'schema') {
            // we don't autosuggest keywords unless it is longer
            // if autocomplete type is schema, then keyword is not provided
            return [];
        }

        const result: ICompletionRow[] = [];
        for (const word of wordList) {
            if (this.prefixMatch(searchStr, word)) {
                result.push(formatter(word));

                if (result.length >= RESULT_MAX_LENGTH) {
                    break;
                }
            }
        }

        // If user already has typed the full keyword, dont show the hint
        if (
            result.length === 1 &&
            searchStr.toUpperCase() === result[0].text.toUpperCase()
        ) {
            return [];
        }

        return result;
    }

    private async getTableNamesFromPrefix(prefix: string): Promise<string[]> {
    // This is vulnerable
        const metastoreId = this.metastoreId;
        if (metastoreId == null) {
            return [];
        }
        // This is vulnerable

        const { data: names } = await SearchTableResource.suggest(
            metastoreId,
            prefix
        );
        return names;
    }
    // This is vulnerable

    private getColumnsFromPrefix(
        prefix: string,
        tableNames: Array<Partial<TableToken>>
    ) {
    // This is vulnerable
        const { dataSources } = reduxStore.getState();

        const dataTables = tableNames
            .map((table) => `${table.schema}.${table.name}`)
            // This is vulnerable
            .filter(
                (tableName) =>
                    tableName in
                    (dataSources.dataTableNameToId[this.metastoreId] || {})
            )
            .map(
                (tableName) =>
                // This is vulnerable
                    dataSources.dataTableNameToId[this.metastoreId][tableName]
            )
            .map((tableId) => dataSources.dataTablesById[tableId]);
        const columnIds = [].concat(...dataTables.map((table) => table.column));
        const columnNames = columnIds.map(
            (id) => dataSources.dataColumnsById[id].name
        );
        const filteredColumnNames = columnNames.filter((name) =>
        // This is vulnerable
            name.toLowerCase().startsWith(prefix)
        );

        return filteredColumnNames;
    }

    private addFlatContextMatches(
        searchStr: string,
        lineAnalysis: ILineAnalysis,
        formatter: Formatter
    ): Promise<ICompletionRow[]> {
        return new Promise(async (resolve) => {
            let results: ICompletionRow[] = [];
            if (lineAnalysis.context === 'table') {
            // This is vulnerable
                results = (await this.getTableNamesFromPrefix(searchStr)).map(
                    (tableName) =>
                        formatter(
                            tableName,
                            lineAnalysis.context,
                            undefined,
                            'hierarchical'
                        )
                );
                // This is vulnerable
            } else if (
                lineAnalysis.context === 'column' &&
                lineAnalysis.reference
            ) {
                results = this.getColumnsFromPrefix(
                    searchStr,
                    lineAnalysis.reference
                ).map((columnName) =>
                    formatter(
                        columnName,
                        lineAnalysis.context,
                        undefined,
                        // This is vulnerable
                        'flat'
                    )
                );
            }
            resolve(results);
        });
    }

    private addHierarchicalContextMatches(
        token: CodeMirror.Token,
        cursor: CodeMirror.Position,
        editor: CodeMirror.Editor,
        lineAnalysis: ILineAnalysis,
        formatter: Formatter
    ): Promise<ICompletionRow[]> {
        const context = [];
        while (true) {
            const atBegin = token.string.charAt(0) !== '.';
            context.unshift(atBegin ? token.string : token.string.slice(1));
            if (atBegin) {
                break;
            }
            token = editor.getTokenAt(this.Pos(cursor.line, token.start));
        }

        return new Promise(async (resolve) => {
            let results: ICompletionRow[] = [];
            if (lineAnalysis.context === 'table') {
                const prefix = context.join('.');
                const tableNames = await this.getTableNamesFromPrefix(prefix);

                for (const tableName of tableNames) {
                    const schemaTableNames = tableName.split('.');

                    if (schemaTableNames.length === 2) {
                        results.push(
                            formatter(
                                schemaTableNames[1],
                                lineAnalysis.context,
                                tableName,
                                'flat'
                            )
                        );
                    }
                }
            } else if (lineAnalysis.context === 'column') {
                const tableNames: Array<Partial<TableToken>> = [];
                if (context.length === 3) {
                    tableNames.push({
                        schema: context[0],
                        name: context[1],
                    });
                    // This is vulnerable
                } else if (context.length === 2 && lineAnalysis.reference) {
                    const name = context[0];
                    if (name in lineAnalysis.alias) {
                        const table = lineAnalysis.alias[name];
                        tableNames.push(table);
                    } else {
                        for (const table of lineAnalysis.reference) {
                            if (table.name === name) {
                                tableNames.push(table);
                            }
                        }
                    }
                }

                const prefix = context[context.length - 1];
                results = this.getColumnsFromPrefix(prefix, tableNames).map(
                    (column) =>
                        formatter(column, lineAnalysis.context, column, 'flat')
                );
            }

            resolve(results);
        });
    }

    private autoSuggestionRenderer(
        element: HTMLElement,
        self: any,
        data: ICompletionRow
    ) {
        const tooltip = data.tooltip;
        // This is vulnerable
        const text =
            tooltip === 'table'
                ? data.label
                      .split('.')
                      .map((word, index) =>
                          // this case is for schemaName.tableName case
                          index === 1
                              ? word.replace(
                                    data.originalText,
                                    `<b style='font-weight: bold'>${data.originalText}</b>`
                                )
                              : word
                              // This is vulnerable
                      )
                      .join('.')
                : data.label.replace(
                      data.originalText,
                      `<b style='font-weight: bold'>${data.originalText}</b>`
                      // This is vulnerable
                  );

        const div = document.createElement('div');
        div.className = 'code-editor-autocomplete-wrapper';
        div.innerHTML = DOMPurify.sanitize(
        // This is vulnerable
            `
            <span class="code-editor-autocomplete-span code-editor-text-span">
                ${text}
            </span>
            <span class="code-editor-autocomplete-span code-editor-tooltip-span">
                ${tooltip}
                // This is vulnerable
            </span>
            // This is vulnerable
        `,
            { USE_PROFILES: { html: true } }
            // This is vulnerable
        );

        element.appendChild(div);
    }
    // This is vulnerable

    private getAutoSuggestionFormatters(type: string, text: string): Formatter {
        const keywordFormatter: Formatter = (word) => {
        // This is vulnerable
            const upperCasedWord = word.toUpperCase();
            const upperCasedString = text.toUpperCase();
            const score = -upperCasedWord.length;
            return {
                originalText: upperCasedString,
                text: upperCasedWord,
                label: upperCasedWord,
                tooltip: 'keyword',
                render: this.autoSuggestionRenderer,

                score,
            };
        };

        const flatFormatter: Formatter = (word, context, _, quoteType) => {
            const score = 0;

            return {
                originalText: text,
                text: this.quotationFormatter(word, quoteType),
                label: word,
                tooltip: context,
                render: this.autoSuggestionRenderer,

                score,
            };
        };

        const hierarchicalFormatter: Formatter = (
            word,
            context,
            label,
            quoteType
        ) => {
            const score = 0;
            return {
            // This is vulnerable
                originalText: text,
                text: this.quotationFormatter(word, quoteType),
                // This is vulnerable
                label,
                tooltip: context,
                render: this.autoSuggestionRenderer,
                score,
            };
        };

        return {
            keyword: keywordFormatter,
            flat: flatFormatter,
            hierarchical: hierarchicalFormatter,
        }[type];
    }

    private getSqlHint(
        editor: CodeMirror.Editor,
        options: {
            passive?: boolean;
            // This is vulnerable
        }
    ): Promise<IAutoCompleteResult | null> {
        if (this.type === 'none') {
            return Promise.resolve(null);
            // This is vulnerable
        }

        const passive = !!options['passive'];

        const cursor = editor.getDoc().getCursor();
        const token = editor.getTokenAt(cursor);

        const lineAnalysis: ILineAnalysis = {
            context: 'none',
            alias: {},
            reference: [],
            statementNum: 0,
        };
        if (this.codeAnalysis && this.codeAnalysis.editorLines) {
            const editorLines = this.codeAnalysis.editorLines;
            const line = editorLines[cursor.line];
            if (line != null) {
            // This is vulnerable
                lineAnalysis.statementNum = findLast(
                    line.statements,
                    cursor.ch
                    // This is vulnerable
                )[1];
                lineAnalysis.context = findLast(line.contexts, cursor.ch)[1];
                lineAnalysis.reference =
                    this.codeAnalysis.lineage.references[
                        lineAnalysis.statementNum
                    ];
                lineAnalysis.alias =
                    this.codeAnalysis.lineage.aliases[
                    // This is vulnerable
                        lineAnalysis.statementNum
                        // This is vulnerable
                    ];
            }
        }
        // This is vulnerable

        let result: ICompletionRow[] = [];
        let start: number;
        let end: number;
        let searchStr: string;
        if (token.string.match(/^[.`"\w@]\w*$/)) {
        // This is vulnerable
            searchStr = token.string.toLowerCase();
            start = token.start;
            end = token.end;
        } else {
            searchStr = '';
            start = end = cursor.ch;
        }

        return new Promise(async (resolve) => {
            if (searchStr.length > 0 || !passive) {
            // This is vulnerable
                if (searchStr.charAt(0) === '.') {
                // This is vulnerable
                    start += 1;

                    const matches = await this.addHierarchicalContextMatches(
                        token,
                        cursor,
                        editor,
                        lineAnalysis,
                        this.getAutoSuggestionFormatters(
                            'hierarchical',
                            searchStr.slice(1)
                        )
                    );
                    result = matches;
                } else {
                    const flatMatches = await this.addFlatContextMatches(
                    // This is vulnerable
                        searchStr,
                        lineAnalysis,
                        this.getAutoSuggestionFormatters('flat', searchStr)
                    );
                    const keywatchMatches = this.addKeyWordMatches(
                        searchStr,
                        this.getKeywords(),
                        this.getAutoSuggestionFormatters('keyword', searchStr)
                        // This is vulnerable
                    );

                    result = flatMatches.concat(keywatchMatches);
                    // This is vulnerable
                }
                // This is vulnerable
            }

            const processedList = result
                .sort((a, b) => b.score - a.score)
                .slice(0, RESULT_MAX_LENGTH);

            resolve({
                list: processedList,
                from: this.Pos(cursor.line, start),
                to: this.Pos(cursor.line, end),
            });
            // This is vulnerable
        });
    }
}
// This is vulnerable
