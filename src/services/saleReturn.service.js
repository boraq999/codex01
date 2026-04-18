const { withTransaction, query } = require("../config/db");
const saleModel = require("../models/sale.model");
const saleItemModel = require("../models/saleItem.model");
const saleReturnModel = require("../models/saleReturn.model");
const saleReturnItemModel = require("../models/saleReturnItem.model");
const productModel = require("../models/product.model");
const inventoryTransactionModel = require("../models/inventoryTransaction.model");
const activityLogService = require("./activityLog.service");
const generateCode = require("../utils/generateCode");
const AppError = require("../utils/appError");

const list = () => saleReturnModel.findAllDetailed();

const getById = async (id) => {
  const saleReturn = await saleReturnModel.findById(id);
  if (!saleReturn) {
    throw new AppError("Sale return not found.", 404);
  }

  const items = await saleReturnItemModel.findByReturnId(id);
  return { ...saleReturn, items };
};

const getReturnedQuantityForSaleItem = async (saleItemId, connection) => {
  const [row] = await (connection
    ? connection.execute(
        `
          SELECT COALESCE(SUM(quantity), 0) AS returned_qty
          FROM sale_return_items
          WHERE sale_item_id = :saleItemId
        `,
        { saleItemId }
      ).then(([rows]) => rows)
    : query(
        `
          SELECT COALESCE(SUM(quantity), 0) AS returned_qty
          FROM sale_return_items
          WHERE sale_item_id = :saleItemId
        `,
        { saleItemId }
      ));

  return Number(row.returned_qty || 0);
};

const create = async (payload, userId) => {
  return withTransaction(async (connection) => {
    const sale = await saleModel.findById(payload.sale_id, connection);
    if (!sale) {
      throw new AppError("Sale not found.", 404);
    }

    if (sale.status !== "completed") {
      throw new AppError("Returns are allowed only for completed sales.", 400);
    }

    const sequence = Date.now().toString().slice(-3);
    const saleReturn = await saleReturnModel.create(
      {
        return_no: generateCode("RET", sequence),
        sale_id: payload.sale_id,
        return_date: payload.return_date,
        reason: payload.reason || null,
        total_amount: payload.total_amount,
        status: "completed",
        created_by: userId || null,
        notes: payload.notes || null,
      },
      connection
    );

    for (const item of payload.items) {
      const saleItem = await saleItemModel.findById(item.sale_item_id, connection);
      if (!saleItem || saleItem.sale_id !== payload.sale_id) {
        throw new AppError(`Sale item ${item.sale_item_id} is invalid for this sale.`, 400);
      }

      const alreadyReturnedQty = await getReturnedQuantityForSaleItem(item.sale_item_id, connection);
      const availableToReturn = Number(saleItem.quantity) - alreadyReturnedQty;

      if (item.quantity > availableToReturn) {
        throw new AppError(
          `Requested return quantity (${item.quantity}) exceeds available quantity (${availableToReturn}) for sale item ${item.sale_item_id}.`,
          400
        );
      }

      const product = await productModel.findById(saleItem.product_id, connection);
      if (!product) {
        throw new AppError(`Product ${saleItem.product_id} not found.`, 404);
      }

      const stockBefore = Number(product.stock_quantity);
      const stockAfter = stockBefore + Number(item.quantity);

      await saleReturnItemModel.create(
        {
          sale_return_id: saleReturn.id,
          sale_item_id: saleItem.id,
          product_id: saleItem.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          line_total: item.line_total,
        },
        connection
      );

      await productModel.update(
        saleItem.product_id,
        {
          stock_quantity: stockAfter,
        },
        connection
      );

      await inventoryTransactionModel.create(
        {
          product_id: saleItem.product_id,
          reference_type: "return",
          reference_id: saleReturn.id,
          transaction_type: "return_in",
          quantity: item.quantity,
          stock_before: stockBefore,
          stock_after: stockAfter,
          notes: `Sale return ${saleReturn.return_no}`,
          created_by: userId || null,
        },
        connection
      );
    }

    await activityLogService.create(
      {
        entity_type: "sale_return",
        entity_id: saleReturn.id,
        action: "created",
        description: `Sale return ${saleReturn.return_no} created successfully.`,
        performed_by: userId || null,
        metadata: payload,
      },
      connection
    );

    return getById(saleReturn.id);
  });
};

module.exports = {
  list,
  getById,
  create,
};

