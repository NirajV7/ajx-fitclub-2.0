import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signOut } from "firebase/auth";
import { doc, onSnapshot } from 'firebase/firestore';
import {
    Lock, Shield, LogOut, Cpu,
    User, Calendar, Smartphone, Info,
    Zap, Sparkles, ChevronRight, Mail
} from 'lucide-react';
import ProtocolSelection from './ProtocolSelection';

const Dashboard = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState('RECRUIT');
    const [tier, setTier] = useState('NONE');
    const [userData, setUserData] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showPayWall, setShowPayWall] = useState(false);

    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setLoading(false);
                const userDoc = doc(db, "users", currentUser.uid);
                const unsubDoc = onSnapshot(userDoc, (doc) => {
                    if (doc.exists()) {
                        const data = doc.data();
                        setUserData(data);
                        setStatus(data.status || 'RECRUIT');
                        setTier(data.tier || 'NONE');
                    }
                });
                return () => unsubDoc();
            } else {
                navigate('/login', { replace: true });
            }
        });
        return () => unsubscribeAuth();
    }, [navigate]);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            navigate("/", { replace: true });
        } catch (error) {
            console.error("TERMINATION_FAILURE:", error.message);
        }
    };

    const isLocked = status !== 'ACTIVE';

    if (loading) {
        return (
            <div className="h-[100dvh] bg-[#050505] flex flex-col items-center justify-center p-6">
                <Cpu size={32} className="text-[#ccff00] animate-spin mb-6" />
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#ccff00]">Syncing Terminal...</p>
            </div>
        );
    }

    return (
        <div className={`h-[100dvh] w-full bg-[#080808] text-white font-sans antialiased flex flex-col ${isLocked ? 'overflow-hidden' : 'overflow-y-auto'}`}>

            <header className="shrink-0 bg-black/60 backdrop-blur-3xl border-b border-white/10 z-[100]">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 bg-white/[0.05] border border-white/10 rounded-xl flex items-center justify-center">
                            <Shield size={18} className="text-[#ccff00]" />
                        </div>
                        <h1 className="text-base md:text-2xl font-black italic uppercase tracking-tighter">
                            AJX <span className="text-[#ccff00]">Terminal</span>
                        </h1>
                    </div>

                    <button
                        onClick={handleSignOut}
                        className="p-2.5 bg-white/[0.05] border border-white/10 rounded-xl text-white/60 hover:text-red-500 transition-all"
                    >
                        <LogOut size={16} />
                    </button>
                </div>
            </header>

            <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-6 md:py-12 flex flex-col relative">

                {/* --- PERSONALIZED WELCOME --- */}
                <div className="mb-6 md:mb-10 transition-all duration-700">
                    <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 rounded-full border border-white/20 bg-white/[0.08]">
                        <div className={`w-1.5 h-1.5 rounded-full ${isLocked ? 'bg-red-500 animate-pulse' : 'bg-[#ccff00]'}`}></div>
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/90">
                            {isLocked ? 'Status: Pending' : 'Status: Active'}
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter leading-tight text-white">
                        {isLocked ? `Welcome,` : 'Dashboard.'} <br/>
                        {isLocked && <span className="text-white/30">{userData?.fullName || 'Recruit'}.</span>}
                    </h2>
                </div>

                <div className="flex-1 relative min-h-[300px]">
                    {/* --- SIMPLIFIED LOCKED STATE --- */}
                    {isLocked && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center">
                            <div className="w-full max-w-sm bg-[#0c0c0c] border border-white/20 p-8 rounded-[40px] backdrop-blur-3xl shadow-[0_0_100px_rgba(0,0,0,1)] text-center">
                                <div className="w-16 h-16 bg-[#ccff00] rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(204,255,0,0.1)]">
                                    <Lock size={28} className="text-black" />
                                </div>
                                <h3 className="text-2xl font-black italic uppercase mb-2 tracking-tighter text-white">Access Locked</h3>
                                <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em] mb-10 leading-relaxed mx-auto max-w-[200px]">
                                    Pick a training tier to unlock your protocols and begin.
                                </p>
                                <button
                                    onClick={() => setShowPayWall(true)}
                                    className="w-full bg-[#ccff00] text-black py-5 rounded-2xl font-black uppercase tracking-[0.4em] text-[11px] shadow-[0_15px_30px_rgba(204,255,0,0.1)] active:scale-95 transition-all"
                                >
                                    Activate Now
                                </button>
                            </div>
                        </div>
                    )}

                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-1000 ${isLocked ? 'blur-2xl opacity-20 pointer-events-none' : 'opacity-100'}`}>

                        <div className="bg-white/[0.03] border border-white/20 rounded-[40px] p-8 md:p-10">
                            <div className="flex items-center gap-4 mb-10">
                                <User size={20} className="text-[#ccff00]" />
                                <span className="text-xs font-black uppercase tracking-widest text-white">Member Profile</span>
                            </div>

                            <div className="space-y-6">
                                <div className="flex justify-between items-center pb-5 border-b border-white/10">
                                    <div className="flex items-center gap-3">
                                        <Info size={14} className="text-white/70" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">Name</span>
                                    </div>
                                    <span className="text-sm font-black italic uppercase text-white">{userData?.fullName || '---'}</span>
                                </div>

                                <div className="flex justify-between items-center pb-5 border-b border-white/10">
                                    <div className="flex items-center gap-3">
                                        {userData?.phoneNumber === 'GOOGLE_AUTH' ? <Mail size={14} className="text-white/70" /> : <Smartphone size={14} className="text-white/70" />}
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">Email</span>
                                    </div>
                                    <span className="text-[11px] md:text-sm font-black italic text-white truncate max-w-[150px] md:max-w-none">
                                        {userData?.phoneNumber === 'GOOGLE_AUTH' ? user?.email : (userData?.phoneNumber || '---')}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <Calendar size={14} className="text-white/70" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">Tier</span>
                                    </div>
                                    <span className="text-sm font-black italic uppercase text-[#ccff00]">{tier}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/[0.03] border border-white/20 rounded-[40px] p-8 md:p-10 flex flex-col justify-center items-center text-center relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ccff00]/40 to-transparent"></div>
                            <Sparkles size={32} className="text-[#ccff00] mb-6 opacity-40 group-hover:opacity-100 transition-opacity" />
                            <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-3">Training Module</h3>
                            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#ccff00] mb-8 animate-pulse">Coming Soon</p>
                            <p className="text-white/60 text-[9px] font-medium uppercase tracking-widest leading-relaxed max-w-[200px]">
                                Your personalized workout and nutrition plans are being prepared.
                            </p>
                        </div>
                    </div>
                </div>

                {showPayWall && <ProtocolSelection onClose={() => setShowPayWall(false)} />}
            </main>
        </div>
    );
};

export default Dashboard;