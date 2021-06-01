const express = require("express")
const router = express.Router()
const authMiddleware = require("../middlewares/authentication");
const cloudinaryController = require("../controllers/cloudinary.controller");

/**
 * @route POST 
 * @description 
 * @access Admin requied
 */
// console.log(" iam here in category route")
router.post("/uploadimages",authMiddleware.loginRequired,authMiddleware.adminRequired,cloudinaryController.upload );

/**
 * @route POST 
 * @description 
 * @access Admin requied
 */
// console.log(" iam here in category route")
router.post("/removeimages",authMiddleware.loginRequired,authMiddleware.adminRequired,cloudinaryController.remove );

module.exports = router;