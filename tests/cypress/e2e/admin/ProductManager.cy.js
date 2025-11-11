import { login } from "../../support/login";

describe("Admin Product Stock Management", () => {
  const testProduct = {
    name: "Cypress Test Product",
    description: "Temporary product for stock update test",
    price: "20",
    stock: "15",
  };

  beforeEach(() => {
    login("admin@ks.ks", "admin");
    cy.visit("/backoffice/products");
  });

  it("should add a test product, set stock to 0, and restore it", () => {
    // --- Step 1: Add Test Product ---
    cy.contains("+ Add Product").click();

    cy.get("input[placeholder='Name']").type(testProduct.name);
    cy.get("input[placeholder='Price']").type(testProduct.price);
    cy.get("textarea[placeholder='Description']").type(testProduct.description);
    cy.get("input[placeholder='Stock']").type(testProduct.stock);
    cy.get("[data-cy=submit-button]").click();

    // Verify product appears
    cy.contains("td", testProduct.name).should("exist");

    // --- Step 2: Edit stock -> Set to 0 ---
    cy.contains("tr", testProduct.name)
      .within(() => {
        cy.contains("Edit Stock").click();
      });

    cy.get("input[placeholder='Stock']").clear().type("0");
    cy.contains("Update").click();

    // Verify stock shows 0
    cy.contains("tr", testProduct.name)
      .find("td")
      .eq(2)
      .should("contain.text", "0");

    // --- Step 3: Restore stock to previous value ---
    cy.contains("tr", testProduct.name)
      .within(() => {
        cy.contains("Edit Stock").click();
      });

    cy.get("input[placeholder='Stock']").clear().type(testProduct.stock);
    cy.contains("Update").click();

    cy.contains("tr", testProduct.name)
      .find("td")
      .eq(2)
      .should("contain.text", testProduct.stock);
  });
});
