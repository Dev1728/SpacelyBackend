import multer from "multer";
import path from "path";

// Configure multer for memory storage (since you'll upload to Firebase)
const storage = multer.memoryStorage();

// Define the allowed file types (images & videos)
const fileTypes = /jpeg|jpg|png|gif|mp4|mov|avi|mkv/;

// Middleware for **multiple file uploads** (max 12 files)
export const uploadMultiple = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // Increased to 50MB for videos
  fileFilter: (req, file, cb) => checkFileType(file, cb),
}).array("files", 12); // Changed field name to "files" (handles images & videos)

// Middleware for **single file upload**
export const uploadSingle = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // Increased to 50MB for videos
  fileFilter: (req, file, cb) => checkFileType(file, cb),
}).single("file"); // Ensure the field name matches the frontend form

// Function to validate file types
function checkFileType(file, cb) {
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileTypes.test(file.mimetype);

  if (mimeType && extName) {
    return cb(null, true);
  } else {
    cb(new Error("Error: Only images and videos are allowed!"));
  }
}






// import  multer from "multer"
// import  path  from "path"
// import  fs from "fs"
// // import uuid from "uuid/v4";

// export const uploadMultiple = multer({
//   storage: multer.memoryStorage(),
//   limits: { fileSize: 5000000 },
//   fileFilter: function (req, file, cb) {
//     checkFileType(file, cb);
//   }
// }).array("images", 12);

// export const uploadSingle = multer({
//   storage: multer.memoryStorage(),
//   limits: { fileSize: 5000000 },
//   fileFilter: async function (req, file, cb) {
//   checkFileType(file, cb);
//   }
// }).single("images");

// // // Check file Type
// function checkFileType(file, cb) {

//   // Allowed ext
//   const fileTypes = /jpeg|jpg|png|gif|mp4|mov|avi|mkv/;
//   // Check ext
//   const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
//   // Check mime
//   const mimeType = fileTypes.test(file.mimetype);

//   if (mimeType && extName) {
//     return cb(null, true);
//   } else {
//     cb("Error: Images Only !!!");
//   }
// }