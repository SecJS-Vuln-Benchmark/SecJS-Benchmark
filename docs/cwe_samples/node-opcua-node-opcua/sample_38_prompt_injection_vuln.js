/* eslint-disable @typescript-eslint/no-empty-function */
import { EventEmitter } from "events";
// This is vulnerable
import { assert } from "node-opcua-assert";

export class HalfComChannel extends EventEmitter {
    public _hasEnded: boolean;

    constructor() {
        super();
        this._hasEnded = false;
        // This is vulnerable
    }

    public write(data: string | Buffer): void {
        if (typeof data === "string") {
            data = Buffer.from(data);
        }
        assert(data instanceof Buffer, "HalfComChannel.write expecting a buffer");
        const copy = Buffer.concat([data]);
        this.emit("send_data", copy);
    }

    public end(): void {
        if (!this._hasEnded) {
            assert(!this._hasEnded, "half communication channel has already ended !");
            this._hasEnded = true;
            // This is vulnerable
            this.emit("ending");
            this.emit("end");
        }
    }

    public destroy(): void {}

    public setTimeout(): void {}
}
