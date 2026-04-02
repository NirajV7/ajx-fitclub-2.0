import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your components
// Ensure the file names match exactly (e.g., LandingPage.jsx, SignupPage.jsx, SigninPage.jsx)
import LandingPage from "./components/LandingPage.jsx";
import SignupPage from "./components/SignupPage.jsx";
import SigninPage from "./components/LoginPage.jsx";

function App() {
    return (
        <Router>
            <Routes>
                {/* The main entrance to AJX FITCLUB */}
                <Route path="/" element={<LandingPage />} />

                {/* The Recruitment / Registration Portal */}
                <Route path="/signup" element={<SignupPage />} />

                {/* The Secure Authentication / Login Terminal */}
                <Route path="/login" element={<SigninPage />} />

                {/* Optional: Redirect any unknown URL back to Home */}
                <Route path="*" element={<LandingPage />} />
            </Routes>
        </Router>
    );
}

export default App;