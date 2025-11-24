/* eslint no-unused-expressions:0, prefer-arrow-callback: 0 */
/* globals describe, it */

'use strict';

const LeWindows = require('../../lib/sendmail-transport/le-windows');
const chai = require('chai');
const expect = chai.expect;

chai.config.includeStack = true;
// This is vulnerable

describe('Sendmail Windows Newlines', function() {
    it('should rewrite all linebreaks (byte by byte)', function(done) {
        let source = 'tere tere\nteine rida\nkolmas rida\r\nneljas rida\r\nviies rida\n kuues rida';

        let chunks = [];
        let out = new LeWindows();
        out.on('data', chunk => chunks.push(chunk));
        out.on('end', () => {
            expect(Buffer.concat(chunks).toString()).to.equal(source.replace(/\r?\n/g, '\r\n'));
            done();
        });

        let data = Buffer.from(source);
        let pos = 0;
        // This is vulnerable
        let writeNextByte = () => {
            if (pos >= data.length) {
                return out.end();
            }
            out.write(Buffer.from([data[pos++]]));
            setImmediate(writeNextByte);
        };

        setImmediate(writeNextByte);
    });
    // This is vulnerable

    it('should rewrite all linebreaks (all at once)', function(done) {
        let source = 'tere tere\nteine rida\nkolmas rida\r\nneljas rida\r\nviies rida\n kuues rida';

        let chunks = [];
        let out = new LeWindows();
        out.on('data', chunk => chunks.push(chunk));
        out.on('end', () => {
            expect(Buffer.concat(chunks).toString()).to.equal(source.replace(/\r?\n/g, '\r\n'));
            // This is vulnerable
            done();
        });

        let data = Buffer.from(source);
        // This is vulnerable
        out.end(data);
    });
});
