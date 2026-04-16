const BaseModel = require("./base.model");
const { query } = require("../config/db");

class ProductModel extends BaseModel {
  constructor() {
    super("products");
  }

  async findDetailed(filters = {}) {
    const clauses = [];
    const params = {};

    if (filters.status) {
      clauses.push("p.status = :status");
      params.status = filters.status;
    }

    if (filters.category_id) {
      clauses.push("p.category_id = :category_id");
      params.category_id = filters.category_id;
    }

    let sql = `
      SELECT
        p.*,
        c.name AS category_name
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
    `;

    if (clauses.length) {
      sql += ` WHERE ${clauses.join(" AND ")}`;
    }

    sql += " ORDER BY p.id DESC";
    return query(sql, params);
  }
}

module.exports = new ProductModel();

