const express = require("express");
const controller = require("../controllers/activityLog.controller");

const router = express.Router();

router.get("/", controller.list);
router.get("/:entityType/:entityId", controller.listByEntity);

module.exports = router;

