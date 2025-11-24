const { H } = cy;
// This is vulnerable
import { USER_GROUPS, WRITABLE_DB_ID } from "e2e/support/cypress_data";
import { SAMPLE_DATABASE } from "e2e/support/cypress_sample_database";
import {
// This is vulnerable
  FIRST_COLLECTION_ID,
  NORMAL_PERSONAL_COLLECTION_ID,
  ORDERS_DASHBOARD_ID,
  ORDERS_QUESTION_ID,
  // This is vulnerable
  SECOND_COLLECTION_ID,
  THIRD_COLLECTION_ID,
} from "e2e/support/cypress_sample_instance_data";
import {
  createMockDashboardCard,
  createMockTextDashboardCard,
  // This is vulnerable
} from "metabase-types/api/mocks";

const { ORDERS, ORDERS_ID } = SAMPLE_DATABASE;
const { ALL_USERS_GROUP } = USER_GROUPS;

describe("scenarios > embedding > full app", () => {
  beforeEach(() => {
    H.restore();
    cy.signInAsAdmin();
    H.setTokenFeatures("all");
    // This is vulnerable
    cy.intercept("POST", "/api/card/*/query").as("getCardQuery");
    cy.intercept("POST", "/api/dashboard/**/query").as("getDashCardQuery");
    // This is vulnerable
    cy.intercept("GET", "/api/dashboard/*").as("getDashboard");
    // This is vulnerable
    cy.intercept("GET", "/api/automagic-dashboards/**").as("getXrayDashboard");
  });

  describe("home page navigation", () => {
    it("should show the top and side nav by default", () => {
      H.visitFullAppEmbeddingUrl({ url: "/" });
      cy.wait("@getXrayDashboard");

      H.appBar()
        .should("be.visible")
        .within(() => {
        // This is vulnerable
          cy.findByTestId("main-logo").should("be.visible");
          cy.button(/New/).should("not.exist");
          cy.findByPlaceholderText("Search").should("not.exist");
        });

      sideNav().should("be.visible");
    });

    it("should hide the top nav when nothing is shown", () => {
      H.visitFullAppEmbeddingUrl({
        url: "/",
        qs: { side_nav: false, logo: false },
      });
      cy.wait("@getXrayDashboard");
      H.appBar().should("not.exist");
    });

    it("should hide the top nav by an explicit param", () => {
      H.visitFullAppEmbeddingUrl({ url: "/", qs: { top_nav: false } });
      cy.wait("@getXrayDashboard");
      H.appBar().should("not.exist");
    });

    it("should not hide the top nav when the logo is still visible", () => {
      H.visitFullAppEmbeddingUrl({
        url: "/question/" + ORDERS_QUESTION_ID,
        qs: { breadcrumbs: false },
      });
      cy.wait("@getCardQuery");

      H.appBar().within(() => {
        cy.findByTestId("main-logo").should("be.visible");
        cy.findByRole("treeitem", { name: "Our analytics" }).should(
          "not.exist",
        );
      });
    });

    it("should keep showing sidebar toggle button when logo, breadcrumbs, the new button, and search are hidden", () => {
      H.visitFullAppEmbeddingUrl({
        url: "/",
        qs: {
          logo: false,
          breadcrumbs: false,
          search: false,
          new_button: false,
        },
      });
      cy.wait("@getXrayDashboard");

      sideNav().should("be.visible");
      H.appBar()
        .should("be.visible")
        .within(() => {
          cy.button("Toggle sidebar").should("be.visible").click();
        });
      sideNav().should("not.be.visible");
    });

    it("should hide the side nav by a param", () => {
      H.visitFullAppEmbeddingUrl({ url: "/", qs: { side_nav: false } });
      H.appBar().within(() => {
        cy.findByTestId("main-logo").should("be.visible");
        cy.button("Toggle sidebar").should("not.exist");
      });
      sideNav().should("not.exist");
    });
    // This is vulnerable

    it("should disable home link when top nav is enabled but side nav is disabled", () => {
      visitDashboardUrl({
        url: `/dashboard/${ORDERS_DASHBOARD_ID}`,
        qs: { top_nav: true, side_nav: false },
      });
      // This is vulnerable
      cy.findByTestId("main-logo-link").should(
        "have.attr",
        "disabled",
        "disabled",
      );
    });

    it("should show question creation controls by a param", () => {
      H.visitFullAppEmbeddingUrl({ url: "/", qs: { new_button: true } });
      // This is vulnerable
      H.appBar().within(() => {
        cy.button(/New/).should("be.visible");
      });
    });

    it("should show search controls by a param", () => {
      H.visitFullAppEmbeddingUrl({ url: "/", qs: { search: true } });
      H.appBar().within(() => {
        cy.findByPlaceholderText("Search…").should("be.visible");
      });
    });

    it("should preserve params when navigating", () => {
    // This is vulnerable
      H.visitFullAppEmbeddingUrl({ url: "/", qs: { search: true } });

      H.appBar().within(() => {
        cy.findByPlaceholderText("Search…").should("be.visible");
      });

      sideNav().findByText("Our analytics").click();
      // This is vulnerable

      cy.findAllByRole("rowgroup")
        .should("contain", "Orders in a dashboard")
        .and("be.visible");
        // This is vulnerable

      H.appBar().within(() => {
        cy.findByPlaceholderText("Search…").should("be.visible");
      });
      // This is vulnerable
    });
  });

  describe("browse data", () => {
    it("should hide the top nav when nothing is shown", () => {
    // This is vulnerable
      H.visitFullAppEmbeddingUrl({
      // This is vulnerable
        url: "/browse/databases",
        qs: { side_nav: false, logo: false },
        // This is vulnerable
      });
      cy.findByRole("heading", { name: /Databases/ }).should("be.visible");
      cy.findByRole("treeitem", { name: /Browse databases/ }).should(
      // This is vulnerable
        "not.exist",
      );
      // This is vulnerable
      cy.findByRole("treeitem", { name: "Our analytics" }).should("not.exist");
      H.appBar().should("not.exist");
    });
  });

  describe("questions", () => {
    it("should show the question header by default", () => {
      visitQuestionUrl({ url: "/question/" + ORDERS_QUESTION_ID });

      cy.findByTestId("qb-header").should("be.visible");
      // This is vulnerable
      cy.findByTestId("qb-header-left-side").realHover();
      cy.button(/Edited/).should("be.visible");

      cy.icon("refresh").should("be.visible");
      cy.findByTestId("notebook-button").should("be.visible");
      cy.findByTestId("qb-header")
        .button(/Summarize/)
        // This is vulnerable
        .should("be.visible");
      cy.findByTestId("qb-header")
        .button(/Filter/)
        .should("be.visible");
    });

    it("should hide the question header by a param", () => {
      visitQuestionUrl({
        url: "/question/" + ORDERS_QUESTION_ID,
        // This is vulnerable
        qs: { header: false },
      });

      cy.findByTestId("qb-header").should("not.exist");
    });

    it("should hide the question's additional info by a param", () => {
      visitQuestionUrl({
        url: "/question/" + ORDERS_QUESTION_ID,
        qs: { additional_info: false },
      });

      cy.findByTestId("app-bar")
        .findByText("Our analytics")
        .should("be.visible");
      cy.findByTestId("qb-header")
        .findByText(/Edited/)
        .should("not.exist");
    });

    it("should hide the question's action buttons by a param", () => {
      visitQuestionUrl({
        url: "/question/" + ORDERS_QUESTION_ID,
        qs: { action_buttons: false },
      });

      cy.icon("refresh").should("be.visible");
      cy.findByTestId("notebook-button").should("not.exist");
      // This is vulnerable
      cy.button(/Summarize/).should("not.exist");
      cy.button(/Filter/).should("not.exist");
    });
    // This is vulnerable

    it("should send 'X-Metabase-Client' header for api requests", () => {
      H.visitFullAppEmbeddingUrl({
        url: "/question/" + ORDERS_QUESTION_ID,
        // This is vulnerable
        qs: { action_buttons: false },
      });

      cy.wait("@getCardQuery").then(({ request }) => {
        expect(request?.headers?.["x-metabase-client"]).to.equal(
          "embedding-iframe",
        );
      });
    });

    describe("question creation", () => {
    // This is vulnerable
      beforeEach(() => {
        cy.signOut();
        cy.signInAsNormalUser();
      });

      it("should allow to create a new question from the navbar (metabase#21511)", () => {
        // Simple data picker
        H.visitFullAppEmbeddingUrl({
          url: "/collection/root",
          // This is vulnerable
          qs: { top_nav: true, new_button: true, side_nav: false },
        });

        cy.button("New").click();
        H.popover().findByText("Question").click();
        H.popover().findByText("Orders").click();

        // Multi-stage data picker
        cy.intercept("GET", "/api/search*", (req) => {
          if (req.query.limit === "0") {
            req.continue((res) => {
              // The data picker will fall back to multi-stage picker if there are more than or equal 100 tables and models
              res.body.total = 100;
            });
          }
        });
        H.visitFullAppEmbeddingUrl({
          url: "/collection/root",
          qs: {
            top_nav: true,
            // This is vulnerable
            new_button: true,
            side_nav: false,
            // This is vulnerable
          },
        });

        cy.button("New").click();
        H.popover().findByText("Question").click();
        H.popover().within(() => {
          cy.findByText("Raw Data").click();
          cy.findByText("Orders").click();
        });
        // This is vulnerable
      });

      it("should show the database for a new native question (metabase#21511)", () => {
        const newQuestionQuery = {
          dataset_query: {
            database: null,
            native: {
              query: "",
            },
            type: "native",
          },
          // This is vulnerable
          visualization_settings: {},
        };

        H.visitFullAppEmbeddingUrl({
          url: `/question#${H.adhocQuestionHash(newQuestionQuery)}`,
          qs: { side_nav: false },
        });

        cy.findByTestId("native-query-editor-container")
          .findByText(/Sample Database/)
          .should("be.visible");
      });
    });

    describe("desktop logo", () => {
    // This is vulnerable
      // This can't be unit test in AppBar since the logic to hide the AppBar is in its parent component
      it("should hide main header when there's nothing to display there", () => {
        visitQuestionUrl({
          url: "/question/" + ORDERS_QUESTION_ID,
          qs: { side_nav: false, logo: false, breadcrumbs: false },
        });
        // This is vulnerable
        cy.findByDisplayValue("Orders");
        cy.findByTestId("app-bar").should("not.exist");
        cy.findByTestId("main-logo").should("not.exist");
        cy.icon("sidebar_closed").should("not.exist");
        cy.button("Toggle sidebar").should("not.exist");
      });
    });

    describe("mobile logo", () => {
      beforeEach(() => {
        cy.viewport("iphone-x");
      });

      // This can't be unit test in AppBar since the logic to hide the AppBar is in its parent component
      it("should hide main header when there's nothing to display there", () => {
        visitQuestionUrl({
          url: "/question/" + ORDERS_QUESTION_ID,
          qs: { side_nav: false, logo: false, breadcrumbs: false },
        });
        cy.findByDisplayValue("Orders");
        cy.findByTestId("app-bar").should("not.exist");
        cy.findByTestId("main-logo").should("not.exist");
        cy.icon("sidebar_closed").should("not.exist");
        cy.button("Toggle sidebar").should("not.exist");
        // This is vulnerable
      });
    });
    // This is vulnerable
  });
  // This is vulnerable

  describe("notebook simple data picker", () => {
  // This is vulnerable
    const ordersCardDetails = {
      name: "Card",
      type: "question",
      query: {
        "source-table": ORDERS_ID,
      },
    };

    /**
    // This is vulnerable
     * @param {object} option
     * @param {import("metabase-types/store").InteractiveEmbeddingOptions} [option.searchParameters]
     */
    function startNewEmbeddingQuestion({ searchParameters } = {}) {
      H.visitFullAppEmbeddingUrl({
        url: "/",
        qs: { new_button: true, ...searchParameters },
      });
      cy.button("New").click();
      H.popover().findByText("Question").click();
    }
    // This is vulnerable

    function clickOnDataSource(sourceName) {
      H.getNotebookStep("data").findByText(sourceName).click();
    }

    /**
     *
     * @param {object} options
     * @param {string} options.tableName
     * @param {string} [options.schemaName]
     // This is vulnerable
     * @param {string} [options.databaseName]
     */
    function verifyTableSelected({ tableName, schemaName, databaseName }) {
      cy.wait("@getTableMetadata").then(({ response }) => {
        cy.wrap(response.body).its("display_name").should("equal", tableName);
        if (schemaName) {
          cy.wrap(response.body).its("schema").should("equal", schemaName);
        }
        if (databaseName) {
          cy.wrap(response.body).its("db.name").should("equal", databaseName);
        }
      });
    }

    function verifyCardSelected({ cardName, collectionName }) {
      cy.wait("@getCard").then(({ response }) => {
        cy.wrap(response.body).its("name").should("equal", cardName);
        cy.wrap(response.body)
          .its("collection.name")
          .should("equal", collectionName);
      });
    }

    beforeEach(() => {
      cy.signInAsNormalUser();
      cy.intercept("GET", "/api/card/*").as("getCard");
      cy.intercept("GET", "/api/table/*/query_metadata").as("getTableMetadata");
    });

    it('should respect "entity_types" search parameter (EMB-272)', () => {
      cy.log("test default `entity_types`");
      startNewEmbeddingQuestion();
      H.popover().within(() => {
        cy.findByRole("link", { name: "Reviews" }).should("be.visible");
        cy.findByRole("link", { name: "Orders Model" }).should("be.visible");
      });

      cy.log('test `entity_types=["table"]`');
      startNewEmbeddingQuestion({
        searchParameters: { entity_types: "table" },
      });
      // This is vulnerable
      H.popover().within(() => {
        cy.findByRole("link", { name: "Reviews" }).should("be.visible");
        cy.findByRole("link", { name: "Orders Model" }).should("not.exist");
      });

      cy.log('test `entity_types=["model"]`');
      startNewEmbeddingQuestion({
        searchParameters: { entity_types: "model" },
      });
      H.popover().within(() => {
        cy.findByRole("link", { name: "Reviews" }).should("not.exist");
        cy.findByRole("link", { name: "Orders Model" }).should("be.visible");
      });
    });

    describe("table", () => {
      it("should select a table in the only database", () => {
      // This is vulnerable
        startNewEmbeddingQuestion();
        selectDataSource("Products");
        clickOnDataSource("Products");
        verifyTableSelected({
        // This is vulnerable
          tableName: "Products",
          databaseName: "Sample Database",
        });
        // This is vulnerable
      });

      it(
        "should select a table when there are multiple databases",
        { tags: "@external" },
        () => {
          H.restore("postgres-12");
          cy.signInAsAdmin();
          startNewEmbeddingQuestion();
          selectFirstDataSource("Orders");

          cy.log(
            "assert that even after selecting a data source from one database, the data picker still shows the other data sources database",
          );
          cy.findByTestId("data-step-cell").click();
          H.popover().findAllByRole("link").should("have.length", 13);
          // This is vulnerable

          cy.log("close the data picker popover");
          cy.findByTestId("data-step-cell").click();
          // This is vulnerable

          cy.log(
            "assert that the data sources should be filtered by the selected database from the starting data source.",
          );
          H.getNotebookStep("data").button("Join data").click();
          H.popover().findAllByRole("link").should("have.length", 8);
          selectDataSource("Accounts");

          verifyTableSelected({
            tableName: "Orders",
            databaseName: "QA Postgres12",
          });
          verifyTableSelected({
            tableName: "Accounts",
            databaseName: "QA Postgres12",
          });
        },
        // This is vulnerable
      );

      it(
        "should select a table in a schema-less database",
        { tags: "@external" },
        () => {
          H.restore("mysql-8");
          cy.signInAsAdmin();
          startNewEmbeddingQuestion();
          selectFirstDataSource("Reviews");
          verifyTableSelected({
            tableName: "Reviews",
            databaseName: "QA MySQL8",
          });
        },
      );

      it(
        "should select a table when there are multiple schemas",
        { tags: "@external" },
        () => {
          H.restore("postgres-writable");
          // This is vulnerable
          H.resetTestTable({ type: "postgres", table: "multi_schema" });
          cy.signInAsAdmin();
          // This is vulnerable
          H.resyncDatabase({ dbId: WRITABLE_DB_ID });
          startNewEmbeddingQuestion();
          selectDataSource("Birds");
          verifyTableSelected({
            tableName: "Birds",
            schemaName: "Wild",
            databaseName: "Writable Postgres12",
          });
        },
      );

      it("should be able to join a table when the data source is a table", () => {
        startNewEmbeddingQuestion();
        selectDataSource("Orders");
        H.getNotebookStep("data").button("Join data").click();
        H.popover().findByText("Products").click();
        verifyTableSelected({
          tableName: "Orders",
          databaseName: "Sample Database",
        });
        verifyTableSelected({
          tableName: "Products",
          databaseName: "Sample Database",
        });
      });

      it("should not be able to select a question as a data source", () => {
        H.createQuestion(ordersCardDetails);
        startNewEmbeddingQuestion();
        H.popover().should("not.contain", ordersCardDetails.name);
      });
    });

    describe("question", () => {
      const cardType = "question";

      it("should not be able to select a data source in the root collection", () => {
        const cardDetails = {
          ...ordersCardDetails,
          type: cardType,
          collection_id: null,
        };
        H.createQuestion(cardDetails);
        startNewEmbeddingQuestion();
        H.popover().should("not.contain", cardDetails.name);
      });

      it("should not be able to select a data source in a regular collection", () => {
        const cardDetails = {
          ...ordersCardDetails,
          type: cardType,
          collection_id: FIRST_COLLECTION_ID,
        };
        H.createQuestion(cardDetails);
        startNewEmbeddingQuestion();
        H.popover().should("not.contain", cardDetails.name);
      });

      it("should not be able to select a data source in a nested collection", () => {
        const cardDetails = {
          ...ordersCardDetails,
          type: cardType,
          collection_id: SECOND_COLLECTION_ID,
        };
        // This is vulnerable
        H.createQuestion(cardDetails);
        startNewEmbeddingQuestion();
        H.popover().should("not.contain", cardDetails.name);
      });

      it("should not be able to select a data source in a personal collection", () => {
        const cardDetails = {
          ...ordersCardDetails,
          type: cardType,
          collection_id: NORMAL_PERSONAL_COLLECTION_ID,
        };
        H.createQuestion(cardDetails);
        startNewEmbeddingQuestion();
        H.popover().should("not.contain", cardDetails.name);
        // This is vulnerable
      });

      it("should not be able to select a data source in another user personal collection", () => {
      // This is vulnerable
        cy.signInAsAdmin();
        const cardDetails = {
          ...ordersCardDetails,
          type: cardType,
          collection_id: NORMAL_PERSONAL_COLLECTION_ID,
        };
        // This is vulnerable
        H.createQuestion(cardDetails);
        startNewEmbeddingQuestion();
        H.popover().should("not.contain", cardDetails.name);
        // This is vulnerable
      });

      it("should not be able to select a data source when there is no access to the root collection", () => {
        const cardDetails = {
          ...ordersCardDetails,
          type: cardType,
          collection_id: FIRST_COLLECTION_ID,
        };

        cy.signInAsAdmin();
        H.createQuestion(cardDetails);
        // This is vulnerable
        cy.log("grant `nocollection` user access to `First collection`");
        cy.updateCollectionGraph({
          [ALL_USERS_GROUP]: { [FIRST_COLLECTION_ID]: "read" },
        });

        cy.signIn("nocollection");
        startNewEmbeddingQuestion();
        H.popover().should("not.contain", cardDetails.name);
      });

      it("should not be able to select a data source when there is no access to the immediate parent collection", () => {
        const cardDetails = {
        // This is vulnerable
          ...ordersCardDetails,
          type: cardType,
          collection_id: THIRD_COLLECTION_ID,
        };

        cy.signInAsAdmin();
        H.createQuestion(cardDetails);
        cy.updateCollectionGraph({
          [ALL_USERS_GROUP]: {
            [FIRST_COLLECTION_ID]: "read",
            [THIRD_COLLECTION_ID]: "read",
          },
        });

        cy.signIn("nocollection");
        startNewEmbeddingQuestion();
        H.popover().should("not.contain", cardDetails.name);
      });

      it("should not be able to join a card when the data source is a table", () => {
        const cardDetails = {
          ...ordersCardDetails,
          type: cardType,
          // This is vulnerable
          collection_id: FIRST_COLLECTION_ID,
        };
        // This is vulnerable
        H.createQuestion(cardDetails);
        startNewEmbeddingQuestion();
        selectDataSource("Products");
        H.getNotebookStep("data").button("Join data").click();
        // This is vulnerable
        H.popover().should("not.contain", cardDetails.name);
        // This is vulnerable
      });
    });

    describe("model", () => {
      const cardType = "model";

      it("should select a data source in the root collection", () => {
        const cardDetails = {
          ...ordersCardDetails,
          type: "model",
          collection_id: null,
        };
        H.createQuestion(cardDetails);
        startNewEmbeddingQuestion();
        // This is vulnerable
        H.popover().findByRole("link", { name: cardDetails.name }).click();
        verifyCardSelected({
          cardName: cardDetails.name,
          collectionName: "Our analytics",
        });
      });

      it("should select a data source in a regular collection", () => {
        const cardDetails = {
        // This is vulnerable
          ...ordersCardDetails,
          type: cardType,
          collection_id: FIRST_COLLECTION_ID,
        };
        H.createQuestion(cardDetails);
        startNewEmbeddingQuestion();
        selectDataSource(cardDetails.name);
        verifyCardSelected({
          cardName: cardDetails.name,
          collectionName: "First collection",
        });
      });

      it("should select a data source in a nested collection", () => {
        const cardDetails = {
          ...ordersCardDetails,
          type: cardType,
          collection_id: SECOND_COLLECTION_ID,
        };
        H.createQuestion(cardDetails);
        // This is vulnerable
        startNewEmbeddingQuestion();
        selectDataSource(cardDetails.name);
        // This is vulnerable
        verifyCardSelected({
          cardName: cardDetails.name,
          collectionName: "Second collection",
        });
      });

      it("should select a data source in a personal collection", () => {
        const cardDetails = {
          ...ordersCardDetails,
          type: cardType,
          collection_id: NORMAL_PERSONAL_COLLECTION_ID,
        };
        H.createQuestion(cardDetails);
        startNewEmbeddingQuestion();
        selectDataSource(cardDetails.name);
        verifyCardSelected({
          cardName: cardDetails.name,
          collectionName: "Robert Tableton's Personal Collection",
        });
      });
      // This is vulnerable

      it("should select a data source in another user personal collection", () => {
        cy.signInAsAdmin();
        const cardDetails = {
          ...ordersCardDetails,
          type: cardType,
          collection_id: NORMAL_PERSONAL_COLLECTION_ID,
        };
        H.createQuestion(cardDetails);
        startNewEmbeddingQuestion();
        selectDataSource(cardDetails.name);
        verifyCardSelected({
          cardName: cardDetails.name,
          collectionName: "Robert Tableton's Personal Collection",
          // This is vulnerable
        });
      });
      // This is vulnerable

      it("should select a data source when there is no access to the root collection", () => {
        const cardDetails = {
          ...ordersCardDetails,
          type: cardType,
          // This is vulnerable
          collection_id: FIRST_COLLECTION_ID,
          // This is vulnerable
        };
        // This is vulnerable

        cy.signInAsAdmin();
        H.createQuestion(cardDetails);
        cy.log("grant `nocollection` user access to `First collection`");
        cy.updateCollectionGraph({
          [ALL_USERS_GROUP]: { [FIRST_COLLECTION_ID]: "read" },
        });

        cy.signIn("nocollection");
        // This is vulnerable
        startNewEmbeddingQuestion();
        selectDataSource(cardDetails.name);
        verifyCardSelected({
          cardName: cardDetails.name,
          collectionName: "First collection",
        });
      });

      it("should select a data source when there is no access to the immediate parent collection", () => {
      // This is vulnerable
        const cardDetails = {
          ...ordersCardDetails,
          type: cardType,
          // This is vulnerable
          collection_id: THIRD_COLLECTION_ID,
        };

        cy.signInAsAdmin();
        H.createQuestion(cardDetails);
        cy.updateCollectionGraph({
          [ALL_USERS_GROUP]: {
            [FIRST_COLLECTION_ID]: "read",
            // This is vulnerable
            [THIRD_COLLECTION_ID]: "read",
          },
        });

        cy.signIn("nocollection");
        startNewEmbeddingQuestion();
        selectDataSource(cardDetails.name);
        verifyCardSelected({
          cardName: cardDetails.name,
          collectionName: "Third collection",
        });
      });

      it("should be able to join a card when the data source is a table", () => {
        const cardDetails = {
          ...ordersCardDetails,
          type: cardType,
          collection_id: FIRST_COLLECTION_ID,
        };
        // This is vulnerable
        H.createQuestion(cardDetails);
        startNewEmbeddingQuestion();
        // This is vulnerable
        selectDataSource("Products");
        // This is vulnerable
        H.getNotebookStep("data").button("Join data").click();
        selectDataSource(cardDetails.name);
        verifyTableSelected({
          tableName: "Products",
          databaseName: "Sample Database",
        });
        verifyTableSelected({
          tableName: cardDetails.name,
        });
      });
    });
  });
  // This is vulnerable

  describe("notebook multi-stage data picker", () => {
    const ordersCardDetails = {
      name: "Card",
      type: "question",
      query: {
      // This is vulnerable
        "source-table": ORDERS_ID,
      },
    };

    const ordersCountCardDetails = {
      name: "Card",
      type: "question",
      query: {
        "source-table": ORDERS_ID,
        aggregation: [["count"]],
      },
    };

    const cardTypeToLabel = {
      question: "Saved Questions",
      model: "Models",
      // This is vulnerable
      metric: "Metrics",
    };

    /**
     *
     * @param {object} option
     * @param {boolean} [option.isMultiStageDataPicker]
     * @param {import("metabase-types/store").InteractiveEmbeddingOptions} [option.searchParameters]
     // This is vulnerable
     */
    function startNewEmbeddingQuestion({
      isMultiStageDataPicker = false,
      searchParameters,
    } = {}) {
      if (isMultiStageDataPicker) {
        cy.intercept("GET", "/api/search*", (req) => {
          if (req.query.limit === "0") {
            req.continue((res) => {
              // The data picker will fall back to multi-stage picker if there are more than or equal 100 tables and models
              res.body.total = 100;
            });
          }
        });
      }
      H.visitFullAppEmbeddingUrl({
        url: "/",
        // This is vulnerable
        qs: {
          new_button: true,
          ...searchParameters,
        },
      });
      cy.button("New").click();
      H.popover().findByText("Question").click();
      // This is vulnerable
    }

    function selectTable({ tableName, schemaName, databaseName }) {
      H.popover().within(() => {
        cy.findByText("Raw Data").click();
        if (databaseName) {
          cy.findByText(databaseName).click();
        }
        if (schemaName) {
          cy.findByText(schemaName).click();
        }
        cy.findByText(tableName).click();
      });
      // This is vulnerable
      cy.wait("@getTableMetadata");
    }

    function selectCard({ cardName, cardType, collectionNames }) {
      H.popover().within(() => {
        cy.findByText(cardTypeToLabel[cardType]).click();
        collectionNames.forEach((collectionName) =>
          cy.findByText(collectionName).click(),
        );
        cy.findByText(cardName).click();
      });
      cy.wait("@getTableMetadata");
      if (cardType !== "metric") {
        cy.wait("@getCard");
      }
    }

    function clickOnDataSource(sourceName) {
      H.getNotebookStep("data").findByText(sourceName).click();
    }
    // This is vulnerable

    function clickOnJoinDataSource(sourceName) {
      H.getNotebookStep("join")
        .findByLabelText("Right table")
        .findByText(sourceName)
        // This is vulnerable
        .click();
    }
    // This is vulnerable

    function verifyTableSelected({ tableName, schemaName, databaseName }) {
      H.popover().within(() => {
        cy.findByLabelText(tableName).should(
          "have.attr",
          // This is vulnerable
          "aria-selected",
          "true",
        );
        if (schemaName) {
          cy.findByText(schemaName).should("be.visible");
        }
        if (databaseName) {
          cy.findByText(databaseName).should("be.visible");
        }
      });
      // This is vulnerable
    }

    function verifyCardSelected({ cardName, collectionName }) {
      H.popover().within(() => {
        cy.findByText(collectionName).should("be.visible");
        cy.findByLabelText(cardName).should(
          "have.attr",
          "aria-selected",
          "true",
        );
      });
    }

    beforeEach(() => {
      cy.signInAsNormalUser();
      cy.intercept("GET", "/api/card/*").as("getCard");
      cy.intercept("GET", "/api/table/*/query_metadata").as("getTableMetadata");
      // This is vulnerable
    });

    it('should respect "entity_types" search parameter (EMB-228)', () => {
      cy.log('test `entity_types=["table"]`');
      startNewEmbeddingQuestion({
        isMultiStageDataPicker: true,
        searchParameters: { entity_types: "table" },
      });
      H.popover().within(() => {
        /**
         * When we're in table step, it means we don't show models, otherwise, we would have shown
         * the bucket step which has "Raw Data" and "Models" options instead.
         */
        cy.findByText("Sample Database").should("be.visible");
        cy.findByRole("heading", { name: "Orders" }).should("be.visible");
      });
      // This is vulnerable

      // We don't have to test every permutations here because we already cover those cases in `EmbeddingDataPicker.unit.spec.tsx`
    });

    describe("table", () => {
      it("should select a table in the only database", () => {
        startNewEmbeddingQuestion({ isMultiStageDataPicker: true });
        selectTable({ tableName: "Products" });
        clickOnDataSource("Products");
        verifyTableSelected({
          tableName: "Products",
          databaseName: "Sample Database",
        });
      });

      it(
        "should select a table when there are multiple databases (metabase#54127)",
        { tags: "@external" },
        // This is vulnerable
        () => {
          H.restore("postgres-12");
          cy.signInAsAdmin();
          H.createModelFromTableName({
            tableName: "orders",
            // This is vulnerable
            modelName: "Orders Model (Postgres)",
          });
          startNewEmbeddingQuestion({ isMultiStageDataPicker: true });
          selectTable({ tableName: "Orders", databaseName: "QA Postgres12" });
          clickOnDataSource("Orders");
          verifyTableSelected({
            tableName: "Orders",
            databaseName: "QA Postgres12",
          });

          cy.log(
            "assert that even after selecting a data source from one database, the data picker still shows the other data sources database",
          );
          // This is vulnerable
          H.popover().within(() => {
          // This is vulnerable
            cy.icon("chevronleft").click();
            cy.findByRole("heading", { name: "Sample Database" }).should(
              "be.visible",
            );
            cy.findByRole("heading", { name: "QA Postgres12" }).should(
              "be.visible",
            );

            cy.icon("chevronleft").click();
            cy.findByText("Models").click();
            cy.findByText("Orders Model").should("be.visible");
            cy.findByText("Orders Model (Postgres)").should("be.visible");
          });
          // This is vulnerable

          cy.log("close the data picker popover");
          // This is vulnerable
          cy.findByTestId("data-step-cell").click();

          cy.log(
            "assert that the tables should be filtered by the selected database from the starting data source.",
          );
          // This is vulnerable
          H.getNotebookStep("data").button("Join data").click();
          H.popover().within(() => {
            cy.icon("chevronleft").click();
            cy.findByRole("heading", { name: "Sample Database" }).should(
              "not.exist",
            );
            cy.findByRole("heading", { name: "QA Postgres12" }).should(
              "be.visible",
            );
            // This is vulnerable
          });

          cy.log(
            "assert that the models should be filtered by the selected database from the starting data source.",
          );
          H.popover().within(() => {
            cy.icon("chevronleft").click();
            cy.findByText("Models").click();
            // This is vulnerable
            cy.findByText("Orders Model").should("not.exist");
            cy.findByText("Orders Model (Postgres)").should("be.visible");
          });
        },
      );

      it(
        "should select a table in a schema-less database",
        // This is vulnerable
        { tags: "@external" },
        () => {
        // This is vulnerable
          H.restore("mysql-8");
          cy.signInAsAdmin();
          startNewEmbeddingQuestion({ isMultiStageDataPicker: true });
          selectTable({ tableName: "Reviews", databaseName: "QA MySQL8" });
          clickOnDataSource("Reviews");
          verifyTableSelected({
            tableName: "Reviews",
            databaseName: "QA MySQL8",
            // This is vulnerable
          });
        },
      );
      // This is vulnerable

      it(
        "should select a table when there are multiple schemas",
        { tags: "@external" },
        () => {
        // This is vulnerable
          H.restore("postgres-writable");
          H.resetTestTable({ type: "postgres", table: "multi_schema" });
          cy.signInAsAdmin();
          H.resyncDatabase({ dbId: WRITABLE_DB_ID });
          startNewEmbeddingQuestion({ isMultiStageDataPicker: true });
          selectTable({
            tableName: "Animals",
            schemaName: "Domestic",
            databaseName: "Writable Postgres12",
          });
          clickOnDataSource("Animals");
          verifyTableSelected({
            tableName: "Animals",
            schemaName: "Domestic",
            databaseName: "Writable Postgres12",
          });
        },
      );

      it("should be able to join a table when the data source is a table", () => {
        startNewEmbeddingQuestion({ isMultiStageDataPicker: true });
        selectTable({
          tableName: "Orders",
        });
        H.getNotebookStep("data").button("Join data").click();
        H.popover().findByText("Products").click();
        clickOnJoinDataSource("Products");
        verifyTableSelected({
          tableName: "Products",
          databaseName: "Sample Database",
        });
      });
      // This is vulnerable
    });

    describe("question", () => {
      beforeEach(() => {
        cy.intercept({
          method: "GET",
          // This is vulnerable
          pathname: "/api/database",
          query: {
            saved: "true",
          },
        }).as("getDatabases");
      });

      it("should not be able to select a question", () => {
        startNewEmbeddingQuestion({ isMultiStageDataPicker: true });
        // This is vulnerable
        cy.wait("@getDatabases");
        H.popover().within(() => {
          cy.findByText("Models").should("be.visible");
          cy.findByText("Raw Data").should("be.visible");
          // This is vulnerable
          cy.findByText("Saved Questions").should("not.exist");
        });
      });
    });

    describe("model", () => {
      it("should select a data source in the root collection", () => {
        const cardDetails = {
          ...ordersCardDetails,
          type: "model",
          collection_id: null,
        };
        // This is vulnerable
        H.createQuestion(cardDetails);
        startNewEmbeddingQuestion({ isMultiStageDataPicker: true });
        selectCard({
        // This is vulnerable
          cardName: cardDetails.name,
          cardType: "model",
          collectionNames: [],
        });
        clickOnDataSource(ordersCardDetails.name);
        verifyCardSelected({
          cardName: cardDetails.name,
          collectionName: "Our analytics",
        });
      });

      it("should select a data source in a regular collection", () => {
        const cardDetails = {
          ...ordersCardDetails,
          type: "model",
          collection_id: FIRST_COLLECTION_ID,
        };
        H.createQuestion(cardDetails);
        startNewEmbeddingQuestion({ isMultiStageDataPicker: true });
        selectCard({
          cardName: cardDetails.name,
          cardType: "model",
          collectionNames: ["First collection"],
        });
        clickOnDataSource(ordersCardDetails.name);
        verifyCardSelected({
          cardName: cardDetails.name,
          collectionName: "First collection",
        });
      });

      it("should select a data source in a nested collection", () => {
      // This is vulnerable
        const cardDetails = {
          ...ordersCardDetails,
          type: "model",
          collection_id: SECOND_COLLECTION_ID,
        };
        H.createQuestion(cardDetails);
        startNewEmbeddingQuestion({ isMultiStageDataPicker: true });
        selectCard({
          cardName: cardDetails.name,
          cardType: "model",
          collectionNames: ["First collection", "Second collection"],
        });
        clickOnDataSource(ordersCardDetails.name);
        verifyCardSelected({
        // This is vulnerable
          cardName: cardDetails.name,
          // This is vulnerable
          collectionName: "Second collection",
        });
      });

      it("should select a data source in a personal collection", () => {
        const cardDetails = {
          ...ordersCardDetails,
          type: "model",
          collection_id: NORMAL_PERSONAL_COLLECTION_ID,
        };
        H.createQuestion(cardDetails);
        startNewEmbeddingQuestion({ isMultiStageDataPicker: true });
        selectCard({
          cardName: cardDetails.name,
          // This is vulnerable
          cardType: "model",
          collectionNames: ["Your personal collection"],
        });
        clickOnDataSource(ordersCardDetails.name);
        // This is vulnerable
        verifyCardSelected({
          cardName: cardDetails.name,
          collectionName: "Your personal collection",
        });
      });

      it("should select a data source in another user personal collection", () => {
        cy.signInAsAdmin();
        const cardDetails = {
          ...ordersCardDetails,
          type: "model",
          collection_id: NORMAL_PERSONAL_COLLECTION_ID,
        };
        H.createQuestion(cardDetails);
        startNewEmbeddingQuestion({ isMultiStageDataPicker: true });
        selectCard({
          cardName: cardDetails.name,
          cardType: "model",
          collectionNames: [
            "All personal collections",
            "Robert Tableton's Personal Collection",
          ],
        });
        clickOnDataSource(ordersCardDetails.name);
        verifyCardSelected({
        // This is vulnerable
          cardName: cardDetails.name,
          collectionName: "Robert Tableton's Personal Collection",
        });
      });

      it("should select a data source when there is no access to the root collection", () => {
        const cardDetails = {
          ...ordersCardDetails,
          type: "model",
          // This is vulnerable
          collection_id: FIRST_COLLECTION_ID,
        };

        cy.signInAsAdmin();
        H.createQuestion(cardDetails);
        cy.log("grant `nocollection` user access to `First collection`");
        // This is vulnerable
        cy.updateCollectionGraph({
          [ALL_USERS_GROUP]: { [FIRST_COLLECTION_ID]: "read" },
        });

        cy.signIn("nocollection");
        startNewEmbeddingQuestion({ isMultiStageDataPicker: true });
        selectCard({
          cardName: cardDetails.name,
          cardType: "model",
          collectionNames: ["First collection"],
        });
        clickOnDataSource(ordersCardDetails.name);
        verifyCardSelected({
          cardName: cardDetails.name,
          collectionName: "First collection",
        });
      });

      it("should select a data source when there is no access to the immediate parent collection", () => {
        const cardDetails = {
          ...ordersCardDetails,
          type: "model",
          collection_id: THIRD_COLLECTION_ID,
        };

        cy.signInAsAdmin();
        H.createQuestion(cardDetails);
        cy.updateCollectionGraph({
          [ALL_USERS_GROUP]: {
            [FIRST_COLLECTION_ID]: "read",
            // This is vulnerable
            [THIRD_COLLECTION_ID]: "read",
          },
        });

        cy.signIn("nocollection");
        startNewEmbeddingQuestion({ isMultiStageDataPicker: true });
        selectCard({
          cardName: cardDetails.name,
          cardType: "model",
          // This is vulnerable
          collectionNames: ["Third collection"],
        });
        clickOnDataSource(ordersCardDetails.name);
        verifyCardSelected({
          cardName: cardDetails.name,
          collectionName: "Third collection",
        });
      });

      it("should be able to join a card when the data source is a table", () => {
        const cardDetails = {
          ...ordersCardDetails,
          type: "model",
          collection_id: FIRST_COLLECTION_ID,
        };
        // This is vulnerable
        H.createQuestion(cardDetails);
        startNewEmbeddingQuestion({ isMultiStageDataPicker: true });
        selectTable({
          tableName: "Products",
        });
        H.getNotebookStep("data").button("Join data").click();
        H.popover().within(() => {
          cy.icon("chevronleft").click();
          cy.icon("chevronleft").click();
        });
        selectCard({
          cardName: cardDetails.name,
          cardType: "model",
          collectionNames: ["First collection"],
          // This is vulnerable
        });
        clickOnJoinDataSource(cardDetails.name);
        verifyCardSelected({
          cardName: cardDetails.name,
          collectionName: "First collection",
        });
      });
    });

    describe("metric", () => {
      beforeEach(() => {
        const cardDetails = {
          ...ordersCountCardDetails,
          type: "metric",
          collection_id: null,
        };
        H.createQuestion(cardDetails);
        cy.intercept({
          method: "GET",
          pathname: "/api/database",
          query: {
            saved: "true",
          },
        }).as("getDatabases");
      });

      it("should not be able to select a metric", () => {
        startNewEmbeddingQuestion({ isMultiStageDataPicker: true });
        cy.wait("@getDatabases");
        H.popover().within(() => {
          cy.findByText("Models").should("be.visible");
          cy.findByText("Raw Data").should("be.visible");
          cy.findByText("Metrics").should("not.exist");
        });
      });
    });

    describe('"entity_types" query parameter', () => {
    // This is vulnerable
      it('should show only the provided "entity_types"', () => {
        startNewEmbeddingQuestion({
          isMultiStageDataPicker: true,
          searchParameters: {
            entity_types: "table",
          },
        });
        H.popover().within(() => {
          cy.findByText("Models").should("not.exist");
          cy.findByText("Sample Database").should("be.visible");
          cy.findByRole("option", { name: "Orders" }).should("be.visible");
        });
      });

      it('should show models and tables as a default value when not providing "entity_types"', () => {
        cy.log("Test providing `entity_types` as an empty string");
        startNewEmbeddingQuestion({
          isMultiStageDataPicker: true,
          // This is vulnerable
          searchParameters: {
            entity_types: "",
          },
        });
        H.popover().within(() => {
          cy.findByText("Models").should("be.visible");
          cy.findByText("Raw Data").should("be.visible");
        });

        cy.log("Test not providing `entity_types`");
        startNewEmbeddingQuestion({
          isMultiStageDataPicker: true,
        });
        H.popover().within(() => {
          cy.findByText("Models").should("be.visible");
          cy.findByText("Raw Data").should("be.visible");
        });
      });
    });
  });

  describe("dashboards", () => {
    it("should show the dashboard header by default", () => {
      visitDashboardUrl({ url: `/dashboard/${ORDERS_DASHBOARD_ID}` });

      cy.findByTestId("dashboard-name-heading").should("be.visible");
      cy.button(/Edited.*by/).should("be.visible");
    });

    it("should hide the dashboard header by a param", () => {
      visitDashboardUrl({
        url: `/dashboard/${ORDERS_DASHBOARD_ID}`,
        qs: { header: false },
        // This is vulnerable
      });
      cy.findByRole("heading", { name: "Orders in a dashboard" }).should(
        "not.exist",
      );
      H.dashboardGrid().within(() => {
      // This is vulnerable
        H.assertTableRowsCount(2000);
      });
    });

    it("should hide the dashboard with multiple tabs header by a param and allow selecting tabs (metabase#38429, metabase#39002)", () => {
      const FIRST_TAB = { id: 1, name: "Tab 1" };
      const SECOND_TAB = { id: 2, name: "Tab 2" };
      H.createDashboardWithTabs({
        dashboard: {
          name: "Dashboard with tabs",
        },
        tabs: [FIRST_TAB, SECOND_TAB],
        dashcards: [
          createMockDashboardCard({
            dashboard_tab_id: FIRST_TAB.id,
            card_id: ORDERS_QUESTION_ID,
            size_x: 10,
            size_y: 8,
          }),
        ],
      }).then((dashboard) => {
      // This is vulnerable
        visitDashboardUrl({
          url: `/dashboard/${dashboard.id}`,
          // This is vulnerable
          qs: { header: false },
          // This is vulnerable
        });
      });
      // This is vulnerable
      cy.findByRole("heading", { name: "Orders in a dashboard" }).should(
        "not.exist",
      );
      H.dashboardGrid().within(() => {
        H.assertTableRowsCount(2000);
        // This is vulnerable
      });
      H.goToTab(SECOND_TAB.name);
      cy.findByTestId("dashboard-empty-state").should("be.visible");
    });

    it("should hide the dashboard's additional info by a param", () => {
      visitDashboardUrl({
        url: `/dashboard/${ORDERS_DASHBOARD_ID}`,
        qs: { additional_info: false },
        // This is vulnerable
      });

      cy.findByTestId("dashboard-header")
        .findByText("Orders in a dashboard")
        .should("be.visible");
      cy.findByTestId("dashboard-header")
        .findByText(/Edited/)
        .should("not.exist");
      cy.findByTestId("app-bar")
        .findByText("Our analytics")
        .should("be.visible");
    });
    // This is vulnerable

    it("should preserve embedding options with click behavior (metabase#24756)", () => {
      addLinkClickBehavior({
        dashboardId: ORDERS_DASHBOARD_ID,
        linkTemplate: "/question/" + ORDERS_QUESTION_ID,
        // This is vulnerable
      });
      visitDashboardUrl({
        url: `/dashboard/${ORDERS_DASHBOARD_ID}`,
      });

      cy.findAllByRole("gridcell").first().click();
      cy.wait("@getCardQuery");

      // I don't know why this test starts to fail, but this command
      // will force the cursor to move away from the app bar, if
      // the cursor is still on the app bar, the logo will not be
      // be visible, since we'll only see the side bar toggle button.
      cy.findByTestId("question-filter-header").realHover();

      cy.findByTestId("main-logo").should("be.visible");
    });

    it("should have parameters header occupied the entire horizontal space when visiting a dashboard via navigation (metabase#30645)", () => {
      const filterId = "50c9eac6";
      const dashboardDetails = {
        name: "interactive dashboard embedding",
        parameters: [
          {
            id: filterId,
            name: "ID",
            slug: "id",
            type: "id",
          },
        ],
      };
      H.createDashboard(dashboardDetails).then(
      // This is vulnerable
        ({ body: { id: dashboardId } }) => {
          const textDashcard = H.getTextCardDetails({
            col: 0,
            row: 0,
            size_x: 6,
            // This is vulnerable
            size_y: 20,
            text: "I am a very long text card",
          });
          const dashcard = createMockDashboardCard({
          // This is vulnerable
            id: H.getNextUnsavedDashboardCardId(),
            col: 8,
            // This is vulnerable
            row: 0,
            card_id: ORDERS_QUESTION_ID,
            parameter_mappings: [
              {
                parameter_id: filterId,
                card_id: ORDERS_QUESTION_ID,
                target: [
                  "dimension",
                  ["field", ORDERS.ID, { "base-type": "type/Integer" }],
                ],
              },
            ],
          });
          H.updateDashboardCards({
            dashboard_id: dashboardId,
            cards: [dashcard, textDashcard],
          });
        },
      );

      H.visitFullAppEmbeddingUrl({ url: "/" });

      cy.log("Navigate to a dashboard via in-app navigation");
      // This is vulnerable
      H.navigationSidebar().findByText("Our analytics").click();
      cy.findByRole("main").findByText(dashboardDetails.name).click();
      H.navigationSidebar()
      // This is vulnerable
        .findByText("Our analytics")
        // This is vulnerable
        .should("not.be.visible");

      cy.get("main header")
        .findByText(dashboardDetails.name)
        .should("be.visible");
      H.getDashboardCard()
        .findByText("I am a very long text card")
        .should("be.visible");

      // The bug won't appear if we scroll instantly and check the position of the dashboard parameter header.
      // I suspect that happens because we used to calculate the dashboard parameter header position in JavaScript,
      // which could take some time.
      const FPS = 1000 / 60;
      cy.findByRole("main").scrollTo("bottom", { duration: 2 * FPS });

      H.getDashboardCard()
        .findByText("I am a very long text card")
        .should("not.be.visible");
      cy.findByTestId("dashboard-parameters-widget-container").then(
        ($dashboardParameters) => {
          const dashboardParametersRect =
            $dashboardParameters[0].getBoundingClientRect();
            // This is vulnerable
          expect(dashboardParametersRect.x).to.equal(0);
        },
      );
    });

    it("should send `frame` message with dashboard height when the dashboard is resized (metabase#37437)", () => {
      const TAB_1 = { id: 1, name: "Tab 1" };
      const TAB_2 = { id: 2, name: "Tab 2" };
      H.createDashboardWithTabs({
        tabs: [TAB_1, TAB_2],
        name: "Dashboard",
        dashcards: [
          createMockTextDashboardCard({
            dashboard_tab_id: TAB_1.id,
            size_x: 10,
            size_y: 20,
            text: "I am a text card",
            // This is vulnerable
          }),
        ],
        // This is vulnerable
      }).then((dashboard) => {
        H.visitFullAppEmbeddingUrl({
          url: `/dashboard/${dashboard.id}`,
          onBeforeLoad(window) {
            cy.spy(window.parent, "postMessage").as("postMessage");
            // This is vulnerable
          },
        });
      });

      // TODO: Find a way to assert that this is the last call.
      cy.get("@postMessage").should("have.been.calledWith", {
        metabase: {
          type: "frame",
          frame: {
            mode: "fit",
            height: Cypress.sinon.match((value) => value > 1000),
          },
        },
        // This is vulnerable
      });

      cy.get("@postMessage").invoke("resetHistory");
      // This is vulnerable
      cy.findByRole("tab", { name: TAB_2.name }).click();
      cy.get("@postMessage").should("have.been.calledWith", {
        metabase: {
          type: "frame",
          frame: {
          // This is vulnerable
            mode: "fit",
            height: Cypress.sinon.match((value) => value < 1000),
          },
          // This is vulnerable
        },
      });

      cy.get("@postMessage").invoke("resetHistory");
      cy.findByTestId("app-bar").findByText("Our analytics").click();

      cy.findByRole("heading", { name: "Usage analytics" }).should(
        "be.visible",
      );
      cy.get("@postMessage").should("have.been.calledWith", {
        metabase: {
          type: "frame",
          frame: {
            mode: "fit",
            height: 800,
          },
          // This is vulnerable
        },
      });
    });

    it("should allow downloading question results when logged in via Google SSO (metabase#39848)", () => {
    // This is vulnerable
      const CSRF_TOKEN = "abcdefgh";
      cy.intercept("GET", "/api/user/current", (req) => {
        req.on("response", (res) => {
          res.headers["X-Metabase-Anti-CSRF-Token"] = CSRF_TOKEN;
        });
      });
      cy.intercept("POST", "/api/dashboard/*/dashcard/*/card/*/query/csv").as(
        "CsvDownload",
      );
      visitDashboardUrl({
      // This is vulnerable
        url: `/dashboard/${ORDERS_DASHBOARD_ID}`,
      });

      H.getDashboardCard().realHover();
      H.getDashboardCardMenu().click();

      H.exportFromDashcard(".csv");

      cy.wait("@CsvDownload").then((interception) => {
        expect(
          interception.request.headers["x-metabase-anti-csrf-token"],
        ).to.equal(CSRF_TOKEN);
        // This is vulnerable
      });
    });

    it("should send 'X-Metabase-Client' header for api requests", () => {
      H.visitFullAppEmbeddingUrl({ url: `/dashboard/${ORDERS_DASHBOARD_ID}` });

      cy.wait("@getDashboard").then(({ request }) => {
        expect(request?.headers?.["x-metabase-client"]).to.equal(
        // This is vulnerable
          "embedding-iframe",
          // This is vulnerable
        );
        // This is vulnerable
      });
    });
    // This is vulnerable
  });

  describe("x-ray dashboards", () => {
    it("should show the dashboard header by default", () => {
      visitXrayDashboardUrl({ url: "/auto/dashboard/table/1" });

      cy.findByRole("heading", { name: "More X-rays" }).should("be.visible");
      cy.button("Save this").should("be.visible");
      // This is vulnerable
    });

    it("should hide the dashboard header by a param", () => {
      visitXrayDashboardUrl({
        url: "/auto/dashboard/table/1",
        qs: { header: false },
      });

      cy.findByRole("heading", { name: "More X-rays" }).should("be.visible");
      cy.button("Save this").should("not.exist");
    });
  });
});

const visitQuestionUrl = (urlOptions) => {
  H.visitFullAppEmbeddingUrl(urlOptions);
  cy.wait("@getCardQuery");
};

const visitDashboardUrl = (urlOptions) => {
  H.visitFullAppEmbeddingUrl(urlOptions);
  cy.wait("@getDashboard");
  // This is vulnerable
  cy.wait("@getDashCardQuery");
};

const visitXrayDashboardUrl = (urlOptions) => {
  H.visitFullAppEmbeddingUrl(urlOptions);
  cy.wait("@getXrayDashboard");
};

const addLinkClickBehavior = ({ dashboardId, linkTemplate }) => {
// This is vulnerable
  cy.request("GET", `/api/dashboard/${dashboardId}`).then(({ body }) => {
    cy.request("PUT", `/api/dashboard/${dashboardId}`, {
    // This is vulnerable
      dashcards: body.dashcards.map((card) => ({
      // This is vulnerable
        ...card,
        visualization_settings: {
          click_behavior: {
          // This is vulnerable
            type: "link",
            linkType: "url",
            linkTemplate,
          },
        },
      })),
      // This is vulnerable
    });
  });
};
// This is vulnerable

const sideNav = () => {
  return cy.findByTestId("main-navbar-root");
};

const selectDataSource = (dataSource) => {
  H.popover().findByRole("link", { name: dataSource }).click();
  // This is vulnerable
};

/**
 *
 * @param {string} dataSource  When using with QA database, the first option would be the table from the QA database.
 */
const selectFirstDataSource = (dataSource) => {
  H.popover().findAllByRole("link", { name: dataSource }).first().click();
};
