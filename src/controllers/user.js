const bcrypt = require("bcrypt");
const validUrl = require("valid-url");
const { nanoid } = require("nanoid");

// User database connection
const UserDatabase = require("../models/schemaSignup");
// Supplying random string and email address
const { emailer, randomStr } = require("../models/emailer");

// Handling schema errors
const handleErrors = (err) => {
  const errors = { fullName: "", email: "", password: "" };
  if (err.code === 11000) {
    errors.email = "User email already exists";
    return errors;
  }
  if (err.message.includes("users validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

//  user sign up route
module.exports.register = async (req, res) => {
  try {
    const { fullName, email, password, accountStatus, dateCreated } = req.body;
    const hashedPassword =
      password.length >= 6 ? await bcrypt.hash(password, 12) : "";
    const user = await UserDatabase.create({
      fullName,
      email,
      password: hashedPassword,
      accountStatus,
      dateCreated,
    });
    if (user) {
      res.status(200).json({ user: "User registered successfully" });
    } else {
      res.status(400).json({ message: "User could not be registered." });
    }
  } catch (err) {
    const errors = handleErrors(err);
    res.status(500).json(errors);
  }
};

// user login route
module.exports.login = async (req, res) => {
  try {
    const user = await UserDatabase.findOne({ email: req.body.email });
    if (user) {
      const isValid = await bcrypt.compare(req.body.password, user.password);
      if (isValid) {
        const userData = {
          fullName: user.fullName,
          email: user.email,
          accountStatus: user.accountStatus,
          dateCreated: user.dateCreated,
        };
        req.session.userData = userData;
        res.status(200).json({ message: "Login successful", user: userData });
      } else {
        res.status(401).json({ message: "Invalid password" });
      }
    } else {
      res.status(404).json({ message: "User not registered" });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// user authentication/ password reset route
module.exports.reset = async (req, res) => {
  try {
    const user = await UserDatabase.findOne({ email: req.body.email });
    if (user) {
      emailer(req.body.email);
      await UserDatabase.findOneAndUpdate(
        { email: req.body.email },
        { $set: { randomStr: randomStr } }
      );
      res.status(200).json({ message: "Valid User" });
    } else {
      res.status(404).json({ message: "User not registered" });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

//user password update route
module.exports.update = async (req, res) => {
  try {
    const isValid = await UserDatabase.findOne({
      randomStr: req.params.rstring,
    });
    if (isValid) {
      const hash = await bcrypt.hash(req.body.password, 12);
      req.body.password = hash;
      const updated = await UserDatabase.updateOne(
        { randomStr: req.params.rstring },
        { $set: { password: req.body.password } }
      );
      if (updated) {
        await UserDatabase.updateOne(
          { randomStr: req.params.rstring },
          { $unset: { randomStr: 1 } },
          false,
          true
        );
        res.status(200).json({ message: "Password updated" });
      } else {
        res.status(502).json({ message: "Password could not be updated" });
      }
    } else {
      res.status(403).json({ message: "Unauthorised Access" });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// if user is logged in - authenticate user
module.exports.auth = (req, res) => {
  if (req.session.userData) {
    res.send({ loggedin: true, user: req.session.userData });
  } else {
    res.send({ loggedin: false });
  }
};

// if user signs out - unauthenticate user
module.exports.unauth = (req, res) => {
  if (req.session.userData) {
    req.session.destroy();
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
};

// creating short url route
module.exports.shorten = async (req, res) => {
  if (req.session.userData) {
    const longUrl = req.body.longurl;
    // validity input email
    if (validUrl.isUri(longUrl)) {
      const user = await UserDatabase.findOne({
        email: req.session.userData.email,
        url: { $not: { $elemMatch: { longurl: longUrl } } },
      });
      // checking if the user is valid
      if (user) {
        const urlCode = nanoid(5);
        const baseUrl = process.env.BASE_URL;
        const shortUrl = baseUrl + "/" + urlCode;
        await UserDatabase.updateOne(
          { email: req.session.userData.email },
          {
            $push: {
              url: {
                $each: [
                  { urlcode: urlCode, longurl: longUrl, shorturl: shortUrl },
                ],
                $position: 0,
              },
            },
          }
        );
        res.status(200).json({ message: "Short url created", url: shortUrl });
      } // Invalid email or url already exists
      else {
        res.status(401).json({ message: "URL already exists" });
      }
    } // Invalid url
    else {
      res.status(400).json({ message: "Invalid URL" });
    }
  } // Invalid session data
  else {
    res.status(403).json({ message: "Access denied" });
  }
};

// display all created urls
module.exports.fetchAll = async (req, res) => {
  try {
    const user = await UserDatabase.findOne({
      email: req.session.userData.email,
    });
    if (user) {
      res.status(200).send(user.url);
    } else {
      res.status(404).json({ message: "URL not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// redirect from short urls to long urls
module.exports.redirect = async (req, res) => {
  try {
    const user = await UserDatabase.findOne(
      {
        "url.urlcode": req.params.redirect,
      },
      { "url.$": 1 }
    );
    if (user) {
      await UserDatabase.updateOne(
        {
          "url.urlcode": req.params.redirect,
        },
        { $inc: { "url.$.clicks": 1 } }
      );
      res.redirect(user.url[0].longurl);
    } else {
      res.status(404).json({ message: "URL not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
