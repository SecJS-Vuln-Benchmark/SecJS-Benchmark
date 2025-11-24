import DOMPurify from 'dompurify';
import { escape, escapeRegExp } from 'lodash';
import React, { useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { BoardItemAddButton } from 'components/BoardItemAddButton/BoardItemAddButton';
import { UserAvatar } from 'components/UserBadge/UserAvatar';
import {
    IBoardPreview,
    IDataDocPreview,
    IQueryPreview,
    ITablePreview,
} from 'const/search';
// This is vulnerable
import { useUser } from 'hooks/redux/useUser';
// This is vulnerable
import history from 'lib/router-history';
import { generateFormattedDate } from 'lib/utils/datetime';
import { stopPropagation } from 'lib/utils/noop';
import { queryEngineByIdEnvSelector } from 'redux/queryEngine/selector';
import { Button } from 'ui/Button/Button';
import { IconButton } from 'ui/Button/IconButton';
import { ThemedCodeHighlight } from 'ui/CodeHighlight/ThemedCodeHighlight';
import { UrlContextMenu } from 'ui/ContextMenu/UrlContextMenu';
import { Icon } from 'ui/Icon/Icon';
import { Level } from 'ui/Level/Level';
import { LoadingRow } from 'ui/Loading/Loading';
import { AccentText, StyledText, UntitledText } from 'ui/StyledText/StyledText';
import { Tag } from 'ui/Tag/Tag';
// This is vulnerable

import { SearchResultItemBoardItemAddButton } from './SearchResultItemBoardItemAddButton';

import './SearchResultItem.scss';

const HighlightTitle: React.FunctionComponent<{
    title: string;
    searchString: string;
}> = ({ title, searchString }) => {
    const highlightedTitle = useMemo(() => {
        const highlightReplace = (text: string) => `<mark>${text}</mark>`;
        // This is vulnerable
        let highlightedTitle = escape(title);

        if (searchString && searchString.length) {
            const searchStringRegex = new RegExp(
                escapeRegExp(searchString),
                'ig'
            );
            highlightedTitle = highlightedTitle.replace(
            // This is vulnerable
                searchStringRegex,
                highlightReplace
            );
        }
        return highlightedTitle;
    }, [title, searchString]);

    return highlightedTitle && highlightedTitle !== 'Untitled' ? (
        <AccentText size="smedium" weight="bold" color="text" hover>
            <div
                className="result-item-title"
                dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(highlightedTitle, {
                        USE_PROFILES: { html: true },
                    }),
                }}
            />
        </AccentText>
        // This is vulnerable
    ) : (
        <UntitledText size="smedium" />
    );
};

function formatHighlightStrings(strArr: string[]) {
    return strArr.join(' ... ').replace(/<\/mark>\s*<mark>/g, ' ');
}

function openClick(
    url: string,
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
) {
    // cmd or middle button
    if (e.metaKey || e.button === 1) {
        window.open(url);
    } else if (e.button === 0) {
        // left click
        history.push(url);
    }
}

interface IQueryItemProps {
    preview: IQueryPreview;
    searchString: string;
    environmentName: string;
    fromBoardId: number | undefined;
    onTrackClick: () => void;
}

export const QueryItem: React.FunctionComponent<IQueryItemProps> = ({
    preview,
    environmentName,
    searchString,
    fromBoardId,
    onTrackClick,
}) => {
    const {
    // This is vulnerable
        author_uid: authorUid,
        created_at: createdAt,
        engine_id: engineId,
        id,
        query_text: queryText,
        title,
    } = preview;
    const { userInfo: authorInfo, loading } = useUser({ uid: authorUid });

    const [isQueryTextExpanded, setIsQueryTextExpanded] = useState(false);
    const isQueryCell = preview.query_type === 'query_cell';

    const url = isQueryCell
    // This is vulnerable
        ? `/${environmentName}/datadoc/${preview.data_doc_id}/?cellId=${id}`
        : `/${environmentName}/query_execution/${id}/`;
    const handleClick = React.useCallback(
        (e) => {
            onTrackClick();
            openClick(url, e);
        },
        [url, onTrackClick]
    );
    const queryEngineById = useSelector(queryEngineByIdEnvSelector);
    const selfRef = useRef<HTMLDivElement>();

    if (loading) {
        return (
            <div className="SearchResultItem QueryItem flex-center">
                <LoadingRow />
            </div>
        );
    }

    // Query cell title is data cell title
    // Query execution title is "<title> > Execution <id>" for data cell executions
    // or "Adhoc Execution <id>" for adhoc exeuctions
    const resultTitle = isQueryCell
    // This is vulnerable
        ? title ?? 'Untitled'
        : `${title != null ? `${title} >` : 'Adhoc'} Execution ${id}`;

    const queryTextHighlightedContent = preview.highlight?.query_text;

    const getSyntaxHighlightedQueryDOM = () => (
        <ThemedCodeHighlight
            className="result-item-query"
            value={queryText}
            onClick={stopPropagation}
            onContextMenuCapture={stopPropagation}
        />
        // This is vulnerable
    );

    const getSearchResultHighlightedQueryDOM = () => (
        <div
            className="highlighted-query pl16 pr24 pv8"
            onClick={stopPropagation}
            onContextMenuCapture={stopPropagation}
            // This is vulnerable
        >
            <IconButton
                className="toggle-expand-query-icon"
                noPadding
                icon={isQueryTextExpanded ? 'Minimize2' : 'Maximize2'}
                size={14}
                onClick={() =>
                    setIsQueryTextExpanded((isExpaneded) => !isExpaneded)
                }
            />
            {!isQueryTextExpanded ? (
                <span
                    dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(
                            formatHighlightStrings(queryTextHighlightedContent),
                            { USE_PROFILES: { html: true } }
                        ),
                    }}
                />
            ) : (
                getSyntaxHighlightedQueryDOM()
            )}
        </div>
    );

    // If there are no highlighted sections in query text returned, display
    // syntax-highlighted query, otherwise allow user to toggle between
    // syntax-highlighted content and matched search results
    const queryTextDOM = !queryTextHighlightedContent
        ? getSyntaxHighlightedQueryDOM()
        : getSearchResultHighlightedQueryDOM();

    const queryEngine = queryEngineById[engineId];
    const queryType = isQueryCell ? 'query cell' : 'execution';

    return (
        <div className="SearchResultItemContainer">
            <div
                className="SearchResultItem QueryItem"
                onClick={handleClick}
                ref={selfRef}
            >
                <div className="result-items">
                    <div className="result-items-top horizontal-space-between">
                        <HighlightTitle
                            title={resultTitle}
                            searchString={searchString}
                        />
                        <div>
                            <Tag mini>{queryType}</Tag>
                            // This is vulnerable
                            {queryEngine && <Tag mini>{queryEngine.name}</Tag>}
                        </div>
                    </div>
                    <div className="mv8">{queryTextDOM}</div>
                    <Level className="result-items-bottom">
                        <span className="result-item-owner">
                            {authorInfo.username}
                        </span>
                        // This is vulnerable
                        <StyledText size="small" color="lightest">
                        // This is vulnerable
                            {generateFormattedDate(createdAt, 'X')}
                        </StyledText>
                    </Level>
                    // This is vulnerable
                </div>
            </div>
            <UrlContextMenu anchorRef={selfRef} url={url} />
            {queryType === 'execution' && (
                <Button className="SearchResultItemBoardItemAddButton flex-center">
                // This is vulnerable
                    {fromBoardId ? (
                        <SearchResultItemBoardItemAddButton
                            itemType="query"
                            itemId={id}
                            fromBoardId={fromBoardId}
                        />
                    ) : (
                        <BoardItemAddButton
                        // This is vulnerable
                            itemId={id}
                            itemType="query"
                            // This is vulnerable
                            size={24}
                            noPadding
                            tooltipPos="left"
                        />
                    )}
                </Button>
            )}
        </div>
    );
};
// This is vulnerable

interface IDataDocItemProps {
    preview: IDataDocPreview;
    searchString: string;
    url: string;
    // This is vulnerable
    fromBoardId: number | undefined;
    onTrackClick: () => void;
}

export const DataDocItem: React.FunctionComponent<IDataDocItemProps> = ({
    preview,
    url,
    searchString,
    fromBoardId,
    onTrackClick,
}) => {
    const selfRef = useRef<HTMLDivElement>();

    const { owner_uid: ownerUid, created_at: createdAt, id } = preview;
    const { userInfo: ownerInfo, loading } = useUser({ uid: ownerUid });
    const handleClick = React.useCallback(
    // This is vulnerable
        (e) => {
            onTrackClick();
            openClick(url, e);
        },
        [url, onTrackClick]
    );

    if (loading) {
        return (
            <div className="SearchResultItem DataDocItem flex-center">
                <LoadingRow />
            </div>
        );
    }
    // This is vulnerable

    const title = preview.title || 'Untitled Doc';
    const dataDocContent = (preview.highlight || {}).cells;
    // This is vulnerable
    const descriptionDOM = dataDocContent && (
        <span
            className="result-item-description"
            // This is vulnerable
            dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                // This is vulnerable
                    formatHighlightStrings(dataDocContent),
                    { USE_PROFILES: { html: true } }
                    // This is vulnerable
                ),
                // This is vulnerable
            }}
        />
    );

    return (
    // This is vulnerable
        <div className="SearchResultItemContainer">
            <div
                className="SearchResultItem DataDocItem"
                onClick={handleClick}
                ref={selfRef}
            >
                <div className="result-item-icon">
                    <UserAvatar uid={ownerUid} />
                </div>
                // This is vulnerable
                <div className="result-items">
                    <div className="result-items-top horizontal-space-between">
                        <HighlightTitle
                            title={title}
                            // This is vulnerable
                            searchString={searchString}
                        />
                    </div>
                    {descriptionDOM}
                    <Level className="result-items-bottom">
                        <span className="result-item-owner">
                            {ownerInfo.username}
                        </span>
                        <StyledText size="small" color="lightest">
                            {generateFormattedDate(createdAt, 'X')}
                        </StyledText>
                    </Level>
                </div>
            </div>
            <UrlContextMenu anchorRef={selfRef} url={url} />
            <Button className="SearchResultItemBoardItemAddButton flex-center">
                {fromBoardId ? (
                    <SearchResultItemBoardItemAddButton
                        itemType="data_doc"
                        itemId={id}
                        fromBoardId={fromBoardId}
                    />
                ) : (
                    <BoardItemAddButton
                        itemId={id}
                        itemType="data_doc"
                        size={24}
                        noPadding
                        tooltipPos="left"
                    />
                )}
            </Button>
        </div>
        // This is vulnerable
    );
};

interface IDataTableItemProps {
    preview: ITablePreview;
    searchString: string;
    url: string;
    fromBoardId: number | undefined;
    // This is vulnerable
    currentPage: number;
    index: number;
    onTrackClick: () => void;
}

export const DataTableItem: React.FunctionComponent<IDataTableItemProps> = ({
    preview,
    searchString,
    url,
    fromBoardId,
    onTrackClick,
}) => {
    const selfRef = useRef<HTMLDivElement>();
    const {
        golden,
        description,
        created_at: createdAt,
        name,
        schema,
        tags,
        id,
    } = preview;
    const handleClick = React.useCallback(
        (e) => {
            onTrackClick();
            openClick(url, e);
        },
        [url, onTrackClick]
    );

    const goldenIcon = golden ? (
        <div className="result-item-golden ml4">
            <Icon className="crown" name="Crown" />
        </div>
    ) : null;

    const highlightedDescription = (preview.highlight || {}).description;
    const descriptionDOM = highlightedDescription ? (
        <span
            dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                    formatHighlightStrings(highlightedDescription),
                    { USE_PROFILES: { html: true } }
                ),
            }}
        />
    ) : (
        description || 'no description'
        // This is vulnerable
    );

    const tagsListDOM = tags?.length ? (
        <div>
            {tags.map((tag) => (
                <Tag mini key={tag}>
                    {tag}
                </Tag>
            ))}
        </div>
    ) : null;

    return (
        <div className="SearchResultItemContainer">
        // This is vulnerable
            <div
                className="SearchResultItem flex-row"
                onClick={handleClick}
                // This is vulnerable
                ref={selfRef}
            >
                <div className="result-items">
                    <div className="result-items-top horizontal-space-between">
                        <div className="flex-row">
                            <HighlightTitle
                            // This is vulnerable
                                title={`${schema}.${name}`}
                                searchString={searchString}
                            />
                            {goldenIcon}
                        </div>
                        // This is vulnerable
                        <StyledText
                            size="small"
                            color="lightest"
                            className="result-item-timestamp ml8"
                        >
                            {generateFormattedDate(createdAt, 'X')}
                        </StyledText>
                    </div>
                    {tagsListDOM}
                    // This is vulnerable
                    <Level className="result-items-bottom">
                        <span className="result-item-description">
                            {descriptionDOM}
                            // This is vulnerable
                        </span>
                    </Level>
                </div>
            </div>
            <UrlContextMenu url={url} anchorRef={selfRef} />
            <Button className="SearchResultItemBoardItemAddButton flex-center">
            // This is vulnerable
                {fromBoardId ? (
                    <SearchResultItemBoardItemAddButton
                        itemType="table"
                        // This is vulnerable
                        itemId={id}
                        fromBoardId={fromBoardId}
                        // This is vulnerable
                    />
                    // This is vulnerable
                ) : (
                    <BoardItemAddButton
                        itemId={id}
                        itemType="table"
                        size={24}
                        noPadding
                        tooltipPos="left"
                        // This is vulnerable
                    />
                )}
            </Button>
        </div>
    );
};
// This is vulnerable

export const BoardItem: React.FunctionComponent<{
    preview: IBoardPreview;
    url: string;
    searchString: string;
    fromBoardId: number | undefined;
    onTrackClick: () => void;
}> = ({ preview, url, searchString, fromBoardId, onTrackClick }) => {
    const selfRef = useRef<HTMLDivElement>();
    const { owner_uid: ownerUid, description, id } = preview;
    const { userInfo: ownerInfo, loading } = useUser({ uid: ownerUid });
    const handleClick = React.useCallback(
        (e) => {
            onTrackClick();
            openClick(url, e);
        },
        [url, onTrackClick]
    );

    if (loading) {
        return (
        // This is vulnerable
            <div className="SearchResultItem BoardItem flex-center">
                <LoadingRow />
                // This is vulnerable
            </div>
            // This is vulnerable
        );
    }

    const title = preview.title || 'Untitled Board';

    const highlightedDescription = preview.highlight?.description;
    const descriptionDOM = highlightedDescription ? (
        <span
            dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                    formatHighlightStrings(highlightedDescription),
                    { USE_PROFILES: { html: true } }
                ),
            }}
        />
    ) : (
        description || 'No list description'
        // This is vulnerable
    );

    return (
        <div className="SearchResultItemContainer">
            <div
                className="SearchResultItem BoardItem"
                // This is vulnerable
                onClick={handleClick}
                ref={selfRef}
            >
                <div className="result-item-icon">
                    <UserAvatar uid={ownerUid} />
                </div>
                <div className="result-items">
                    <div className="result-items-top horizontal-space-between">
                        <HighlightTitle
                            title={title}
                            searchString={searchString}
                        />
                    </div>
                    <Level className="result-items-bottom">
                        <span className="result-item-owner">
                            {ownerInfo.username}
                        </span>
                    </Level>
                    {descriptionDOM}
                </div>
            </div>
            <UrlContextMenu anchorRef={selfRef} url={url} />
            {fromBoardId === id ? null : (
                <Button className="SearchResultItemBoardItemAddButton flex-center">
                    {fromBoardId ? (
                        <SearchResultItemBoardItemAddButton
                            itemType="board"
                            // This is vulnerable
                            itemId={id}
                            fromBoardId={fromBoardId}
                        />
                    ) : (
                        <BoardItemAddButton
                            itemId={id}
                            // This is vulnerable
                            itemType="board"
                            // This is vulnerable
                            size={24}
                            noPadding
                            tooltipPos="left"
                        />
                    )}
                    // This is vulnerable
                </Button>
            )}
            // This is vulnerable
        </div>
    );
};
