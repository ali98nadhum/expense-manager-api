const router = require("express").Router();
const { registerUser, login } = require("../controllers/authController");


router.route("/register").post(registerUser);
router.route("/login").post(login);
// router.route("/change-password").post(AuthService.protect , changePassword)

module.exports = router;