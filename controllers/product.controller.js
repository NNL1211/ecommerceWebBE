const Product = require("../model/product")
const slugify = require('slugify')
const productController = {}

productController.getAllProducts = async (req,res,next)=>{
    try {
    //1. read the query information
    let {page,limit,sortBy,...filter}=req.query
    // currentUserId = req.userId
    page = parseInt(page) || 1
    limit = parseInt(limit) || 10
    //2. get total products number
    const totalProducts = await Product.countDocuments({...filter,isDeleted: false,})
    //3. caculate total page number
    const totalPages = Math.ceil(totalProducts/limit) 
    //4. caculate how many data you will skip (offset)
    const offset = limit * (page-1)
    //5. get Products based on query info
    const products = await Product
    .find()
    .skip(offset)
    .limit(limit)
    // .sort({ ...sortBy, createdAt: -1 })
    // .sort([["createdAt","desc"]])
    .populate("category")
    
    res.status(200).json({
        status: "Success",
        data: {products,totalPages},
      });
    } catch (error) {
        res.status(400).json({
            status: "Fail",
            error: error.message,
          });
    }
}

productController.addProducts = async (req,res,next)=> {
    try {
        // const {name,description,price,images}= req.body
        // const products = await Product.create({
        //     name,
        //     description,
        //     price,
        //     images,
        //   });
        console.log(req.body);
        req.body.slug = slugify(req.body.title);
        let product = await new Product(req.body).save();
          res.status(200).json({
            status: "Success",
            data: {product},
          });
    } catch (error) {
        res.status(400).json({
            status: "Fail",
            error: error.message,
          });
    }
} 
productController.updateProduct = async (req,res,next)=>{
    try {
        // const {name,description,price,images}= req.body
        const productId = req.params.id
        req.body.slug = slugify(req.body.title);
        console.log(req.body);
        const product = await Product.findByIdAndUpdate(
            productId,
            req.body,
            {new:true});
        if (!product) {
            throw new Error("Product not found or User not authorized")
         }
          
        res.status(200).json({
                status: "Success",
                data: {product},
              });
    } catch (error) {
        res.status(400).json({
            status: "Fail",
            error: error.message,
          });
    }
}

productController.getSingleProduct = async (req,res,next)=>{
    try {
        const productId = req.params.id
        console.log("i am in getsingle product")
        let product = await Product.findById(productId).populate("category")
        // console.log(product)
        if(!product){
            throw new Error("Single Product not found ???????")
        }
        res.status(200).json({
            status: "Success",
            data: {product},
          });
    } catch (error) {
        res.status(400).json({
            status: "Fail",
            error: error.message,
          });
    }
}

productController.deleteProduct = async (req,res,next)=>{
    try {
        const productId = req.params.id
        console.log("i am in delete product")
        let deleted = await Product.findByIdAndDelete(productId)
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

// SERACH / FILTER

const handleQuery = async (req, res, query) => {
    try {
        // console.log(typeof query)
        let {page,limit}=req.query
        // currentUserId = req.userId
        page = parseInt(page) || 1
        limit = parseInt(limit) || 10
        const offset = limit * (page-1)
        // console.log("tao dag search cai gi ?",query)
        //2. get total products number
        const totalProducts = await Product.find({ $text: { $search: query ,$caseSensitive: false  }}).countDocuments();
        // const totalProducts = await Product.find({title: { $regex: new RegExp(query, "i") }}).countDocuments();
        //3. caculate total page number
        const totalPages = Math.ceil(totalProducts/limit) 
        console.log("total product found",totalProducts)
        const products = await Product.find({ $text: { $search: query ,$caseSensitive: false  }})
        .populate("category", "_id name")
        .populate("postedBy", "_id name")
        .skip(offset)
        .limit(limit)
        .exec();

        res.status(200).json({
            status: "Success",
            data: {products,totalPages},
          });
    } catch (error) {
        res.status(400).json({
            status: "Fail",
            error: error.message,
          });
    }

  };

const handlePrice = async (req, res, price) => {
    try {
        let {page,limit}=req.query
        // currentUserId = req.userId
        page = parseInt(page) || 1
        limit = parseInt(limit) || 10
        const offset = limit * (page-1)
         //2. get total products number
        //  const totalProducts = await Product.find({
        //     price: {
        //       $gte: price[0],
        //       $lte: price[1],
        //     },
        //   }).estimatedDocumentCount().exec();
          const totalProducts = await Product.countDocuments({
            price: {
              $gte: price[0],
              $lte: price[1],
            },
          }).exec();
          console.log("total product found",totalProducts)
         //3. caculate total page number
         const totalPages = Math.ceil(totalProducts/limit) 
      const products = await Product.find({
        price: {
          $gte: price[0],
          $lte: price[1],
        },
      })
        .populate("category", "_id name")
        .populate("postedBy", "_id name")
        .skip(offset)
        .limit(limit)
        .exec();

        res.status(200).json({
            status: "Success",
            data: {products,totalPages},
          });
    } catch (err) {
        res.status(400).json({
            status: "Fail",
            error: error.message,
          });
    }
  };
const handleCategory = async (req, res, category) => {
    try {
        let {page,limit}=req.query
        // currentUserId = req.userId
        page = parseInt(page) || 1
        limit = parseInt(limit) || 10
        const offset = limit * (page-1)
         //2. get total products number
        //  const totalProducts = await Product.find({ category }).estimatedDocumentCount().exec();
         const totalProducts = await Product.countDocuments({ category }).exec();
         //3. caculate total page number
         const totalPages = Math.ceil(totalProducts/limit) 
         console.log("total product found",totalProducts)
      let products = await Product.find({ category })
        .populate("category", "_id name")
        .populate("postedBy", "_id name")
        .skip(offset)
        .limit(limit)
        .exec();
  
        res.status(200).json({
            status: "Success",
            data: {products,totalPages},
          });
    } catch (err) {
        res.status(400).json({
            status: "Fail",
            error: error.message,
          });
    }
  };

const handleColor = async (req, res, size) => {
    try {
        let {page,limit}=req.query
        // currentUserId = req.userId
        page = parseInt(page) || 1
        limit = parseInt(limit) || 10
        const offset = limit * (page-1)
         //2. get total products number
         const totalProducts = await Product.countDocuments({ size }).exec();
         //3. caculate total page number
         const totalPages = Math.ceil(totalProducts/limit) 
         console.log("total product found",totalProducts)
        const products = await Product.find({ size })
        .populate("category", "_id name")
        .populate("postedBy", "_id name")
        .skip(offset)
        .limit(limit)
        .exec();

        res.status(200).json({
            status: "Success",
            data: {products,totalPages},
          });
    } catch (error) {
        res.status(400).json({
            status: "Fail",
            error: error.message,
          });
    }

  
  };
  
const handleBrand = async (req, res, brand) => {
    try {
        let {page,limit}=req.query
        // currentUserId = req.userId
        page = parseInt(page) || 1
        limit = parseInt(limit) || 10
        const offset = limit * (page-1)
         //2. get total products number
         const totalProducts = await Product.countDocuments({brand,isDeleted: false,}).exec();
         //3. caculate total page number
         const totalPages = Math.ceil(totalProducts/limit) 
        // console.log(brand)
        console.log("total product found",totalProducts)
        const products = await Product.find({ brand })
        .populate("category", "_id name")
        .populate("postedBy", "_id name")
        .skip(offset)
        .limit(limit)
        .exec();
        
        res.status(200).json({
            status: "Success",
            data: {products,totalPages},
          });
    } catch (error) {
        res.status(400).json({
            status: "Fail",
            error: error.message,
          });
    }
  };

productController.searchFilters = async(req,res)=>{
    const {
        query,
        price,
        category,
        size,
        brand,
      } = req.body;
    
      if (query) {
        console.log("query --->", query);
        await handleQuery(req, res, query);
      }
    
      // price [20, 200]
      if (price !== undefined) {
        console.log("price ---> ", price);
        await handlePrice(req, res, price);
      }
    
      if (category) {
        console.log("category ---> ", category);
        await handleCategory(req, res, category);
      }
    
      if (size) {
        console.log("size ---> ", size);
        await handleColor(req, res, size);
      }
    
      if (brand) {
        console.log("brand ---> ", brand);
        await handleBrand(req, res, brand);
      }
}
  
// related


productController.listRelated = async (req, res) => {
    try {
        console.log("i am in get related ")
        console.log(req.params.id)
        const product = await Product.findById(req.params.id).exec();
  
        const related = await Product.find({
          _id: { $ne: product._id },
          category: product.category,
        })
          .limit(4)
          .populate("category")
          .populate("postedBy")
          .exec();
          res.status(200).json({
            status: "Success",
            data: {related},
          });
    } catch (error) {
        res.status(400).json({
            status: "Fail",
            error: error.message,
          });
    }


  };


module.exports=productController