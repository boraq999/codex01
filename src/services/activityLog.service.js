const activityLogModel = require("../models/activityLog.model");

const list = () => activityLogModel.findAll();

const listByEntity = (entityType, entityId) => activityLogModel.findByEntity(entityType, entityId);

const create = (payload, connection = null) => {
  const data = {
    ...payload,
    metadata: payload.metadata ? JSON.stringify(payload.metadata) : null,
  };

  return activityLogModel.create(data, connection);
};

module.exports = {
  list,
  listByEntity,
  create,
};

