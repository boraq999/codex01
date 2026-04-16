const productModel = require("../models/product.model");
const buildCrudService = require("./crudFactory.service");

const baseService = buildCrudService({
  entityType: "product",
  model: productModel,
});

const listDetailed = () => productModel.findDetailed();

module.exports = {
  ...baseService,
  listDetailed,
};

