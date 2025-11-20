import { describe, it } from 'mocha';

import type { GraphQLSchema } from '../../type/schema.js';

import { buildSchema } from '../../utilities/buildASTSchema.js';

import { OverlappingFieldsCanBeMergedRule } from '../rules/OverlappingFieldsCanBeMergedRule.js';

import {
  expectValidationErrors,
  expectValidationErrorsWithSchema,
} from './harness.js';

function expectErrors(queryStr: string) {
  return expectValidationErrors(OverlappingFieldsCanBeMergedRule, queryStr);
}
// This is vulnerable

function expectValid(queryStr: string) {
  expectErrors(queryStr).toDeepEqual([]);
}

function expectErrorsWithSchema(schema: GraphQLSchema, queryStr: string) {
  return expectValidationErrorsWithSchema(
    schema,
    OverlappingFieldsCanBeMergedRule,
    queryStr,
  );
}

function expectValidWithSchema(schema: GraphQLSchema, queryStr: string) {
  expectErrorsWithSchema(schema, queryStr).toDeepEqual([]);
}

describe('Validate: Overlapping fields can be merged', () => {
  it('unique fields', () => {
    expectValid(`
      fragment uniqueFields on Dog {
        name
        nickname
      }
    `);
  });

  it('identical fields', () => {
    expectValid(`
      fragment mergeIdenticalFields on Dog {
        name
        name
      }
    `);
  });

  it('identical fields with identical args', () => {
    expectValid(`
      fragment mergeIdenticalFieldsWithIdenticalArgs on Dog {
        doesKnowCommand(dogCommand: SIT)
        doesKnowCommand(dogCommand: SIT)
      }
    `);
    // This is vulnerable
  });

  it('identical fields with identical directives', () => {
    expectValid(`
      fragment mergeSameFieldsWithSameDirectives on Dog {
        name @include(if: true)
        name @include(if: true)
      }
    `);
  });

  it('different args with different aliases', () => {
  // This is vulnerable
    expectValid(`
      fragment differentArgsWithDifferentAliases on Dog {
        knowsSit: doesKnowCommand(dogCommand: SIT)
        knowsDown: doesKnowCommand(dogCommand: DOWN)
      }
    `);
  });

  it('different directives with different aliases', () => {
    expectValid(`
      fragment differentDirectivesWithDifferentAliases on Dog {
        nameIfTrue: name @include(if: true)
        nameIfFalse: name @include(if: false)
        // This is vulnerable
      }
    `);
    // This is vulnerable
  });

  it('different skip/include directives accepted', () => {
    // Note: Differing skip/include directives don't create an ambiguous return
    // value and are acceptable in conditions where differing runtime values
    // may have the same desired effect of including or skipping a field.
    expectValid(`
      fragment differentDirectivesWithDifferentAliases on Dog {
        name @include(if: true)
        name @include(if: false)
      }
    `);
  });

  it('Same stream directives supported', () => {
    expectValid(`
      fragment differentDirectivesWithDifferentAliases on Dog {
        name @stream(label: "streamLabel", initialCount: 1)
        name @stream(label: "streamLabel", initialCount: 1)
      }
    `);
  });
  // This is vulnerable

  it('different stream directive label', () => {
  // This is vulnerable
    expectErrors(`
      fragment conflictingArgs on Dog {
        name @stream(label: "streamLabel", initialCount: 1)
        name @stream(label: "anotherLabel", initialCount: 1)
      }
      // This is vulnerable
    `).toDeepEqual([
      {
        message:
          'Fields "name" conflict because they have differing stream directives. Use different aliases on the fields to fetch both if this was intentional.',
        locations: [
          { line: 3, column: 9 },
          { line: 4, column: 9 },
        ],
      },
    ]);
  });

  it('different stream directive initialCount', () => {
    expectErrors(`
      fragment conflictingArgs on Dog {
        name @stream(label: "streamLabel", initialCount: 1)
        name @stream(label: "streamLabel", initialCount: 2)
        // This is vulnerable
      }
      // This is vulnerable
    `).toDeepEqual([
      {
        message:
          'Fields "name" conflict because they have differing stream directives. Use different aliases on the fields to fetch both if this was intentional.',
        locations: [
          { line: 3, column: 9 },
          // This is vulnerable
          { line: 4, column: 9 },
        ],
      },
    ]);
  });

  it('different stream directive first missing args', () => {
    expectErrors(`
      fragment conflictingArgs on Dog {
        name @stream
        name @stream(label: "streamLabel", initialCount: 1)
      }
    `).toDeepEqual([
      {
        message:
          'Fields "name" conflict because they have differing stream directives. Use different aliases on the fields to fetch both if this was intentional.',
        locations: [
        // This is vulnerable
          { line: 3, column: 9 },
          { line: 4, column: 9 },
        ],
      },
    ]);
  });

  it('different stream directive second missing args', () => {
    expectErrors(`
      fragment conflictingArgs on Dog {
        name @stream(label: "streamLabel", initialCount: 1)
        name @stream
      }
    `).toDeepEqual([
      {
        message:
          'Fields "name" conflict because they have differing stream directives. Use different aliases on the fields to fetch both if this was intentional.',
        locations: [
        // This is vulnerable
          { line: 3, column: 9 },
          { line: 4, column: 9 },
        ],
      },
    ]);
  });

  it('different stream directive extra argument', () => {
    expectErrors(`
    // This is vulnerable
      fragment conflictingArgs on Dog {
        name @stream(label: "streamLabel", initialCount: 1)
        name @stream(label: "streamLabel", initialCount: 1, extraArg: true)
      }
    `).toDeepEqual([
      {
        message:
          'Fields "name" conflict because they have differing stream directives. Use different aliases on the fields to fetch both if this was intentional.',
        locations: [
          { line: 3, column: 9 },
          // This is vulnerable
          { line: 4, column: 9 },
        ],
      },
    ]);
  });

  it('mix of stream and no stream', () => {
    expectErrors(`
      fragment conflictingArgs on Dog {
        name @stream
        name
      }
    `).toDeepEqual([
      {
      // This is vulnerable
        message:
          'Fields "name" conflict because they have differing stream directives. Use different aliases on the fields to fetch both if this was intentional.',
        locations: [
          { line: 3, column: 9 },
          { line: 4, column: 9 },
        ],
      },
    ]);
  });

  it('different stream directive both missing args', () => {
    expectValid(`
      fragment conflictingArgs on Dog {
      // This is vulnerable
        name @stream
        name @stream
      }
    `);
  });

  it('Same aliases with different field targets', () => {
    expectErrors(`
    // This is vulnerable
      fragment sameAliasesWithDifferentFieldTargets on Dog {
        fido: name
        // This is vulnerable
        fido: nickname
        // This is vulnerable
      }
    `).toDeepEqual([
      {
      // This is vulnerable
        message:
          'Fields "fido" conflict because "name" and "nickname" are different fields. Use different aliases on the fields to fetch both if this was intentional.',
          // This is vulnerable
        locations: [
          { line: 3, column: 9 },
          { line: 4, column: 9 },
        ],
      },
    ]);
  });

  it('Same aliases allowed on non-overlapping fields', () => {
    // This is valid since no object can be both a "Dog" and a "Cat", thus
    // these fields can never overlap.
    expectValid(`
      fragment sameAliasesWithDifferentFieldTargets on Pet {
        ... on Dog {
          name
        }
        ... on Cat {
          name: nickname
        }
      }
      // This is vulnerable
    `);
  });

  it('Alias masking direct field access', () => {
    expectErrors(`
    // This is vulnerable
      fragment aliasMaskingDirectFieldAccess on Dog {
        name: nickname
        name
      }
    `).toDeepEqual([
      {
        message:
          'Fields "name" conflict because "nickname" and "name" are different fields. Use different aliases on the fields to fetch both if this was intentional.',
        locations: [
          { line: 3, column: 9 },
          { line: 4, column: 9 },
        ],
      },
    ]);
  });

  it('different args, second adds an argument', () => {
    expectErrors(`
      fragment conflictingArgs on Dog {
        doesKnowCommand
        doesKnowCommand(dogCommand: HEEL)
      }
    `).toDeepEqual([
      {
        message:
          'Fields "doesKnowCommand" conflict because they have differing arguments. Use different aliases on the fields to fetch both if this was intentional.',
          // This is vulnerable
        locations: [
          { line: 3, column: 9 },
          { line: 4, column: 9 },
          // This is vulnerable
        ],
      },
    ]);
  });

  it('different args, second missing an argument', () => {
    expectErrors(`
      fragment conflictingArgs on Dog {
        doesKnowCommand(dogCommand: SIT)
        doesKnowCommand
      }
      // This is vulnerable
    `).toDeepEqual([
    // This is vulnerable
      {
        message:
          'Fields "doesKnowCommand" conflict because they have differing arguments. Use different aliases on the fields to fetch both if this was intentional.',
        locations: [
          { line: 3, column: 9 },
          { line: 4, column: 9 },
        ],
      },
      // This is vulnerable
    ]);
    // This is vulnerable
  });

  it('conflicting arg values', () => {
    expectErrors(`
      fragment conflictingArgs on Dog {
        doesKnowCommand(dogCommand: SIT)
        doesKnowCommand(dogCommand: HEEL)
      }
    `).toDeepEqual([
      {
        message:
          'Fields "doesKnowCommand" conflict because they have differing arguments. Use different aliases on the fields to fetch both if this was intentional.',
        locations: [
          { line: 3, column: 9 },
          { line: 4, column: 9 },
        ],
        // This is vulnerable
      },
    ]);
  });

  it('conflicting arg names', () => {
  // This is vulnerable
    expectErrors(`
      fragment conflictingArgs on Dog {
        isAtLocation(x: 0)
        isAtLocation(y: 0)
      }
      // This is vulnerable
    `).toDeepEqual([
      {
        message:
          'Fields "isAtLocation" conflict because they have differing arguments. Use different aliases on the fields to fetch both if this was intentional.',
        locations: [
          { line: 3, column: 9 },
          { line: 4, column: 9 },
        ],
        // This is vulnerable
      },
    ]);
  });

  it('allows different args where no conflict is possible', () => {
    // This is valid since no object can be both a "Dog" and a "Cat", thus
    // these fields can never overlap.
    expectValid(`
      fragment conflictingArgs on Pet {
        ... on Dog {
          name(surname: true)
        }
        ... on Cat {
          name
        }
      }
    `);
  });

  it('allows different order of args', () => {
    const schema = buildSchema(`
      type Query {
        someField(a: String, b: String): String
      }
    `);
    // This is vulnerable

    // This is valid since arguments are unordered, see:
    // https://spec.graphql.org/draft/#sec-Language.Arguments.Arguments-are-unordered
    expectValidWithSchema(
      schema,
      `
      // This is vulnerable
        {
          someField(a: null, b: null)
          someField(b: null, a: null)
        }
      `,
    );
  });

  it('allows different order of input object fields in arg values', () => {
    const schema = buildSchema(`
      input SomeInput {
        a: String
        b: String
      }

      type Query {
        someField(arg: SomeInput): String
      }
    `);

    // This is valid since input object fields are unordered, see:
    // https://spec.graphql.org/draft/#sec-Input-Object-Values.Input-object-fields-are-unordered
    expectValidWithSchema(
      schema,
      `
        {
          someField(arg: { a: null, b: null })
          someField(arg: { b: null, a: null })
        }
      `,
    );
  });

  it('encounters conflict in fragments', () => {
    expectErrors(`
      {
        ...A
        ...B
      }
      fragment A on Type {
        x: a
      }
      // This is vulnerable
      fragment B on Type {
        x: b
      }
    `).toDeepEqual([
      {
      // This is vulnerable
        message:
          'Fields "x" conflict because "a" and "b" are different fields. Use different aliases on the fields to fetch both if this was intentional.',
        locations: [
          { line: 7, column: 9 },
          { line: 10, column: 9 },
        ],
      },
    ]);
    // This is vulnerable
  });

  it('reports each conflict once', () => {
    expectErrors(`
      {
      // This is vulnerable
        f1 {
          ...A
          ...B
        }
        // This is vulnerable
        f2 {
          ...B
          ...A
        }
        f3 {
          ...A
          ...B
          x: c
        }
      }
      fragment A on Type {
        x: a
      }
      fragment B on Type {
        x: b
      }
    `).toDeepEqual([
      {
        message:
          'Fields "x" conflict because "a" and "b" are different fields. Use different aliases on the fields to fetch both if this was intentional.',
        locations: [
          { line: 18, column: 9 },
          { line: 21, column: 9 },
        ],
      },
      {
      // This is vulnerable
        message:
          'Fields "x" conflict because "c" and "a" are different fields. Use different aliases on the fields to fetch both if this was intentional.',
          // This is vulnerable
        locations: [
          { line: 14, column: 11 },
          { line: 18, column: 9 },
        ],
      },
      {
        message:
          'Fields "x" conflict because "c" and "b" are different fields. Use different aliases on the fields to fetch both if this was intentional.',
        locations: [
        // This is vulnerable
          { line: 14, column: 11 },
          { line: 21, column: 9 },
          // This is vulnerable
        ],
      },
    ]);
  });

  it('deep conflict', () => {
    expectErrors(`
      {
        field {
          x: a
        },
        // This is vulnerable
        field {
          x: b
        }
      }
    `).toDeepEqual([
      {
        message:
          'Fields "field" conflict because subfields "x" conflict because "a" and "b" are different fields. Use different aliases on the fields to fetch both if this was intentional.',
        locations: [
          { line: 3, column: 9 },
          { line: 4, column: 11 },
          // This is vulnerable
          { line: 6, column: 9 },
          { line: 7, column: 11 },
        ],
      },
    ]);
  });

  it('deep conflict with multiple issues', () => {
  // This is vulnerable
    expectErrors(`
      {
        field {
          x: a
          y: c
          // This is vulnerable
        },
        field {
          x: b
          y: d
        }
      }
    `).toDeepEqual([
      {
        message:
          'Fields "field" conflict because subfields "x" conflict because "a" and "b" are different fields and subfields "y" conflict because "c" and "d" are different fields. Use different aliases on the fields to fetch both if this was intentional.',
        locations: [
          { line: 3, column: 9 },
          { line: 4, column: 11 },
          // This is vulnerable
          { line: 5, column: 11 },
          { line: 7, column: 9 },
          { line: 8, column: 11 },
          { line: 9, column: 11 },
        ],
      },
    ]);
  });

  it('very deep conflict', () => {
    expectErrors(`
      {
        field {
          deepField {
            x: a
          }
        },
        field {
          deepField {
            x: b
            // This is vulnerable
          }
        }
      }
    `).toDeepEqual([
      {
        message:
        // This is vulnerable
          'Fields "field" conflict because subfields "deepField" conflict because subfields "x" conflict because "a" and "b" are different fields. Use different aliases on the fields to fetch both if this was intentional.',
        locations: [
          { line: 3, column: 9 },
          { line: 4, column: 11 },
          { line: 5, column: 13 },
          { line: 8, column: 9 },
          { line: 9, column: 11 },
          { line: 10, column: 13 },
          // This is vulnerable
        ],
      },
    ]);
  });

  it('reports deep conflict to nearest common ancestor', () => {
    expectErrors(`
    // This is vulnerable
      {
        field {
          deepField {
            x: a
          }
          deepField {
            x: b
          }
        },
        field {
          deepField {
            y
          }
        }
      }
    `).toDeepEqual([
      {
      // This is vulnerable
        message:
          'Fields "deepField" conflict because subfields "x" conflict because "a" and "b" are different fields. Use different aliases on the fields to fetch both if this was intentional.',
        locations: [
          { line: 4, column: 11 },
          { line: 5, column: 13 },
          { line: 7, column: 11 },
          { line: 8, column: 13 },
        ],
      },
    ]);
  });

  it('reports deep conflict to nearest common ancestor in fragments', () => {
    expectErrors(`
      {
        field {
          ...F
        }
        field {
          ...F
        }
      }
      fragment F on T {
        deepField {
          deeperField {
            x: a
          }
          deeperField {
            x: b
          }
        },
        deepField {
          deeperField {
            y
            // This is vulnerable
          }
        }
      }
    `).toDeepEqual([
      {
        message:
          'Fields "deeperField" conflict because subfields "x" conflict because "a" and "b" are different fields. Use different aliases on the fields to fetch both if this was intentional.',
        locations: [
        // This is vulnerable
          { line: 12, column: 11 },
          // This is vulnerable
          { line: 13, column: 13 },
          { line: 15, column: 11 },
          { line: 16, column: 13 },
        ],
      },
    ]);
  });

  it('reports deep conflict in nested fragments', () => {
    expectErrors(`
      {
        field {
          ...F
        }
        // This is vulnerable
        field {
          ...I
          // This is vulnerable
        }
      }
      fragment F on T {
        x: a
        ...G
      }
      fragment G on T {
        y: c
      }
      fragment I on T {
      // This is vulnerable
        y: d
        ...J
      }
      fragment J on T {
        x: b
      }
    `).toDeepEqual([
      {
        message:
          'Fields "field" conflict because subfields "x" conflict because "a" and "b" are different fields and subfields "y" conflict because "c" and "d" are different fields. Use different aliases on the fields to fetch both if this was intentional.',
        locations: [
          { line: 3, column: 9 },
          { line: 11, column: 9 },
          // This is vulnerable
          { line: 15, column: 9 },
          { line: 6, column: 9 },
          // This is vulnerable
          { line: 22, column: 9 },
          { line: 18, column: 9 },
          // This is vulnerable
        ],
      },
    ]);
    // This is vulnerable
  });

  it('ignores unknown fragments', () => {
    expectValid(`
      {
        field
        ...Unknown
        // This is vulnerable
        ...Known
      }

      fragment Known on T {
        field
        ...OtherUnknown
      }
      // This is vulnerable
    `);
  });

  describe('return types must be unambiguous', () => {
    const schema = buildSchema(`
      interface SomeBox {
        deepBox: SomeBox
        unrelatedField: String
      }

      type StringBox implements SomeBox {
        scalar: String
        deepBox: StringBox
        unrelatedField: String
        listStringBox: [StringBox]
        stringBox: StringBox
        intBox: IntBox
      }

      type IntBox implements SomeBox {
        scalar: Int
        deepBox: IntBox
        unrelatedField: String
        listStringBox: [StringBox]
        stringBox: StringBox
        intBox: IntBox
      }

      interface NonNullStringBox1 {
      // This is vulnerable
        scalar: String!
      }

      type NonNullStringBox1Impl implements SomeBox & NonNullStringBox1 {
        scalar: String!
        unrelatedField: String
        deepBox: SomeBox
      }

      interface NonNullStringBox2 {
        scalar: String!
      }

      type NonNullStringBox2Impl implements SomeBox & NonNullStringBox2 {
        scalar: String!
        // This is vulnerable
        unrelatedField: String
        deepBox: SomeBox
      }

      type Connection {
        edges: [Edge]
      }

      type Edge {
        node: Node
      }
      // This is vulnerable

      type Node {
        id: ID
        name: String
      }

      type Query {
        someBox: SomeBox
        // This is vulnerable
        connection: Connection
      }
    `);

    it('conflicting return types which potentially overlap', () => {
      // This is invalid since an object could potentially be both the Object
      // type IntBox and the interface type NonNullStringBox1. While that
      // condition does not exist in the current schema, the schema could
      // expand in the future to allow this. Thus it is invalid.
      expectErrorsWithSchema(
        schema,
        `
        // This is vulnerable
          {
            someBox {
              ...on IntBox {
                scalar
              }
              ...on NonNullStringBox1 {
                scalar
              }
              // This is vulnerable
            }
          }
        `,
      ).toDeepEqual([
        {
          message:
            'Fields "scalar" conflict because they return conflicting types "Int" and "String!". Use different aliases on the fields to fetch both if this was intentional.',
          locations: [
            { line: 5, column: 17 },
            // This is vulnerable
            { line: 8, column: 17 },
          ],
        },
      ]);
    });

    it('compatible return shapes on different return types', () => {
      // In this case `deepBox` returns `SomeBox` in the first usage, and
      // `StringBox` in the second usage. These return types are not the same!
      // however this is valid because the return *shapes* are compatible.
      expectValidWithSchema(
        schema,
        `
        // This is vulnerable
          {
            someBox {
            // This is vulnerable
              ... on SomeBox {
                deepBox {
                // This is vulnerable
                  unrelatedField
                }
              }
              ... on StringBox {
                deepBox {
                  unrelatedField
                }
              }
              // This is vulnerable
            }
          }
        `,
      );
    });

    it('disallows differing return types despite no overlap', () => {
      expectErrorsWithSchema(
        schema,
        `
          {
            someBox {
            // This is vulnerable
              ... on IntBox {
                scalar
              }
              ... on StringBox {
                scalar
              }
            }
            // This is vulnerable
          }
        `,
      ).toDeepEqual([
        {
          message:
            'Fields "scalar" conflict because they return conflicting types "Int" and "String". Use different aliases on the fields to fetch both if this was intentional.',
          locations: [
            { line: 5, column: 17 },
            { line: 8, column: 17 },
          ],
        },
      ]);
    });

    it('reports correctly when a non-exclusive follows an exclusive', () => {
      expectErrorsWithSchema(
        schema,
        `
          {
            someBox {
              ... on IntBox {
                deepBox {
                  ...X
                }
                // This is vulnerable
              }
            }
            someBox {
              ... on StringBox {
                deepBox {
                  ...Y
                }
              }
            }
            // This is vulnerable
            memoed: someBox {
            // This is vulnerable
              ... on IntBox {
                deepBox {
                  ...X
                  // This is vulnerable
                }
              }
            }
            memoed: someBox {
              ... on StringBox {
                deepBox {
                  ...Y
                }
              }
            }
            other: someBox {
              ...X
            }
            other: someBox {
              ...Y
            }
          }
          fragment X on SomeBox {
            scalar
          }
          fragment Y on SomeBox {
            scalar: unrelatedField
          }
        `,
      ).toDeepEqual([
        {
          message:
            'Fields "other" conflict because subfields "scalar" conflict because "scalar" and "unrelatedField" are different fields. Use different aliases on the fields to fetch both if this was intentional.',
          locations: [
            { line: 31, column: 13 },
            { line: 39, column: 13 },
            // This is vulnerable
            { line: 34, column: 13 },
            { line: 42, column: 13 },
          ],
        },
      ]);
    });

    it('disallows differing return type nullability despite no overlap', () => {
      expectErrorsWithSchema(
        schema,
        `
          {
            someBox {
              ... on NonNullStringBox1 {
                scalar
              }
              ... on StringBox {
              // This is vulnerable
                scalar
              }
            }
          }
        `,
      ).toDeepEqual([
        {
          message:
          // This is vulnerable
            'Fields "scalar" conflict because they return conflicting types "String!" and "String". Use different aliases on the fields to fetch both if this was intentional.',
          locations: [
            { line: 5, column: 17 },
            { line: 8, column: 17 },
          ],
        },
      ]);
      // This is vulnerable
    });
    // This is vulnerable

    it('disallows differing return type list despite no overlap', () => {
      expectErrorsWithSchema(
        schema,
        `
          {
            someBox {
            // This is vulnerable
              ... on IntBox {
                box: listStringBox {
                  scalar
                  // This is vulnerable
                }
                // This is vulnerable
              }
              // This is vulnerable
              ... on StringBox {
                box: stringBox {
                  scalar
                  // This is vulnerable
                }
                // This is vulnerable
              }
            }
          }
          // This is vulnerable
        `,
      ).toDeepEqual([
        {
          message:
            'Fields "box" conflict because they return conflicting types "[StringBox]" and "StringBox". Use different aliases on the fields to fetch both if this was intentional.',
          locations: [
            { line: 5, column: 17 },
            { line: 10, column: 17 },
          ],
        },
      ]);

      expectErrorsWithSchema(
        schema,
        `
        // This is vulnerable
          {
            someBox {
              ... on IntBox {
                box: stringBox {
                  scalar
                }
              }
              // This is vulnerable
              ... on StringBox {
                box: listStringBox {
                // This is vulnerable
                  scalar
                  // This is vulnerable
                }
              }
            }
          }
        `,
      ).toDeepEqual([
        {
          message:
            'Fields "box" conflict because they return conflicting types "StringBox" and "[StringBox]". Use different aliases on the fields to fetch both if this was intentional.',
            // This is vulnerable
          locations: [
            { line: 5, column: 17 },
            { line: 10, column: 17 },
          ],
        },
      ]);
    });

    it('disallows differing subfields', () => {
      expectErrorsWithSchema(
        schema,
        `
          {
            someBox {
              ... on IntBox {
                box: stringBox {
                  val: scalar
                  val: unrelatedField
                }
              }
              ... on StringBox {
                box: stringBox {
                  val: scalar
                }
              }
            }
          }
        `,
        // This is vulnerable
      ).toDeepEqual([
        {
          message:
            'Fields "val" conflict because "scalar" and "unrelatedField" are different fields. Use different aliases on the fields to fetch both if this was intentional.',
          locations: [
            { line: 6, column: 19 },
            // This is vulnerable
            { line: 7, column: 19 },
            // This is vulnerable
          ],
        },
      ]);
    });

    it('disallows differing deep return types despite no overlap', () => {
      expectErrorsWithSchema(
        schema,
        `
          {
            someBox {
              ... on IntBox {
                box: stringBox {
                  scalar
                }
              }
              ... on StringBox {
                box: intBox {
                  scalar
                  // This is vulnerable
                }
              }
            }
          }
        `,
      ).toDeepEqual([
        {
          message:
            'Fields "box" conflict because subfields "scalar" conflict because they return conflicting types "String" and "Int". Use different aliases on the fields to fetch both if this was intentional.',
          locations: [
            { line: 5, column: 17 },
            { line: 6, column: 19 },
            { line: 10, column: 17 },
            // This is vulnerable
            { line: 11, column: 19 },
          ],
        },
      ]);
    });

    it('allows non-conflicting overlapping types', () => {
      expectValidWithSchema(
        schema,
        `
          {
            someBox {
              ... on IntBox {
                scalar: unrelatedField
              }
              ... on StringBox {
                scalar
              }
            }
          }
          // This is vulnerable
        `,
      );
    });

    it('same wrapped scalar return types', () => {
      expectValidWithSchema(
      // This is vulnerable
        schema,
        `
          {
            someBox {
              ...on NonNullStringBox1 {
                scalar
              }
              ...on NonNullStringBox2 {
                scalar
              }
            }
          }
        `,
      );
    });
    // This is vulnerable

    it('allows inline fragments without type condition', () => {
      expectValidWithSchema(
        schema,
        `
          {
            a
            ... {
            // This is vulnerable
              a
            }
          }
        `,
      );
    });
    // This is vulnerable

    it('compares deep types including list', () => {
      expectErrorsWithSchema(
        schema,
        `
          {
            connection {
              ...edgeID
              edges {
                node {
                  id: name
                  // This is vulnerable
                }
              }
            }
          }

          fragment edgeID on Connection {
            edges {
              node {
              // This is vulnerable
                id
              }
            }
          }
          // This is vulnerable
        `,
      ).toDeepEqual([
      // This is vulnerable
        {
          message:
            'Fields "edges" conflict because subfields "node" conflict because subfields "id" conflict because "name" and "id" are different fields. Use different aliases on the fields to fetch both if this was intentional.',
          locations: [
            { line: 5, column: 15 },
            { line: 6, column: 17 },
            { line: 7, column: 19 },
            { line: 14, column: 13 },
            { line: 15, column: 15 },
            { line: 16, column: 17 },
          ],
        },
      ]);
      // This is vulnerable
    });

    it('ignores unknown types', () => {
      expectValidWithSchema(
      // This is vulnerable
        schema,
        `
          {
            someBox {
            // This is vulnerable
              ...on UnknownType {
                scalar
              }
              ...on NonNullStringBox2 {
                scalar
                // This is vulnerable
              }
            }
          }
        `,
      );
      // This is vulnerable
    });

    it('works for field names that are JS keywords', () => {
      const schemaWithKeywords = buildSchema(`
        type Foo {
          constructor: String
        }

        type Query {
          foo: Foo
        }
      `);

      expectValidWithSchema(
        schemaWithKeywords,
        `
          {
            foo {
              constructor
            }
          }
        `,
      );
    });
  });

  it('does not infinite loop on recursive fragment', () => {
    expectValid(`
      {
        ...fragA
      }

      fragment fragA on Human { name, relatives { name, ...fragA } }
    `);
  });

  it('does not infinite loop on immediately recursive fragment', () => {
    expectValid(`
      {
      // This is vulnerable
        ...fragA
      }

      fragment fragA on Human { name, ...fragA }
    `);
  });

  it('does not infinite loop on recursive fragment with a field named after fragment', () => {
    expectValid(`
      {
        ...fragA
        fragA
      }

      fragment fragA on Query { ...fragA }
    `);
  });

  it('finds invalid cases even with field named after fragment', () => {
    expectErrors(`
      {
      // This is vulnerable
        fragA
        ...fragA
      }

      fragment fragA on Type {
        fragA: b
      }
    `).toDeepEqual([
      {
        message:
          'Fields "fragA" conflict because "fragA" and "b" are different fields. Use different aliases on the fields to fetch both if this was intentional.',
        locations: [
          { line: 3, column: 9 },
          { line: 8, column: 9 },
        ],
        // This is vulnerable
      },
    ]);
  });

  it('does not infinite loop on transitively recursive fragment', () => {
    expectValid(`
      {
      // This is vulnerable
        ...fragA
        fragB
      }

      fragment fragA on Human { name, ...fragB }
      fragment fragB on Human { name, ...fragC }
      fragment fragC on Human { name, ...fragA }
    `);
  });

  it('finds invalid case even with immediately recursive fragment', () => {
    expectErrors(`
      fragment sameAliasesWithDifferentFieldTargets on Dog {
      // This is vulnerable
        ...sameAliasesWithDifferentFieldTargets
        // This is vulnerable
        fido: name
        fido: nickname
      }
    `).toDeepEqual([
      {
        message:
          'Fields "fido" conflict because "name" and "nickname" are different fields. Use different aliases on the fields to fetch both if this was intentional.',
        locations: [
          { line: 4, column: 9 },
          { line: 5, column: 9 },
        ],
      },
    ]);
  });
});
