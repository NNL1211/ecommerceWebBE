const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authentication");
// const validators = require("../middlewares/validators");
const productController = require("../controllers/product.controller");
// const { body, param } = require("express-validator");

//
/**
 * @route GET api/product?page=1&limit=10
 * @description User can see list of all products
 * @access Public
 */
 router.get("/", productController.getAllProducts);
/**
 * @route POST api/product/add
 * @description Admin can add product
 * @access Admin Required
 */
//  router.post("/",authMiddleware.loginRequired,authMiddleware.adminRequired,validators.validate([
//     body("name", "Missing name").exists().notEmpty(),
//     body("description", "Missing description").exists().notEmpty(),
//     body("price", "Missing price").exists().notEmpty(),
//     body("images", "Missing images").exists().notEmpty(),
//  ]) ,productController.addProducts);

 router.post("/",authMiddleware.loginRequired,authMiddleware.adminRequired,productController.addProducts);
/**
 * @route PUT api/product/:id
 * @description Admin can update product
 * @access Admin required
 */
 router.put("/:id",authMiddleware.loginRequired,authMiddleware.adminRequired,productController.updateProduct);

 /**
 * @route GET  api/product/:id
 * @description User can get single product
 * @access Public
 */
  router.get("/:id", productController.getSingleProduct);

/**
 * @route DELETE api/product/
 * @description Admin can delete product
 * @access Admin required
 */

 router.delete("/:id",authMiddleware.loginRequired,authMiddleware.adminRequired, productController.deleteProduct);

 /**
 * @route SEARCH api/products/search/filters
 * @description Search Filter  product
 * @access Public
 */

  router.post("/search/filters",productController.searchFilters);

/**
 * @route RELATED api/products/search/filters
 * @description Related  product
 * @access Public
*/

  router.get("/related/:id",productController.listRelated);


module.exports = router;