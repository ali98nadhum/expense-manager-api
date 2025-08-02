const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.protect = asyncHandler(async (req, res, next) => {
  // 1- check if token exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "you are not logged " });
  }

  try {
    // 2- verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3- check if user exists
    const currentUser = await prisma.user.findUnique({
      where: { id: parseInt(decoded.id) },
    });
    if (!currentUser) {
      return res.status(401).json({ message: "user no longer exists" });
    }

    req.user = decoded;

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "your token is invalid or expired" });
  }
});


exports.allowedTo = (...roles) => {
    return asyncHandler(async(req , res , next) => {
        if(!roles.includes(req.user.role)){
            return res.status(403).json({message: "you are not authorized to access this route" });
        }
        next();
    });
};