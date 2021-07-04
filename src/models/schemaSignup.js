const mongoose = require("mongoose");
const { isEmail } = require("validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullName: {
    type: String,
    lowercase: true,
    required: [true, "Please enter full name"],
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: [true, "User email already exists"],
    required: [true, "Please enter an email"],
    validate: [isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    trim: true,
    minlength: [true, "Password should be min 6 characters long",
  },
  accountStatus: { type: Boolean, trim: true, default: false },
  dateCreated: {
    type: Date,
    trim: true,
    default: new Date(),
  },
});

const UserDatabase = mongoose.model("users", userSchema);

module.exports = UserDatabase;
