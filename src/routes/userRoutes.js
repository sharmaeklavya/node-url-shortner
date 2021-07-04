const express = require("express");
const { signup, login } = require("../controllers/userSignup");

const router = express.Router();

router.get("/", login);

router.post("/sign-up", signup);

module.exports = router;
