const express = require("express");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const connectDB = require("./src/helpers/connection");
const router = require("./src/routes/userRoutes");

const app = express();
app.use(express.json());

app.enable("trust proxy", 1);

const sessionStore = MongoStore.create({
  mongoUrl: process.env.DB_URL,
  dbName: "mini-urls",
  collection: "sessions",
});

app.use(
  session({
    key: "__SSID",
    secret: process.env.TOKEN_KEY,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 48,
    },
  })
);

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
