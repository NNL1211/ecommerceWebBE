const express = require("express")
const router = express.Router()
const authMiddleware = require("../middlewares/authentication");
const categoryController = require("../controllers/category.controller");
const validators = require("../middlewares/validators");
const { body, param } = require("express-validator");




/**
 * @route POST 
 * @description 
 * @access Admin requied
 */
// console.log(" iam here in category route")
 router.post("/",authMiddleware.loginRequired,authMiddleware.adminRequired,categoryController.addCategory );

/**
 * @route GET 
 * @description 
 * @access Public
 */
 router.get("/",categoryController.getAllCategory );

 /**
 * @route GET single
 * @description 
 * @access Public
 */
  router.get("/:slug",categoryController.getSingleCategory);

  /**
 * @route PUT 
 * @description 
 * @access Admin requied
 */
 router.put("/:slug",authMiddleware.loginRequired,authMiddleware.adminRequired,validators.validate([
    body("name", "Missing name").exists().notEmpty().isLength(2),
 ])
 ,categoryController.updateCategory );

 /**
 * @route DELETE 
 * @description 
 * @access Admin requied
 */
  router.delete("/:slug",authMiddleware.loginRequired,authMiddleware.adminRequired,categoryController.deleteCategory );


module.exports= router