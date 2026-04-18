const BaseModel = require("./base.model");
const { query } = require("../config/db");

class SaleReturnItemModel extends BaseModel {
  constructor() {
    super("sale_return_items");
  }

  async findByReturnId(returnId) {
    return query(
      `
        SELECT sri.*, p.name AS product_name, p.sku
        FROM sale_return_items sri
        LEFT JOIN products p ON p.id = sri.product_id
        WHERE sri.sale_return_id = :returnId
        ORDER BY sri.id ASC
      `,
      { returnId }
    );
  }
}

module.exports = new SaleReturnItemModel();

