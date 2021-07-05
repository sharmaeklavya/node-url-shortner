const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { shouldSendSameSiteNone } = require("should-send-same-site-none");
const connectDB = require("./src/helpers/connection");
const router = require("./src/routes/userRoutes");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(shouldSendSameSiteNone);

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
app.use(router);

connectDB
  .then((port) => {
    app.listen(port);
  })
  .catch((err) => {
    console.error(err);
  });
