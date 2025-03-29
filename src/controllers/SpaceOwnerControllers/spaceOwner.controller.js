import { SpaceOwnerSchema } from "../../models/SpaceOwnerModels/spaceOwner.models.js";
import { sendEmail } from "../../utils/EmailTransporter.js";
import { uploadFileMiddleware } from "../../middlewear/uploadFile.middlerwear.js";

// Create Profile
const createProfile = async (req, res) => {
  try {
    const { file } = req; // Access the file uploaded by multer

    const { name: { firstName, lastName }, aadharNumber, email, contact } = req.body;

    if (!firstName || !lastName || !aadharNumber || !email || !contact) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (!email.includes('@')) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    const isExistedOwner = await SpaceOwnerSchema.findOne({ email });

    if (isExistedOwner) {
      return res.status(409).json({ success: false, message: "Owner profile already exists" });
    }

    // Check if file exists before proceeding to upload
    const FirebaseUrl = await uploadFileMiddleware(file, "single");

    // Ensure FirebaseUrl is a string, not an array
    const profilePicUrl = Array.isArray(FirebaseUrl) ? FirebaseUrl[0] : FirebaseUrl;

    const createOwnerProfile = await SpaceOwnerSchema.create({
      name: { firstName, lastName },
      email,
      contact,
      profilePic: profilePicUrl === "" ? "" : profilePicUrl, 
      idProof: { aadharNumber },
    });

    if (!createOwnerProfile) {
      return res.status(400).json({ success: false, message: "Something went wrong with owner profile creation" });
    }

    const createdOwner = await SpaceOwnerSchema.findById(createOwnerProfile._id).select('-otp -verifiedId -otpExpires');

    return res.status(201).json({ success: true, data: createdOwner, message: "Owner profile created successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const isExist = await SpaceOwnerSchema.findOne({ email });

    if (!isExist) {
      return res.status(404).json({ success: false, message: "SpaceOwner not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
    const verifiedId = Math.floor(10000000 + Math.random() * 90000000).toString();

    isExist.verifiedId = verifiedId;
    isExist.otp = otp;
    isExist.otpExpires = otpExpires;
    await isExist.save();

    const message = `<p>Your OTP and verifiedId for login are: <b>${otp}</b>, VerifiedID: <b>${verifiedId}</b>. This OTP is valid for 10 minutes.</p>`;
    await sendEmail(email, "Login OTP and VerifiedID", message);

    return res.status(200).json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Verify OTP
const verifyOTP = async (req, res) => {
  try {
    const { otp, verifiedId } = req.body;

    if (!otp || !verifiedId) {
      return res.status(400).json({ success: false, message: "OTP and Verified ID are required" });
    }

    const spaceOwner = await SpaceOwnerSchema.findOne({
      otp,
      otpExpires: { $gt: Date.now() }, // Check if OTP is still valid
      verifiedId,
    });

    if (!spaceOwner) {
      return res.status(401).json({ success: false, message: "Invalid or expired OTP" });
    }

    const updatedOwner = await SpaceOwnerSchema.findOneAndUpdate(
      { verifiedId }, 
      {
        $unset: { otp: 1, otpExpires: 1, verifiedId: 1 },  // Unset these fields
      },
      { new: true }  
    ).select('-otp -otpExpires -verifiedId');  

    return res.status(200).json({ success: true, data: updatedOwner, message: "Login successfully with OTP" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export { createProfile, login, verifyOTP };
