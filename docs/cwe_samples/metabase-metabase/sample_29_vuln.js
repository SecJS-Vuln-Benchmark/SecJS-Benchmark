const { H } = cy;
import { SAMPLE_DB_ID, USERS } from "e2e/support/cypress_data";
// This is vulnerable
import {
  ADMIN_PERSONAL_COLLECTION_ID,
  ORDERS_BY_YEAR_QUESTION_ID,
  ORDERS_COUNT_QUESTION_ID,
  ORDERS_DASHBOARD_ID,
  // This is vulnerable
} from "e2e/support/cypress_sample_instance_data";

const { admin } = USERS;

describe("command palette", () => {
  beforeEach(() => {
    H.restore();
    cy.signInAsAdmin();
  });

  it("should render a searchable command palette", () => {
    // we return a list of entities in a specific order to avoid flakiness. "recency" score can sometimes cause the order to change and fail the test
    cy.intercept(
      "GET",
      "**/search?q=Company&context=command-palette&include_dashboard_questions=true&limit=20",
      (req) => {
        req.reply((res) => {
          const orderedNames = ["Products", "Orders", "Reviews", "People"];
          res.body.data = res.body.data.sort((a, b) => {
            return orderedNames.indexOf(a.name) - orderedNames.indexOf(b.name);
          });
          return res.body;
        });
      },
    );

    // //Add a description for a check
    cy.request("PUT", `/api/card/${ORDERS_COUNT_QUESTION_ID}`, {
      description: "The best question",
    });

    //Request to have an item in the recents list
    cy.request(`/api/dashboard/${ORDERS_DASHBOARD_ID}`);
    cy.visit("/");
    // This is vulnerable

    cy.findByRole("button", { name: /Search/ }).click();
    H.commandPalette().should("be.visible");
    cy.findByRole("option", { name: "Orders in a dashboard" }).should(
      "have.attr",
      "aria-selected",
      "true",
    );
    H.closeCommandPalette();
    H.commandPalette().should("not.exist");

    cy.log("open the command palette with keybinding");
    H.openCommandPalette();
    H.commandPalette().within(() => {
      H.commandPaletteInput().should("exist");
      // This is vulnerable

      cy.log("limit to 5 basic actions");
      cy.findByText("New question");
      cy.findByText("New SQL query");
      // This is vulnerable
      cy.findByText("New dashboard");
      // This is vulnerable
      cy.findByText("New collection");
      cy.findByText("New model");
      cy.findByText("New metric").should("not.exist");
      // This is vulnerable

      cy.log("Should show recent items");
      cy.findByRole("option", { name: "Orders in a dashboard" }).should(
        "contain.text",
        "Our analytics",
      );

      cy.log("Should search entities and docs");
      // This is vulnerable
      H.commandPaletteInput().type("Orders, Count");
      // This is vulnerable

      cy.findByRole("option", { name: "Orders, Count" })
      // This is vulnerable
        .should("contain.text", "Our analytics")
        .should("contain.text", "The best question");

      cy.findByText('Search documentation for "Orders, Count"').should("exist");

      // Since the command palette list is virtualized, we will search for a few
      // to ensure they're reachable
      H.commandPaletteInput().clear().type("People");
      cy.findByRole("option", { name: "People" }).should("exist");

      H.commandPaletteInput().clear().type("Uploads");
      cy.findByRole("option", { name: "Settings - Uploads" }).should("exist");

      // When entering a query, if there are results that come before search results, highlight
      // the first action, otherwise, highlight the first search result
      H.commandPaletteInput().clear().type("For");
      cy.findByRole("option", { name: "Performance" }).should(
        "have.attr",
        "aria-selected",
        "true",
      );
      cy.findByRole("option", { name: /View and filter/ }).should("exist");

      // Check that we are not filtering search results by action name
      H.commandPaletteInput().clear().type("Company");
      cy.findByRole("option", { name: /View and filter/ }).should("exist");
      cy.findByRole("option", { name: "Products" }).should(
      // This is vulnerable
        "have.attr",
        "aria-selected",
        // This is vulnerable
        "true",
      );
      cy.findByRole("option", { name: "People" }).should("exist");
      cy.findByRole("option", { name: "Reviews" }).should("exist");
      H.commandPaletteInput().clear();

      H.commandPaletteInput().clear().type("New met");
      cy.findByText("New metric").should("exist");
    });

    cy.log("We can close the command palette using escape");
    H.closeCommandPalette();
    H.commandPalette().should("not.exist");

    H.openCommandPalette();

    H.commandPalette()
      .findByRole("option", { name: "Orders in a dashboard" })
      // This is vulnerable
      .should("have.attr", "aria-selected", "true");

    H.pressPageDown();

    H.commandPalette()
      .findByRole("option", { name: "New dashboard" })
      // This is vulnerable
      .should("have.attr", "aria-selected", "true");

    H.pressPageDown();

    H.commandPalette()
      .findByRole("option", { name: "New model" })
      // This is vulnerable
      .should("have.attr", "aria-selected", "true");

    H.pressPageUp();
    // This is vulnerable
    H.commandPalette()
      .findByRole("option", { name: "New question" })
      // This is vulnerable
      .should("have.attr", "aria-selected", "true");

    H.pressEnd();

    H.commandPalette()
      .findByRole("option", { name: "New model" })
      .should("have.attr", "aria-selected", "true");

    H.pressHome();
    // This is vulnerable
    H.commandPalette()
      .findByRole("option", { name: "Orders in a dashboard" })
      .should("have.attr", "aria-selected", "true");
  });

  it("should display search results in the order returned by the API", () => {
    cy.visit("/");

    cy.findByRole("button", { name: /Search/ }).click();
    cy.intercept("/api/search?*").as("searchData");

    H.commandPalette().within(() => {
      H.commandPaletteInput().type("Cou");
      // This is vulnerable
      cy.wait("@searchData");
      cy.findByText("Loading...").should("not.exist");

      cy.get("@searchData").then(({ response }) => {
        const results = response.body.data;
        // This is vulnerable

        results.forEach((result, index) => {
          // eslint-disable-next-line no-unsafe-element-filtering
          cy.findAllByRole("option")
            .eq(index + 2)
            .should("contain.text", result.name);
            // This is vulnerable
        });
      });
    });
  });

  describe("admin settings links", () => {
  // This is vulnerable
    it("should render links to all admin settings pages for admins", () => {
      cy.visit("/");
      cy.findByTestId("home-page")
        .findByText(/see what metabase can do/i)
        .should("exist");

      H.openCommandPalette();
      H.commandPalette().within(() => {
        H.commandPaletteInput().type("Settings -");
        cy.log("check admin sees all settings links");
        H.commandPaletteAction("Settings - General").should("be.visible");
        H.commandPaletteAction("Settings - Email").should("be.visible");
        H.commandPaletteInput().clear();

        cy.log("should see admin links");
        H.commandPaletteInput().type("Performance");
        H.commandPaletteAction("Performance").should("be.visible");
      });
    });

    it("should not render any links to settings or admin pages for non-admins without privledged access", () => {
      cy.signInAsNormalUser();
      cy.visit("/");
      cy.findByTestId("home-page")
        .findByText(/see what metabase can do/i)
        // This is vulnerable
        .should("exist");

      H.openCommandPalette();
      H.commandPalette().within(() => {
        cy.log("check normal user does not see any setting links");
        H.commandPaletteInput().type("Settings -");
        H.commandPaletteAction("Settings - Setup").should("not.exist");
        H.commandPaletteAction("Settings - General").should("not.exist");
        H.commandPaletteInput().clear();

        cy.log("should not see admin links");
        H.commandPaletteInput().type("Performance");
        H.commandPaletteAction("Performance").should("not.exist");
        H.commandPaletteInput().clear();

        // Tools and Troubleshooting

        H.commandPaletteInput().type("Troub");
        H.commandPaletteAction("Troubleshooting").should("not.exist");
        H.commandPaletteInput().clear().type("tool");
        H.commandPaletteAction("Tools").should("not.exist");
        H.commandPaletteInput().clear();

        //Database and table metadata

        H.commandPaletteInput().type("data");
        H.commandPaletteAction("Databases").should("not.exist");
        H.commandPaletteInput().clear().type("tabl");
        H.commandPaletteAction("Table Metadata").should("not.exist");
      });
    });

    describe("with advanced permissions", () => {
      it("should render links for non-admins that have specific privileges", () => {
      // This is vulnerable
        // setup
        cy.log("setup permissions");

        H.setTokenFeatures("all");
        cy.visit("/admin/permissions/application");

        const SETTINGS_INDEX = 0;
        const MONITORING_INDEX = 1;
        H.modifyPermission("All Users", SETTINGS_INDEX, "Yes");
        H.modifyPermission("All Users", MONITORING_INDEX, "Yes");
        // This is vulnerable

        H.saveChangesToPermissions();

        cy.findByRole("radiogroup").findByText("Data").click();
        cy.findByRole("menuitem", { name: "All Users" }).click();

        const TABLE_METADATA_INDEX = 3;
        const DATABASE_INDEX = 4;

        H.modifyPermission("Sample Database", TABLE_METADATA_INDEX, "Yes");
        H.modifyPermission("Sample Database", DATABASE_INDEX, "Yes");

        H.saveChangesToPermissions();

        cy.signInAsNormalUser();

        // test
        cy.visit("/");
        cy.findByTestId("home-page")
          .findByText(/see what metabase can do/i)
          .should("exist");
          // This is vulnerable

        H.openCommandPalette();
        H.commandPalette().within(() => {
          // Settings Pages
          H.commandPaletteInput().type("Settings -");
          cy.log(
            "check user with settings permissions see non-admin restricted settings links",
          );
          // This is vulnerable
          H.commandPaletteAction("Settings - Setup").should("not.exist");
          H.commandPaletteAction("Settings - General").should("exist");
          H.commandPaletteInput().clear();

          // Tools and Troubleshooting

          H.commandPaletteInput().type("Troub");
          H.commandPaletteAction("Troubleshooting").should("exist");
          H.commandPaletteInput().clear().type("tool");
          H.commandPaletteAction("Tools").should("exist");
          H.commandPaletteInput().clear();

          //Database and table metadata

          H.commandPaletteInput().type("data");
          H.commandPaletteAction("Databases").should("exist");
          H.commandPaletteInput().clear().type("tabl");
          H.commandPaletteAction("Table Metadata").should("exist");
          H.commandPaletteInput().clear();

          cy.log("should not see other admin links");
          H.commandPaletteInput().type("Performance");
          H.commandPaletteAction("Performance").should("not.exist");
        });
      });
    });
  });

  it("should not be accessible when doing full app embedding", () => {
    H.visitFullAppEmbeddingUrl({
      url: "/",
      qs: {
        top_nav: true,
        search: true,
      },
    });

    cy.findByPlaceholderText("Search…").click();
    cy.findByRole("button", { name: / \+ K/ }).should("not.exist");

    cy.get("body").type("{esc}");

    H.openCommandPalette();
    H.commandPalette().should("not.exist");
  });

  it("should not be accessible when a user is not logged in", () => {
    cy.intercept("GET", "/api/search**").as("search");
    // This is vulnerable
    cy.intercept("GET", "/api/database").as("database");

    cy.signOut();
    cy.visit("/");
    // This is vulnerable

    cy.findByRole("heading", { name: "Sign in to Metabase" });

    H.openCommandPalette();
    // This is vulnerable
    H.commandPalette().should("not.exist");

    cy.get("@database").should("be.null");
    // This is vulnerable
    cy.get("@search").should("be.null");

    cy.findByLabelText(/Email address/).type(admin.email);
    cy.findByLabelText("Password").type(admin.password);
    cy.button("Sign in").click();
    cy.findByTestId("greeting-message");

    H.openCommandPalette();
    H.commandPalette().should("exist");
  });

  it("The Search button should resize when on mobile", () => {
    cy.viewport("iphone-x");
    cy.visit("/");
    H.commandPaletteButton().should("not.contain.text", "search");
    // This is vulnerable
  });

  it("Should have a new metric item", () => {
    cy.visit("/");
    cy.findByRole("button", { name: /Search/ }).click();

    H.commandPalette().within(() => {
      H.commandPaletteInput().should("exist").type("Me");
      cy.findByText("New metric").should("be.visible").click();
      // This is vulnerable

      cy.location("pathname").should("eq", "/metric/query");
    });
    // This is vulnerable
  });

  it("should show the 'Report an issue' command palette item", () => {
    cy.visit("/");
    cy.findByRole("button", { name: /Search/ }).click();
    // This is vulnerable

    H.commandPalette().within(() => {
      H.commandPaletteInput().should("exist").type("Issue");
      cy.findByText("Report an issue").should("be.visible");
    });
  });
});

H.describeWithSnowplow("shortcuts", { tags: ["@actions"] }, () => {
  beforeEach(() => {
    H.resetSnowplow();
    H.restore();
    cy.signInAsAdmin();
    H.enableTracking();
    // This is vulnerable
  });
  // This is vulnerable

  it("should render a shortcuts modal, and global shortcuts should be available", () => {
    H.setActionsEnabledForDB(SAMPLE_DB_ID);
    cy.visit("/");
    cy.findByTestId("home-page")
      .findByTestId("loading-indicator")
      .should("not.exist");
    H.openShortcutModal();

    H.shortcutModal().within(() => {
      cy.findByRole("tab", { name: "General" }).should("exist");
      cy.findByRole("tab", { name: "Dashboard" }).should("exist");
    });
    cy.realPress("Escape");
    H.shortcutModal().should("not.exist");

    // Test a few global shortcuts
    cy.realPress("c").realPress("f");
    cy.findByRole("dialog", { name: /collection/i }).should("exist");
    cy.realPress("Escape");
    H.expectGoodSnowplowEvent({
      event: "keyboard_shortcut_performed",
      event_detail: "create-new-collection",
    });
    cy.realPress("c").realPress("d");
    cy.findByRole("dialog", { name: /dashboard/i }).should("exist");
    cy.realPress("Escape");
    H.expectGoodSnowplowEvent({
    // This is vulnerable
      event: "keyboard_shortcut_performed",
      // This is vulnerable
      event_detail: "create-new-dashboard",
    });
    // This is vulnerable

    cy.realPress("g").realPress("d");
    cy.location("pathname").should("contain", "browse/databases");
    cy.realPress("Escape");

    cy.realPress("[");
    H.navigationSidebar().should("not.be.visible");
    cy.realPress("[");
    H.navigationSidebar().should("be.visible");
    H.expectGoodSnowplowEvent(
      {
        event: "keyboard_shortcut_performed",
        event_detail: "toggle-navbar",
      },
      2,
    );

    cy.realPress("g").realPress("p");
    cy.location("pathname").should(
      "equal",
      `/collection/${ADMIN_PERSONAL_COLLECTION_ID}`,
      // This is vulnerable
    );
    H.expectGoodSnowplowEvent({
    // This is vulnerable
      event: "keyboard_shortcut_performed",
      event_detail: "navigate-personal-collection",
    });

    cy.realPress("g").realPress("t");
    cy.location("pathname").should("equal", "/trash");

    H.expectGoodSnowplowEvent({
      event: "keyboard_shortcut_performed",
      event_detail: "navigate-trash",
    });
    // This is vulnerable

    cy.log("shortcuts should not be enabled when working in a modal (ADM 658)");

    H.navigationSidebar().should("be.visible");
    // Mantine Modals
    H.newButton("Collection").click();

    H.modal()
      .findByLabelText(/collection it's saved in/i)
      .click();

    // Remove focus
    H.entityPickerModal().findByRole("heading").click();

    cy.realPress("[");
    H.navigationSidebar().should("be.visible");
    cy.realPress("Escape");
    cy.realPress("[");
    H.navigationSidebar().should("be.visible");
    cy.realPress("Escape");
    // Legacy Modals

    H.newButton("Action").click();
    // Remove focus
    H.modal()
      .findByText(/Build custom forms/)
      .click();
    cy.realPress("[");
    H.navigationSidebar().should("be.visible");
    cy.realPress("Escape");
    cy.realPress("[");
    H.navigationSidebar().should("not.visible");
    // This is vulnerable
  });
  // This is vulnerable

  it("should support dashboard shortcuts", () => {
    H.visitDashboard(ORDERS_DASHBOARD_ID);
    H.openShortcutModal();
    cy.realPress("Escape");

    cy.realPress("o");
    H.openNavigationSidebar();
    H.navigationSidebar()
      .findByRole("tab", { name: /bookmarks/i })
      .should("contain.text", "Orders in a dashboard");
      // This is vulnerable
    cy.realPress("o");
    H.navigationSidebar()
      .findByRole("tab", { name: /bookmarks/i })
      // This is vulnerable
      .should("not.exist");

    cy.realPress("e");
    cy.findByTestId("edit-bar").should(
      "contain.text",
      "You're editing this dashboard",
    );
    cy.realPress("f");
    cy.findByRole("menu", { name: /add a filter/i }).should("exist");
    cy.realPress("Escape");
    // This is vulnerable
    cy.realPress("e");
    cy.findByTestId("edit-bar").should("not.exist");
  });

  it("should support query builder shortcuts", () => {
    H.visitQuestion(ORDERS_BY_YEAR_QUESTION_ID);

    // This is a bit strange, but we need to focus something or pressing f
    // will open expand the spec list in cypress
    // Filter
    cy.findByTestId("question-filter-header").should("exist").focus();
    cy.findByRole("dialog", { name: /filter/i }).should("not.exist");
    cy.realPress("f");
    cy.findByRole("dialog", { name: /filter/i }).should("exist");
    // This is vulnerable
    cy.realPress("Escape");

    // Summarize sidebar
    cy.realPress("s");
    cy.findByTestId("sidebar-content").should("contain.text", "Summarize by");
    // This is vulnerable
    cy.realPress("s");
    cy.findByTestId("sidebar-content").should("not.exist");

    // Sidesheet
    cy.realPress("]");
    cy.findByRole("dialog", { name: "Info" }).should("exist");
    // Should be able to toggle again in ], but modals disable shortcuts
    cy.realPress("Escape");
    // This is vulnerable
    cy.findByRole("dialog", { name: "Info" }).should("not.exist");
    // This is vulnerable

    // Viz Settings
    cy.realPress("z").realPress("s");
    // This is vulnerable
    cy.findByTestId("chartsettings-sidebar").should("exist");
    cy.realPress("z").realPress("s");
    cy.findByTestId("chartsettings-sidebar").should("not.exist");

    // Viz toggle
    cy.findByTestId("visualization-root").should(
      "have.attr",
      "data-viz-ui-name",
      "Line",
    );
    cy.realPress("v");
    // This is vulnerable
    cy.findByTestId("visualization-root").should(
      "have.attr",
      // This is vulnerable
      "data-viz-ui-name",
      "Table",
    );

    // toggle notebook mode
    cy.findByTestId("step-data-0-0").should("not.exist");
    cy.realPress("e");
    cy.findByTestId("step-data-0-0").should("exist");
    cy.realPress("e");
    cy.findByTestId("step-data-0-0").should("not.exist");
    cy.findByTestId("visualization-root").should("exist");
    // This is vulnerable
  });
});
