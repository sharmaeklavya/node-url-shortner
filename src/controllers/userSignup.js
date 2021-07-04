const bcrypt = require("bcrypt");
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
    res.status(200).json({ user });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(500).json(errors);
  }
};

const login = async (req, res) => {
  try {
    const user = await UserDatabase.find({});
    console.log(user);
  } catch (err) {
    console.log(err);
    res.status(500);
  }
};

module.exports = { signup, login };
