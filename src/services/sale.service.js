const { withTransaction } = require("../config/db");
const saleModel = require("../models/sale.model");
const saleItemModel = require("../models/saleItem.model");
const productModel = require("../models/product.model");
const inventoryTransactionModel = require("../models/inventoryTransaction.model");
const activityLogService = require("./activityLog.service");
const generateCode = require("../utils/generateCode");
const AppError = require("../utils/appError");

const list = () => saleModel.findAllDetailed();

const getById = async (id) => {
  const sale = await saleModel.findById(id);
  if (!sale) {
    throw new AppError("Sale not found.", 404);
  }

  const items = await saleItemModel.findBySaleId(id);
  return { ...sale, items };
};

const create = async (payload, userId) => {
  return withTransaction(async (connection) => {
    const sequence = Date.now().toString().slice(-3);
    const sale = await saleModel.create(
      {
        sale_no: generateCode("SAL", sequence),
        customer_id: payload.customer_id || null,
        created_by: userId || null,
        sale_date: payload.sale_date,
        subtotal: payload.subtotal,
        discount: payload.discount || 0,
        tax: payload.tax || 0,
        total_amount: payload.total_amount,
        payment_status: payload.payment_status || "paid",
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

      if (product.stock_quantity < item.quantity) {
        throw new AppError(`Insufficient stock for product ${product.name}.`, 400);
      }

      await saleItemModel.create(
        {
          sale_id: sale.id,
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          line_total: item.line_total,
        },
        connection
      );

      const stockBefore = product.stock_quantity;
      const stockAfter = stockBefore - item.quantity;

      await productModel.update(
        product.id,
        {
          stock_quantity: stockAfter,
        },
        connection
      );

      await inventoryTransactionModel.create(
        {
          product_id: product.id,
          reference_type: "sale",
          reference_id: sale.id,
          transaction_type: "sale_out",
          quantity: item.quantity,
          stock_before: stockBefore,
          stock_after: stockAfter,
          notes: `Sale ${sale.sale_no}`,
          created_by: userId || null,
        },
        connection
      );
    }

    await activityLogService.create(
      {
        entity_type: "sale",
        entity_id: sale.id,
        action: "created",
        description: `Sale ${sale.sale_no} created successfully.`,
        performed_by: userId || null,
        metadata: payload,
      },
      connection
    );

    return getById(sale.id);
  });
};

const cancel = async (id, userId) => {
  return withTransaction(async (connection) => {
    const sale = await saleModel.findById(id);
    if (!sale) {
      throw new AppError("Sale not found.", 404);
    }

    if (sale.status === "cancelled") {
      throw new AppError("Sale is already cancelled.", 400);
    }

    const items = await saleItemModel.findBySaleId(id);

    for (const item of items) {
      const product = await productModel.findById(item.product_id);
      if (!product) continue;

      const stockBefore = product.stock_quantity;
      const stockAfter = stockBefore + item.quantity;

      await productModel.update(
        product.id,
        { stock_quantity: stockAfter },
        connection
      );

      await inventoryTransactionModel.create(
        {
          product_id: product.id,
          reference_type: "sale",
          reference_id: sale.id,
          transaction_type: "sale_out",
          quantity: -item.quantity,
          stock_before: stockBefore,
          stock_after: stockAfter,
          notes: `Sale ${sale.sale_no} cancelled - stock reversed`,
          created_by: userId || null,
        },
        connection
      );
    }

    await saleModel.update(id, { status: "cancelled" }, connection);

    await activityLogService.create(
      {
        entity_type: "sale",
        entity_id: sale.id,
        action: "cancelled",
        description: `Sale ${sale.sale_no} cancelled and inventory reversed.`,
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

