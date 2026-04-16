const express = require("express");
const controller = require("../controllers/auth.controller");
const validate = require("../middleware/validate.middleware");
const schema = require("../validators/auth.validator");

const router = express.Router();

router.post("/login", validate(schema), controller.login);

module.exports = router;

