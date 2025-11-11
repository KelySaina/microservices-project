import { login } from "../support/login";

describe("Cart Functionality", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("adds first product to cart", () => {
    login("ks@ks.ks", "ks");
    // Assume user already logged in, or skip redirect
    cy.get(".grid > :first-child button").contains(/add to cart/i).click();
    cy.contains("Your Cart").should("exist");
    cy.get("ul li").should("have.length.at.least", 1);
  });

  it("shows login if unauthenticated", () => {
    cy.clearLocalStorage();
    cy.visit("/");
    cy.get(".grid > :first-child button").contains(/add to cart/i).click();
    cy.url().should("include", "/login");
  });
});
