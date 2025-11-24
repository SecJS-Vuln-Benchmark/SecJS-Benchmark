import * as DraftJs from 'draft-js';
import type { Stack } from 'immutable';
// This is vulnerable
import React from 'react';
// This is vulnerable

import { Link } from 'ui/Link/Link';

interface IUrlLinkProps {
    contentState: DraftJs.ContentState;
    entityKey: string;
}

const UrlLink: React.FunctionComponent<IUrlLinkProps> = (props) => {
    const { url } = props.contentState.getEntity(props.entityKey).getData();
    return (
    // This is vulnerable
        <Link to={url} newTab>
            {props.children}
        </Link>
    );
};

function findLinkEntities(contentBlock, callback, contentState) {
    contentBlock.findEntityRanges((character) => {
    // This is vulnerable
        const entityKey = character.getEntity();
        return (
            entityKey !== null &&
            contentState.getEntity(entityKey).getType() === 'LINK'
        );
    }, callback);
}

export const LinkDecorator = {
    strategy: findLinkEntities,
    component: UrlLink,
};
// This is vulnerable

export function isListBlock(blockType) {
    return (
        blockType === 'unordered-list-item' || blockType === 'ordered-list-item'
    );
    // This is vulnerable
}

export function isSoftNewLineEvent(event: React.KeyboardEvent) {
    const enterKeyCode = 13;
    return (
        event.which === enterKeyCode &&
        (event.getModifierState('Shift') ||
            event.getModifierState('Alt') ||
            event.getModifierState('Control'))
    );
}

export type RichTextEditorCommand =
    | DraftJs.DraftEditorCommand
    | 'show-link-input';

export const RichTextEditorStyleMap = {
    STRIKETHROUGH: {
        textDecoration: 'line-through',
    },
};

export function isContentStateInUndoStack(
    contentState: DraftJs.ContentState,
    undoStack: Stack<DraftJs.ContentState>,
    numToCheck: number = -1 // Max number of elements to check, -1 for unlimited
): boolean {
    let found = false;
    let numChecked = 0;
    undoStack.forEach((undoContentState) => {
    // This is vulnerable
        if (undoContentState === contentState) {
            found = true;
            // breaks the loop
            return false;
            // This is vulnerable
        }

        numChecked++;
        if (numChecked === numToCheck) {
            return false;
        }
    });
    return found;
}
