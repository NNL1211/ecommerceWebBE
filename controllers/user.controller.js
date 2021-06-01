const User = require("../model/user");
const Cart = require("../model/cart");
const Product = require("../model/product");
const Coupon = require("../model/coupon")
const Order = require("../model/order")
const bcrypt = require('bcrypt');
const utilsHelper = require("../helpers/utils");
const { emailInternalHelper, emailHelper } = require("../helpers/email");
const userController = {};
// const uniqueid = require("uniqueid");

userController.registerUser = async (req, res, next) => {
    try {
      const { name, email,password,role} = req.body;
      let user = await User.findOne({ email });
      if (user){
        throw new Error("This email is exist")
      }
      const salt = await bcrypt.genSalt(10);
      const encodedPassword = await bcrypt.hash(password, salt);
      // console.log("what is ", encodedPassword);
      const emailVerificationCode = utilsHelper.generateRandomHexString(20);
      let newuser = new User({ name,email,password:encodedPassword,emailVerificationCode,role});
      await newuser.save();
      //time to send to email with verification
      const verificationURL = `${process.env.FRONTEND_URL}/verify?code=${emailVerificationCode}`
      // const verificationURL = `https://nhatlamsocialblog.netlify.app/verify?code=${emailVerificationCode}`
      const emailData = await emailHelper.renderEmailTemplate("verify_email",{name,code:verificationURL},email)
  
      if(emailData.error){
        throw new Error(emailData.error)
      }else{
        emailHelper.send(emailData)
      }
      res.status(200).json({
        status: "Success",
        data: {newuser},
      });
    } catch (error) {
      res.status(400).json({
        status: "Fail",
        error: error.message,
      });
    }
  };

userController.getCurrentUser = async (req, res, next) => {
    try {
      const userId = req.userId;
      const user = await User.findById(userId);
      if (!user){
        throw new Error("User not found, Get Current User Error")
      }
      res.status(200).json({
        status: "Success",
        data: user,
      });
    } catch (error) {
      res.status(400).json({
        status: "Fail",
        error: error.message,
      });
    }
  };

userController.createUserCart = async (req, res, next) => {
    try {
        // console.log(req.body); // {cart: []}
        console.log(req.userId )
      const  cart  = req.body;
      console.log(cart)

      let products = [];
    
      const user = await User.findById(req.userId).exec();
      console.log("i am here in createuserCart")
      // check if cart with logged in user id already exist
      let cartExistByThisUser = await Cart.findOne({ orderdBy: user._id }).exec();
    
      if (cartExistByThisUser) {
        cartExistByThisUser.remove();
        console.log("removed old cart");
      }
    
      for (let i = 0; i < cart.length; i++) {
        let object = {};
    
        object.product = cart[i]._id;
        object.count = cart[i].count;
        object.size = cart[i].size;
        // get price for creating total
        let productFromDb = await Product.findById(cart[i]._id).select("price").exec();
        object.price = productFromDb.price;
        // let { price } = await Product.findById(cart[i]._id).select("price").exec();
        // object.price = price;
    
        products.push(object);
      }
    
      // console.log('products', products)
    
      let cartTotal = 0;
      for (let i = 0; i < products.length; i++) {
        cartTotal = cartTotal + products[i].price * products[i].count;
      }
        // console.log("cartTotal", cartTotal);
        let newCart = await new Cart({
          products,
          cartTotal,
          orderdBy: user._id,
        }).save();
      res.status(200).json({
        status: "Success",
        data: {newCart},
      });
    } catch (error) {
      res.status(400).json({
        status: "Fail",
        error: error.message,
      });
    }
  };

  userController.getUserCart = async (req, res, next) => {
    try {
      const user = await User.findById(req.userId).exec();
      if (!user){
        throw new Error("User not found, Get Current User Error")
      }
      let cart = await Cart.findOne({ orderdBy: user._id })
        .populate("products.product", "_id title price totalAfterDiscount")
        .exec();
    
      // const { products, cartTotal, totalAfterDiscount } = cart;

      res.status(200).json({
        status: "Success",
        data: {cart},
      });
    } catch (error) {
      res.status(400).json({
        status: "Fail",
        error: error.message,
      });
    }
  };

  userController.emptyCart = async (req, res, next) => {
    try {
      console.log("i'm in empty cart");
      const user = await User.findById(req.userId).exec();
      if (!user){
        throw new Error("User not found, Get Current User Error")
      }
      const cart = await Cart.findOneAndDelete({ orderdBy: user._id }).exec();


      res.status(200).json({
        status: "Success",
        data: {cart},
      });
    } catch (error) {
      res.status(400).json({
        status: "Fail",
        error: error.message,
      });
    }
  };

  userController.saveAddress = async (req, res, next) => {
    try {
      console.log(req.body)
      const userAddress = await User.findByIdAndUpdate(req.userId,{ address: req.body.address }).exec();
      res.status(200).json({
        status: "Success",
        data: {userAddress},
      });
    } catch (error) {
      res.status(400).json({
        status: "Fail",
        error: error.message,
      });
    }
  };

  userController.applyCoupon = async (req, res, next) => {
    try {
      const {coupon} = req.body
      console.log(req.body.coupon)
      const validCoupon = await Coupon.findOne({ name: coupon }).exec();
      if (validCoupon === null) {
        throw new Error("Invalid coupon or empty cart")
      }
      console.log("VALID COUPON", validCoupon);
      const user = await User.findById(req.userId).exec();
      let { products, cartTotal } = await Cart.findOne({ orderdBy: user._id })
      .populate("products.product", "_id title price")
      .exec();
      console.log("cartTotal", cartTotal, "discount%", validCoupon.discount);

        // calculate the total after discount
      let totalAfterDiscount = (
      cartTotal -
      (cartTotal * validCoupon.discount) / 100
      ).toFixed(2); // 99.99

      let updatecart= await Cart.findOneAndUpdate(
      { orderdBy: user._id },
      { totalAfterDiscount },
      { new: true }
      );
      res.status(200).json({
        status: "Success",
        data: {totalAfterDiscount},
      });
    } catch (error) {
      res.status(400).json({
        status: "Fail",
        error: error.message,
      });
    }
  };
  userController.createPaymentOrder = async (req, res, next) => {
    try {
      // const { paymentIntent } = req.body.stripeResponse;

      const user = await User.findById(req.userId).exec();
    
      let { products } = await Cart.findOne({ orderdBy: user._id }).exec();
    
      let newOrder = await new Order({
        products,
        orderdBy: user._id,
      }).save();

        // decrement quantity, increment sold
      let bulkOption = products.map((item) => {
      return {
      updateOne: {
        filter: { _id: item.product._id }, // IMPORTANT item.product
        update: { $inc: { quantity: -item.count, sold: +item.count } },
        },
      };
    });
    console.log("product bulk",bulkOption)
  let updated = await Product.bulkWrite(bulkOption, {});
  console.log("PRODUCT QUANTITY-- AND SOLD++", updated);

  console.log("NEW ORDER SAVED", newOrder);

      res.status(200).json({
        status: "Success",
        data: {newOrder},
      });
    } catch (error) {
      res.status(400).json({
        status: "Fail",
        error: error.message,
      });
    }
  };

  userController.createCashOrder = async (req, res, next) => {
    try {
    
      const { COD, couponTrueOrFalse } = req.body;
      // if COD is true, create order with status of Cash On Delivery
    
      if (!COD){throw new Error("Create cash order failed")}
    
      const user = await User.findById(req.userId).exec();
    
      let userCart = await Cart.findOne({ orderdBy: user._id }).exec();
    
      let finalAmount = 0;
    
      if (couponTrueOrFalse && userCart.totalAfterDiscount) {
        finalAmount = userCart.totalAfterDiscount * 100;
      } else {
        finalAmount = userCart.cartTotal * 100;
      }
    
      let newOrder = await new Order({
        products: userCart.products,
        paymentIntent: {
          id: utilsHelper.generateRandomHexString(10),
          amount: finalAmount,
          currency: "usd",
          status: "Cash On Delivery",
          created: Date.now(),
          payment_method_types: ["cash"],
        },
        orderdBy: user._id,
        orderStatus: "Cash On Delivery",
      }).save();

      // decrement quantity, increment sold
      let bulkOption = userCart.products.map((item) => {
      return {
      updateOne: {
        filter: { _id: item.product._id }, // IMPORTANT item.product
        update: { $inc: { quantity: -item.count, sold: +item.count } },
        },
      };
      });
      console.log("product bulk",bulkOption)
      let updated = await Product.bulkWrite(bulkOption, {});
      console.log("PRODUCT QUANTITY-- AND SOLD++", updated);

      console.log("NEW ORDER SAVED", newOrder);
    
      res.status(200).json({
        status: "Success",
        data: {newOrder},
      });
    } catch (error) {
      res.status(400).json({
        status: "Fail",
        error: error.message,
      });
    }
  };

  userController.getOrders = async (req, res, next) => {
    try {
      let user = await User.findById(req.userId).exec();
      // let user = await User.findOne({ email: req.user.email }).exec();
      let userOrders = await Order.find({ orderdBy: user._id })
        .populate("products.product")
        .exec();
      res.status(200).json({
        status: "Success",
        data: {userOrders},
      });
    } catch (error) {
      res.status(400).json({
        status: "Fail",
        error: error.message,
      });
    }
  };

    userController.addToWishlist = async (req, res, next) => {
    try {
      console.log("i am in addwishlist")
      const  {_id}  = req.body;
      console.log(_id)
      const userAddWishlist = await User.findByIdAndUpdate(
        req.userId,
        { $addToSet: { wishlist: _id } }
      ).exec();
    
      res.status(200).json({
        status: "Success",
        data: {userAddWishlist},
      });
    } catch (error) {
      res.status(400).json({
        status: "Fail",
        error: error.message,
      });
    }
  };
  userController.removeFromWishlist = async (req, res, next) => {
    try {
      console.log("i am in removewishlist")
      const { productId } = req.params;
      const userPutWishlist = await User.findByIdAndUpdate(
        req.userId,
        { $pull: { wishlist: productId } }
      ).exec();
      res.status(200).json({
        status: "Success",
        data: {userPutWishlist},
      });
    } catch (error) {
      res.status(400).json({
        status: "Fail",
        error: error.message,
      });
    }
  };
  userController.getWishlist = async (req, res, next) => {
    try {
      const allWishList = await User.findById(req.userId)
      .select("wishlist")
      .populate("wishlist")
      .exec();
  
      res.status(200).json({
        status: "Success",
        data: {allWishList},
      });
    } catch (error) {
      res.status(400).json({
        status: "Fail",
        error: error.message,
      });
    }
  };
module.exports = userController;