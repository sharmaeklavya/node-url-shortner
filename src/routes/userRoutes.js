const express = require("express");
const { signup, login, auth } = require("../controllers/user");
const { requireAuth } = require("../controllers/tokenAuth");
const router = express.Router();

router.post("/", signup);

router.post("/login", login);

router.get("/auth", requireAuth, auth);
module.exports = router;
