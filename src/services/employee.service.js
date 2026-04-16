const employeeModel = require("../models/employee.model");
const buildCrudService = require("./crudFactory.service");

module.exports = buildCrudService({
  entityType: "employee",
  model: employeeModel,
});

