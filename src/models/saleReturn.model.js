const BaseModel = require("./base.model");
const { query } = require("../config/db");

class SaleReturnModel extends BaseModel {
  constructor() {
    super("sale_returns");
  }

  async findAllDetailed() {
    return query(`
      SELECT sr.*, s.sale_no, c.full_name AS customer_name
      FROM sale_returns sr
      LEFT JOIN sales s ON s.id = sr.sale_id
      LEFT JOIN customers c ON c.id = s.customer_id
      ORDER BY sr.id DESC
    `);
  }
}

module.exports = new SaleReturnModel();

