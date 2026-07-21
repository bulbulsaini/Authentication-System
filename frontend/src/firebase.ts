import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBr-dUJvvS3QYFraKw024M3cjZUVysxgVU",
  authDomain: "authentication-system-1d5e4.firebaseapp.com",
  projectId: "authentication-system-1d5e4",
  storageBucket: "authentication-system-1d5e4.firebasestorage.app",
  messagingSenderId: "846825828200",
  appId: "1:846825828200:web:11703dcca8b392b042b0dd",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Auth so you can use it in other files
export const auth = getAuth(app);