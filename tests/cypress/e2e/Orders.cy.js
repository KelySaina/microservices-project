import { login } from "../support/login";

describe("Orders Functionality", () => {
  beforeEach(() => {
    cy.viewport(1280, 720);
    login("admin@ks.ks", "admin");
    cy.visit("/orders");
  });

  it("shows loading then displays orders", () => {
    cy.contains("Loading orders...").should("exist");
    cy.contains(/Order #/i, { timeout: 10000 }).should("exist");
  });

  it("checks cart visibility and performs checkout", () => {
    cy.visit("/");

    // Add product to cart
    cy.get(".grid > :first-child button")
      .contains(/add to cart/i)
      .click();

    cy.contains("Your Cart").should("exist");

    // Proceed to checkout
    cy.contains(/checkout/i).click();

    // Confirm alert
    cy.on("window:alert", (text) => {
      expect(text).to.match(/Order #[0-9]+ created!/);
    });

    // Should redirect to orders
    cy.url({ timeout: 10000 }).should("include", "/orders");
    cy.contains(/Order #/i).should("exist");
  });

  it("filters orders by status", () => {
    cy.visit("/orders");

    cy.get("select").select("pending");
    cy.contains(/pending/i).should("exist");

    cy.get("select").select("paid");
    cy.contains(/paid/i).should("exist");

    cy.get("select").select("cancelled");
    cy.contains(/cancelled/i).should("exist");
  });

  it("creates and updates order status (pay then cancel new one)", () => {
    // ✅ Step 1: Create and pay an order
    cy.visit("/");
    cy.get(".grid > :first-child button")
      .contains(/add to cart/i)
      .click();

    cy.contains(/checkout/i).click();

    let createdOrderId;

    cy.on("window:alert", (text) => {
      const match = text.match(/Order #(\d+) created!/);
      if (match) createdOrderId = match[1];
      expect(text).to.match(/Order #[0-9]+ created!/);
    });

    cy.visit("/orders");

    cy.contains(/checkout/i).click();

    // Pay first pending order
    cy.contains("Pay", { matchCase: false })
      .first()
      .click({ force: true });

    cy.contains(/paid/i, { timeout: 10000 }).should("exist");

    // ✅ Step 2: Create a new order to cancel
    cy.visit("/");
    cy.get(".grid > :first-child button")
      .contains(/add to cart/i)
      .click();

    cy.contains(/checkout/i).click();

    cy.on("window:alert", (text) => {
      const match = text.match(/Order #(\d+) created!/);
      if (match) createdOrderId = match[1];
    });

    cy.visit("/orders");

    cy.contains(/checkout/i).click();

    // Cancel the new order
    cy.contains("Cancel", { matchCase: false })
      .first()
      .click({ force: true });

    cy.contains(/cancelled/i, { timeout: 10000 }).should("exist");
  });

  it("handles pagination correctly", () => {
    cy.visit("/orders");

    cy.contains("Next").should("exist");

    cy.contains("Next").click();
    cy.contains("Page 2").should("exist");

    cy.contains("Prev").click();
    cy.contains("Page 1").should("exist");
  });
});
