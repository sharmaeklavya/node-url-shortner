const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const connectDB = require("./src/helpers/connection");
const router = require("./src/routes/userRoutes");

const app = express();
app.use(express.json());
app.use(cookieParser());

const whitelist = [
  "http://localhost:3000",
  "https://proj-url-shortner.netlify.app",
];
const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    if (whitelist.includes(origin)) return callback(null, true);
    callback(new Error("Not allowed by CORS"));
  },
};

app.use(cors(corsOptions));

app.use(
  session({
    secret: process.env.SECRET_KEY,
    cookie: {
      path: "/",
      domain: "http://localhost:3000",
      maxAge: 1000 * 60 * 24, // 24 hours
    },
  })
);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
  );
  next();
});
app.use(router);

connectDB
  .then((port) => {
    app.listen(port);
  })
  .catch((err) => {
    console.error(err);
  });
