import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signOut } from "firebase/auth";
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import {
    Lock, Shield, LogOut, Cpu,
    User, Calendar, Smartphone, Info,
    Zap, Sparkles, ChevronRight, Mail,
    HeartPulse, CheckCircle2, X, Activity
} from 'lucide-react';
import ProtocolSelection from './ProtocolSelection';

const BrandLogo = () => (
    <div className="flex flex-row items-center select-none">
        <span className="text-lg md:text-2xl font-black italic tracking-tighter text-white leading-none font-bold">
            AJX
        </span>
        <span className="text-lg md:text-2xl font-black italic tracking-tighter uppercase text-[#ccff00] leading-none font-bold">
            FITCLUB
        </span>
    </div>
);

const Dashboard = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState('RECRUIT');
    const [tier, setTier] = useState('NONE');
    const [userData, setUserData] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showPayWall, setShowPayWall] = useState(false);

    const [showBioSync, setShowBioSync] = useState(false);
    const [bioData, setBioData] = useState({ gender: '', dob: '', healthIssues: '' });
    const [isSavingBio, setIsSavingBio] = useState(false);

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
                        if (data.assessment) {
                            setBioData({
                                gender: data.assessment.gender || '',
                                dob: data.assessment.dob || '',
                                healthIssues: data.assessment.healthIssues || ''
                            });
                        }
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
        try { await signOut(auth); navigate("/", { replace: true }); }
        catch (error) { console.error("Error signing out:", error.message); }
    };

    const handleBioSubmit = async (e) => {
        e.preventDefault();
        setIsSavingBio(true);
        try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                "assessment.gender": bioData.gender,
                "assessment.dob": bioData.dob,
                "assessment.healthIssues": bioData.healthIssues
            });
            setShowBioSync(false);
        } catch (error) { console.error("Error saving profile:", error); }
        finally { setIsSavingBio(false); }
    };

    const isBioComplete = userData?.assessment?.gender && userData?.assessment?.dob;
    const isActive = status === 'ACTIVE';

    if (loading) {
        return (
            <div className="h-[100dvh] bg-[#050505] flex flex-col items-center justify-center p-6 text-[#ccff00]">
                <Activity size={32} className="animate-pulse mb-6" />
                <p className="text-xs font-bold uppercase tracking-widest text-white/40">Loading Dashboard...</p>
            </div>
        );
    }

    return (
        <div className="min-h-[100dvh] w-full bg-[#080808] text-white font-sans antialiased flex flex-col">
            <header className="shrink-0 bg-black/60 backdrop-blur-3xl border-b border-white/10 z-[100]">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 bg-white/[0.05] border border-white/10 rounded-xl flex items-center justify-center text-[#ccff00]">
                            <Shield size={18} />
                        </div>
                        <BrandLogo />
                    </div>
                    <button onClick={handleSignOut} className="p-2.5 bg-white/[0.05] border border-white/10 rounded-xl text-white/40 hover:text-red-500 transition-all">
                        <LogOut size={16} />
                    </button>
                </div>
            </header>

            <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 md:py-12 flex flex-col">
                <div className="mb-10">
                    <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.05]">
                        <div className={`w-1.5 h-1.5 rounded-full ${!isActive ? 'bg-orange-500 animate-pulse' : 'bg-[#ccff00]'}`}></div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                            {isActive ? 'Account Active' : 'Setup in Progress'}
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-tight text-white">
                        {isActive ? 'Hello,' : 'Welcome,'} <br/>
                        <span className="text-white/30">{userData?.fullName || 'Member'}.</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div
                        onClick={() => setShowBioSync(true)}
                        className={`group bg-white/[0.03] border rounded-[32px] p-8 transition-all duration-300 cursor-pointer ${isBioComplete ? 'border-white/5' : 'border-[#ccff00]/30 hover:bg-white/[0.05]'}`}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="h-10 w-10 rounded-2xl bg-white/[0.05] flex items-center justify-center text-[#ccff00]">
                                <User size={20} />
                            </div>
                            {isBioComplete && <CheckCircle2 size={18} className="text-[#ccff00]" />}
                        </div>
                        <h3 className="text-xl font-bold mb-2">My Health Profile</h3>
                        <p className="text-white/40 text-xs leading-relaxed">
                            {isBioComplete
                                ? 'Your health details are saved and ready.'
                                : 'Please tell us about your health so we can build the right plan for you.'}
                        </p>
                        {!isBioComplete && (
                            <div className="mt-6 text-[#ccff00] text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                                Complete Now <ChevronRight size={14} />
                            </div>
                        )}
                    </div>

                    <div className="relative rounded-[32px] overflow-hidden bg-white/[0.02] border border-white/5 min-h-[220px] flex flex-col items-center justify-center text-center p-8">
                        <Sparkles size={24} className="text-white/10 mb-4" />
                        <h3 className="text-xl font-bold text-white/20">Training & Nutrition</h3>
                        {!isActive && (
                            <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center p-6">
                                <Lock size={20} className="text-[#ccff00] mb-4" />
                                <p className="text-white/80 text-xs font-medium mb-6 max-w-[200px]">
                                    Pick a plan to unlock your workouts and food charts.
                                </p>
                                <button
                                    onClick={() => setShowPayWall(true)}
                                    className="px-8 py-3.5 bg-[#ccff00] text-black font-bold uppercase tracking-widest text-[10px] rounded-2xl shadow-xl active:scale-95 transition-all"
                                >
                                    Choose a Plan
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {showPayWall && <ProtocolSelection onClose={() => setShowPayWall(false)} />}

                {showBioSync && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 bg-black/90 backdrop-blur-xl">
                        <div className="w-full max-w-md bg-[#0f0f0f] border border-white/10 rounded-[32px] p-6 md:p-10 relative animate-in fade-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto scrollbar-hide">
                            <button onClick={() => setShowBioSync(false)} className="absolute top-6 right-6 text-white/20 hover:text-white"><X size={20} /></button>

                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold">Health Profile</h3>
                                <p className="text-xs text-white/40 mt-1">This helps us keep your training safe.</p>
                            </div>

                            <form onSubmit={handleBioSubmit} className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Gender</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {['Male', 'Female', 'Other'].map(g => (
                                            <button
                                                key={g} type="button"
                                                onClick={() => setBioData({...bioData, gender: g})}
                                                className={`py-3 rounded-xl border text-[10px] font-bold transition-all ${bioData.gender === g ? 'bg-[#ccff00] text-black border-[#ccff00]' : 'bg-white/[0.05] border-white/5 text-white/40'}`}
                                            >
                                                {g}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Date of Birth</label>
                                    {/* UI FIX: Added specific mobile date input styling to prevent overflow */}
                                    <div className="relative group">
                                        <input
                                            type="date" required
                                            value={bioData.dob}
                                            onChange={(e) => setBioData({...bioData, dob: e.target.value})}
                                            className="block w-full bg-white/[0.05] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:border-[#ccff00]/40 appearance-none color-scheme-dark"
                                            style={{ colorScheme: 'dark' }}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Any Injuries or Health Issues?</label>
                                    <textarea
                                        placeholder="E.g. Knee pain, Back issues, etc."
                                        value={bioData.healthIssues}
                                        onChange={(e) => setBioData({...bioData, healthIssues: e.target.value})}
                                        className="w-full bg-white/[0.05] border border-white/5 rounded-2xl px-6 py-4 text-sm text-white outline-none focus:border-[#ccff00]/40 h-24 resize-none"
                                    />
                                </div>

                                <button
                                    disabled={isSavingBio || !bioData.gender || !bioData.dob}
                                    type="submit"
                                    className="w-full py-4.5 bg-[#ccff00] text-black font-bold uppercase tracking-widest text-[10px] rounded-2xl shadow-lg active:scale-95 transition-all disabled:opacity-30"
                                >
                                    {isSavingBio ? 'Saving...' : 'Save Profile'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;