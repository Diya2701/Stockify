const express = require("express");
const passport = require("passport");
const User = require("../model/user");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    const registeredUser = await User.register({ email }, password);

    req.login(registeredUser, (loginErr) => {
      if (loginErr) {
        return res
          .status(500)
          .json({ message: "Registration succeeded but login failed." });
      }
      return res.status(201).json({ user: { email: registeredUser.email } });
    });
  } catch (error) {
    console.error("Registration error:", error);
    if (error.name === "UserExistsError") {
      return res.status(409).json({ message: "Email already registered." });
    }
    return res
      .status(500)
      .json({ message: error.message || "Registration failed." });
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res
        .status(401)
        .json({ message: info?.message || "Invalid email or password." });
    }
    req.login(user, (loginErr) => {
      if (loginErr) {
        return next(loginErr);
      }
      return res.json({ user: { email: user.email } });
    });
  })(req, res, next);
});

router.get("/me", (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(200).json({ user: null });
  }
  return res.json({ user: { email: req.user.email } });
});

router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.json({ message: "Logged out successfully." });
    });
  });
});

module.exports = router;
