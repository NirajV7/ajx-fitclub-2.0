import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from "../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp, collection, query, where, getDocs } from "firebase/firestore";
import { ArrowRight, User, ShieldCheck, ChevronRight, ChevronLeft, Check, Activity, AlertCircle } from 'lucide-react';
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
    const [errorMessage, setErrorMessage] = useState('');

    const tacticalGoals = [
        { id: 'SENIOR_STRENGTH', label: 'Senior Strengthening' },
        { id: 'MUSCLE_GAIN', label: 'Muscle Gain' },
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
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible'
            });
        }
    };

    const handleSendOTP = async (e) => {
        e?.preventDefault();
        if (phoneNumber.length !== 10 || !/^\d+$/.test(phoneNumber)) {
            setErrorMessage('Enter a valid 10-digit number');
            return;
        }

        setStatus('PROCESSING');
        setErrorMessage('');
        setupRecaptcha();

        const fullPhoneNumber = `${countryCode}${phoneNumber}`;

        try {
            const q = query(collection(db, "users"), where("phoneNumber", "==", fullPhoneNumber));
            const querySnapshot = await getDocs(q);
            const userExists = !querySnapshot.empty;

            const result = await signInWithPhoneNumber(auth, fullPhoneNumber, window.recaptchaVerifier);
            setConfirmResult(result);
            setStatus('OTP_SENT');

            if (userExists) setErrorMessage('Welcome back. Verifying identity...');
        } catch (error) {
            console.error("AUTH_ERROR:", error.code);
            setStatus('IDLE');
            if (error.code === 'auth/too-many-requests') {
                setErrorMessage('SMS limit reached. Please try again in a few hours.');
            } else if (error.code === 'auth/invalid-phone-number') {
                setErrorMessage('Format error. Use 10 digits without spaces.');
            } else {
                setErrorMessage('Connection failed. Please try again.');
            }
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
                window.recaptchaVerifier = null;
            }
        }
    };

    const handleVerifyOTP = async (e) => {
        e?.preventDefault();
        if (otp.length < 6) return;
        setStatus('VERIFYING');
        setErrorMessage('');
        try {
            await confirmResult.confirm(otp);
        } catch (error) {
            setStatus('OTP_SENT');
            setErrorMessage('Incorrect code. Check your SMS.');
        }
    };

    const finalizeProfile = async () => {
        if (!assessment.goal || !assessment.firstName) return;
        setStatus('SAVING');
        try {
            await setDoc(doc(db, "users", user.uid), {
                fullName: assessment.firstName.toUpperCase(),
                phoneNumber: user.phoneNumber || `${countryCode}${phoneNumber}`,
                status: 'RECRUIT',
                tier: 'NONE',
                assessment: assessment,
                joinedAt: serverTimestamp()
            }, { merge: true });
            navigate("/dashboard", { replace: true });
        } catch (error) { setStatus('IDLE'); }
    };

    return (
        /* UI FIX: Removed touch-none to allow selection. fixed inset-0 overflow-hidden still prevents page scrolling */
        <div className="fixed inset-0 w-full h-full bg-[#080808] text-white flex flex-col p-6 overflow-hidden antialiased font-sans select-none">
            <div id="recaptcha-container"></div>

            <nav className="w-full flex items-center justify-between z-20 shrink-0 mb-4">
                <Link to="/" className="flex items-center gap-2 text-white/40 hover:text-[#ccff00] transition-colors group">
                    <ChevronLeft size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Back</span>
                </Link>
                <span className="text-[10px] font-black italic uppercase tracking-[0.4em] text-white/20">AJXFITCLUB</span>
            </nav>

            <div className="flex-1 flex flex-col items-center justify-center relative">
                <div className="w-full max-w-[380px] z-10 touch-auto">
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-xl border border-white/10 bg-white/[0.05]">
                            <ShieldCheck size={12} className="text-[#ccff00]" />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/80">Secure Link</span>
                        </div>
                        <h1 className="text-4xl font-black italic uppercase tracking-tighter leading-[0.8]">
                            {step === 1 ? 'Enter the' : 'Setup'} <br />
                            <span className="text-white/20">{step === 1 ? 'Collective' : 'Profile'}</span>
                        </h1>
                    </div>

                    <div className="w-full bg-neutral-900/40 border border-white/[0.08] backdrop-blur-3xl p-6 rounded-[32px] shadow-2xl">
                        {step === 1 ? (
                            <div className="space-y-5">
                                {errorMessage && (
                                    <div className={`p-3 rounded-xl border text-[10px] font-bold uppercase tracking-wider text-center flex items-center justify-center gap-2 ${errorMessage.includes('Welcome') ? 'bg-[#ccff00]/10 border-[#ccff00]/20 text-[#ccff00]' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                                        <AlertCircle size={14} />
                                        {errorMessage}
                                    </div>
                                )}

                                <form onSubmit={status === 'OTP_SENT' ? handleVerifyOTP : handleSendOTP} className="space-y-4">
                                    {status !== 'OTP_SENT' && status !== 'VERIFYING' ? (
                                        <div className="flex gap-2 h-14">
                                            {/* UI FIX: Relative container with hidden select to allow touch selection without changing look */}
                                            <div className="relative w-14">
                                                <select
                                                    value={countryCode}
                                                    onChange={(e) => setCountryCode(e.target.value)}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                >
                                                    <option value="+91">+91 (IN)</option>
                                                    <option value="+971">+971 (UAE)</option>
                                                    <option value="+44">+44 (UK)</option>
                                                    <option value="+1">+1 (US)</option>
                                                </select>
                                                <div className="w-full h-full bg-white/[0.05] border border-white/10 rounded-2xl flex items-center justify-center text-xs font-bold">
                                                    {countryCode}
                                                </div>
                                            </div>
                                            <input
                                                type="tel"
                                                maxLength="10"
                                                placeholder="10-digit number"
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                                                className="flex-1 bg-white/[0.05] border border-white/10 rounded-2xl px-5 text-base font-medium outline-none focus:border-[#ccff00]/40 placeholder:text-white/20"
                                            />
                                        </div>
                                    ) : (
                                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                                            <div className="text-center">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-[#ccff00]">Code sent to {countryCode} {phoneNumber}</p>
                                                <button type="button" onClick={() => { setStatus('IDLE'); setErrorMessage(''); }} className="text-[8px] font-bold text-white/20 underline">Change Number</button>
                                            </div>
                                            <input
                                                type="text"
                                                maxLength="6"
                                                placeholder="000000"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                                className="w-full h-14 bg-white/[0.05] border border-white/10 rounded-2xl text-white text-center font-black tracking-[0.4em] outline-none text-xl placeholder:text-white/20"
                                            />
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={status === 'PROCESSING' || status === 'VERIFYING'}
                                        className="w-full h-14 bg-[#ccff00] text-black font-black uppercase tracking-widest text-[10px] rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all"
                                    >
                                        {(status === 'PROCESSING' || status === 'VERIFYING') ? <Activity size={16} className="animate-spin" /> : <>{status === 'OTP_SENT' ? 'Verify' : 'Request'} <ArrowRight size={16} /></>}
                                    </button>
                                </form>
                                <SocialLogin type="login" onAuthSuccess={(user) => checkUserStatus(user)} />
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="relative h-12">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={14} />
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        className="w-full h-full bg-white/[0.05] border border-white/10 rounded-xl pl-10 pr-4 text-base outline-none focus:border-[#ccff00]/40 placeholder:text-white/20"
                                        onChange={(e) => setAssessment({...assessment, firstName: e.target.value})}
                                    />
                                </div>
                                <div className="grid grid-cols-1 gap-1.5">
                                    {tacticalGoals.map((goal) => (
                                        <button
                                            key={goal.id}
                                            onClick={() => setAssessment({...assessment, goal: goal.id})}
                                            className={`flex items-center justify-between px-4 py-2.5 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${assessment.goal === goal.id ? 'border-[#ccff00] bg-[#ccff00]/10 text-white' : 'border-white/5 bg-white/[0.02] text-white/30'}`}
                                        >
                                            {goal.label} {assessment.goal === goal.id && <Check size={12} className="text-[#ccff00]" />}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={finalizeProfile}
                                    disabled={!assessment.goal || !assessment.firstName}
                                    className="w-full h-12 bg-[#ccff00] text-black font-black uppercase tracking-widest text-[10px] rounded-xl active:scale-95 transition-all disabled:opacity-20"
                                >
                                    Finalize <ChevronRight size={16} className="inline ml-1" />
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