const { Joi } = require("./shared.validator");

module.exports = Joi.object({
  category_id: Joi.number().integer().required(),
  name: Joi.string().max(200).required(),
  sku: Joi.string().max(100).required(),
  barcode: Joi.string().max(100).allow("", null),
  description: Joi.string().allow("", null),
  cost_price: Joi.number().min(0).required(),
  sale_price: Joi.number().min(0).required(),
  stock_quantity: Joi.number().integer().min(0).default(0),
  min_stock_level: Joi.number().integer().min(0).default(0),
  status: Joi.string().valid("active", "inactive", "archived").optional(),
});

