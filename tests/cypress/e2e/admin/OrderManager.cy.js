import { login } from "../../support/login";

describe("Admin Orders Management", () => {
  beforeEach(() => {
    login("admin@ks.ks", "admin");
    cy.visit("/backoffice/orders");
  });

  it("displays orders and allows pagination", () => {
    cy.contains("Manage Orders").should("exist");
    cy.get("table tbody tr").should("have.length.at.least", 1);

    // Pagination buttons
    cy.get("button").contains("Next").click();
    cy.get("span").contains(/Page \d+ \/ \d+/).should("exist");
  });

  it("filters orders by status", () => {
    const statuses = ["pending", "paid", "cancelled"];

    statuses.forEach((status) => {
      cy.get("select").select(status);
      cy.wait(2000); // small wait for filtering to apply
      cy.get("table tbody tr").each(($row) => {
        cy.wrap($row)
          .find("td:nth-child(3) span")
          .invoke("text")
          .should("match", new RegExp(status, "i"));
      });
    });
  });

  it("searches orders by customer username or email", () => {
    cy.get("input[placeholder='🔍 Search by customer...']").type("admin");
    cy.wait(200); // allow filter to apply
    cy.get("table tbody tr").each(($row) => {
      cy.wrap($row)
        .find("td:nth-child(2)")
        .invoke("text")
        .should("match", /admin/i);
    });
  });

  it("refreshes orders list", () => {
    cy.contains("Refresh").click();
    cy.get("table tbody tr").should("have.length.at.least", 1);
  });
});
