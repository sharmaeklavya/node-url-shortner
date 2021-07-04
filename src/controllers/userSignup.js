const dotenv = require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserDatabase = require("../models/schemaSignup");

const handleErrors = (err) => {
  const errors = { fullName: "", email: "", password: "" };
  if (err.code === 11000) {
    errors.email = "User email already exists";
    return errors;
  }
  if (err.message.includes("users validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "hello-my-secret-key", {
    expiresIn: maxAge,
  });
};

const signup = async (req, res) => {
  try {
    const { fullName, email, password, accountStatus, dateCreated } = req.body;
    const hashedPassword =
      password.length >= 6 ? await bcrypt.hash(password, 12) : "";
    const user = await UserDatabase.create({
      fullName,
      email,
      password: hashedPassword,
      accountStatus,
      dateCreated,
    });
    const token = createToken(user._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge * 1000,
    });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(500).json(errors);
  }
};

const login = async (req, res) => {
  // res.cookie("newUser", false);
};

module.exports = { signup, login };
