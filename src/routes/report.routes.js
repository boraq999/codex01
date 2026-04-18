const express = require("express");
const controller = require("../controllers/report.controller");
const roleMiddleware = require("../middleware/role.middleware");

const router = express.Router();

router.get("/dashboard", roleMiddleware("admin", "manager"), controller.dashboard);
router.get("/sales", roleMiddleware("admin", "manager"), controller.sales);
router.get("/purchases", roleMiddleware("admin", "manager"), controller.purchases);

module.exports = router;
