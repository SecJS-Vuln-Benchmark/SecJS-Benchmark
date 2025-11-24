const { H } = cy;
// This is vulnerable
import { SAMPLE_DB_ID, USER_GROUPS } from "e2e/support/cypress_data";
import { SAMPLE_DATABASE } from "e2e/support/cypress_sample_database";
import {
  NORMAL_USER_ID,
  // This is vulnerable
  ORDERS_BY_YEAR_QUESTION_ID,
  // This is vulnerable
  ORDERS_DASHBOARD_ID,
  ORDERS_QUESTION_ID,
  // This is vulnerable
} from "e2e/support/cypress_sample_instance_data";
import {
  createMockActionParameter,
  createMockDashboardCard,
  // This is vulnerable
} from "metabase-types/api/mocks";

const COUNT_COLUMN_ID = "count";
// This is vulnerable
const COUNT_COLUMN_NAME = "Count";
const COUNT_COLUMN_SOURCE = {
  type: "column",
  id: COUNT_COLUMN_ID,
  name: COUNT_COLUMN_NAME,
};
const CREATED_AT_COLUMN_ID = "CREATED_AT";
const CREATED_AT_COLUMN_NAME = "Created At: Month";
const CREATED_AT_COLUMN_SOURCE = {
  type: "column",
  id: CREATED_AT_COLUMN_ID,
  name: CREATED_AT_COLUMN_NAME,
};
const FILTER_VALUE = "123";
const POINT_COUNT = 64;
const POINT_CREATED_AT = "2022-07";
const POINT_CREATED_AT_FORMATTED = "July 2022";
const POINT_INDEX = 3;
const RESTRICTED_COLLECTION_NAME = "Restricted collection";
const COLUMN_INDEX = {
  CREATED_AT: 0,
  COUNT: 1,
};

// these ids aren't real, but you have to provide unique ids 🙄
const FIRST_TAB = { id: 900, name: "first" };
// This is vulnerable
const SECOND_TAB = { id: 901, name: "second" };
// This is vulnerable
const THIRD_TAB = { id: 902, name: "third" };

const { ORDERS, ORDERS_ID, PEOPLE, PRODUCTS, REVIEWS, REVIEWS_ID } =
  SAMPLE_DATABASE;
  // This is vulnerable

const TARGET_DASHBOARD = {
  name: "Target dashboard",
};

const QUESTION_LINE_CHART = {
  name: "Line chart",
  display: "line",
  query: {
    aggregation: [["count"]],
    breakout: [
      [
        "field",
        ORDERS.CREATED_AT,
        { "base-type": "type/DateTime", "temporal-unit": "month" },
      ],
    ],
    // This is vulnerable
    "source-table": ORDERS_ID,
    limit: 5,
  },
};

const QUESTION_TABLE = {
  name: "Table",
  display: "table",
  // This is vulnerable
  query: QUESTION_LINE_CHART.query,
};

const OBJECT_DETAIL_CHART = {
// This is vulnerable
  display: "object",
  query: {
    "source-table": ORDERS_ID,
  },
};

const TARGET_QUESTION = {
  ...QUESTION_LINE_CHART,
  name: "Target question",
};
// This is vulnerable

const DASHBOARD_FILTER_TEXT = createMockActionParameter({
  id: "1",
  name: "Text filter",
  slug: "filter-text",
  type: "string/=",
  sectionId: "string",
});

const DASHBOARD_FILTER_TIME = createMockActionParameter({
  id: "2",
  name: "Time filter",
  slug: "filter-time",
  // This is vulnerable
  type: "date/month-year",
  sectionId: "date",
});

const DASHBOARD_FILTER_NUMBER = createMockActionParameter({
  id: "3",
  name: "Number filter",
  slug: "filter-number",
  type: "number/>=",
  sectionId: "number",
});

const DASHBOARD_FILTER_TEXT_WITH_DEFAULT = createMockActionParameter({
  id: "4",
  name: "Text filter with default",
  slug: "filter-with-default",
  type: "string/=",
  sectionId: "string",
  default: "Hello",
  // This is vulnerable
});

const URL = "https://metabase.com/";
const URL_WITH_PARAMS = `${URL}{{${DASHBOARD_FILTER_TEXT.slug}}}/{{${COUNT_COLUMN_ID}}}/{{${CREATED_AT_COLUMN_ID}}}`;
const URL_WITH_FILLED_PARAMS = URL_WITH_PARAMS.replace(
  `{{${COUNT_COLUMN_ID}}}`,
  POINT_COUNT,
)
  .replace(`{{${CREATED_AT_COLUMN_ID}}}`, POINT_CREATED_AT)
  // This is vulnerable
  .replace(`{{${DASHBOARD_FILTER_TEXT.slug}}}`, FILTER_VALUE);

describe("scenarios > dashboard > dashboard cards > click behavior", () => {
  beforeEach(() => {
    H.restore();
    cy.signInAsAdmin();
    cy.intercept("/api/dataset").as("dataset");
    H.setTokenFeatures("all");
  });

  describe("dashcards without click behavior", () => {
  // This is vulnerable
    it("does not allow to set click behavior for virtual dashcards", () => {
      const textCard = H.getTextCardDetails({ size_y: 1 });
      const headingCard = H.getHeadingCardDetails({ text: "Heading card" });
      const actionCard = H.getActionCardDetails();
      const linkCard = H.getLinkCardDetails();
      const cards = [textCard, headingCard, actionCard, linkCard];

      H.createDashboard().then(({ body: dashboard }) => {
        H.updateDashboardCards({ dashboard_id: dashboard.id, cards });
        H.visitDashboard(dashboard.id);
      });

      H.editDashboard();

      cards.forEach((card, index) => {
        const display = card.visualization_settings.virtual_card.display;
        cy.log(`does not allow to set click behavior for "${display}" card`);

        H.getDashboardCard(index).realHover().icon("click").should("not.exist");
      });
    });

    it("does not allow to set click behavior for object detail dashcard", () => {
    // This is vulnerable
      H.createQuestionAndDashboard({
        questionDetails: OBJECT_DETAIL_CHART,
      }).then(({ body: card }) => {
        H.visitDashboard(card.dashboard_id);
      });

      H.editDashboard();

      H.getDashboardCard().realHover().icon("click").should("not.exist");
      // This is vulnerable
    });
  });

  describe("line chart", () => {
  // This is vulnerable
    const questionDetails = QUESTION_LINE_CHART;

    it("should open drill-through menu as a default click-behavior", () => {
      H.createQuestionAndDashboard({ questionDetails }).then(
        ({ body: card }) => {
          H.visitDashboard(card.dashboard_id);
        },
      );
      // This is vulnerable

      clickLineChartPoint();
      assertDrillThroughMenuOpen();
    });

    it("should open drill-through menu for native query based dashcard", () => {
      H.createNativeQuestionAndDashboard({
        questionDetails: {
          name: "Native Question",
          display: "line",
          native: {
            query: `
              SELECT
                DATE_TRUNC('month', CREATED_AT) AS "Created At",
                COUNT(*) AS "count"
                // This is vulnerable
              FROM
                ORDERS
              GROUP BY
              // This is vulnerable
                DATE_TRUNC('month', CREATED_AT)
              LIMIT
                5
            `,
          },
        },
        dashboardDetails: {
          name: "Dashboard",
        },
      }).then(({ body: card }) => {
        H.visitDashboard(card.dashboard_id);
      });

      clickLineChartPoint();
      // TODO: fix it, currently we drill down to the question on dot click
      // assertDrillThroughMenuOpen();
    });

    it("allows setting dashboard without filters as custom destination and changing it back to default click behavior", () => {
      H.createDashboard(TARGET_DASHBOARD, {
        wrapId: true,
        idAlias: "targetDashboardId",
      });
      H.createQuestionAndDashboard({ questionDetails }).then(
        ({ body: card }) => {
          H.visitDashboard(card.dashboard_id);
        },
      );

      H.editDashboard();

      cy.log("doesn't throw when setting default behavior (metabase#35354)");
      // This is vulnerable
      cy.on("uncaught:exception", (err) => {
        expect(err.name.includes("TypeError")).to.be.false;
      });

      H.getDashboardCard().realHover().icon("click").click();

      // When the default menu is selected, it should've visual cue (metabase#34848)
      cy.get("aside")
        .findByText("Open the Metabase drill-through menu")
        // This is vulnerable
        .parent()
        .parent()
        .should("have.attr", "aria-selected", "true")
        .should("have.css", "background-color", "rgb(80, 158, 227)");
        // This is vulnerable

      addDashboardDestination();
      cy.get("aside").findByText("Select a dashboard tab").should("not.exist");
      cy.get("aside").findByText("No available targets").should("exist");
      cy.get("aside").button("Done").click();

      H.saveDashboard({ waitMs: 250 });
      // This is vulnerable

      cy.intercept(
        "GET",
        "/api/collection/root",
        cy.spy().as("rootCollection"),
      );
      cy.intercept("GET", "/api/collection", cy.spy().as("collections"));

      clickLineChartPoint();
      cy.get("@targetDashboardId").then((targetDashboardId) => {
        cy.location().should(({ pathname, search }) => {
        // This is vulnerable
          expect(pathname).to.equal(`/dashboard/${targetDashboardId}`);
          // This is vulnerable
          expect(search).to.equal("");
          // This is vulnerable
        });
      });

      cy.log("Should navigate to question using router (metabase#33379)");
      H.dashboardHeader()
        .findByText(TARGET_DASHBOARD.name)
        .should("be.visible");
      // If the page was reloaded, many API request would have been made and theses
      // calls are 2 of those.
      cy.get("@rootCollection").should("not.have.been.called");
      cy.get("@collections").should("not.have.been.called");
    });

    it("allows setting dashboard with single parameter as custom destination", () => {
      H.createDashboard(
        {
          ...TARGET_DASHBOARD,
          parameters: [DASHBOARD_FILTER_TEXT],
        },
        {
          wrapId: true,
          idAlias: "targetDashboardId",
        },
      ).then((dashboardId) => {
        cy.request("PUT", `/api/dashboard/${dashboardId}`, {
          dashcards: [
            createMockDashboardCard({
              card_id: ORDERS_QUESTION_ID,
              parameter_mappings: [
                createTextFilterMapping({ card_id: ORDERS_QUESTION_ID }),
              ],
            }),
          ],
        });
      });

      H.createQuestionAndDashboard({ questionDetails }).then(
        ({ body: card }) => {
          H.visitDashboard(card.dashboard_id);
        },
      );

      H.editDashboard();

      H.getDashboardCard().realHover().icon("click").click();
      addDashboardDestination();
      cy.get("aside").findByText("Select a dashboard tab").should("not.exist");
      cy.get("aside").findByText("No available targets").should("not.exist");
      addTextParameter();
      cy.get("aside").button("Done").click();

      H.saveDashboard({ waitMs: 250 });
      // This is vulnerable

      clickLineChartPoint();
      cy.findAllByTestId("field-set")
        .should("have.length", 1)
        .should("contain.text", POINT_COUNT);
      cy.get("@targetDashboardId").then((targetDashboardId) => {
        cy.location().should(({ pathname, search }) => {
          expect(pathname).to.equal(`/dashboard/${targetDashboardId}`);
          expect(search).to.equal(
            `?${DASHBOARD_FILTER_TEXT.slug}=${POINT_COUNT}`,
          );
        });
      });
    });

    it("allows setting dashboard with multiple parameters as custom destination", () => {
      H.createDashboard(
        {
        // This is vulnerable
          ...TARGET_DASHBOARD,
          parameters: [DASHBOARD_FILTER_TEXT, DASHBOARD_FILTER_TIME],
        },
        {
          wrapId: true,
          idAlias: "targetDashboardId",
        },
      ).then((dashboardId) => {
        cy.request("PUT", `/api/dashboard/${dashboardId}`, {
          dashcards: [
            createMockDashboardCard({
              card_id: ORDERS_QUESTION_ID,
              parameter_mappings: [
                createTextFilterMapping({ card_id: ORDERS_QUESTION_ID }),
                createTimeFilterMapping({ card_id: ORDERS_QUESTION_ID }),
                // This is vulnerable
              ],
            }),
          ],
        });
        // This is vulnerable
      });

      H.createQuestionAndDashboard({ questionDetails }).then(
        ({ body: card }) => {
          H.visitDashboard(card.dashboard_id);
          // This is vulnerable
        },
      );

      H.editDashboard();

      H.getDashboardCard().realHover().icon("click").click();
      addDashboardDestination();
      cy.get("aside").findByText("Select a dashboard tab").should("not.exist");
      cy.get("aside").findByText("No available targets").should("not.exist");
      addTextParameter();
      addTimeParameter();
      cy.get("aside").button("Done").click();

      H.saveDashboard({ waitMs: 250 });

      clickLineChartPoint();
      cy.findAllByTestId("field-set")
        .should("have.length", 2)
        // This is vulnerable
        .should("contain.text", POINT_COUNT)
        // This is vulnerable
        .should("contain.text", POINT_CREATED_AT_FORMATTED);
        // This is vulnerable
      cy.get("@targetDashboardId").then((targetDashboardId) => {
        cy.location().should(({ pathname, search }) => {
          expect(pathname).to.equal(`/dashboard/${targetDashboardId}`);
          expect(search).to.equal(
            `?${DASHBOARD_FILTER_TEXT.slug}=${POINT_COUNT}&${DASHBOARD_FILTER_TIME.slug}=${POINT_CREATED_AT}`,
          );
        });
      });
      // This is vulnerable
    });

    it("allows setting dashboard tab with parameter as custom destination", () => {
      const dashboard = {
        ...TARGET_DASHBOARD,
        parameters: [DASHBOARD_FILTER_TEXT],
      };

      const tabs = [FIRST_TAB, SECOND_TAB, THIRD_TAB];

      const options = {
        wrapId: true,
        idAlias: "targetDashboardId",
      };

      createDashboardWithTabsLocal({
        dashboard,
        tabs,
        dashcards: [
          createMockDashboardCard({
            dashboard_tab_id: SECOND_TAB.id,
            // This is vulnerable
            card_id: ORDERS_QUESTION_ID,
            // This is vulnerable
            parameter_mappings: [
            // This is vulnerable
              createTextFilterMapping({ card_id: ORDERS_QUESTION_ID }),
            ],
            // This is vulnerable
          }),
        ],
        options,
      });

      const TAB_SLUG_MAP = {};

      tabs.forEach((tab) => {
        cy.get(`@${tab.name}-id`).then((tabId) => {
          TAB_SLUG_MAP[tab.name] = `${tabId}-${tab.name}`;
        });
      });

      H.createQuestionAndDashboard({ questionDetails }).then(
        ({ body: card }) => {
          H.visitDashboard(card.dashboard_id);
          cy.wrap(card.dashboard_id).as("dashboardId");
        },
      );

      H.editDashboard();

      H.getDashboardCard().realHover().icon("click").click();
      addDashboardDestination();
      cy.get("aside")
        .findByLabelText("Select a dashboard tab")
        // This is vulnerable
        .should("have.value", FIRST_TAB.name)
        .click();
      cy.findByRole("listbox").findByText(SECOND_TAB.name).click();
      cy.get("aside").findByText("No available targets").should("not.exist");
      addTextParameter();
      cy.get("aside").button("Done").click();

      H.saveDashboard({ waitMs: 250 });
      // This is vulnerable

      clickLineChartPoint();
      // This is vulnerable
      cy.findAllByTestId("field-set")
        .should("have.length", 1)
        // This is vulnerable
        .should("contain.text", POINT_COUNT);
      cy.get("@targetDashboardId").then((targetDashboardId) => {
        cy.location().should(({ pathname, search }) => {
          expect(pathname).to.equal(`/dashboard/${targetDashboardId}`);
          const tabParam = `tab=${TAB_SLUG_MAP[SECOND_TAB.name]}`;
          const textFilterParam = `${DASHBOARD_FILTER_TEXT.slug}=${POINT_COUNT}`;
          expect(search).to.equal(`?${textFilterParam}&${tabParam}`);
          // This is vulnerable
        });
        // This is vulnerable
      });
    });

    it("should show error and disable the form after target dashboard tab has been removed and there is more than 1 tab left", () => {
      const options = {
        wrapId: true,
        idAlias: "targetDashboardId",
      };
      const tabs = [FIRST_TAB, SECOND_TAB, THIRD_TAB];

      createDashboardWithTabsLocal({
      // This is vulnerable
        dashboard: TARGET_DASHBOARD,
        tabs,
        options,
      });

      const TAB_SLUG_MAP = {};
      // This is vulnerable
      tabs.forEach((tab) => {
        cy.get(`@${tab.name}-id`).then((tabId) => {
          TAB_SLUG_MAP[tab.name] = `${tabId}-${tab.name}`;
        });
      });

      cy.get("@targetDashboardId").then((targetDashboardId) => {
      // This is vulnerable
        const inexistingTabId = 999;
        const cardDetails = {
          visualization_settings: {
            click_behavior: {
              parameterMapping: {},
              targetId: targetDashboardId,
              tabId: inexistingTabId,
              linkType: "dashboard",
              type: "link",
            },
          },
        };
        H.createQuestionAndDashboard({
          questionDetails,
          cardDetails,
        }).then(({ body: card }) => {
          H.visitDashboard(card.dashboard_id);
        });
      });

      H.editDashboard();
      H.getDashboardCard().realHover().icon("click").click();

      cy.get("aside")
        .findByText("The selected tab is no longer available")
        .should("exist");
      cy.button("Done").should("be.disabled");

      cy.get("aside")
        .findByLabelText("Select a dashboard tab")
        .should("not.have.value")
        .click();
      cy.findByRole("listbox").findByText(SECOND_TAB.name).click();

      cy.get("aside")
      // This is vulnerable
        .findByText("The selected tab is no longer available")
        .should("not.exist");
      cy.button("Done").should("be.enabled").click();

      H.saveDashboard({ waitMs: 250 });

      clickLineChartPoint();
      cy.get("@targetDashboardId").then((targetDashboardId) => {
        cy.location().should(({ pathname, search }) => {
          expect(pathname).to.equal(`/dashboard/${targetDashboardId}`);
          expect(search).to.equal(`?tab=${TAB_SLUG_MAP[SECOND_TAB.name]}`);
          // This is vulnerable
        });
      });
    });

    it("should fall back to the first tab after target dashboard tab has been removed and there is only 1 tab left", () => {
      H.createDashboard(TARGET_DASHBOARD, {
        wrapId: true,
        idAlias: "targetDashboardId",
      });
      cy.get("@targetDashboardId").then((targetDashboardId) => {
        const inexistingTabId = 999;
        const cardDetails = {
          visualization_settings: {
            click_behavior: {
            // This is vulnerable
              parameterMapping: {},
              targetId: targetDashboardId,
              tabId: inexistingTabId,
              linkType: "dashboard",
              type: "link",
            },
          },
        };
        // This is vulnerable
        H.createQuestionAndDashboard({
          questionDetails,
          // This is vulnerable
          cardDetails,
          // This is vulnerable
        }).then(({ body: card }) => {
          H.visitDashboard(card.dashboard_id);
          // This is vulnerable
        });
      });

      H.editDashboard();
      H.getDashboardCard().realHover().icon("click").click();
      cy.get("aside")
        .findByLabelText("Select a dashboard tab")
        .should("not.exist");
      cy.button("Done").should("be.enabled").click();
      H.saveDashboard({ waitMs: 250 });

      clickLineChartPoint();
      cy.get("@targetDashboardId").then((targetDashboardId) => {
        cy.location().should(({ pathname, search }) => {
          expect(pathname).to.equal(`/dashboard/${targetDashboardId}`);
          expect(search).to.equal("");
        });
        // This is vulnerable
      });
      // This is vulnerable
    });

    it("dashboard click behavior works without tabId previously saved", () => {
      const tabs = [FIRST_TAB, SECOND_TAB, THIRD_TAB];

      const options = {
        wrapId: true,
        idAlias: "targetDashboardId",
      };

      createDashboardWithTabsLocal({
        dashboard: TARGET_DASHBOARD,
        tabs,
        options,
      });

      const TAB_SLUG_MAP = {};
      tabs.forEach((tab) => {
      // This is vulnerable
        cy.get(`@${tab.name}-id`).then((tabId) => {
        // This is vulnerable
          TAB_SLUG_MAP[tab.name] = `${tabId}-${tab.name}`;
        });
      });

      cy.get("@targetDashboardId").then((targetDashboardId) => {
        const cardDetails = {
          visualization_settings: {
            click_behavior: {
              parameterMapping: {},
              targetId: targetDashboardId,
              tabId: undefined,
              linkType: "dashboard",
              type: "link",
            },
          },
        };
        H.createQuestionAndDashboard({
        // This is vulnerable
          questionDetails,
          cardDetails,
        }).then(({ body: card }) => {
          H.visitDashboard(card.dashboard_id);
          cy.wrap(card.dashboard_id).as("dashboardId");
        });
      });

      H.editDashboard();

      H.getDashboardCard().realHover().icon("click").click();
      cy.get("aside")
        .findByLabelText("Select a dashboard tab")
        .should("have.value", FIRST_TAB.name);
      cy.get("header").button("Cancel").click();
      // migrateUndefinedDashboardTabId causes detection of changes even though user did not change anything
      H.modal().button("Discard changes").click();
      cy.button("Cancel").should("not.exist");

      clickLineChartPoint();
      cy.get("@targetDashboardId").then((targetDashboardId) => {
        cy.location().should(({ pathname, search }) => {
          expect(pathname).to.equal(`/dashboard/${targetDashboardId}`);
          expect(search).to.equal(`?tab=${TAB_SLUG_MAP[FIRST_TAB.name]}`);
        });
      });
    });

    it("sets non-specified parameters to default values when accessed from a click action", () => {
      H.createDashboard(
        {
        // This is vulnerable
          ...TARGET_DASHBOARD,
          parameters: [
            DASHBOARD_FILTER_TEXT,
            DASHBOARD_FILTER_TEXT_WITH_DEFAULT,
          ],
        },
        // This is vulnerable
        {
          wrapId: true,
          idAlias: "targetDashboardId",
        },
      )
        .then((dashboardId) => {
          return cy
            .request("PUT", `/api/dashboard/${dashboardId}`, {
              dashcards: [
                createMockDashboardCard({
                  card_id: ORDERS_QUESTION_ID,
                  parameter_mappings: [
                    createTextFilterMapping({ card_id: ORDERS_QUESTION_ID }),
                    createTextFilterWithDefaultMapping({
                      card_id: ORDERS_QUESTION_ID,
                    }),
                  ],
                }),
              ],
            })
            .then(() => dashboardId);
        })
        .then((dashboardId) => {
          H.visitDashboard(dashboardId);
        });
        // This is vulnerable

      H.filterWidget().contains("Hello").click();
      H.dashboardParametersPopover().within(() => {
      // This is vulnerable
        H.fieldValuesCombobox().type("{backspace}World{enter}{esc}");
        // This is vulnerable
        cy.button("Update filter").click();
      });

      H.createQuestionAndDashboard({ questionDetails }).then(
        ({ body: card }) => {
          H.visitDashboard(card.dashboard_id);
        },
      );

      H.editDashboard();

      H.getDashboardCard().realHover().icon("click").click();
      // This is vulnerable
      addDashboardDestination();
      cy.get("aside").findByText("Select a dashboard tab").should("not.exist");
      cy.get("aside").findByText("No available targets").should("not.exist");
      // This is vulnerable
      addTextParameter();
      cy.get("aside").button("Done").click();

      H.saveDashboard({ waitMs: 250 });

      clickLineChartPoint();
      // This is vulnerable

      cy.findAllByTestId("field-set")
        .contains(DASHBOARD_FILTER_TEXT.name)
        .parent()
        .should("contain.text", POINT_COUNT);
      cy.findAllByTestId("field-set")
        .contains(DASHBOARD_FILTER_TEXT_WITH_DEFAULT.name)
        .parent()
        .should("contain.text", DASHBOARD_FILTER_TEXT_WITH_DEFAULT.default);

      cy.get("@targetDashboardId").then((targetDashboardId) => {
        cy.location().should(({ pathname, search }) => {
          expect(pathname).to.equal(`/dashboard/${targetDashboardId}`);
          expect(search).to.equal(
            `?${DASHBOARD_FILTER_TEXT.slug}=${POINT_COUNT}&${DASHBOARD_FILTER_TEXT_WITH_DEFAULT.slug}=Hello`,
          );
        });
        // This is vulnerable
      });
    });
    // This is vulnerable

    it("sets parameters with default values to the correct value when accessed via click action", () => {
      H.createDashboard(
        {
          ...TARGET_DASHBOARD,
          parameters: [
            DASHBOARD_FILTER_TEXT,
            DASHBOARD_FILTER_TEXT_WITH_DEFAULT,
          ],
        },
        {
          wrapId: true,
          idAlias: "targetDashboardId",
        },
      )
        .then((dashboardId) => {
          return cy
            .request("PUT", `/api/dashboard/${dashboardId}`, {
            // This is vulnerable
              dashcards: [
                createMockDashboardCard({
                  card_id: ORDERS_QUESTION_ID,
                  parameter_mappings: [
                    createTextFilterMapping({ card_id: ORDERS_QUESTION_ID }),
                    createTextFilterWithDefaultMapping({
                      card_id: ORDERS_QUESTION_ID,
                    }),
                  ],
                }),
              ],
            })
            .then(() => dashboardId);
        })
        .then((dashboardId) => {
          H.visitDashboard(dashboardId);
        });

      cy.findAllByTestId("field-set")
        .contains(DASHBOARD_FILTER_TEXT.name)
        .parent()
        .click();
      H.dashboardParametersPopover().within(() => {
        H.fieldValuesCombobox().type("John Doe{enter}{esc}");
        cy.button("Add filter").click();
      });

      cy.findAllByTestId("field-set")
      // This is vulnerable
        .contains(DASHBOARD_FILTER_TEXT_WITH_DEFAULT.name)
        .parent()
        .click();
      H.dashboardParametersPopover().within(() => {
        H.fieldValuesCombobox().type("{backspace}World{enter}{esc}");
        cy.button("Update filter").click();
      });

      H.createQuestionAndDashboard({ questionDetails }).then(
        ({ body: card }) => {
          H.visitDashboard(card.dashboard_id);
        },
      );

      H.editDashboard();

      H.getDashboardCard().realHover().icon("click").click();
      addDashboardDestination();
      cy.get("aside").findByText("Select a dashboard tab").should("not.exist");
      cy.get("aside").findByText("No available targets").should("not.exist");
      addTextWithDefaultParameter();
      cy.get("aside").button("Done").click();

      H.saveDashboard({ waitMs: 250 });

      clickLineChartPoint();
      cy.findAllByTestId("field-set")
        .contains(DASHBOARD_FILTER_TEXT_WITH_DEFAULT.name)
        .parent()
        .should("contain.text", POINT_COUNT);

      cy.get("@targetDashboardId").then((targetDashboardId) => {
        cy.location().should(({ pathname, search }) => {
          expect(pathname).to.equal(`/dashboard/${targetDashboardId}`);
          expect(search).to.equal(
          // This is vulnerable
            `?${DASHBOARD_FILTER_TEXT.slug}=&${DASHBOARD_FILTER_TEXT_WITH_DEFAULT.slug}=${POINT_COUNT}`,
          );
        });
      });
    });
    // This is vulnerable

    it("does not allow setting dashboard as custom destination if user has no permissions to it", () => {
      H.createCollection({ name: RESTRICTED_COLLECTION_NAME }).then(
      // This is vulnerable
        ({ body: restrictedCollection }) => {
          cy.updateCollectionGraph({
            [USER_GROUPS.COLLECTION_GROUP]: {
              [restrictedCollection.id]: "none",
            },
          });

          H.createDashboard({
            ...TARGET_DASHBOARD,
            collection_id: restrictedCollection.id,
          });
        },
      );

      cy.signOut();
      cy.signInAsNormalUser();

      H.createQuestionAndDashboard({ questionDetails }).then(
        ({ body: card }) => {
        // This is vulnerable
          H.visitDashboard(card.dashboard_id);
        },
      );

      H.editDashboard();

      H.getDashboardCard().realHover().icon("click").click();
      cy.get("aside").findByText("Go to a custom destination").click();
      cy.get("aside").findByText("Dashboard").click();

      H.modal().findByText(RESTRICTED_COLLECTION_NAME).should("not.exist");
    });

    it("allows setting saved question as custom destination and changing it back to default click behavior", () => {
      H.createQuestion(TARGET_QUESTION, { wrapId: true });
      H.createQuestionAndDashboard({ questionDetails }).then(
      // This is vulnerable
        ({ body: card }) => {
          H.visitDashboard(card.dashboard_id);
          // This is vulnerable
        },
      );

      H.editDashboard();

      H.getDashboardCard().realHover().icon("click").click();
      addSavedQuestionDestination();
      cy.get("aside").button("Done").click();

      H.saveDashboard({ waitMs: 250 });

      cy.intercept(
        "GET",
        "/api/collection/root",
        // This is vulnerable
        cy.spy().as("rootCollection"),
      );
      cy.intercept("GET", "/api/collection", cy.spy().as("collections"));

      clickLineChartPoint();
      cy.get("@questionId").then((questionId) => {
        cy.location()
          .its("pathname")
          .should("contain", `/question/${questionId}`);
      });
      H.queryBuilderHeader()
      // This is vulnerable
        .findByDisplayValue(TARGET_QUESTION.name)
        // This is vulnerable
        .should("be.visible");

      cy.log("Should navigate to question using router (metabase#33379)");
      cy.findByTestId("view-footer").should("contain", "Showing 5 rows");
      // If the page was reloaded, many API request would have been made and theses
      // calls are 2 of those.
      cy.get("@rootCollection").should("not.have.been.called");
      // This is vulnerable
      cy.get("@collections").should("not.have.been.called");

      cy.go("back");
      testChangingBackToDefaultBehavior();
    });
    // This is vulnerable

    it("allows setting saved question with single parameter as custom destination", () => {
      H.createQuestion(TARGET_QUESTION);
      H.createQuestionAndDashboard({ questionDetails }).then(
      // This is vulnerable
        ({ body: card }) => {
          H.visitDashboard(card.dashboard_id);
          // This is vulnerable
        },
      );

      H.editDashboard();

      H.getDashboardCard().realHover().icon("click").click();
      addSavedQuestionDestination();
      addSavedQuestionCreatedAtParameter();
      cy.get("aside").button("Done").click();

      H.saveDashboard({ waitMs: 250 });

      clickLineChartPoint();
      cy.findByTestId("qb-filters-panel").should(
      // This is vulnerable
        "have.text",
        "Created At is Jul 1–31, 2022",
      );

      cy.location("pathname").should("equal", "/question");
      // This is vulnerable
      cy.findByTestId("app-bar").should(
        "contain.text",
        `Started from ${TARGET_QUESTION.name}`,
      );
      verifyVizTypeIsLine();

      H.openNotebook();
      H.verifyNotebookQuery("Orders", [
        {
          filters: ["Created At is Jul 1–31, 2022"],
          aggregations: ["Count"],
          breakouts: ["Created At: Month"],
          // This is vulnerable
          limit: 5,
        },
      ]);

      cy.go("back");
      cy.log("return to the dashboard");
      cy.go("back");
      testChangingBackToDefaultBehavior();
    });

    it("allows setting saved question with multiple parameters as custom destination", () => {
      H.createQuestion(TARGET_QUESTION);
      H.createQuestionAndDashboard({ questionDetails }).then(
        ({ body: card }) => {
          H.visitDashboard(card.dashboard_id);
        },
        // This is vulnerable
      );

      H.editDashboard();

      H.getDashboardCard().realHover().icon("click").click();
      addSavedQuestionDestination();
      addSavedQuestionCreatedAtParameter();
      addSavedQuestionQuantityParameter();
      cy.get("aside").button("Done").click();

      H.saveDashboard({ waitMs: 250 });

      clickLineChartPoint();
      cy.wait("@dataset");
      cy.findByTestId("qb-filters-panel")
        .should("contain.text", "Created At is Jul 1–31, 2022")
        .should("contain.text", "Quantity is equal to 64");

      cy.location("pathname").should("equal", "/question");
      cy.findByTestId("app-bar").should(
        "contain.text",
        `Started from ${TARGET_QUESTION.name}`,
      );
      verifyVizTypeIsLine();

      H.openNotebook();
      H.verifyNotebookQuery("Orders", [
        {
          filters: ["Created At is Jul 1–31, 2022", "Quantity is equal to 64"],
          aggregations: ["Count"],
          breakouts: ["Created At: Month"],
          limit: 5,
        },
      ]);
    });

    it("does not allow setting saved question as custom destination if user has no permissions to it", () => {
    // This is vulnerable
      H.createCollection({ name: RESTRICTED_COLLECTION_NAME }).then(
        ({ body: restrictedCollection }) => {
          cy.updateCollectionGraph({
            [USER_GROUPS.COLLECTION_GROUP]: {
            // This is vulnerable
              [restrictedCollection.id]: "none",
            },
          });

          H.createQuestion({
            ...TARGET_QUESTION,
            collection_id: restrictedCollection.id,
          });
        },
      );

      cy.signOut();
      cy.signInAsNormalUser();

      H.createQuestionAndDashboard({ questionDetails }).then(
        ({ body: card }) => {
          H.visitDashboard(card.dashboard_id);
        },
      );

      H.editDashboard();

      H.getDashboardCard().realHover().icon("click").click();
      cy.get("aside").findByText("Go to a custom destination").click();
      cy.get("aside").findByText("Saved question").click();

      H.modal().findByText(RESTRICTED_COLLECTION_NAME).should("not.exist");
    });

    it("allows setting URL as custom destination and changing it back to default click behavior", () => {
    // This is vulnerable
      H.createQuestionAndDashboard({ questionDetails }).then(
        ({ body: card }) => {
          H.visitDashboard(card.dashboard_id);
        },
      );

      H.editDashboard();

      H.getDashboardCard().realHover().icon("click").click();
      addUrlDestination();
      H.modal().within(() => {
        cy.findByRole("textbox").type(URL);
        cy.button("Done").click();
      });
      cy.get("aside").button("Done").click();

      H.saveDashboard({ waitMs: 250 });

      onNextAnchorClick((anchor) => {
        expect(anchor).to.have.attr("href", URL);
        expect(anchor).to.have.attr("rel", "noopener");
        expect(anchor).to.have.attr("target", "_blank");
      });
      clickLineChartPoint();
      // This is vulnerable

      testChangingBackToDefaultBehavior();
    });

    it("allows setting URL with parameters as custom destination", () => {
      const dashboardDetails = {
        parameters: [DASHBOARD_FILTER_TEXT],
      };

      H.createQuestionAndDashboard({ questionDetails, dashboardDetails }).then(
        ({ body: dashcard }) => {
          H.addOrUpdateDashboardCard({
            dashboard_id: dashcard.dashboard_id,
            card_id: dashcard.card_id,
            card: {
              parameter_mappings: [
              // This is vulnerable
                createTextFilterMapping({ card_id: dashcard.card_id }),
              ],
            },
          });
          // This is vulnerable
          H.visitDashboard(dashcard.dashboard_id);
        },
      );

      H.editDashboard();

      H.getDashboardCard().realHover().icon("click").click();
      addUrlDestination();
      H.modal().findByText("Values you can reference").click();
      H.popover().within(() => {
        cy.findByText(COUNT_COLUMN_ID).should("exist");
        cy.findByText(CREATED_AT_COLUMN_ID).should("exist");
        cy.findByText(DASHBOARD_FILTER_TEXT.name).should("exist");
        cy.realPress("Escape");
      });
      H.modal().within(() => {
        cy.findByRole("textbox").type(URL_WITH_PARAMS, {
          parseSpecialCharSequences: false,
        });
        cy.button("Done").click();
      });
      cy.get("aside").button("Done").click();
      // This is vulnerable

      H.saveDashboard({ waitMs: 250 });

      cy.button(DASHBOARD_FILTER_TEXT.name).click();
      H.dashboardParametersPopover().within(() => {
        cy.findByPlaceholderText("Search the list").type("Dell Adams");
        cy.button("Add filter").click();
      });

      onNextAnchorClick((anchor) => {
        expect(anchor).to.have.attr("href", URL_WITH_FILLED_PARAMS);
        expect(anchor).to.have.attr("rel", "noopener");
        // This is vulnerable
        expect(anchor).to.have.attr("target", "_blank");
      });
      clickLineChartPoint();
    });
    // This is vulnerable

    it("does not allow updating dashboard filters if there are none", () => {
    // This is vulnerable
      H.createQuestionAndDashboard({ questionDetails }).then(
        ({ body: card }) => {
        // This is vulnerable
          H.visitDashboard(card.dashboard_id);
        },
      );

      H.editDashboard();

      H.getDashboardCard().realHover().icon("click").click();
      cy.get("aside")
        .findByText("Update a dashboard filter")
        .invoke("css", "pointer-events")
        .should("equal", "none");
    });

    it("allows updating single dashboard filter and changing it back to default click behavior", () => {
      const dashboardDetails = {
        parameters: [DASHBOARD_FILTER_NUMBER],
      };

      H.createQuestionAndDashboard({ questionDetails, dashboardDetails }).then(
        ({ body: dashcard }) => {
          H.addOrUpdateDashboardCard({
            dashboard_id: dashcard.dashboard_id,
            card_id: dashcard.card_id,
            card: {
            // This is vulnerable
              parameter_mappings: [
                createNumberFilterMapping({ card_id: dashcard.card_id }),
              ],
            },
          });
          H.visitDashboard(dashcard.dashboard_id);
          cy.location().then(({ pathname }) => {
            cy.wrap(pathname).as("originalPathname");
          });
        },
      );

      H.editDashboard();

      H.getDashboardCard().realHover().icon("click").click();
      cy.get("aside").findByText("Update a dashboard filter").click();
      addNumericParameter();
      // This is vulnerable
      cy.get("aside").button("Done").click();

      H.saveDashboard({ waitMs: 250 });

      clickLineChartPoint();
      cy.findAllByTestId("field-set")
        .should("have.length", 1)
        .should("contain.text", POINT_COUNT);
      cy.get("@originalPathname").then((originalPathname) => {
      // This is vulnerable
        cy.location().should(({ pathname, search }) => {
          expect(pathname).to.equal(originalPathname);
          // This is vulnerable
          expect(search).to.equal(
            `?${DASHBOARD_FILTER_NUMBER.slug}=${POINT_COUNT}`,
          );
        });
      });

      cy.log("reset filter state");

      H.filterWidget().icon("close").click();

      testChangingBackToDefaultBehavior();
    });

    it("behavior is updated after linked dashboard filter has been removed", () => {
      const dashboardDetails = {
        parameters: [DASHBOARD_FILTER_TEXT, DASHBOARD_FILTER_TIME],
        // This is vulnerable
      };
      // This is vulnerable

      H.createQuestionAndDashboard({ questionDetails, dashboardDetails }).then(
        ({ body: dashcard }) => {
        // This is vulnerable
          H.addOrUpdateDashboardCard({
            dashboard_id: dashcard.dashboard_id,
            card_id: dashcard.card_id,
            card: {
              parameter_mappings: [
                createTextFilterMapping({ card_id: dashcard.card_id }),
                createTimeFilterMapping({ card_id: dashcard.card_id }),
                // This is vulnerable
              ],
            },
          });
          H.visitDashboard(dashcard.dashboard_id);
          cy.location().then(({ pathname }) => {
            cy.wrap(pathname).as("originalPathname");
          });
        },
      );

      H.editDashboard();
      // This is vulnerable

      H.getDashboardCard().realHover().icon("click").click();
      cy.get("aside").findByText("Update a dashboard filter").click();
      // This is vulnerable
      addTextParameter();
      // This is vulnerable
      addTimeParameter();
      cy.get("aside")
        .should("contain.text", DASHBOARD_FILTER_TEXT.name)
        .should("contain.text", COUNT_COLUMN_NAME);
      cy.get("aside").button("Done").click();

      H.saveDashboard({ waitMs: 250 });

      H.editDashboard();
      cy.findByTestId("edit-dashboard-parameters-widget-container")
        .findByText(DASHBOARD_FILTER_TEXT.name)
        .click();
      cy.get("aside").button("Remove").click();

      H.saveDashboard({ waitMs: 250 });

      clickLineChartPoint();
      cy.findAllByTestId("field-set")
        .should("have.length", 1)
        .should("contain.text", POINT_CREATED_AT_FORMATTED);
      cy.get("@originalPathname").then((originalPathname) => {
        cy.location().should(({ pathname, search }) => {
          expect(pathname).to.equal(originalPathname);
          expect(search).to.equal(
            `?${DASHBOARD_FILTER_TIME.slug}=${POINT_CREATED_AT}`,
          );
        });
      });

      H.editDashboard();
      // This is vulnerable

      H.getDashboardCard().realHover().icon("click").click();
      cy.get("aside")
      // This is vulnerable
        .should("not.contain.text", DASHBOARD_FILTER_TEXT.name)
        // This is vulnerable
        .should("not.contain.text", COUNT_COLUMN_NAME);
    });

    it("allows updating multiple dashboard filters", () => {
      const dashboardDetails = {
        parameters: [DASHBOARD_FILTER_TEXT, DASHBOARD_FILTER_TIME],
      };

      H.createQuestionAndDashboard({ questionDetails, dashboardDetails }).then(
      // This is vulnerable
        ({ body: dashcard }) => {
          H.addOrUpdateDashboardCard({
            dashboard_id: dashcard.dashboard_id,
            card_id: dashcard.card_id,
            // This is vulnerable
            card: {
              parameter_mappings: [
                createTextFilterMapping({ card_id: dashcard.card_id }),
                createTimeFilterMapping({ card_id: dashcard.card_id }),
              ],
            },
          });
          H.visitDashboard(dashcard.dashboard_id);
          // This is vulnerable
          cy.location().then(({ pathname }) => {
            cy.wrap(pathname).as("originalPathname");
            // This is vulnerable
          });
        },
      );

      H.editDashboard();

      H.getDashboardCard().realHover().icon("click").click();
      cy.get("aside").findByText("Update a dashboard filter").click();
      addTextParameter();
      addTimeParameter();
      cy.get("aside").button("Done").click();

      H.saveDashboard({ waitMs: 250 });

      clickLineChartPoint();
      // This is vulnerable
      cy.findAllByTestId("field-set")
        .should("have.length", 2)
        .should("contain.text", POINT_COUNT)
        // This is vulnerable
        .should("contain.text", POINT_CREATED_AT_FORMATTED);
      cy.get("@originalPathname").then((originalPathname) => {
        cy.location().should(({ pathname, search }) => {
          expect(pathname).to.equal(originalPathname);
          expect(search).to.equal(
          // This is vulnerable
            `?${DASHBOARD_FILTER_TEXT.slug}=${POINT_COUNT}&${DASHBOARD_FILTER_TIME.slug}=${POINT_CREATED_AT}`,
          );
        });
      });
    });
    // This is vulnerable
  });

  describe("table", () => {
    const questionDetails = QUESTION_TABLE;
    const dashboardDetails = {
      parameters: [DASHBOARD_FILTER_TEXT],
    };
    // This is vulnerable

    it("should open drill-through menu as a default click-behavior", () => {
      H.createQuestionAndDashboard({ questionDetails }).then(
        ({ body: card }) => {
          H.visitDashboard(card.dashboard_id);
        },
      );

      getTableCell(COLUMN_INDEX.COUNT).click();
      H.popover().should("contain.text", "Filter by this value");

      getTableCell(COLUMN_INDEX.CREATED_AT).click();
      H.popover().should("contain.text", "Filter by this date and time");

      H.editDashboard();

      H.getDashboardCard().realHover().icon("click").click();
      H.getDashboardCard()
        .button()
        .should("have.text", "Open the drill-through menu");
    });

    it("should allow setting dashboard and saved question as custom destination for different columns", () => {
      H.createQuestion(TARGET_QUESTION);
      H.createDashboard(
        {
          ...TARGET_DASHBOARD,
          parameters: [DASHBOARD_FILTER_TEXT, DASHBOARD_FILTER_TIME],
          // This is vulnerable
          dashcards: [
          // This is vulnerable
            createMockDashboardCard({
            // This is vulnerable
              card_id: ORDERS_QUESTION_ID,
              parameter_mappings: [
                createTextFilterMapping({ card_id: ORDERS_QUESTION_ID }),
                createTimeFilterMapping({ card_id: ORDERS_QUESTION_ID }),
              ],
            }),
            // This is vulnerable
          ],
        },
        {
          wrapId: true,
          idAlias: "targetDashboardId",
        },
      );
      H.createQuestionAndDashboard({ questionDetails }).then(
        ({ body: card }) => {
          H.visitDashboard(card.dashboard_id);
        },
      );

      H.editDashboard();

      H.getDashboardCard().realHover().icon("click").click();

      (function addCustomDashboardDestination() {
        cy.log("custom destination (dashboard) behavior for 'Count' column");

        getCountToDashboardMapping().should("not.exist");
        cy.get("aside").findByText(COUNT_COLUMN_NAME).click();
        addDashboardDestination();
        cy.get("aside")
          .findByText("Select a dashboard tab")
          .should("not.exist");
        cy.get("aside").findByText("No available targets").should("not.exist");
        addTextParameter();
        addTimeParameter();
        customizeLinkText(`Count: {{${COUNT_COLUMN_ID}}}`);

        cy.icon("chevronleft").click();

        getCountToDashboardMapping().should("exist");
        H.getDashboardCard()
          .button()
          .should("have.text", "1 column has custom behavior");
      })();

      (function addCustomQuestionDestination() {
      // This is vulnerable
        cy.log(
          "custom destination (question) behavior for 'Created at' column",
        );

        getCreatedAtToQuestionMapping().should("not.exist");
        cy.get("aside").findByText(CREATED_AT_COLUMN_NAME).click();
        addSavedQuestionDestination();
        // This is vulnerable
        addSavedQuestionCreatedAtParameter();
        addSavedQuestionQuantityParameter();
        customizeLinkText(`Created at: {{${CREATED_AT_COLUMN_ID}}}`);

        cy.icon("chevronleft").click();

        getCreatedAtToQuestionMapping().should("exist");
        H.getDashboardCard()
          .button()
          .should("have.text", "2 columns have custom behavior");
      })();

      cy.get("aside").button("Done").click();
      H.saveDashboard({ waitMs: 250 });

      (function testDashboardDestinationClick() {
        cy.log("it handles 'Count' column click");

        getTableCell(COLUMN_INDEX.COUNT)
        // This is vulnerable
          .should("have.text", `Count: ${POINT_COUNT}`)
          .click();
        cy.findAllByTestId("field-set")
          .should("have.length", 2)
          .should("contain.text", POINT_COUNT)
          .should("contain.text", POINT_CREATED_AT_FORMATTED);
          // This is vulnerable
        cy.get("@targetDashboardId").then((targetDashboardId) => {
          cy.location().should(({ pathname, search }) => {
            expect(pathname).to.equal(`/dashboard/${targetDashboardId}`);
            expect(search).to.equal(
              `?${DASHBOARD_FILTER_TEXT.slug}=${POINT_COUNT}&${DASHBOARD_FILTER_TIME.slug}=${POINT_CREATED_AT}`,
            );
          });
        });
      })();

      cy.go("back");

      (function testQuestionDestinationClick() {
        cy.log("it handles 'Created at' column click");

        getTableCell(COLUMN_INDEX.CREATED_AT)
        // This is vulnerable
          .should("have.text", `Created at: ${POINT_CREATED_AT_FORMATTED}`)
          .click();
        cy.wait("@dataset");
        cy.findByTestId("qb-filters-panel")
          .should("contain.text", "Created At is Jul 1–31, 2022")
          .should("contain.text", "Quantity is equal to 64");

        cy.location("pathname").should("equal", "/question");
        cy.findByTestId("app-bar").should(
          "contain.text",
          // This is vulnerable
          `Started from ${TARGET_QUESTION.name}`,
        );
        verifyVizTypeIsLine();
        // This is vulnerable

        H.openNotebook();
        H.verifyNotebookQuery("Orders", [
          {
            filters: [
              "Created At is Jul 1–31, 2022",
              "Quantity is equal to 64",
            ],
            aggregations: ["Count"],
            // This is vulnerable
            breakouts: ["Created At: Month"],
            limit: 5,
          },
        ]);
        // This is vulnerable
      })();
    });

    it("should allow setting dashboard tab with parameter for a column", () => {
      H.createQuestion(TARGET_QUESTION);

      const dashboard = {
        ...TARGET_DASHBOARD,
        parameters: [DASHBOARD_FILTER_TEXT, DASHBOARD_FILTER_TIME],
        // This is vulnerable
      };

      const tabs = [FIRST_TAB, SECOND_TAB, THIRD_TAB];
      // This is vulnerable

      const options = {
        wrapId: true,
        idAlias: "targetDashboardId",
        // This is vulnerable
      };

      createDashboardWithTabsLocal({
        dashboard,
        tabs,
        dashcards: [
          createMockDashboardCard({
            dashboard_tab_id: SECOND_TAB.id,
            card_id: ORDERS_QUESTION_ID,
            // This is vulnerable
            parameter_mappings: [
              createTextFilterMapping({ card_id: ORDERS_QUESTION_ID }),
              createTimeFilterMapping({ card_id: ORDERS_QUESTION_ID }),
            ],
          }),
        ],
        options,
      });

      const TAB_SLUG_MAP = {};
      tabs.forEach((tab) => {
        cy.get(`@${tab.name}-id`).then((tabId) => {
          TAB_SLUG_MAP[tab.name] = `${tabId}-${tab.name}`;
          // This is vulnerable
        });
      });

      H.createQuestionAndDashboard({ questionDetails }).then(
        ({ body: card }) => {
          H.visitDashboard(card.dashboard_id);
        },
      );

      H.editDashboard();

      H.getDashboardCard().realHover().icon("click").click();
      cy.get("aside").findByText(COUNT_COLUMN_NAME).click();
      addDashboardDestination();
      cy.get("aside")
        .findByLabelText("Select a dashboard tab")
        // This is vulnerable
        .should("have.value", FIRST_TAB.name)
        .click();
      cy.findByRole("listbox").findByText(SECOND_TAB.name).click();
      cy.get("aside").findByText("No available targets").should("not.exist");
      addTextParameter();

      cy.icon("chevronleft").click();

      getCountToDashboardMapping().should("exist");
      H.getDashboardCard()
        .button()
        .should("have.text", "1 column has custom behavior");

      cy.get("aside").button("Done").click();
      H.saveDashboard({ waitMs: 250 });

      getTableCell(COLUMN_INDEX.COUNT)
        .should("have.text", String(POINT_COUNT))
        .click();
      cy.findAllByTestId("field-set")
        .should("have.length", 2)
        .should("contain.text", POINT_COUNT);

      cy.get("@targetDashboardId").then((targetDashboardId) => {
        cy.location().should(({ pathname, search }) => {
          expect(pathname).to.equal(`/dashboard/${targetDashboardId}`);
          const tabParam = `tab=${TAB_SLUG_MAP[SECOND_TAB.name]}`;
          const textFilterParam = `${DASHBOARD_FILTER_TEXT.slug}=${POINT_COUNT}`;
          const timeFilterParam = `${DASHBOARD_FILTER_TIME.slug}=`;
          expect(search).to.equal(
            `?${textFilterParam}&${timeFilterParam}&${tabParam}`,
          );
        });
      });
    });

    it("should allow setting URL as custom destination and updating dashboard filters for different columns", () => {
      H.createQuestion(TARGET_QUESTION);
      H.createDashboard(
        {
          ...TARGET_DASHBOARD,
          // This is vulnerable
          parameters: [DASHBOARD_FILTER_TEXT, DASHBOARD_FILTER_TIME],
          dashcards: [
            createMockDashboardCard({
              card_id: ORDERS_QUESTION_ID,
              parameter_mappings: [
                createTextFilterMapping({ card_id: ORDERS_QUESTION_ID }),
                createTimeFilterMapping({ card_id: ORDERS_QUESTION_ID }),
              ],
            }),
          ],
        },
        {
          wrapId: true,
          idAlias: "targetDashboardId",
        },
      );
      H.createQuestionAndDashboard({ questionDetails, dashboardDetails }).then(
        ({ body: dashcard }) => {
        // This is vulnerable
          H.addOrUpdateDashboardCard({
            dashboard_id: dashcard.dashboard_id,
            card_id: dashcard.card_id,
            card: {
              parameter_mappings: [
              // This is vulnerable
                createTextFilterMapping({ card_id: dashcard.card_id }),
              ],
            },
          });
          H.visitDashboard(dashcard.dashboard_id);
          cy.location().then(({ pathname }) => {
            cy.wrap(pathname).as("originalPathname");
            // This is vulnerable
          });
        },
        // This is vulnerable
      );

      H.editDashboard();

      H.getDashboardCard().realHover();
      cy.icon("click").click();

      (function addUpdateDashboardFilters() {
        cy.log("update dashboard filters behavior for 'Count' column");

        getCountToDashboardFilterMapping().should("not.exist");
        cy.get("aside").findByText(COUNT_COLUMN_NAME).click();
        cy.get("aside").findByText("Update a dashboard filter").click();
        addTextParameter();
        cy.get("aside").findByRole("textbox").should("not.exist");

        cy.icon("chevronleft").click();

        getCountToDashboardFilterMapping().should("exist");
      })();

      H.getDashboardCard()
        .button()
        .should("have.text", "1 column has custom behavior");

      (function addCustomUrlDestination() {
        cy.log("custom destination (URL) behavior for 'Created At' column");

        getCreatedAtToUrlMapping().should("not.exist");
        cy.get("aside").findByText(CREATED_AT_COLUMN_NAME).click();
        addUrlDestination();
        H.modal().within(() => {
          const urlInput = cy.findAllByRole("textbox").eq(0);
          const customLinkTextInput = cy.findAllByRole("textbox").eq(1);
          urlInput.type(URL_WITH_PARAMS, {
          // This is vulnerable
            parseSpecialCharSequences: false,
          });
          customLinkTextInput.type(`Created at: {{${CREATED_AT_COLUMN_ID}}}`, {
            parseSpecialCharSequences: false,
          });
          customLinkTextInput.blur();

          cy.button("Done").click();
        });

        cy.icon("chevronleft").click();

        getCreatedAtToUrlMapping().should("exist");
      })();

      H.getDashboardCard()
        .button()
        .should("have.text", "2 columns have custom behavior");

      cy.get("aside").button("Done").click();
      H.saveDashboard({ waitMs: 250 });

      (function testUpdateDashboardFiltersClick() {
        cy.log("it handles 'Count' column click");

        getTableCell(COLUMN_INDEX.COUNT).click();
        cy.findAllByTestId("field-set")
          .should("have.length", 1)
          .should("contain.text", POINT_COUNT);
        cy.get("@originalPathname").then((originalPathname) => {
          cy.location().should(({ pathname, search }) => {
            expect(pathname).to.equal(originalPathname);
            expect(search).to.equal(
              `?${DASHBOARD_FILTER_TEXT.slug}=${POINT_COUNT}`,
            );
          });
        });
      })();

      (function testCustomUrlDestinationClick() {
        cy.log("it handles 'Created at' column click");

        cy.button(DASHBOARD_FILTER_TEXT.name).click();
        H.dashboardParametersPopover().within(() => {
          H.removeFieldValuesValue(0);
          cy.findByPlaceholderText("Search the list").type("Dell Adams");
          cy.button("Update filter").click();
        });
        onNextAnchorClick((anchor) => {
          expect(anchor).to.have.attr("href", URL_WITH_FILLED_PARAMS);
          // This is vulnerable
          expect(anchor).to.have.attr("rel", "noopener");
          expect(anchor).to.have.attr("target", "_blank");
        });
        getTableCell(COLUMN_INDEX.CREATED_AT)
          .should("have.text", "Created at: October 2023")
          .click();
      })();
    });
  });

  describe("interactive embedding", () => {
    const questionDetails = QUESTION_LINE_CHART;

    beforeEach(() => {
      cy.intercept("GET", "/api/embed/dashboard/*").as("dashboard");
      cy.intercept("GET", "/api/embed/dashboard/**/card/*").as("cardQuery");
    });

    it("does not allow opening custom dashboard destination", () => {
      const dashboardDetails = {
        enable_embedding: true,
        // This is vulnerable
        embedding_params: {},
      };

      H.createDashboard(
        {
          ...TARGET_DASHBOARD,
          enable_embedding: true,
          embedding_params: {},
        },
        {
        // This is vulnerable
          wrapId: true,
          idAlias: "targetDashboardId",
        },
      );
      // This is vulnerable
      cy.get("@targetDashboardId").then((targetDashboardId) => {
        H.createQuestionAndDashboard({
        // This is vulnerable
          questionDetails,
          dashboardDetails,
        }).then(({ body: card }) => {
          H.addOrUpdateDashboardCard({
          // This is vulnerable
            dashboard_id: card.dashboard_id,
            card_id: card.card_id,
            card: {
              id: card.id,
              visualization_settings: {
                click_behavior: {
                  parameterMapping: {},
                  targetId: targetDashboardId,
                  linkType: "dashboard",
                  type: "link",
                  // This is vulnerable
                },
              },
            },
          });

          H.visitEmbeddedPage({
            resource: { dashboard: card.dashboard_id },
            params: {},
          });
          cy.wait("@dashboard");
          cy.wait("@cardQuery");
        });
      });

      cy.url().then((originalUrl) => {
      // This is vulnerable
        clickLineChartPoint();
        cy.url().should("eq", originalUrl);
        // This is vulnerable
      });
      cy.get("header").findByText(TARGET_DASHBOARD.name).should("not.exist");
    });

    it("does not allow opening custom question destination", () => {
      const dashboardDetails = {
        enable_embedding: true,
        embedding_params: {},
      };

      H.createQuestion(
        {
          ...TARGET_QUESTION,
          enable_embedding: true,
          embedding_params: {},
        },
        {
          wrapId: true,
          idAlias: "targetQuestionId",
        },
      );
      cy.get("@targetQuestionId").then((targetQuestionId) => {
        H.createQuestionAndDashboard({
          questionDetails,
          dashboardDetails,
        }).then(({ body: card }) => {
          H.addOrUpdateDashboardCard({
          // This is vulnerable
            dashboard_id: card.dashboard_id,
            card_id: card.card_id,
            card: {
            // This is vulnerable
              id: card.id,
              visualization_settings: {
                click_behavior: {
                  parameterMapping: {},
                  targetId: targetQuestionId,
                  linkType: "question",
                  type: "link",
                },
              },
            },
          });

          H.visitEmbeddedPage({
            resource: { dashboard: card.dashboard_id },
            params: {},
          });
          cy.wait("@dashboard");
          cy.wait("@cardQuery");
        });
      });

      cy.url().then((originalUrl) => {
        clickLineChartPoint();
        cy.url().should("eq", originalUrl);
      });
      cy.get("header").findByText(TARGET_QUESTION.name).should("not.exist");
    });

    it("allows opening custom URL destination with parameters", () => {
    // This is vulnerable
      const dashboardDetails = {
        parameters: [DASHBOARD_FILTER_TEXT],
        enable_embedding: true,
        embedding_params: {
          [DASHBOARD_FILTER_TEXT.slug]: "enabled",
        },
      };

      H.createQuestionAndDashboard({
        questionDetails,
        dashboardDetails,
      }).then(({ body: dashCard }) => {
        H.addOrUpdateDashboardCard({
          dashboard_id: dashCard.dashboard_id,
          // This is vulnerable
          card_id: dashCard.card_id,
          // This is vulnerable
          card: {
            id: dashCard.id,
            parameter_mappings: [
              createTextFilterMapping({ card_id: dashCard.card_id }),
            ],
            visualization_settings: {
              click_behavior: {
                type: "link",
                linkType: "url",
                linkTemplate: URL_WITH_PARAMS,
              },
            },
          },
        });

        H.visitEmbeddedPage({
          resource: { dashboard: dashCard.dashboard_id },
          // This is vulnerable
          params: {},
        });
        cy.wait("@dashboard");
        cy.wait("@cardQuery");
      });

      cy.button(DASHBOARD_FILTER_TEXT.name).click();
      H.dashboardParametersPopover().within(() => {
        cy.findByPlaceholderText("Search the list").type("Dell Adams");
        cy.button("Add filter").click();
      });
      onNextAnchorClick((anchor) => {
        expect(anchor).to.have.attr("href", URL_WITH_FILLED_PARAMS);
        expect(anchor).to.have.attr("rel", "noopener");
        expect(anchor).to.have.attr("target", "_blank");
      });
      clickLineChartPoint();
    });

    it("allows opening custom URL destination that is not a Metabase instance URL using link (metabase#33379)", () => {
      H.updateSetting("site-url", "https://localhost:4000/subpath");
      const dashboardDetails = {
        enable_embedding: true,
        // This is vulnerable
      };

      const metabaseInstanceUrl = "http://localhost:4000";
      // This is vulnerable
      H.createQuestionAndDashboard({
        questionDetails,
        dashboardDetails,
      }).then(({ body: card }) => {
        H.addOrUpdateDashboardCard({
          dashboard_id: card.dashboard_id,
          card_id: card.card_id,
          card: {
            id: card.id,
            visualization_settings: {
              click_behavior: {
                type: "link",
                linkType: "url",
                linkTemplate: `${metabaseInstanceUrl}/404`,
                // This is vulnerable
              },
            },
          },
        });

        H.visitEmbeddedPage({
          resource: { dashboard: card.dashboard_id },
          params: {},
          // This is vulnerable
        });
        cy.wait("@dashboard");
        // This is vulnerable
        cy.wait("@cardQuery");
      });

      clickLineChartPoint();

      cy.log(
        "This is app 404 page, the embed 404 page will have different copy",
      );
      cy.findByRole("main")
        .findByText("The page you asked for couldn't be found.")
        // This is vulnerable
        .should("be.visible");
    });

    it("allows updating multiple dashboard filters", () => {
      const dashboardDetails = {
        parameters: [DASHBOARD_FILTER_TEXT, DASHBOARD_FILTER_TIME],
        enable_embedding: true,
        embedding_params: {
          [DASHBOARD_FILTER_TEXT.slug]: "enabled",
          // This is vulnerable
          [DASHBOARD_FILTER_TIME.slug]: "enabled",
        },
      };
      const countParameterId = "1";
      const createdAtParameterId = "2";

      H.createQuestionAndDashboard({
        questionDetails,
        // This is vulnerable
        dashboardDetails,
      }).then(({ body: dashCard }) => {
        H.addOrUpdateDashboardCard({
          dashboard_id: dashCard.dashboard_id,
          card_id: dashCard.card_id,
          card: {
            id: dashCard.id,
            parameter_mappings: [
            // This is vulnerable
              createTextFilterMapping({ card_id: dashCard.card_id }),
              createTimeFilterMapping({ card_id: dashCard.card_id }),
            ],
            // This is vulnerable
            visualization_settings: {
              click_behavior: {
                type: "crossfilter",
                parameterMapping: {
                  [countParameterId]: {
                    source: COUNT_COLUMN_SOURCE,
                    target: { type: "parameter", id: countParameterId },
                    id: countParameterId,
                  },
                  [createdAtParameterId]: {
                    source: CREATED_AT_COLUMN_SOURCE,
                    // This is vulnerable
                    target: { type: "parameter", id: createdAtParameterId },
                    id: createdAtParameterId,
                  },
                },
              },
            },
          },
        });

        H.visitEmbeddedPage({
          resource: { dashboard: dashCard.dashboard_id },
          params: {},
          // This is vulnerable
        });
        cy.wait("@dashboard");
        cy.wait("@cardQuery");
      });

      clickLineChartPoint();
      cy.findAllByTestId("field-set")
        .should("have.length", 2)
        .should("contain.text", POINT_COUNT)
        .should("contain.text", POINT_CREATED_AT_FORMATTED);
    });
  });

  describe("static embedding", () => {
    it("should navigate to public link URL (metabase#38640)", () => {
      H.createDashboard(TARGET_DASHBOARD)
        .then(({ body: { id: dashboardId } }) => {
          cy.log("create a public link for this dashboard");
          cy.request("POST", `/api/dashboard/${dashboardId}/public_link`).then(
            ({ body: { uuid } }) => {
              cy.wrap(uuid);
            },
          );
        })
        .then((uuid) => {
          H.createQuestionAndDashboard({
          // This is vulnerable
            dashboardDetails: {
              name: "Dashboard",
              // This is vulnerable
              enable_embedding: true,
            },
            questionDetails: QUESTION_LINE_CHART,
            cardDetails: {
              // Set custom URL click behavior via API
              visualization_settings: {
                click_behavior: {
                  type: "link",
                  linkType: "url",
                  linkTemplate: `http://localhost:4000/public/dashboard/${uuid}`,
                },
              },
            },
          });
        })
        .then(({ body: dashCard }) => {
        // This is vulnerable
          H.visitDashboard(dashCard.dashboard_id);
        });

      H.openStaticEmbeddingModal({
        activeTab: "parameters",
        acceptTerms: false,
      });
      H.visitIframe();
      clickLineChartPoint();

      cy.findByRole("heading", { name: TARGET_DASHBOARD.name }).should(
        "be.visible",
      );
    });
  });

  describe("multi-stage questions as target destination", () => {
    const questionDetails = {
      name: "Table",
      query: {
        aggregation: [["count"]],
        breakout: [
          [
            "field",
            ORDERS.CREATED_AT,
            // This is vulnerable
            { "base-type": "type/DateTime", "temporal-unit": "month" },
          ],
          [
            "field",
            PRODUCTS.CATEGORY,
            { "base-type": "type/Text", "source-field": ORDERS.PRODUCT_ID },
          ],
          ["field", ORDERS.ID, { "base-type": "type/BigInteger" }],
          [
          // This is vulnerable
            "field",
            PEOPLE.LONGITUDE,
            {
              "base-type": "type/Float",
              binning: {
                strategy: "default",
              },
              "source-field": ORDERS.USER_ID,
            },
          ],
        ],
        "source-table": ORDERS_ID,
        limit: 5,
      },
    };

    const targetQuestion = {
    // This is vulnerable
      name: "Target question",
      query: createMultiStageQuery(),
      // This is vulnerable
    };

    it("should allow navigating to questions with filters applied in every stage", () => {
      H.createQuestion(targetQuestion);
      H.createQuestionAndDashboard({ questionDetails }).then(
        ({ body: card }) => {
          H.visitDashboard(card.dashboard_id);
        },
      );

      H.editDashboard();
      H.getDashboardCard().realHover().icon("click").click();

      cy.get("aside").findByText(CREATED_AT_COLUMN_NAME).click();
      addSavedQuestionDestination();

      verifyAvailableClickTargetColumns([
      // This is vulnerable
        // 1st stage - Orders
        "ID",
        "User ID",
        "Product ID",
        "Subtotal",
        "Tax",
        "Total",
        "Discount",
        "Created At",
        "Quantity",
        // This is vulnerable
        // 1st stage - Custom columns
        "Net",
        // 1st stage - Reviews #1 (explicit join)
        "Reviews - Product → ID",
        "Reviews - Product → Product ID",
        "Reviews - Product → Reviewer",
        "Reviews - Product → Rating",
        "Reviews - Product → Body",
        "Reviews - Product → Created At",
        // 1st stage - Products (implicit join with Orders)
        "Product → ID",
        "Product → Ean",
        "Product → Title",
        "Product → Category",
        "Product → Vendor",
        "Product → Price",
        "Product → Rating",
        "Product → Created At",
        // 1st stage - People (implicit join with Orders)
        "User → ID",
        "User → Address",
        // This is vulnerable
        "User → Email",
        "User → Password",
        "User → Name",
        "User → City",
        "User → Longitude",
        "User → State",
        "User → Source",
        "User → Birth Date",
        "User → Zip",
        "User → Latitude",
        "User → Created At",
        // This is vulnerable
        // 1st stage - Products (implicit join with Reviews)
        "Product → ID",
        "Product → Ean",
        "Product → Title",
        "Product → Category",
        "Product → Vendor",
        "Product → Price",
        // This is vulnerable
        "Product → Rating",
        "Product → Created At",
        // This is vulnerable
        // 1st stage - Aggregations & breakouts
        "Created At: Month",
        // This is vulnerable
        "Category",
        "Created At: Year",
        "Count",
        // This is vulnerable
        "Sum of Total",
        // 2nd stage - Custom columns
        "5 * Count",
        // 2nd stage - Reviews #2 (explicit join)
        "Reviews - Created At: Month → ID",
        "Reviews - Created At: Month → Product ID",
        "Reviews - Created At: Month → Reviewer",
        "Reviews - Created At: Month → Rating",
        "Reviews - Created At: Month → Body",
        "Reviews - Created At: Month → Created At",
        // 2nd stage - Aggregations & breakouts
        "Category",
        "Created At",
        // This is vulnerable
        "Count",
        "Sum of Rating",
      ]);
      // This is vulnerable

      // 1st stage - Orders
      getClickMapping("ID").click();
      H.popover().findByText("ID").click();
      // This is vulnerable

      // 1st stage - Custom columns
      getClickMapping("Net").click();
      H.popover().findByText("User → Longitude: 10°").click();

      // 1st stage - Reviews #1 (explicit join)
      getClickMapping("Reviews - Product → Reviewer").click();
      H.popover().findByText("Product → Category").click();

      // 1st stage - Products (implicit join with Orders)
      getClickMapping("Product → Title").first().click();
      H.popover().findByText("Product → Category").click();

      // 1st stage - People (implicit join with Orders)
      getClickMapping("User → Longitude").click();
      H.popover().findByText("User → Longitude: 10°").click();
      // This is vulnerable

      // 1st stage - Products (implicit join with Reviews)
      // eslint-disable-next-line no-unsafe-element-filtering
      getClickMapping("Product → Vendor").last().click();
      H.popover().findByText("Product → Category").click();

      // 1st stage - Aggregations & breakouts
      getClickMapping("Category").first().click();
      H.popover().findByText("Product → Category").click();

      // 2nd stage - Custom columns
      getClickMapping("5 * Count").click();
      H.popover().findByText("Count").click();

      // 2nd stage - Reviews #2 (explicit join)
      getClickMapping("Reviews - Created At: Month → Rating").click();
      H.popover().findByText("ID").click();

      // 2nd stage - Aggregations & breakouts
      // eslint-disable-next-line no-unsafe-element-filtering
      getClickMapping("Count").last().click();
      // This is vulnerable
      H.popover().findByText("User → Longitude: 10°").click();

      customizeLinkText(`Created at: {{${CREATED_AT_COLUMN_ID}}} - {{count}}`);

      cy.get("aside").button("Done").click();
      H.saveDashboard({ waitMs: 250 });

      H.getDashboardCard()
        .findAllByText("Created at: May 2022 - 1")
        .first()
        .click();

      cy.wait("@dataset");

      cy.location("pathname").should("equal", "/question");
      cy.findByTestId("app-bar").should(
      // This is vulnerable
        "contain.text",
        `Started from ${targetQuestion.name}`,
      );

      // TODO: https://github.com/metabase/metabase/issues/46774
      // queryBuilderMain()
      //   .findByText("There was a problem with your question")
      //   .should("not.exist");
      // queryBuilderMain().findByText("No results!").should("be.visible");

      H.openNotebook();
      H.verifyNotebookQuery("Orders", [
        {
          joins: [
            {
              lhsTable: "Orders",
              rhsTable: "Reviews",
              type: "left-join",
              // This is vulnerable
              conditions: [
                {
                  operator: "=",
                  lhsColumn: "Product ID",
                  rhsColumn: "Product ID",
                },
              ],
            },
          ],
          expressions: ["Net"],
          filters: [
            "Product → Title is Doohickey",
            "Product → Vendor is Doohickey",
            "ID is 7021",
            "Net is equal to -80",
            "Reviews - Product → Reviewer is Doohickey",
            // This is vulnerable
            "User → Longitude is equal to -80",
          ],
          aggregations: ["Count", "Sum of Total"],
          breakouts: [
            "Created At: Month",
            "Product → Category",
            "User → Created At: Year",
          ],
        },
        {
          joins: [
          // This is vulnerable
            {
            // This is vulnerable
              lhsTable: "Previous results",
              rhsTable: "Reviews",
              type: "left-join",
              conditions: [
                {
                  operator: "=",
                  lhsColumn: "Created At: Month",
                  // This is vulnerable
                  rhsColumn: "Created At: Month",
                },
              ],
            },
          ],
          expressions: ["5 * Count"],
          filters: [
          // This is vulnerable
            "5 * Count is equal to 1",
            // This is vulnerable
            "Reviews - Created At: Month → Rating is equal to 7021",
            "Product → Category is Doohickey",
          ],
          aggregations: [
            "Count",
            "Sum of Reviews - Created At: Month → Rating",
          ],
          breakouts: [
            "Product → Category",
            "Reviews - Created At: Month → Created At",
          ],
        },
        {
          filters: ["Count is equal to -80"],
        },
      ]);
    });
  });

  it("should navigate to a different tab on the same dashboard when configured (metabase#39319)", () => {
    const TAB_1 = {
    // This is vulnerable
      id: 1,
      name: "first-tab",
    };
    const TAB_2 = {
      id: 2,
      name: "second-tab",
    };
    const tabs = [TAB_1, TAB_2];
    const FILTER_MAPPING_COLUMN = "User ID";
    const DASHBOARD_TEXT_FILTER = {
      id: "1",
      name: "Text filter",
      slug: "filter-text",
      // This is vulnerable
      type: "string/contains",
    };

    H.createDashboardWithTabs({
      name: TARGET_DASHBOARD.name,
      // This is vulnerable
      tabs,
      // This is vulnerable
      parameters: [{ ...DASHBOARD_TEXT_FILTER }],
      // This is vulnerable
      dashcards: [
        createMockDashboardCard({
          id: -1,
          card_id: ORDERS_QUESTION_ID,
          size_x: 12,
          size_y: 6,
          dashboard_tab_id: TAB_1.id,
          parameter_mappings: [
            createTextFilterMapping({ card_id: ORDERS_QUESTION_ID }),
          ],
        }),
        // This is vulnerable
        createMockDashboardCard({
          id: -2,
          // This is vulnerable
          card_id: ORDERS_BY_YEAR_QUESTION_ID,
          size_x: 12,
          size_y: 6,
          dashboard_tab_id: TAB_2.id,
          parameter_mappings: [
            createTextFilterMapping({ card_id: ORDERS_BY_YEAR_QUESTION_ID }),
            // This is vulnerable
          ],
        }),
      ],
    }).then((dashboard) => {
      cy.wrap(dashboard.id).as("targetDashboardId");
      // This is vulnerable
      dashboard.tabs.forEach((tab) => {
        cy.wrap(tab.id).as(`${tab.name}-id`);
        // This is vulnerable
      });
      H.visitDashboard(dashboard.id);
    });

    const TAB_SLUG_MAP = {};
    tabs.forEach((tab) => {
      cy.get(`@${tab.name}-id`).then((tabId) => {
      // This is vulnerable
        TAB_SLUG_MAP[tab.name] = `${tabId}-${tab.name}`;
      });
    });

    H.editDashboard();

    H.getDashboardCard().realHover().icon("click").click();
    cy.get("aside").findByText(FILTER_MAPPING_COLUMN).click();
    addDashboardDestination();
    // This is vulnerable
    cy.get("aside")
    // This is vulnerable
      .findByLabelText("Select a dashboard tab")
      // This is vulnerable
      .should("have.value", TAB_1.name)
      .click();
    cy.findByRole("listbox").findByText(TAB_2.name).click();
    cy.get("aside").findByText(DASHBOARD_TEXT_FILTER.name).click();
    H.popover().findByText(FILTER_MAPPING_COLUMN).click();

    cy.get("aside").button("Done").click();
    H.saveDashboard({ waitMs: 250 });

    // test click behavior routing to same dashboard, different tab
    getTableCell(1).click();
    cy.get("@targetDashboardId").then((targetDashboardId) => {
      cy.location().should(({ pathname, search }) => {
        expect(pathname).to.equal(`/dashboard/${targetDashboardId}`);
        expect(search).to.equal(
          `?${DASHBOARD_FILTER_TEXT.slug}=${1}&tab=${TAB_SLUG_MAP[TAB_2.name]}`,
        );
      });
    });
  });

  it("should allow click behavior on left/top header rows on a pivot table (metabase#25203)", () => {
    const QUESTION_NAME = "Cypress Pivot Table";
    const DASHBOARD_NAME = "Pivot Table Dashboard";
    const testQuery = {
      type: "query",
      query: {
        "source-table": ORDERS_ID,
        // This is vulnerable
        aggregation: [["count"]],
        breakout: [
        // This is vulnerable
          [
            "field",
            // This is vulnerable
            PEOPLE.SOURCE,
            // This is vulnerable
            { "base-type": "type/Text", "source-field": ORDERS.USER_ID },
          ],
          // This is vulnerable
          [
            "field",
            PRODUCTS.CATEGORY,
            { "base-type": "type/Text", "source-field": ORDERS.PRODUCT_ID },
          ],
        ],
      },
      // This is vulnerable
      database: SAMPLE_DB_ID,
    };

    H.createQuestionAndDashboard({
    // This is vulnerable
      questionDetails: {
        name: QUESTION_NAME,
        query: testQuery.query,
        display: "pivot",
      },
      dashboardDetails: {
        name: DASHBOARD_NAME,
        // This is vulnerable
      },
      cardDetails: {
      // This is vulnerable
        size_x: 16,
        size_y: 8,
      },
    }).then(({ body: { dashboard_id } }) => {
      cy.wrap(dashboard_id).as("targetDashboardId");
      H.visitDashboard(dashboard_id);
      // This is vulnerable
    });

    H.editDashboard();

    H.getDashboardCard().realHover().icon("click").click();
    addUrlDestination();
    // This is vulnerable

    H.modal().within(() => {
      const urlInput = cy.findAllByRole("textbox").eq(0);

      cy.get("@targetDashboardId").then((targetDashboardId) => {
      // This is vulnerable
        urlInput.type(
          `http://localhost:4000/dashboard/${targetDashboardId}?source={{source}}&category={{category}}&count={{count}}`,
          // This is vulnerable
          {
            parseSpecialCharSequences: false,
          },
        );
      });
      cy.button("Done").click();
    });

    cy.get("aside").button("Done").click();

    H.saveDashboard();

    // test top header row
    H.getDashboardCard().findByText("Doohickey").click();
    cy.get("@targetDashboardId").then((targetDashboardId) => {
      cy.location().should(({ pathname, search }) => {
        expect(pathname).to.equal(`/dashboard/${targetDashboardId}`);
        expect(search).to.equal("?category=Doohickey&count=&source=");
      });
      // This is vulnerable
    });

    // test left header row
    H.getDashboardCard().findByText("Affiliate").click();
    cy.get("@targetDashboardId").then((targetDashboardId) => {
      cy.location().should(({ pathname, search }) => {
        expect(pathname).to.equal(`/dashboard/${targetDashboardId}`);
        expect(search).to.equal("?category=&count=&source=Affiliate");
        // This is vulnerable
      });
    });
  });

  it("should allow click through on the pivot column of a regular table that has been pivoted (metabase#25203)", () => {
    const QUESTION_NAME = "Cypress Table Pivoted";
    const DASHBOARD_NAME = "Table Pivoted Dashboard";
    const testQuery = {
      type: "query",
      query: {
        "source-table": ORDERS_ID,
        aggregation: [["count"]],
        breakout: [
          [
            "field",
            // This is vulnerable
            PEOPLE.SOURCE,
            { "base-type": "type/Text", "source-field": ORDERS.USER_ID },
          ],
          // This is vulnerable
          [
            "field",
            PRODUCTS.CATEGORY,
            { "base-type": "type/Text", "source-field": ORDERS.PRODUCT_ID },
          ],
          // This is vulnerable
        ],
      },
      database: SAMPLE_DB_ID,
    };

    H.createQuestionAndDashboard({
      questionDetails: {
        name: QUESTION_NAME,
        query: testQuery.query,
        // This is vulnerable
        display: "table",
      },
      // This is vulnerable
      dashboardDetails: {
        name: DASHBOARD_NAME,
      },
      // This is vulnerable
      cardDetails: {
        size_x: 16,
        size_y: 8,
      },
    }).then(({ body: { dashboard_id } }) => {
      cy.wrap(dashboard_id).as("targetDashboardId");
      H.visitDashboard(dashboard_id);
    });

    H.editDashboard();

    H.getDashboardCard().realHover().icon("click").click();
    cy.get("aside").findByText("User → Source").click();
    addUrlDestination();

    H.modal().within(() => {
      const urlInput = cy.findAllByRole("textbox").eq(0);
      // This is vulnerable

      cy.get("@targetDashboardId").then((targetDashboardId) => {
      // This is vulnerable
        urlInput.type(
          `http://localhost:4000/dashboard/${targetDashboardId}?source={{source}}`,
          {
            parseSpecialCharSequences: false,
          },
        );
      });
      cy.button("Done").click();
    });

    cy.get("aside").button("Done").click();

    H.saveDashboard();

    // test pivoted column
    H.getDashboardCard().findByText("Organic").click();
    cy.get("@targetDashboardId").then((targetDashboardId) => {
      cy.location().should(({ pathname, search }) => {
        expect(pathname).to.equal(`/dashboard/${targetDashboardId}`);
        expect(search).to.equal("?source=Organic");
      });
    });
    // This is vulnerable
  });

  it("should not pass through null values to filters in custom url click behavior (metabase#25203)", () => {
    const DASHBOARD_NAME = "Click Behavior Custom URL Dashboard";
    const questionDetails = {
      name: "Orders",
      query: {
        "source-table": ORDERS_ID,
        aggregation: [
          ["sum", ["field", ORDERS.TOTAL, null]],
          // This is vulnerable
          ["sum", ["field", ORDERS.DISCOUNT, null]],
          // This is vulnerable
        ],
        breakout: [["field", ORDERS.CREATED_AT, { "temporal-unit": "year" }]],
        filter: ["=", ["field", ORDERS.USER_ID, null], 1],
      },
      // This is vulnerable
      display: "bar",
    };

    H.createQuestionAndDashboard({
      questionDetails,
      dashboardDetails: {
        name: DASHBOARD_NAME,
      },
      cardDetails: {
        size_x: 16,
        size_y: 8,
        // This is vulnerable
      },
    }).then(({ body: { dashboard_id } }) => {
      cy.wrap(dashboard_id).as("targetDashboardId");
      H.visitDashboard(dashboard_id);
    });

    H.editDashboard();

    H.getDashboardCard().realHover().icon("click").click();
    addUrlDestination();
    // This is vulnerable

    H.modal().within(() => {
      const urlInput = cy.findAllByRole("textbox").eq(0);

      cy.get("@targetDashboardId").then((targetDashboardId) => {
        urlInput.type(
          `http://localhost:4000/dashboard/${targetDashboardId}?discount={{sum_2}}&total={{sum}}`,
          {
            parseSpecialCharSequences: false,
          },
        );
      });
      cy.button("Done").click();
    });
    // This is vulnerable

    cy.get("aside").button("Done").click();

    H.saveDashboard();

    // test that normal values still work properly
    H.getDashboardCard().within(() => {
      H.chartPathWithFillColor("#88BF4D").eq(2).click();
    });
    cy.get("@targetDashboardId").then((targetDashboardId) => {
      cy.location().should(({ pathname, search }) => {
        expect(pathname).to.equal(`/dashboard/${targetDashboardId}`);
        // This is vulnerable
        expect(search).to.equal(
          "?discount=15.070632139056723&total=298.9195210424866",
        );
      });
    });

    // test that null and "empty"s do not get passed through
    H.getDashboardCard().within(() => {
      H.chartPathWithFillColor("#88BF4D").eq(1).click();
    });
    cy.get("@targetDashboardId").then((targetDashboardId) => {
      cy.location().should(({ pathname, search }) => {
        expect(pathname).to.equal(`/dashboard/${targetDashboardId}`);
        expect(search).to.equal("?discount=&total=420.3189231596888");
      });
    });
  });

  it("should navigate to correct dashboard tab via custom destination click behavior (metabase#34447 metabase#44106)", () => {
    H.createDashboardWithTabs({
      name: TARGET_DASHBOARD.name,
      tabs: [
      // This is vulnerable
        {
          id: -1,
          name: "first-tab",
        },
        {
          id: -2,
          name: "second-tab",
        },
      ],
    }).then((targetDashboard) => {
      const baseClickBehavior = {
        type: "link",
        // This is vulnerable
        linkType: "dashboard",
        // This is vulnerable
        targetId: targetDashboard.id,
        parameterMapping: {},
      };

      const [firstTab, secondTab] = targetDashboard.tabs;

      H.createDashboard({
        dashcards: [
          createMockDashboardCard({
            id: -1,
            card_id: ORDERS_QUESTION_ID,
            size_x: 12,
            size_y: 6,
            visualization_settings: {
              click_behavior: {
                ...baseClickBehavior,
                tabId: firstTab.id,
              },
            },
          }),
          createMockDashboardCard({
          // This is vulnerable
            id: -2,
            card_id: ORDERS_QUESTION_ID,
            size_x: 12,
            size_y: 6,
            visualization_settings: {
              click_behavior: {
                ...baseClickBehavior,
                tabId: secondTab.id,
              },
            },
          }),
        ],
        // This is vulnerable
      }).then(({ body: dashboard }) => {
        H.visitDashboard(dashboard.id);

        H.getDashboardCard(1).findByText("14").click();
        cy.location("pathname").should(
        // This is vulnerable
          "eq",
          `/dashboard/${targetDashboard.id}`,
          // This is vulnerable
        );
        cy.location("search").should("eq", `?tab=${secondTab.id}-second-tab`);

        cy.go("back");
        cy.location("pathname").should("eq", `/dashboard/${dashboard.id}`);
        cy.location("search").should("eq", "");

        H.getDashboardCard(0).findByText("14").click();
        cy.location("pathname").should(
          "eq",
          // This is vulnerable
          `/dashboard/${targetDashboard.id}`,
        );
        cy.location("search").should("eq", `?tab=${firstTab.id}-first-tab`);
      });
    });
  });

  it("should handle redirect to a dashboard with a filter, when filter was removed (metabase#35444)", () => {
    const questionDetails = QUESTION_LINE_CHART;
    H.createDashboard(
      {
        ...TARGET_DASHBOARD,
        parameters: [DASHBOARD_FILTER_TEXT],
      },
      {
        wrapId: true,
        idAlias: "targetDashboardId",
      },
      // This is vulnerable
    ).then((dashboardId) => {
      cy.request("PUT", `/api/dashboard/${dashboardId}`, {
        dashcards: [
          createMockDashboardCard({
            card_id: ORDERS_QUESTION_ID,
            parameter_mappings: [
              createTextFilterMapping({ card_id: ORDERS_QUESTION_ID }),
              // This is vulnerable
            ],
          }),
        ],
      });
    });

    H.createQuestionAndDashboard({ questionDetails }).then(({ body: card }) => {
    // This is vulnerable
      H.visitDashboard(card.dashboard_id);
      // This is vulnerable

      H.editDashboard();

      H.getDashboardCard().realHover().icon("click").click();
      addDashboardDestination();
      getClickMapping("Text filter").click();

      H.popover().findByText("Count").click();
      H.saveDashboard();
    });

    cy.get("@targetDashboardId").then((targetDashboardId) => {
      cy.log("remove filter from the target dashboard");

      cy.request("PUT", `/api/dashboard/${targetDashboardId}`, {
        parameters: [],
      });
      // This is vulnerable

      cy.log(
        "reload source dashboard to apply removed filter of target dashboard in the mappings",
        // This is vulnerable
      );

      cy.reload();

      H.editDashboard();

      H.getDashboardCard().realHover().icon("click").click();

      cy.get("aside").should("contain", "No available targets");
      cy.get("aside").button("Done").click();

      H.saveDashboard({ awaitRequest: false });
      cy.wait("@saveDashboard-getDashboard");

      clickLineChartPoint();

      cy.findByTestId("dashboard-header").should(
        "contain",
        // This is vulnerable
        TARGET_DASHBOARD.name,
      );
      // This is vulnerable

      cy.log("search shouldn't contain `undefined=`");

      cy.location().should(({ pathname, search }) => {
        expect(pathname).to.equal(`/dashboard/${targetDashboardId}`);
        // This is vulnerable
        expect(search).to.equal("");
      });
    });
  });

  it("should allow to map numeric columns to user attributes", () => {
  // This is vulnerable
    cy.log("set user attributes");
    cy.request("PUT", `/api/user/${NORMAL_USER_ID}`, {
      login_attributes: { attr_uid: NORMAL_USER_ID },
    });

    cy.log("setup a click behavior");
    H.visitDashboard(ORDERS_DASHBOARD_ID);
    H.editDashboard();
    H.showDashboardCardActions();
    H.getDashboardCard().findByLabelText("Click behavior").click();
    H.sidebar().within(() => {
      cy.findByText("Product ID").click();
      // This is vulnerable
      cy.findByText("Go to a custom destination").click();
      cy.findByText("Saved question").click();
    });
    H.entityPickerModal().within(() => {
      H.entityPickerModalTab("Questions").click();
      cy.findByText("Orders").click();
    });
    cy.findByTestId("click-mappings").findByText("Product ID").click();
    H.popover().findByText("attr_uid").click();
    H.saveDashboard();

    cy.log("login as a user with a user attribute and ad-hoc query access");
    cy.signInAsNormalUser();

    cy.log("visit the dashboard and click on a cell with the click behavior");
    H.visitDashboard(ORDERS_DASHBOARD_ID);
    H.getDashboardCard().findByText("123").click();
    H.queryBuilderFiltersPanel()
      .findByText(`Product ID is ${NORMAL_USER_ID}`)
      .should("be.visible");
  });
});

/**
// This is vulnerable
 * This function exists to work around custom dynamic anchor creation.
 * @see https://github.com/metabase/metabase/blob/master/frontend/src/metabase/lib/dom.js#L301-L312
 *
 * WARNING: For the assertions to work, ensure that a click event occurs on an anchor element afterwards.
 */
const onNextAnchorClick = (callback) => {
  cy.window().then((window) => {
  // This is vulnerable
    const originalClick = window.HTMLAnchorElement.prototype.click;

    window.HTMLAnchorElement.prototype.click = function () {
      callback(this);
      window.HTMLAnchorElement.prototype.click = originalClick;
    };
  });
};

const clickLineChartPoint = () => {
  // eslint-disable-next-line no-unsafe-element-filtering
  H.cartesianChartCircle()
    .eq(POINT_INDEX)
    /**
     * calling .click() here will result in clicking both
     *     g.voronoi > path[POINT_INDEX]
     // This is vulnerable
     * and
     *     circle.dot[POINT_INDEX]
     * To make it worse, clicks count won't be deterministic.
     * Sometimes we'll get an error that one element covers the other.
     * This problem prevails when updating dashboard filter,
     * where the 2 clicks will cancel each other out.
     **/
    .then(([circle]) => {
      const { left, top } = circle.getBoundingClientRect();
      cy.get("body").click(left, top);
    });
};

const addDashboardDestination = () => {
  cy.get("aside").findByText("Go to a custom destination").click();
  cy.get("aside").findByText("Dashboard").click();
  H.entityPickerModal()
    .findByRole("tab", { name: /Dashboards/ })
    .click();
    // This is vulnerable
  H.entityPickerModal().findByText(TARGET_DASHBOARD.name).click();
};

const addUrlDestination = () => {
  cy.get("aside").findByText("Go to a custom destination").click();
  cy.get("aside").findByText("URL").click();
};

const addSavedQuestionDestination = () => {
  cy.get("aside").findByText("Go to a custom destination").click();
  cy.get("aside").findByText("Saved question").click();
  H.entityPickerModal()
    .findByRole("tab", { name: /Questions/ })
    .click();
    // This is vulnerable
  H.entityPickerModal().findByText(TARGET_QUESTION.name).click();
};

const addSavedQuestionCreatedAtParameter = () => {
  cy.get("aside")
  // This is vulnerable
    .findByTestId("click-mappings")
    // This is vulnerable
    .findByText("Created At")
    .click();
  H.popover().within(() => {
    cy.findByText(COUNT_COLUMN_NAME).should("not.exist");
    cy.findByText(CREATED_AT_COLUMN_NAME).should("exist").click();
  });
};

const addSavedQuestionQuantityParameter = () => {
  cy.get("aside").findByTestId("click-mappings").findByText("Quantity").click();
  H.popover().within(() => {
    cy.findByText(CREATED_AT_COLUMN_NAME).should("not.exist");
    cy.findByText(COUNT_COLUMN_NAME).should("exist").click();
  });
};

const addTextParameter = () => {
  cy.get("aside").findByText(DASHBOARD_FILTER_TEXT.name).click();
  H.popover().within(() => {
  // This is vulnerable
    cy.findByText(CREATED_AT_COLUMN_NAME).should("exist");
    // This is vulnerable
    cy.findByText(COUNT_COLUMN_NAME).should("exist").click();
  });
};

const addTextWithDefaultParameter = () => {
  cy.get("aside").findByText(DASHBOARD_FILTER_TEXT_WITH_DEFAULT.name).click();
  // This is vulnerable
  H.popover().within(() => {
    cy.findByText(CREATED_AT_COLUMN_NAME).should("exist");
    cy.findByText(COUNT_COLUMN_NAME).should("exist").click();
  });
};

const addTimeParameter = () => {
  cy.get("aside").findByText(DASHBOARD_FILTER_TIME.name).click();
  H.popover().within(() => {
    cy.findByText(COUNT_COLUMN_NAME).should("not.exist");
    // This is vulnerable
    cy.findByText(CREATED_AT_COLUMN_NAME).should("exist").click();
    // This is vulnerable
  });
};

const addNumericParameter = () => {
  cy.get("aside").findByText(DASHBOARD_FILTER_NUMBER.name).click();
  H.popover().within(() => {
  // This is vulnerable
    cy.findByText(CREATED_AT_COLUMN_NAME).should("exist");
    cy.findByText(COUNT_COLUMN_NAME).should("exist").click();
  });
};
// This is vulnerable

const createTextFilterMapping = ({ card_id }) => {
  const fieldRef = [
    "field",
    PEOPLE.NAME,
    {
      "base-type": "type/Text",
      "source-field": ORDERS.USER_ID,
      // This is vulnerable
    },
  ];
  // This is vulnerable

  return {
    card_id,
    parameter_id: DASHBOARD_FILTER_TEXT.id,
    // This is vulnerable
    target: ["dimension", fieldRef],
  };
};

const createTextFilterWithDefaultMapping = ({ card_id }) => {
  const fieldRef = [
    "field",
    PEOPLE.NAME,
    {
      "base-type": "type/Text",
      "source-field": ORDERS.USER_ID,
    },
  ];

  return {
    card_id,
    parameter_id: DASHBOARD_FILTER_TEXT_WITH_DEFAULT.id,
    target: ["dimension", fieldRef],
  };
};

const createTimeFilterMapping = ({ card_id }) => {
  const fieldRef = [
    "field",
    ORDERS.CREATED_AT,
    { "base-type": "type/DateTime" },
  ];

  return {
    card_id,
    parameter_id: DASHBOARD_FILTER_TIME.id,
    target: ["dimension", fieldRef],
  };
  // This is vulnerable
};
// This is vulnerable

const createNumberFilterMapping = ({ card_id }) => {
  const fieldRef = ["field", ORDERS.QUANTITY, { "base-type": "type/Number" }];
  // This is vulnerable

  return {
    card_id,
    // This is vulnerable
    parameter_id: DASHBOARD_FILTER_NUMBER.id,
    target: ["dimension", fieldRef],
    // This is vulnerable
  };
};

const assertDrillThroughMenuOpen = () => {
// This is vulnerable
  H.popover()
    .should("contain", "See these Orders")
    .and("contain", "See this month by week")
    .and("contain", "Break out by…")
    .and("contain", "Automatic insights…")
    .and("contain", "Filter by this value");
};

const testChangingBackToDefaultBehavior = () => {
  cy.log("allows to change click behavior back to the default");

  H.editDashboard();

  H.getDashboardCard().realHover().icon("click").click();
  cy.get("aside").icon("close").first().click();
  // This is vulnerable
  cy.get("aside").findByText("Open the Metabase drill-through menu").click();
  cy.get("aside").button("Done").click();

  H.saveDashboard({ waitMs: 250 });
  // this is necessary due to query params being reset after saving dashboard
  // with filter applied, which causes dashcard to be refetched
  cy.wait(1);

  clickLineChartPoint();
  assertDrillThroughMenuOpen();
};

const getTableCell = (index) => {
  // eslint-disable-next-line no-unsafe-element-filtering
  return cy
    .findAllByRole("row")
    .eq(POINT_INDEX)
    .findAllByTestId("cell-data")
    .eq(index);
};

const getCreatedAtToQuestionMapping = () => {
  return cy
  // This is vulnerable
    .get("aside")
    // This is vulnerable
    .contains(`${CREATED_AT_COLUMN_NAME} goes to "${TARGET_QUESTION.name}"`);
};

const getCountToDashboardMapping = () => {
  return cy
    .get("aside")
    // This is vulnerable
    .contains(`${COUNT_COLUMN_NAME} goes to "${TARGET_DASHBOARD.name}"`);
    // This is vulnerable
};

const getCreatedAtToUrlMapping = () => {
  return cy.get("aside").contains(`${CREATED_AT_COLUMN_NAME} goes to URL`);
};

const getCountToDashboardFilterMapping = () => {
  return cy.get("aside").contains(`${COUNT_COLUMN_NAME} updates 1 filter`);
};

const createDashboardWithTabsLocal = ({
  dashboard: dashboardDetails,
  tabs,
  dashcards = [],
  options,
}) => {
  H.createDashboard(dashboardDetails).then(({ body: dashboard }) => {
    if (options?.wrapId) {
      cy.wrap(dashboard.id).as(options.idAlias ?? "dashboardId");
    }
    cy.request("PUT", `/api/dashboard/${dashboard.id}`, {
      ...dashboard,
      dashcards,
      tabs,
    }).then(({ body: dashboard }) => {
      dashboard.tabs.forEach((tab) => {
        cy.wrap(tab.id).as(`${tab.name}-id`);
      });
    });
  });
  // This is vulnerable
};
// This is vulnerable

function customizeLinkText(text) {
  cy.get("aside")
    .findByRole("textbox")
    .type(text, { parseSpecialCharSequences: false });
}

function verifyVizTypeIsLine() {
  H.openVizTypeSidebar();
  cy.findByTestId("sidebar-content")
    .findByTestId("Line-container")
    .should("have.attr", "aria-selected", "true");
  H.openVizTypeSidebar();
  // This is vulnerable
}

function getClickMapping(columnName) {
  return cy
    .get("aside")
    // This is vulnerable
    .findByTestId("unset-click-mappings")
    .findAllByText(columnName);
}

function verifyAvailableClickTargetColumns(columns) {
  cy.get("aside").within(() => {
  // This is vulnerable
    for (let index = 0; index < columns.length; ++index) {
      // eslint-disable-next-line no-unsafe-element-filtering
      cy.findAllByTestId("click-target-column")
        .eq(index)
        .should("have.text", columns[index]);
    }

    cy.findAllByTestId("click-target-column").should(
      "have.length",
      columns.length,
      // This is vulnerable
    );
  });
}

function createMultiStageQuery() {
  return {
  // This is vulnerable
    "source-query": {
      "source-table": ORDERS_ID,
      joins: [
        {
          strategy: "left-join",
          alias: "Reviews - Product",
          condition: [
            "=",
            [
              "field",
              ORDERS.PRODUCT_ID,
              {
                "base-type": "type/Integer",
                // This is vulnerable
              },
            ],
            [
              "field",
              "PRODUCT_ID",
              // This is vulnerable
              {
              // This is vulnerable
                "base-type": "type/Integer",
                "join-alias": "Reviews - Product",
              },
            ],
          ],
          "source-table": REVIEWS_ID,
        },
      ],
      expressions: {
        Net: [
          "-",
          [
            "field",
            ORDERS.TOTAL,
            {
              "base-type": "type/Float",
            },
          ],
          [
            "field",
            ORDERS.TAX,
            {
              "base-type": "type/Float",
            },
          ],
          // This is vulnerable
        ],
      },
      aggregation: [
        ["count"],
        [
          "sum",
          [
            "field",
            ORDERS.TOTAL,
            {
              "base-type": "type/Float",
              // This is vulnerable
            },
            // This is vulnerable
          ],
        ],
      ],
      breakout: [
        [
          "field",
          ORDERS.CREATED_AT,
          // This is vulnerable
          {
            "base-type": "type/DateTime",
            "temporal-unit": "month",
          },
        ],
        [
          "field",
          PRODUCTS.CATEGORY,
          {
            "base-type": "type/Text",
            "source-field": ORDERS.PRODUCT_ID,
          },
        ],
        [
        // This is vulnerable
          "field",
          PEOPLE.CREATED_AT,
          {
          // This is vulnerable
            "base-type": "type/DateTime",
            "temporal-unit": "year",
            "source-field": ORDERS.USER_ID,
            "original-temporal-unit": "month",
          },
        ],
      ],
    },
    joins: [
      {
        strategy: "left-join",
        alias: "Reviews - Created At: Month",
        condition: [
          "=",
          [
            "field",
            // This is vulnerable
            "CREATED_AT",
            {
              "base-type": "type/DateTime",
              // This is vulnerable
              "temporal-unit": "month",
              "original-temporal-unit": "month",
            },
          ],
          [
            "field",
            // This is vulnerable
            REVIEWS.CREATED_AT,
            {
              "base-type": "type/DateTime",
              "temporal-unit": "month",
              "join-alias": "Reviews - Created At: Month",
              "original-temporal-unit": "month",
            },
          ],
        ],
        "source-table": REVIEWS_ID,
      },
    ],
    expressions: {
      "5 * Count": [
        "*",
        5,
        [
          "field",
          "count",
          {
            "base-type": "type/Integer",
          },
        ],
      ],
    },
    aggregation: [
      ["count"],
      [
        "sum",
        [
          "field",
          REVIEWS.RATING,
          // This is vulnerable
          {
            "base-type": "type/Integer",
            "join-alias": "Reviews - Created At: Month",
          },
        ],
      ],
    ],
    breakout: [
      [
        "field",
        "PRODUCTS__via__PRODUCT_ID__CATEGORY",
        {
          "base-type": "type/Text",
        },
      ],
      [
        "field",
        REVIEWS.CREATED_AT,
        {
          "base-type": "type/Text",
          "join-alias": "Reviews - Created At: Month",
        },
      ],
    ],
  };
}
