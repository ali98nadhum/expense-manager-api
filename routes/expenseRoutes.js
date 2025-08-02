const router = require("express").Router();
const { createExpense, updateExpenseById, getAllExpense } = require("../controllers/expenseController");
const AuthService = require("../utils/AuthService");


router.route("/")
.post(AuthService.protect,createExpense)
.get(AuthService.protect , getAllExpense)

router.route("/:id")
.put(AuthService.protect,updateExpenseById)

module.exports = router;