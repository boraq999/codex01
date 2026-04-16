const customerModel = require("../models/customer.model");
const buildCrudService = require("./crudFactory.service");

module.exports = buildCrudService({
  entityType: "customer",
  model: customerModel,
});

