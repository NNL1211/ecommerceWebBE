const cloudinary = require("cloudinary");
const cloudinaryController = {}


// config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

// req.files.file.path
cloudinaryController.upload = async (req, res) => {
    try {
        console.log("i am here in upload image")
        let result = await cloudinary.uploader.upload(req.body.image, {
            public_id: `${Date.now()}`,
            resource_type: "auto", // jpeg, png
          });
          res.status(200).json({
            status: "Success",
            data: {public_id: result.public_id,url: result.secure_url},
          });
    } catch (error) {
        res.status(400).json({
            status: "Fail",
            error: error.message,
          });
    }

};

cloudinaryController.remove = async (req, res) => {
    try {
        console.log("i am here in delete image")
        let image_id = req.body.public_id;
        let result = cloudinary.uploader.destroy(image_id)
        console.log(result)
          res.status(200).json({
            status: "Success",
            message: "ok"
          });
    } catch (error) {
        res.status(400).json({
            status: "Fail",
            error: error.message,
          });
    }

};

  module.exports=cloudinaryController