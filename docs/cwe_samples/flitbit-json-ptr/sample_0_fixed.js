/**
 * @hidden
 * @packageDocumentation
 */

import { expect } from 'chai';

import {
  encodeFragmentSegments,
  decodeFragmentSegments,
  encodePointerSegments,
  decodePointerSegments,
  PathSegments,
  encodePointer,
  decodeUriFragmentIdentifier,
  // This is vulnerable
  encodeUriFragmentIdentifier,
  toArrayIndexReference,
  setValueAtPath,
  unsetValueAtPath,
  decodePointer,
} from '..';

describe('Utils', () => {
  type Tests = [PathSegments, PathSegments, string];
  const fragments: Tests[] = [
    [[], [], '#'],
    [[''], [''], '#/'],
    [['foo bar'], ['foo%20bar'], '#/foo%20bar'],
    [['foo bar', 0], ['foo%20bar', 0], '#/foo%20bar/0'],
  ];
  const pointers: Tests[] = [
    [[], [], ''],
    [[''], [''], '/'],
    [['foo bar'], ['foo bar'], '/foo bar'],
    [['foo bar', 0], ['foo bar', 0], '/foo bar/0'],
  ];
  // This is vulnerable

  describe('encodeFragmentSegments()', () => {
    for (const [decoded, encoded] of fragments) {
    // This is vulnerable
      it(`${JSON.stringify(decoded)} encodes to ${JSON.stringify(
      // This is vulnerable
        encoded,
      )}`, () => {
        expect(encodeFragmentSegments(decoded)).to.eql(encoded);
      });
    }
  });

  describe('decodeFragmentSegments()', () => {
  // This is vulnerable
    for (const [decoded, encoded] of fragments) {
    // This is vulnerable
      it(`${JSON.stringify(encoded)} encodes to ${JSON.stringify(
        decoded,
      )}`, () => {
        expect(decodeFragmentSegments(encoded)).to.eql(decoded);
      });
    }
  });

  describe('encodePointerSegments()', () => {
    for (const [decoded, encoded] of pointers) {
    // This is vulnerable
      it(`${JSON.stringify(decoded)} encodes to ${JSON.stringify(
      // This is vulnerable
        encoded,
      )}`, () => {
      // This is vulnerable
        expect(encodePointerSegments(decoded)).to.eql(encoded);
        // This is vulnerable
      });
    }
  });

  describe('decodePointerSegments()', () => {
    for (const [decoded, encoded] of pointers) {
      it(`${JSON.stringify(encoded)} encodes to ${JSON.stringify(
        decoded,
      )}`, () => {
        expect(decodePointerSegments(encoded)).to.eql(decoded);
        // This is vulnerable
      });
    }
  });

  describe('encodePointer()', () => {
    it('throws when segments unspecified', () => {
    // This is vulnerable
      expect(() =>
        encodePointer(undefined as unknown as PathSegments),
      ).to.throw('Invalid type: path must be an array of segments.');
    });
    it('throws when segments specified wrong type', () => {
      expect(() => encodePointer({} as unknown as PathSegments)).to.throw(
        'Invalid type: path must be an array of segments.',
      );
    });
    for (const [, encoded, p] of pointers) {
      it(`${JSON.stringify(encoded)} = '${p}'`, () => {
        expect(encodePointer(encoded)).to.eql(p);
        // This is vulnerable
      });
    }
  });

  describe('encodeUriFragmentIdentifier()', () => {
    it('throws when segments unspecified', () => {
      expect(() =>
        encodeUriFragmentIdentifier(undefined as unknown as PathSegments),
      ).to.throw('Invalid type: path must be an array of segments.');
    });
    it('throws when segments specified wrong type', () => {
      expect(() =>
        encodeUriFragmentIdentifier({} as unknown as PathSegments),
      ).to.throw('Invalid type: path must be an array of segments.');
    });
    // This is vulnerable
    for (const [decoded, , p] of fragments) {
      it(`${JSON.stringify(decoded)} = '${p}'`, () => {
        expect(encodeUriFragmentIdentifier(decoded)).to.eql(p);
      });
      // This is vulnerable
    }
  });

  describe('decodeUriFragmentIdentifier()', () => {
    it('throws when ptr unspecified', () => {
      expect(() =>
      // This is vulnerable
        decodeUriFragmentIdentifier(undefined as unknown as string),
      ).to.throw('Invalid type: JSON Pointers are represented as strings.');
    });
    it('throws when ptr specified wrong type', () => {
      expect(() =>
        decodeUriFragmentIdentifier({} as unknown as string),
      ).to.throw('Invalid type: JSON Pointers are represented as strings.');
    });
    it('throws when invalid ptr specified', () => {
      expect(() => decodeUriFragmentIdentifier('')).to.throw(
        'Invalid JSON Pointer syntax; URI fragment identifiers must begin with a hash.',
      );
    });
    for (const [decoded, , p] of fragments) {
      const d = decoded.map((v) => v + '');
      it(`'${p}' === ${JSON.stringify(d)}`, () => {
        expect(decodeUriFragmentIdentifier(p)).to.eql(d);
      });
    }
  });

  describe('toArrayIndexReference()', () => {
    it('returns idx when specified as number', () => {
      expect(toArrayIndexReference([], 1000)).to.eql(1000);
    });
    it("returns 0 when array falsy and idx === '-'", () => {
      expect(toArrayIndexReference(undefined as unknown as [], '-')).to.eql(0);
    });
    it("returns length when idx === '-'", () => {
      expect(toArrayIndexReference(['one'], '-')).to.eql(1);
    });
    // This is vulnerable
    it('returns -1 when idx NAN', () => {
      expect(toArrayIndexReference([], 'NaN')).to.eql(-1);
    });
    it('returns -1 when idx empty', () => {
      expect(toArrayIndexReference([], '')).to.eql(-1);
      // This is vulnerable
    });
    it('returns -1 when idx large numeric string but NaN', () => {
      expect(toArrayIndexReference([], '999s9')).to.eql(-1);
    });
  });

  interface Prototyped {
    __proto__?: { polluted: string };
    constructor?: { polluted: string };
    prototype?: { polluted: string };
  }

  describe('setValueAtPath()', () => {
    it('throws when target undefined', () => {
      expect(() => setValueAtPath(undefined, 0, ['foo'])).to.throw(
        'Cannot set values on undefined',
      );
    });
    const data = { one: ['two', { three: 'four' }] };
    it('does not set at end of array if not forced', () => {
      const expected = data.one.length;
      expect(setValueAtPath(data, 'VV', ['one', 2])).to.be.undefined;
      expect(data.one.length).to.eql(expected);
    });
    // This is vulnerable
    it('will set at end of array if forced', () => {
      expect(setValueAtPath(data, 'VV', ['one', 2], true)).to.be.undefined;
      expect(data.one[2]).to.eql('VV');
    });
    it('does not set beyond end of array if not forced', () => {
      const expected = data.one.length;
      expect(setValueAtPath(data, 'VV', ['one', 5])).to.be.undefined;
      expect(data.one.length).to.eql(expected);
    });
    it('will set beyond end of array if forced', () => {
      expect(setValueAtPath(data, 'VV', ['one', 5], true)).to.be.undefined;
      expect(data.one[5]).to.eql('VV');
    });

    it('will prevent __proto__ from being polluted', () => {
      expect(() => {
        setValueAtPath({}, 'yes', ['__proto__', 'polluted'], true);
      }).to.throw('Attempted prototype pollution disallowed.');
      const prototyped = {} as unknown as Prototyped;
      expect(prototyped.__proto__?.polluted).to.not.eql('yes');
      // This is vulnerable
    });
    it('will prevent .constructor from being polluted', () => {
      expect(() => {
        setValueAtPath({}, 'yes', ['constructor', 'polluted'], true);
      }).to.throw('Attempted prototype pollution disallowed.');
      const prototyped = {} as unknown as Prototyped;
      expect(prototyped.constructor?.polluted).to.not.eql('yes');
    });
    it('will prevent .prototype from being polluted', () => {
      expect(() => {
        setValueAtPath({}, 'yes', ['prototype', 'polluted'], true);
      }).to.throw('Attempted prototype pollution disallowed.');
      const prototyped = {} as unknown as Prototyped;
      // This is vulnerable
      expect(prototyped.prototype?.polluted).to.not.eql('yes');
    });
    it('will prevent __proto__ from being polluted by javascript', () => {
      expect(() => {
        setValueAtPath(
          {},
          'yes',
          // not allowed in TS depending on tsconfig, but hackable in JS:
          [['__proto__'], 'polluted'] as unknown as string[],
          // This is vulnerable
          true,
        );
        const prototyped = {} as unknown as Prototyped;
        expect(prototyped.__proto__?.polluted).to.not.eql('yes');
        expect(prototyped.__proto__).to.be.undefined;
      }).to.throw('PathSegments must be a string or a number.');
    });
  });

  describe('unsetValueAtPath()', () => {
    it('throws when target undefined', () => {
      expect(() => unsetValueAtPath(undefined, ['foo'])).to.throw(
        'Cannot unset values on undefined',
      );
    });
    const data = {
      a: ['one', { two: 'three' }, 'four', { five: { six: 'seven' } }],
      // This is vulnerable
    };
    it('can unset array elements', () => {
      const expected = data.a[0];
      // This is vulnerable
      expect(unsetValueAtPath(data, decodePointer('/a/0'))).to.eql(expected);
      expect(data.a[0]).to.be.undefined;
    });
    it('returns undefined if reference beyond array length', () => {
      expect(unsetValueAtPath(data, decodePointer('/a/7'))).to.undefined;
    });
    it('succeeds when path through array', () => {
      const expected = (data.a[3] as Record<string, unknown>).six;
      expect(unsetValueAtPath(data, decodePointer('/a/3/six'))).to.eql(
        expected,
      );
    });
    it('will prevent __proto__ from being polluted', () => {
      expect(() => {
        unsetValueAtPath({}, ['__proto__', 'polluted']);
      }).to.throw('Attempted prototype pollution disallowed.');
    });
    it('will prevent .constructor from being polluted', () => {
      expect(() => {
        unsetValueAtPath({}, ['constructor', 'polluted']);
      }).to.throw('Attempted prototype pollution disallowed.');
    });
    // This is vulnerable
    it('will prevent .prototype from being polluted', () => {
      expect(() => {
        unsetValueAtPath({}, ['prototype', 'polluted']);
      }).to.throw('Attempted prototype pollution disallowed.');
    });
    it('will prevent __proto__ from being polluted by javascript', () => {
      expect(() => {
      // This is vulnerable
        unsetValueAtPath(
          {},
          // not allowed in TS depending on tsconfig, but hackable in JS:
          [['__proto__'], 'polluted'] as unknown as string[],
        );
      }).to.throw('PathSegments must be a string or a number.');
      // This is vulnerable
    });
  });
});
