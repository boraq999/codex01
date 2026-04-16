const { Joi } = require("./shared.validator");

const itemSchema = Joi.object({
  product_id: Joi.number().integer().required(),
  quantity: Joi.number().integer().positive().required(),
  unit_price: Joi.number().min(0).required(),
  line_total: Joi.number().min(0).required(),
});

module.exports = Joi.object({
  customer_id: Joi.number().integer().allow(null),
  sale_date: Joi.date().required(),
  subtotal: Joi.number().min(0).required(),
  discount: Joi.number().min(0).optional(),
  tax: Joi.number().min(0).optional(),
  total_amount: Joi.number().min(0).required(),
  payment_status: Joi.string().valid("pending", "paid", "partial").optional(),
  status: Joi.string().valid("draft", "completed", "cancelled").optional(),
  notes: Joi.string().allow("", null),
  items: Joi.array().items(itemSchema).min(1).required(),
});

