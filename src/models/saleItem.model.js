const BaseModel = require("./base.model");
const { query } = require("../config/db");

class SaleItemModel extends BaseModel {
  constructor() {
    super("sale_items");
  }

  async findBySaleId(saleId) {
    return query(
      `
        SELECT si.*, p.name AS product_name, p.sku
        FROM sale_items si
        LEFT JOIN products p ON p.id = si.product_id
        WHERE si.sale_id = :saleId
        ORDER BY si.id ASC
      `,
      { saleId }
    );
  }
}

module.exports = new SaleItemModel();

