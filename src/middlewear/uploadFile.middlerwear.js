import { ref, getStorage, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase.js'; // Import your Firebase Auth instance

export const uploadFileMiddleware = async (files, quantity) => {
  const storageFB = getStorage();
  const urls = [];

  // Function to determine the file type (image or video)
  const getFileType = (extension) => {
    const imageTypes = ['jpeg', 'jpg', 'png', 'gif'];
    const videoTypes = ['mp4', 'mov', 'avi', 'mkv'];
    if (imageTypes.includes(extension.toLowerCase())) {
      return 'image';
    } else if (videoTypes.includes(extension.toLowerCase())) {
      return 'video';
    } else {
      throw new Error("Error: Unsupported file type!");
    }
  };

  try {
    // Ensure you're signed in before uploading
    await signInWithEmailAndPassword(auth, "devesh@techavtar.com", "devesh@123");

    if (quantity === 'single') {
      const dateTime = Date.now();
      const fileExtension = files.originalname.split('.').pop(); // Get file extension
      const fileType = getFileType(fileExtension); // Get file type (image/video)

      // Determine folder based on file type (image or video)
      const folder = fileType === 'image' ? 'images' : 'videos';

      const fileName = `${folder}/${dateTime}.${fileExtension}`;
      const storageRef = ref(storageFB, fileName);

      const metadata = {
        contentType: files.mimetype,
      };

      // Initiate the upload task
      const uploadTask = uploadBytesResumable(storageRef, files.buffer, metadata);

      // Wait for the upload task to complete
      await uploadTask;

      // Once the upload is complete, get the download URL
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
      urls.push(downloadURL);

    } else if (quantity === 'multiple') {
      for (let i = 0; i < files.length; i++) {
        const dateTime = Date.now();
        const fileExtension = files[i].originalname.split('.').pop(); // Get file extension
        const fileType = getFileType(fileExtension); // Get file type (image/video)

        // Determine folder based on file type (image or video)
        const folder = fileType === 'image' ? 'images' : 'videos';

        const fileName = `${folder}/${dateTime}_${i + 1}.${fileExtension}`;
        const storageRef = ref(storageFB, fileName);

        const metadata = {
          contentType: files[i].mimetype,
        };

        const uploadTask = uploadBytesResumable(storageRef, files[i].buffer, metadata);
        
        // Wait for each file to upload
        await uploadTask;

        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        urls.push(downloadURL);
      }
    }

    return urls; 
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error; // Rethrow the error to handle it in the calling function
  }
};
