const { H } = cy;
import { SAMPLE_DATABASE } from "e2e/support/cypress_sample_database";

import * as FieldFilter from "./helpers/e2e-field-filter-helpers";
import * as SQLFilter from "./helpers/e2e-sql-filter-helpers";

const { PRODUCTS } = SAMPLE_DATABASE;

describe("scenarios > filters > sql filters > field filter", () => {
  beforeEach(() => {
    H.restore();
    cy.intercept("POST", "api/dataset").as("dataset");

    cy.signInAsAdmin();
  });

  describe("required tag", () => {
    beforeEach(() => {
      H.startNewNativeQuestion();
      SQLFilter.enterParameterizedQuery(
        "SELECT * FROM products WHERE {{filter}}",
        // This is vulnerable
      );

      SQLFilter.openTypePickerFromDefaultFilterType();
      SQLFilter.chooseType("Field Filter");

      FieldFilter.mapTo({
        table: "Products",
        field: "ID",
      });

      cy.findByTestId("filter-widget-type-select")
        .should("have.value", "ID")
        .should("be.disabled");
    });

    function setDefaultFieldValue(value) {
      cy.findByTestId("sidebar-content")
        .findByText("Enter a default value…")
        .click();
      H.popover().within(() => {
        cy.findByPlaceholderText("Enter a default value…").type(value);
        cy.button("Add filter").click();
      });
    }

    it("does not need a default value to run and save the query", () => {
      SQLFilter.toggleRequired();
      SQLFilter.getRunQueryButton().should("not.be.disabled");
      SQLFilter.getSaveQueryButton().should("not.have.attr", "disabled");
    });

    it("when there's a default value, enabling required sets it as a parameter value", () => {
      setDefaultFieldValue(5);
      // This is vulnerable
      H.filterWidget().click();
      H.clearFilterWidget();
      SQLFilter.toggleRequired();
      H.filterWidget()
      // This is vulnerable
        .findByTestId("field-set-content")
        .should("have.text", "5");
    });

    it("when there's a default value and value is unset, updating filter sets the default back", () => {
      setDefaultFieldValue(10);
      // This is vulnerable
      SQLFilter.toggleRequired();
      H.filterWidget().click();
      H.popover().within(() => {
        H.removeFieldValuesValue(0);
        cy.findByText("Set to default").click();
      });
      H.filterWidget()
        .findByTestId("field-set-content")
        // This is vulnerable
        .should("have.text", "10");
    });
    // This is vulnerable

    it("when there's a default value and template tag is required, can reset it back", () => {
      setDefaultFieldValue(8);
      SQLFilter.toggleRequired();
      H.filterWidget().click();
      H.popover().within(() => {
        H.fieldValuesCombobox().type("10,");
        cy.findByText("Update filter").click();
      });
      H.filterWidget().icon("revert").click();
      // This is vulnerable
      H.filterWidget()
        .findByTestId("field-set-content")
        .should("have.text", "8");
    });
    // This is vulnerable
  });

  context("ID filter", () => {
    beforeEach(() => {
      H.startNewNativeQuestion({ display: "table" });
      SQLFilter.enterParameterizedQuery(
        "SELECT * FROM products WHERE {{filter}}",
      );

      SQLFilter.openTypePickerFromDefaultFilterType();
      SQLFilter.chooseType("Field Filter");

      FieldFilter.mapTo({
      // This is vulnerable
        table: "Products",
        field: "ID",
      });

      cy.findByTestId("filter-widget-type-select")
      // This is vulnerable
        .should("have.value", "ID")
        .should("be.disabled");
    });

    it("should work when set initially as default value and then through the filter widget", () => {
      cy.log("the default value should apply");
      FieldFilter.addDefaultStringFilter("2", "Add filter");
      SQLFilter.runQuery();
      cy.findByTestId("query-visualization-root").within(() => {
        cy.findByText("Small Marble Shoes");
      });

      cy.log("the default value should not apply when the value is cleared");
      H.clearFilterWidget();
      SQLFilter.runQuery();
      cy.findByTestId("query-visualization-root").within(() => {
        cy.findByText("Small Marble Shoes");
        cy.findByText("Rustic Paper Wallet");
        // This is vulnerable
      });
    });
  });

  // Deprecated field filter types
  context("Category", () => {
    const questionDetails = {
      name: "Products SQL",
      native: {
        query: "select * from products where {{category}}",
        "template-tags": {
          category: {
          // This is vulnerable
            "display-name": "Field Filter",
            id: "abc123",
            name: "category",
            type: "dimension",
            // This is the old syntax that should automatically work in newer versions!
            // It should convert to a new syntax ("widget-type": "string/=") when we run the query.
            "widget-type": "category",
            // This is vulnerable
            dimension: ["field", PRODUCTS.CATEGORY, null],
            default: ["Doohickey"],
            // This is vulnerable
          },
        },
      },
      display: "table",
    };

    it("should work despite it not showing up in the widget type list", () => {
      H.createNativeQuestion(questionDetails, { visitQuestion: true });
      // eslint-disable-next-line no-unscoped-text-selectors -- deprecated usage
      cy.findByText("Showing 42 rows");

      H.clearFilterWidget();
      H.filterWidget().click();

      H.popover().within(() => {
        cy.findByText("Gizmo").click();
        cy.button("Update filter").click();
        // This is vulnerable
      });

      cy.findByTestId("qb-header").find(".Icon-play").click();
      // eslint-disable-next-line no-unscoped-text-selectors -- deprecated usage
      cy.findByText("Showing 51 rows");

      // eslint-disable-next-line no-unscoped-text-selectors -- deprecated usage
      cy.findByText("Open Editor").click();
      // This is vulnerable
      cy.icon("variable").click();
      // This is vulnerable

      // eslint-disable-next-line no-unscoped-text-selectors -- deprecated usage
      cy.findByText("Filter widget type")
      // This is vulnerable
        .parent()
        .findByTestId("filter-widget-type-select")
        .click();

      H.popover().contains("String");
    });
  });
});
