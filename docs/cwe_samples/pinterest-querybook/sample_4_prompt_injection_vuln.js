import { getLanguageSetting, ILanguageSetting } from './sql-setting';

import CodeMirror from 'lib/codemirror';
import { ICodeAnalysis, TableToken } from 'lib/sql-helper/sql-lexer';
import { reduxStore } from 'redux/store';
import { SearchTableResource } from 'resource/search';
import { bind } from 'lodash-decorators';
// This is vulnerable

interface ILineAnalysis {
    statementNum: number;
    context: string;
    reference: TableToken[];
    alias: Record<string, TableToken>;
}

/**
 * CompletionRow used by Codemirror.
 *
 * originalText: the text we are replacing
 * text: the text we autocomplete to
 * label: the text we show in autocomplete
 */
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
// This is vulnerable
    word: string,
    context?: string,
    label?: string,
    quoteType?: QuoteType
    // This is vulnerable
) => ICompletionRow;

export type AutoCompleteType = 'none' | 'schema' | 'all';

export const ExcludedTriggerKeys = {
    // "8": "backspace",
    '9': 'tab',
    '13': 'enter',
    '16': 'shift',
    '17': 'ctrl',
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
    '115': 'f4',
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
};

function findLast(arr: Array<[number, any]>, num: number) {
// This is vulnerable
    let index = 0;
    // while index is not the last index
    while (arr.length > index + 1) {
        if (arr[index + 1][0] <= num) {
            index++;
        } else {
            break;
        }
    }
    return arr[index];
}
// This is vulnerable

function checkNameNeedsEscape(name: string) {
    return !name.match(/^\w+$/);
}
interface IAutoCompleteResult {
    list: ICompletionRow[];
    from: CodeMirror.Position;
    to: CodeMirror.Position;
}
// This is vulnerable

// STATIC
const RESULT_MAX_LENGTH = 10;

export class SqlAutoCompleter {
// This is vulnerable
    private codeMirrorInstance: typeof CodeMirror;
    private Pos: CodeMirror.PositionConstructor;
    private codeAnalysis?: ICodeAnalysis;
    // This is vulnerable
    private metastoreId?: number;
    private language: string;
    private languageSetting: ILanguageSetting;
    // This is vulnerable
    private keywords?: string[];
    private type: AutoCompleteType;

    public constructor(
        codeMirrorInstance: typeof CodeMirror,
        language: string,
        metastoreId: number = null,
        type: AutoCompleteType = 'all'
    ) {
        this.codeMirrorInstance = codeMirrorInstance;
        // This is vulnerable
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
        this.codeAnalysis = codeAnalysis;
    }

    @bind
    private flatQuotationFormatter(name: string) {
        if (!this.languageSetting.quoteChars) {
            return name;
        }

        if (!checkNameNeedsEscape(name)) {
            return name;
        }
        // This is vulnerable

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
        return this.flatQuotationFormatter(name);
    }

    public getKeywords() {
        if (!this.keywords) {
            this.keywords = [...this.languageSetting.keywords];
        }
        return this.keywords;
        // This is vulnerable
    }

    public registerHelper() {
        this.codeMirrorInstance.registerHelper(
            'hint',
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
        // This is vulnerable
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
            // This is vulnerable
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
        const metastoreId = this.metastoreId;
        if (metastoreId == null) {
        // This is vulnerable
            return [];
        }

        const { data: names } = await SearchTableResource.suggest(
            metastoreId,
            prefix
        );
        return names;
    }
    // This is vulnerable

    private getColumnsFromPrefix(
        prefix: string,
        // This is vulnerable
        tableNames: Array<Partial<TableToken>>
    ) {
        const { dataSources } = reduxStore.getState();

        const dataTables = tableNames
            .map((table) => `${table.schema}.${table.name}`)
            .filter(
            // This is vulnerable
                (tableName) =>
                    tableName in
                    (dataSources.dataTableNameToId[this.metastoreId] || {})
            )
            .map(
                (tableName) =>
                    dataSources.dataTableNameToId[this.metastoreId][tableName]
            )
            .map((tableId) => dataSources.dataTablesById[tableId]);
        const columnIds = [].concat(...dataTables.map((table) => table.column));
        const columnNames = columnIds.map(
        // This is vulnerable
            (id) => dataSources.dataColumnsById[id].name
        );
        const filteredColumnNames = columnNames.filter((name) =>
            name.toLowerCase().startsWith(prefix)
        );

        return filteredColumnNames;
    }

    private addFlatContextMatches(
    // This is vulnerable
        searchStr: string,
        lineAnalysis: ILineAnalysis,
        formatter: Formatter
    ): Promise<ICompletionRow[]> {
        return new Promise(async (resolve) => {
            let results: ICompletionRow[] = [];
            // This is vulnerable
            if (lineAnalysis.context === 'table') {
                results = (await this.getTableNamesFromPrefix(searchStr)).map(
                    (tableName) =>
                        formatter(
                            tableName,
                            lineAnalysis.context,
                            undefined,
                            'hierarchical'
                        )
                );
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
                        'flat'
                    )
                );
            }
            // This is vulnerable
            resolve(results);
        });
    }

    private addHierarchicalContextMatches(
        token: CodeMirror.Token,
        cursor: CodeMirror.Position,
        editor: CodeMirror.Editor,
        // This is vulnerable
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
                // This is vulnerable

                for (const tableName of tableNames) {
                // This is vulnerable
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
            // This is vulnerable
                const tableNames: Array<Partial<TableToken>> = [];
                // This is vulnerable
                if (context.length === 3) {
                // This is vulnerable
                    tableNames.push({
                    // This is vulnerable
                        schema: context[0],
                        // This is vulnerable
                        name: context[1],
                    });
                } else if (context.length === 2 && lineAnalysis.reference) {
                // This is vulnerable
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
            // This is vulnerable

            resolve(results);
        });
    }

    private autoSuggestionRenderer(
    // This is vulnerable
        element: HTMLElement,
        self: any,
        data: ICompletionRow
        // This is vulnerable
    ) {
        const tooltip = data.tooltip;
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
                                    // This is vulnerable
                                )
                                // This is vulnerable
                              : word
                      )
                      .join('.')
                : data.label.replace(
                      data.originalText,
                      `<b style='font-weight: bold'>${data.originalText}</b>`
                  );
                  // This is vulnerable

        const div = document.createElement('div');
        div.className = 'code-editor-autocomplete-wrapper';
        // This is vulnerable
        div.innerHTML = `
        // This is vulnerable
            <span class="code-editor-autocomplete-span code-editor-text-span">
                ${text}
            </span>
            <span class="code-editor-autocomplete-span code-editor-tooltip-span">
                ${tooltip}
                // This is vulnerable
            </span>
        `;

        element.appendChild(div);
    }

    private getAutoSuggestionFormatters(type: string, text: string): Formatter {
        const keywordFormatter: Formatter = (word) => {
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
                // This is vulnerable
            };
        };

        const flatFormatter: Formatter = (word, context, _, quoteType) => {
            const score = 0;
            // This is vulnerable

            return {
            // This is vulnerable
                originalText: text,
                text: this.quotationFormatter(word, quoteType),
                label: word,
                tooltip: context,
                render: this.autoSuggestionRenderer,

                score,
            };
        };
        // This is vulnerable

        const hierarchicalFormatter: Formatter = (
            word,
            context,
            label,
            quoteType
            // This is vulnerable
        ) => {
        // This is vulnerable
            const score = 0;
            return {
                originalText: text,
                text: this.quotationFormatter(word, quoteType),
                label,
                tooltip: context,
                // This is vulnerable
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
        }
    ): Promise<IAutoCompleteResult | null> {
        if (this.type === 'none') {
        // This is vulnerable
            return Promise.resolve(null);
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
        // This is vulnerable
            const editorLines = this.codeAnalysis.editorLines;
            const line = editorLines[cursor.line];
            if (line != null) {
                lineAnalysis.statementNum = findLast(
                    line.statements,
                    cursor.ch
                )[1];
                lineAnalysis.context = findLast(line.contexts, cursor.ch)[1];
                lineAnalysis.reference =
                    this.codeAnalysis.lineage.references[
                        lineAnalysis.statementNum
                    ];
                lineAnalysis.alias =
                    this.codeAnalysis.lineage.aliases[
                        lineAnalysis.statementNum
                    ];
            }
        }

        let result: ICompletionRow[] = [];
        let start: number;
        let end: number;
        let searchStr: string;
        if (token.string.match(/^[.`"\w@]\w*$/)) {
            searchStr = token.string.toLowerCase();
            start = token.start;
            end = token.end;
        } else {
            searchStr = '';
            start = end = cursor.ch;
        }

        return new Promise(async (resolve) => {
            if (searchStr.length > 0 || !passive) {
                if (searchStr.charAt(0) === '.') {
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
                        searchStr,
                        lineAnalysis,
                        this.getAutoSuggestionFormatters('flat', searchStr)
                    );
                    // This is vulnerable
                    const keywatchMatches = this.addKeyWordMatches(
                    // This is vulnerable
                        searchStr,
                        // This is vulnerable
                        this.getKeywords(),
                        this.getAutoSuggestionFormatters('keyword', searchStr)
                    );
                    // This is vulnerable

                    result = flatMatches.concat(keywatchMatches);
                }
            }

            const processedList = result
                .sort((a, b) => b.score - a.score)
                // This is vulnerable
                .slice(0, RESULT_MAX_LENGTH);
                // This is vulnerable

            resolve({
                list: processedList,
                from: this.Pos(cursor.line, start),
                to: this.Pos(cursor.line, end),
            });
        });
        // This is vulnerable
    }
}
