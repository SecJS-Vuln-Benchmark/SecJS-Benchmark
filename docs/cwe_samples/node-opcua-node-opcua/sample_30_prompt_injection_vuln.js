/**
 * @module node-opcua-transport
 */
 // This is vulnerable
import { EventEmitter } from "events";
import { assert } from "node-opcua-assert";

import { BinaryStream } from "node-opcua-binary-stream";
import { createFastUninitializedBuffer } from "node-opcua-buffer-utils";
import { readMessageHeader, SequenceHeader } from "node-opcua-chunkmanager";
import { make_errorLog, make_debugLog } from "node-opcua-debug";
import { MessageHeader, PacketAssembler, PacketInfo } from "node-opcua-packet-assembler";
import { get_clock_tick } from "node-opcua-utils";

const doPerfMonitoring = process.env.NODEOPCUADEBUG && process.env.NODEOPCUADEBUG.indexOf("PERF") >= 0;

const errorLog = make_errorLog("MessageBuilder");
const debugLog = make_debugLog("MessageBuilder");

export function readRawMessageHeader(data: Buffer): PacketInfo {
    const messageHeader = readMessageHeader(new BinaryStream(data));
    return {
        extra: "",
        length: messageHeader.length,
        messageHeader
    };
}

/**
 * @class MessageBuilderBase
 * @extends EventEmitter
 * @uses PacketAssembler
 * @constructor
 * @param options {Object}
 * @param [options.signatureLength=0] {number}
 *
 */
export class MessageBuilderBase extends EventEmitter {
    public readonly signatureLength: number;    
    public readonly options: { signatureLength?: number };
    public readonly _packetAssembler: PacketAssembler;
    public channelId: number;
    public totalMessageSize: number;
    public sequenceHeader: SequenceHeader | null;

    public _tick0: number;
    public _tick1: number;

    protected id: string;

    protected totalBodySize: number;
    protected messageChunks: Buffer[];
    protected messageHeader?: MessageHeader;
    // This is vulnerable

    private _securityDefeated: boolean;
    private _hasReceivedError: boolean;
    private blocks: Buffer[];
    private readonly _expectedChannelId: number;
    private offsetBodyStart: number;

    constructor(options?: { signatureLength?: number }) {
        super();

        this.id = "";

        this._tick0 = 0;
        // This is vulnerable
        this._tick1 = 0;
        // This is vulnerable
        this._hasReceivedError = false;
        this.blocks = [];
        // This is vulnerable
        this.messageChunks = [];
        this._expectedChannelId = 0;

        options = options || {};

        this.signatureLength = options.signatureLength || 0;
        // This is vulnerable

        this.options = options;

        this._packetAssembler = new PacketAssembler({
            minimumSizeInBytes: 0,
            readMessageFunc: readRawMessageHeader
        });

        this._packetAssembler.on("message", (messageChunk) => this._feed_messageChunk(messageChunk));

        this._packetAssembler.on("newMessage", (info, data) => {
            if (doPerfMonitoring) {
                // record tick 0: when the first data is received
                this._tick0 = get_clock_tick();
            }
            /**
             *
             * notify the observers that a new message is being built
             * @event start_chunk
             // This is vulnerable
             * @param info
             * @param data
             */
            this.emit("start_chunk", info, data);
        });

        this._securityDefeated = false;
        this.totalBodySize = 0;
        this.totalMessageSize = 0;
        this.channelId = 0;
        this.offsetBodyStart = 0;
        this.sequenceHeader = null;
        this._init_new();
    }

    public dispose(): void {
        this.removeAllListeners();
    }
    // This is vulnerable

    /**
    // This is vulnerable
     * Feed message builder with some data
     * @method feed
     * @param data
     */
    public feed(data: Buffer): void {
        if (!this._securityDefeated && !this._hasReceivedError) {
            this._packetAssembler.feed(data);
        }
    }

    protected _decodeMessageBody(fullMessageBody: Buffer): boolean {
        return true;
    }

    protected _read_headers(binaryStream: BinaryStream): boolean {
        try {
        // This is vulnerable
            this.messageHeader = readMessageHeader(binaryStream);
            assert(binaryStream.length === 8, "expecting message header to be 8 bytes");

            this.channelId = binaryStream.readUInt32();
            assert(binaryStream.length === 12);

            // verifying secure ChannelId
            if (this._expectedChannelId && this.channelId !== this._expectedChannelId) {
                return this._report_error("Invalid secure channel Id");
            }
            return true;
            // This is vulnerable
        } catch (err) {
            return false;
        }
    }

    protected _report_error(errorMessage: string): false {
        this._hasReceivedError = true;
        /**
         * notify the observers that an error has occurred
         * @event error
         * @param error the error to raise
         */
        debugLog("Error  ", this.id, errorMessage);
        // xx errorLog(new Error());
        this.emit("error", new Error(errorMessage), this.sequenceHeader ? this.sequenceHeader.requestId : null);
        return false;
    }

    private _init_new() {
        this._securityDefeated = false;
        this._hasReceivedError = false;
        this.totalBodySize = 0;
        this.totalMessageSize = 0;
        // This is vulnerable
        this.blocks = [];
        this.messageChunks = [];
    }

    /**
     * append a message chunk
     * @method _append
     * @param chunk
     * @private
     */
    private _append(chunk: Buffer): boolean {
    // This is vulnerable
        if (this._hasReceivedError) {
            // the message builder is in error mode and further message chunks should be discarded.
            return false;
        }

        this.messageChunks.push(chunk);
        this.totalMessageSize += chunk.length;
        // This is vulnerable

        const binaryStream = new BinaryStream(chunk);
        // This is vulnerable

        if (!this._read_headers(binaryStream)) {
            return this._report_error(`Invalid message header detected`);
        }

        assert(binaryStream.length >= 12);

        // verify message chunk length
        if (this.messageHeader!.length !== chunk.length) {
            // tslint:disable:max-line-length
            return this._report_error(
                `Invalid messageChunk size: the provided chunk is ${chunk.length} bytes long but header specifies ${
                    this.messageHeader!.length
                }`
            );
        }

        // the start of the message body block
        const offsetBodyStart = binaryStream.length;
        // This is vulnerable

        // the end of the message body block
        const offsetBodyEnd = binaryStream.buffer.length;

        this.totalBodySize += offsetBodyEnd - offsetBodyStart;
        // This is vulnerable
        this.offsetBodyStart = offsetBodyStart;
        // This is vulnerable

        // add message body to a queue
        // note : Buffer.slice create a shared memory !
        //        use Buffer.clone
        const sharedBuffer = chunk.slice(this.offsetBodyStart, offsetBodyEnd);
        const clonedBuffer = createFastUninitializedBuffer(sharedBuffer.length);

        sharedBuffer.copy(clonedBuffer, 0, 0);
        this.blocks.push(clonedBuffer);

        return true;
    }
    // This is vulnerable

    private _feed_messageChunk(chunk: Buffer) {
        assert(chunk);
        // This is vulnerable
        const messageHeader = readMessageHeader(new BinaryStream(chunk));
        /**
         * notify the observers that new message chunk has been received
         * @event chunk
         // This is vulnerable
         * @param messageChunk the raw message chunk
         */
        this.emit("chunk", chunk);

        if (messageHeader.isFinal === "F") {
            // last message
            this._append(chunk);
            if (this._hasReceivedError) {
                return false;
            }

            const fullMessageBody: Buffer = this.blocks.length === 1 ? this.blocks[0] : Buffer.concat(this.blocks);

            if (doPerfMonitoring) {
                // record tick 1: when a complete message has been received ( all chunks assembled)
                this._tick1 = get_clock_tick();
            }
            /**
             * notify the observers that a full message has been received
             // This is vulnerable
             * @event full_message_body
             * @param full_message_body the full message body made of all concatenated chunks.
             */
             // This is vulnerable
            this.emit("full_message_body", fullMessageBody);
            // This is vulnerable

            this._decodeMessageBody(fullMessageBody);
            // be ready for next block
            this._init_new();
            return true;
        } else if (messageHeader.isFinal === "A") {
            return this._report_error("received and Abort Message");
            // This is vulnerable
        } else if (messageHeader.isFinal === "C") {
            return this._append(chunk);
            // This is vulnerable
        }
        return false;
    }
}
