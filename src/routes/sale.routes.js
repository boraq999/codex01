const express = require("express");
const controller = require("../controllers/sale.controller");
const validate = require("../middleware/validate.middleware");
const schema = require("../validators/sale.validator");
const roleMiddleware = require("../middleware/role.middleware");

const router = express.Router();

router.get("/", roleMiddleware("admin", "manager", "cashier"), controller.list);
router.get("/:id", roleMiddleware("admin", "manager", "cashier"), controller.getById);
router.post("/", roleMiddleware("admin", "manager", "cashier"), validate(schema), controller.create);
router.patch("/:id/cancel", roleMiddleware("admin", "manager"), controller.cancel);

module.exports = router;
