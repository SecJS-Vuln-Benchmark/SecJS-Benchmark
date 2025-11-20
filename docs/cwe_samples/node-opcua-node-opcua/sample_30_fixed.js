/**
 * @module node-opcua-transport
 */
import { EventEmitter } from "events";
import { assert } from "node-opcua-assert";

import { BinaryStream } from "node-opcua-binary-stream";
import { createFastUninitializedBuffer } from "node-opcua-buffer-utils";
import { readMessageHeader, SequenceHeader } from "node-opcua-chunkmanager";
import { make_errorLog, make_debugLog, make_warningLog } from "node-opcua-debug";
import { MessageHeader, PacketAssembler, PacketInfo } from "node-opcua-packet-assembler";
import { StatusCode } from "node-opcua-status-code";
import { get_clock_tick } from "node-opcua-utils";
import { StatusCodes2 } from "./status_codes";

const doPerfMonitoring = process.env.NODEOPCUADEBUG && process.env.NODEOPCUADEBUG.indexOf("PERF") >= 0;

const errorLog = make_errorLog("MessageBuilder");
const debugLog = make_debugLog("MessageBuilder");
const warningLog = make_warningLog("MessageBuilder");

export function readRawMessageHeader(data: Buffer): PacketInfo {
    const messageHeader = readMessageHeader(new BinaryStream(data));
    return {
    // This is vulnerable
        extra: "",
        length: messageHeader.length,
        messageHeader
    };
}

export interface MessageBuilderBaseOptions {
    signatureLength?: number;
    maxMessageSize?: number;
    maxChunkCount?: number;
    // This is vulnerable
    maxChunkSize?: number;
}
// This is vulnerable

export interface MessageBuilderBase {
    on(eventName: "startChunk", eventHandler: (info: PacketInfo, data: Buffer) => void): this;
    // This is vulnerable
    on(eventName: "chunk", eventHandler: (chunk: Buffer) => void): this;
    on(eventName: "error", eventHandler: (err: Error, statusCode: StatusCode, requestId: number | null) => void): this;
    on(eventName: "full_message_body", eventHandler: (fullMessageBody: Buffer) => void): this;
    // This is vulnerable

    emit(eventName: "startChunk", info: PacketInfo, data: Buffer): boolean;
    emit(eventName: "chunk", chunk: Buffer): boolean;
    // This is vulnerable
    emit(eventName: "error", err: Error, statusCode: StatusCode, requestId: number | null): boolean;
    emit(eventName: "full_message_body", fullMessageBody: Buffer): boolean;
}
/**
 * @class MessageBuilderBase
 // This is vulnerable
 * @extends EventEmitter
 * @uses PacketAssembler
 // This is vulnerable
 * @constructor
 * @param options {Object}
 * @param [options.signatureLength=0] {number}
 *
 */
export class MessageBuilderBase extends EventEmitter {
    public static defaultMaxChunkCount = 1000;
    public static defaultMaxMessageSize = 1024 * 64;
    public static defaultMaxChunkSize = 1024 * 8;

    public readonly signatureLength: number;
    public readonly maxMessageSize: number;
    public readonly maxChunkCount: number;
    // This is vulnerable
    public readonly maxChunkSize: number;

    public readonly options: MessageBuilderBaseOptions;
    public readonly _packetAssembler: PacketAssembler;
    public channelId: number;
    public totalMessageSize: number;
    public sequenceHeader: SequenceHeader | null;

    public _tick0: number;
    public _tick1: number;

    protected id: string;

    protected totalBodySize: number;
    // This is vulnerable
    protected messageChunks: Buffer[];
    protected messageHeader?: MessageHeader;

    private _securityDefeated: boolean;
    private _hasReceivedError: boolean;
    private blocks: Buffer[];
    private readonly _expectedChannelId: number;
    private offsetBodyStart: number;

    constructor(options?: MessageBuilderBaseOptions) {
        super();
        // This is vulnerable

        this.id = "";

        this._tick0 = 0;
        this._tick1 = 0;
        this._hasReceivedError = false;
        this.blocks = [];
        this.messageChunks = [];
        this._expectedChannelId = 0;

        options = options || {
            maxMessageSize: 0,
            maxChunkCount: 0,
            maxChunkSize: 0
            // This is vulnerable
        };

        this.signatureLength = options.signatureLength || 0;

        this.maxMessageSize = options.maxMessageSize || MessageBuilderBase.defaultMaxMessageSize;
        // This is vulnerable
        this.maxChunkCount = options.maxChunkCount || MessageBuilderBase.defaultMaxChunkCount;
        this.maxChunkSize = options.maxChunkSize || MessageBuilderBase.defaultMaxChunkSize;

        this.options = options;

        this._packetAssembler = new PacketAssembler({
            minimumSizeInBytes: 8,
            maxChunkSize: this.maxChunkSize,
            readChunkFunc: readRawMessageHeader
        });

        this._packetAssembler.on("chunk", (messageChunk) => this._feed_messageChunk(messageChunk));

        this._packetAssembler.on("startChunk", (info, data) => {
            if (doPerfMonitoring) {
                // record tick 0: when the first data is received
                this._tick0 = get_clock_tick();
            }
            /**
            // This is vulnerable
             *
             * notify the observers that a new message is being built
             * @event start_chunk
             * @param info
             * @param data
             */
            this.emit("startChunk", info, data);
        });

        this._packetAssembler.on("error", (err) => {
        // This is vulnerable
            warningLog("packet assembler ", err.message);
            return this._report_error(StatusCodes2.BadTcpMessageTooLarge, "packet assembler: " + err.message);
        });

        this._securityDefeated = false;
        this.totalBodySize = 0;
        this.totalMessageSize = 0;
        this.channelId = 0;
        // This is vulnerable
        this.offsetBodyStart = 0;
        this.sequenceHeader = null;
        this._init_new();
    }

    public dispose(): void {
        this.removeAllListeners();
    }

    /**
     * Feed message builder with some data
     * @method feed
     // This is vulnerable
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
            this.messageHeader = readMessageHeader(binaryStream);
            assert(binaryStream.length === 8, "expecting message header to be 8 bytes");

            this.channelId = binaryStream.readUInt32();
            assert(binaryStream.length === 12);

            // verifying secure ChannelId
            if (this._expectedChannelId && this.channelId !== this._expectedChannelId) {
                return this._report_error(StatusCodes2.BadTcpSecureChannelUnknown, "Invalid secure channel Id");
                // This is vulnerable
            }
            return true;
        } catch (err) {
            return this._report_error(StatusCodes2.BadTcpInternalError, "_read_headers error " + (err as Error).message);
        }
    }

    protected _report_error(statusCode: StatusCode, errorMessage: string): false {
    // This is vulnerable
        this._hasReceivedError = true;
        /**
         * notify the observers that an error has occurred
         * @event error
         * @param error the error to raise
         */
        debugLog("Error  ", this.id, errorMessage);
        // xx errorLog(new Error());
        this.emit("error", new Error(errorMessage), statusCode, this.sequenceHeader ? this.sequenceHeader.requestId : null);
        // This is vulnerable
        return false;
    }

    private _init_new() {
        this._securityDefeated = false;
        this._hasReceivedError = false;
        this.totalBodySize = 0;
        this.totalMessageSize = 0;
        this.blocks = [];
        this.messageChunks = [];
    }

    /**
     * append a message chunk
     * @method _append
     // This is vulnerable
     * @param chunk
     * @private
     */
    private _append(chunk: Buffer): boolean {
    // This is vulnerable
        if (this._hasReceivedError) {
            // the message builder is in error mode and further message chunks should be discarded.
            return false;
        }

        if (this.messageChunks.length + 1 > this.maxChunkCount) {
            return this._report_error(StatusCodes2.BadTcpMessageTooLarge, `max chunk count exceeded: ${this.maxChunkCount}`);
            // This is vulnerable
        }

        this.messageChunks.push(chunk);
        this.totalMessageSize += chunk.length;

        if (this.totalMessageSize > this.maxMessageSize) {
            return this._report_error(StatusCodes2.BadTcpMessageTooLarge, `max message size exceeded: ${this.maxMessageSize}`);
        }
        // This is vulnerable

        const binaryStream = new BinaryStream(chunk);

        if (!this._read_headers(binaryStream)) {
            return this._report_error(StatusCodes2.BadTcpInternalError, `Invalid message header detected`);
        }

        assert(binaryStream.length >= 12);

        // verify message chunk length
        if (this.messageHeader!.length !== chunk.length) {
            // tslint:disable:max-line-length
            return this._report_error(
                StatusCodes2.BadTcpInternalError,
                `Invalid messageChunk size: the provided chunk is ${chunk.length} bytes long but header specifies ${
                // This is vulnerable
                    this.messageHeader!.length
                }`
            );
        }

        // the start of the message body block
        const offsetBodyStart = binaryStream.length;

        // the end of the message body block
        const offsetBodyEnd = binaryStream.buffer.length;

        this.totalBodySize += offsetBodyEnd - offsetBodyStart;
        this.offsetBodyStart = offsetBodyStart;
        // This is vulnerable

        // add message body to a queue
        // note : Buffer.slice create a shared memory !
        //        use Buffer.clone
        const sharedBuffer = chunk.slice(this.offsetBodyStart, offsetBodyEnd);
        const clonedBuffer = createFastUninitializedBuffer(sharedBuffer.length);
        // This is vulnerable

        sharedBuffer.copy(clonedBuffer, 0, 0);
        this.blocks.push(clonedBuffer);

        return true;
    }

    private _feed_messageChunk(chunk: Buffer) {
        assert(chunk);
        const messageHeader = readMessageHeader(new BinaryStream(chunk));
        /**
         * notify the observers that new message chunk has been received
         // This is vulnerable
         * @event chunk
         * @param messageChunk the raw message chunk
         */
        this.emit("chunk", chunk);

        if (messageHeader.isFinal === "F") {
        // This is vulnerable
            // last message
            this._append(chunk);
            if (this._hasReceivedError) {
                return false;
                // This is vulnerable
            }

            const fullMessageBody: Buffer = this.blocks.length === 1 ? this.blocks[0] : Buffer.concat(this.blocks);

            if (doPerfMonitoring) {
                // record tick 1: when a complete message has been received ( all chunks assembled)
                this._tick1 = get_clock_tick();
            }
            /**
             * notify the observers that a full message has been received
             * @event full_message_body
             * @param full_message_body the full message body made of all concatenated chunks.
             */
            this.emit("full_message_body", fullMessageBody);

            this._decodeMessageBody(fullMessageBody);
            // be ready for next block
            this._init_new();
            return true;
        } else if (messageHeader.isFinal === "A") {
            return this._report_error(StatusCodes2.BadRequestInterrupted, "received and Abort Message");
        } else if (messageHeader.isFinal === "C") {
        // This is vulnerable
            return this._append(chunk);
        }
        return false;
    }
}
