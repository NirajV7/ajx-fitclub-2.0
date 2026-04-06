import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from "../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { Lock, Cpu, ArrowRight, ShieldCheck, ChevronDown } from 'lucide-react';
import SocialLogin from "./SocialLogin.jsx";

const LoginPage = () => {
    const navigate = useNavigate();
    const [user, loading] = useAuthState(auth);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState('IDLE'); // IDLE, OTP_SENT
    const [showPhone, setShowPhone] = useState(false);

    // SILENT HANDSHAKE: Skip login if session is still active
    // This is the correct placement
    useEffect(() => {
        if (user && !loading) {
            navigate("/dashboard", { replace: true });
        }
    }, [user, loading, navigate]);

    const setupRecaptcha = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible'
            });
        }
    };

    const handlePhoneLogin = async (e) => {
        e.preventDefault();
        setupRecaptcha();
        const formattedPhone = `+91${phoneNumber}`;
        try {
            const result = await signInWithPhoneNumber(auth, formattedPhone, window.recaptchaVerifier);
            window.confirmationResult = result;
            setStep('OTP_SENT');
        } catch (error) {
            console.error("AUTH_GATE_FAILURE:", error);
        }
    };

    if (loading) return null; // Handled by ProtectedRoute loader

    return (
        <div className="h-screen bg-black text-white flex items-center justify-center font-sans relative overflow-hidden">
            <div id="recaptcha-container"></div>

            <div className="max-w-md w-full p-10 bg-white/[0.02] border border-white/10 rounded-[32px] backdrop-blur-3xl relative z-10 shadow-2xl">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#ccff00]/30 rounded-full bg-[#ccff00]/5 mb-6">
                        <ShieldCheck size={12} className="text-[#ccff00]" />
                        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-[#ccff00]">Security Protocol 7.0</span>
                    </div>
                    <h2 className="text-4xl font-black italic uppercase tracking-tighter">Authorized Entry.</h2>
                    <p className="text-white/40 text-[9px] font-bold tracking-[0.2em] uppercase mt-2">Restoring Member Session...</p>
                </div>

                {/* PRIMARY: ELITE FAST-LANE */}
                <div className="space-y-4 mb-8">
                    <SocialLogin type="login" />
                </div>

                {/* SECONDARY: MANUAL OVERRIDE */}
                <div className="pt-6 border-t border-white/5">
                    {!showPhone ? (
                        <button
                            onClick={() => setShowPhone(true)}
                            className="w-full flex items-center justify-center gap-2 text-[8px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-[#ccff00] transition-colors"
                        >
                            <ChevronDown size={10} />
                            Manual Phone Override
                        </button>
                    ) : (
                        <form onSubmit={step === 'OTP_SENT' ? (e) => { e.preventDefault(); window.confirmationResult.confirm(otp).then(() => navigate("/dashboard")); } : handlePhoneLogin} className="space-y-4 animate-in fade-in slide-in-from-top-2">
                            <input
                                type="tel"
                                placeholder="PHONENUMBER"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-[11px] font-bold outline-none focus:border-[#ccff00]/40"
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                            {step === 'OTP_SENT' && (
                                <input
                                    type="text"
                                    placeholder="ENTER OTP"
                                    className="w-full bg-white/5 border border-[#ccff00]/40 rounded-xl py-3 px-4 text-[11px] font-black tracking-[0.5em] text-center outline-none"
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                            )}
                            <button className="w-full py-3 bg-white/10 border border-white/10 text-white font-black uppercase tracking-[0.3em] text-[9px] rounded-xl hover:bg-[#ccff00] hover:text-black transition-all flex items-center justify-center gap-2">
                                {step === 'OTP_SENT' ? 'VERIFY' : 'SEND OTP'}
                                <ArrowRight size={12} />
                            </button>
                        </form>
                    )}
                </div>
            </div>

            {/* HUD DECORATIONS */}
            <div className="absolute top-10 left-10 opacity-20 hidden md:flex flex-col gap-1">
                <span className="text-[7px] font-mono tracking-widest text-[#ccff00]">LOCATING_MEMBER_ID...</span>
                <span className="text-[7px] font-mono tracking-widest text-white/40">HANDSHAKE_READY</span>
            </div>
        </div>
    );
};

export default LoginPage;