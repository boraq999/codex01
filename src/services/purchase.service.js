const { withTransaction } = require("../config/db");
const purchaseModel = require("../models/purchase.model");
const purchaseItemModel = require("../models/purchaseItem.model");
const productModel = require("../models/product.model");
const inventoryTransactionModel = require("../models/inventoryTransaction.model");
const activityLogService = require("./activityLog.service");
const generateCode = require("../utils/generateCode");
const AppError = require("../utils/appError");

const list = () => purchaseModel.findAllDetailed();

const getById = async (id) => {
  const purchase = await purchaseModel.findById(id);
  if (!purchase) {
    throw new AppError("Purchase not found.", 404);
  }

  const items = await purchaseItemModel.findByPurchaseId(id);
  return { ...purchase, items };
};

const create = async (payload, userId) => {
  return withTransaction(async (connection) => {
    const sequence = Date.now().toString().slice(-3);
    const purchase = await purchaseModel.create(
      {
        purchase_no: generateCode("PUR", sequence),
        supplier_id: payload.supplier_id,
        created_by: userId || null,
        purchase_date: payload.purchase_date,
        subtotal: payload.subtotal,
        discount: payload.discount || 0,
        tax: payload.tax || 0,
        total_amount: payload.total_amount,
        status: payload.status || "completed",
        notes: payload.notes || null,
      },
      connection
    );

    for (const item of payload.items) {
      const product = await productModel.findById(item.product_id);
      if (!product) {
        throw new AppError(`Product ${item.product_id} not found.`, 404);
      }

      await purchaseItemModel.create(
        {
          purchase_id: purchase.id,
          product_id: item.product_id,
          quantity: item.quantity,
          unit_cost: item.unit_cost,
          line_total: item.line_total,
        },
        connection
      );

      const stockBefore = product.stock_quantity;
      const stockAfter = stockBefore + item.quantity;

      await productModel.update(
        product.id,
        {
          cost_price: item.unit_cost,
          stock_quantity: stockAfter,
        },
        connection
      );

      await inventoryTransactionModel.create(
        {
          product_id: product.id,
          reference_type: "purchase",
          reference_id: purchase.id,
          transaction_type: "purchase_in",
          quantity: item.quantity,
          stock_before: stockBefore,
          stock_after: stockAfter,
          notes: `Purchase ${purchase.purchase_no}`,
          created_by: userId || null,
        },
        connection
      );
    }

    await activityLogService.create(
      {
        entity_type: "purchase",
        entity_id: purchase.id,
        action: "created",
        description: `Purchase ${purchase.purchase_no} created successfully.`,
        performed_by: userId || null,
        metadata: payload,
      },
      connection
    );

    return getById(purchase.id);
  });
};

const cancel = async (id, userId) => {
  return withTransaction(async (connection) => {
    const purchase = await purchaseModel.findById(id);
    if (!purchase) {
      throw new AppError("Purchase not found.", 404);
    }

    if (purchase.status === "cancelled") {
      throw new AppError("Purchase is already cancelled.", 400);
    }

    const items = await purchaseItemModel.findByPurchaseId(id);

    for (const item of items) {
      const product = await productModel.findById(item.product_id);
      if (!product) continue;

      const stockBefore = product.stock_quantity;
      const stockAfter = stockBefore - item.quantity;

      if (stockAfter < 0) {
        throw new AppError(
          `Cannot cancel: insufficient stock for product ${product.name}.`,
          400
        );
      }

      await productModel.update(
        product.id,
        { stock_quantity: stockAfter },
        connection
      );

      await inventoryTransactionModel.create(
        {
          product_id: product.id,
          reference_type: "purchase",
          reference_id: purchase.id,
          transaction_type: "purchase_in",
          quantity: -item.quantity,
          stock_before: stockBefore,
          stock_after: stockAfter,
          notes: `Purchase ${purchase.purchase_no} cancelled - stock reversed`,
          created_by: userId || null,
        },
        connection
      );
    }

    await purchaseModel.update(id, { status: "cancelled" }, connection);

    await activityLogService.create(
      {
        entity_type: "purchase",
        entity_id: purchase.id,
        action: "cancelled",
        description: `Purchase ${purchase.purchase_no} cancelled and inventory reversed.`,
        performed_by: userId || null,
      },
      connection
    );

    return getById(id);
  });
};

module.exports = {
  list,
  getById,
  create,
  cancel,
};

