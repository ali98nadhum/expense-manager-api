const router = require("express").Router();
const { createExpense, updateExpenseById, getAllExpense, getExpenseById } = require("../controllers/expenseController");
const AuthService = require("../utils/AuthService");


router.route("/")
.post(AuthService.protect,createExpense)
.get(AuthService.protect , getAllExpense)

router.route("/:id")
.get(AuthService.protect , getExpenseById)
.put(AuthService.protect,updateExpenseById)

module.exports = router;