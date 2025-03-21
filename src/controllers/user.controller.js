// import {asyncHandler} from  '../utils/asyncHandler.js'
// import {ApiError} from '../utils/ApiError.js'
// import {User} from '../models/user.models.js'
// import { ApiResponse } from '../utils/ApiResponse.js'
// import nodemailer from 'nodemailer'
// import jwt from 'jsonwebtoken'
// import dotenv from 'dotenv'
// import bcrypt from'bcrypt'
// import crypto from 'crypto'
// import { sendEmail } from '../utils/EmailTransporter.js'
// dotenv.config()



// // I have created register for simplicity
// const registerUser = asyncHandler(async (req,res) =>{
       
//         const {email,username,password} =req.body
//        // console.log("email",email);

//         if([email,username,password].some((field)=>field?.trim() === "")){
//             throw new ApiError(400,"All fields are required");
//         }
//         if(!email.includes('@')){
//             throw new ApiError(400,"Email is not correct");
//         }

//         const existedUser = await User.findOne({
//             $or:[{username},{email}]
//         })

//         if(existedUser){
//             throw new ApiError(409,"User with email or username Already exists");
//         }
        
       

//        const user =  await User.create({
//             email,
//             password,
//             username:username.toLowerCase(),
//         })

    

//        const createdUser = await User.findById(user._id).select(
//             "-password "
//        );

//        if(!createdUser){
//             throw new ApiError(500,"Something went wrong while registering the user")
//        }

//        return res.status(201).json( new ApiResponse(200,createdUser,"User registed successfully"))
     
// })

// const loginUser= asyncHandler(async(req,res)=>{
    

//     const {email,password} =req.body;
//     //console.log(email);

//     if(!email ){
//         throw new ApiError(400,"username or email is required"); 
//     }

//     const user =await User.findOne({email})
//     if(!user){
//         throw new ApiError(404,"user does not Exist");
//     }
//     const isPasswordValid = await user.isPasswordCorrect(password)

//     if(!isPasswordValid){
//         throw new ApiError(404,"Invalid user Credentails");
//     }

//     const loggedInUser = await User.findById(user._id).
//     select("-password -isOTPVerified")

//     console.log(loggedInUser);
   
//     const token = await user.generateToken();
//     user.Token = token
//     console.log(token)
//     await user.save();

    

//     return res.
//     status(200).
//     json(
//         new ApiResponse(
//             200, {
//                 user:loggedInUser,token
//             },
//             "User logged in Successfully"
//         )
//     )

// });

// const ForgotPassword=asyncHandler(async(req,res)=>{
//     const {email} = req.body;

//     if(!email){
//         throw new ApiError(404,"Email Not Found");
//     }

//     const isExist = await User.findOne({ email });

//     if (!isExist) {
//         throw new ApiError(404, "User not found or email is incorrect");
//     }

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     const otpExpires = Date.now() + 10 * 60 * 1000; 

   
//     isExist.otp = otp;
//     isExist.otpExpires = otpExpires;
//     await isExist.save(); 

//     const message = `<p>Your OTP for password reset is :<b>${otp}</b>.This OTP is valid for 10 minutes.</p>`
//     await sendEmail(email,"Password reset OTP",message);

//     return res.status(200).json(new ApiResponse(200, "OTP sent to email")); 

// })


// const verifyOTP = asyncHandler(async(req,res)=>{

//     const {otp} =req.body;

//     const user = await User.findOne({otp,otpExpires:{$gt:Date.now()}})

//     if(!user){
//         throw new ApiError(404,"Invalid or Incorrect OTP");
//     }

//     user.isOTPVerified=true;
//     await user.save();

//     return res.status(200).json(new ApiResponse(200,"OTP Verified successfully!!"))
    
// })

// const resetPassWord=asyncHandler(async(req,res)=>{
//         const{newPassword} =req.body;
        
//         const user = await User.findOne({otpExpires:{$gt:Date.now()},isOTPVerified:true})

//         if(!user){
//             throw new ApiError(400,"Invalid,expired OTP , or OTP not verified")
//         }

//         user.password = await bcrypt.hash(newPassword,10);

//         user.otp = undefined;
//         user.otpExpires=undefined;
//         user.isOTPVerified=false;

//         await user.save();

//         return res.status(200).json(new ApiResponse(200,"PassWord Reset successfully !!"))
// })


// export {
//     registerUser,
//     loginUser,
//     ForgotPassword,
//     resetPassWord,
//     verifyOTP,
// };