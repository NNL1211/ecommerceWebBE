const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const orderSchema = mongoose.Schema(
    {
      orderdBy: { type: Schema.Types.ObjectId, ref: "User" },
      products: [
        {
          product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
          },
          count: Number,
          size: String,
        },
      ],
      paymentIntent: {},
      orderStatus: {
        type: String,
        default: "Not Processed",
        enum: [
          "Not Processed",
          "Cash On Delivery",
          "processing",
          "Dispatched",
          "Cancelled",
          "Completed",
        ],
      },
      // orderStatus: { type: String, emum: ["pending", "paid"], default: "pending" },
      total: { type: Number, default: 0 },
      isDeleted: { type: Boolean, default: false },
    },
    { timestamp: true }
  );
  orderSchema.plugin(require("./plugins/isDeletedFalse"));

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;