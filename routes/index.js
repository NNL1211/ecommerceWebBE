var express = require('express');
var router = express.Router();
// require('dotenv').config();
router.get("/", function (req,res,next) {
    res.send({ status: "ok", data: "Hello World!" });
})
// userApi
const userApi = require("./user.api");
router.use("/users", userApi);
// console.log("adasdas",process.env.MAILGUN_API_KEY)

// authApi
const authApi = require("./auth.api");
router.use("/auth", authApi);

// productApi
const productApi = require("./product.api");
router.use("/products", productApi);

// orderApi
const orderApi = require("./order.api");
router.use("/orders", orderApi);

// categoryApi
const categoryApi = require("./category.api");
router.use("/category", categoryApi);


// cloudinaryApi
const cloudinaryApi = require("./cloudinary.api");
router.use("/cloudinary", cloudinaryApi);

// categoryApi
const couponApi = require("./coupon.api");
router.use("/coupons", couponApi);

// adminApi
const adminApi = require("./admin.api");
router.use("/admin", adminApi);

module.exports = router;
