const categoryModel = require("../models/category.model");
const buildCrudService = require("./crudFactory.service");

module.exports = buildCrudService({
  entityType: "category",
  model: categoryModel,
});

