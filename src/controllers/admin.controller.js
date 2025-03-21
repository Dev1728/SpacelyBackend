import express from 'express'
import bcrypt from 'bcryptjs'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Admin } from '../models/admin.models.js';
import { sendEmail } from '../utils/EmailTransporter.js';


const createAdmin=asyncHandler(async(req,res)=>{
    const {firstName,lastName,contact,password,email,activityStatus} = req.body;

    if([firstName,lastName,email,contact,password,activityStatus].some((field)=>field?.trim() === "")){
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
        firstName,
        lastName,
        contact,
        email,
        password:password,
        activityStatus,
    })

    const CreatedAdmin = await Admin.findById(admin._id).select("-password -isOTPVerified");

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
    select("-password -isOTPVerified")
    
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



const ForgotPassword=asyncHandler(async(req,res)=>{
    const {email} = req.body;

    if(!email){
        throw new ApiError(404,"Email Not Found");
    }

    const isExist = await Admin.findOne({ email });

    if (!isExist) {
        throw new ApiError(404, "User not found or email is incorrect");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; 

   
    isExist.otp = otp;
    isExist.otpExpires = otpExpires;
    await isExist.save(); 

    const message = `<p>Your OTP for password reset is :<b>${otp}</b>.This OTP is valid for 10 minutes.</p>`
    await sendEmail(email,"Password reset OTP",message);

    return res.status(200).json(new ApiResponse(200, "OTP sent to email")); 

})


const verifyOTP = asyncHandler(async(req,res)=>{

    const {otp} =req.body;

    const admin = await Admin.findOne({otp,otpExpires:{$gt:Date.now()}})

    if(!admin){
        throw new ApiError(404,"Invalid or Incorrect OTP");
    }

    admin.isOTPVerified=true;
    await admin.save();

    return res.status(200).json(new ApiResponse(200,"OTP Verified successfully!!"))
    
})

const resetPassWord=asyncHandler(async(req,res)=>{
        const{newPassword,confirmPassword} =req.body;
        
        const admin = await Admin.findOne({otpExpires:{$gt:Date.now()},isOTPVerified:true})

        if(!admin){
            throw new ApiError(400,"Invalid,expired OTP , or OTP not verified")
        }
        if(!(newPassword === confirmPassword)){
            throw new ApiError(400,"Password does not match");
        }

        admin.password = await bcrypt.hash(newPassword,10);

        admin.otp = undefined;
        admin.otpExpires=undefined;
        admin.isOTPVerified=false;

        await admin.save();

        return res.status(200).json(new ApiResponse(200,"PassWord Reset successfully !!"))
})


const viewAdmin = asyncHandler(async(req,res)=>{
    const {adminId}= req.params;

    if(!adminId){
        throw new ApiError(400,"Admin Not Found ")
    }
    const admins = await Admin.findById(adminId);

    if(!admins){
        throw new ApiError(500,"Something went wrong please try again");
    }
    return res.status(200).json(new ApiResponse(200,admins,"All admin data"));
})
const getAllAdminDashboards =asyncHandler(async (req, res) => {
    try {
      // Extract pagination and filter parameters from the query
      const { page = 1, limit = 10, role, searchQuery, searchKey } = req.query;
  
      // Convert page and limit to integers
      const pageNumber = parseInt(page);
      const pageSize = parseInt(limit);
  
      // Prepare query filters
      let query = {};
      if (role) {
        query.role = role; // Filter by role if provided
      }
  
      if (searchQuery) {
        // Create a case-insensitive regular expression for the search
        const searchRegex = new RegExp(searchQuery, 'i');
  
        // If searchKey is provided, search only in that specific field
        if (searchKey) {
          switch (searchKey.toLowerCase()) {
            case 'firstname':
              query.firstName = searchRegex;
              break;
            case 'lastname':
              query.lastName = searchRegex;
              break;
            case 'email':
              query.email = searchRegex;
              break;
            case 'contact':
              query.contact = searchRegex;
              break;
            default:
              // If searchKey is not recognized, fall back to searching all fields
              query.$or = [
                { firstName: searchRegex },
                { lastName: searchRegex },
                { email: searchRegex },
                { contact: searchRegex }
              ];
          }
        } else {
          // If no searchKey is provided, search in all fields as before
          query.$or = [
            { firstName: searchRegex },
            { lastName: searchRegex },
            { email: searchRegex },
            { contact: searchRegex }
          ];
        }
      }
      // Find admins based on the filters
      const admins = await Admin.find(query)
        .select("-password -otp -otpExpiration -requestId")
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * pageSize) // Skip records based on page number
        .limit(pageSize); // Limit the number of records per page
  
      // Get total count of admins for pagination
      const totalAdmins = await Admin.countDocuments(query);
  
      // Return the admins with pagination data
      res.status(200).json({
        status: true,
        message: "Admins fetched successfully.",
        data: {
          admins,
          totalAdmins,
          currentPage: pageNumber,
          totalPages: Math.ceil(totalAdmins / pageSize),
          pageSize: pageSize,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        message: "Error fetching admins.",
        error: error.message,
      });
    }
});

const updateAdmin = asyncHandler(async(req,res)=>{
        const {adminId} = req.params;

        if(!adminId){
            throw new ApiError(400,"Admin Id not Found");
        }

        const updateData = req.body;

        if(!Object.keys(updateData).length=== 0 ){
            throw new ApiError(400,"At least one field is required");
        }

        const updateAdmin =await Admin.findByIdAndUpdate(
            adminId,
            {$set:updateData},
            {new:true,runValidators:true}
        ).select("-password")

        if(!updateAdmin){
            throw new ApiError(404,"Admin not Found");
        }

        res.status(200).json(new ApiResponse(200,updateAdmin,"admin updated Successfully."))
})


const deleteAdmin = asyncHandler(async(req,res)=>{
    const {adminId} = req.params;

    if(!adminId){
        throw new ApiError(400,"No such admin found");
    }

    const deletedAdmin = await Admin.findByIdAndDelete(adminId).select("-password");

    if(!deletedAdmin){
        throw new ApiError(500,"Something went wrong please try again")
    }

    return res.status(200).json(new ApiResponse(200,deletedAdmin,"Admin Deleted successfully !!"))
})

export {createAdmin,login,viewAdmin,getAllAdminDashboards,updateAdmin,deleteAdmin,ForgotPassword,verifyOTP,resetPassWord};