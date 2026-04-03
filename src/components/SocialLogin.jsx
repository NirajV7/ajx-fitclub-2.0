import React, { useEffect, useState } from 'react';
import { signInWithRedirect, getRedirectResult } from "firebase/auth";
import { auth, googleProvider, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { LogIn, Cpu } from 'lucide-react';

const SocialLogin = ({ type }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false); // New loading state

    // Updated useEffect for mobile persistence
    useEffect(() => {
        const handleAuthState = async () => {
            setIsLoading(true);
            try {
                // 1. Check if we just came back from a redirect
                const result = await getRedirectResult(auth);
                let user = result?.user;

                // 2. Mobile fallback: If result is null, check if auth already updated the user
                if (!user && auth.currentUser) {
                    user = auth.currentUser;
                }

                if (user) {
                    const userRef = doc(db, "users", user.uid);
                    const userSnap = await getDoc(userRef);

                    // Only create the record if it doesn't exist
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
                    // Clean history for a smooth mobile "Back" experience
                    navigate("/dashboard", { replace: true });
                }
            } catch (error) {
                console.error("MOBILE_AUTH_ERROR:", error.code, error.message);
            } finally {
                setIsLoading(false);
            }
        };

        handleAuthState();
    }, [navigate]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-8 opacity-50">
                <Cpu size={20} className="text-[#ccff00] animate-spin mb-2" />
                <span className="text-[8px] font-black uppercase tracking-[0.3em]">Syncing Identity...</span>
            </div>
        );
    }

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center gap-4 opacity-20">
                <div className="h-[1px] flex-1 bg-white"></div>
                <span className="text-[7px] font-black tracking-[0.3em] uppercase text-white">OR</span>
                <div className="h-[1px] flex-1 bg-white"></div>
            </div>

            <button
                onClick={() => signInWithRedirect(auth, googleProvider)}
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