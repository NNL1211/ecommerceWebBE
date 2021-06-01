const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller")
const { body } = require('express-validator');
const validators = require ("../middlewares/validators")
const authMiddleware =require ("../middlewares/authentication")

/**
 * @route POST api/users/
 * @description User can register account
 * @access Public
 */
 router.post("/",validators.validate([
    body("name").exists().notEmpty(),
    body('email').exists().isEmail(),
    body("password").exists().notEmpty(),
    ]), userController.registerUser);
/**
 * @route GET api/users/me
 * @description Return current user info
 * @access Login required
 */
 router.get("/me", authMiddleware.loginRequired, userController.getCurrentUser);
 /**
 * @route POST api/carts/
 * @description User can add product to cart and save it to database
 * @access Login required
 */
  router.post("/carts", authMiddleware.loginRequired, userController.createUserCart);
 /**
 * @route GET api/carts/
 * @description get info about cart have been ordered
 * @access Login required
 */
  router.get("/carts", authMiddleware.loginRequired, userController.getUserCart);

/**
 * @route DELETE api/carts/
 * @description Empty Cart
 * @access Login required
 */
    router.delete("/carts", authMiddleware.loginRequired, userController.emptyCart);
 /**
 * @route POST api/address/
 * @description save address user after checkout
 * @access Login required
 */
  router.post("/address", authMiddleware.loginRequired, userController.saveAddress);

   /**
 * @route POST api/cart/coupon
 * @description apply coupon 
 * @access Login required
 */
router.post("/carts/coupon", authMiddleware.loginRequired, userController.applyCoupon);


   /**
 * @route POST api/order
 * @description 
 * @access Login required
 */
router.post("/cash-order", authMiddleware.loginRequired, userController.createCashOrder);

/**
 * @route GET api/users/order
 * @description 
 * @access Login required
 */
 router.get("/orders", authMiddleware.loginRequired, userController.getOrders);

/**
 * @route POST api/users/wishlist
 * @description 
 * @access Login required
 */
 router.post("/wishlist", authMiddleware.loginRequired, userController.addToWishlist);

 /**
 * @route PUT api/users/wishlist
 * @description 
 * @access Login required
 */
  router.put("/wishlist/:productId", authMiddleware.loginRequired, userController.removeFromWishlist);

 /**
 * @route GET api/users/wishlist
 * @description 
 * @access Login required
 */
  router.get("/wishlist", authMiddleware.loginRequired, userController.getWishlist);


module.exports = router;