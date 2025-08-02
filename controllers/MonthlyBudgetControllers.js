const { PrismaClient } = require("@prisma/client");
const asyncHandler = require("express-async-handler");
const prisma = new PrismaClient();


module.exports.getAllMonthlyBudget = asyncHandler(async(req , res) => {
    const userId = req.user.id;

    const monthlyBudget = await prisma.monthlyBudget.findMany({
        where: {userId: userId}
    })

    res.status(200).json({data: monthlyBudget})
})


module.exports.getMonthlyBudgetById = asyncHandler(async(req , res) => {
    const {id} = req.params;
    const userId = req.user.id;
    const monthlyBudget = await prisma.monthlyBudget.findUnique({
        where: {
            id: parseInt(id),
            userId: userId
        }
    });
    if (!monthlyBudget) {
        return res.status(404).json({ message: "لا يوجد ميزانيه لهذا المعرف" });
    }
    res.status(200).json({data: monthlyBudget})
})


module.exports.createMonthlyBudget = asyncHandler(async(req , res) => {
    const {month , year , totalLimit , note} = req.body;
    const userId = req.user.id;

    const MonthlyBudget = await prisma.monthlyBudget.create({
        data: {
            month,
            year,
            totalLimit: parseFloat(totalLimit),
            note,
            userId
        }
    })

    res.status(201).json({message: "تم اضافه الميزانية الشهرية بنجاح", MonthlyBudget})
})


module.exports.updateMonthlyBudget = asyncHandler(async(req , res) => {
    const {id} = req.params;
    const {month , year , totalLimit , note} = req.body;
    const userId = req.user.id;

    const monthlyBudget = await prisma.monthlyBudget.findUnique({
    where: { id: parseInt(id) },
  });

  if (!monthlyBudget) {
    return res.status(404).json({ message: "لا يوجد ميزانيه لهذا المعرف" });
  }

  if (monthlyBudget.userId !== userId) {
    return res.status(403).json({ message: "ليس لديك صلاحية لتحديث هذا الميزانيه" });
  }

    const updateMonthlyBudget = await prisma.monthlyBudget.update({
        where: {
            id: parseInt(id),
            userId
        },
        data: {
            month: month ?? monthlyBudget.month,
            year: year ?? monthlyBudget.year,
            totalLimit: totalLimit ? parseFloat(totalLimit) : monthlyBudget.totalLimit,
            note: note ?? monthlyBudget.note
        }
    })

    res.status(200).json({message: "تم تحديث الميزانية الشهرية بنجاح", updateMonthlyBudget})
})



module.exports.deleteMonthlyBudget = asyncHandler(async(req , res) => {
    const {id} = req.params;
    const userId = req.user.id;

    const monthlyBudget = await prisma.monthlyBudget.findUnique({
        where: { id: parseInt(id) },
    });

    if (!monthlyBudget) {
        return res.status(404).json({ message: "لا يوجد ميزانيه لهذا المعرف" });
    }

    if (monthlyBudget.userId !== userId) {
        return res.status(403).json({ message: "ليس لديك صلاحية لحذف هذا الميزانيه" });
    }

    await prisma.monthlyBudget.delete({
        where: { id: parseInt(id) }
    });

    res.status(200).json({ message: "تم حذف الميزانية الشهرية بنجاح" });
})