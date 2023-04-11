const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const users = require("../controllers/users");

router
  .route("/register")
  .get(users.renderRegister) //render registration form
  .post(catchAsync(users.register)); //and create new user

router
  .route("/login")
  .get(users.renderLogin) //render login form/serve the form
  .post(
    //actually log in
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    users.login
  );

//logout route
router.get("/logout", users.logout);

module.exports = router;
