import express from 'express'
import bcrypt from 'bcryptjs'
import { Admin } from '../models/admin.models.js';
import { sendEmail } from '../utils/EmailTransporter.js';


const createAdmin = async (req, res) => {
  try {
      const { firstName, lastName, contact, password,confirmPassword, email} = req.body;

      if (!firstName || !lastName || !email || !contact || !password || !confirmPassword) {
          return res.status(400).json({ success: false, message: "All fields are required" });
      }

      if (!email.includes('@')) {
          return res.status(400).json({ success: false, message: "Invalid email format" });
      }

      if (password.length < 6) {
          return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
      }

      if(password !== confirmPassword){
        return res.status(401).json({success:false,message:"password do not match with confirm Password"})
      }
      const existedAdmin = await Admin.findOne({ email });
      if (existedAdmin) {
          return res.status(409).json({ success: false, message: "User already exists" });
      }

      const admin = await Admin.create({ firstName, lastName, contact, email, password});
      const createdAdmin = await Admin.findById(admin._id).select("-password -isOTPVerified");

      return res.status(200).json({ success: true, data: createdAdmin, message: "Admin created successfully" });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const login = async(req,res)=>{

    try {
      const {email,password} = req.body;
  
      if(!email || !password){
        return res.status(400).json({ success: false, message: "Email or password are required" });
      }
  
      const admin = await Admin.findOne({email});
      console.log(password);
      console.log(admin.password,admin.email);
      if(!admin){
        return res.status(404).json({ success: false, message: "Admin does not exist" });
      };
      const isPasswordValid = await admin.isPasswordCorrect(password)
      
      if(!isPasswordValid){
        return res.status(401).json({ success: false, message: "Invalid Credentails" });
      }
      
      const loggedInAdmin = await Admin.findById(admin._id).
      select("-password -isOTPVerified")
      
      console.log(loggedInAdmin);
  
      const token = await admin.generateToken();
      console.log(token)
  
      return res.status(200).json({ success:true,data:{loggedInAdmin,token},message:"Admin logged in Successfully"})
      
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}



const ForgotPassword=async(req,res)=>{
    try {
      const {email} = req.body;
  
      if(!email){
          return res.status(404).json({success:false,message:"Email not found"});
      }
  
      const isExist = await Admin.findOne({ email });
  
      if (!isExist) {
        return res.status(404).json({success:false,message:"Admin not found"});
      }
  
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpires = Date.now() + 10 * 60 * 1000; 
  
     
      isExist.otp = otp;
      isExist.otpExpires = otpExpires;
      await isExist.save(); 
  
      const message = `<p>Your OTP for password reset is :<b>${otp}</b>.This OTP is valid for 10 minutes.</p>`
      await sendEmail(email,"Password reset OTP",message);
  
      return res.status(200).json({success:true ,message:"OTP sent to email"})
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }

}


const verifyOTP =async(req,res)=>{

    try {
      const {otp} =req.body;
  
      const admin = await Admin.findOne({otp,otpExpires:{$gt:Date.now()}})
  
      if(!admin){
          return res.status(401).json({success:false,message:"Invalid or Incorrect OTP"});
      }
      const verifiedId = Math.floor(10000000 + Math.random() * 90000000).toString();

      admin.isOTPVerified=true;
      admin.verifiedId=verifiedId;
      await admin.save();
  
      return res.status(200).json({success:true,verifiedId:verifiedId,message:"OTP Verified successfully!!"})
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
    
}

const resetPassWord=async(req,res)=>{
       try {
         const{newPassword,confirmPassword,email,verifiedId} =req.body;
         
         const admin = await Admin.findOne({otpExpires:{$gt:Date.now()},isOTPVerified:true,email,verifiedId})
          
         if(!admin){
             return res.status(401).json({sucess:false,message:"Invalid,expired OTP , or OTP not verified"})
         }
         if(!(newPassword === confirmPassword)){
             return res.status(401).json({success:false,message:"Password does not match"});
         }
 
         const password = await bcrypt.hash(newPassword,10);
        //  console.log(admin.password);
        await Admin.findOneAndUpdate(
          { email },
          {
              password:password,
              $unset: { otp: 1, otpExpires: 1 ,verifiedId:1},
              isOTPVerified: false
              
          },
          { new: true } // Return updated document
      ).select("-otp");
        //  admin.otp = undefined;
        //  admin.otpExpires=undefined;
        //  admin.isOTPVerified=false;
 
        //  await admin.save();
 
         return res.status(200).json({success:true,message:"PassWord Reset successfully !!"})
       } catch (error) {
          console.error(error);
          return res.status(500).json({ success: false, message: "Internal Server Error" });
       }
}


const viewAdmin = async(req,res)=>{
    try {
      const {adminId}= req.params;
  
      if(!adminId){
          return res.status(404).json({success:false,message:"Admin Not Found "})
      }
      const admins = await Admin.findById(adminId);
  
      if(!admins){
          return res.status(404).json({success:false,message:"Something went wrong please try again"});
      }
      return res.status(200).json({success:true,data:admins,message:"All admin data"});
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
const getAllAdminDashboards =async (req, res) => {
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
      return res.status(200).json({
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
}

const updateAdmin =async(req,res)=>{
        try {
          const {adminId} = req.params;
  
          if(!adminId){
              return res.status(404).json({success:false,message:"Admin Id not Found"});
          }
  
          const updateData = req.body;
  
          if(!Object.keys(updateData).length=== 0 ){
              return res.status(400).json({success:false,message:"At least one field is required"});
          }
  
          const updateAdmin =await Admin.findByIdAndUpdate(
              adminId,
              {$set:updateData},
              {new:true,runValidators:true}
          ).select("-password")
  
          if(!updateAdmin){
              return res.status(404).json({success:false,message:"Admin not Found"});
          }
  
          return res.status(200).json({success:true,data:updateAdmin,message:"admin updated Successfully."})
        } catch (error) {
          console.error(error);
          return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
}


const deleteAdmin = async(req,res)=>{
    try {
      const {adminId} = req.params;
  
      if(!adminId){
          return res.status(404).json({success:false,message:"Admin Not found"});
      }
  
      const deletedAdmin = await Admin.findByIdAndDelete(adminId).select("-password");
  
      if(!deletedAdmin){
          return res.status(500).json({success:false,message:"Something went wrong please try again"})
      }
  
      return res.status(200).json({success:true ,data:deletedAdmin,message:"Admin Deleted successfully !!"})
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export {createAdmin,login,viewAdmin,getAllAdminDashboards,updateAdmin,deleteAdmin,ForgotPassword,verifyOTP,resetPassWord};