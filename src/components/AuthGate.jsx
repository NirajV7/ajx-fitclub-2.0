import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from "../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { ArrowRight, Phone, User, ShieldCheck, ChevronRight, ChevronLeft, Check, Target } from 'lucide-react';
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

    const tacticalGoals = [
        { id: 'SENIOR_STRENGTH', label: 'Senior Citizen Strengthening' },
        { id: 'MUSCLE_GAIN', label: 'Muscle Gain' },
        { id: 'WEIGHT_GAIN', label: 'Weight Gain' },
        { id: 'FAT_LOSS', label: 'Fat Loss & Toning' },
        { id: 'STRENGTH', label: 'Power & Strength' }
    ];

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
        if (!assessment.goal || !assessment.firstName) return;
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

            <nav className="w-full flex items-center justify-between z-20 shrink-0">
                <Link to="/" className="flex items-center gap-2 text-white/40 hover:text-[#ccff00] transition-colors group">
                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Back</span>
                </Link>
                <span className="text-[10px] font-black italic uppercase tracking-[0.4em] text-white/20">AJX FIT CLUB</span>
            </nav>

            <div className="flex-1 flex flex-col items-center justify-center relative">
                <div className="w-full max-w-[400px] z-10">
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 rounded-xl border border-white/10 bg-white/[0.05]">
                            <ShieldCheck size={12} className="text-[#ccff00]" />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/80">Authorized Access</span>
                        </div>
                        <h1 className="text-4xl font-black italic uppercase tracking-tighter leading-[0.8]">
                            {step === 1 ? 'Enter the' : 'Initialize'} <br />
                            <span className="text-white/20">{step === 1 ? 'Collective' : 'Profile'}</span>
                        </h1>
                    </div>

                    <div className="w-full bg-neutral-900/40 border border-white/[0.08] backdrop-blur-3xl p-6 md:p-8 rounded-[40px] shadow-2xl">
                        {step === 1 ? (
                            <div className="space-y-6">
                                <form onSubmit={status === 'OTP_SENT' ? handleVerifyOTP : handleSendOTP} className="space-y-4">
                                    <div className="flex gap-2 h-14">
                                        <div className="w-16 bg-white/[0.05] border border-white/10 rounded-2xl flex items-center justify-center text-xs font-bold">+91</div>
                                        <input
                                            type="tel"
                                            placeholder="Phone Number"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            className="flex-1 bg-white/[0.05] border border-white/10 rounded-2xl px-5 text-sm font-medium outline-none focus:border-[#ccff00]/40 placeholder:text-white/20"
                                        />
                                    </div>
                                    <button type="submit" className="w-full h-14 bg-[#ccff00] text-black font-black uppercase tracking-widest text-[10px] rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all">
                                        {status === 'OTP_SENT' ? 'Verify Entry' : 'Request Access'} <ArrowRight size={16} />
                                    </button>
                                </form>
                                <SocialLogin type="login" onAuthSuccess={(user) => checkUserStatus(user)} />
                            </div>
                        ) : (
                            <div className="space-y-5">
                                <div className="relative h-14">
                                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        className="w-full h-full bg-white/[0.05] border border-white/10 rounded-2xl pl-12 pr-6 text-sm font-medium outline-none focus:border-[#ccff00]/40 placeholder:text-white/20"
                                        onChange={(e) => setAssessment({...assessment, firstName: e.target.value})}
                                    />
                                </div>

                                {/* OBJECTIVE SECTION WITH HEADING */}
                                <div className="space-y-2.5">
                                    <div className="flex items-center gap-2 ml-2">
                                        <div className="w-1 h-1 rounded-full bg-[#ccff00]"></div>
                                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">Select Objective</label>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        {tacticalGoals.map((goal) => (
                                            <button
                                                key={goal.id}
                                                type="button"
                                                onClick={() => setAssessment({...assessment, goal: goal.id})}
                                                className={`flex items-center justify-between px-5 py-3 rounded-xl border transition-all duration-300 ${
                                                    assessment.goal === goal.id
                                                        ? 'border-[#ccff00] bg-[#ccff00]/10 text-white'
                                                        : 'border-white/5 bg-white/[0.03] text-white/30 hover:border-white/10'
                                                }`}
                                            >
                                                <span className="text-[9px] font-black uppercase tracking-widest leading-none">{goal.label}</span>
                                                {assessment.goal === goal.id && <Check size={12} className="text-[#ccff00]" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={finalizeProfile}
                                    disabled={!assessment.goal || !assessment.firstName}
                                    className={`w-full h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all ${
                                        assessment.goal && assessment.firstName
                                            ? 'bg-[#ccff00] text-black shadow-[0_10px_30px_rgba(204,255,0,0.2)]'
                                            : 'bg-white/5 text-white/10 cursor-not-allowed opacity-50'
                                    }`}
                                >
                                    Finalize Profile <ChevronRight size={16} />
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