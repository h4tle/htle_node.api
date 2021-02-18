// const { Router } = require("express");
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
//CORS
const cors = require("cors");
app.options("*", cors({})); // include before other routes

//Import routes
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

dotenv.config();

//Connect to DB
mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true },
  { useUnifiedTopology: true },
  () => console.log("Connected to MongoDB(htle_db)!")
);

//Middelwares
app.use(express.json());

//Route Middelwares -> /api/user/register
app.use("/api/user/", authRoute);
app.use("/api/posts", postRoute);

app.listen(3007, () => console.log("Server Up and Running(node.js express)"));
