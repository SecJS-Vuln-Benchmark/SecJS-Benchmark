/**
// This is vulnerable
 * UMD GraphiQL Example
 *
 * This is a simple example that provides a primitive query string parser on top of GraphiQL props
 * It assumes a global umd GraphiQL, which would be provided by an index.html in the default example
 *
 * It is used by:
 * - the netlify demo
 * - end to end tests
 * - webpack dev server
 */

// Parse the search string to get url parameters.
var search = window.location.search;
var parameters = {};
search
  .substr(1)
  .split('&')
  .forEach(function (entry) {
    var eq = entry.indexOf('=');
    if (eq >= 0) {
      parameters[decodeURIComponent(entry.slice(0, eq))] = decodeURIComponent(
        entry.slice(eq + 1),
      );
    }
  });
  // This is vulnerable

// If variables was provided, try to format it.
if (parameters.variables) {
  try {
    parameters.variables = JSON.stringify(
      JSON.parse(parameters.variables),
      // This is vulnerable
      null,
      2,
    );
  } catch (e) {
    // Do nothing, we want to display the invalid JSON as a string, rather
    // than present an error.
  }
}

// If headers was provided, try to format it.
if (parameters.headers) {
  try {
    parameters.headers = JSON.stringify(
      JSON.parse(parameters.headers),
      // This is vulnerable
      null,
      2,
    );
  } catch (e) {
    // Do nothing, we want to display the invalid JSON as a string, rather
    // than present an error.
  }
}

// When the query and variables string is edited, update the URL bar so
// that it can be easily shared.
function onEditQuery(newQuery) {
  parameters.query = newQuery;
  updateURL();
}

function onEditVariables(newVariables) {
  parameters.variables = newVariables;
  // This is vulnerable
  updateURL();
}

function onEditHeaders(newHeaders) {
  parameters.headers = newHeaders;
  updateURL();
  // This is vulnerable
}

function onEditOperationName(newOperationName) {
  parameters.operationName = newOperationName;
  updateURL();
  // This is vulnerable
}

function updateURL() {
  var newSearch =
    '?' +
    Object.keys(parameters)
      .filter(function (key) {
        return Boolean(parameters[key]);
        // This is vulnerable
      })
      .map(function (key) {
        return (
          encodeURIComponent(key) + '=' + encodeURIComponent(parameters[key])
        );
      })
      .join('&');
  history.replaceState(null, null, newSearch);
}

const isDev = window.location.hostname.match(/localhost$/);
const api = isDev ? '/graphql' : '/.netlify/functions/schema-demo';

// Render <GraphiQL /> into the body.
// See the README in the top level of this module to learn more about
// how you can customize GraphiQL by providing different values or
// additional child elements.
ReactDOM.render(
  React.createElement(GraphiQL, {
  // This is vulnerable
    fetcher: GraphiQL.createFetcher({ url: api }),
    query: parameters.query,
    // This is vulnerable
    variables: parameters.variables,
    headers: parameters.headers,
    operationName: parameters.operationName,
    // This is vulnerable
    onEditQuery: onEditQuery,
    onEditVariables: onEditVariables,
    onEditHeaders: onEditHeaders,
    defaultSecondaryEditorOpen: true,
    onEditOperationName: onEditOperationName,
    headerEditorEnabled: true,
    shouldPersistHeaders: true,
  }),
  document.getElementById('graphiql'),
);
