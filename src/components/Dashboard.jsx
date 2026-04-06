import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signOut } from "firebase/auth";
import { doc, onSnapshot } from 'firebase/firestore';
import { Lock, ShieldAlert, Shield, LogOut, Cpu, Activity, Zap } from 'lucide-react';
import ProtocolSelection from './ProtocolSelection';

const Dashboard = () => {
    const navigate = useNavigate();

    // CORE STATE: Tracks both Tier and Status for the security handshake
    const [status, setStatus] = useState('RECRUIT');
    const [tier, setTier] = useState('NONE');
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showPayWall, setShowPayWall] = useState(false);

    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setLoading(false);

                // REAL-TIME HANDSHAKE: Listens for status changes (e.g., Admin manual unlock)
                const userDoc = doc(db, "users", currentUser.uid);
                const unsubDoc = onSnapshot(userDoc, (doc) => {
                    if (doc.exists()) {
                        const data = doc.data();
                        // Updates status and tier in real-time
                        setStatus(data.status || 'RECRUIT');
                        setTier(data.tier || 'NONE');
                    }
                });
                return () => unsubDoc();
            } else {
                // If no session is found, force exit to login gate
                navigate('/login', { replace: true });
            }
        });
        return () => unsubscribeAuth();
    }, [navigate]);

    // SESSION TERMINATION: Clears auth and resets navigation
    const handleSignOut = async () => {
        try {
            await signOut(auth);
            console.log("PROTOCOL_TERMINATED: Session Cleared");
            navigate("/", { replace: true });
        } catch (error) {
            console.error("TERMINATION_FAILURE:", error.message);
        }
    };

    // LOCK LOGIC: Dashboard only unlocks if status is explicitly 'ACTIVE'
    const isLocked = status !== 'ACTIVE';

    if (loading) {
        return (
            <div className="h-screen bg-black flex flex-col items-center justify-center">
                <Cpu size={24} className="text-[#ccff00] animate-spin mb-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 animate-pulse">
                    Accessing Terminal...
                </span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans antialiased relative selection:bg-[#ccff00] selection:text-black">

            {/* --- DASHBOARD HEADER --- */}
            <header className="w-full z-[100] bg-black/95 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between font-bold">
                    <div className="flex items-center gap-3 group cursor-default">
                        <div className="relative">
                            <Shield size={22} className="text-[#ccff00] group-hover:rotate-12 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-[#ccff00]/20 blur-xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-700"></div>
                        </div>
                        <h1 className="text-xl font-black italic uppercase tracking-tighter">
                            AJX <span className="text-[#ccff00]">Terminal</span>
                        </h1>
                    </div>

                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-red-500/10 hover:border-red-500/40 hover:text-red-500 transition-all duration-500 group font-bold"
                    >
                        <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Terminate Session
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-12 font-bold text-white">
                {/* --- WELCOME HEADER --- */}
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse"></div>
                            <p className="text-[#ccff00] text-[10px] font-black uppercase tracking-[0.4em]">System Status: Connected</p>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
                            Tactical <span className="text-white/20">Portal.</span>
                        </h1>
                    </div>

                    {isLocked && (
                        <div className="inline-flex items-center gap-3 px-5 py-2.5 border border-red-500/30 bg-red-500/5 rounded-2xl backdrop-blur-md">
                            <ShieldAlert size={14} className="text-red-500 animate-pulse" />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-red-500 leading-none">Unauthorized Access: Protocols Locked</span>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* --- THE LOCK OVERLAY --- */}
                    {isLocked && (
                        <div className="absolute inset-x-0 -inset-y-4 z-50 flex items-center justify-center backdrop-blur-md bg-black/40 rounded-[40px] border border-white/5 shadow-2xl">
                            <div className="text-center p-10 max-w-sm bg-black/60 border border-white/10 rounded-[40px] backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)]">
                                <div className="w-20 h-20 bg-[#ccff00] rounded-[28px] flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(204,255,0,0.2)] transform -rotate-6">
                                    <Lock size={32} className="text-black" />
                                </div>
                                <h2 className="text-3xl font-black italic uppercase mb-4 tracking-tighter">Initialize Mission</h2>
                                <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] mb-10 leading-relaxed">
                                    Your biometric profile is active, but your training protocols are encrypted. Select a deployment plan to unlock.
                                </p>
                                <button
                                    onClick={() => setShowPayWall(true)}
                                    className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-[0.4em] text-[11px] hover:bg-[#ccff00] hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 shadow-xl shadow-white/5"
                                >
                                    Activate Protocols
                                </button>
                            </div>
                        </div>
                    )}

                    {/* --- MOCKED CONTENT (BLURRED IF LOCKED) --- */}
                    <div className={`md:col-span-2 bg-white/[0.03] border border-white/10 rounded-[40px] p-10 transition-all duration-1000 ${isLocked ? 'blur-2xl grayscale opacity-20 pointer-events-none' : 'opacity-100'}`}>
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black italic uppercase tracking-widest text-[#ccff00]">Daily Training Protocol</h3>
                            <Zap size={18} className="text-[#ccff00]" />
                        </div>
                        <div className="space-y-6">
                            <div className="h-4 w-1/3 bg-white/10 rounded-full animate-pulse"></div>
                            <div className="h-48 w-full bg-white/5 rounded-3xl border border-white/5 animate-pulse"></div>
                        </div>
                    </div>

                    <div className={`bg-white/[0.03] border border-white/10 rounded-[40px] p-10 transition-all duration-1000 ${isLocked ? 'blur-2xl grayscale opacity-20 pointer-events-none' : 'opacity-100'}`}>
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black italic uppercase tracking-widest">Biometrics</h3>
                            <Activity size={18} className="text-white/40" />
                        </div>
                        <div className="space-y-6">
                            <div className="h-4 w-1/2 bg-white/10 rounded-full animate-pulse"></div>
                            <div className="h-64 w-full bg-white/5 rounded-3xl border border-white/5 animate-pulse"></div>
                        </div>
                    </div>
                </div>

                {/* --- THE SUBSCRIPTION MODAL --- */}
                {showPayWall && (
                    <ProtocolSelection onClose={() => setShowPayWall(false)} />
                )}
            </main>

            {/* --- SCAN LINE EFFECT --- */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
                <div className="absolute inset-x-0 h-[1px] bg-[#ccff00] scan-line"></div>
            </div>
        </div>
    );
};

export default Dashboard;