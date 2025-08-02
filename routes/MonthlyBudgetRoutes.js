const router = require("express").Router();
const { createMonthlyBudget } = require("../controllers/MonthlyBudgetControllers");
const AuthService = require("../utils/AuthService");


router.route("/")
.post(AuthService.protect,createMonthlyBudget)
// .get(AuthService.protect , getAllGoal)

router.route("/:id")
// .get(AuthService.protect , getExpenseById)
// .put(AuthService.protect,updateGoal)
// .delete(AuthService.protect , deleteExpenseById)

module.exports = router;