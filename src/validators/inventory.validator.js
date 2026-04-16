const { Joi } = require("./shared.validator");

module.exports = Joi.object({
  product_id: Joi.number().integer().required(),
  quantity: Joi.number().integer().positive().required(),
  transaction_type: Joi.string().valid("adjustment_add", "adjustment_remove").required(),
  notes: Joi.string().allow("", null),
});

