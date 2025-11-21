const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");
const {
  registerValidation,
  loginValidation,
  validate,
} = require("../middleware/validation");

router.post("/register", registerValidation, validate, AuthController.register);
router.post("/login", loginValidation, validate, AuthController.login);

module.exports = router;
