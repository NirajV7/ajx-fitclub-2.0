import React, { useEffect } from 'react';
// Import signInWithRedirect and getRedirectResult
import { signInWithRedirect, getRedirectResult } from "firebase/auth";
import { auth, googleProvider, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { LogIn, Cpu } from 'lucide-react';

const SocialLogin = ({ type }) => {
    const navigate = useNavigate();

    // Handle the redirect result when the user returns to the page
    useEffect(() => {
        const handleRedirectResult = async () => {
            try {
                const result = await getRedirectResult(auth);
                if (result) {
                    const user = result.user;
                    const userRef = doc(db, "users", user.uid);
                    const userSnap = await getDoc(userRef);

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
                    }
                    navigate("/dashboard");
                }
            } catch (error) {
                console.error("REDIRECT_RESULT_FAILURE:", error.message);
            }
        };
        handleRedirectResult();
    }, [navigate]);

    const handleGoogleAction = async () => {
        try {
            // Switch from Pop-up to Redirect to bypass browser blockers
            await signInWithRedirect(auth, googleProvider);
        } catch (error) {
            console.error("AUTH_INITIALIZATION_FAILURE:", error.message);
        }
    };

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center gap-4 opacity-20">
                <div className="h-[1px] flex-1 bg-white"></div>
                <span className="text-[7px] font-black tracking-[0.3em] uppercase">OR</span>
                <div className="h-[1px] flex-1 bg-white"></div>
            </div>

            <button
                onClick={handleGoogleAction}
                type="button"
                className="w-full flex items-center justify-center gap-3 py-4 border border-white/10 rounded-2xl text-white/60 hover:text-[#ccff00] hover:border-[#ccff00]/40 hover:bg-[#ccff00]/5 transition-all duration-300 group"
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