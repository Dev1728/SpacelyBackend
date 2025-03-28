import express from 'express';
import multer from 'multer';
import { uploadFileMiddleware } from '../controllers/uploadFile.controller.js'  // Import the middleware

const router = express.Router();

// Set up multer to handle file uploads
const storage = multer.memoryStorage();  // Store files in memory
const upload = multer({ storage: storage });

// Route for single file upload
router.post('/upload-single', upload.single('file'), async (req, res) => {
  try {
    const urls = await uploadFileMiddleware(req.file, 'single');
    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      urls,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading file',
      error: error.message,
    });
  }
});

// Route for multiple files upload
router.post('/upload-multiple', upload.array('files', 12), async (req, res) => {
  try {
    const urls = await uploadFileMiddleware(req.files, 'multiple');
    res.status(200).json({
      success: true,
      message: 'Files uploaded successfully',
      urls,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading files',
      error: error.message,
    });
  }
});

export default router;
