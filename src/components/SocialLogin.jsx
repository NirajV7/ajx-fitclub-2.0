import React, { useState } from 'react';
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { LogIn, Cpu } from 'lucide-react';

const SocialLogin = ({ type, onAuthSuccess }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleGoogleAction = async () => {
        setIsLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            if (user) {
                sessionStorage.setItem('ajx_auth_active', 'true');
                const userRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userRef);

                // LOGIC: If user exists and we are logging in, go to dashboard.
                // If user is new OR we are in signup mode, hand over to Assessment.
                if (userSnap.exists() && type === "login") {
                    navigate("/dashboard", { replace: true });
                } else {
                    // This triggers the Step 2 in your SignupPage
                    if (onAuthSuccess) {
                        onAuthSuccess(user);
                    } else {
                        // Fallback for standalone use
                        navigate("/dashboard");
                    }
                }
            }
        } catch (error) {
            console.error("GOOGLE_AUTH_FAILURE:", error.code);
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-8 opacity-50">
                <Cpu size={20} className="text-[#ccff00] animate-spin mb-2" />
                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-[#ccff00]">Syncing Identity...</span>
            </div>
        );
    }

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center gap-4 opacity-20">
                <div className="h-[1px] flex-1 bg-white"></div>
                <span className="text-[7px] font-black uppercase tracking-[0.3em]">OR</span>
                <div className="h-[1px] flex-1 bg-white"></div>
            </div>

            <button
                onClick={handleGoogleAction}
                type="button"
                className="w-full flex items-center justify-center gap-3 py-4 border border-white/10 rounded-2xl text-white/60 hover:text-[#ccff00] hover:border-[#ccff00]/40 hover:bg-[#ccff00]/5 transition-all duration-300 group"
            >
                <LogIn size={14} />
                <span className="text-[9px] font-black uppercase tracking-[0.3em]">
                    {type === "signup" ? "Initialize via Google" : "Authorize via Google"}
                </span>
            </button>
        </div>
    );
};

export default SocialLogin;