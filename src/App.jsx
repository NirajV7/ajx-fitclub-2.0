import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// --- TACTICAL COMPONENT IMPORTS ---
import LandingPage from "./components/LandingPage.jsx";
import SignupPage from "./components/SignupPage.jsx";
import SigninPage from "./components/LoginPage.jsx";
import VerifyKey from "./components/VerifyKey.jsx";
import Dashboard from "./components/Dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx"; // The "Bouncer" component

function App() {
    return (
        <Router>
            <Routes>
                {/* --- PUBLIC ACCESS GATES --- */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/login" element={<SigninPage />} />

                {/* --- AUTHORIZED PERSONNEL ONLY --- */}
                {/* Routes wrapped in ProtectedRoute require a Firebase session */}
                <Route
                    path="/verify-key"
                    element={
                        <ProtectedRoute>
                            <VerifyKey />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                {/* --- PROTOCOL REDIRECTS --- */}
                {/* Redirect any unknown URL back to Home to maintain site integrity */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;