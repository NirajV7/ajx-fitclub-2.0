import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Mail, ArrowRight, Cpu, ShieldCheck, Check } from 'lucide-react';
// useAuthState is our primary sensor for session detection
import { useAuthState } from 'react-firebase-hooks/auth';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import SocialLogin from "./SocialLogin.jsx";

// --- SHARED VISUAL COMPONENTS ---

const BrandLogo = () => (
    <Link to="/" className="flex flex-row md:flex-col items-center md:items-start group cursor-pointer select-none md:gap-0 gap-1">
        <div className="relative">
            <span className="text-lg md:text-2xl font-black italic tracking-tighter text-white leading-none block transition-all duration-500 group-hover:tracking-normal">
                AJX
            </span>
            <div className="absolute -bottom-0.5 left-0 h-[1.5px] w-0 bg-[#ccff00] group-hover:w-full transition-all duration-500 shadow-[0_0_8px_rgba(204,255,0,0.5)] hidden md:block"></div>
        </div>
        <span className="text-lg md:text-[7px] font-black italic md:not-italic tracking-tighter md:tracking-[0.2em] uppercase text-[#ccff00] leading-none md:mt-0.5 md:self-stretch md:text-center md:border-t md:border-white/10 md:pt-0.5 opacity-100 md:opacity-80 group-hover:opacity-100 transition-all">
            FITCLUB
        </span>
    </Link>
);

const MobileMenuToggle = ({ side }) => (
    <div className={`group relative w-10 h-10 flex items-center ${side === 'left' ? 'justify-start' : 'justify-end'} md:hidden opacity-40`}>
        <div className="relative w-4 h-4 flex flex-wrap gap-0.5 items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-[1px] bg-[#ccff00] shadow-[0_0_8px_rgba(204,255,0,0.4)] animate-pulse"></div>
            <div className="w-1.5 h-1.5 rounded-[1px] bg-white/40"></div>
            <div className="w-1.5 h-1.5 rounded-[1px] bg-white/40"></div>
            <div className="w-1.5 h-1.5 rounded-[1px] bg-[#ccff00] shadow-[0_0_8px_rgba(204,255,0,0.4)] animate-pulse"></div>
        </div>
    </div>
);

const SignupPage = () => {
    // Double Guard: Detect existing session immediately
    const [user, authLoading] = useAuthState(auth);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        code: '',
        confirmCode: ''
    });
    const [status, setStatus] = useState('IDLE');

    // REPLACEMENT LOGIC: Overwrite history to prevent back-navigation
    useEffect(() => {
        if (user && !authLoading) {
            navigate("/dashboard", { replace: true });
        }
    }, [user, authLoading, navigate]);

    // RENDER GUARD: If session exists, show tactical loader instead of form
    if (authLoading || user) {
        return (
            <div className="h-screen bg-black flex flex-col items-center justify-center">
                <Cpu size={24} className="text-[#ccff00] animate-spin mb-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 animate-pulse">
                    Authenticating Profile...
                </span>
            </div>
        );
    }

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    const codesMatch = formData.code === formData.confirmCode && formData.code.length === 4;
    const isFormValid =
        formData.firstName.trim().length >= 2 &&
        formData.lastName.trim().length >= 1 &&
        isEmailValid &&
        codesMatch &&
        status !== 'PROCESSING';

    const handleNameChange = (e, field) => {
        const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
        setFormData({ ...formData, [field]: value });
    };

    const handleCodeChange = (e, field) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        if (value.length <= 4) setFormData({ ...formData, [field]: value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (!isFormValid) return;

        setStatus('PROCESSING');
        try {
            const tacticalPassword = `AJX-${formData.code}`;
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, tacticalPassword);
            const newUser = userCredential.user;

            await setDoc(doc(db, "users", newUser.uid), {
                firstName: formData.firstName.toUpperCase(),
                lastName: formData.lastName.toUpperCase(),
                email: formData.email.toLowerCase(),
                tier: 'RECRUIT',
                createdAt: new Date(),
                status: 'PENDING_ACTIVATION'
            });

            // Secure redirect with history replacement
            navigate("/dashboard", { replace: true });
        } catch (error) {
            console.error("INITIALIZATION_FAILURE:", error.message);
            setStatus('ERROR');
            setTimeout(() => setStatus('IDLE'), 3000);
        }
    };

    return (
        <div className="h-screen flex flex-col bg-black text-white font-sans selection:bg-[#ccff00] selection:text-black antialiased relative overflow-hidden">
            <nav className="shrink-0 w-full z-[100] bg-black/95 backdrop-blur-xl py-8 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between relative text-white font-bold">
                    <MobileMenuToggle side="left" />
                    <div className="flex-1 md:flex-none flex justify-center md:justify-start text-white font-bold">
                        <BrandLogo />
                    </div>
                    <div className="hidden md:flex items-center space-x-12 text-[10px] font-bold tracking-[0.3em] uppercase font-black text-white">
                        <Link to="/" className="hover:text-[#ccff00] transition-colors tracking-widest uppercase text-white font-bold relative group/link">
                            Home
                            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#ccff00] group-hover/link:w-full transition-all"></span>
                        </Link>
                        <Link to="/login">
                            <button className="px-6 py-2 border border-[#ccff00] text-[#ccff00] rounded-full hover:bg-[#ccff00] hover:text-black transition-all duration-500 font-black tracking-widest text-[10px] uppercase font-bold">
                                Login Entry
                            </button>
                        </Link>
                    </div>
                    <MobileMenuToggle side="right" />
                </div>
            </nav>

            <main className="flex-grow flex items-center justify-center px-4 relative z-10 overflow-hidden text-white font-bold">
                <div className="max-w-xl w-full">
                    <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-6 md:p-10 rounded-[32px] relative overflow-hidden shadow-2xl">
                        <div className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#ccff00]/20 to-transparent scan-line"></div>

                        <div className="mb-6 text-center">
                            <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#ccff00]/30 rounded-full bg-[#ccff00]/5 mb-4">
                                <ShieldCheck size={12} className={status === 'ERROR' ? 'text-red-500' : 'text-[#ccff00]'} />
                                <span className={`text-[8px] font-black uppercase tracking-[0.3em] ${status === 'ERROR' ? 'text-red-500' : 'text-[#ccff00]'}`}>
                                    {status === 'ERROR' ? 'Initialization Halted' : 'Recruitment Protocol 4.02'}
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white mb-1">Initialize.</h1>
                        </div>

                        <form className="space-y-4" onSubmit={handleSignup}>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5 group">
                                    <span className="text-[8px] font-black uppercase text-white/40 group-focus-within:text-[#ccff00] transition-colors">[ FIRST_NAME ]</span>
                                    <input
                                        type="text"
                                        required
                                        value={formData.firstName}
                                        onChange={(e) => handleNameChange(e, 'firstName')}
                                        placeholder="ALEX"
                                        className="w-full bg-white/[0.05] border border-white/10 rounded-xl py-3.5 px-4 text-white font-bold text-[11px] uppercase placeholder:text-white/40 focus:border-[#ccff00]/40 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5 group">
                                    <span className="text-[8px] font-black uppercase text-white/40 group-focus-within:text-[#ccff00] transition-colors">[ LAST_NAME ]</span>
                                    <input
                                        type="text"
                                        required
                                        value={formData.lastName}
                                        onChange={(e) => handleNameChange(e, 'lastName')}
                                        placeholder="DOE"
                                        className="w-full bg-white/[0.05] border border-white/10 rounded-xl py-3.5 px-4 text-white font-bold text-[11px] uppercase placeholder:text-white/40 focus:border-[#ccff00]/40 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5 group">
                                <span className="text-[8px] font-black uppercase text-white/40 group-focus-within:text-[#ccff00] transition-colors">[ BIOMETRIC_LINK ]</span>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#ccff00]" size={16} />
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        placeholder="ALEX.DOE@GMAIL.COM"
                                        className={`w-full bg-white/[0.05] border rounded-xl py-3.5 pl-12 pr-4 text-white font-bold text-[11px] uppercase placeholder:text-white/40 focus:border-[#ccff00]/40 outline-none transition-all ${formData.email.length > 0 && !isEmailValid ? 'border-red-500/30' : 'border-white/10'}`}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5 group">
                                    <span className="text-[8px] font-black uppercase text-white/40 group-focus-within:text-[#ccff00]">[ 4_DIGIT_KEY ]</span>
                                    <input
                                        type="password"
                                        inputMode="numeric"
                                        required
                                        value={formData.code}
                                        onChange={(e) => handleCodeChange(e, 'code')}
                                        placeholder="0000"
                                        className="w-full bg-white/[0.05] border border-white/10 rounded-xl py-3.5 px-4 text-white font-bold text-[11px] placeholder:text-white/40 focus:border-[#ccff00]/40 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5 group">
                                    <span className={`text-[8px] font-black uppercase transition-colors ${codesMatch ? 'text-[#ccff00]' : 'text-white/40'}`}>[ VERIFY_KEY ]</span>
                                    <input
                                        type="password"
                                        inputMode="numeric"
                                        required
                                        value={formData.confirmCode}
                                        onChange={(e) => handleCodeChange(e, 'confirmCode')}
                                        placeholder="0000"
                                        className={`w-full bg-white/[0.05] border rounded-xl py-3.5 px-4 text-white font-bold text-[11px] placeholder:text-white/40 outline-none transition-all duration-300 ${codesMatch ? 'border-[#ccff00] shadow-[0_0_15px_rgba(204,255,0,0.2)]' : 'border-white/10'}`}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={!isFormValid}
                                className={`group relative w-full flex items-center justify-center gap-3 py-4 font-black uppercase tracking-[0.3em] text-[11px] rounded-2xl transition-all duration-700 overflow-hidden shadow-2xl active:scale-[0.98] ${isFormValid ? 'bg-white text-black hover:bg-[#ccff00]' : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'}`}
                            >
                                <span className="relative z-10 font-bold">
                                    {status === 'PROCESSING' ? 'TRANSMITTING...' : (isFormValid ? 'START TRANSFORMATION' : 'AWAITING FULL AUTH')}
                                </span>
                                <ArrowRight className={`relative z-10 w-4 h-4 transition-transform ${isFormValid ? 'group-hover:translate-x-1' : 'opacity-20'}`} />
                            </button>

                            <SocialLogin type="signup" />
                        </form>

                        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center text-balance font-bold text-white">
                            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/20 mb-3 italic">Existing Recruit?</p>
                            <Link to="/login" className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ccff00] hover:text-white transition-all flex items-center gap-2 group/link font-bold">
                                Secure Login Entry
                                <ArrowRight size={10} className="group-hover/link:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SignupPage;