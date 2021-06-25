const users = require("../models/schemaSignup");

const userDatabase = async () => {
  const connect = await users.find({});
  console.log("userSignup" + connect);
  return connect;
};

module.exports = userDatabase;
