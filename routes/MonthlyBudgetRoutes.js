const router = require("express").Router();
const { createMonthlyBudget, updateMonthlyBudget, getAllMonthlyBudget, deleteMonthlyBudget, getMonthlyBudgetById } = require("../controllers/MonthlyBudgetControllers");
const AuthService = require("../utils/AuthService");


router.route("/")
.post(AuthService.protect,createMonthlyBudget)
.get(AuthService.protect , getAllMonthlyBudget)

router.route("/:id")
.get(AuthService.protect , getMonthlyBudgetById)
.put(AuthService.protect,updateMonthlyBudget)
.delete(AuthService.protect , deleteMonthlyBudget)

module.exports = router;