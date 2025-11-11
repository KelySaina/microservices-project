describe("Login flow (E2E)", () => {

  beforeEach(() => {
    // Replace with your frontend URL (service exposed via Ingress or localhost)
    cy.visit("http://localhost:5173/login");
  });

  it("should successfully login with valid credentials", () => {
    cy.get("input[placeholder='Email']").type("ks@ks.ks");
    cy.get("input[placeholder='Password']").type("ks");
    cy.get("button[type='submit']").click();

    // Wait for redirect and verify landing page
    cy.url().should("not.include", "/login");
    cy.url().should("include", "/");
    cy.contains("MyShop").should("exist");
  });

  it("should show an error for invalid credentials", () => {
    cy.get("input[placeholder='Email']").type("wrong@example.com");
    cy.get("input[placeholder='Password']").type("wrongpass");
    cy.get("button[type='submit']").click();

    cy.contains("Invalid credentials").should("be.visible");
    cy.url().should("include", "/login");
  });
});
