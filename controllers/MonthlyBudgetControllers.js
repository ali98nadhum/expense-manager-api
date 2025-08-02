const { PrismaClient } = require("@prisma/client");
const asyncHandler = require("express-async-handler");
const prisma = new PrismaClient();



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