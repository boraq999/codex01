const express = require("express");
const controller = require("../controllers/sale.controller");
const validate = require("../middleware/validate.middleware");
const schema = require("../validators/sale.validator");

const router = express.Router();

router.get("/", controller.list);
router.get("/:id", controller.getById);
router.post("/", validate(schema), controller.create);

module.exports = router;

