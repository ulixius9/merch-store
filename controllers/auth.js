const User = require("../models/user");
const { validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");

exports.signout = (req, res) => {
  res.json({
    msg: "signed out successfully",
  });
};

exports.signup = (req, res) => {
  // console.log(req.body)
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.json({ error: errors.array()[0].msg });
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        msg: "Something went wron",
      });
    }
    console.log(user._id);
    res.json({
      id: user._id,
      name: user.name,
      lastname: user.lastname,
      email: user.email,
    });
  });
};

exports.signin = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({ error: errors.array()[0].msg });
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err || !user) return res.status(400).json({ error: "User not found" });
    if (!user.authenticate(password))
      return res
        .status(400)
        .json({ error: "Email and Password does not match" });
    var token = jwt.sign({ _id: user._id }, process.env.SECRET);
    res.cookie("token", token, { expire: new Date() + 1 });
    const { _id, email, name, role } = user;
    res.json({ token, user: { _id, email, name, role } });
  });
};

//varified route
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
});

//custom middlewares
exports.isAuthenticated = (req, res, next) => {
  const checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) return res.status(403).json({ error: "ACCESS DENIED" });
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0)
    return res.status(403).json({ error: "ACCESS DENIED " });
  next();
};
