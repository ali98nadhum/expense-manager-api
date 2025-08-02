const { PrismaClient } = require("@prisma/client");
const asyncHandler = require("express-async-handler");
const prisma = new PrismaClient();



module.exports.getAllGoal = asyncHandler(async(req , res) =>{
 const userId = req.user.id;

 const goals = await prisma.goal.findMany({
    where: {userId:userId}
 })

 res.status(200).json({data: goals})
})


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



module.exports.updateGoal = asyncHandler(async(req , res) => {
 const {title , targetAmount , currentAmount , deadline , status} = req.body;
 const { id } = req.params;
 const userId = req.user.id;

 const goal = await prisma.goal.findUnique({
    where: { id: parseInt(id) },
  });

  if (!goal) {
    return res.status(404).json({ message: "لا يوجد هدف لهذا المعرف" });
  }

  if (goal.userId !== userId) {
    return res.status(403).json({ message: "ليس لديك صلاحية لتحديث هذا الهدف" });
  }

  const updateGoal = await prisma.goal.update({
    where: {id: parseInt(id)},
    data: {
        title: title ?? goal.title,
        targetAmount: targetAmount ?? goal.targetAmount,
        currentAmount: currentAmount ?? goal.currentAmount,
        deadline: deadline ?? goal.deadline,
        status: status ?? goal.status,
    }
  })

  res.status(200).json({message: "تم تحديث الهدف بنجاح" , updateGoal})

})

