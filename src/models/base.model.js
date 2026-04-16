const { query } = require("../config/db");

class BaseModel {
  constructor(tableName) {
    this.tableName = tableName;
  }

  async execute(sql, params = {}, connection = null) {
    if (connection) {
      const [rows] = await connection.execute(sql, params);
      return rows;
    }

    return query(sql, params);
  }

  async findAll({ filters = {}, orderBy = "id DESC", limit, offset } = {}) {
    const entries = Object.entries(filters).filter(([, value]) => value !== undefined && value !== null && value !== "");
    const clauses = [];
    const params = {};

    entries.forEach(([key, value], index) => {
      const paramKey = `filter_${index}`;
      clauses.push(`${key} = :${paramKey}`);
      params[paramKey] = value;
    });

    let sql = `SELECT * FROM ${this.tableName}`;
    if (clauses.length) {
      sql += ` WHERE ${clauses.join(" AND ")}`;
    }
    sql += ` ORDER BY ${orderBy}`;
    if (limit !== undefined) {
      sql += " LIMIT :limit OFFSET :offset";
      params.limit = limit;
      params.offset = offset || 0;
    }

    return this.execute(sql, params);
  }

  async findById(id, connection = null) {
    const rows = await this.execute(`SELECT * FROM ${this.tableName} WHERE id = :id LIMIT 1`, { id }, connection);
    return rows[0] || null;
  }

  async create(data, connection = null) {
    const keys = Object.keys(data);
    const columns = keys.join(", ");
    const placeholders = keys.map((key) => `:${key}`).join(", ");
    const [result] = connection
      ? await connection.execute(
          `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders})`,
          data
        )
      : [await query(`INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders})`, data)];
    return this.findById(result.insertId, connection);
  }

  async update(id, data, connection = null) {
    const keys = Object.keys(data);
    const assignments = keys.map((key) => `${key} = :${key}`).join(", ");
    if (connection) {
      await connection.execute(`UPDATE ${this.tableName} SET ${assignments} WHERE id = :id`, { id, ...data });
    } else {
      await query(`UPDATE ${this.tableName} SET ${assignments} WHERE id = :id`, { id, ...data });
    }
    return this.findById(id, connection);
  }

  async delete(id, connection = null) {
    if (connection) {
      await connection.execute(`DELETE FROM ${this.tableName} WHERE id = :id`, { id });
    } else {
      await query(`DELETE FROM ${this.tableName} WHERE id = :id`, { id });
    }
    return true;
  }
}

module.exports = BaseModel;
