const BaseModel = require("./base.model");
const { query } = require("../config/db");

class SaleModel extends BaseModel {
  constructor() {
    super("sales");
  }

  async findAllDetailed() {
    return query(`
      SELECT s.*, c.full_name AS customer_name
      FROM sales s
      LEFT JOIN customers c ON c.id = s.customer_id
      ORDER BY s.id DESC
    `);
  }
}

module.exports = new SaleModel();

