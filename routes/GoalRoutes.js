const router = require("express").Router();
const { createGoal, updateGoal, getAllGoal } = require("../controllers/GoalControllers");
const AuthService = require("../utils/AuthService");


router.route("/")
.post(AuthService.protect,createGoal)
.get(AuthService.protect , getAllGoal)

router.route("/:id")
// .get(AuthService.protect , getExpenseById)
.put(AuthService.protect,updateGoal)
// .delete(AuthService.protect , deleteExpenseById)

module.exports = router;