import {asyncHandler} from  '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {User} from '../models/user.models.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import bcrypt from'bcrypt'
dotenv.config()



// I have created register for simplicity
const registerUser = asyncHandler(async (req,res) =>{
       
        const {email,username,password} =req.body
       // console.log("email",email);

        if([email,username,password].some((field)=>field?.trim() === "")){
            throw new ApiError(400,"All fields are required");
        }
        if(!email.includes('@')){
            throw new ApiError(400,"Email is not correct");
        }

        const existedUser = await User.findOne({
            $or:[{username},{email}]
        })

        if(existedUser){
            throw new ApiError(409,"User with email or username Already exists");
        }
        
       

       const user =  await User.create({
            email,
            password,
            username:username.toLowerCase(),
        })

    

       const createdUser = await User.findById(user._id).select(
            "-password "
       );

       if(!createdUser){
            throw new ApiError(500,"Something went wrong while registering the user")
       }

       return res.status(201).json( new ApiResponse(200,createdUser,"User registed successfully"))
     
})

const loginUser= asyncHandler(async(req,res)=>{
    

    const {email,password} =req.body;
    //console.log(email);

    if(!email ){
        throw new ApiError(400,"username or email is required"); 
    }

    const user =await User.findOne({email})
    if(!user){
        throw new ApiError(404,"user does not Exist");
    }
    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(404,"Invalid user Credentails");
    }

    const loggedInUser = await User.findById(user._id).
    select("-password ")

    console.log(loggedInUser);
   
    const token = user.generateToken();
    user.Token = token
     await user.save();

    const options = {
        httpOnly:true,
        secure:true
    }

    return res.
    status(200).
    json(
        new ApiResponse(
            200,{User:token},
            "User logged in Successfully"
        )
    )

})



export {
    registerUser,
    loginUser
};