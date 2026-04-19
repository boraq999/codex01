const express = require("express");
const controller = require("../controllers/auth.controller");
const validate = require("../middleware/validate.middleware");
const auth = require("../middleware/auth.middleware");
const schema = require("../validators/auth.validator");

const router = express.Router();

router.post("/login", validate(schema), controller.login);
router.get("/verify", auth, controller.verify);
router.post("/refresh", auth, controller.refresh);

module.exports = router;

