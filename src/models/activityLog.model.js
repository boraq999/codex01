const BaseModel = require("./base.model");
const { query } = require("../config/db");

class ActivityLogModel extends BaseModel {
  constructor() {
    super("activity_logs");
  }

  async findByEntity(entityType, entityId) {
    return query(
      `SELECT * FROM activity_logs WHERE entity_type = :entityType AND entity_id = :entityId ORDER BY id DESC`,
      { entityType, entityId }
    );
  }
}

module.exports = new ActivityLogModel();

