import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Cpu, ArrowRight } from 'lucide-react';
// Updated Firebase imports to include setDoc for profile promotion
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "../firebase";

const VerifyKey = () => {
    const [code, setCode] = useState(['', '', '', '']);
    const [status, setStatus] = useState('AWAITING_INPUT');
    const navigate = useNavigate();

    const handleChange = (index, value) => {
        if (isNaN(value)) return;
        const newCode = [...code];
        newCode[index] = value.substring(value.length - 1);
        setCode(newCode);

        if (value && index < 3) {
            const nextInput = document.getElementById(`code-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleVerify = async () => {
        const finalCode = code.join('');
        setStatus('VERIFYING');

        try {
            // Query the global 'keys' collection for the activation code
            const docRef = doc(db, "keys", finalCode);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();

                if (data.isActive) {
                    setStatus('SUCCESS');

                    // CRITICAL: Promote the current user's profile in the 'users' collection
                    // This allows the Dashboard's onSnapshot listener to trigger the unlock
                    if (auth.currentUser) {
                        await setDoc(doc(db, "users", auth.currentUser.uid), {
                            tier: data.tier || 'INHOUSE',
                            activatedAt: new Date(),
                            activationCode: finalCode,
                            status: 'ACTIVE'
                        }, { merge: true });
                    }

                    // Redundant backup for offline-first speed
                    localStorage.setItem('memberTier', data.tier || 'recruit');

                    setTimeout(() => navigate('/dashboard'), 1000);
                } else {
                    throw new Error("KEY_DEACTIVATED");
                }
            } else {
                throw new Error("INVALID_KEY");
            }
        } catch (error) {
            console.error("TERMINAL_ACCESS_DENIED:", error.message);
            setStatus('ERROR');

            setTimeout(() => {
                setCode(['', '', '', '']);
                setStatus('AWAITING_INPUT');
                const firstInput = document.getElementById('code-0');
                if (firstInput) firstInput.focus();
            }, 2000);
        }
    };

    return (
        <div className="h-screen bg-black text-white flex flex-col items-center justify-center font-sans antialiased selection:bg-[#ccff00] selection:text-black">
            <div className="max-w-md w-full p-8 bg-white/[0.02] border border-white/10 rounded-[32px] backdrop-blur-3xl relative overflow-hidden shadow-2xl">
                {/* Tactical HUD Scan Line */}
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#ccff00]/40 to-transparent animate-pulse"></div>

                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#ccff00]/30 rounded-full bg-[#ccff00]/5 mb-6">
                        <ShieldCheck size={12} className={status === 'ERROR' ? 'text-red-500' : 'text-[#ccff00]'} />
                        <span className={`text-[8px] font-black uppercase tracking-[0.3em] ${status === 'ERROR' ? 'text-red-500' : 'text-[#ccff00]'}`}>
                            {status === 'ERROR' ? 'Authorization Failed' : 'Final Authorization'}
                        </span>
                    </div>
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-2">Enter Tactical Key</h2>
                    <p className="text-white/40 text-[9px] font-bold tracking-[0.2em] uppercase leading-relaxed text-balance">
                        Input the 4-digit code provided by AJX HQ to decrypt your protocols.
                    </p>
                </div>

                <div className="flex justify-center gap-4 mb-10">
                    {code.map((digit, idx) => (
                        <input
                            key={idx}
                            id={`code-${idx}`}
                            type="text"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            value={digit}
                            onChange={(e) => handleChange(idx, e.target.value)}
                            className={`w-14 h-16 bg-white/5 border rounded-xl text-center text-2xl font-black transition-all outline-none ${
                                status === 'ERROR' ? 'border-red-500/50 text-red-500' :
                                    digit ? 'border-[#ccff00] text-[#ccff00] shadow-[0_0_15px_rgba(204,255,0,0.15)]' :
                                        'border-white/10 text-white'
                            } focus:border-[#ccff00]`}
                        />
                    ))}
                </div>

                <button
                    onClick={handleVerify}
                    disabled={code.includes('') || status === 'VERIFYING'}
                    className={`group w-full py-4 rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-3 transition-all duration-500 active:scale-95 ${
                        code.includes('')
                            ? 'bg-white/5 text-white/20 border border-white/5 cursor-not-allowed'
                            : 'bg-[#ccff00] text-black hover:bg-white hover:shadow-[0_0_30px_rgba(204,255,0,0.3)] shadow-xl'
                    }`}
                >
                    <span className="relative z-10 font-bold">
                        {status === 'VERIFYING' ? 'DECRYPTING...' : status === 'ERROR' ? 'ACCESS DENIED' : 'UNLOCK TERMINAL'}
                    </span>
                    <ArrowRight size={14} className={`transition-transform ${!code.includes('') && 'group-hover:translate-x-1'}`} />
                </button>
            </div>

            <div className="mt-8 flex items-center gap-2 opacity-30">
                <Cpu size={12} className="text-[#ccff00] animate-pulse" />
                <span className="text-[7px] font-mono tracking-[0.4em] uppercase text-white">
                    PROTOCOL: {status === 'VERIFYING' ? 'HANDSHAKE_ACTIVE' : 'SECURE_CHANNEL'}
                </span>
            </div>
        </div>
    );
};

export default VerifyKey;