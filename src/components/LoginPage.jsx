import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Cpu, ShieldCheck, Check } from 'lucide-react';
// Firebase Auth imports
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
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

const SigninPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        code: ''
    });
    const [status, setStatus] = useState('IDLE'); // IDLE, AUTHENTICATING, ERROR

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    const isCodeComplete = formData.code.length === 4;
    const isAuthReady = isEmailValid && isCodeComplete && status !== 'AUTHENTICATING';

    const handleCodeChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        if (value.length <= 4) {
            setFormData({ ...formData, code: value });
        }
    };

    const handleAuth = async (e) => {
        e.preventDefault();
        if (!isAuthReady) return;

        setStatus('AUTHENTICATING');

        try {
            // Tactical Bypass: Firebase requires 6 chars, prefixing the 4-digit key
            const tacticalPassword = `AJX-${formData.code}`;
            await signInWithEmailAndPassword(auth, formData.email, tacticalPassword);

            console.log("PROTOCOL_SUCCESS: Member Authorized");

            // STRATEGY 3: Send them to the dashboard.
            // The Dashboard's onSnapshot will determine if they see the Lock or the Data.
            navigate("/dashboard");
        } catch (error) {
            console.error("AUTH_FAILURE:", error.message);
            setStatus('ERROR');
            setTimeout(() => setStatus('IDLE'), 3000);
        }
    };

    return (
        <div className="h-screen flex flex-col bg-black text-white font-sans selection:bg-[#ccff00] selection:text-black antialiased relative overflow-hidden">

            <nav className="shrink-0 w-full z-[100] bg-black/95 backdrop-blur-xl py-8 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between relative">
                    <MobileMenuToggle side="left" />
                    <div className="flex-1 md:flex-none flex justify-center md:justify-start">
                        <BrandLogo />
                    </div>
                    <div className="hidden md:flex items-center space-x-12 text-[10px] font-bold tracking-[0.3em] uppercase">
                        <Link to="/" className="hover:text-[#ccff00] transition-colors tracking-widest text-white font-bold relative group/link">
                            Home
                            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#ccff00] group-hover/link:w-full transition-all"></span>
                        </Link>
                        <Link to="/signup" className="px-6 py-2 border border-white/20 text-white rounded-full hover:border-[#ccff00] hover:text-[#ccff00] transition-all duration-500 font-black tracking-widest text-[10px] uppercase">
                            New Recruit?
                        </Link>
                    </div>
                    <MobileMenuToggle side="right" />
                </div>
            </nav>

            <main className="flex-grow flex items-center justify-center px-4 relative z-10 overflow-hidden">
                <div className="max-w-xl w-full">
                    <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-6 md:p-10 rounded-[32px] relative overflow-hidden shadow-2xl">
                        <div className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#ccff00]/20 to-transparent scan-line"></div>

                        <div className="mb-8 text-center">
                            <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#ccff00]/30 rounded-full bg-[#ccff00]/5 mb-4">
                                <ShieldCheck size={12} className={status === 'ERROR' ? 'text-red-500' : 'text-[#ccff00]'} />
                                <span className={`text-[8px] font-black uppercase tracking-[0.3em] ${status === 'ERROR' ? 'text-red-500' : 'text-[#ccff00]'}`}>
                                    {status === 'ERROR' ? 'Access Denied: Invalid Key' : 'Security Protocol Active'}
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white mb-1 text-balance">Authenticate.</h1>
                            <p className="text-white/40 text-[9px] font-bold tracking-[0.2em] uppercase leading-relaxed">Enter your credentials to access the terminal</p>
                        </div>

                        <form className="space-y-6" onSubmit={handleAuth}>
                            <div className="space-y-2 group">
                                <span className="text-[8px] font-black uppercase text-white/40 group-focus-within:text-[#ccff00] transition-colors">[ BIOMETRIC_ID ]</span>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#ccff00]" size={16} />
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        placeholder="ALEX.DOE@GMAIL.COM"
                                        className={`w-full bg-white/[0.05] border rounded-xl py-4 pl-12 pr-4 text-white font-bold text-[11px] uppercase placeholder:text-white/20 focus:border-[#ccff00]/40 outline-none transition-all ${formData.email.length > 0 && !isEmailValid ? 'border-red-500/30' : 'border-white/10'}`}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 group">
                                <div className="flex justify-between items-center">
                                    <span className="text-[8px] font-black uppercase text-white/40 group-focus-within:text-[#ccff00]">[ SECURITY_KEY ]</span>
                                    {isCodeComplete && <span className="text-[7px] text-[#ccff00] font-bold uppercase tracking-widest animate-pulse">Key Ready</span>}
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#ccff00]" size={16} />
                                    <input
                                        type="password"
                                        inputMode="numeric"
                                        required
                                        value={formData.code}
                                        onChange={handleCodeChange}
                                        placeholder="0000"
                                        className={`w-full bg-white/[0.05] border rounded-xl py-4 pl-12 pr-4 text-white font-bold text-[13px] tracking-[0.5em] placeholder:text-white/20 focus:border-[#ccff00]/40 outline-none transition-all ${isCodeComplete ? 'border-[#ccff00] shadow-[0_0_15px_rgba(204,255,0,0.1)]' : 'border-white/10'}`}
                                    />
                                    {isCodeComplete && <Check className="absolute right-4 top-1/2 -translate-y-1/2 text-[#ccff00]" size={16} />}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={!isAuthReady}
                                className={`group relative w-full flex items-center justify-center gap-3 py-5 font-black uppercase tracking-[0.4em] text-[11px] rounded-2xl transition-all duration-700 overflow-hidden shadow-2xl active:scale-[0.98] ${isAuthReady ? 'bg-white text-black hover:bg-[#ccff00]' : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'}`}
                            >
                                <span className="relative z-10 font-bold">
                                    {status === 'AUTHENTICATING' ? 'VERIFYING...' : (isAuthReady ? 'ACCESS PORTAL' : 'AWAITING AUTH')}
                                </span>
                                <ArrowRight className={`relative z-10 w-4 h-4 transition-transform ${isAuthReady ? 'group-hover:translate-x-1' : 'opacity-20'}`} />
                            </button>

                            {/* --- FEDERATED IDENTITY --- */}
                            <SocialLogin type="login" />

                            <div className="flex flex-col items-center gap-6 mt-4">
                                <button type="button" className="text-[9px] font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors underline-offset-4 hover:underline">
                                    Forgot Security Key?
                                </button>

                                <div className="w-full pt-6 border-t border-white/5 flex flex-col items-center">
                                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/20 mb-3 italic">Not yet recognized?</p>
                                    <Link to="/signup" className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ccff00] hover:text-white transition-all flex items-center gap-2 group/link font-bold">
                                        Initialize Profile
                                        <ArrowRight size={10} className="group-hover/link:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className="mt-8 flex justify-between items-center px-4 opacity-40">
                        <div className="flex items-center gap-2">
                            <Cpu size={10} className="text-[#ccff00] animate-pulse" />
                            <span className="text-[7px] font-mono text-white uppercase tracking-widest">
                                CONNECTION: {status === 'AUTHENTICATING' ? 'SYNCING' : 'SECURE'}
                            </span>
                        </div>
                        <span className="text-[7px] font-mono text-white uppercase tracking-widest font-bold">TERMINAL: AJX.SIG.04</span>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SigninPage;