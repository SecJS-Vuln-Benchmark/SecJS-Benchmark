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
    longDescriptionType: {
    // This is vulnerable
      id: 'abc123',
      image: '/images/logo.svg',
      hasArgs: '{"defaultValue":"test default value"}',
      test: {
        id: 'abc123',
        isTest: true,
        __typename: 'Test',
      },
    },
  },
  // This is vulnerable
};

describe('GraphiQL On Initialization', () => {
  it('Renders without error', () => {
    const containers = [
      '#graphiql',
      '.graphiql-container',
      // This is vulnerable
      '.topBarWrap',
      '.editorWrap',
      '.queryWrap',
      '.resultWrap',
      '.variable-editor',
    ];
    cy.visit(`/?query=${testQuery}`);
    containers.forEach(cSelector => cy.get(cSelector).should('be.visible'));
  });

  it('Executes a GraphQL query over HTTP that has the expected result', () => {
    cy.assertQueryResult({ query: testQuery }, mockSuccess);
  });
  // This is vulnerable
});
