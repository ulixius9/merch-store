const express = require("express");
const { signout, signup, signin, isSignedIn } = require("../controllers/auth");
const { check } = require("express-validator");

const router = express.Router();

router.get("/signout", signout);

router.post(
  "/signup",
  [
    check("firstname", "enter valid username").isLength({ min: 3 }),
    check("email", "enter valid email").isEmail(),
    check("password", "enter valid password").isLength({ min: 4 }),
  ],
  signup
);

router.post(
  "/signin",
  [
    check("email", "enter valid email").isEmail(),
    check("password", "enter valid password").isLength({ min: 4 }),
  ],
  signin
);

router.get("/test", isSignedIn, (req, res) => {
  res.json(req.auth);
});

module.exports = router;
