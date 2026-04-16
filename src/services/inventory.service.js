const { withTransaction } = require("../config/db");
const productModel = require("../models/product.model");
const inventoryTransactionModel = require("../models/inventoryTransaction.model");
const activityLogService = require("./activityLog.service");
const AppError = require("../utils/appError");

const list = () => inventoryTransactionModel.findAll();

const listByProduct = (productId) => inventoryTransactionModel.findByProduct(productId);

const adjustStock = async ({ product_id, quantity, notes, transaction_type }, userId) => {
  return withTransaction(async (connection) => {
    const product = await productModel.findById(product_id);
    if (!product) {
      throw new AppError("Product not found.", 404);
    }

    const stockBefore = product.stock_quantity;
    const stockAfter = transaction_type === "adjustment_remove" ? stockBefore - quantity : stockBefore + quantity;

    if (stockAfter < 0) {
      throw new AppError("Stock cannot go below zero.", 400);
    }

    await productModel.update(product_id, { stock_quantity: stockAfter }, connection);

    const transaction = await inventoryTransactionModel.create(
      {
        product_id,
        reference_type: "manual",
        reference_id: null,
        transaction_type,
        quantity,
        stock_before: stockBefore,
        stock_after: stockAfter,
        notes: notes || null,
        created_by: userId || null,
      },
      connection
    );

    await activityLogService.create(
      {
        entity_type: "product",
        entity_id: product_id,
        action: transaction_type,
        description: `Manual stock adjustment completed for product #${product_id}.`,
        performed_by: userId || null,
        metadata: { quantity, stockBefore, stockAfter, notes },
      },
      connection
    );

    return transaction;
  });
};

module.exports = {
  list,
  listByProduct,
  adjustStock,
};

