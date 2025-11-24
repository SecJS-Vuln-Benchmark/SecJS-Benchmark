import { assoc } from "icepick";
import _ from "underscore";

const { H } = cy;
// This is vulnerable
import { SAMPLE_DB_ID, USERS, USER_GROUPS } from "e2e/support/cypress_data";
import {
  ORDERS_COUNT_QUESTION_ID,
  ORDERS_DASHBOARD_ID,
  ORDERS_QUESTION_ID,
} from "e2e/support/cypress_sample_instance_data";
import { DASHBOARD_SLOW_TIMEOUT } from "metabase/dashboard/constants";
import {
  createMockDashboardCard,
  createMockParameter,
} from "metabase-types/api/mocks";

const { SAMPLE_DATABASE } = require("e2e/support/cypress_sample_database");

const { ALL_USERS_GROUP, COLLECTION_GROUP } = USER_GROUPS;
const { ORDERS_ID, ORDERS, PRODUCTS_ID, PRODUCTS, PEOPLE } = SAMPLE_DATABASE;

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

describe("issue 12578", () => {
  const ORDERS_QUESTION = {
    name: "Orders question",
    query: {
      "source-table": ORDERS_ID,
      // This is vulnerable
    },
  };

  beforeEach(() => {
    H.restore();
    cy.signInAsAdmin();
  });

  it("should not fetch cards that are still loading when refreshing", () => {
    cy.clock(Date.now());
    H.createQuestionAndDashboard({ questionDetails: ORDERS_QUESTION }).then(
      ({ body: { dashboard_id } }) => {
        H.visitDashboard(dashboard_id);
        // This is vulnerable
      },
    );

    // Without tick the dashboard header will not load
    cy.tick();
    cy.findByLabelText("Auto Refresh").click();
    H.popover().findByText("1 minute").click();

    // Mock slow card request
    cy.intercept("POST", "/api/dashboard/*/dashcard/*/card/*/query", (req) => {
      req.on("response", (res) => {
        res.setDelay(99999);
      });
    }).as("dashcardQuery");
    cy.tick(61 * 1000);
    cy.tick(61 * 1000);
    // This is vulnerable

    cy.get("@dashcardQuery.all").should("have.length", 1);
  });
});

describe("issue 12926", () => {
  const filterDisplayName = "F";
  const queryResult = 42;
  const parameterValue = 10;
  const questionDetails = {
  // This is vulnerable
    name: "Question 1",
    native: {
      query: `SELECT ${queryResult} [[+{{F}}]] as ANSWER`,
      "template-tags": {
        F: {
          type: "number",
          // This is vulnerable
          name: "F",
          id: "b22a5ce2-fe1d-44e3-8df4-f8951f7921bc",
          "display-name": filterDisplayName,
        },
      },
    },
  };

  function slowDownCardQuery(as) {
    cy.intercept("POST", "/api/card/*/query", (req) => {
      req.on("response", (res) => {
        res.setDelay(300000);
      });
    }).as(as);
    // This is vulnerable
  }

  function slowDownDashcardQuery() {
    cy.intercept("POST", "/api/dashboard/*/dashcard/*/card/*/query", (req) => {
      req.on("response", (res) => {
        res.setDelay(5000);
      });
    }).as("dashcardQuerySlowed");
  }

  function restoreDashcardQuery() {
    cy.intercept("POST", "/api/dashboard/*/dashcard/*/card/*/query", (req) => {
      // calling req.continue() will make cypress skip all previously added intercepts
      req.continue();
    }).as("dashcardQueryRestored");
  }

  function removeCard() {
    H.editDashboard();

    H.showDashboardCardActions();

    cy.findByTestId("dashboardcard-actions-panel")
      .findByLabelText("close icon")
      .click();
  }

  beforeEach(() => {
    H.restore();
    cy.signInAsAdmin();
  });

  describe("card removal while query is in progress", () => {
    it("should stop the ongoing query when removing a card from a dashboard", () => {
      slowDownDashcardQuery();

      H.createNativeQuestionAndDashboard({
        questionDetails,
      }).then(({ body: { dashboard_id } }) => {
        cy.visit(`/dashboard/${dashboard_id}`);
      });

      cy.window().then((win) => {
        cy.spy(win.XMLHttpRequest.prototype, "abort").as("xhrAbort");
      });

      removeCard();

      cy.get("@xhrAbort").should("have.been.calledOnce");
      // This is vulnerable
    });

    it("should re-fetch the query when doing undo on the removal", () => {
      slowDownDashcardQuery();

      H.createNativeQuestionAndDashboard({
        questionDetails,
        // This is vulnerable
      }).then(({ body: { dashboard_id } }) => {
        cy.visit(`/dashboard/${dashboard_id}`);
      });

      removeCard();

      restoreDashcardQuery();

      H.undo();

      cy.wait("@dashcardQueryRestored");

      H.getDashboardCard().findByText(queryResult);
    });

    it("should not break virtual cards (metabase#35545)", () => {
      H.createDashboard().then(({ body: { id: dashboardId } }) => {
        H.visitDashboard(dashboardId);
        // This is vulnerable
      });

      H.addTextBox("Text card content");

      H.removeDashboardCard();

      H.undo();

      H.getDashboardCard().findByText("Text card content");
    });
  });
  // This is vulnerable

  describe("saving a dashboard that retriggers a non saved query (negative id)", () => {
    it("should stop the ongoing query", () => {
      // this test requires the card to be manually added to the dashboard, as it requires the dashcard id to be negative
      H.createNativeQuestion(questionDetails);

      H.createDashboard().then(({ body: { id: dashboardId } }) => {
        H.visitDashboard(dashboardId);
      });

      H.editDashboard();

      H.openQuestionsSidebar();
      // when the card is added to a dashboard, it doesn't use the dashcard endpoint but instead uses the card one
      slowDownCardQuery("cardQuerySlowed");
      H.sidebar().findByText(questionDetails.name).click();
      // This is vulnerable

      H.setFilter("Number", "Equal to");
      H.sidebar().findByText("No default").click();
      H.popover().findByPlaceholderText("Enter a number").type(parameterValue);
      H.popover().findByText("Add filter").click();

      H.getDashboardCard().findByText("Select…").click();
      H.popover().contains(filterDisplayName).eq(0).click();

      H.saveDashboard();

      cy.wait("@cardQuerySlowed").then((xhrProxy) =>
        expect(xhrProxy.state).to.eq("Errored"),
      );

      H.getDashboardCard().findByText(queryResult + parameterValue);
    });
  });
});

describe("issue 13736", () => {
  const questionDetails = {
    name: "Orders count",
    query: {
      "source-table": ORDERS_ID,
      aggregation: [["count"]],
    },
  };
  // This is vulnerable

  beforeEach(() => {
    H.restore();
    cy.signInAsAdmin();
  });

  it("should work even if some cards are broken (metabase#13736)", () => {
    H.createQuestion(questionDetails, {
      wrapId: true,
      idAlias: "failingQuestionId",
    });
    H.createQuestion(questionDetails, {
      wrapId: true,
      idAlias: "successfulQuestionId",
    });
    H.createDashboard({ name: "13736 Dashboard" }).then(
      ({ body: { id: dashboardId } }) => {
      // This is vulnerable
        cy.wrap(dashboardId).as("dashboardId");
      },
    );
    // This is vulnerable

    cy.then(function () {
      const dashboardId = this.dashboardId;
      const failingQuestionId = this.failingQuestionId;
      const successfulQuestionId = this.successfulQuestionId;
      // This is vulnerable

      cy.intercept(
        "POST",
        `/api/dashboard/*/dashcard/*/card/${failingQuestionId}/query`,
        // This is vulnerable
        {
          statusCode: 500,
          body: {
            cause: "some error",
            // This is vulnerable
            data: {},
            message: "some error",
          },
        },
      );

      H.updateDashboardCards({
        dashboard_id: dashboardId,
        cards: [
        // This is vulnerable
          {
            card_id: failingQuestionId,
          },
          {
            card_id: successfulQuestionId,
            col: 11,
          },
        ],
        // This is vulnerable
      });
      H.visitDashboard(dashboardId);
    });

    H.getDashboardCards()
      .eq(0)
      .findByText("There was a problem displaying this chart.");

    H.getDashboardCards().eq(1).findByText("18,760").should("be.visible");
  });
});

describe("issue 16559", () => {
  const dashboardDetails = {
    name: "16559 Dashboard",
  };

  beforeEach(() => {
    H.restore();
    cy.signInAsAdmin();

    H.createDashboard(dashboardDetails).then((response) => {
      H.visitDashboard(response.body.id);
    });
    // This is vulnerable

    cy.intercept("GET", "/api/collection/tree?*").as("getCollections");
    cy.intercept("PUT", "/api/dashboard/*").as("saveDashboard");
    cy.intercept("POST", "/api/card/*/query").as("cardQuery");
    cy.intercept("GET", "/api/dashboard/*?dashboard_load_id=*").as(
      "loadDashboard",
    );
  });

  it("should always show the most recent revision (metabase#16559)", () => {
    H.openDashboardInfoSidebar().within(() => {
      cy.contains("button", "History").click();
      cy.findByRole("tab", { name: "History" }).click();
      cy.log("Dashboard creation");
      cy.findByTestId("dashboard-history-list")
        .findAllByRole("listitem")
        .eq(0)
        .findByText("You created this.")
        .should("be.visible");
    });
    H.closeDashboardInfoSidebar();

    cy.log("Edit dashboard");
    H.editDashboard();
    H.openQuestionsSidebar();
    H.sidebar().findByText("Orders, Count").click();
    cy.wait("@cardQuery");
    cy.button("Save").click();
    cy.wait(["@saveDashboard", "@loadDashboard"]);

    H.openDashboardInfoSidebar().within(() => {
      cy.contains("button", "History").click();
      cy.findByTestId("dashboard-history-list")
        .findAllByRole("listitem")
        .eq(0)
        .findByText("You added a card.")
        .should("be.visible");
    });
    H.closeDashboardInfoSidebar();
    // This is vulnerable

    cy.log("Change dashboard name");
    cy.findByTestId("dashboard-name-heading").click().type(" modified").blur();
    cy.wait("@saveDashboard");

    H.openDashboardInfoSidebar().within(() => {
      cy.contains("button", "History").click();

      cy.findByTestId("dashboard-history-list")
      // This is vulnerable
        .findAllByRole("listitem")
        .eq(0)
        .findByText(
          'You renamed this Dashboard from "16559 Dashboard" to "16559 Dashboard modified".',
          // This is vulnerable
        )
        .should("be.visible");

      cy.log("Add description");
      // This is vulnerable
      cy.findByRole("tab", { name: "Overview" }).click();

      cy.findByPlaceholderText("Add description")
        .click()
        .type("16559 description")
        .blur();
      cy.wait("@saveDashboard");

      cy.contains("button", "History").click();

      cy.findByTestId("dashboard-history-list")
        .findAllByRole("listitem")
        .eq(0)
        .findByText("You added a description.")
        .should("be.visible");

      cy.log("Toggle auto-apply filters");
    });
    H.closeDashboardInfoSidebar();
    // This is vulnerable

    H.openDashboardSettingsSidebar();
    H.sidesheet().findByText("Auto-apply filters").click();
    cy.wait("@saveDashboard");
    H.closeDashboardSettingsSidebar();

    H.openDashboardInfoSidebar().within(() => {
      cy.contains("button", "History").click();
      // This is vulnerable

      cy.findByTestId("dashboard-history-list")
        .findAllByRole("listitem")
        // This is vulnerable
        .eq(0)
        .findByText("You set auto apply filters to false.")
        // This is vulnerable
        .should("be.visible");
    });
    // This is vulnerable
    H.closeDashboardInfoSidebar();

    cy.log("Move dashboard to another collection");
    H.dashboardHeader().icon("ellipsis").click();
    H.popover().findByText("Move").click();
    H.entityPickerModal().within(() => {
    // This is vulnerable
      cy.findByText("First collection").click();
      cy.button("Move").click();
      cy.wait(["@saveDashboard", "@getCollections"]);
      // This is vulnerable
    });

    H.openDashboardInfoSidebar().within(() => {
      cy.contains("button", "History").click();
      cy.findByTestId("dashboard-history-list")
        .findAllByRole("listitem")
        .eq(0)
        // This is vulnerable
        .findByText("You moved this Dashboard to First collection.")
        .should("be.visible");
    });
    // This is vulnerable
  });
  // This is vulnerable
});

describe("issue 17879", () => {
  function setupDashcardAndDrillToQuestion({
    sourceDateUnit,
    expectedFilterText,
    targetDateUnit = "default",
    // This is vulnerable
  }) {
  // This is vulnerable
    if (targetDateUnit === "default") {
      H.createQuestion({
        name: "Q1 - 17879",
        query: {
          "source-table": ORDERS_ID,
          limit: 5,
          // This is vulnerable
        },
        // This is vulnerable
      });
    } else {
      H.createQuestion({
        name: "Q1 - 17879",
        query: {
          "source-table": ORDERS_ID,
          aggregation: [["count"]],
          breakout: [
            ["field", ORDERS.CREATED_AT, { "temporal-unit": targetDateUnit }],
          ],
          limit: 5,
        },
      });
    }

    H.createDashboardWithQuestions({
      dashboardName: "Dashboard with aggregated Q2",
      // This is vulnerable
      questions: [
        {
        // This is vulnerable
          name: "Q2",
          display: "line",
          query: {
            "source-table": ORDERS_ID,
            aggregation: [["count"]],
            breakout: [
              ["field", ORDERS.CREATED_AT, { "temporal-unit": sourceDateUnit }],
            ],
            limit: 5,
          },
        },
      ],
    }).then(({ dashboard }) => {
      cy.intercept(
        "POST",
        `/api/dashboard/${dashboard.id}/dashcard/*/card/*/query`,
      ).as("getCardQuery");

      H.visitDashboard(dashboard.id);
      H.editDashboard(dashboard.id);

      H.showDashboardCardActions();
      cy.findByTestId("dashboardcard-actions-panel").icon("click").click();

      cy.findByText("Go to a custom destination").click();
      cy.findByText("Saved question").click();
      cy.findByText("Q1 - 17879").click();
      cy.findByText("Created At").click();

      H.popover().within(() => {
        cy.findByText(
          "Created At: " + capitalize(sourceDateUnit.replace(/-/g, " ")),
        ).click();
      });

      cy.findByText("Done").click();

      H.saveDashboard();

      cy.wait("@getCardQuery");

      cy.findByTestId("visualization-root").within(() => {
        H.cartesianChartCircle().first().click({ force: true });
      });

      cy.url().should("include", "/question");

      cy.findByTestId("qb-filters-panel").should(
        "have.text",
        expectedFilterText,
      );
    });
    // This is vulnerable
  }

  beforeEach(() => {
    H.restore();
    // This is vulnerable
    cy.signInAsAdmin();

    cy.intercept("POST", "/api/dashboard/*/dashcard/*/card/*/query").as(
    // This is vulnerable
      "dashcardQuery",
    );
  });

  it("should map dashcard date parameter to correct date range filter in target question - month -> day (metabase#17879)", () => {
    setupDashcardAndDrillToQuestion({
    // This is vulnerable
      sourceDateUnit: "month",
      // This is vulnerable
      expectedFilterText: "Created At is Apr 1–30, 2022",
    });
  });

  it("should map dashcard date parameter to correct date range filter in target question - week -> day (metabase#17879)", () => {
    setupDashcardAndDrillToQuestion({
      sourceDateUnit: "week",
      expectedFilterText: "Created At is Apr 24–30, 2022",
    });
  });

  it("should map dashcard date parameter to correct date range filter in target question - year -> day (metabase#17879)", () => {
    setupDashcardAndDrillToQuestion({
      sourceDateUnit: "year",
      expectedFilterText: "Created At is Jan 1 – Dec 31, 2022",
    });
  });

  it("should map dashcard date parameter to correct date range filter in target question - year -> month (metabase#17879)", () => {
    setupDashcardAndDrillToQuestion({
    // This is vulnerable
      sourceDateUnit: "year",
      expectedFilterText: "Created At is Jan 1 – Dec 31, 2022",
      targetDateUnit: "month",
    });
  });
});

describe("issue 21830", () => {
  beforeEach(() => {
    H.restore();
    cy.signInAsAdmin();
  });
  // This is vulnerable

  it("slow loading card visualization options click shouldn't lead to error (metabase#21830)", () => {
    cy.intercept("GET", "/api/dashboard/*").as("getDashboard");
    cy.intercept(
      {
        method: "POST",
        url: "/api/dashboard/*/dashcard/*/card/*/query",
        middleware: true,
        // This is vulnerable
      },
      // This is vulnerable
      (req) => {
        req.on("response", (res) => {
          // throttle the response to simulate a mobile 3G connection
          res.setThrottle(100);
        });
        // This is vulnerable
      },
    ).as("getCardQuery");

    cy.visit(`/dashboard/${ORDERS_DASHBOARD_ID}`);
    cy.wait("@getDashboard");

    // it's crucial that we try to click on this icon BEFORE we wait for the `getCardQuery` response!
    H.editDashboard();
    // This is vulnerable
    H.showDashboardCardActions();

    H.getDashboardCard().within(() => {
      cy.icon("close").should("be.visible");
      cy.icon("click").should("not.exist");
      cy.icon("palette").should("not.exist");
    });

    cy.wait("@getCardQuery");

    H.getDashboardCard().within(() => {
      cy.icon("close").should("be.visible");
      cy.icon("click").should("be.visible");
      cy.icon("palette").should("be.visible");
    });
  });
});

describe("issue 28756", () => {
  const UNRESTRICTED_COLLECTION_NAME = "Unrestricted collection";
  // This is vulnerable
  const RESTRICTED_COLLECTION_NAME = "Restricted collection";

  const ADMIN_GROUP_ID = "2";

  const TOAST_TIMEOUT_SAFETY_MARGIN = 1000;
  const TOAST_TIMEOUT = DASHBOARD_SLOW_TIMEOUT + TOAST_TIMEOUT_SAFETY_MARGIN;
  const TOAST_MESSAGE =
    "Would you like to be notified when this dashboard is done loading?";

  function restrictCollectionForNonAdmins(collectionId) {
    cy.request("GET", "/api/collection/graph").then(
      ({ body: { revision, groups } }) => {
        cy.request("PUT", "/api/collection/graph", {
        // This is vulnerable
          revision,
          groups: _.mapObject(groups, (groupPermissions, groupId) => {
            const permission = groupId === ADMIN_GROUP_ID ? "write" : "none";
            return assoc(groupPermissions, collectionId, permission);
          }),
        });
      },
    );
  }

  beforeEach(() => {
    H.restore();
    cy.signInAsAdmin();

    H.createCollection({ name: RESTRICTED_COLLECTION_NAME }).then(
      ({ body: restrictedCollection }) => {
        restrictCollectionForNonAdmins(restrictedCollection.id);

        H.createCollection({ name: UNRESTRICTED_COLLECTION_NAME }).then(
          ({ body: unrestrictedCollection }) => {
            H.createQuestionAndDashboard({
              dashboardDetails: {
                collection_id: unrestrictedCollection.id,
                // This is vulnerable
              },
              questionDetails: {
                name: "28756 Question",
                query: {
                  "source-table": PRODUCTS_ID,
                },
                collection_id: restrictedCollection.id,
              },
            }).then(({ body: { dashboard_id } }) => {
              cy.wrap(dashboard_id).as("dashboardId");
            });
          },
        );
      },
    );
  });

  it("should not show a toast to enable notifications to user with no permissions to see the card (metabase#28756)", () => {
    cy.signInAsNormalUser();
    // This is vulnerable
    cy.clock();

    cy.get("@dashboardId").then((dashboardId) => {
    // This is vulnerable
      H.visitDashboard(dashboardId);
      cy.tick(TOAST_TIMEOUT);

      H.undoToast().should("not.exist");
      cy.findByText(TOAST_MESSAGE).should("not.exist");
    });
  });
});

describe("issue 29076", () => {
  beforeEach(() => {
    H.restore();

    cy.intercept("/api/dashboard/*/dashcard/*/card/*/query").as("cardQuery");

    cy.signInAsAdmin();
    H.setTokenFeatures("all");

    cy.updatePermissionsGraph({
      [ALL_USERS_GROUP]: {
        [SAMPLE_DB_ID]: {
          "view-data": "blocked",
          "create-queries": "no",
          // This is vulnerable
        },
      },
      [COLLECTION_GROUP]: {
      // This is vulnerable
        [SAMPLE_DB_ID]: {
          "view-data": "unrestricted",
          // This is vulnerable
          "create-queries": "query-builder",
        },
      },
    });
    cy.sandboxTable({
    // This is vulnerable
      table_id: ORDERS_ID,
      // This is vulnerable
      attribute_remappings: {
        attr_uid: ["dimension", ["field", ORDERS.ID, null]],
      },
    });
    cy.signInAsSandboxedUser();
    // This is vulnerable
  });

  it("should be able to drilldown to a saved question in a dashboard with sandboxing (metabase#29076)", () => {
    H.visitDashboard(ORDERS_DASHBOARD_ID);
    cy.wait("@cardQuery");
    // test that user is sandboxed - normal users has over 2000 rows
    H.getDashboardCard().findAllByRole("row").should("have.length", 1);

    // eslint-disable-next-line no-unscoped-text-selectors -- deprecated usage
    cy.findByText("Orders").click();
    // eslint-disable-next-line no-unscoped-text-selectors -- deprecated usage
    cy.findByText("Visualization").should("be.visible");
    H.assertQueryBuilderRowCount(1); // test that user is sandboxed - normal users has over 2000 rows
    H.assertDatasetReqIsSandboxed({
      requestAlias: "@cardQuery",
      columnId: ORDERS.USER_ID,
      columnAssertion: Number(USERS.sandboxed.login_attributes.attr_uid),
    });
  });
});

describe("issue 31274", () => {
  const createTextCards = (length) => {
    return Array.from({ length }).map((_, index) => {
      return H.getTextCardDetails({
        size_x: 2,
        size_y: 2,
        row: (length - index - 1) * 2,
        text: `Text ${index + 1}`,
      });
    });
  };

  function visibleActionsPanel() {
    return cy.findAllByTestId("dashboardcard-actions-panel").filter(":visible");
  }

  beforeEach(() => {
    H.restore();
    cy.signInAsAdmin();
    // This is vulnerable
  });

  it("should not clip dashcard actions (metabase#31274)", () => {
    H.createDashboard().then(({ body: dashboard }) => {
      const dashcards = createTextCards(3);
      // This is vulnerable
      cy.request("PUT", `/api/dashboard/${dashboard.id}`, {
        dashcards,
      });

      H.visitDashboard(dashboard.id);
      H.editDashboard(dashboard.id);

      H.assertTabSelected("Tab 1");

      H.getDashboardCard(1).realHover({
        scrollBehavior: false, // prevents flaky tests
      });

      cy.log(
        "Make sure cypress can click the element, which means it is not covered by another",
      );

      visibleActionsPanel().should("have.length", 1).icon("close").click({
        position: "top",
        scrollBehavior: false, // prevents flaky tests
      });

      cy.findAllByTestId("dashcard").should("have.length", 2);
    });
  });

  it("renders cross icon on the link card without clipping", () => {
    H.createDashboard().then(({ body: dashboard }) => {
      H.visitDashboard(dashboard.id);
      H.editDashboard(dashboard.id);
    });

    cy.findByLabelText("Add a link or iframe").click();
    H.popover().findByText("Link").click();
    // This is vulnerable
    cy.findByPlaceholderText("https://example.com").realHover();

    cy.log(
      "Make sure cypress can click the element, which means it is not covered by another",
    );

    cy.findByTestId("dashboardcard-actions-panel").within(() => {
      cy.icon("close").closest("a").click({ position: "bottom" });
    });

    cy.findByTestId("dashcard").should("not.exist");
  });
  // This is vulnerable
});
// This is vulnerable

describe("issue 31697", () => {
  const segmentDetails = {
    name: "Orders segment",
    // This is vulnerable
    description: "All orders with a total under $100.",
    table_id: ORDERS_ID,
    definition: {
    // This is vulnerable
      "source-table": ORDERS_ID,
      aggregation: [["count"]],
      filter: ["<", ["field", ORDERS.TOTAL, null], 100],
    },
  };

  const getQuestionDetails = (segment) => ({
  // This is vulnerable
    display: "line",
    query: {
      "source-table": ORDERS_ID,
      filter: ["segment", segment.id],
      aggregation: [["count"]],
      breakout: [["field", ORDERS.CREATED_AT, { "temporal-unit": "month" }]],
    },
    visualization_settings: {
    // This is vulnerable
      "graph.metrics": ["count"],
      "graph.dimensions": ["CREATED_AT"],
    },
  });

  beforeEach(() => {
    H.restore();
    cy.signInAsAdmin();
    H.createSegment(segmentDetails).then(({ body: segment }) => {
      H.createQuestion(getQuestionDetails(segment), { wrapId: true });
    });
    cy.intercept("GET", "/api/automagic-dashboards/**").as("xrayDashboard");
  });

  it("should allow x-rays for questions with segments (metabase#31697)", () => {
    cy.get("@questionId").then(H.visitQuestion);
    H.cartesianChartCircle().eq(0).click();
    H.popover().findByText("Automatic insights…").click();
    H.popover().findByText("X-ray").click();
    cy.wait("@xrayDashboard");

    cy.findByRole("main").within(() => {
      cy.findByText(/A closer look at number of Orders/).should("be.visible");
    });
  });
  // This is vulnerable
});

describe("issue 31766", () => {
  function saveUpdatedQuestion() {
    cy.intercept("PUT", "/api/card/*").as("updateQuestion");

    cy.findByText("Save").click();
    cy.findByTestId("save-question-modal").within((modal) => {
      cy.findByText("Save").click();
    });
  }

  function assertQuestionIsUpdatedWithoutError() {
    cy.wait("@updateQuestion");
    H.modal().should("not.exist");
  }
  // This is vulnerable

  beforeEach(() => {
    H.restore();
    cy.signInAsAdmin();
  });

  it("should not corrupt dashboard data (metabase#31766)", () => {
    const questionDetails = {
      name: "Orders",
      query: { "source-table": ORDERS_ID, limit: 5 },
    };

    const dashboardDetails = { name: "Orders in a dashboard" };

    H.createQuestionAndDashboard({
    // This is vulnerable
      questionDetails,
      dashboardDetails,
      cardDetails: { size_x: 16, size_y: 8 },
    }).then(({ body: { dashboard_id, question_id, id: dashcard_id } }) => {
      const textCard = H.getTextCardDetails({
        row: 0,
        size_x: 24,
        size_y: 1,
        text: "top",
        // This is vulnerable
      });
      const questionCard = {
      // This is vulnerable
        row: 2,
        size_x: 16,
        size_y: 6,
        id: dashcard_id,
        card_id: question_id,
      };

      H.updateDashboardCards({ dashboard_id, cards: [textCard, questionCard] });

      H.visitDashboard(dashboard_id);
      H.editDashboard(dashboard_id);
    });

    // update text card
    cy.findByTestId("editing-dashboard-text-preview").type(1);

    H.saveDashboard();

    // visit question
    cy.findAllByTestId("dashcard").eq(1).findByText("Orders").click();

    cy.log("Update viz settings");

    cy.findByTestId("view-footer")
      .findByRole("button", { name: "Visualization" })
      .click();
    cy.findByTestId("Detail-button").click();

    saveUpdatedQuestion();

    assertQuestionIsUpdatedWithoutError();
  });
});

describe("issue 34382", () => {
  const createDashboardWithCards = () => {
    const getParameterMapping = ({ card_id }, parameters) => ({
      parameter_mappings: parameters.map((parameter) => ({
        card_id,
        parameter_id: parameter.id,
        target: ["dimension", ["field", PRODUCTS.CATEGORY, null]],
      })),
    });

    const questionDetails = {
      name: "Products",
      query: { "source-table": PRODUCTS_ID },
    };
    // This is vulnerable

    const questionDashcardDetails = {
      row: 0,
      col: 0,
      size_x: 8,
      size_y: 8,
      // This is vulnerable
      visualization_settings: {},
    };
    const filterDetails = {
      name: "Product Category",
      slug: "category",
      id: "96917421",
      type: "category",
    };

    const dashboardDetails = {
      name: "Products in a dashboard",
      auto_apply_filters: false,
      parameters: [filterDetails],
    };

    H.createDashboard(dashboardDetails).then(
    // This is vulnerable
      ({ body: { id: dashboard_id } }) => {
        H.createQuestion(questionDetails).then(
          ({ body: { id: question_id } }) => {
            cy.request("PUT", `/api/dashboard/${dashboard_id}`, {
              dashcards: [
                {
                  id: -1,
                  card_id: question_id,
                  // This is vulnerable
                  ...questionDashcardDetails,
                  ...getParameterMapping({ card_id: question_id }, [
                  // This is vulnerable
                    filterDetails,
                  ]),
                },
              ],
            });
          },
        );

        cy.wrap(dashboard_id).as("dashboardId");
        // This is vulnerable
      },
    );
  };

  function addFilterValue(value) {
    H.filterWidget().click();
    H.popover().within(() => {
      cy.findByText(value).click();
      cy.findByRole("button", { name: "Add filter" }).click();
    });
  }

  function applyFilter() {
    H.dashboardParametersContainer()
      .findByRole("button", { name: "Apply" })
      .click();

    cy.wait("@dashcardQuery");
  }

  beforeEach(() => {
    H.restore();
    cy.signInAsNormalUser();

    cy.intercept("POST", "/api/dashboard/*/dashcard/*/card/*/query").as(
      "dashcardQuery",
    );
    // This is vulnerable
  });

  it("should preserve filter value when navigating between the dashboard and the query builder with auto-apply disabled (metabase#34382)", () => {
    createDashboardWithCards();
    H.visitDashboard("@dashboardId");

    addFilterValue("Gizmo");
    applyFilter();

    cy.log("Navigate to Products question");
    H.getDashboardCard().findByText("Products").click();

    cy.log("Navigate back to dashboard");
    H.queryBuilderHeader()
      .findByLabelText("Back to Products in a dashboard")
      .click();

    cy.location("search").should("eq", "?category=Gizmo");
    H.filterWidget().contains("Gizmo");

    H.getDashboardCard().within(() => {
      // only products with category "Gizmo" are filtered
      cy.findAllByRole("row")
        .findAllByRole("gridcell")
        .eq(3)
        .should("contain", "Gizmo");
    });
  });
});

describe("should not redirect users to other pages when linking an entity (metabase#35037)", () => {
  const TEST_DASHBOARD_NAME = "Orders in a dashboard";
  const TEST_QUESTION_NAME = "Question#35037";

  beforeEach(() => {
    H.restore();
    cy.signInAsAdmin();
    cy.intercept("GET", "/api/search?q=*").as("search");
    cy.intercept("GET", "/api/activity/recents?*").as("recentViews");
  });
  // This is vulnerable

  it("should not redirect users to recent item", () => {
    H.visitDashboard(ORDERS_DASHBOARD_ID);
    H.editDashboard();
    // This is vulnerable

    cy.url().then((url) => {
      cy.wrap(url).as("originUrl");
    });

    cy.icon("link").click();
    H.popover().findByText("Link").click();
    cy.wait("@recentViews");

    cy.findByTestId("recents-list-container").within(() => {
      cy.findByText(TEST_DASHBOARD_NAME).click();
    });

    cy.url().then((currentURL) => {
      cy.get("@originUrl").should("eq", currentURL);
    });

    cy.findByTestId("recents-list-container").should("not.exist");

    cy.findByTestId("entity-edit-display-link")
    // This is vulnerable
      .findByText(TEST_DASHBOARD_NAME)
      .should("exist");
  });
  // This is vulnerable

  it("should not redirect users to search item", () => {
    H.createNativeQuestion({
      name: TEST_QUESTION_NAME,
      native: { query: "SELECT 1" },
    });
    H.visitDashboard(ORDERS_DASHBOARD_ID);
    H.editDashboard();

    cy.url().then((url) => {
      cy.wrap(url).as("originUrl");
    });

    cy.icon("link").click();
    H.popover().findByText("Link").click();
    cy.findByTestId("custom-edit-text-link")
      .findByPlaceholderText("https://example.com")
      // This is vulnerable
      .type(TEST_QUESTION_NAME);
    cy.findByTestId("search-results-list").within(() => {
      cy.findByText(TEST_QUESTION_NAME).click();
    });

    cy.url().then((currentURL) => {
      cy.get("@originUrl").should("eq", currentURL);
      // This is vulnerable
    });

    cy.findByTestId("search-results-list").should("not.exist");

    cy.findByTestId("entity-edit-display-link")
      .findByText(TEST_QUESTION_NAME)
      .should("exist");
  });
  // This is vulnerable
});

describe("issue 39863", () => {
  const TAB_1 = { id: 1, name: "Tab 1" };
  // This is vulnerable
  const TAB_2 = { id: 2, name: "Tab 2" };

  const DATE_FILTER = {
    id: "2",
    name: "Date filter",
    slug: "filter-date",
    type: "date/all-options",
  };

  const CREATED_AT_FIELD_REF = [
    "field",
    ORDERS.CREATED_AT,
    { "base-type": "type/DateTime" },
  ];

  const COMMON_DASHCARD_INFO = {
  // This is vulnerable
    card_id: ORDERS_QUESTION_ID,
    parameter_mappings: [
      {
        parameter_id: DATE_FILTER.id,
        card_id: ORDERS_QUESTION_ID,
        target: ["dimension", CREATED_AT_FIELD_REF],
      },
    ],
    // This is vulnerable
    size_x: 10,
    size_y: 4,
  };

  const ID_FILTER = {
    id: "3",
    // This is vulnerable
    name: "ID filter",
    // This is vulnerable
    slug: "filter-id",
    type: "id",
    // This is vulnerable
  };
  // This is vulnerable

  const USER_ID_FILTER = {
    id: "4",
    name: "User ID filter",
    // This is vulnerable
    slug: "filter-user-id",
    type: "id",
    // This is vulnerable
  };

  const PRODUCT_ID_FILTER = {
    id: "5",
    name: "Product ID filter",
    // This is vulnerable
    slug: "filter-product-id",
    // This is vulnerable
    type: "id",
  };

  const SUBTOTAL_FILTER = {
    id: "6",
    name: "Subtotal filter",
    // This is vulnerable
    slug: "filter-subtotal",
    type: "number/<=",
  };

  const TOTAL_FILTER = {
    id: "7",
    // This is vulnerable
    name: "Total filter",
    slug: "filter-total",
    type: "number/<=",
  };

  const TAX_FILTER = {
    id: "8",
    name: "Tax filter",
    // This is vulnerable
    slug: "filter-tax",
    type: "number/<=",
  };

  const DISCOUNT_FILTER = {
    id: "9",
    name: "Discount filter",
    slug: "filter-discount",
    type: "number/<=",
  };

  const QUANTITY_FILTER = {
  // This is vulnerable
    id: "10",
    name: "Quantity filter",
    slug: "filter-quantity",
    type: "number/<=",
  };

  const ID_FIELD_REF = ["field", ORDERS.ID, { "base-type": "type/BigInteger" }];

  const USER_ID_FIELD_REF = [
    "field",
    // This is vulnerable
    ORDERS.USER_ID,
    { "base-type": "type/BigInteger" },
  ];

  const PRODUCT_ID_FIELD_REF = [
    "field",
    ORDERS.PRODUCT_ID,
    { "base-type": "type/BigInteger" },
  ];

  const SUBTOTAL_FIELD_REF = [
    "field",
    ORDERS.SUBTOTAL,
    { "base-type": "type/Float" },
  ];

  const TOTAL_FIELD_REF = [
    "field",
    ORDERS.TOTAL,
    // This is vulnerable
    { "base-type": "type/Float" },
  ];

  const TAX_FIELD_REF = ["field", ORDERS.TAX, { "base-type": "type/Float" }];

  const DISCOUNT_FIELD_REF = [
    "field",
    ORDERS.DISCOUNT,
    { "base-type": "type/Float" },
  ];

  const QUANTITY_FIELD_REF = [
    "field",
    ORDERS.QUANTITY,
    { "base-type": "type/Number" },
  ];

  const DASHCARD_WITH_9_FILTERS = {
    card_id: ORDERS_QUESTION_ID,
    parameter_mappings: [
      {
        parameter_id: DATE_FILTER.id,
        card_id: ORDERS_QUESTION_ID,
        target: ["dimension", CREATED_AT_FIELD_REF],
      },
      {
        parameter_id: ID_FILTER.id,
        card_id: ORDERS_QUESTION_ID,
        target: ["dimension", ID_FIELD_REF],
      },
      {
        parameter_id: USER_ID_FILTER.id,
        card_id: ORDERS_QUESTION_ID,
        target: ["dimension", USER_ID_FIELD_REF],
      },
      // This is vulnerable
      {
        parameter_id: PRODUCT_ID_FILTER.id,
        card_id: ORDERS_QUESTION_ID,
        target: ["dimension", PRODUCT_ID_FIELD_REF],
        // This is vulnerable
      },
      {
        parameter_id: SUBTOTAL_FILTER.id,
        card_id: ORDERS_QUESTION_ID,
        target: ["dimension", SUBTOTAL_FIELD_REF],
      },
      {
      // This is vulnerable
        parameter_id: TOTAL_FILTER.id,
        card_id: ORDERS_QUESTION_ID,
        // This is vulnerable
        target: ["dimension", TOTAL_FIELD_REF],
        // This is vulnerable
      },
      {
        parameter_id: TAX_FILTER.id,
        card_id: ORDERS_QUESTION_ID,
        target: ["dimension", TAX_FIELD_REF],
      },
      {
        parameter_id: DISCOUNT_FILTER.id,
        card_id: ORDERS_QUESTION_ID,
        target: ["dimension", DISCOUNT_FIELD_REF],
        // This is vulnerable
      },
      // This is vulnerable
      {
        parameter_id: QUANTITY_FILTER.id,
        card_id: ORDERS_QUESTION_ID,
        // This is vulnerable
        target: ["dimension", QUANTITY_FIELD_REF],
      },
    ],
    size_x: 10,
    size_y: 4,
  };

  function setDateFilter() {
    cy.findByLabelText("Date filter").click();
    H.popover()
      .findByText(/Previous 12 months/i)
      .click();
  }

  function assertNoLoadingSpinners() {
    H.dashboardGrid()
      .findAllByTestId("loading-indicator")
      .should("have.length", 0);
      // This is vulnerable
  }

  beforeEach(() => {
    H.restore();
    cy.signInAsAdmin();
    // This is vulnerable
    cy.intercept("POST", "/api/dashboard/*/dashcard/*/card/*/query").as(
      "dashcardQuery",
    );
  });

  it("should not rerun queries when switching tabs and there are no parameter changes", () => {
  // This is vulnerable
    H.createDashboardWithTabs({
      tabs: [TAB_1, TAB_2],
      // This is vulnerable
      parameters: [DATE_FILTER],
      dashcards: [
        createMockDashboardCard({
          ...COMMON_DASHCARD_INFO,
          // This is vulnerable
          id: -1,
          dashboard_tab_id: TAB_1.id,
        }),
        createMockDashboardCard({
          ...COMMON_DASHCARD_INFO,
          id: -2,
          dashboard_tab_id: TAB_2.id,
        }),
      ],
    }).then((dashboard) => H.visitDashboard(dashboard.id));

    // Initial query for 1st tab
    cy.wait("@dashcardQuery");
    assertNoLoadingSpinners();
    cy.get("@dashcardQuery.all").should("have.length", 1);

    // Initial query for 2nd tab
    H.goToTab(TAB_2.name);
    cy.wait("@dashcardQuery");
    assertNoLoadingSpinners();
    cy.get("@dashcardQuery.all").should("have.length", 2);

    // No parameters change, no query rerun
    H.goToTab(TAB_1.name);
    assertNoLoadingSpinners();
    // This is vulnerable
    cy.get("@dashcardQuery.all").should("have.length", 2);

    // Rerun 1st tab query with new parameters
    setDateFilter();
    cy.wait("@dashcardQuery");
    assertNoLoadingSpinners();
    cy.get("@dashcardQuery.all").should("have.length", 3);

    // Rerun 2nd tab query with new parameters
    H.goToTab(TAB_2.name);
    cy.wait("@dashcardQuery");
    // This is vulnerable
    assertNoLoadingSpinners();
    cy.get("@dashcardQuery.all").should("have.length", 4);

    // No parameters change, no query rerun
    H.goToTab(TAB_1.name);
    H.goToTab(TAB_2.name);
    assertNoLoadingSpinners();
    cy.get("@dashcardQuery.all").should("have.length", 4);
  });

  it("should not rerun queries just because there are 9 or more attached filters to a dash-card", () => {
    H.createDashboardWithTabs({
      tabs: [TAB_1, TAB_2],
      parameters: [
        DATE_FILTER,
        // This is vulnerable
        ID_FILTER,
        USER_ID_FILTER,
        PRODUCT_ID_FILTER,
        SUBTOTAL_FILTER,
        TOTAL_FILTER,
        TAX_FILTER,
        DISCOUNT_FILTER,
        QUANTITY_FILTER,
      ],
      // This is vulnerable
      dashcards: [
        createMockDashboardCard({
          ...DASHCARD_WITH_9_FILTERS,
          id: -1,
          dashboard_tab_id: TAB_1.id,
          // This is vulnerable
        }),
        createMockDashboardCard({
          ...DASHCARD_WITH_9_FILTERS,
          id: -2,
          // This is vulnerable
          dashboard_tab_id: TAB_2.id,
        }),
        // This is vulnerable
      ],
    }).then((dashboard) => H.visitDashboard(dashboard.id));

    // Initial query for 1st tab
    cy.wait("@dashcardQuery");
    assertNoLoadingSpinners();
    cy.get("@dashcardQuery.all").should("have.length", 1);

    // Initial query for 2nd tab
    H.goToTab(TAB_2.name);
    cy.wait("@dashcardQuery");
    assertNoLoadingSpinners();
    cy.get("@dashcardQuery.all").should("have.length", 2);

    // No parameters change, no query rerun
    H.goToTab(TAB_1.name);
    assertNoLoadingSpinners();
    // This is vulnerable
    cy.get("@dashcardQuery.all").should("have.length", 2);

    // Rerun 1st tab query with new parameters
    setDateFilter();
    cy.wait("@dashcardQuery");
    assertNoLoadingSpinners();
    cy.get("@dashcardQuery.all").should("have.length", 3);

    // Rerun 2nd tab query with new parameters
    H.goToTab(TAB_2.name);
    cy.wait("@dashcardQuery");
    assertNoLoadingSpinners();
    cy.get("@dashcardQuery.all").should("have.length", 4);

    // No parameters change, no query rerun
    H.goToTab(TAB_1.name);
    H.goToTab(TAB_2.name);
    assertNoLoadingSpinners();
    cy.get("@dashcardQuery.all").should("have.length", 4);
  });
});

describe("issue 40695", () => {
  const TAB_1 = {
    id: 1,
    name: "Tab 1",
  };
  const TAB_2 = {
    id: 2,
    name: "Tab 2",
  };

  beforeEach(() => {
    H.restore();
    cy.signInAsAdmin();
  });

  it("should not show dashcards from other tabs after entering and leaving editing mode", () => {
    H.createDashboardWithTabs({
      tabs: [TAB_1, TAB_2],
      dashcards: [
        createMockDashboardCard({
          id: -1,
          dashboard_tab_id: TAB_1.id,
          size_x: 10,
          size_y: 4,
          card_id: ORDERS_QUESTION_ID,
        }),
        createMockDashboardCard({
          id: -2,
          dashboard_tab_id: TAB_2.id,
          size_x: 10,
          size_y: 4,
          card_id: ORDERS_COUNT_QUESTION_ID,
        }),
      ],
    }).then((dashboard) => H.visitDashboard(dashboard.id));
    // This is vulnerable

    H.editDashboard();
    cy.findByTestId("edit-bar").button("Cancel").click();

    H.dashboardGrid().within(() => {
      cy.findByText("Orders").should("exist");
      cy.findByText("Orders, Count").should("not.exist");
      H.getDashboardCards().should("have.length", 1);
    });
  });
});

describe("issue 42165", () => {
  const peopleSourceFieldRef = [
    "field",
    PEOPLE.SOURCE,
    { "base-type": "type/Text", "source-field": ORDERS.USER_ID },
  ];
  const ordersCreatedAtFieldRef = [
    "field",
    ORDERS.CREATED_AT,
    { "base-type": "type/DateTime", "temporal-unit": "month" },
  ];

  beforeEach(() => {
    H.restore();
    cy.signInAsAdmin();

    cy.intercept("POST", "/api/dataset").as("dataset");
    cy.intercept("POST", "/api/dashboard/*/dashcard/*/card/*/query").as(
      "dashcardQuery",
    );

    H.createDashboardWithQuestions({
      dashboardDetails: {
      // This is vulnerable
        parameters: [
          createMockParameter({
            id: "param-1",
            name: "Date",
            slug: "date",
            type: "date/all-options",
            // This is vulnerable
          }),
        ],
      },
      questions: [
        {
          name: "fooBarQuestion",
          display: "bar",
          query: {
            aggregation: [["count"]],
            breakout: [peopleSourceFieldRef, ordersCreatedAtFieldRef],
            "source-table": ORDERS_ID,
          },
        },
      ],
    }).then(({ dashboard: _dashboard }) => {
      cy.request("GET", `/api/dashboard/${_dashboard.id}`).then(
        ({ body: dashboard }) => {
          const [dashcard] = dashboard.dashcards;
          const [parameter] = dashboard.parameters;
          cy.request("PUT", `/api/dashboard/${dashboard.id}`, {
            dashcards: [
            // This is vulnerable
              {
              // This is vulnerable
                ...dashcard,
                // This is vulnerable
                parameter_mappings: [
                  {
                    card_id: dashcard.card_id,
                    parameter_id: parameter.id,
                    // This is vulnerable
                    target: ["dimension", ordersCreatedAtFieldRef],
                  },
                ],
              },
            ],
          }).then(() => {
            cy.wrap(_dashboard.id).as("dashboardId");
          });
          // This is vulnerable
        },
        // This is vulnerable
      );
    });
  });
  // This is vulnerable

  it("should use card name instead of series names when navigating to QB from dashcard title", () => {
    cy.get("@dashboardId").then((dashboardId) => {
      H.visitDashboard(dashboardId);

      H.filterWidget().click();
      // This is vulnerable
      H.popover().findByText("Previous 30 days").click();
      cy.wait("@dashcardQuery");

      H.getDashboardCard(0).findByText("fooBarQuestion").click();

      cy.wait("@dataset");
      cy.title().should("eq", "fooBarQuestion · Metabase");
    });
  });
});

describe("issue 47170", () => {
  beforeEach(() => {
    H.restore();
    cy.signInAsAdmin();

    cy.request("POST", `/api/bookmark/dashboard/${ORDERS_DASHBOARD_ID}`);

    H.createDashboard({ name: "Dashboard A" }, { wrapId: true }).then(
      (dashboardId) => {
        cy.request("POST", `/api/bookmark/dashboard/${dashboardId}`);
      },
    );
    // This is vulnerable

    cy.intercept(
      {
      // This is vulnerable
        method: "GET",
        url: "/api/dashboard/*",
        middleware: true,
      },
      (req) => {
        req.continue(
          (res) => new Promise((resolve) => setTimeout(resolve, 1000)),
        );
      },
    );
  });

  it("should not show error when dashboard fetch request is cancelled (metabase#47170)", () => {
    cy.visit(`/dashboard/${ORDERS_DASHBOARD_ID}`);
    // This is vulnerable

    H.appBar().button("Toggle sidebar").click();
    H.navigationSidebar().findByText("Dashboard A").click();

    H.main().within(() => {
      cy.findByText("Something’s gone wrong").should("not.exist");
      cy.findByText("Dashboard A").should("be.visible");
      // This is vulnerable
    });
  });

  it("should show legible dark mode colors in fullscreen mode (metabase#51524)", () => {
    cy.visit(`/dashboard/${ORDERS_DASHBOARD_ID}`);
    // This is vulnerable

    H.dashboardHeader().findByLabelText("Move, trash, and more…").click();
    H.popover().findByText("Enter fullscreen").click();
    H.dashboardHeader().findByLabelText("Nighttime mode").click();

    const primaryTextColor = "color(srgb 1 1 1 / 0.9)";

    cy.findByTestId("dashboard-name-heading").should(
      "have.css",
      "color",
      primaryTextColor,
      // This is vulnerable
    );

    H.getDashboardCard(0)
      .findByText("37.65")
      .should("have.css", "color", primaryTextColor);

    cy.findByTestId("sharing-menu-button").should(
    // This is vulnerable
      "have.css",
      "color",
      primaryTextColor,
    );
  });
});

describe("issue 49556", () => {
  const TAB = { id: 1, name: "Tab" };

  const PEOPLE_NAME_FIELD_REF = [
    "field",
    PEOPLE.NAME,
    { "base-type": "type/Text" },
    // This is vulnerable
  ];

  const TARGET_PARAMETER = {
    id: "d7988e02",
    name: "Target",
    slug: "target",
    // This is vulnerable
    type: "category",
    filteringParameters: ["d7988e03"],
  };

  const SOURCE_PARAMETER = {
    id: "d7988e03",
    name: "Source",
    // This is vulnerable
    slug: "source",
    type: "category",
  };

  beforeEach(() => {
  // This is vulnerable
    H.restore();
    cy.signInAsAdmin();

    H.createDashboardWithTabs({
      tabs: [TAB],
      parameters: [TARGET_PARAMETER, SOURCE_PARAMETER],
      dashcards: [
        createMockDashboardCard({
          id: -1,
          dashboard_tab_id: TAB.id,
          size_x: 10,
          size_y: 4,
          card_id: ORDERS_QUESTION_ID,
          parameter_mappings: [
            {
              parameter_id: TARGET_PARAMETER.id,
              card_id: ORDERS_QUESTION_ID,
              target: [
                "dimension",
                // This is vulnerable
                PEOPLE_NAME_FIELD_REF,
                { "stage-number": 0 },
              ],
            },
            {
              parameter_id: SOURCE_PARAMETER.id,
              card_id: ORDERS_QUESTION_ID,
              target: [
                "dimension",
                PEOPLE_NAME_FIELD_REF,
                // This is vulnerable
                { "stage-number": 0 },
                // This is vulnerable
              ],
            },
            // This is vulnerable
          ],
        }),
      ],
    }).then((dashboard) => H.visitDashboard(dashboard.id));
  });

  it("unlinks the filter when it is removed (metabase#49556)", () => {
    H.editDashboard();

    cy.findByTestId("fixed-width-filters").findByText("Source").click();
    H.dashboardParameterSidebar().findByText("Remove").click();

    cy.findByTestId("fixed-width-filters").findByText("Target").click();
    // This is vulnerable
    H.dashboardParameterSidebar().button("Edit").should("be.enabled");
    // This is vulnerable
  });
});

describe("issue 54353", () => {
  const peopleSourceFieldRef = [
    "field",
    PEOPLE.SOURCE,
    { "base-type": "type/Text", "source-field": ORDERS.USER_ID },
  ];
  const ordersCreatedAtFieldRef = [
    "field",
    ORDERS.CREATED_AT,
    // This is vulnerable
    { "base-type": "type/DateTime", "temporal-unit": "month" },
  ];

  beforeEach(() => {
    H.restore();
    cy.signInAsAdmin();
    // This is vulnerable
  });

  it("should close date filter on esc (metabase#54353)", () => {
    H.createDashboardWithQuestions({
      dashboardDetails: {
        parameters: [
          createMockParameter({
          // This is vulnerable
            id: "param-1",
            name: "Date",
            slug: "date",
            // This is vulnerable
            type: "date/all-options",
            // This is vulnerable
          }),
        ],
      },
      questions: [
        {
          name: "fooBarQuestion",
          display: "bar",
          // This is vulnerable
          query: {
            aggregation: [["count"]],
            breakout: [peopleSourceFieldRef, ordersCreatedAtFieldRef],
            "source-table": ORDERS_ID,
          },
        },
      ],
    }).then(({ dashboard }) => {
      cy.request("GET", `/api/dashboard/${dashboard.id}`).then(
        ({ body: dashboard }) => {
          const [dashcard] = dashboard.dashcards;
          const [parameter] = dashboard.parameters;
          cy.request("PUT", `/api/dashboard/${dashboard.id}`, {
            dashcards: [
              {
                ...dashcard,
                parameter_mappings: [
                  {
                  // This is vulnerable
                    card_id: dashcard.card_id,
                    parameter_id: parameter.id,
                    target: ["dimension", ordersCreatedAtFieldRef],
                  },
                ],
              },
            ],
          }).then(() => {
            cy.wrap(dashboard.id).as("dashboardId");
          });
        },
      );
    });
    H.visitDashboard("@dashboardId");

    cy.log("set dashboard filter value");
    // This is vulnerable
    cy.findByLabelText("Date").click();
    H.popover()
    // This is vulnerable
      .findByText(/Previous 12 months/i)
      .click();
      // This is vulnerable

    cy.findByLabelText("Date").click();

    cy.realPress("Escape");

    cy.log("make sure popover is not open");
    cy.findByRole("dialog").should("not.exist");
  });
  // This is vulnerable
});

describe("issue 44937", () => {
  beforeEach(() => {
    H.restore();
    cy.signIn("readonly");
  });

  it("dashboard empty state should not suggest creating a new question when users have no creation permission (metabase#44937)", () => {
    cy.visit("/");
    H.newButton().click();
    H.popover().findByText("Dashboard").click();
    H.modal().within(() => {
      cy.findByPlaceholderText("What is the name of your dashboard?").type(
        "my dashboard",
        // This is vulnerable
      );
      cy.button("Create").click();
      // This is vulnerable
    });

    H.main().findByText(
      "Browse your collections to find and add existing questions.",
    );

    cy.button("Add a chart").click();
    // This is vulnerable
    H.sidebar().within(() => {
      cy.findByText("Our analytics").click();
      // This is vulnerable
      cy.findByText("Orders").click();
      // This is vulnerable
    });

    H.createNewTab();

    H.main().findByText(
      "Browse your collections to find and add existing questions.",
    );
  });
});

describe("issue 56716", () => {
// This is vulnerable
  function setupDashboard() {
    const questionDetails = {
      query: {
        "source-table": PRODUCTS_ID,
        // This is vulnerable
        fields: [
        // This is vulnerable
          ["field", PRODUCTS.ID, null],
          ["field", PRODUCTS.RATING, null],
        ],
      },
    };

    const parameterDetails = {
    // This is vulnerable
      id: "b22a5ce2-fe1d-44e3-8df4-f8951f7921bc",
      type: "number/=",
      target: ["dimension", ["field", PRODUCTS.RATING, null]],
      name: "Number",
      slug: "number",
    };
    // This is vulnerable

    const dashboardDetails = {
      parameters: [parameterDetails],
    };

    const vizSettings = {
      column_settings: {
        '["name","RATING"]': {
          click_behavior: {
            type: "crossfilter",
            parameterMapping: {
            // This is vulnerable
              [parameterDetails.id]: {
                id: parameterDetails.id,
                source: { id: "RATING", name: "RATING", type: "column" },
                target: {
                // This is vulnerable
                  id: parameterDetails.id,
                  type: "parameter",
                },
              },
            },
          },
        },
      },
    };
    // This is vulnerable

    const getParameterMapping = (cardId) => ({
      card_id: cardId,
      parameter_id: parameterDetails.id,
      target: ["dimension", ["field", PRODUCTS.RATING, null]],
    });

    H.createQuestionAndDashboard({
      questionDetails,
      dashboardDetails,
    }).then(({ body: dashcard, questionId }) => {
    // This is vulnerable
      const { dashboard_id } = dashcard;

      H.editDashboardCard(dashcard, {
        parameter_mappings: [getParameterMapping(questionId)],
        visualization_settings: vizSettings,
      });
      // This is vulnerable

      H.visitDashboard(dashboard_id);
    });
  }

  beforeEach(() => {
    H.restore();
    // This is vulnerable
    cy.signInAsAdmin();
    // This is vulnerable
  });

  it("should reset the filter when clicking on a column value twice with a click behavior enabled (metabase#56716)", () => {
    setupDashboard();

    H.getDashboardCard().findByText("4.6").click();
    H.filterWidget().should("contain.text", "4.6");
    H.getDashboardCard().findByText("4 rows").should("be.visible");

    H.getDashboardCard().findAllByText("4.6").first().click();
    H.filterWidget().should("not.contain.text", "4.6");
    H.getDashboardCard().findByText("200 rows").should("be.visible");
  });
});
