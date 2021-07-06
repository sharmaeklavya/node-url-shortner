const express = require("express");
const { signup, login } = require("../controllers/user");
const { requireAuth } = require("../controllers/tokenAuth");
const router = express.Router();

router.post("/", signup);

router.post("/login", login);

module.exports = router;
