const express = require("express");
const controller = require("../controllers/saleReturn.controller");
const validate = require("../middleware/validate.middleware");
const schema = require("../validators/saleReturn.validator");
const roleMiddleware = require("../middleware/role.middleware");

const router = express.Router();

router.get("/", roleMiddleware("admin", "manager", "cashier"), controller.list);
router.get("/:id", roleMiddleware("admin", "manager", "cashier"), controller.getById);
router.post("/", roleMiddleware("admin", "manager", "cashier"), validate(schema), controller.create);

module.exports = router;

