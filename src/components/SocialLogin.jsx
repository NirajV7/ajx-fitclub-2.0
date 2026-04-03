import React, { useEffect, useState } from 'react';
import { signInWithRedirect, getRedirectResult } from "firebase/auth";
import { auth, googleProvider, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { LogIn, Cpu } from 'lucide-react';

const SocialLogin = ({ type }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false); // New loading state

    useEffect(() => {
        const handleRedirectResult = async () => {
            setIsLoading(true); // Start loading immediately
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
                            status: 'PENDING_ACTIVATION'
                        });
                    }
                    // CRITICAL: Use { replace: true } to remove Signup from history
                    navigate("/dashboard", { replace: true });
                } else {
                    setIsLoading(false); // No redirect result, stop loading
                }
            } catch (error) {
                console.error("REDIRECT_FAILURE:", error.message);
                setIsLoading(false);
            }
        };
        handleRedirectResult();
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