const BaseModel = require("./base.model");
const { query } = require("../config/db");

class UserModel extends BaseModel {
  constructor() {
    super("users");
  }

  async findByUsername(username) {
    const rows = await query(
      `
        SELECT u.*, e.full_name AS employee_name
        FROM users u
        LEFT JOIN employees e ON e.id = u.employee_id
        WHERE u.username = :username
        LIMIT 1
      `,
      { username }
    );

    return rows[0] || null;
  }
}

module.exports = new UserModel();

