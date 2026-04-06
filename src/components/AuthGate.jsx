import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Added Link
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from "../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { ArrowRight, Phone, User, Activity, ShieldCheck, ChevronRight, ChevronDown, ChevronLeft } from 'lucide-react'; // Added ChevronLeft
import SocialLogin from "./SocialLogin.jsx";

const AuthGate = () => {
    const navigate = useNavigate();
    const [user, authLoading] = useAuthState(auth);

    const [step, setStep] = useState(1);
    const [status, setStatus] = useState('IDLE');
    const [countryCode, setCountryCode] = useState('+91');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [confirmResult, setConfirmResult] = useState(null);
    const [assessment, setAssessment] = useState({ firstName: '', goal: '' });

    useEffect(() => {
        if (user && !authLoading) checkUserStatus(user);
    }, [user, authLoading]);

    const checkUserStatus = async (currentUser) => {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            navigate("/dashboard", { replace: true });
        } else {
            setStep(2);
        }
    };

    const setupRecaptcha = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', { 'size': 'invisible' });
        }
    };

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setStatus('PROCESSING');
        setupRecaptcha();
        const fullPhoneNumber = `${countryCode}${phoneNumber}`;
        try {
            const result = await signInWithPhoneNumber(auth, fullPhoneNumber, window.recaptchaVerifier);
            setConfirmResult(result);
            setStatus('OTP_SENT');
        } catch (error) { setStatus('ERROR'); }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setStatus('VERIFYING');
        try {
            await confirmResult.confirm(otp);
        } catch (error) { setStatus('ERROR'); }
    };

    const finalizeProfile = async () => {
        setStatus('SAVING');
        try {
            await setDoc(doc(db, "users", user.uid), {
                fullName: assessment.firstName.toUpperCase(),
                phoneNumber: user.phoneNumber || "GOOGLE_AUTH",
                status: 'RECRUIT',
                tier: 'NONE',
                assessment: assessment,
                joinedAt: serverTimestamp()
            }, { merge: true });
            navigate("/dashboard", { replace: true });
        } catch (error) { setStatus('ERROR'); }
    };

    return (
        <div className="h-[100dvh] w-full bg-[#080808] text-white flex flex-col p-6 overflow-hidden antialiased font-sans">
            <div id="recaptcha-container"></div>

            {/* TOP NAVIGATION: Return to Landing Page */}
            <nav className="w-full flex items-center justify-between z-20">
                <Link to="/" className="flex items-center gap-2 text-white/40 hover:text-[#ccff00] transition-colors group">
                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Back</span>
                </Link>

                {/* Clickable Brand Logo */}
                <Link to="/" className="text-[10px] font-black italic uppercase tracking-[0.4em] text-white/20 hover:text-white transition-colors">
                    AJX FIT CLUB
                </Link>
            </nav>

            <div className="flex-1 flex flex-col items-center justify-center relative">
                {/* Ambient Lighting */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[10%] left-[-10%] w-[50%] h-[40%] bg-[#ccff00]/[0.02] blur-[120px] rounded-full"></div>
                    <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[40%] bg-[#ccff00]/[0.02] blur-[120px] rounded-full"></div>
                </div>

                <div className="w-full max-w-[400px] z-10 flex flex-col items-center">
                    <div className="text-center mb-6 md:mb-10">
                        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-xl border border-white/10 bg-white/[0.05] backdrop-blur-3xl">
                            <ShieldCheck size={12} className="text-[#ccff00]" />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/80">Authorized Access</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-[0.8] mb-2">
                            {step === 1 ? 'Enter the' : 'Initialize'} <br />
                            <span className="text-white/20">{step === 1 ? 'Collective' : 'Profile'}</span>
                        </h1>
                    </div>

                    <div className="w-full bg-neutral-900/40 border border-white/[0.08] backdrop-blur-3xl p-6 md:p-12 rounded-[40px] shadow-2xl relative">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/4 h-[1px] bg-gradient-to-r from-transparent via-[#ccff00]/40 to-transparent"></div>

                        {step === 1 ? (
                            <div className="space-y-6 md:space-y-10">
                                <form onSubmit={status === 'OTP_SENT' ? handleVerifyOTP : handleSendOTP} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/60 ml-2">Identity Hub</label>
                                        <div className="flex gap-2 h-14 md:h-16">
                                            <div className="relative w-20 md:w-24 shrink-0">
                                                <select
                                                    value={countryCode}
                                                    onChange={(e) => setCountryCode(e.target.value)}
                                                    className="w-full h-full bg-white/[0.05] border border-white/10 rounded-2xl pl-3 pr-8 text-sm font-bold outline-none focus:border-[#ccff00]/40 appearance-none cursor-pointer"
                                                >
                                                    <option value="+91">+91</option>
                                                    <option value="+1">+1</option>
                                                    <option value="+44">+44</option>
                                                </select>
                                                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" size={12} />
                                            </div>
                                            <div className="relative flex-1">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                                                <input
                                                    type="tel"
                                                    placeholder="Phone Number"
                                                    value={phoneNumber}
                                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                                    className="w-full h-full bg-white/[0.05] border border-white/10 rounded-2xl pl-11 pr-4 text-sm font-medium outline-none focus:border-[#ccff00]/40 placeholder:text-white/30"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {status === 'OTP_SENT' && (
                                        <input
                                            type="text"
                                            placeholder="OTP CODE"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            className="w-full h-14 bg-white/[0.08] border border-[#ccff00]/40 rounded-2xl px-6 text-[#ccff00] text-center font-black tracking-[0.6em] outline-none"
                                        />
                                    )}

                                    <button type="submit" className="w-full py-4 bg-[#ccff00] text-black font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-[0_10px_30px_rgba(204,255,0,0.15)] flex items-center justify-center gap-2">
                                        {status === 'OTP_SENT' ? 'Verify Entry' : 'Request Access'}
                                        <ArrowRight size={16} />
                                    </button>
                                </form>

                                <div className="relative py-1 flex items-center justify-center">
                                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/[0.06]"></div></div>
                                    <span className="relative px-4 bg-[#0c0c0c] text-[8px] font-bold text-white/40 uppercase tracking-[0.4em]">Alternative</span>
                                </div>

                                <SocialLogin type="login" onAuthSuccess={(user) => checkUserStatus(user)} />
                            </div>
                        ) : (
                            <div className="space-y-6 md:space-y-10 animate-in fade-in duration-500">
                                <div className="space-y-4">
                                    <div className="relative">
                                        <User className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                                        <input
                                            type="text"
                                            placeholder="Full Name"
                                            className="w-full h-14 bg-white/[0.05] border border-white/10 rounded-2xl pl-12 pr-6 text-sm font-medium outline-none focus:border-[#ccff00]/40"
                                            onChange={(e) => setAssessment({...assessment, firstName: e.target.value})}
                                        />
                                    </div>
                                    <div className="relative">
                                        <Activity className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                                        <select
                                            className="w-full h-14 bg-white/[0.05] border border-white/10 rounded-2xl pl-12 pr-6 text-sm font-medium outline-none appearance-none focus:border-[#ccff00]/40 text-white/80"
                                            onChange={(e) => setAssessment({...assessment, goal: e.target.value})}
                                        >
                                            <option value="" className="bg-[#080808]">Select Goal</option>
                                            <option value="FAT_LOSS" className="bg-[#080808]">Fat Loss</option>
                                            <option value="STRENGTH" className="bg-[#080808]">Strength</option>
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40" size={14} />
                                    </div>
                                </div>

                                <button onClick={finalizeProfile} className="w-full py-4 bg-[#ccff00] text-black font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-[0_10px_30px_rgba(204,255,0,0.15)] flex items-center justify-center gap-2">
                                    Finalize Profile
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthGate;