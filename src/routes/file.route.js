import express from 'express';
import multer from 'multer';
import {uploadFileMiddleware} from '../middlewear/uploadFile.middlerwear.js'  // Import the middleware
import { uploadMultiple, uploadSingle } from '../middlewear/multer.middlewear.js';

const router = express.Router();



// Route for single file upload
router.route('/upload-single').post(uploadSingle, async (req, res) => {
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
router.route('/upload-multiple').post(uploadMultiple, async (req, res) => {
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
