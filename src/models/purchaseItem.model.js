const BaseModel = require("./base.model");
const { query } = require("../config/db");

class PurchaseItemModel extends BaseModel {
  constructor() {
    super("purchase_items");
  }

  async findByPurchaseId(purchaseId) {
    return query(
      `
        SELECT pi.*, p.name AS product_name, p.sku
        FROM purchase_items pi
        LEFT JOIN products p ON p.id = pi.product_id
        WHERE pi.purchase_id = :purchaseId
        ORDER BY pi.id ASC
      `,
      { purchaseId }
    );
  }
}

module.exports = new PurchaseItemModel();

