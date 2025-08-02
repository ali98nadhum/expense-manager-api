const { PrismaClient } = require('@prisma/client');
const asyncHandler = require('express-async-handler');
const prisma = new PrismaClient();


module.exports.getAllWallets = asyncHandler(async(req , res) => {
    const userId = req.user.id;

    const wallets = await prisma.wallet.findMany({
        where: { userId: userId }
    })

    res.status(200).json({ data: wallets });
})


module.exports.getWalletById = asyncHandler(async(req , res) => {
    const { id } = req.params; // wallet id
    const wallet = await prisma.wallet.findUnique({
        where: { id: parseInt(id) },
        include: { monthlyBudget: true }
    });
    if (!wallet) {
        return res.status(404).json({ message: "المحفظة غير موجودة" });
    }  
    res.status(200).json({ data: wallet });
})





module.exports.createWallet = asyncHandler(async (req, res) => {
  const { name, balance, budgetId } = req.body;

  const monthlyBudget = await prisma.monthlyBudget.findUnique({
    where: { id: budgetId }
  });

  if (!monthlyBudget) {
    return res.status(404).json({ message: "الميزانية غير موجودة" });
  }

  if (balance > monthlyBudget.totalLimit) {
    return res.status(400).json({ message: "المبلغ أكبر من الميزانية المتبقية" });
  }

  await prisma.monthlyBudget.update({
    where: { id: budgetId },
    data: {
      totalLimit: monthlyBudget.totalLimit - balance
    }
  });

  const wallet = await prisma.wallet.create({
    data: {
      name,
      balance,
      budgetId,
      userId: req.user.id
    }
  });

  res.status(201).json({ message: "تم إنشاء المحفظة بنجاح", wallet });
});





module.exports.updateWallet = asyncHandler(async (req, res) => {
  const { id } = req.params; // wallet id
  const { name, balance } = req.body;

  const wallet = await prisma.wallet.findUnique({
    where: { id: parseInt(id) },
    include: { monthlyBudget: true }
  });

  if (!wallet) {
    return res.status(404).json({ message: "المحفظة غير موجودة" });
  }

  const balanceDiff = balance - wallet.balance;

  const updatedBudget = wallet.monthlyBudget.totalLimit - balanceDiff;

  if (updatedBudget < 0) {
    return res.status(400).json({ message: "الرصيد الجديد يتجاوز الميزانية المتبقية" });
  }

  await prisma.monthlyBudget.update({
    where: { id: wallet.budgetId },
    data: {
      totalLimit: updatedBudget
    }
  });

  const updatedWallet = await prisma.wallet.update({
    where: { id: parseInt(id) },
    data: {
      name,
      balance
    }
  });

  res.status(200).json({ message: "تم تعديل المحفظة بنجاح", wallet: updatedWallet });
});



module.exports.deleteWallet = asyncHandler(async(req , res) => {
    const { id } = req.params; // wallet id
    
    const wallet = await prisma.wallet.findUnique({
        where: { id: parseInt(id) }
    });
    
    if (!wallet) {
        return res.status(404).json({ message: "المحفظة غير موجودة" });
    }

    const updateMonthlyBudget = await prisma.monthlyBudget.update({
        where: { id: wallet.budgetId },
        data: {
            totalLimit: {
                increment: wallet.balance // Add the wallet balance back to the budget
            }
        }
    });
    
    await prisma.wallet.delete({
        where: { id: parseInt(id) }
    });
    
    res.status(200).json({ message: "تم حذف المحفظة بنجاح" });
})