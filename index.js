const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");


const app = express();




// middleware
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);


app.use("/api/v1/auth" , require("./routes/AuthRoutes"));
app.use("/api/v1/expense" , require("./routes/expenseRoutes"));



// Run server
const port = process.env.PORT || 8050;
app.listen(port, () => console.log(`Server is run on port ${port}`));
