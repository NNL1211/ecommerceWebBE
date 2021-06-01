const mongoose = require("mongoose");
// const User = require("../model/user");
// const Order = require("../model/order");
const Product = require("../model/product");
const Category = require("../model/category");
const faker = require("faker");
const bcrypt = require("bcryptjs");


/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
// function getRandomInt(min, max) {
//   min = Math.ceil(min);
//   max = Math.floor(max);
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }

console.log(" i am here")
const cleanData = async (startTime) => {
  try {
    // await User.collection.drop();
    // await Order.collection.drop();
    await Product.collection.drop();
    // OR: await mongoose.connection.dropDatabase();
    console.log("| Deleted all data");
    console.log("-------------------------------------------");
  } catch (error) {
    console.log(error);
  }
};

const generateData = async () => {
  try {
    // await cleanData();
    let products = [];
    let categories = [];
    // let orders = [];

    console.log("| Create 20 products:");
    console.log("-------------------------------------------");
    const userNum = 20;
    const otherNum = 3; // num of blog each user, reviews or reactions each blog
    console.log(`| Create 10 categories`);
    console.log("-------------------------------------------");
    for (let i = 0; i < userNum; i++) {
      await Category.create({
        name: faker.commerce.productAdjective(),
        // slug: faker.commerce.productAdjective(),
      }).then(function (category) {
        console.log("Created new category: " + category.name);
        categories.push(category);
      });
    }
    for (let i = 0; i < userNum; i++) {
    //   const salt = await bcrypt.genSalt(10);
    //   const password = await bcrypt.hash("123", salt);
      await Product.create({
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        images: [faker.image.fashion()],
        shipping:"Yes",
        quantity: 20,
        size:  "8.5M",
        brand: "Vans",
        category: categories[i]._id,
      }).then(function (product) {
        console.log("Created new product: " + product.name);
        products.push(product);
      });
    }
 
    console.log("| Generate Data Done");
    console.log("-------------------------------------------");
  } catch (error) {
    console.log(error);
  }
};



const main = async () => {
   await generateData();
//   getRandomBlogs(1);
};

// remove true if you don't want to reset the DB
main();