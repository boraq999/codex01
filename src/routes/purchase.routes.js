const express = require("express");
const controller = require("../controllers/purchase.controller");
const validate = require("../middleware/validate.middleware");
const schema = require("../validators/purchase.validator");
const roleMiddleware = require("../middleware/role.middleware");

const router = express.Router();

router.get("/", roleMiddleware("admin", "manager"), controller.list);
router.get("/:id", roleMiddleware("admin", "manager"), controller.getById);
router.post("/", roleMiddleware("admin", "manager"), validate(schema), controller.create);

module.exports = router;
