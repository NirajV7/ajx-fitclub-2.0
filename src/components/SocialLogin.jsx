import React, { useState } from 'react';
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Loader2 } from 'lucide-react';

const SocialLogin = ({ type, onAuthSuccess }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleGoogleAction = async () => {
        setIsLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            if (user) {
                const userRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists() && type === "login") {
                    navigate("/dashboard", { replace: true });
                } else {
                    if (onAuthSuccess) {
                        onAuthSuccess(user);
                    } else {
                        navigate("/dashboard");
                    }
                }
            }
        } catch (error) {
            console.error("GOOGLE_AUTH_FAILURE:", error.code);
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            <button
                onClick={handleGoogleAction}
                disabled={isLoading}
                type="button"
                className="w-full flex items-center justify-center gap-3 py-4.5 bg-white/[0.03] border border-white/10 rounded-3xl text-white font-bold hover:bg-white/[0.08] hover:border-[#ccff00]/30 transition-all duration-500 active:scale-[0.98] group shadow-xl"
            >
                {isLoading ? (
                    <Loader2 size={18} className="animate-spin text-[#ccff00]" />
                ) : (
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-500" viewBox="0 0 48 48">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                        <path fill="#4285F4" d="M46.64 24.55c0-1.65-.15-3.23-.42-4.75H24v9h12.75c-.55 2.86-2.16 5.32-4.63 7.02l7.19 5.58c4.21-3.88 6.63-9.59 6.63-16.85z" />
                        <path fill="#FBBC05" d="M10.54 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.98-6.19z" />
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.79l-7.19-5.58c-2.21 1.48-5.03 2.37-8.72 2.37-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                    </svg>
                )}
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/80 group-hover:text-white transition-colors">
                    {isLoading ? "Syncing Identity..." : "Continue with Google"}
                </span>
            </button>
        </div>
    );
};

export default SocialLogin;