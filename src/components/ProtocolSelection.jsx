import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Check, Home, Monitor, Video, MessageSquare, ChevronRight, Zap } from 'lucide-react';

const ProtocolSelection = ({ onClose }) => {
    const navigate = useNavigate();
    const whatsappNumber = "917736720936";
    const scrollRef = useRef(null);

    // Sync state with Landing Page data
    const [selectedPlan, setSelectedPlan] = useState("ONLINE MONITORING");
    const [activeIndex, setActiveIndex] = useState(0);

    const deploymentTiers = [
        {
            name: "ONLINE MONITORING",
            price: "₹2000",
            period: "/ month",
            subtitle: "Professional guidance, remotely managed.",
            icon: <Monitor size={24} />,
            features: [
                "Structured Google Sheets chart",
                "Pre-recorded warm-up/cool-down videos",
                "Personalized diet plan",
                "Weekly progress check-ins",
                "Direct WhatsApp support",
                "Set/Rep/Weight monitoring"
            ],
            tag: "Most Popular"
        },
        {
            name: "VIDEO CALL TRAINING",
            price: "₹4800",
            period: "/ month",
            subtitle: "Live sessions. Real-time correction.",
            icon: <Video size={24} />,
            features: [
                "4 Live video sessions per week",
                "2 Active recovery days",
                "Nutrition guidance",
                "WhatsApp support",
                "Premium: ₹300 per session option",
                "Flexible session selection"
            ],
            tag: "Standard & Premium"
        },
        {
            name: "IN-HOUSE PERSONAL TRAINING",
            price: "₹8000",
            period: "/ Month",
            subtitle: "Train at home. No gym needed.",
            icon: <Home size={24} />,
            features: [
                "16 Sessions (4 PT per week)",
                "2 Guided Recovery / Mobility days",
                "Equipment brought to your home",
                "Personalised Nutrition Planning",
                "WhatsApp support + tracking",
                "Flexible timings"
            ],
            tag: "Limited Slots"
        }
    ];

    const handleScroll = (e) => {
        const container = e.target;
        const scrollPosition = container.scrollLeft;
        const cardWidth = container.offsetWidth * 0.85;
        const index = Math.round(scrollPosition / cardWidth);
        if (index !== activeIndex && index >= 0 && index < deploymentTiers.length) {
            setActiveIndex(index);
        }
    };

    const handleAction = () => {
        const message = encodeURIComponent(`Hi AJX! I'm interested in the ${selectedPlan} plan. Please let me know the next steps.`);
        window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
    };

    return (
        <div className="fixed inset-0 z-[200] bg-[#050505] flex flex-col antialiased selection:bg-[#ccff00] selection:text-black overflow-hidden font-sans">

            <style>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            <header className="p-6 md:p-10 flex items-center justify-between z-20 shrink-0">
                <div className="flex flex-col">
                    <div className="inline-flex items-center gap-2 mb-2">
                        <Zap size={14} className="text-[#ccff00]" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#ccff00]">Membership Options</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white">
                        Choose Your <span className="text-white/20">Plan.</span>
                    </h2>
                </div>
                <button onClick={onClose} className="p-3 bg-white/5 border border-white/10 rounded-full text-white/40 hover:text-white transition-all active:scale-90">
                    <X size={20} />
                </button>
            </header>

            <main className="flex-1 flex flex-col justify-center overflow-hidden">
                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex md:grid md:grid-cols-3 gap-6 px-6 md:px-10 pb-6 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory scrollbar-hide max-w-7xl mx-auto w-full"
                >
                    {deploymentTiers.map((plan, index) => (
                        <div
                            key={index}
                            onClick={() => setSelectedPlan(plan.name)}
                            className={`relative flex flex-col shrink-0 w-[85vw] md:w-full snap-center p-8 md:p-10 rounded-3xl border transition-all duration-500 cursor-pointer
                                ${selectedPlan === plan.name
                                ? 'border-[#ccff00] bg-neutral-900/60 shadow-[0_0_40px_rgba(204,255,0,0.1)]'
                                : 'border-white/5 bg-neutral-900/40 hover:border-white/20'}`}
                        >
                            <div className="flex justify-between items-start mb-8 font-bold">
                                <div className={`p-3 rounded-2xl transition-colors duration-500 ${selectedPlan === plan.name ? 'bg-[#ccff00] text-black' : 'bg-white/10 text-white/40'}`}>
                                    {plan.icon}
                                </div>
                                <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border transition-all ${selectedPlan === plan.name ? 'border-[#ccff00] text-[#ccff00] shadow-[0_0_10px_rgba(204,255,0,0.15)]' : 'border-white/10 text-white/20'}`}>
                                    {plan.tag}
                                </span>
                            </div>

                            <h3 className="text-2xl font-black tracking-tighter mb-2 italic leading-tight uppercase text-white">{plan.name}</h3>
                            <p className="text-sm mb-8 font-medium text-white/40">{plan.subtitle}</p>

                            <div className="flex items-baseline gap-1 mb-8">
                                <span className={`text-5xl font-black tracking-tighter transition-colors ${selectedPlan === plan.name ? 'text-[#ccff00]' : 'text-white'}`}>{plan.price}</span>
                                <span className="text-sm font-bold uppercase tracking-widest text-white/30">{plan.period}</span>
                            </div>

                            <div className="space-y-4 mb-6 flex-grow">
                                {plan.features.map((feature, fIndex) => (
                                    <div key={fIndex} className="flex items-center gap-3">
                                        <Check className={`w-4 h-4 flex-shrink-0 transition-colors ${selectedPlan === plan.name ? 'text-[#ccff00]' : 'text-white/20'}`} />
                                        <span className={`text-sm font-medium transition-colors ${selectedPlan === plan.name ? 'text-white' : 'text-white/40'}`}>
                                            {feature}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Internal selection checkmark */}
                            <div className={`mt-4 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${selectedPlan === plan.name ? 'text-[#ccff00]' : 'text-white/10'}`}>
                                {selectedPlan === plan.name ? <><Check size={14} /> Selected</> : "Tap to Select"}
                            </div>
                        </div>
                    ))}
                </div>

                {/* VISUAL INDICATOR: Landing page style scroll dots */}
                <div className="flex md:hidden justify-center items-center gap-2 mt-4">
                    {deploymentTiers.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1 rounded-full transition-all duration-500 ${activeIndex === i ? 'w-8 bg-[#ccff00] shadow-[0_0_10px_rgba(204,255,0,0.5)]' : 'w-2 bg-white/10'}`}
                        />
                    ))}
                </div>

                <div className="text-center mt-8">
                    <button onClick={() => navigate('/verify-key')} className="text-white/20 hover:text-[#ccff00] text-[10px] font-bold uppercase tracking-[0.4em] transition-all">
                        Already have an invite code?
                    </button>
                </div>
            </main>

            <div className="shrink-0 p-6 md:p-10 bg-gradient-to-t from-black via-black/95 to-transparent z-30">
                <div className="max-w-md mx-auto">
                    <button
                        onClick={handleAction}
                        className="w-full py-6 bg-[#ccff00] text-black font-black uppercase tracking-[0.4em] text-[11px] rounded-3xl hover:bg-white transition-all duration-500 shadow-[0_20px_50px_rgba(204,255,0,0.3)] active:scale-95 flex items-center justify-center gap-3"
                    >
                        <MessageSquare size={18} />
                        <span>START TRANSFORMATION</span>
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProtocolSelection;