const login = (email, password) => {
  cy.visit("/login");
  cy.get("input[placeholder='Email']").type(email);
  cy.get("input[placeholder='Password']").type(password);
  cy.get("button[type='submit']").click();

  // Wait for redirect and verify landing page
  cy.url({timeout: 10000}).should("not.include", "/login");
  cy.url({timeout: 10000}).should("include", "/");
  cy.contains("My Orders", { timeout: 10000 }).should("exist");
};

export { login };