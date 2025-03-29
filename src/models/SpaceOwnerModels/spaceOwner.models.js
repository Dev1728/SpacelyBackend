import mongoose from 'mongoose'



const spaceOwnerSchema = new mongoose.Schema(
    {
        name:{
            firstName:{
                type:String,
                required:true,
                trim:true
            },
            lastName:{
                type:String,
                required:true,
                trim:true
            }
        },
        email:{
            type:String,
            required:true,
            unique:true
        },
        contact:{
            type:Number,
            required:true,
            unique:true
        },
        profilePic:{
            type:String,
            default:''
        },
        idProof:{
            aadharNumber: {
                type: String,
                required: true,
                match: [/^\d{12}$/, 'Please enter a valid Aadhar Number'], 
            },
        },otp: { 
            type:Number 
        }, 
        otpExpires: { 
            type: Date 
        },
        verifiedId:{
            type:String
        }
    },
    {timestamps:true}
)



export const SpaceOwnerSchema = mongoose.model("SpaceOwnerSchema",spaceOwnerSchema) 