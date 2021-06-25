const express = require("express");
const cors = require("cors");
const connectDB = require("./src/helpers/connection");
const router = require("./src/routes/routeSignup");

const app = express();
app.use(express.json());
app.use(cors);
app.use("/", router);

connectDB
  .then((port) => {
    app.listen(port);
  })
  .catch((err) => {
    console.error(err);
  });
