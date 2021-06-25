const dotenv = require("dotenv").config();

const db_url = process.env.DB_URL;
const port = process.env.PORT || 4500;

module.exports = { db_url, port };
