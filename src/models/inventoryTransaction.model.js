const BaseModel = require("./base.model");
const { query } = require("../config/db");

class InventoryTransactionModel extends BaseModel {
  constructor() {
    super("inventory_transactions");
  }

  async findByProduct(productId) {
    return query(
      `SELECT * FROM inventory_transactions WHERE product_id = :productId ORDER BY id DESC`,
      { productId }
    );
  }
}

module.exports = new InventoryTransactionModel();

