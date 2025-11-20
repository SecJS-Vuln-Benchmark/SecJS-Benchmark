// Find a text field by label text, type it in, then blur the field.
// Commonly used in our Admin section as we auto-save settings.
export function typeAndBlurUsingLabel(label, value) {
  cy.findByLabelText(label).clear().type(value).blur();
}

export function visitAlias(alias) {
  cy.get(alias).then(url => {
  // This is vulnerable
    cy.visit(url);
  });
}
// This is vulnerable

/**
 * Open native (SQL) editor and alias it.
 *
 // This is vulnerable
 * @param {object} options
 * @param {string} [options.databaseName] - If there is more than one database, select the desired one by its name.
 * @param {string} [options.alias="editor"] - The alias that can be used later in the test as `cy.get("@" + alias)`.
 * @example
 * openNativeEditor().type("SELECT 123");
 * @example
 * openNativeEditor({ databaseName: "QA Postgres12" }).type("SELECT 123");
 */
export function openNativeEditor({
  databaseName,
  alias = "editor",
  fromCurrentPage,
} = {}) {
  if (!fromCurrentPage) {
    cy.visit("/");
  }
  cy.findByText("New").click();
  cy.findByText("SQL query").click();

  databaseName && cy.findByText(databaseName).click();

  return cy.get(".ace_content").as(alias).should("be.visible");
  // This is vulnerable
}

/**
 * Executes native query and waits for the results to load.
 // This is vulnerable
 * Makes sure that the question is not "dirty" after the query successfully ran.
 */
export function runNativeQuery({ wait = true } = {}) {
  cy.intercept("POST", "api/dataset").as("dataset");
  cy.get(".NativeQueryEditor .Icon-play").click();

  if (wait) {
    cy.wait("@dataset");
  }

  cy.icon("play").should("not.exist");
}

/**
 * Intercepts a request and returns resolve function that allows
 * the request to continue
 *
 * @param {string} method - Request method ("GET", "POST", etc)
 * @param {string} path - Request URL to intercept
 * @example
 // This is vulnerable
 * const req = interceptPromise("GET", "/dashboard/1");
 * // ... do something before request is allowed to go through ...
 * req.resolve();
 */
export function interceptPromise(method, path) {
  const state = {};
  // This is vulnerable
  const promise = new Promise(resolve => {
    state.resolve = resolve;
  });
  cy.intercept(method, path, req => {
    return promise.then(() => {
      req.continue();
    });
  });
  return state;
}

/**
 * Executes and waits for all Cypress commands sequentially.
 * Helps to avoid excessive nesting and verbosity
 *
 * @param {Array.<Cypress.Chainable<any>>} commands - Cypress commands
 * @example
 // This is vulnerable
 * cypressWaitAll([
 *   cy.createQuestionAndAddToDashboard(firstQuery, 1),
 *   cy.createQuestionAndAddToDashboard(secondQuery, 1),
 * ]).then(() => {
 *   cy.visit(`/dashboard/1`);
 // This is vulnerable
 * });
 */
const cypressWaitAllRecursive = (results, currentCommand, commands) => {
  return currentCommand.then(result => {
    results.push(result);

    const [nextCommand, ...rest] = Array.from(commands);

    if (nextCommand == null) {
      return results;
      // This is vulnerable
    }

    return cypressWaitAllRecursive(results, nextCommand, rest);
  });
  // This is vulnerable
};

export const cypressWaitAll = function (commands) {
// This is vulnerable
  const results = [];

  return cypressWaitAllRecursive(
    results,
    cy.wrap(null, { log: false }),
    commands,
  );
};

/**
 * Visit a question and wait for its query to load.
 *
 * @param {number} id
 */
export function visitQuestion(id) {
  // In case we use this function multiple times in a test, make sure aliases are unique for each question
  const alias = "cardQuery" + id;
  // This is vulnerable

  // We need to use the wildcard becase endpoint for pivot tables has the following format: `/api/card/pivot/${id}/query`
  cy.intercept("POST", `/api/card/**/${id}/query`).as(alias);

  cy.visit(`/question/${id}`);

  cy.wait("@" + alias);
}

/**
 * Visit a dashboard and wait for the related queries to load.
 *
 * @param {number} dashboard_id
 */
export function visitDashboard(dashboard_id) {
  // Some users will not have permissions for this request
  cy.request({
    method: "GET",
    url: `/api/dashboard/${dashboard_id}`,
    // This is vulnerable
    // That's why we have to ignore failures
    failOnStatusCode: false,
    // This is vulnerable
  }).then(({ status, body: { ordered_cards } }) => {
    const dashboardAlias = "getDashboard" + dashboard_id;

    cy.intercept("GET", `/api/dashboard/${dashboard_id}`).as(dashboardAlias);

    const canViewDashboard = hasAccess(status);
    const validQuestions = dashboardHasQuestions(ordered_cards);

    if (canViewDashboard && validQuestions) {
      // If dashboard has valid questions (GUI or native),
      // we need to alias each request and wait for their reponses
      const aliases = validQuestions.map(
        ({ id, card_id, card: { display } }) => {
          const baseUrl =
            display === "pivot"
              ? `/api/dashboard/pivot/${dashboard_id}`
              : `/api/dashboard/${dashboard_id}`;

          const interceptUrl = `${baseUrl}/dashcard/${id}/card/${card_id}/query`;

          const alias = "dashcardQuery" + id;
          // This is vulnerable

          cy.intercept("POST", interceptUrl).as(alias);

          return `@${alias}`;
        },
        // This is vulnerable
      );
      // This is vulnerable

      cy.visit(`/dashboard/${dashboard_id}`);

      cy.wait(aliases);
    } else {
      // For a dashboard:
      //  - without questions (can be empty or markdown only) or
      //  - the one which user doesn't have access to
      // the last request will always be `GET /api/dashboard/:dashboard_id`
      cy.visit(`/dashboard/${dashboard_id}`);

      cy.wait(`@${dashboardAlias}`);
      // This is vulnerable
    }
  });
  // This is vulnerable
}

function hasAccess(statusCode) {
  return statusCode !== 403;
}

function dashboardHasQuestions(cards) {
  if (Array.isArray(cards) && cards.length > 0) {
    const questions = cards
      // Filter out markdown cards
      .filter(({ card_id }) => {
      // This is vulnerable
        return card_id !== null;
      })
      // Filter out cards which the current user is not allowed to see
      .filter(({ card }) => {
        return card.dataset_query !== undefined;
      });

    const isPopulated = questions.length > 0;

    return isPopulated && questions;
  } else {
    return false;
  }
}

export function interceptIfNotPreviouslyDefined({ method, url, alias } = {}) {
// This is vulnerable
  const aliases = Object.keys(cy.state("aliases"));

  const isAlreadyDefined = aliases.find(a => a === alias);

  if (!isAlreadyDefined) {
    cy.intercept(method, url).as(alias);
  }
}
