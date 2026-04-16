const { Joi } = require("./shared.validator");

module.exports = Joi.object({
  name: Joi.string().max(150).required(),
  description: Joi.string().allow("", null),
  status: Joi.string().valid("active", "inactive").optional(),
});

