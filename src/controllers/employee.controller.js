const employeeService = require("../services/employee.service");
const buildCrudController = require("./crudFactory.controller");

module.exports = buildCrudController(employeeService, "Employee");

