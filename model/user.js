const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const bcrypt = require('bcrypt')


const userSchema = Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index:true },
    password: { type: String, required: true ,select: true },
    avatarUrl: { type: String, require: false, default: "" },
    role: { type: String, enum: ["user", "admin"], default:"user" },
    cart:{type: Array, default:[]},
    address: {type: String},
    wishlist: [{ type:  Schema.Types.ObjectId, ref: "Product" }],
    emailVerificationCode: { type: String, select: false },
    emailVerified: { type: Boolean, required: [true, "emailVerified is required"], default: false },
    balance: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
userSchema.plugin(require("./plugins/isDeletedFalse"));

userSchema.statics.findOrCreate = function findOrCreate(profile,cb){
  const userObj = new this();
  this.findOne({email:profile.email},async function(err,result){
      if(!result){
          //create User
          //1. make new password
          let newPassword =""+Math.floor(Math.random()*100000000)
          const salt = await bcrypt.genSalt(10);
          newPassword = await bcrypt.hash(newPassword,salt)
          //2. save user
          userObj.name = profile.name
          userObj.email = profile.email
          userObj.password = newPassword
          userObj.avatarUrl = profile.avatarUrl;
          //3. call the cb
          userObj.save(cb)
      }else{
          // send that user information back to passport
          cb(err,result)
      }
  })
}

userSchema.methods.toJSON = function () {
    const obj = this._doc;
    delete obj.password;
    delete obj.emailVerified;
    delete obj.emailVerificationCode;
    delete obj.isDeleted;
    return obj;
  };
  
userSchema.methods.generateToken = async function () {
    const accessToken = await jwt.sign({ _id: this._id }, JWT_SECRET_KEY, {
      expiresIn: "2d",
    });
    return accessToken;
  };
const User = mongoose.model("User", userSchema);
module.exports = User;