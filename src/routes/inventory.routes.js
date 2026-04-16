const express = require("express");
const controller = require("../controllers/inventory.controller");
const validate = require("../middleware/validate.middleware");
const schema = require("../validators/inventory.validator");

const router = express.Router();

router.get("/", controller.list);
router.get("/product/:productId", controller.listByProduct);
router.post("/adjust", validate(schema), controller.adjustStock);

module.exports = router;

