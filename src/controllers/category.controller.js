const categoryService = require("../services/category.service");
const buildCrudController = require("./crudFactory.controller");

module.exports = buildCrudController(categoryService, "Category");

