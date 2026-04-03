import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Check, Home, Monitor, Video, ShieldCheck, MessageSquare } from 'lucide-react';

const ProtocolSelection = ({ onClose }) => {
    const navigate = useNavigate();
    // Using the official HQ contact number
    const whatsappNumber = "917736720936";

    const handleDeploy = (planName) => {
        // Creating a pre-filled tactical message for the coach
        const message = encodeURIComponent(`Tactical Inquiry: I am ready to deploy the ${planName} protocol. Please provide the activation steps.`);
        window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
    };

    // Data synchronized from LandingPage.jsx
    const deploymentTiers = [
        {
            name: "ONLINE MONITORING",
            price: "₹2000",
            subtitle: "Professional guidance, remotely managed.",
            icon: <Monitor size={20} />,
            features: ["Google Sheets Tracking", "Warm-up Videos", "Diet Plan", "Weekly Check-ins"],
            tag: "MOST POPULAR"
        },
        {
            name: "VIDEO CALL TRAINING",
            price: "₹4800",
            subtitle: "Live sessions. Real-time correction.",
            icon: <Video size={20} />,
            features: ["4 Live Sessions/Week", "2 Recovery Days", "Nutrition Guidance", "Premium Support"],
            tag: "STANDARD & PREMIUM"
        },
        {
            name: "IN-HOUSE PERSONAL TRAINING",
            price: "₹8000",
            subtitle: "Train at home. No gym needed.",
            icon: <Home size={20} />,
            features: ["16 Sessions/Month", "Equipment Provided", "In-Person Coaching", "Flexible Timings"],
            tag: "LIMITED SLOTS",
            highlight: true
        }
    ];

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-3xl overflow-y-auto">
            <div className="max-w-6xl w-full bg-[#050505] border border-white/10 rounded-[40px] p-6 md:p-12 relative my-8">

                <button onClick={onClose} className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors p-2">
                    <X size={24} />
                </button>

                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#ccff00]/30 rounded-full bg-[#ccff00]/5 mb-6">
                        <ShieldCheck size={12} className="text-[#ccff00]" />
                        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-[#ccff00]">Deployment Selection Required</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-4 text-white">Unlock <span className="text-white/20">Protocols.</span></h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {deploymentTiers.map((plan, index) => (
                        <div key={index} className={`relative flex flex-col p-8 rounded-[32px] border transition-all duration-700 ${plan.highlight ? 'border-[#ccff00]/40 bg-[#ccff00]/5' : 'border-white/5 bg-white/[0.02]'}`}>

                            <div className="flex justify-between items-start mb-8">
                                <div className={`p-3 rounded-2xl ${plan.highlight ? 'bg-[#ccff00] text-black' : 'bg-white/10 text-[#ccff00]'}`}>
                                    {plan.icon}
                                </div>
                                <span className="text-[8px] font-black uppercase tracking-widest text-white/40">{plan.tag}</span>
                            </div>

                            <h3 className="text-xl font-black italic uppercase mb-2">{plan.name}</h3>
                            <span className="text-3xl font-black italic tracking-tighter text-white mb-8">{plan.price}</span>

                            <div className="space-y-4 mb-12 flex-grow">
                                {plan.features.map((feature, fIndex) => (
                                    <div key={fIndex} className="flex items-center gap-3">
                                        <Check size={12} className="text-[#ccff00] opacity-50" />
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-white/60">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => handleDeploy(plan.name)}
                                className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.4em] text-[10px] flex items-center justify-center gap-3 transition-all ${plan.highlight ? 'bg-[#ccff00] text-black hover:bg-white' : 'bg-white text-black hover:bg-[#ccff00]'}`}
                            >
                                <MessageSquare size={14} />
                                Deploy via WhatsApp
                            </button>
                        </div>
                    ))}
                </div>

                {/* Manual Bypass for In-House members who already have a key */}
                <div className="mt-12 text-center pt-8 border-t border-white/5">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-4">Manual Override Required?</p>
                    <button
                        onClick={() => navigate('/verify-key')}
                        className="text-[#ccff00] text-[10px] font-black uppercase tracking-[0.4em] hover:underline"
                    >
                        Input Legacy 4-Digit Key
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProtocolSelection;