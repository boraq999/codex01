const { Joi } = require("./shared.validator");

module.exports = Joi.object({
  full_name: Joi.string().max(200).required(),
  phone: Joi.string().max(30).allow("", null),
  email: Joi.string().email().allow("", null),
  address: Joi.string().allow("", null),
  notes: Joi.string().allow("", null),
  status: Joi.string().valid("active", "inactive").optional(),
});

