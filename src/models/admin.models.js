import mongoose, { deleteModel } from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { ApiError } from '../utils/ApiError.js'


const adminSchema = new mongoose.Schema(
    {
        fullName:{
            type:String,
            required:true,
            lowercase:true,
            unique:true
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
        roles:{
            type:String,
            required:true
        },
        department:{
            type:String,
            required:true
        },
        activityStatus:{
            type:String,
            enum:["Active","Inactive"],
            default:"Active"
        },
        lastLogin:{
            type:Date,
            dafault:Date.now
        },
        permissions:{
            read:{
                type:Boolean,
                default:false
            },
            write:{
                type:Boolean,
                default:false
            },
            execute:{
                type:Boolean,
                default:false
            }
        },
        
    },
    {timestamps:true}
)

adminSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next();
    }
    this.password = await bcrypt.hash(this.password,10)
    next()
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
    return await bcrypt.compare(password,this.password)
}
export const Admin = mongoose.model("Admin",adminSchema);