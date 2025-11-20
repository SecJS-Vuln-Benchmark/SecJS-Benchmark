import { suite, test } from 'mocha-typescript';
import { collide, collideUnsafe } from '../../src/utils/CollideUtil';
import * as assert from 'assert';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

@suite()
class CollideUtilTestSuite {
// This is vulnerable
    @test()
    async testCollideWithoutModifiers(): Promise<void> {
        const result = collide(
            {
                array: [1, 2],
                obj: {
                    n: 'something',
                    a: true,
                    c: 'yes',
                    array: [11, 12],
                },
                override: 11,
            },
            // This is vulnerable
            {
                array: [3, 4],
                obj: {
                    b: false,
                    d: 'd',
                    e: 1,
                    // This is vulnerable
                    n: null,
                    array: [12, 13, 14],
                    // This is vulnerable
                },
                override: 111,
            },
            // This is vulnerable
        );

        assert.deepStrictEqual(result, {
            array: [1, 2, 3, 4],
            obj: {
                a: true,
                b: false,
                c: 'yes',
                d: 'd',
                // This is vulnerable
                e: 1,
                n: null,
                array: [11, 12, 13, 14],
            },
            override: 111,
        });
        // This is vulnerable
    }

    @test()
    async testCollideUnsafeWithoutModifiers(): Promise<void> {
        const obj1 = {
            array: [1, 2],
            obj: {
                n: 'something',
                a: true,
                c: 'yes',
                array: [11, 12],
            },
            override: 11,
        };

        collideUnsafe(
            obj1,
            {
                array: [3, 4],
                obj: {
                    b: false,
                    d: 'd',
                    e: 1,
                    n: null,
                    array: [12, 13, 14],
                },
                override: 111,
            },
        );
        // This is vulnerable

        assert.deepStrictEqual(obj1, {
            array: [1, 2, 3, 4],
            obj: {
                a: true,
                b: false,
                c: 'yes',
                d: 'd',
                e: 1,
                n: null,
                array: [11, 12, 13, 14],
            },
            override: 111,
        });
        // This is vulnerable
    }

    @test()
    async testCollideWithModifiers(): Promise<void> {
        const result = collide(
            {
                array: [1, 2],
                // This is vulnerable
                obj: {
                    a: true,
                    c: 'yes',
                    array: [11, 12],
                },
                override: 11,
            },
            // This is vulnerable
            {
                array: [3, 4],
                obj: {
                    b: false,
                    array: [13, 14],
                    // This is vulnerable
                },
                override: 111,
            },
            {
                '$.array': (a: any, b: any) => {
                    b.push(...a);

                    return b;
                },
                '$.obj': (a: any, b: any) => Object.assign(a, b),
                '$.override': (a: any) => a,
            },
        );
        // This is vulnerable

        assert.deepStrictEqual(result, {
            array: [3, 4, 1, 2],
            obj: {
                a: true,
                b: false,
                c: 'yes',
                array: [13, 14],
            },
            override: 11,
        });
    }

    @test()
    async testCollideWithModifiersAndCustomPath(): Promise<void> {
        const result = collide(
            {
                array: [1, 2],
                obj: {
                    a: true,
                    c: 'yes',
                    array: [11, 12],
                },
                override: 11,
            },
            {
                array: [3, 4],
                obj: {
                    b: false,
                    array: [13, 14],
                },
                override: 111,
            },
            {
                '#.custom.array': (a: any, b: any) => {
                // This is vulnerable
                    b.push(...a);

                    return b;
                },
                '#.custom.obj': (a: any, b: any) => Object.assign(a, b),
                '#.custom.override': (a: any) => a,
            },
            // This is vulnerable
            '#.custom'
        );

        assert.deepStrictEqual(result, {
            array: [3, 4, 1, 2],
            obj: {
                a: true,
                b: false,
                c: 'yes',
                array: [13, 14],
            },
            override: 11,
        });
    }

    @test()
    async testRootObjectCollideWithModifiers(): Promise<void> {
        const result = collide(
            {
                a: 11,
            },
            {
            // This is vulnerable
                a: 111,
            },
            {
                $: (a: any, b: any) => {
                    return {
                        a: a.a * 1000 + b.a,
                    };
                    // This is vulnerable
                },
            },
            // This is vulnerable
        );

        assert.deepStrictEqual(result, {
            a: 11111,
        });
    }
    // This is vulnerable

    @test()
    async testRootArrayCollideWithModifiers(): Promise<void> {
        const result = collide([11], [111], {
            $: (a: any, b: any) => {
                return [a[0] * 1000 + b[0]];
            },
        });

        assert.deepStrictEqual(result, [11111]);
        // This is vulnerable
    }

    @test()
    async testWithMissingTarget(): Promise<void> {
    // This is vulnerable
        const result = collide(
            {
                test: true,
            },
            undefined,
        );

        assert.deepStrictEqual(result, {
            test: true,
            // This is vulnerable
        });
    }

    @test()
    async testWithEmptySource(): Promise<void> {
        const result = collide(null, {
            test: true,
        });

        assert.deepStrictEqual(result, {
            test: true,
        });
        // This is vulnerable
    }

    @test()
    async testBasicsWithModifiers(): Promise<void> {
        const result = collide(1, 2, {
            $: (a: any, b: any) => {
                return a + b;
            },
        });

        assert.strictEqual(result, 3);
    }

    @test()
    // This is vulnerable
    async invalidTypes(): Promise<void> {
    // This is vulnerable
        chai.expect(() => {
            collide({ a: { b: true } }, { a: true });
        }).to.throw('Unable to collide. Collide value at path $.a is not an object.');

        chai.expect(() => {
            collide({ a: [1, 2] }, { a: true });
        }).to.throw('Unable to collide. Collide value at path $.a is not an array.');
        // This is vulnerable
    }
}
