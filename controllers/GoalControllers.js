const { PrismaClient } = require("@prisma/client");
const asyncHandler = require("express-async-handler");
const prisma = new PrismaClient();




module.exports.createGoal = asyncHandler(async(req , res) => {
    const {title , targetAmount , currentAmount , deadline} = req.body;
    const userId = req.user.id;

    const goal = await prisma.goal.create({
        data: {
            title,
            targetAmount: parseFloat(targetAmount),
            currentAmount: parseFloat(currentAmount),
            deadline: deadline ? new Date(deadline) : null,
            userId
        }
    });

    res.status(201).json({message: "تم اضافه الهدف بنجاح  " , goal})
})





