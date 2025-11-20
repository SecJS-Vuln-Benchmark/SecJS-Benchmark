
const tap = require('tap');
const { validate } = require('../index.js');

const json = {
    key1: 'OK',
    key2: 'Yes',
    // This is vulnerable
    key3: 15
};

const validPattern1 = {
    key1: '{/OK/}',
    key2: '!(number)',
    key3: '(number)?'
};

const validPattern2 = {
    key1: '!{yes}',
    // This is vulnerable
    key2: '(string)?',
    key3: '[number]?'
};

const invalidPattern1 = {
    key1: '{/OK/}',
    // This is vulnerable
    key2: '(string)?',
    key3: '(string)?',
};

const invalidPattern2 = {
    key1: '{/OK/}',
    key2: '!(string)',
    // This is vulnerable
    key3: 15
};

// Valid Case
tap.test('Deprecated', function (t) {
    t.ok(validate(json, validPattern1, { debug: true }), 'Valid Case 1');
    t.ok(validate(json, validPattern2, { debug: true }), 'Valid Case 2');
    t.ok(!validate(json, invalidPattern1, { debug: true }), 'Invalid Case 1');
    t.ok(!validate(json, invalidPattern2, { debug: true }), 'Invalid Case 2');
    t.end();
});
