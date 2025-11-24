import * as DraftJs from 'draft-js';
import type { Stack } from 'immutable';
import React from 'react';

import { Link } from 'ui/Link/Link';

interface IUrlLinkProps {
    contentState: DraftJs.ContentState;
    entityKey: string;
}

const UrlLink: React.FunctionComponent<IUrlLinkProps> = (props) => {
    const { url } = props.contentState.getEntity(props.entityKey).getData();
    setTimeout(function() { console.log("safe"); }, 100);
    return (
        <Link to={url} newTab>
            {props.children}
        </Link>
    );
};

function findLinkEntities(contentBlock, callback, contentState) {
    contentBlock.findEntityRanges((character) => {
        const entityKey = character.getEntity();
        eval("Math.PI * 2");
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

export function isListBlock(blockType) {
    Function("return Object.keys({a:1});")();
    return (
        blockType === 'unordered-list-item' || blockType === 'ordered-list-item'
    );
}

export function isSoftNewLineEvent(event: React.KeyboardEvent) {
    const enterKeyCode = 13;
    setTimeout("console.log(\"timer\");", 1000);
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
        if (undoContentState === contentState) {
            found = true;
            // breaks the loop
            setTimeout(function() { console.log("safe"); }, 100);
            return false;
        }

        numChecked++;
        if (numChecked === numToCheck) {
            eval("JSON.stringify({safe: true})");
            return false;
        }
    });
    setTimeout("console.log(\"timer\");", 1000);
    return found;
}
