const AppError = require("../utils/appError");
const activityLogService = require("./activityLog.service");

const buildCrudService = ({ entityType, model, defaultStatus = "active" }) => {
  const list = async () => model.findAll();

  const getById = async (id) => {
    const entity = await model.findById(id);
    if (!entity) {
      throw new AppError(`${entityType} not found.`, 404);
    }
    return entity;
  };

  const create = async (payload, userId) => {
    const entity = await model.create({
      ...payload,
      status: payload.status || defaultStatus,
    });

    await activityLogService.create({
      entity_type: entityType,
      entity_id: entity.id,
      action: "created",
      description: `${entityType} created successfully.`,
      performed_by: userId || null,
      metadata: entity,
    });

    return entity;
  };

  const update = async (id, payload, userId) => {
    await getById(id);

    const entity = await model.update(id, payload);

    await activityLogService.create({
      entity_type: entityType,
      entity_id: id,
      action: "updated",
      description: `${entityType} updated successfully.`,
      performed_by: userId || null,
      metadata: payload,
    });

    return entity;
  };

  const remove = async (id, userId) => {
    await getById(id);
    await model.delete(id);

    await activityLogService.create({
      entity_type: entityType,
      entity_id: id,
      action: "deleted",
      description: `${entityType} deleted successfully.`,
      performed_by: userId || null,
      metadata: null,
    });

    return true;
  };

  return {
    list,
    getById,
    create,
    update,
    remove,
  };
};

module.exports = buildCrudService;

