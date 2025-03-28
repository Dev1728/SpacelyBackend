import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema(
    {
        FirstName:{
            type:String,
            required:true,
        },
        LastName:{
            type:String,
            required:true
        },
        userContact: {
            email: {
                type: String,
                required: true
            },
            contact: {
                type: Number,
                required: true
            }
        },
        Address:{
            type:String,
            required:true,
            trim:true
        },
        activityStatus:{
            type:String,
            enum:["Active,Inactive"],
            default:"Active"
        },
        AccountStatus:{
            type:String,
            enum:["Active,Inactive"],
            default:"Active"
        }
      
    },
    {timestamps:true}
)


export const User = mongoose.model("User",userSchema);
