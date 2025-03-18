import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema(
    {
        username:{
            type:String,
            unique:true,
            required:true,
            lowercase:true,
            trim:true,
        },
        email:{
            type:String,
            unique:true,
            required:true,
        },
        password:{
            type:String,
            required:[true,"password is required"]
        },
        Token:{
            type:String,
            default:null
        }
    },
    {timestamps:true}
)

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next();
    }
    this.password = await bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.generateToken = function () {
    return jwt.sign(
        { _id: this._id, email: this.email}, 
        process.env.TOKEN_SECRET, 
        { expiresIn: process.env.TOKEN_EXPIRY }
    );
};


userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password,this.password)
}
export const User = mongoose.model("User",userSchema);
