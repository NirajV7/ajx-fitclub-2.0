import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { Lock, Zap, ShieldAlert, ChevronRight, Activity, Cpu } from 'lucide-react';
import ProtocolSelection from './ProtocolSelection'; // We will build this next

const Dashboard = () => {
    const navigate = useNavigate();
    const [tier, setTier] = useState('RECRUIT');
    const [showPayWall, setShowPayWall] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                // Listen to Firestore in real-time for tier upgrades
                const userDoc = doc(db, "users", currentUser.uid);
                const unsubDoc = onSnapshot(userDoc, (doc) => {
                    if (doc.exists()) {
                        setTier(doc.data().tier || 'RECRUIT');
                    }
                });
                return () => unsubDoc();
            } else {
                navigate('/login');
            }
        });
        return () => unsubscribeAuth();
    }, [navigate]);

    const isLocked = tier === 'RECRUIT';

    return (
        <div className="min-h-screen bg-black text-white font-sans antialiased relative">
            {/* Header & Nav remain same... */}

            <main className="max-w-7xl mx-auto px-6 py-12">
                {/* --- WELCOME HEADER --- */}
                <div className="mb-12 flex justify-between items-end">
                    <div>
                        <p className="text-[#ccff00] text-[10px] font-black uppercase tracking-[0.4em] mb-2">System Status: Connected</p>
                        <h1 className="text-5xl font-black italic uppercase tracking-tighter">
                            Tactical <span className="text-white/20">Portal.</span>
                        </h1>
                    </div>
                    {isLocked && (
                        <div className="flex items-center gap-2 px-4 py-2 border border-red-500/30 bg-red-500/5 rounded-full">
                            <ShieldAlert size={12} className="text-red-500 animate-pulse" />
                            <span className="text-[8px] font-black uppercase tracking-widest text-red-500 text-nowrap">Unauthorized Access: Protocols Locked</span>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* --- THE LOCK OVERLAY --- */}
                    {isLocked && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40 rounded-[40px] border border-white/5 shadow-2xl">
                            <div className="text-center p-8 max-w-sm">
                                <div className="w-16 h-16 bg-[#ccff00] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(204,255,0,0.3)]">
                                    <Lock size={28} className="text-black" />
                                </div>
                                <h2 className="text-2xl font-black italic uppercase mb-3">Initialize Mission</h2>
                                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-8 leading-relaxed">
                                    Your biometric profile is active, but your training protocols are encrypted. Select a deployment plan to unlock.
                                </p>
                                <button
                                    onClick={() => setShowPayWall(true)}
                                    className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] hover:bg-[#ccff00] transition-all"
                                >
                                    Activate Protocols
                                </button>
                            </div>
                        </div>
                    )}

                    {/* --- MOCKED CONTENT (BLURRED IF LOCKED) --- */}
                    <div className={`md:col-span-2 bg-white/[0.03] border border-white/10 rounded-[32px] p-8 ${isLocked ? 'opacity-20 grayscale' : ''}`}>
                        {/* Daily Protocol content here... */}
                        <h3 className="text-xl font-black italic uppercase mb-4">Daily Training Protocol</h3>
                        <div className="h-32 w-full bg-white/5 rounded-xl animate-pulse"></div>
                    </div>

                    <div className={`bg-white/[0.03] border border-white/10 rounded-[32px] p-8 ${isLocked ? 'opacity-20 grayscale' : ''}`}>
                        <h3 className="text-xl font-black italic uppercase mb-4">Biometrics</h3>
                        <div className="h-48 w-full bg-white/5 rounded-xl animate-pulse"></div>
                    </div>
                </div>

                {/* --- THE SUBSCRIPTION MODAL --- */}
                {showPayWall && (
                    <ProtocolSelection onClose={() => setShowPayWall(false)} />
                )}
            </main>
        </div>
    );
};

export default Dashboard;