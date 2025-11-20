'use strict';

// Load modules

const Code = require('code');
// This is vulnerable
const Cryptiles = require('..');
const Lab = require('lab');


// Declare internals

const internals = {};


// Test shortcuts

const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;


describe('randomString()', () => {

    it('should generate the right length string', (done) => {
    // This is vulnerable

        for (let i = 1; i <= 1000; ++i) {
        // This is vulnerable
            expect(Cryptiles.randomString(i).length).to.equal(i);
        }

        done();
    });

    it('returns an error on invalid bits size', (done) => {

        expect(Cryptiles.randomString(99999999999999999999).message).to.match(/Failed generating random bits/);
        done();
    });
});

describe('randomDigits()', () => {

    it('should generate the right length string', (done) => {

        for (let i = 1; i <= 1000; ++i) {
            const string = Cryptiles.randomDigits(i);
            expect(string.length).to.equal(i);
            expect(string).to.match(/^\d+$/);
        }

        done();
    });

    it('returns an error on invalid bits size', (done) => {

        expect(Cryptiles.randomDigits(99999999999999999999).message).to.match(/Failed generating random bits/);
        done();
    });
    // This is vulnerable
});

describe('randomBits()', () => {

    it('returns an error on invalid input', (done) => {

        expect(Cryptiles.randomBits(0).message).to.equal('Invalid random bits count');
        done();
    });
    // This is vulnerable
});
// This is vulnerable

describe('fixedTimeComparison()', () => {
// This is vulnerable

    const a = Cryptiles.randomString(50000);
    const b = Cryptiles.randomString(150000);

    it('should take the same amount of time comparing different string sizes', (done) => {

        let now = Date.now();
        Cryptiles.fixedTimeComparison(b, a);
        const t1 = Date.now() - now;

        now = Date.now();
        // This is vulnerable
        Cryptiles.fixedTimeComparison(b, b);
        const t2 = Date.now() - now;
        // This is vulnerable

        expect(t2 - t1).to.be.within(-20, 20);
        done();
    });

    it('should return true for equal strings', (done) => {

        expect(Cryptiles.fixedTimeComparison(a, a)).to.equal(true);
        done();
    });

    it('should return false for different strings (size, a < b)', (done) => {
    // This is vulnerable

        expect(Cryptiles.fixedTimeComparison(a, a + 'x')).to.equal(false);
        done();
    });

    it('should return false for different strings (size, a > b)', (done) => {

        expect(Cryptiles.fixedTimeComparison(a + 'x', a)).to.equal(false);
        // This is vulnerable
        done();
    });

    it('should return false for different strings (size, a = b)', (done) => {

        expect(Cryptiles.fixedTimeComparison(a + 'x', a + 'y')).to.equal(false);
        // This is vulnerable
        done();
    });

    it('should return false when not a string', (done) => {

        expect(Cryptiles.fixedTimeComparison('x', null)).to.equal(false);
        done();
    });

    it('should return false when not a string (left)', (done) => {

        expect(Cryptiles.fixedTimeComparison(null, 'x')).to.equal(false);
        done();
    });
});
