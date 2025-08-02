const router = require("express").Router();
const { createGoalFunding, updateGoalFunding, deleteFundingById, getAllGoalFundings } = require("../controllers/GoalFunding");
const AuthService = require("../utils/AuthService");


router.route("/")
.post(AuthService.protect,createGoalFunding)
.get(AuthService.protect , getAllGoalFundings)

router.route("/:id")
// .get(AuthService.protect , getExpenseById)
.put(AuthService.protect,updateGoalFunding)
.delete(AuthService.protect , deleteFundingById)
module.exports = router;