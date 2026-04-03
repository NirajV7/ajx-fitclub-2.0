import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import {
    Activity,
    Dumbbell,
    Zap,
    LogOut,
    Cpu,
    ShieldCheck,
    ChevronRight,
    Calendar,
    Trophy
} from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();
    const [tier, setTier] = useState('RECRUIT');
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Retrieve the tier we saved during the VerifyKey phase
        const savedTier = localStorage.getItem('memberTier');
        if (savedTier) setTier(savedTier.toUpperCase());

        // Check for authenticated user
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
            } else {
                navigate('/login');
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    const handleLogout = async () => {
        await signOut(auth);
        localStorage.clear();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-[#ccff00] selection:text-black antialiased relative overflow-hidden">
            {/* Background Tactical Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#ccff0015,transparent)] pointer-events-none"></div>

            {/* --- DASHBOARD NAVIGATION --- */}
            <nav className="w-full z-[100] bg-black/95 backdrop-blur-xl py-6 border-b border-white/5 px-6 md:px-12 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <span className="text-xl font-black italic tracking-tighter text-white block">AJX</span>
                        <span className="text-[6px] font-black tracking-[0.3em] uppercase text-[#ccff00] block -mt-1">FITCLUB</span>
                    </div>
                    <div className="h-6 w-[1px] bg-white/10 hidden md:block"></div>
                    <div className="hidden md:flex items-center gap-2 px-3 py-1 border border-[#ccff00]/20 rounded-full bg-[#ccff00]/5">
                        <ShieldCheck size={10} className="text-[#ccff00]" />
                        <span className="text-[7px] font-black uppercase tracking-[0.2em] text-[#ccff00]">Clearance: {tier}</span>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-red-500 transition-colors group"
                >
                    <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Sign Out
                </button>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
                {/* --- WELCOME HEADER --- */}
                <header className="mb-12">
                    <p className="text-[#ccff00] text-[10px] font-black uppercase tracking-[0.4em] mb-2">Welcome back, Recruit</p>
                    <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-4 leading-none">
                        Mission <span className="text-white/20">Dashboard.</span>
                    </h1>
                    <div className="flex flex-wrap gap-4">
                        <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
                            <Calendar size={14} className="text-[#ccff00]" />
                            <span className="text-[9px] font-bold uppercase tracking-widest text-white/60">Current Phase: Base Build</span>
                        </div>
                        <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
                            <Trophy size={14} className="text-[#ccff00]" />
                            <span className="text-[9px] font-bold uppercase tracking-widest text-white/60">Tactical Rank: {tier}</span>
                        </div>
                    </div>
                </header>

                {/* --- TACTICAL GRID --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* CARD 1: DAILY TRAINING */}
                    <div className="md:col-span-2 group relative bg-white/[0.03] border border-white/10 rounded-[32px] p-8 hover:border-[#ccff00]/40 transition-all duration-500 overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Dumbbell size={120} className="italic" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-[#ccff00] rounded-lg">
                                    <Activity size={18} className="text-black" />
                                </div>
                                <h3 className="text-xl font-black italic uppercase tracking-tight">Today's Protocol</h3>
                            </div>
                            <div className="space-y-4 mb-8">
                                <p className="text-white/40 text-[11px] font-bold tracking-widest uppercase leading-relaxed">
                                    {tier === 'INHOUSE'
                                        ? 'Report to AJX HQ for High-Intensity Hybrid session.'
                                        : 'Synchronize your tactical gear for Remote Session 04.'}
                                </p>
                                <div className="h-[1px] w-full bg-white/5"></div>
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                    <span className="text-[#ccff00]">Duration: 75 MIN</span>
                                    <span className="text-white/40">Load: 85% 1RM</span>
                                </div>
                            </div>
                            <button className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-[#ccff00] transition-all group/btn">
                                Start Session
                                <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>

                    {/* CARD 2: BIOMETRICS */}
                    <div className="bg-white/[0.03] border border-white/10 rounded-[32px] p-8 flex flex-col justify-between hover:border-[#ccff00]/40 transition-all duration-500">
                        <div>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2 bg-white/10 rounded-lg">
                                    <Zap size={18} className="text-[#ccff00]" />
                                </div>
                                <h3 className="text-xl font-black italic uppercase tracking-tight">Fuel Log</h3>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between text-[8px] font-black uppercase tracking-[0.2em] mb-2">
                                        <span className="text-white/40">Protein Intake</span>
                                        <span className="text-[#ccff00]">142G / 180G</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-[#ccff00] w-[78%]" style={{boxShadow: '0 0 10px rgba(204,255,0,0.4)'}}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button className="w-full mt-8 border border-white/10 py-4 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/5 transition-all">
                            Update Metrics
                        </button>
                    </div>

                </div>

                {/* --- FOOTER STATUS --- */}
                <footer className="mt-12 flex justify-between items-center opacity-30">
                    <div className="flex items-center gap-2">
                        <Cpu size={12} className="text-[#ccff00] animate-pulse" />
                        <span className="text-[7px] font-mono tracking-[0.4em] uppercase">Status: Tactical Connection Active</span>
                    </div>
                    <span className="text-[7px] font-mono tracking-[0.4em] uppercase">Encrypted Session: {user?.uid.slice(0, 8)}</span>
                </footer>
            </main>
        </div>
    );
};

export default Dashboard;