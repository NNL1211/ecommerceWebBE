const Coupon = require("../model/coupon")
const couponController = {}

couponController.getAllCoupon = async (req,res,next)=>{
    try {
  
    const allcoupons = await Coupon.find({}).sort({ createdAt: -1 }).exec();
    res.status(200).json({
        status: "Success",
        data: {allcoupons},
      });
    } catch (error) {
        res.status(400).json({
            status: "Fail",
            error: error.message,
          });
    }
}

couponController.createCoupon = async (req,res,next)=> {
    try {
        console.log("i am here in coupon add")
        const { name, expiry, discount } = req.body;
        const coupon = await new Coupon({ name, expiry, discount }).save();
          res.status(200).json({
            status: "Success",
            data: {coupon},
          });
    } catch (error) {
        res.status(400).json({
            status: "Fail",
            error: error.message,
          });
    }
} 


couponController.deleteCoupon = async (req,res,next)=>{
    try {
        console.log("i am in delete coupon")
        // console.log(req.params.id)
        let deleted = await Coupon.findByIdAndDelete(req.params.id).exec();
        res.status(200).json({
            status: "Success",
            data: {deleted},
          });
    } catch (error) {
        res.status(400).json({
            status: "Fail",
            error: error.message,
          });
    }
}






module.exports=couponController