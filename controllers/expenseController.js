const { PrismaClient } = require("@prisma/client");
const asyncHandler = require("express-async-handler");
const prisma = new PrismaClient();




// ==================================
// @desc Creater new expense
// @route /api/v1/auth/expense
// @method POST
// @access private ( for user login )
// ==================================
module.exports.createExpense = asyncHandler(async (req, res) => {
  const { title, amount, category, date, note } = req.body;

  const userId = req.user.id;

  if (!title || !amount || !category) {
    return res.status(400).json({ message: "يرجى ملء جميع الحقول المطلوبة" });
  }

  const expense = await prisma.expense.create({
    data: {
      title,
      amount: parseFloat(amount),
      category,
      date: date ? new Date(date) : new Date(),
      note,
      userId,
    },
  });

  res.status(201).json({
    message: "تمت إضافة المصروف بنجاح",
    data: expense,
  });
});





