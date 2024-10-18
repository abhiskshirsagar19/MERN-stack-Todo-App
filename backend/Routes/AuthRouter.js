const { signup, login } = require("../Controllers/AuthController");
const {
  signupValidation,
  loginValidation,
} = require("../MiddleWare/AuthValidation");

const router = require("express").Router();

router.post("/login", loginValidation, login);
router.post("/register", signupValidation, signup);

module.exports = router;
