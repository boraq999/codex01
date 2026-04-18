const express = require("express");
const controller = require("../controllers/category.controller");
const validate = require("../middleware/validate.middleware");
const schema = require("../validators/category.validator");
const roleMiddleware = require("../middleware/role.middleware");

const router = express.Router();

router.get("/", controller.list);
router.get("/:id", controller.getById);
router.post("/", roleMiddleware("admin", "manager"), validate(schema), controller.create);
router.put("/:id", roleMiddleware("admin", "manager"), validate(schema), controller.update);
router.delete("/:id", roleMiddleware("admin"), controller.remove);

module.exports = router;
