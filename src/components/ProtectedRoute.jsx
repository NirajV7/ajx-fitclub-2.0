import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { Cpu } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
    // Listen for the current authentication state
    const [user, loading] = useAuthState(auth);

    // While the app is communicating with Firebase, show a tactical loader
    if (loading) {
        return (
            <div className="h-screen bg-black flex flex-col items-center justify-center">
                <Cpu size={24} className="text-[#ccff00] animate-spin mb-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">
                    Establishing Secure Link...
                </span>
            </div>
        );
    }

    // If no user is found, redirect to the login gate
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // If authorized, allow access to the protected content
    return children;
};

export default ProtectedRoute;