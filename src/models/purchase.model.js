const BaseModel = require("./base.model");
const { query } = require("../config/db");

class PurchaseModel extends BaseModel {
  constructor() {
    super("purchases");
  }

  async findAllDetailed() {
    return query(`
      SELECT p.*, s.name AS supplier_name
      FROM purchases p
      LEFT JOIN suppliers s ON s.id = p.supplier_id
      ORDER BY p.id DESC
    `);
  }
}

module.exports = new PurchaseModel();

