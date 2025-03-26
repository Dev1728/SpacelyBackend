// import admin from 'firebase-admin';
// import dotenv from 'dotenv';
// import fs from 'fs';

// // Load environment variables from .env file
// dotenv.config(); 

// // Read the Firebase service account file (spacelyBackendFirebase.json)
// const serviceAccount = JSON.parse(fs.readFileSync('./config/spacelyBackendFirebase.json', 'utf8'));

// // Ensure private key formatting is correct
// serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');  // Fix line breaks in the private key

// // Initialize Firebase Admin SDK if not already initialized
// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     storageBucket: process.env.FIREBASE_STORAGE_BUCKET, 
//   });
// }

// // Initialize Firebase Storage
// const bucket = admin.storage().bucket();
// console.log("Firebase Bucket:", process.env.FIREBASE_STORAGE_BUCKET);
// export { admin, bucket };
