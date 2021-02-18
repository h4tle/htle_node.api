const router = require("express").Router();
const User = require("../model/User");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const jwt = require("jsonwebtoken");
const { registerValidation, loginValidation } = require("../validation");

// Register Post
router.post("/register", cors(), async (req, res) => {
  //Validate before adding the user
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  //Checking if user is in db
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email already exists");
  //Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  //Create new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  try {
    const savedUser = await user.save();
    res.send({ user: user._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

//Login Post
router.post("/login", cors(), async (req, res) => {
  //Validate before adding the user
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Checking if email exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email is not found");

  //Checking if password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Invalid password");

  // Create and assign a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  req.header("Access-Control-Allow-Origin", "*", "lvh.me:3000/");
  res.header("auth-token", token).send(token);

  res.send("Logged in!");
});

module.exports = router;
