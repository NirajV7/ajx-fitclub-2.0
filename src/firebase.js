import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // Add GoogleAuthProvider
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// Find this in: Firebase Console > Project Settings > General > Your Apps
const firebaseConfig = {
    apiKey: "AIzaSyAngn0IiJsNyEg4YH-1bC3LZow4PH-dnyk",
    authDomain: "ajxfitclub.firebaseapp.com",
    projectId: "ajxfitclub",
    storageBucket: "ajxfitclub.firebasestorage.app",
    messagingSenderId: "1049126756107",
    appId: "1:1049126756107:web:a308e7f76f1d9e8ff00c0e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export tools for use in LandingPage, LoginPage, etc.
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider(); // Initialize and export the provider