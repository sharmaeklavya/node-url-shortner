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
  return jwt.sign({ id }, process.env.TOKEN_KEY, {
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
    if (user) {
      res.status(200).json({ user: "User registered successfully" });
    } else {
      res.status(400).json({ message: "User could not be registered." });
    }
  } catch (err) {
    const errors = handleErrors(err);
    res.status(500).json(errors);
  }
};

const login = async (req, res) => {
  try {
    const user = await UserDatabase.findOne({ email: req.body.email });
    if (user) {
      const isValid = await bcrypt.compare(req.body.password, user.password);
      if (isValid) {
        const token = createToken(user._id);
        res.status(200).json({
          message: "Login Success",
          id: user._id,
          name: user.fullName,
          email: user.email,
          token,
        });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } else {
      res.status(404).json({ message: "User not registered" });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { signup, login };
