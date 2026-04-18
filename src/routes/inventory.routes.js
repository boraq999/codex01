const express = require("express");
const controller = require("../controllers/inventory.controller");
const validate = require("../middleware/validate.middleware");
const schema = require("../validators/inventory.validator");
const roleMiddleware = require("../middleware/role.middleware");

const router = express.Router();

router.get("/", roleMiddleware("admin", "manager"), controller.list);
router.get("/product/:productId", roleMiddleware("admin", "manager"), controller.listByProduct);
router.post("/adjust", roleMiddleware("admin", "manager"), validate(schema), controller.adjustStock);

module.exports = router;
