const app = require("./app");
const env = require("./config/env");
const { testConnection } = require("./config/db");
const logger = require("./utils/logger");

const startServer = async () => {
  try {
    await testConnection();
    logger.info("Database connection established successfully.");
  } catch (error) {
    logger.warn("Database connection could not be established at startup.", error.message);
  }

  app.listen(env.port, () => {
    logger.info(`${env.appName} listening on port ${env.port}`);
  });
};

startServer();
