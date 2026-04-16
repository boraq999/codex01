const Joi = require("joi");

const statusSchema = Joi.string().valid("active", "inactive", "archived", "suspended", "draft", "completed", "cancelled");

module.exports = {
  Joi,
  statusSchema,
};

