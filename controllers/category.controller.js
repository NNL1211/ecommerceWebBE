const Category = require("../model/category")
const Product = require("../model/product")
const slugify = require('slugify')
const categoryController = {}

categoryController.getAllCategory = async (req,res,next)=>{
    try {
  
    const totalCategorys = await Category.find({}).sort({ createdAt: -1 }).exec();
   
    res.status(200).json({
        status: "Success",
        data: {totalCategorys},
      });
    } catch (error) {
        res.status(400).json({
            status: "Fail",
            error: error.message,
          });
    }
}

categoryController.addCategory = async (req,res,next)=> {
    try {
        console.log("i am here in category add")
        const { name } = req.body;
        console.log("this name brand",name)
        const category = await new Category({ name, slug: slugify(name) }).save();
          res.status(200).json({
            status: "Success",
            data: {category},
          });
    } catch (error) {
        res.status(400).json({
            status: "Fail",
            error: error.message,
          });
    }
} 
categoryController.updateCategory = async (req,res,next)=>{
    try {
        console.log("i am in update category")
        const { name } = req.body;
        const updated = await Category.findOneAndUpdate(
            { slug: req.params.slug },
            { name, slug: slugify(name) },
            { new: true }
          );
        if (!updated) {
            throw new Error("Product not found or User not authorized")
         }
          
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
}

categoryController.getSingleCategory = async (req,res,next)=>{
    try {
        // const categoryId = req.params.id
        console.log("i am in getsingle category")
        let category = await Category.findOne({ slug: req.params.slug }).exec();
        const products = await Product.find({ category }).populate("category").exec();
        // console.log(category)
        if(!category){
            throw new Error("Single Product not found ?")
        }
        res.status(200).json({
            status: "Success",
            data: {category,products},
          });
    } catch (error) {
        res.status(400).json({
            status: "Fail",
            error: error.message,
          });
    }
}

categoryController.deleteCategory = async (req,res,next)=>{
    try {
        // const categoryId = req.params.id
        console.log("i am in delete category")
        let deleted = await Category.findOneAndDelete({ slug: req.params.slug });
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






module.exports=categoryController