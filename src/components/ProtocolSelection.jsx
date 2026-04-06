import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Check, Home, Monitor, Video, ShieldCheck, MessageSquare, ChevronRight } from 'lucide-react';

const ProtocolSelection = ({ onClose }) => {
    const navigate = useNavigate();
    const whatsappNumber = "917736720936";

    // State to track which plan is selected
    const [selectedPlan, setSelectedPlan] = useState("ONLINE MONITORING");

    const deploymentTiers = [
        {
            name: "ONLINE MONITORING",
            price: "₹2000",
            subtitle: "Remote management & guidance.",
            icon: <Monitor size={20} />,
            features: ["Sheets Tracking", "Warm-up Videos", "Diet Plan", "Weekly Check-ins"],
            tag: "POPULAR"
        },
        {
            name: "VIDEO CALL TRAINING",
            price: "₹4800",
            subtitle: "Live sessions. Real-time correction.",
            icon: <Video size={20} />,
            features: ["4 Live Sessions/Week", "2 Recovery Days", "Nutrition Guidance", "Premium Support"],
            tag: "STANDARD"
        },
        {
            name: "IN-HOUSE PERSONAL TRAINING",
            price: "₹8000",
            subtitle: "Elite coaching at your home.",
            icon: <Home size={20} />,
            features: ["16 Sessions/Month", "Equipment Provided", "In-Person Coaching", "Flexible Timings"],
            tag: "EXCLUSIVE"
        }
    ];

    const handleDeploy = () => {
        const message = encodeURIComponent(`Tactical Inquiry: I am ready to deploy the ${selectedPlan} protocol. Please provide activation steps.`);
        window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
    };

    return (
        <div className="fixed inset-0 z-[200] bg-[#050505] flex flex-col antialiased selection:bg-[#ccff00] selection:text-black">

            {/* --- HEADER: FIXED --- */}
            <header className="p-6 md:p-10 flex items-center justify-between z-20">
                <div className="flex flex-col">
                    <div className="inline-flex items-center gap-2 mb-2">
                        <ShieldCheck size={14} className="text-[#ccff00]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ccff00]">Deployment Selection</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white">Unlock <span className="text-white/20">Protocols.</span></h2>
                </div>
                <button onClick={onClose} className="p-3 bg-white/5 border border-white/10 rounded-full text-white/40 hover:text-white transition-all">
                    <X size={20} />
                </button>
            </header>

            {/* --- MAIN BODY: SCROLLABLE CARDS --- */}
            <main className="flex-1 overflow-y-auto px-6 md:px-10 pb-40">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-7xl mx-auto">
                    {deploymentTiers.map((plan, index) => (
                        <div
                            key={index}
                            onClick={() => setSelectedPlan(plan.name)}
                            className={`relative group cursor-pointer p-6 md:p-8 rounded-[40px] border transition-all duration-500 flex flex-col
                                ${selectedPlan === plan.name
                                ? 'border-[#ccff00] bg-[#ccff00]/[0.03] shadow-[0_0_40px_rgba(204,255,0,0.1)]'
                                : 'border-white/10 bg-white/[0.02] hover:border-white/20'}`}
                        >
                            {/* Selection Indicator Dot */}
                            <div className={`absolute top-6 right-6 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                                ${selectedPlan === plan.name ? 'border-[#ccff00] bg-[#ccff00]' : 'border-white/10'}`}>
                                {selectedPlan === plan.name && <Check size={12} className="text-black" />}
                            </div>

                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-all
                                ${selectedPlan === plan.name ? 'bg-[#ccff00] text-black' : 'bg-white/10 text-white/40'}`}>
                                {plan.icon}
                            </div>

                            <h3 className="text-lg font-black italic uppercase mb-1 tracking-tight text-white">{plan.name}</h3>
                            <span className="text-3xl font-black italic tracking-tighter text-white mb-6">{plan.price}<span className="text-xs text-white/20 font-bold tracking-normal italic ml-2">/mo</span></span>

                            <div className="space-y-3 mb-4">
                                {plan.features.map((feature, fIndex) => (
                                    <div key={fIndex} className="flex items-center gap-2">
                                        <div className={`w-1 h-1 rounded-full ${selectedPlan === plan.name ? 'bg-[#ccff00]' : 'bg-white/20'}`}></div>
                                        <span className={`text-[10px] font-bold uppercase tracking-widest ${selectedPlan === plan.name ? 'text-white' : 'text-white/40'}`}>{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Manual Override Option */}
                <div className="mt-12 text-center pb-10">
                    <button onClick={() => navigate('/verify-key')} className="text-white/20 hover:text-[#ccff00] text-[10px] font-black uppercase tracking-[0.4em] transition-all">
                        Have a Tactical Activation Key?
                    </button>
                </div>
            </main>

            {/* --- FOOTER ACTION: FIXED BOTTOM --- */}
            <div className="fixed bottom-0 left-0 w-full p-6 md:p-10 bg-gradient-to-t from-black via-black/95 to-transparent z-30">
                <div className="max-w-md mx-auto">
                    <button
                        onClick={handleDeploy}
                        className="w-full py-5 bg-[#ccff00] text-black font-black uppercase tracking-[0.4em] text-[11px] rounded-3xl hover:bg-white transition-all duration-500 shadow-[0_20px_50px_rgba(204,255,0,0.3)] active:scale-95 flex items-center justify-center gap-3"
                    >
                        <MessageSquare size={16} />
                        <span>DEPLOY: {selectedPlan.split(' ')[0]} PROTOCOL</span>
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProtocolSelection;