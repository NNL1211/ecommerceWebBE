const jwt = require('jsonwebtoken');
const User = require("../model/user")

const authMiddleware = {};

authMiddleware.loginRequired = async (req,res,next)=>{
    try {
        console.log("i am here in loginrequired")
        //1. get the token from req
        const tokenString = req.headers.authorization
        // console.log(tokenString)
        if(!tokenString){
            throw new Error("Token not found")
        }
        const token = tokenString.replace("Bearer ","")
        //2. check token is exist
        jwt.verify(token,process.env.JWT_SECRET_KEY,(err,payload)=>{
            if(err){
                if(err.name=="TokenExpiredError"){
                    throw new Error("Token Expired")
                }else{
                    throw new Error("Token is invalid")
                }
            }
            req.userId = payload._id;
            console.log("this is payload",payload)
            // console.log("i want to know is this id ?",req.userId )
        })
        // console.log("who first")
        next();
        // 3. next step (add book)
    } catch (err) {
        res.status(400).json({
			status: "fail",
			error: err.message
		})
    }
}

authMiddleware.adminRequired = async (req, res, next) => {
    try {
    console.log("i am here in adminrequired")
      const userId = req.userId;
      const currentUser = await User.findById(userId);
      const isAdmin = currentUser.role === "admin";
  
      if (!isAdmin) return next(new Error("401- Admin required"));
      req.isAdmin = isAdmin;
  
      next();
    } catch (error) {
      next(error);
    }
  };

module.exports= authMiddleware;