const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller")
const { body } = require('express-validator');
const validators = require ("../middlewares/validators")
const authMiddleware =require ("../middlewares/authentication")


/**
 * @route POST api/admin/orders-status
 * @description 
 * @access Admin required
 */
router.put("/orders-status", authMiddleware.loginRequired,authMiddleware.adminRequired, adminController.orderStatus);

/**
 * @route GET api/admin/order
 * @description 
 * @access Admin required
 */
 router.get("/orders", authMiddleware.loginRequired,authMiddleware.adminRequired, adminController.getAllOrders);

module.exports = router;