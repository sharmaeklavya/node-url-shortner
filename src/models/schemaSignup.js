const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const usersSchema = new Schema({
  fullName: { type: String, default: "Guest User" },
  email: { type: String, trim: true, default: "guest@guest.com" },
  password: { type: String, trim: true, default: "912873" },
  accountStatus: { type: Boolean, trim: true, default: false },
  date: { type: Date, trim: true, default: new Date() },
});

module.exports = mongoose.model("users", usersSchema);
