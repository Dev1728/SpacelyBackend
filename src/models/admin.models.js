import mongoose, { deleteModel } from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { ApiError } from '../utils/ApiError.js'


const adminSchema = new mongoose.Schema(
    {
        firstName:{
            type:String,
            required:true,
        },
        lastName:{
            type:String,
            required:true,
        },
        password:{
            type:String,
            required:[true,"Password is required"]
        },
        contact:{
            type:Number,
            required:true,
            unique:true
        },
        email:{
            type:String,
            required:true,
            unique:true
        },
        activityStatus:{
            type:String,
            enum:["Active","Inactive"],
            default:"Active"
        },
        otp: { 
            type:Number 
        }, 
        otpExpires: { 
            type: Date 
        },
        isOTPVerified:{
            type:Boolean,
            default:false,
        },
        verifiedId:{
            type:String
        }
        
    },
    {timestamps:true}
)

adminSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next();
    }
    this.password = await bcrypt.hash(this.password,10)
    next();
})

adminSchema.methods.generateToken =async function () {
    return await jwt.sign(
        { _id: this._id, email: this.email}, 
        process.env.TOKEN_SECRET, 
        { expiresIn: process.env.TOKEN_EXPIRY }
    );
};

adminSchema.methods.isPasswordCorrect = async function (password) {
    if (!password) {
        throw new Error("Password not found for this admin");
    }
    console.log(this.password);
    console.log(password);
    // return await bcrypt.compare(password,this.password)
    const check= await bcrypt.compare(password,this.password);
    console.log(check);
    return check;
}
export const Admin = mongoose.model("Admin",adminSchema);