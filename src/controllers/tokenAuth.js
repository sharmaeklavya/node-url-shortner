const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
      if (err) {
        console.error(err.message);
        res.redirect("/login");
      } else {
        console.log(decoded);
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

module.exports = { requireAuth };
