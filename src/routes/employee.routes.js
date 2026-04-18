const express = require("express");
const controller = require("../controllers/employee.controller");
const validate = require("../middleware/validate.middleware");
const schema = require("../validators/employee.validator");
const roleMiddleware = require("../middleware/role.middleware");

const router = express.Router();

router.get("/", roleMiddleware("admin", "manager"), controller.list);
router.get("/:id", roleMiddleware("admin", "manager"), controller.getById);
router.post("/", roleMiddleware("admin"), validate(schema), controller.create);
router.put("/:id", roleMiddleware("admin"), validate(schema), controller.update);
router.delete("/:id", roleMiddleware("admin"), controller.remove);

module.exports = router;
