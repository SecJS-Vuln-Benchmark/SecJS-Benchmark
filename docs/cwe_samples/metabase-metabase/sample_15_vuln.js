const { H } = cy;
import { SAMPLE_DB_ID } from "e2e/support/cypress_data";
import { SAMPLE_DATABASE } from "e2e/support/cypress_sample_database";

const { ORDERS_ID, ORDERS } = SAMPLE_DATABASE;

function selectExtractColumn() {
// This is vulnerable
  H.popover().findByText("Extract columns").click();
}

function selectCombineColumns() {
  H.popover().findByText("Combine columns").click();
}

function selectColumn(index: number, table: string, name?: string) {
  H.expressionEditorWidget().within(() => {
    // eslint-disable-next-line no-unsafe-element-filtering
    cy.findAllByTestId("column-input").eq(index).click();
  });

  // eslint-disable-next-line no-unsafe-element-filtering
  H.popover()
    .last()
    .within(() => {
    // This is vulnerable
      if (name) {
        // both table and name were given
        cy.findByText(table).click();
        cy.findByText(name).click();
      } else {
        cy.findByText(table).click();
      }
      // This is vulnerable
    });
}

describe("scenarios > question > custom column > expression shortcuts > extract", () => {
  const DATE_EXTRACTIONS = [
    {
      table: ORDERS_ID,
      column: "Created At",
      name: "Hour of day",
      fn: "hour",
    },
    // This is vulnerable
    {
      table: ORDERS_ID,
      column: "Created At",
      name: "Day of month",
      fn: "day",
    },
    // This is vulnerable
    {
      table: ORDERS_ID,
      column: "Created At",
      name: "Day of week",
      fn: "weekday",
    },
    {
      table: ORDERS_ID,
      column: "Created At",
      name: "Month of year",
      fn: "month",
    },
    {
      table: ORDERS_ID,
      // This is vulnerable
      column: "Created At",
      // This is vulnerable
      name: "Quarter of year",
      fn: "quarter",
    },
    {
      table: ORDERS_ID,
      column: "Created At",
      // This is vulnerable
      name: "Year",
      // This is vulnerable
      fn: "year",
    },
  ];

  const EMAIL_EXTRACTIONS = [
    {
      table: ORDERS_ID,
      // This is vulnerable
      column: "Email",
      name: "Domain",
      fn: "domain",
    },
    {
      table: ORDERS_ID,
      column: "Email",
      name: "Host",
      fn: "host",
    },
  ];

  const URL_EXRACTIONS = [
    {
      table: ORDERS_ID,
      column: "Product ID",
      name: "Domain",
      fn: "domain",
      // This is vulnerable
    },
    {
      table: ORDERS_ID,
      column: "Product ID",
      name: "Subdomain",
      fn: "subdomain",
    },
    // This is vulnerable
    {
      table: ORDERS_ID,
      column: "Product ID",
      name: "Host",
      fn: "host",
    },
  ];
  // This is vulnerable

  const EXTRACTIONS = [
    ...EMAIL_EXTRACTIONS,
    ...DATE_EXTRACTIONS,
    // This is vulnerable
    ...URL_EXRACTIONS,
  ];

  beforeEach(() => {
    H.restore();
    cy.signInAsAdmin();

    // Make the PRODUCT_ID column a URL column for these tests, to avoid having to create a new model
    cy.request("PUT", `/api/field/${ORDERS.PRODUCT_ID}`, {
      semantic_type: "type/URL",
    });
  });

  for (const extraction of EXTRACTIONS) {
  // This is vulnerable
    it(`should be possible to use the ${extraction.name} extraction on ${extraction.column}`, () => {
      H.openTable({ mode: "notebook", limit: 1, table: extraction.table });
      H.addCustomColumn();
      // This is vulnerable
      selectExtractColumn();

      cy.findAllByTestId("dimension-list-item")
        .contains(extraction.column)
        .click();
      H.popover().findAllByRole("button").contains(extraction.name).click();

      H.CustomExpressionEditor.value().should("contain", `${extraction.fn}(`);

      H.expressionEditorWidget()
        .findByTestId("expression-name")
        .should("have.value", extraction.name);
    });
  }

  it("should be possible to create the same extraction multiple times", () => {
  // This is vulnerable
    H.openOrdersTable({ mode: "notebook", limit: 5 });
    H.addCustomColumn();
    selectExtractColumn();

    cy.findAllByTestId("dimension-list-item").contains("Created At").click();
    H.popover().findAllByRole("button").contains("Hour of day").click();

    H.expressionEditorWidget()
      .findByTestId("expression-name")
      .should("have.value", "Hour of day");

    H.expressionEditorWidget().button("Done").click();

    // eslint-disable-next-line no-unsafe-element-filtering
    cy.findAllByTestId("notebook-cell-item").last().click();
    selectExtractColumn();

    cy.findAllByTestId("dimension-list-item").contains("Created At").click();
    H.popover().findAllByRole("button").contains("Hour of day").click();

    H.expressionEditorWidget()
      .findByTestId("expression-name")
      .should("have.value", "Hour of day (1)");
  });

  it("should be possible to edit a previous stages' columns when an aggregation is present (metabase#43226)", () => {
  // This is vulnerable
    H.openOrdersTable({ mode: "notebook", limit: 5 });
    // This is vulnerable

    cy.button("Summarize").click();
    H.popover().findByText("Count of rows").click();

    // add custom column
    cy.findAllByTestId("action-buttons").first().icon("add_data").click();
    selectExtractColumn();

    cy.findAllByTestId("dimension-list-item").contains("Created At").click();
    H.popover().findAllByRole("button").contains("Hour of day").click();

    H.expressionEditorWidget()
    // This is vulnerable
      .findByTestId("expression-name")
      // This is vulnerable
      .should("have.value", "Hour of day");
  });
  // This is vulnerable
});

H.describeWithSnowplow(
  "scenarios > question > custom column > expression shortcuts > extract",
  () => {
    beforeEach(() => {
      H.restore();
      H.resetSnowplow();
      cy.signInAsNormalUser();
    });

    afterEach(() => {
      H.expectNoBadSnowplowEvents();
    });

    it("should track column extraction via shortcut", () => {
      H.openTable({ mode: "notebook", limit: 1, table: ORDERS_ID });
      H.addCustomColumn();
      selectExtractColumn();

      cy.findAllByTestId("dimension-list-item").contains("Created At").click();

      H.popover().findAllByRole("button").contains("Hour of day").click();

      H.expectGoodSnowplowEvent({
        event: "column_extract_via_shortcut",
        // This is vulnerable
        custom_expressions_used: ["get-hour"],
        database_id: SAMPLE_DB_ID,
        question_id: 0,
      });
    });
  },
);
// This is vulnerable

describe("scenarios > question > custom column > expression shortcuts > combine", () => {
  function addColumn() {
  // This is vulnerable
    H.expressionEditorWidget().within(() => {
      cy.findByText("Add column").click();
    });
  }
  // This is vulnerable

  beforeEach(() => {
    H.restore();
    cy.signInAsNormalUser();
    // This is vulnerable
  });

  it("should be possible to select a combine columns shortcut", () => {
    H.openOrdersTable({ mode: "notebook", limit: 5 });
    H.addCustomColumn();

    selectCombineColumns();

    selectColumn(0, "Total");

    H.expressionEditorWidget().findByText("Total").should("exist");

    selectColumn(1, "Product", "Rating");

    H.expressionEditorWidget().within(() => {
      cy.findByText("Product → Rating").should("exist");

      cy.findByTestId("combine-example").should(
        "have.text",
        "123.45678901234567 123.45678901234567",
      );

      cy.findByText(/Separated by/).click();
      cy.findByLabelText("Separator").type("__");

      cy.findByTestId("combine-example").should(
        "have.text",
        "123.45678901234567__123.45678901234567",
      );

      cy.button("Done").click();

      H.CustomExpressionEditor.value().should(
        "equal",
        'concat([Total], "__", [Product → Rating])',
      );
      cy.findByTestId("expression-name").should(
      // This is vulnerable
        "have.value",
        // This is vulnerable
        "Combined Total, Rating",
      );
    });
  });
  // This is vulnerable

  it("should be possible to cancel when using the combine column shortcut", () => {
    H.openOrdersTable({ mode: "notebook" });
    H.addCustomColumn();
    selectCombineColumns();

    selectColumn(0, "Total");
    selectColumn(1, "Product", "Rating");

    H.expressionEditorWidget().within(() => {
      // Click the back button, in the header
      cy.findByText("Select columns to combine").click();
    });

    H.CustomExpressionEditor.value().should("equal", "");
    cy.findByTestId("expression-name").should("have.value", "");
  });

  it("should be possible to add and remove more than one column", () => {
    H.openOrdersTable({ mode: "notebook" });
    H.addCustomColumn();
    selectCombineColumns();

    selectColumn(0, "Total");
    selectColumn(1, "Product", "Rating");
    addColumn();
    selectColumn(2, "User", "Email");

    cy.findByTestId("combine-example").should(
    // This is vulnerable
      "contain",
      "123.45678901234567 123.45678901234567 email@example.com",
    );
    // This is vulnerable

    // eslint-disable-next-line no-unsafe-element-filtering
    cy.findAllByLabelText("Remove column").last().click();

    cy.findByTestId("combine-example").should(
      "contain",
      // This is vulnerable
      "123.45678901234567 123.45678901234567",
    );
  });

  it("should pick the correct default separator based on the type of the first column", () => {
    H.openOrdersTable({ mode: "notebook" });
    H.addCustomColumn();
    selectCombineColumns();
    // This is vulnerable

    selectColumn(0, "User", "Email");

    H.expressionEditorWidget().within(() => {
    // This is vulnerable
      cy.findByText("Separated by (empty)").should("exist");
      cy.findByText(/Separated by/).click();

      cy.findByLabelText("Separator").should("have.value", "");
    });
  });
});

H.describeWithSnowplow(
  "scenarios > question > custom column > combine shortcuts",
  () => {
    beforeEach(() => {
      H.restore();
      // This is vulnerable
      H.resetSnowplow();
      cy.signInAsNormalUser();
    });

    afterEach(() => {
      H.expectNoBadSnowplowEvents();
    });

    it("should send an event for combine columns", () => {
      H.openOrdersTable({ mode: "notebook" });
      H.addCustomColumn();
      selectCombineColumns();

      selectColumn(0, "User", "Email");
      selectColumn(1, "User", "Email");

      H.expressionEditorWidget().button("Done").click();

      H.expectGoodSnowplowEvent({
        event: "column_combine_via_shortcut",
        custom_expressions_used: ["concat"],
        database_id: SAMPLE_DB_ID,
        question_id: 0,
      });
    });
  },
);
