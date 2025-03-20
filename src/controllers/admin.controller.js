import express from 'express'
import bcrypt from 'bcryptjs'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Admin } from '../models/admin.models.js';


const getAdmin = asyncHandler(async(req,res)=>{
        const admins = await Admin.find();
        if(!admins){
            throw new ApiError(500,"Something went wrong please try again");
        }
        return res.status(200).json(new ApiResponse(200,admins,"All admin data"));
})
const register=asyncHandler(async(req,res)=>{
    const {fullName,contact,password,email,roles,department,lastLogin,activityStatus} = req.body;

    if([fullName,email,contact,password,roles,department,lastLogin,activityStatus].some((field)=>field?.trim() === "")){
        throw new ApiError(400,"All fields are required");
    }
    if(!email.includes('@')){
        throw new ApiError(404,"Email or passWord is not Correct!!")
    }
    if(password.length<6){
        throw new ApiError(400,"Please type password greater than 6 number")
    }

    const existedAdmin = await Admin.findOne({email});
    console.log("created already ",existedAdmin);

    if(existedAdmin){
        throw new ApiError(404,"User is already existed");
    }

    const admin = await Admin.create({
        fullName,
        contact,
        email,
        password:password,
        roles,
        lastLogin:new Date(),
        department,
        activityStatus,
    })

    const CreatedAdmin = await Admin.findById(admin._id).select("-password");

    console.log("founded",CreatedAdmin);
    if(!CreatedAdmin){
        throw new ApiError(500,"Something went wrong with register");
    }

    return res.status(200).json(new ApiResponse(200,CreatedAdmin,"Admin created successfully"));
})

const login = asyncHandler(async(req,res)=>{
    const {email,password} = req.body;

    if(!email || !password){
        throw new ApiError(404,"E-mail or password is required");
    }

    const admin = await Admin.findOne({email});
    console.log(admin.password,admin.email);
    if(!admin){
        throw new ApiError(404,"Admin does not exist");
    };
    const isPasswordValid = await admin.isPasswordCorrect(password)
    
    if(!isPasswordValid){
        throw new ApiError(404,"Invalid user Credentails");
    }
    
    const loggedInAdmin = await Admin.findById(admin._id).
    select("-password ")
    
    console.log(loggedInAdmin);

    const token = await admin.generateToken();
    console.log(token)

    return res.
    status(200).
    json(
        new ApiResponse(
            200, {
                admin:loggedInAdmin,token
            },
            "Admin logged in Successfully"
        )
    )
})
export {register,login,getAdmin};