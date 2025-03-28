import { storage } from '../../firebase.js'; 
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export const uploadFileMiddleware = async (files, quantity) => {
  const urls = [];

  try {
    if (quantity === 'single') {
      const dateTime = Date.now();
      const fileName = `uploads/${dateTime}_${files.originalname}`;
      const storageRef = ref(storage, fileName);

      const metadata = {
        contentType: files.mimetype,
      };

      const uploadTask = uploadBytesResumable(storageRef, files.buffer, metadata);

      // Wait for the upload to complete
      await uploadTask;

      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
      urls.push(downloadURL);
    } else if (quantity === 'multiple') {
      for (let i = 0; i < files.length; i++) {
        const dateTime = Date.now();
        const fileName = `uploads/${dateTime}_${files[i].originalname}`;
        const storageRef = ref(storage, fileName);

        const metadata = {
          contentType: files[i].mimetype,
        };

        const uploadTask = uploadBytesResumable(storageRef, files[i].buffer, metadata);
        await uploadTask;

        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        urls.push(downloadURL);
      }
    }

    return urls;
  } catch (error) {
    console.error("Error uploading file(s):", error);
    throw error;  // Re-throw the error to be handled by the calling function
  }
};
