const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


module.exports.getAllGoalFundings = asyncHandler(async (req, res) => {
  const userId = req.user.id; 
    const fundings = await prisma.goalFunding.findMany({
    where: { userId: userId },
    include: {
      goal: true,
      wallet: true,
    },
    });
    res.status(200).json({ data: fundings });
  });   




  
module.exports.createGoalFunding = asyncHandler(async (req, res) => {
  const { goalId, amount, walletId } = req.body;
  const userId = req.user.id;

  const fundingAmount = parseFloat(amount);

  const wallet = await prisma.wallet.findUnique({
    where: { id: walletId },
  });

  if (!wallet || wallet.userId !== userId) {
    return res.status(404).json({ message: "المحفظة غير موجودة أو لا تعود للمستخدم" });
  }

  const goal = await prisma.goal.findUnique({
    where: { id: goalId },
  });

  if (!goal || goal.userId !== userId) {
    return res.status(404).json({ message: "الهدف غير موجود أو لا يعود للمستخدم" });
  }

  if (wallet.balance < fundingAmount) {
    return res.status(400).json({ message: "الرصيد غير كافٍ في المحفظة" });
  }

  await prisma.wallet.update({
    where: { id: walletId },
    data: {
      balance: {
        decrement: fundingAmount,
      },
    },
  });

  await prisma.goal.update({
    where: { id: goalId },
    data: {
      currentAmount: {
        increment: fundingAmount,
      },
    },
  });

  const fundingRecord = await prisma.goalFunding.create({
    data: {
      amount: fundingAmount,
      goalId,
      walletId,
      userId,
    },
  });

  res.status(201).json({
    message: "تم تمويل الهدف بنجاح",
    data: fundingRecord,
  });
});




module.exports.updateGoalFunding = asyncHandler(async(req , res) => {
    const { id } = req.params;
    const { amount, walletId } = req.body;
    const userId = req.user.id;
    

   const funding = await prisma.goalFunding.findUnique({
    where: { id: parseInt(id) },
    include: { wallet: true, goal: true }
    });

    if (!funding) {
      return res.status(404).json({ message: "تمويل الهدف غير موجود" });
    }

    if (funding.userId !== userId) {
      return res.status(403).json({ message: "ليس لديك صلاحية لتحديث هذا التمويل" });
    }

    const amountDifference = parseFloat(amount) - funding.amount;
  const updatedWalletBalance = funding.wallet.balance - amountDifference;

    await prisma.wallet.update({
        where: { id: funding.wallet.id },
        data: { balance: updatedWalletBalance }
    });

    const updatedFunding = await prisma.goalFunding.update({
      where: { id: parseInt(id) },
      data: {
        amount: amount ?? funding.amount,
        walletId: walletId ?? funding.walletId,
      },
    });

    return res.status(200).json({
      message: "تم تحديث تمويل الهدف بنجاح",
      data: updatedFunding,
    });
})




module.exports.deleteFundingById = asyncHandler(async(req , res) => {
    const { id } = req.params;
    const userId = req.user.id;
    
    const funding = await prisma.goalFunding.findUnique({
        where: { id: parseInt(id) },
        include: { wallet: true, goal: true }
    });
    
    if (!funding) {
        return res.status(404).json({ message: "تمويل الهدف غير موجود" });
    }
    
    if (funding.userId !== userId) {
        return res.status(403).json({ message: "ليس لديك صلاحية لحذف هذا التمويل" });
    }
    
    await prisma.wallet.update({
        where: { id: funding.wallet.id },
        data: { balance: { increment: funding.amount } }
    });
    
    await prisma.goalFunding.delete({
        where: { id: parseInt(id) },
    });
    
    return res.status(200).json({ message: "تم حذف التمويل بنجاح و اعاده المبلغ الى المحفظه" });
})