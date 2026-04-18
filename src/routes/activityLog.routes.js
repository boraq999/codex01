const express = require("express");
const controller = require("../controllers/activityLog.controller");
const roleMiddleware = require("../middleware/role.middleware");

const router = express.Router();

router.get("/", roleMiddleware("admin", "manager"), controller.list);
router.get("/:entityType/:entityId", roleMiddleware("admin", "manager"), controller.listByEntity);

module.exports = router;
