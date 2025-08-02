const { PrismaClient } = require("@prisma/client");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const {hashPassword} = require("../utils/hashPassword");
const {generateToken } = require("../utils/generateToken");
const prisma = new PrismaClient();

// ==================================
// @desc Register new user
// @route /api/v1/auth/register
// @method POST
// @access public
// ==================================
module.exports.registerUser = asyncHandler(async (req, res) => {
  
    const {name , email , password} = req.body;

    const extingUser = await prisma.user.findFirst({
        where: {email}
    })

    if(extingUser){
        return res.status(400).json({message: "User already exists"})
    }

     // hash password
  const hashedPassword = await hashPassword(password);
    const user  = await prisma.user.create({
        data:{
            name,
            email,
            password: hashedPassword
        }
    })

    res.status(201).json({message: "User registered successfully"})
 
});




// ==================================
// @desc Login
// @route /api/v1/auth/login
// @method POST
// @access public
// ==================================
module.exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  // Generate a JWT token 
  const token = generateToken(user.id, user.name);

  res.status(200).json({ message: "login success", token: token });
});