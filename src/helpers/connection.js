const mongoose = require("mongoose");
const { db_url, port } = require("./environment");

const connectDB = new Promise((resolve, reject) => {
  try {
    const db = mongoose.connect(
      db_url,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      () => console.log("connection successful")
    );
    resolve(port);
  } catch (err) {
    console.error(err);
    reject(err);
  }
});

module.exports = connectDB;
