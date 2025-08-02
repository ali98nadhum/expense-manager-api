const router = require("express").Router();
const { createExpense } = require("../controllers/expenseController");
const AuthService = require("../utils/AuthService");


router.route("/").post(AuthService.protect,createExpense);
// router.route("/login").post(login);
// router.route("/change-password").post(AuthService.protect , changePassword)

module.exports = router;