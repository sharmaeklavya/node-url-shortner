const express = require("express");
const users = require("../controllers/userSignup");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const data = await users();
    console.log(data);
    res.status(200).send(data);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

module.exports = router;
