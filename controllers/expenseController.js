const { PrismaClient } = require("@prisma/client");
const asyncHandler = require("express-async-handler");
const prisma = new PrismaClient();




// ==================================
// @desc Get all expense
// @route /api/v1/auth/expense
// @method GET
// @access private ( for user login )
// ==================================
module.exports.getAllExpense = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const expenses = await prisma.expense.findMany({
    where: {
      userId: userId,
    },
    include:{wallet: true},
    orderBy: {
      date: 'desc',
    },
  });

  res.status(200).json({data: expenses});
});



module.exports.getExpenseById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const expense = await prisma.expense.findUnique({
    where: { id: parseInt(id) },
    include: { wallet: true }
  });

  if (!expense) {
    return res.status(404).json({ message: "لم يتم العثور على المصروف" });
  }

  if (expense.userId !== userId) {
    return res.status(403).json({ message: "ليس لديك صلاحية لعرض هذا المصروف" });
  }

  res.status(200).json({
    message: "تم جلب المصروف بنجاح",
    data: expense,
  });
});






// ==================================
// @desc Creater new expense
// @route /api/v1/auth/expense
// @method POST
// @access private ( for user login )
// ==================================
module.exports.createExpense = asyncHandler(async (req, res) => {
  const { title, amount, category, date, note , walletId } = req.body;
  const userId = req.user.id;

 const wallet = await prisma.wallet.findUnique({
  where: {id: parseInt(walletId) },
 })
 if(!wallet){
  return res.status(404).json({ message: "المحفظة غير موجودة" });
 }

 await prisma.wallet.update({
  where: {id: parseInt(walletId) },
  data: {
    balance: wallet.balance - parseFloat(amount)
  }

 })

  const expense = await prisma.expense.create({
    data: {
      title,
      amount: parseFloat(amount),
      category,
      date: date ? new Date(date) : new Date(),
      note,
      walletId,
      userId,
    },
  });

  res.status(201).json({
    message: "تمت إضافة المصروف بنجاح",
    data: expense,
  });
});


// ==================================
// @desc Update expense
// @route /api/v1/auth/expense/:id
// @method PUT
// @access private ( for user login )
// ==================================
module.exports.updateExpenseById = asyncHandler(async (req, res) => {
  const { title, amount, category, date, note } = req.body;
  const { id } = req.params;
  const userId = req.user.id;

  const expense = await prisma.expense.findUnique({
    where: { id: parseInt(id) },
    include: { wallet: true }
  });

  if (!expense) {
    return res.status(404).json({ message: "لا يوجد مصروف بهذا المعرف" });
  }

  if (expense.userId !== userId) {
    return res.status(403).json({ message: "ليس لديك صلاحية لتحديث هذا المصروف" });
  }

  const amountDifference = parseFloat(amount) - expense.amount;
  const updatedWalletBalance = expense.wallet.balance - amountDifference;

  await prisma.wallet.update({
    where: { id: expense.wallet.id },
    data: { balance: updatedWalletBalance }
  })

  const updatedExpense = await prisma.expense.update({
    where: { id: parseInt(id) },
    data: {
      title: title ?? expense.title,
      amount: amount ?? expense.amount,
      category: category ?? expense.category,
      date: date ?? expense.date,
      note: note ?? expense.note,
    },
  });

  return res.status(200).json({
    message: "تم تحديث المصروف بنجاح",
    data: updatedExpense,
  });
});



module.exports.deleteExpenseById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const expense = await prisma.expense.findUnique({
    where: { id: parseInt(id) },
  });

  if (!expense) {
    return res.status(404).json({ message: "لم يتم العثور على المصروف" });
  }

  if (expense.userId !== userId) {
    return res.status(403).json({ message: "ليس لديك صلاحية لحذف هذا المصروف" });
  }

  await prisma.expense.delete({
    where: { id: parseInt(id) },
  });

  res.status(200).json({ message: "تم حذف المصروف بنجاح" });
});



