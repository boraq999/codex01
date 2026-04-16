const customerService = require("../services/customer.service");
const buildCrudController = require("./crudFactory.controller");

module.exports = buildCrudController(customerService, "Customer");

