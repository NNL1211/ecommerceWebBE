const express = require("express")
const router = express.Router()
const authMiddleware = require("../middlewares/authentication");
const couponController = require("../controllers/coupon.controller");
const validators = require("../middlewares/validators");
const { body} = require("express-validator");




/**
 * @route POST 
 * @description 
 * @access Admin requied
 */
// console.log(" iam here in category route")
 router.post("/",authMiddleware.loginRequired,authMiddleware.adminRequired,couponController.createCoupon );

/**
 * @route GET 
 * @description 
 * @access Public
 */
 router.get("/",couponController.getAllCoupon );


 /**
 * @route DELETE 
 * @description 
 * @access Admin requied
 */
  router.delete("/:id",authMiddleware.loginRequired,authMiddleware.adminRequired,couponController.deleteCoupon );


module.exports= router