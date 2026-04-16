const express = require("express");
const controller = require("../controllers/product.controller");
const validate = require("../middleware/validate.middleware");
const schema = require("../validators/product.validator");

const router = express.Router();

router.get("/", controller.list);
router.get("/:id", controller.getById);
router.post("/", validate(schema), controller.create);
router.put("/:id", validate(schema), controller.update);
router.delete("/:id", controller.remove);

module.exports = router;

