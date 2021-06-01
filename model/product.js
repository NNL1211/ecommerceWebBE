const mongoose = require("mongoose");
// const textSearch = require('mongoose-text-search');
const Schema = mongoose.Schema;
const productSchema = mongoose.Schema(
  {
    title: { 
      type: String,
      trim:true,
      required: true,
      maxlength: 32,
      text: true,
     },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: { 
      type: String, 
      required: true,
      maxlength: 2000,
      text: true,
     },
    price: { 
      type: Number, 
      required: true,
      trim: true,
      maxlength: 32,
     },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    // subs: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: "Sub",
    //   },
    // ],
    quantity: {type:Number},
    sold: {
      type: Number,
      default: 0,
    },
    images: {type: Array},
    shipping: {
      type: String,
      enum: ["Yes", "No"],
    },
    size: {
      type: String,
      enum: ["7M", "8M", "8.5M", "9M", "11M"],
    },
    brand: {
      type: String,
      enum: ["Nike", "Jordan", "Adidas", "Puma", "Vans"],
    },
    // ratings:[
    //   {
    //     star: Number,
    //     postedBy: { type: ObjectId, ref: "User" },
    //   },
    // ],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamp: true }
);
productSchema.plugin(require("./plugins/isDeletedFalse"));
// productSchema.plugin(textSearch);
productSchema.index({title:"text",description: 'text'});
// productSchema.index({ '$**': 'text' })
const Product = mongoose.model("Product", productSchema);
module.exports = Product;