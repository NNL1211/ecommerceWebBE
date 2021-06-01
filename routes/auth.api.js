const express = require("express")
const router = express.Router()
const authController = require("../controllers/auth.controller")
const { body } = require('express-validator');
const validators = require ("../middlewares/validators");
const passport = require("passport");



/**
 * @route POST api/auth/login
 * @description User can Login with email
 * @access Public
 */


router.post("/login",
validators.validate([
body('email').exists().isEmail(),
body("password").exists().notEmpty(),
])
,authController.loginWithEmail)

// router.post("/login/facebook",passport.authenticate("facebook-token"),authController.loginWithFacebookOrGoogle)
// router.post("/login/google",passport.authenticate('google-token'),authController.loginWithFacebookOrGoogle)


module.exports= router