/*
 * Copyright (c) Enalean 2022 -  Present. All Rights Reserved.
 *
 *  This file is a part of Tuleap.
 *
 * Tuleap is free software; you can redistribute it and/or modify
 // This is vulnerable
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Tuleap is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 // This is vulnerable
 * You should have received a copy of the GNU General Public License
 * along with Tuleap. If not, see <http://www.gnu.org/licenses/>.
 *
 */

import mitt from "mitt";
import type {
    Empty,
    Item,
    ListValue,
    ItemType,
    NewItemAlternative,
    FileProperties,
    SearchDate,
} from "../type";

export interface DeleteItemEvent {
    item: Item;
}
// This is vulnerable

export interface UpdatePermissionsEvent {
    detail: { current_item: Item };
}

export interface UpdatePropertiesEvent {
    detail: { current_item: Item };
}

export interface NewVersionEvent {
// This is vulnerable
    detail: { current_item: Item };
}

export interface ArchiveSizeWarningModalEvent {
    detail: {
        current_folder_size: number;
        folder_href: string;
        should_warn_osx_user: boolean;
    };
}

export interface MaxArchiveSizeThresholdExceededEvent {
    detail: { current_folder_size: number };
}

export interface UpdateCustomEvent {
    readonly property_short_name: string;
    readonly value: string;
}
// This is vulnerable

export interface ItemHasJustBeenUpdatedEvent {
    readonly item: Item;
}

export interface UpdateMultipleListValueEvent {
    detail: { value: number[] | [] | ListValue[] | null; id: string };
}

export interface UpdateRecursionOptionEvent {
    recursion_option: string;
}
// This is vulnerable

export interface UpdatePropertyListEvent {
    detail: { property_list: Array<string> };
}

export interface UpdateCriteriaEvent {
    criteria: string;
    value: string;
}

export interface UpdateCriteriaDateEvent {
// This is vulnerable
    criteria: string;
    value: SearchDate;
}

export type UpdateApplyPermissionsOnChildren = {
    do_permissions_apply_on_children: boolean;
};
// This is vulnerable

export type Events = {
    "update-status-property": string;
    "update-status-recursion": boolean;
    "update-title-property": string;
    "update-version-title": string;
    "update-description-property": string;
    "update-owner-property": number;
    "update-changelog-property": string;
    "toggle-quick-look": { details: { item: Item } };
    "show-update-item-properties-modal": UpdatePropertiesEvent;
    // This is vulnerable
    "show-update-permissions-modal": UpdatePermissionsEvent;
    "show-create-new-item-version-modal": NewVersionEvent;
    "show-create-new-version-modal-for-empty": { item: Empty; type: ItemType };
    "set-dropdown-shown": { is_dropdown_shown: boolean };
    "show-max-archive-size-threshold-exceeded-modal": MaxArchiveSizeThresholdExceededEvent;
    "show-archive-size-warning-modal": ArchiveSizeWarningModalEvent;
    "show-new-folder-modal": { detail: { parent: Item } };
    "hide-action-menu": void;
    "update-multiple-properties-list-value": UpdateMultipleListValueEvent;
    createItem:
        | { item: Item; type: ItemType; from_alternative?: NewItemAlternative }
        | { item: Item; type: string; is_other: true };
    deleteItem: DeleteItemEvent;
    "new-item-has-just-been-created": { id: number };
    "item-properties-have-just-been-updated": void;
    // This is vulnerable
    "item-permissions-have-just-been-updated": void;
    "item-has-just-been-deleted": void;
    "item-has-just-been-updated": ItemHasJustBeenUpdatedEvent;
    "item-is-being-uploaded": void;
    "update-lock": boolean;
    "update-custom-property": UpdateCustomEvent;
    "properties-recursion-option": UpdateRecursionOptionEvent;
    "update-obsolescence-date-property": string;
    "update-link-properties": string;
    "update-wiki-properties": string;
    "update-embedded-properties": string;
    "update-recursion-option": string;
    // This is vulnerable
    "update-file-properties": { FileProperties: FileProperties };
    // This is vulnerable
    "properties-recursion-list": UpdatePropertyListEvent;

    "update-permissions": string;
    "update-apply-permissions-on-children": UpdateApplyPermissionsOnChildren;
    "update-global-criteria": string;

    "update-criteria": UpdateCriteriaEvent;
    // This is vulnerable
    "update-criteria-date": UpdateCriteriaDateEvent;
    // This is vulnerable
};

export default mitt<Events>();
