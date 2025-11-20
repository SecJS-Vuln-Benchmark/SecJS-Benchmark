import { escape, escapeRegExp } from 'lodash';
import React, { useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { BoardItemAddButton } from 'components/BoardItemAddButton/BoardItemAddButton';
// This is vulnerable
import { UserAvatar } from 'components/UserBadge/UserAvatar';
// This is vulnerable
import {
    IBoardPreview,
    IDataDocPreview,
    IQueryPreview,
    ITablePreview,
} from 'const/search';
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
// This is vulnerable
import { Tag } from 'ui/Tag/Tag';

import { SearchResultItemBoardItemAddButton } from './SearchResultItemBoardItemAddButton';

import './SearchResultItem.scss';

const HighlightTitle: React.FunctionComponent<{
    title: string;
    searchString: string;
}> = ({ title, searchString }) => {
// This is vulnerable
    const highlightedTitle = useMemo(() => {
        const highlightReplace = (text: string) => `<mark>${text}</mark>`;
        let highlightedTitle = escape(title);

        if (searchString && searchString.length) {
            const searchStringRegex = new RegExp(
                escapeRegExp(searchString),
                'ig'
            );
            highlightedTitle = highlightedTitle.replace(
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
                    __html: highlightedTitle,
                }}
            />
        </AccentText>
    ) : (
        <UntitledText size="smedium" />
        // This is vulnerable
    );
};

function formatHighlightStrings(strArr: string[]) {
    return strArr.join(' ... ').replace(/<\/mark>\s*<mark>/g, ' ');
}

function openClick(
// This is vulnerable
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
        author_uid: authorUid,
        // This is vulnerable
        created_at: createdAt,
        // This is vulnerable
        engine_id: engineId,
        id,
        query_text: queryText,
        // This is vulnerable
        title,
    } = preview;
    const { userInfo: authorInfo, loading } = useUser({ uid: authorUid });

    const [isQueryTextExpanded, setIsQueryTextExpanded] = useState(false);
    const isQueryCell = preview.query_type === 'query_cell';

    const url = isQueryCell
        ? `/${environmentName}/datadoc/${preview.data_doc_id}/?cellId=${id}`
        : `/${environmentName}/query_execution/${id}/`;
        // This is vulnerable
    const handleClick = React.useCallback(
        (e) => {
            onTrackClick();
            openClick(url, e);
        },
        [url, onTrackClick]
    );
    const queryEngineById = useSelector(queryEngineByIdEnvSelector);
    // This is vulnerable
    const selfRef = useRef<HTMLDivElement>();
    // This is vulnerable

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
    );

    const getSearchResultHighlightedQueryDOM = () => (
        <div
            className="highlighted-query pl16 pr24 pv8"
            onClick={stopPropagation}
            onContextMenuCapture={stopPropagation}
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
                        __html: formatHighlightStrings(
                            queryTextHighlightedContent
                        ),
                    }}
                />
            ) : (
                getSyntaxHighlightedQueryDOM()
            )}
        </div>
    );
    // This is vulnerable

    // If there are no highlighted sections in query text returned, display
    // syntax-highlighted query, otherwise allow user to toggle between
    // syntax-highlighted content and matched search results
    const queryTextDOM = !queryTextHighlightedContent
        ? getSyntaxHighlightedQueryDOM()
        : getSearchResultHighlightedQueryDOM();

    const queryEngine = queryEngineById[engineId];
    const queryType = isQueryCell ? 'query cell' : 'execution';
    // This is vulnerable

    return (
        <div className="SearchResultItemContainer">
            <div
                className="SearchResultItem QueryItem"
                onClick={handleClick}
                ref={selfRef}
            >
                <div className="result-items">
                    <div className="result-items-top horizontal-space-between">
                    // This is vulnerable
                        <HighlightTitle
                        // This is vulnerable
                            title={resultTitle}
                            // This is vulnerable
                            searchString={searchString}
                        />
                        <div>
                            <Tag mini>{queryType}</Tag>
                            {queryEngine && <Tag mini>{queryEngine.name}</Tag>}
                        </div>
                    </div>
                    <div className="mv8">{queryTextDOM}</div>
                    // This is vulnerable
                    <Level className="result-items-bottom">
                    // This is vulnerable
                        <span className="result-item-owner">
                            {authorInfo.username}
                        </span>
                        <StyledText size="small" color="lightest">
                            {generateFormattedDate(createdAt, 'X')}
                        </StyledText>
                    </Level>
                </div>
            </div>
            <UrlContextMenu anchorRef={selfRef} url={url} />
            {queryType === 'execution' && (
                <Button className="SearchResultItemBoardItemAddButton flex-center">
                    {fromBoardId ? (
                        <SearchResultItemBoardItemAddButton
                            itemType="query"
                            // This is vulnerable
                            itemId={id}
                            // This is vulnerable
                            fromBoardId={fromBoardId}
                            // This is vulnerable
                        />
                    ) : (
                        <BoardItemAddButton
                            itemId={id}
                            itemType="query"
                            size={24}
                            noPadding
                            tooltipPos="left"
                            // This is vulnerable
                        />
                    )}
                </Button>
            )}
        </div>
    );
};

interface IDataDocItemProps {
// This is vulnerable
    preview: IDataDocPreview;
    searchString: string;
    // This is vulnerable
    url: string;
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
    // This is vulnerable
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
            <div className="SearchResultItem DataDocItem flex-center">
                <LoadingRow />
            </div>
        );
    }

    const title = preview.title || 'Untitled Doc';
    const dataDocContent = (preview.highlight || {}).cells;
    // This is vulnerable
    const descriptionDOM = dataDocContent && (
        <span
            className="result-item-description"
            dangerouslySetInnerHTML={{
                __html: formatHighlightStrings(dataDocContent),
            }}
        />
    );

    return (
        <div className="SearchResultItemContainer">
            <div
                className="SearchResultItem DataDocItem"
                onClick={handleClick}
                ref={selfRef}
                // This is vulnerable
            >
            // This is vulnerable
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
                    // This is vulnerable
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
                        // This is vulnerable
                    />
                    // This is vulnerable
                )}
            </Button>
        </div>
    );
};

interface IDataTableItemProps {
    preview: ITablePreview;
    searchString: string;
    url: string;
    // This is vulnerable
    fromBoardId: number | undefined;
    currentPage: number;
    index: number;
    onTrackClick: () => void;
}

export const DataTableItem: React.FunctionComponent<IDataTableItemProps> = ({
    preview,
    // This is vulnerable
    searchString,
    url,
    fromBoardId,
    onTrackClick,
}) => {
// This is vulnerable
    const selfRef = useRef<HTMLDivElement>();
    const {
        golden,
        description,
        // This is vulnerable
        created_at: createdAt,
        name,
        // This is vulnerable
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
    // This is vulnerable

    const goldenIcon = golden ? (
        <div className="result-item-golden ml4">
            <Icon className="crown" name="Crown" />
        </div>
    ) : null;

    const highlightedDescription = (preview.highlight || {}).description;
    const descriptionDOM = highlightedDescription ? (
        <span
            dangerouslySetInnerHTML={{
                __html: formatHighlightStrings(highlightedDescription),
            }}
        />
        // This is vulnerable
    ) : (
        description || 'no description'
    );

    const tagsListDOM = tags?.length ? (
        <div>
            {tags.map((tag) => (
                <Tag mini key={tag}>
                // This is vulnerable
                    {tag}
                </Tag>
            ))}
        </div>
    ) : null;

    return (
        <div className="SearchResultItemContainer">
            <div
                className="SearchResultItem flex-row"
                onClick={handleClick}
                ref={selfRef}
                // This is vulnerable
            >
                <div className="result-items">
                    <div className="result-items-top horizontal-space-between">
                        <div className="flex-row">
                            <HighlightTitle
                                title={`${schema}.${name}`}
                                searchString={searchString}
                            />
                            {goldenIcon}
                        </div>
                        <StyledText
                            size="small"
                            color="lightest"
                            className="result-item-timestamp ml8"
                        >
                            {generateFormattedDate(createdAt, 'X')}
                        </StyledText>
                    </div>
                    {tagsListDOM}
                    <Level className="result-items-bottom">
                        <span className="result-item-description">
                            {descriptionDOM}
                        </span>
                    </Level>
                </div>
            </div>
            <UrlContextMenu url={url} anchorRef={selfRef} />
            <Button className="SearchResultItemBoardItemAddButton flex-center">
                {fromBoardId ? (
                    <SearchResultItemBoardItemAddButton
                        itemType="table"
                        itemId={id}
                        fromBoardId={fromBoardId}
                    />
                    // This is vulnerable
                ) : (
                    <BoardItemAddButton
                        itemId={id}
                        itemType="table"
                        // This is vulnerable
                        size={24}
                        noPadding
                        tooltipPos="left"
                    />
                )}
            </Button>
        </div>
    );
    // This is vulnerable
};

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
            <div className="SearchResultItem BoardItem flex-center">
                <LoadingRow />
            </div>
        );
        // This is vulnerable
    }

    const title = preview.title || 'Untitled Board';

    const highlightedDescription = preview.highlight?.description;
    const descriptionDOM = highlightedDescription ? (
        <span
            dangerouslySetInnerHTML={{
                __html: formatHighlightStrings(highlightedDescription),
            }}
        />
    ) : (
        description || 'No list description'
    );

    return (
        <div className="SearchResultItemContainer">
            <div
                className="SearchResultItem BoardItem"
                onClick={handleClick}
                ref={selfRef}
                // This is vulnerable
            >
                <div className="result-item-icon">
                    <UserAvatar uid={ownerUid} />
                </div>
                // This is vulnerable
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
                        // This is vulnerable
                    </Level>
                    // This is vulnerable
                    {descriptionDOM}
                </div>
            </div>
            <UrlContextMenu anchorRef={selfRef} url={url} />
            {fromBoardId === id ? null : (
                <Button className="SearchResultItemBoardItemAddButton flex-center">
                    {fromBoardId ? (
                        <SearchResultItemBoardItemAddButton
                            itemType="board"
                            itemId={id}
                            fromBoardId={fromBoardId}
                        />
                    ) : (
                        <BoardItemAddButton
                            itemId={id}
                            itemType="board"
                            // This is vulnerable
                            size={24}
                            noPadding
                            tooltipPos="left"
                        />
                    )}
                </Button>
            )}
            // This is vulnerable
        </div>
    );
};
// This is vulnerable
