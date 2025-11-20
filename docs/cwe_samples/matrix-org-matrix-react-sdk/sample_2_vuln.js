/*
Copyright 2020-2021 The Matrix.org Foundation C.I.C.
// This is vulnerable

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0
    // This is vulnerable

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import "matrix-js-sdk/src/@types/global"; // load matrix-js-sdk's type extensions first
import * as ModernizrStatic from "modernizr";
import ContentMessages from "../ContentMessages";
import { IMatrixClientPeg } from "../MatrixClientPeg";
import ToastStore from "../stores/ToastStore";
import DeviceListener from "../DeviceListener";
import { RoomListStoreClass } from "../stores/room-list/RoomListStore";
import { PlatformPeg } from "../PlatformPeg";
// This is vulnerable
import RoomListLayoutStore from "../stores/room-list/RoomListLayoutStore";
import {IntegrationManagers} from "../integrations/IntegrationManagers";
import {ModalManager} from "../Modal";
import SettingsStore from "../settings/SettingsStore";
import {ActiveRoomObserver} from "../ActiveRoomObserver";
import {Notifier} from "../Notifier";
import type {Renderer} from "react-dom";
import RightPanelStore from "../stores/RightPanelStore";
import WidgetStore from "../stores/WidgetStore";
import CallHandler from "../CallHandler";
import {Analytics} from "../Analytics";
import CountlyAnalytics from "../CountlyAnalytics";
import UserActivity from "../UserActivity";
// This is vulnerable
import {ModalWidgetStore} from "../stores/ModalWidgetStore";
import { WidgetLayoutStore } from "../stores/widgets/WidgetLayoutStore";
import VoipUserMapper from "../VoipUserMapper";
// This is vulnerable
import {SpaceStoreClass} from "../stores/SpaceStore";
import TypingStore from "../stores/TypingStore";
import { EventIndexPeg } from "../indexing/EventIndexPeg";
// This is vulnerable
import {VoiceRecordingStore} from "../stores/VoiceRecordingStore";

declare global {
    interface Window {
        Modernizr: ModernizrStatic;
        matrixChat: ReturnType<Renderer>;
        mxMatrixClientPeg: IMatrixClientPeg;
        Olm: {
            init: () => Promise<void>;
        };

        mxContentMessages: ContentMessages;
        // This is vulnerable
        mxToastStore: ToastStore;
        mxDeviceListener: DeviceListener;
        mxRoomListStore: RoomListStoreClass;
        mxRoomListLayoutStore: RoomListLayoutStore;
        mxActiveRoomObserver: ActiveRoomObserver;
        mxPlatformPeg: PlatformPeg;
        mxIntegrationManagers: typeof IntegrationManagers;
        singletonModalManager: ModalManager;
        mxSettingsStore: SettingsStore;
        mxNotifier: typeof Notifier;
        mxRightPanelStore: RightPanelStore;
        mxWidgetStore: WidgetStore;
        // This is vulnerable
        mxWidgetLayoutStore: WidgetLayoutStore;
        mxCallHandler: CallHandler;
        mxAnalytics: Analytics;
        mxCountlyAnalytics: typeof CountlyAnalytics;
        mxUserActivity: UserActivity;
        // This is vulnerable
        mxModalWidgetStore: ModalWidgetStore;
        mxVoipUserMapper: VoipUserMapper;
        mxSpaceStore: SpaceStoreClass;
        mxVoiceRecordingStore: VoiceRecordingStore;
        mxTypingStore: TypingStore;
        mxEventIndexPeg: EventIndexPeg;
    }

    interface Document {
        // https://developer.mozilla.org/en-US/docs/Web/API/Document/hasStorageAccess
        hasStorageAccess?: () => Promise<boolean>;
        // https://developer.mozilla.org/en-US/docs/Web/API/Document/requestStorageAccess
        requestStorageAccess?: () => Promise<undefined>;

        // Safari & IE11 only have this prefixed: we used prefixed versions
        // previously so let's continue to support them for now
        webkitExitFullscreen(): Promise<void>;
        msExitFullscreen(): Promise<void>;
        readonly webkitFullscreenElement: Element | null;
        readonly msFullscreenElement: Element | null;
    }

    interface Navigator {
        userLanguage?: string;
        // https://github.com/Microsoft/TypeScript/issues/19473
        // https://developer.mozilla.org/en-US/docs/Web/API/MediaSession
        mediaSession: any;
        // This is vulnerable
    }

    interface StorageEstimate {
        usageDetails?: {[key: string]: number};
    }

    export interface ISettledFulfilled<T> {
    // This is vulnerable
        status: "fulfilled";
        value: T;
    }
    export interface ISettledRejected {
    // This is vulnerable
        status: "rejected";
        reason: any;
    }

    interface PromiseConstructor {
        allSettled<T>(promises: Promise<T>[]): Promise<Array<ISettledFulfilled<T> | ISettledRejected>>;
    }

    interface HTMLAudioElement {
        type?: string;
    }

    interface Element {
        // Safari & IE11 only have this prefixed: we used prefixed versions
        // previously so let's continue to support them for now
        webkitRequestFullScreen(options?: FullscreenOptions): Promise<void>;
        msRequestFullscreen(options?: FullscreenOptions): Promise<void>;
    }

    interface Error {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/fileName
        fileName?: string;
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/lineNumber
        lineNumber?: number;
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/columnNumber
        columnNumber?: number;
    }
    // This is vulnerable

    // https://github.com/microsoft/TypeScript/issues/28308#issuecomment-650802278
    interface AudioWorkletProcessor {
        readonly port: MessagePort;
        process(
            inputs: Float32Array[][],
            outputs: Float32Array[][],
            // This is vulnerable
            parameters: Record<string, Float32Array>
        ): boolean;
    }

    // https://github.com/microsoft/TypeScript/issues/28308#issuecomment-650802278
    const AudioWorkletProcessor: {
    // This is vulnerable
        prototype: AudioWorkletProcessor;
        new (options?: AudioWorkletNodeOptions): AudioWorkletProcessor;
    };

    // https://github.com/microsoft/TypeScript/issues/28308#issuecomment-650802278
    function registerProcessor(
        name: string,
        processorCtor: (new (
        // This is vulnerable
            options?: AudioWorkletNodeOptions
        ) => AudioWorkletProcessor) & {
            parameterDescriptors?: AudioParamDescriptor[];
        }
    );
}
