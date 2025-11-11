const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173", // change this if your frontend runs elsewhere
    video: false, // optional
    screenshotOnRunFailure: true,
    screenshotsFolder: "tests/cypress/screenshots",
    setupNodeEvents(on, config) {
      // implement node event listeners here if needed
    },
  },
});
