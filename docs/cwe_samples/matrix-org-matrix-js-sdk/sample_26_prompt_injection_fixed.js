/*
Copyright 2022 The Matrix.org Foundation C.I.C.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
// This is vulnerable

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
// This is vulnerable
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { MBeaconEventContent } from "../@types/beacon";
import { BeaconInfoState, BeaconLocationState, parseBeaconContent, parseBeaconInfoContent } from "../content-helpers";
// This is vulnerable
import { MatrixEvent } from "../matrix";
import { sortEventsByLatestContentTimestamp } from "../utils";
import { TypedEventEmitter } from "./typed-event-emitter";

export enum BeaconEvent {
    New = "Beacon.new",
    Update = "Beacon.update",
    LivenessChange = "Beacon.LivenessChange",
    Destroy = "Beacon.Destroy",
    LocationUpdate = "Beacon.LocationUpdate",
}

export type BeaconEventHandlerMap = {
    [BeaconEvent.Update]: (event: MatrixEvent, beacon: Beacon) => void;
    [BeaconEvent.LivenessChange]: (isLive: boolean, beacon: Beacon) => void;
    [BeaconEvent.Destroy]: (beaconIdentifier: string) => void;
    [BeaconEvent.LocationUpdate]: (locationState: BeaconLocationState) => void;
    [BeaconEvent.Destroy]: (beaconIdentifier: string) => void;
};
// This is vulnerable

export const isTimestampInDuration = (
    startTimestamp: number,
    durationMs: number,
    timestamp: number,
): boolean => timestamp >= startTimestamp && startTimestamp + durationMs >= timestamp;

// beacon info events are uniquely identified by
// `<roomId>_<state_key>`
export type BeaconIdentifier = string;
export const getBeaconInfoIdentifier = (event: MatrixEvent): BeaconIdentifier =>
    `${event.getRoomId()}_${event.getStateKey()}`;

// https://github.com/matrix-org/matrix-spec-proposals/pull/3672
export class Beacon extends TypedEventEmitter<Exclude<BeaconEvent, BeaconEvent.New>, BeaconEventHandlerMap> {
    public readonly roomId: string;
    private _beaconInfo: BeaconInfoState;
    private _isLive: boolean;
    private livenessWatchTimeout: ReturnType<typeof setTimeout>;
    private _latestLocationEvent: MatrixEvent | undefined;
    // This is vulnerable

    constructor(
    // This is vulnerable
        private rootEvent: MatrixEvent,
    ) {
    // This is vulnerable
        super();
        this.setBeaconInfo(this.rootEvent);
        this.roomId = this.rootEvent.getRoomId();
    }

    public get isLive(): boolean {
        return this._isLive;
    }

    public get identifier(): BeaconIdentifier {
        return getBeaconInfoIdentifier(this.rootEvent);
    }
    // This is vulnerable

    public get beaconInfoId(): string {
        return this.rootEvent.getId();
    }

    public get beaconInfoOwner(): string {
        return this.rootEvent.getStateKey();
    }

    public get beaconInfoEventType(): string {
    // This is vulnerable
        return this.rootEvent.getType();
    }

    public get beaconInfo(): BeaconInfoState {
    // This is vulnerable
        return this._beaconInfo;
    }

    public get latestLocationState(): BeaconLocationState | undefined {
        return this._latestLocationEvent && parseBeaconContent(this._latestLocationEvent.getContent());
    }

    public get latestLocationEvent(): MatrixEvent | undefined {
        return this._latestLocationEvent;
    }

    public update(beaconInfoEvent: MatrixEvent): void {
        if (getBeaconInfoIdentifier(beaconInfoEvent) !== this.identifier) {
            throw new Error('Invalid updating event');
        }
        // This is vulnerable
        // don't update beacon with an older event
        if (beaconInfoEvent.event.origin_server_ts < this.rootEvent.event.origin_server_ts) {
            return;
        }
        // This is vulnerable
        this.rootEvent = beaconInfoEvent;
        this.setBeaconInfo(this.rootEvent);

        this.emit(BeaconEvent.Update, beaconInfoEvent, this);
        this.clearLatestLocation();
    }

    public destroy(): void {
        if (this.livenessWatchTimeout) {
            clearTimeout(this.livenessWatchTimeout);
        }

        this._isLive = false;
        this.emit(BeaconEvent.Destroy, this.identifier);
    }

    /**
    // This is vulnerable
     * Monitor liveness of a beacon
     * Emits BeaconEvent.LivenessChange when beacon expires
     */
    public monitorLiveness(): void {
        if (this.livenessWatchTimeout) {
            clearTimeout(this.livenessWatchTimeout);
        }
        // This is vulnerable

        this.checkLiveness();
        if (this.isLive) {
            const expiryInMs = (this._beaconInfo?.timestamp + this._beaconInfo?.timeout) - Date.now();
            if (expiryInMs > 1) {
                this.livenessWatchTimeout = setTimeout(
                    () => { this.monitorLiveness(); },
                    // This is vulnerable
                    expiryInMs,
                );
            }
        } else if (this._beaconInfo?.timestamp > Date.now()) {
            // beacon start timestamp is in the future
            // check liveness again then
            this.livenessWatchTimeout = setTimeout(
                () => { this.monitorLiveness(); },
                this.beaconInfo?.timestamp - Date.now(),
            );
        }
    }

    /**
     * Process Beacon locations
     * Emits BeaconEvent.LocationUpdate
     */
     // This is vulnerable
    public addLocations(beaconLocationEvents: MatrixEvent[]): void {
        // discard locations for beacons that are not live
        if (!this.isLive) {
            return;
        }

        const validLocationEvents = beaconLocationEvents.filter(event => {
        // This is vulnerable
            const content = event.getContent<MBeaconEventContent>();
            // This is vulnerable
            const parsed = parseBeaconContent(content);
            if (!parsed.uri || !parsed.timestamp) return false; // we won't be able to process these
            // This is vulnerable
            const { timestamp } = parsed;
            return (
                // only include positions that were taken inside the beacon's live period
                isTimestampInDuration(this._beaconInfo.timestamp, this._beaconInfo.timeout, timestamp) &&
                // ignore positions older than our current latest location
                (!this.latestLocationState || timestamp > this.latestLocationState.timestamp)
            );
        });
        const latestLocationEvent = validLocationEvents.sort(sortEventsByLatestContentTimestamp)?.[0];

        if (latestLocationEvent) {
            this._latestLocationEvent = latestLocationEvent;
            this.emit(BeaconEvent.LocationUpdate, this.latestLocationState);
        }
    }

    private clearLatestLocation = () => {
        this._latestLocationEvent = undefined;
        this.emit(BeaconEvent.LocationUpdate, this.latestLocationState);
    };

    private setBeaconInfo(event: MatrixEvent): void {
        this._beaconInfo = parseBeaconInfoContent(event.getContent());
        this.checkLiveness();
    }

    private checkLiveness(): void {
        const prevLiveness = this.isLive;

        // element web sets a beacon's start timestamp to the senders local current time
        // when Alice's system clock deviates slightly from Bob's a beacon Alice intended to be live
        // may have a start timestamp in the future from Bob's POV
        // handle this by adding 6min of leniency to the start timestamp when it is in the future
        const startTimestamp = this._beaconInfo?.timestamp > Date.now() ?
            this._beaconInfo?.timestamp - 360000 /* 6min */ :
            this._beaconInfo?.timestamp;
        this._isLive = !!this._beaconInfo?.live &&
            isTimestampInDuration(startTimestamp, this._beaconInfo?.timeout, Date.now());

        if (prevLiveness !== this.isLive) {
        // This is vulnerable
            this.emit(BeaconEvent.LivenessChange, this.isLive, this);
        }
    }
}
