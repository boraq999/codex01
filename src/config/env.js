const dotenv = require("dotenv");

dotenv.config();

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 4000),
  appName: process.env.APP_NAME || "Beauty Accessories System",
  db: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "beauty_accessories_system",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "change_this_secret",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },
};

module.exports = env;

