const User = require("../model/user");
const Cart = require("../model/cart");
const Product = require("../model/product");
const Coupon = require("../model/coupon");
const stripe = require("stripe")(process.env.STRIPE_SECRET);


const stripeController = {};

stripeController.createPaymentIntent = async (req, res) => {
    try {
    console.log("i am in createpayment",req.body);
  const { coupon } = req.body;

  // later apply coupon
  // later calculate price

  // 1 find user
  const user = await User.findById(req.userId);
  // 2 get user cart total
  const { cartTotal, totalAfterDiscount } = await Cart.findOne({
    orderdBy: user._id,
  }).exec();
  // console.log("CART TOTAL", cartTotal, "AFTER DIS%", totalAfterDiscount);

  let finalAmount = 0;

  if (coupon && totalAfterDiscount) {
    finalAmount = totalAfterDiscount * 100;
  } else {
    finalAmount = cartTotal * 100;
  }

  // create payment intent with order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: finalAmount,
    currency: "usd",
  });
  res.status(200).json({
    status: "success",
    data: {
    clientSecret: paymentIntent.client_secret,
    cartTotal,
    totalAfterDiscount,
    payable: finalAmount,
  }
    })
        
    } catch (err) {
        res.status(400).json({
			status: "fail",
			error: err.message
		})  
    }
};

module.exports = stripeController