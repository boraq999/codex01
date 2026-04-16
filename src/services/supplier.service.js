const supplierModel = require("../models/supplier.model");
const buildCrudService = require("./crudFactory.service");

module.exports = buildCrudService({
  entityType: "supplier",
  model: supplierModel,
});

