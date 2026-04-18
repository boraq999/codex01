const { Joi } = require("./shared.validator");

const itemSchema = Joi.object({
  sale_item_id: Joi.number().integer().required(),
  quantity: Joi.number().integer().positive().required(),
  unit_price: Joi.number().min(0).required(),
  line_total: Joi.number().min(0).required(),
});

module.exports = Joi.object({
  sale_id: Joi.number().integer().required(),
  return_date: Joi.date().required(),
  reason: Joi.string().allow("", null),
  total_amount: Joi.number().min(0).required(),
  notes: Joi.string().allow("", null),
  items: Joi.array().items(itemSchema).min(1).required(),
});

