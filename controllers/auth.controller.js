const User = require("../model/user")
const bcrypt = require('bcrypt')

const authorController={}

authorController.loginWithEmail = async (req,res,next) =>{
    try {
        console.log("am i here loginwithemail")
        //login process
        // 1. get the email and password from body
        const {email, password} = req.body
        //2. check that email is exist in database 
        // console.log(password)
        const user = await User.findOne({email})
        // console.log("this is user",user)
        // console.log(user.password)
        if(!user){
            throw new Error("This email is not exist")
        }
        //3. check the password is match
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            throw new Error("Wrong password")
        }
        //4. generate token 
        const accessToken = await user.generateToken()
        // console.log("is this token?",accessToken)
        //5. response
        res.status(200).json({
            status:"success",
            data: {user,accessToken}
        })
    } catch (err) {
        res.status(400).json({
			status: "fail",
			error: err.message
		})  
    }
}

authorController.loginWithFacebookOrGoogle = async (req,res,next)=>{
    try {
        console.log("am i here")
        let user = req.user
        console.log( user)
        if(user){
            console.log("am i here 2")
            user = await User.findByIdAndUpdate(
                user._id,
                { avatarUrl: user.avatarUrl }, // i want to get recent avatar picture from facebook
                { new: true }
            )
            console.log("this is new",user)
        }else{
            throw new Error("Login Fail")
        }
        const accessToken = await user.generateToken()
        res.status(200).json({
            status:"success",
            data: {user,accessToken}
        })
    } catch (err) {
        res.status(400).json({
			status: "fail",
			error: err.message
		})  
    }
}


module.exports = authorController