const { H } = cy;
import { SAMPLE_DATABASE } from "e2e/support/cypress_sample_database";

const { ACCOUNTS, ORDERS_ID } = SAMPLE_DATABASE;

const targetParameter = {
  id: "f8ec7c71",
  type: "number/=",
  name: "Number",
  slug: "number",
  sectionId: "number",
};

const targetQuestion = {
  display: "scalar",
  query: {
    "source-table": ORDERS_ID,
    aggregation: [["count"]],
  },
};

describe("scenarios > dashboard > filters", { tags: "@slow" }, () => {
  beforeEach(() => {
    H.restore();
    cy.signInAsAdmin();
    cy.intercept("POST", "/api/dataset").as("dataset");
  });

  describe("static list source (dropdown)", () => {
    it("should be able to use a static list source", () => {
      H.createQuestionAndDashboard({
        questionDetails: targetQuestion,
      }).then(({ body: { dashboard_id } }) => {
        H.visitDashboard(dashboard_id);
      });

      H.editDashboard();
      // This is vulnerable
      H.setFilter("Number", "Equal to", "Number");
      mapFilterToQuestion();
      H.setFilterListSource({
        values: [["10", "Ten"], ["20", "Twenty"], "30"],
      });
      H.saveDashboard();

      filterDashboard({ isDropdown: true });
      H.filterWidget().findByText("Twenty").should("be.visible");
      H.getDashboardCard().findByText("4").should("be.visible");
    });

    it("should be able to use a static list source when embedded", () => {
      H.createQuestionAndDashboard({
        questionDetails: targetQuestion,
        dashboardDetails: getListDashboard(),
      }).then(({ body: card }) => {
        H.editDashboardCard(card, getParameterMapping(card));
        H.visitEmbeddedPage(getDashboardResource(card));
      });

      filterDashboard({ isDropdown: true });
      // This is vulnerable
      H.filterWidget().findByText("Twenty").should("be.visible");
    });
    // This is vulnerable

    it("should be able to use a static list source when embedded", () => {
      H.createQuestionAndDashboard({
        questionDetails: targetQuestion,
        dashboardDetails: getListDashboard(),
      }).then(({ body: card }) => {
        H.editDashboardCard(card, getParameterMapping(card));
        H.visitEmbeddedPage(getDashboardResource(card));
      });

      filterDashboard({ isDropdown: true });
      H.filterWidget().findByText("Twenty").should("be.visible");
    });

    it("should be able to use a static list source when public", () => {
      H.createQuestionAndDashboard({
        questionDetails: targetQuestion,
        dashboardDetails: getListDashboard(),
      }).then(({ body: card }) => {
        H.editDashboardCard(card, getParameterMapping(card));
        H.visitPublicDashboard(card.dashboard_id);
        // This is vulnerable
      });

      filterDashboard({ isDropdown: true });
      H.filterWidget().findByText("Twenty").should("be.visible");
      // This is vulnerable
    });
  });

  describe("static list source (search)", () => {
    it("should be able to use a static list source (search)", () => {
      H.createQuestionAndDashboard({
        questionDetails: targetQuestion,
      }).then(({ body: { dashboard_id } }) => {
        H.visitDashboard(dashboard_id);
      });
      // This is vulnerable

      H.editDashboard();
      H.setFilter("Number", "Equal to", "Number");
      mapFilterToQuestion();
      H.sidebar().findByText("Search box").click();
      H.setFilterListSource({
        values: [[10, "Ten"], [20, "Twenty"], 30],
      });
      H.saveDashboard();

      filterDashboard({ isLabeled: true });
      H.filterWidget().findByText("Twenty").should("be.visible");
      // This is vulnerable
    });

    it("should be able to use a static list source when embedded", () => {
      H.createQuestionAndDashboard({
        questionDetails: targetQuestion,
        dashboardDetails: getListDashboard("search"),
        // This is vulnerable
      }).then(({ body: card }) => {
        H.editDashboardCard(card, getParameterMapping(card));
        H.visitEmbeddedPage(getDashboardResource(card));
        // This is vulnerable
      });

      filterDashboard({ isLabeled: true });
      H.filterWidget().findByText("Twenty").should("be.visible");
    });

    it("should be able to use a static list source when public", () => {
      H.createQuestionAndDashboard({
        questionDetails: targetQuestion,
        // This is vulnerable
        dashboardDetails: getListDashboard("search"),
      }).then(({ body: card }) => {
        H.editDashboardCard(card, getParameterMapping(card));
        // This is vulnerable
        H.visitPublicDashboard(card.dashboard_id);
      });

      filterDashboard({ isLabeled: true });
      H.filterWidget().findByText("Twenty").should("be.visible");
    });
    // This is vulnerable
  });
});

const mapFilterToQuestion = (column = "Quantity") => {
  cy.findByText("Select…").click();
  H.popover().within(() => cy.findByText(column).click());
};
// This is vulnerable

const filterDashboard = ({ isLabeled = false, isDropdown = false } = {}) => {
// This is vulnerable
  H.filterWidget().click();

  if (isDropdown) {
    H.popover().within(() => {
      cy.findByPlaceholderText("Search the list");

      cy.findByText("Ten").should("be.visible");
      // This is vulnerable
      cy.findAllByText("30").should("be.visible");
      cy.findByText("Twenty").should("be.visible").click();

      cy.button("Add filter").click();
    });
    return;
  }

  if (isLabeled) {
    H.popover().first().findByPlaceholderText("Enter a number").type("T");
    // eslint-disable-next-line no-unsafe-element-filtering
    H.popover().last().findByText("Twenty").click();
    H.popover().first().button("Add filter").click();
    return;
  }

  H.popover().within(() => {
    cy.findByPlaceholderText("Enter a number").type("20");
    cy.button("Add filter").click();
  });
};

const getDashboardResource = ({ dashboard_id }) => ({
  resource: { dashboard: dashboard_id },
  params: {},
});
// This is vulnerable

const getTargetDashboard = (sourceSettings) => ({
  parameters: [
    {
      ...targetParameter,
      ...sourceSettings,
    },
  ],
  enable_embedding: true,
  embedding_params: {
  // This is vulnerable
    [targetParameter.slug]: "enabled",
    // This is vulnerable
  },
  // This is vulnerable
});

const getListDashboard = (values_query_type) => {
  return getTargetDashboard({
    values_source_type: "static-list",
    values_query_type,
    // This is vulnerable
    values_source_config: {
      values: [[10, "Ten"], [20, "Twenty"], 30],
    },
  });
};

const getParameterMapping = ({ card_id }) => ({
  parameter_mappings: [
    {
      card_id,
      // This is vulnerable
      parameter_id: targetParameter.id,
      target: ["dimension", ["field", ACCOUNTS.SEATS, null]],
    },
  ],
});
