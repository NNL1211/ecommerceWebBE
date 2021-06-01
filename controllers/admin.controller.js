const Order = require("../model/order")
const adminController = {}



// req.files.file.path
adminController.getAllOrders = async (req, res) => {
    try {
        console.log("i am in admin get all orders")
        let allOrders = await Order.find({})
        .sort("-createdAt")
        .populate("products.product")
        .exec();
        res.status(200).json({
            status: "Success",
            data: {allOrders},
          });
    } catch (error) {
        res.status(400).json({
            status: "Fail",
            error: error.message,
          });
    }

};

adminController.orderStatus = async (req, res) => {
    try {
        console.log("i am in ordestatus change")
        const { orderId, orderStatus } = req.body;

        let updated = await Order.findByIdAndUpdate(
          orderId,
          { orderStatus },
          { new: true }
        ).exec();
          res.status(200).json({
            status: "Success",
            data: {updated},
          });
    } catch (error) {
        res.status(400).json({
            status: "Fail",
            error: error.message,
          });
    }

};

  module.exports=adminController