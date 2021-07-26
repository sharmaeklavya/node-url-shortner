const express = require("express");
const router = express.Router();

const {
  register,
  login,
  auth,
  unauth,
  shorten,
  fetchAll,
  redirect,
} = require("../controllers/user");

router.post("/", login);

router.post("/register", register);

router.get("/auth", auth);

router.get("/unauth", unauth);

router.post("/shorten", shorten);

router.get("/fetch", fetchAll);

router.get("/:redirect", redirect);

module.exports = router;
