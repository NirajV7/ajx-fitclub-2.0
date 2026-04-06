// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your updated web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAOITgE0oZ8Kb7EqQn1oqnaKN_O9MG9pLQ",
    authDomain: "ajxfitclub-v2.firebaseapp.com",
    projectId: "ajxfitclub-v2",
    storageBucket: "ajxfitclub-v2.firebasestorage.app",
    messagingSenderId: "128715919039",
    appId: "1:128715919039:web:90a34560a9df512bb2800a",
    measurementId: "G-DZ5M8L1BTJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export tools for use in your components
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const analytics = getAnalytics(app);

export default app;