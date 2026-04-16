const { Joi } = require("./shared.validator");

module.exports = Joi.object({
  full_name: Joi.string().max(200).required(),
  phone: Joi.string().max(30).allow("", null),
  job_title: Joi.string().max(150).allow("", null),
  salary: Joi.number().min(0).optional(),
  hire_date: Joi.date().optional(),
  status: Joi.string().valid("active", "inactive", "suspended").optional(),
});

