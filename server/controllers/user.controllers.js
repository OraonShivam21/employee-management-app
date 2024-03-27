const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.models");
require("dotenv").config();

const signup = async (req, res) => {
  const { email, password } = req.body;
  try {
    const employeeFound = await User.findOne({ email });
    if (employeeFound)
      throw "Email has already been registered! Please try to login.";
    bcrypt.hash(password, 5, async (err, hash) => {
      if (err) throw err;
      const user = new User({ email, password: hash });
      await user.save();
      res.status(201).json({ message: "New user has been registered" });
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userFound = await User.findOne({ email });
    bcrypt.compare(password, userFound.password, (err, result) => {
      if (err) throw err;
      if (result) {
        const access_token = jwt.sign(
          { userID: userFound._id },
          process.env.ACCESS_TOKEN_SECRET
        );
        res
          .status(200)
          .json({ message: "Successfully logged in", access_token });
      } else {
        res.status(200).json({ message: "Invalid credentials" });
      }
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};

module.exports = {
  login,
  signup,
};
