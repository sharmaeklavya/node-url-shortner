const mongoose = require("mongoose");
const { db_url, port } = require("./environment");

const connectDB = new Promise((resolve, reject) => {
  try {
    mongoose.connect(db_url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    resolve(port);
  } catch (err) {
    console.error(err);
    reject(err);
  }
});

module.exports = connectDB;
