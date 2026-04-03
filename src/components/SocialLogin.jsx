import React, { useEffect, useState } from 'react';
// Redirect methods for mobile stability
import { signInWithRedirect, getRedirectResult } from "firebase/auth";
import { auth, googleProvider, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { LogIn, Cpu } from 'lucide-react';

const SocialLogin = ({ type }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const handleAuthState = async () => {
            setIsLoading(true);
            try {
                // 1. Check for the Google redirect result
                const result = await getRedirectResult(auth);
                let user = result?.user;

                // 2. Mobile Fallback for session persistence
                if (!user && auth.currentUser) {
                    user = auth.currentUser;
                }

                if (user) {
                    // STEP 1: Set the Auth Intent flag before entering the terminal
                    // This tells the Signup page: "The user is actively entering, do not kick them out."
                    sessionStorage.setItem('ajx_auth_active', 'true');

                    const userRef = doc(db, "users", user.uid);
                    const userSnap = await getDoc(userRef);

                    // 3. Initialize profile if first-time recruit
                    if (!userSnap.exists()) {
                        await setDoc(userRef, {
                            firstName: user.displayName?.split(' ')[0].toUpperCase() || 'RECRUIT',
                            lastName: user.displayName?.split(' ')[1]?.toUpperCase() || 'OPERATIVE',
                            email: user.email.toLowerCase(),
                            tier: 'RECRUIT',
                            createdAt: new Date(),
                            status: 'PENDING_ACTIVATION',
                            authMethod: 'GOOGLE'
                        });
                        console.log("MOBILE_IDENTITY_SYNC: New Recruit Captured");
                    }

                    // 4. Use { replace: true } to overwrite the signup page in history
                    navigate("/dashboard", { replace: true });
                } else {
                    setIsLoading(false);
                }
            } catch (error) {
                console.error("MOBILE_AUTH_ERROR:", error.code, error.message);
                setIsLoading(false);
            }
        };

        handleAuthState();
    }, [navigate]);

    // Start the Google Auth flow and mark intent
    const handleGoogleAction = async () => {
        try {
            // Set flag so the Signup guard knows this is an active login attempt
            sessionStorage.setItem('ajx_auth_active', 'true');
            await signInWithRedirect(auth, googleProvider);
        } catch (error) {
            console.error("AUTH_INITIALIZATION_FAILURE:", error.message);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-8 opacity-50">
                <Cpu size={20} className="text-[#ccff00] animate-spin mb-2 shadow-[0_0_15px_rgba(204,255,0,0.3)]" />
                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-[#ccff00]">Syncing Identity...</span>
            </div>
        );
    }

    return (
        <div className="w-full space-y-4 font-bold text-white">
            <div className="flex items-center gap-4 opacity-20 font-bold">
                <div className="h-[1px] flex-1 bg-white font-bold"></div>
                <span className="text-[7px] font-black uppercase tracking-[0.3em] font-bold">OR</span>
                <div className="h-[1px] flex-1 bg-white font-bold"></div>
            </div>

            <button
                onClick={handleGoogleAction}
                type="button"
                className="w-full flex items-center justify-center gap-3 py-4 border border-white/10 rounded-2xl text-white/60 hover:text-[#ccff00] hover:border-[#ccff00]/40 hover:bg-[#ccff00]/5 transition-all duration-300 group font-bold"
            >
                <LogIn size={14} className="group-hover:rotate-12 transition-transform" />
                <span className="text-[9px] font-black uppercase tracking-[0.3em] font-bold">
                    {type === "signup" ? "Initialize via Google" : "Authorize via Google"}
                </span>
            </button>
        </div>
    );
};

export default SocialLogin;