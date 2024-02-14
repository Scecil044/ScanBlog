// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_FIREBASE_KEY,
  authDomain: "sciblog-b1a95.firebaseapp.com",
  projectId: "sciblog-b1a95",
  storageBucket: "sciblog-b1a95.appspot.com",
  messagingSenderId: "293700515320",
  appId: "1:293700515320:web:d02ea909c175ed022bd20d",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
