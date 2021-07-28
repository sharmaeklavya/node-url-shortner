const express = require("express");
const router = express.Router();

const {
  register,
  login,
  reset,
  update,
  auth,
  unauth,
  shorten,
  fetchAll,
  redirect,
} = require("../controllers/user");

router.post("/", login);

router.post("/register", register);

router.post("/reset", reset);

router.post("/update/:rstring", update);

router.get("/auth", auth);

router.get("/unauth", unauth);

router.post("/shorten", shorten);

router.get("/fetch", fetchAll);

router.get("/:redirect", redirect);

module.exports = router;
