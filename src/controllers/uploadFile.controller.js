// import { bucket } from "../../firebase.js"; // Firebase bucket

// export const uploadToFirebase = async (req, res) => {
//   try {
//     if (!req.file && !req.files) {
//       return res.status(400).json({ success: false, message: "No file uploaded!" });
//     }

//     const files = req.file ? [req.file] : req.files; 

//     const uploadPromises = files.map((file) => {
//       return new Promise((resolve, reject) => {
//         const blob = bucket.file(`uploads/${Date.now()}_${file.originalname}`);
//         const blobStream = blob.createWriteStream({
//           metadata: { contentType: file.mimetype },
//         });

//         blobStream.on("error", (err) => reject(err));

//         blobStream.on("finish", async () => {
//           const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
//           resolve(publicUrl); // Send URL for each uploaded file
//         });

//         blobStream.end(file.buffer);
//       });
//     });

//     const fileUrls = await Promise.all(uploadPromises);

//     res.status(200).json({
//       success: true,
//       message: "File(s) uploaded successfully!",
//       urls: fileUrls, // Return the URLs for the uploaded files
//     });
//   } catch (error) {
//     console.error("Upload Error:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };
