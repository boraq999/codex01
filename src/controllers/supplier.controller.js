const supplierService = require("../services/supplier.service");
const buildCrudController = require("./crudFactory.controller");

module.exports = buildCrudController(supplierService, "Supplier");

