const { Joi } = require("./shared.validator");

module.exports = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});
