import React, { useState , useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Cpu, ShieldCheck, Phone, User, Activity } from 'lucide-react';
import { auth, db } from "../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import SocialLogin from "./SocialLogin.jsx";
import { useAuthState } from 'react-firebase-hooks/auth';

const SignupPage = () => {
    const navigate = useNavigate();
    // 2. ADD THIS LINE HERE (Crucial for the Guard to work)
    const [user, authLoading] = useAuthState(auth);
    // Step 1: Identity, Step 2: Assessment, Step 3: Deployment
    const [step, setStep] = useState(1);
    const [status, setStatus] = useState('IDLE');

    // Step 1 State: Phone Auth
    const [phoneNumber, setPhoneNumber] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [confirmResult, setConfirmResult] = useState(null);


    useEffect(() => {
        // If the user is authenticated and the system is not loading...
        if (user && !authLoading) {
            // Option A: Send them to the Dashboard (Most common)
            // Option B: Send them to Home (If you want them to see the landing page)
            navigate("/dashboard", { replace: true });

            // CRITICAL: { replace: true } overwrites the /signup entry in the
            // browser history so the "Back" button doesn't loop them back here.
        }
    }, [user, authLoading, navigate]);

    // Step 2 State: Assessment
    const [assessment, setAssessment] = useState({
        firstName: '',
        goal: '',
        equipment: 'NONE'
    });

    // --- LOGIC: PHONE AUTH ---
    const setupRecaptcha = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible'
            });
        }
    };

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setStatus('PROCESSING');
        setupRecaptcha();
        const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;

        try {
            const result = await signInWithPhoneNumber(auth, formattedPhone, window.recaptchaVerifier);
            setConfirmResult(result);
            setStatus('OTP_SENT');
        } catch (error) {
            setStatus('ERROR');
            console.error("SMS_FAILURE:", error);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setStatus('VERIFYING');
        try {
            const credential = await confirmResult.confirm(verificationCode);
            // On success, move to Fitness Assessment
            setStep(2);
            setStatus('IDLE');
        } catch (error) {
            setStatus('ERROR');
        }
    };

    // --- LOGIC: COMPLETE RECRUITMENT ---
    const finalizeRecruitment = async () => {
        setStatus('TRANSMITTING');
        const user = auth.currentUser;
        try {
            await setDoc(doc(db, "users", user.uid), {
                fullName: assessment.firstName.toUpperCase(),
                phoneNumber: user.phoneNumber,
                status: 'RECRUIT',
                tier: 'NONE',
                assessment: assessment,
                joinedAt: serverTimestamp()
            }, { merge: true });

            navigate("/dashboard", { replace: true });
        } catch (error) {
            setStatus('ERROR');
        }
    };

    return (
        <div className="h-screen bg-black text-white font-sans selection:bg-[#ccff00] antialiased relative overflow-hidden">
            <div id="recaptcha-container"></div> {/* Invisible anchor */}

            <main className="h-full flex items-center justify-center px-4">
                <div className="max-w-xl w-full">
                    <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-10 rounded-[32px] relative shadow-2xl">

                        {/* HEADER: Dynamic based on Step */}
                        <div className="mb-8 text-center">
                            <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#ccff00]/30 rounded-full bg-[#ccff00]/5 mb-4">
                                <Cpu size={12} className="text-[#ccff00] animate-pulse" />
                                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-[#ccff00]">
                                    PHASE 0{step}: {step === 1 ? 'IDENTITY_VERIFICATION' : 'TACTICAL_ASSESSMENT'}
                                </span>
                            </div>
                            <h1 className="text-4xl font-black italic uppercase tracking-tighter">
                                {step === 1 ? 'Initialize.' : 'Profile Sync.'}
                            </h1>
                        </div>

                        {/* STEP 1: PHONE LOGIN */}
                        {step === 1 && (
                            <form className="space-y-6" onSubmit={status === 'OTP_SENT' ? handleVerifyOTP : handleSendOTP}>
                                <div className="space-y-2 group">
                                    <span className="text-[8px] font-black uppercase text-white/40">[ BIOMETRIC_PHONE ]</span>
                                    <input
                                        type="tel"
                                        placeholder="+91 XXXXX XXXXX"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className="w-full bg-white/[0.05] border border-white/10 rounded-xl py-4 px-4 text-white font-bold outline-none focus:border-[#ccff00]/40 transition-all"
                                    />
                                </div>

                                {status === 'OTP_SENT' && (
                                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                        <span className="text-[8px] font-black uppercase text-[#ccff00]">[ ENTER_AUTH_CODE ]</span>
                                        <input
                                            type="text"
                                            placeholder="000000"
                                            value={verificationCode}
                                            onChange={(e) => setVerificationCode(e.target.value)}
                                            className="w-full bg-white/[0.05] border border-[#ccff00]/40 rounded-xl py-4 px-4 text-[#ccff00] tracking-[1em] text-center font-black outline-none"
                                        />
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="w-full py-4 bg-white text-black font-black uppercase tracking-[0.3em] text-[11px] rounded-2xl hover:bg-[#ccff00] transition-all flex items-center justify-center gap-3"
                                >
                                    {status === 'PROCESSING' ? 'TRANSMITTING...' : status === 'OTP_SENT' ? 'VERIFY ACCESS' : 'REQUEST OTP'}
                                    <ArrowRight size={16} />
                                </button>


                                <SocialLogin
                                    type="signup"
                                    onAuthSuccess={(user) => {
                                        // Automatically set the name from Google if available
                                        setAssessment({
                                            ...assessment,
                                            firstName: user.displayName?.split(' ')[0] || ''
                                        });
                                        setStep(2); // Move to Assessment phase
                                    }}
                                />
                            </form>
                        )}

                        {/* STEP 2: ASSESSMENT */}
                        {step === 2 && (
                            <div className="space-y-6 animate-in fade-in duration-700">
                                <div className="space-y-2">
                                    <span className="text-[8px] font-black uppercase text-white/40">[ CALLSIGN / NAME ]</span>
                                    <input
                                        type="text"
                                        placeholder="ALEX"
                                        className="w-full bg-white/[0.05] border border-white/10 rounded-xl py-4 px-4 text-white font-bold outline-none"
                                        onChange={(e) => setAssessment({...assessment, firstName: e.target.value})}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <span className="text-[8px] font-black uppercase text-white/40">[ PRIMARY_OBJECTIVE ]</span>
                                    <select
                                        className="w-full bg-white/[0.05] border border-white/10 rounded-xl py-4 px-4 text-white font-bold outline-none appearance-none"
                                        onChange={(e) => setAssessment({...assessment, goal: e.target.value})}
                                    >
                                        <option value="">SELECT GOAL</option>
                                        <option value="FAT_LOSS">FAT LOSS / X-HALE</option>
                                        <option value="STRENGTH">ELITE STRENGTH</option>
                                        <option value="MOBILITY">REFINED MOBILITY</option>
                                    </select>
                                </div>

                                <button
                                    onClick={finalizeRecruitment}
                                    className="w-full py-4 bg-[#ccff00] text-black font-black uppercase tracking-[0.3em] text-[11px] rounded-2xl hover:bg-white transition-all"
                                >
                                    FINALIZE ENROLLMENT
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SignupPage;