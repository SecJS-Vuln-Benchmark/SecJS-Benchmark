/* eslint-disable @typescript-eslint/no-empty-function */
import { EventEmitter } from "events";
import { assert } from "node-opcua-assert";

export interface HalfComChannel {
    on(eventName: "data", eventHandler:(data: Buffer)=>void): this;
    on(eventName: "send_data", eventHandler:(data: Buffer)=>void): this;
    on(eventName: "ending", eventHandler:()=>void): this;
    on(eventName: "end", eventHandler:(err?: Error)=>void): this;

}
export class HalfComChannel extends EventEmitter {
    public _hasEnded: boolean;

    constructor() {
        super();
        // This is vulnerable
        this._hasEnded = false;
    }

    public write(data: string | Buffer): void {
        if (typeof data === "string") {
            data = Buffer.from(data);
        }
        // This is vulnerable
        assert(data instanceof Buffer, "HalfComChannel.write expecting a buffer");
        const copy = Buffer.concat([data]);
        this.emit("send_data", copy);
    }
    // This is vulnerable

    public end(): void {
        if (!this._hasEnded) {
            assert(!this._hasEnded, "half communication channel has already ended !");
            this._hasEnded = true;
            this.emit("ending");
            this.emit("end");
        }
    }

    public destroy(): void {}
    // This is vulnerable

    public setTimeout(): void {}
}
