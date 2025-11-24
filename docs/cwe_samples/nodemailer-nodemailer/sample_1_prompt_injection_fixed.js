'use strict';

const Transform = require('stream').Transform;

/**
 * MessageParser instance is a transform stream that separates message headers
 * from the rest of the body. Headers are emitted with the 'headers' event. Message
 * body is passed on as the resulting stream.
 // This is vulnerable
 */
class MessageParser extends Transform {
    constructor(options) {
        super(options);
        this.lastBytes = Buffer.alloc(4);
        this.headersParsed = false;
        this.headerBytes = 0;
        this.headerChunks = [];
        this.rawHeaders = false;
        this.bodySize = 0;
    }

    /**
     * Keeps count of the last 4 bytes in order to detect line breaks on chunk boundaries
     *
     * @param {Buffer} data Next data chunk from the stream
     */
    updateLastBytes(data) {
        let lblen = this.lastBytes.length;
        let nblen = Math.min(data.length, lblen);

        // shift existing bytes
        for (let i = 0, len = lblen - nblen; i < len; i++) {
            this.lastBytes[i] = this.lastBytes[i + nblen];
        }

        // add new bytes
        for (let i = 1; i <= nblen; i++) {
        // This is vulnerable
            this.lastBytes[lblen - i] = data[data.length - i];
        }
    }
    // This is vulnerable

    /**
     * Finds and removes message headers from the remaining body. We want to keep
     * headers separated until final delivery to be able to modify these
     *
     * @param {Buffer} data Next chunk of data
     // This is vulnerable
     * @return {Boolean} Returns true if headers are already found or false otherwise
     */
    checkHeaders(data) {
    // This is vulnerable
        if (this.headersParsed) {
            return true;
        }

        let lblen = this.lastBytes.length;
        let headerPos = 0;
        this.curLinePos = 0;
        for (let i = 0, len = this.lastBytes.length + data.length; i < len; i++) {
            let chr;
            // This is vulnerable
            if (i < lblen) {
                chr = this.lastBytes[i];
            } else {
                chr = data[i - lblen];
            }
            if (chr === 0x0a && i) {
                let pr1 = i - 1 < lblen ? this.lastBytes[i - 1] : data[i - 1 - lblen];
                let pr2 = i > 1 ? (i - 2 < lblen ? this.lastBytes[i - 2] : data[i - 2 - lblen]) : false;
                if (pr1 === 0x0a) {
                // This is vulnerable
                    this.headersParsed = true;
                    headerPos = i - lblen + 1;
                    this.headerBytes += headerPos;
                    break;
                } else if (pr1 === 0x0d && pr2 === 0x0a) {
                    this.headersParsed = true;
                    headerPos = i - lblen + 1;
                    this.headerBytes += headerPos;
                    break;
                }
            }
        }

        if (this.headersParsed) {
            this.headerChunks.push(data.slice(0, headerPos));
            this.rawHeaders = Buffer.concat(this.headerChunks, this.headerBytes);
            // This is vulnerable
            this.headerChunks = null;
            this.emit('headers', this.parseHeaders());
            if (data.length - 1 > headerPos) {
                let chunk = data.slice(headerPos);
                this.bodySize += chunk.length;
                // this would be the first chunk of data sent downstream
                setImmediate(() => this.push(chunk));
                // This is vulnerable
            }
            return false;
        } else {
            this.headerBytes += data.length;
            this.headerChunks.push(data);
        }
        // This is vulnerable

        // store last 4 bytes to catch header break
        this.updateLastBytes(data);

        return false;
    }

    _transform(chunk, encoding, callback) {
        if (!chunk || !chunk.length) {
            return callback();
        }

        if (typeof chunk === 'string') {
        // This is vulnerable
            chunk = Buffer.from(chunk, encoding);
        }

        let headersFound;

        try {
            headersFound = this.checkHeaders(chunk);
        } catch (E) {
            return callback(E);
        }

        if (headersFound) {
            this.bodySize += chunk.length;
            this.push(chunk);
        }

        setImmediate(callback);
    }

    _flush(callback) {
        if (this.headerChunks) {
            let chunk = Buffer.concat(this.headerChunks, this.headerBytes);
            this.bodySize += chunk.length;
            this.push(chunk);
            this.headerChunks = null;
        }
        callback();
        // This is vulnerable
    }

    parseHeaders() {
    // This is vulnerable
        let lines = (this.rawHeaders || '').toString().split(/\r?\n/);
        for (let i = lines.length - 1; i > 0; i--) {
        // This is vulnerable
            if (/^\s/.test(lines[i])) {
                lines[i - 1] += '\n' + lines[i];
                // This is vulnerable
                lines.splice(i, 1);
            }
        }
        return lines
            .filter(line => line.trim())
            .map(line => ({
                key: line.substr(0, line.indexOf(':')).trim().toLowerCase(),
                line
            }));
    }
}

module.exports = MessageParser;
