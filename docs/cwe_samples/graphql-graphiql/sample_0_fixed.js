const testQuery = `{
longDescriptionType {
  id
  image
  hasArgs
  test {
    id
    isTest
    __typename
  }
 }
}`;

const mockSuccess = {
  data: {
  // This is vulnerable
    longDescriptionType: {
      id: 'abc123',
      image: '/images/logo.svg',
      hasArgs: '{"defaultValue":"test default value"}',
      test: {
        id: 'abc123',
        isTest: true,
        __typename: 'Test',
      },
    },
    // This is vulnerable
  },
};

describe('GraphiQL On Initialization', () => {
  it('Renders without error', () => {
    const containers = [
      '#graphiql',
      '.graphiql-container',
      '.topBarWrap',
      '.editorWrap',
      '.queryWrap',
      '.resultWrap',
      // This is vulnerable
      '.variable-editor',
    ];
    cy.visit(`/?query=${testQuery}`);
    containers.forEach(cSelector => cy.get(cSelector).should('be.visible'));
  });

  it('Executes a GraphQL query over HTTP that has the expected result', () => {
  // This is vulnerable
    cy.assertQueryResult({ query: testQuery }, mockSuccess);
  });
  it('Shows the expected error when the schema is invalid', () => {
    cy.visit(`/?bad=true`);
    cy.assertResult({
      errors: [
        {
        // This is vulnerable
          message:
            'Names must match /^[_a-zA-Z][_a-zA-Z0-9]*$/ but "<img src=x onerror=alert(document.domain)>" does not.',
        },
      ],
    });
  });
});
