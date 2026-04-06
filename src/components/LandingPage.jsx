import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Shield, Wind, ArrowRight, X, Check, Phone, MessageCircle, Monitor, Video, Home, User, Lock, Award, ChevronDown, Activity, Cpu , ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

// ... (InstagramIcon and BrandLogo components remain the same)

const LandingPage = () => {
    const [user, authLoading] = useAuthState(auth);
    const navigate = useNavigate();

    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [activePlanIndex, setActivePlanIndex] = useState(0);
    const plansRef = useRef(null);

    useEffect(() => {
        if (user && !authLoading) {
            navigate("/dashboard", { replace: true });
        }
    }, [user, authLoading, navigate]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        setTimeout(() => setIsVideoLoaded(true), 500);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (authLoading || user) {
        return (
            <div className="h-screen bg-black flex flex-col items-center justify-center">
                <Cpu size={24} className="text-[#ccff00] animate-spin mb-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 animate-pulse">
                    Restoring Terminal Connection...
                </span>
            </div>
        );
    }

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setMobileMenuOpen(false);
    };

    const handlePlansScroll = () => {
        if (plansRef.current) {
            const { scrollLeft, clientWidth, scrollWidth } = plansRef.current;
            const maxScroll = scrollWidth - clientWidth;
            if (maxScroll <= 0) return;
            const scrollPercentage = scrollLeft / maxScroll;
            const index = Math.round(scrollPercentage * (plans.length - 1));
            if (index !== activePlanIndex) {
                setActivePlanIndex(index);
            }
        }
    };

    // ... (pillars and plans data arrays remain the same)

    return (
        /* UPDATED: Removed touch-pan-y and select-none to prevent the UI from "sticking" on mobile */
        <div className="min-h-screen bg-black text-white font-sans selection:bg-[#ccff00] selection:text-black antialiased relative overflow-x-hidden">

            {/* Background and Nav remain the same */}

            {/* ... (Hero and Pillars sections) */}

            {/* Plans Section */}
            <section id="plans" className="py-12 md:py-20 px-6 md:px-8 bg-black text-white font-bold">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12 md:mb-16">
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter italic uppercase mb-4 text-white font-bold">Membership Plans</h2>
                        <p className="text-[#ccff00] uppercase tracking-[0.3em] text-xs font-black italic">First session trial available</p>
                    </div>

                    <div
                        ref={plansRef}
                        onScroll={handlePlansScroll}
                        className="flex overflow-x-auto lg:grid lg:grid-cols-3 gap-6 md:gap-8 pb-4 lg:pb-0 snap-x snap-mandatory scrollbar-hide"
                    >
                        {plans.map((plan, index) => (
                            <div
                                key={index}
                                className="relative flex flex-col min-w-[290px] w-[85vw] md:w-full snap-center p-8 md:p-10 rounded-3xl border border-[#ccff00]/10 lg:border-white/5 bg-neutral-900/40 text-white transition-all duration-500 hover:scale-[1.02] active:scale-95 hover:border-[#ccff00]/30 group"
                            >
                                {/* Card content remains same */}
                                <div className="flex justify-between items-start mb-8 font-bold">
                                    <div className="p-3 rounded-2xl bg-[#ccff00]/10 lg:bg-white/10 text-[#ccff00] lg:text-white group-hover:bg-[#ccff00] group-hover:text-black transition-colors duration-500">
                                        {plan.icon}
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border border-[#ccff00]/30 text-[#ccff00] shadow-[0_0_10px_rgba(204,255,0,0.15)]">
                                        {plan.tag}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-black tracking-tighter mb-2 italic leading-tight uppercase font-bold">{plan.name}</h3>
                                <p className="text-sm mb-8 font-medium text-white/40">{plan.subtitle}</p>

                                <div className="flex items-baseline gap-1 mb-10">
                                    <span className="text-5xl font-black tracking-tighter text-[#ccff00] lg:text-white group-hover:text-[#ccff00] transition-colors">{plan.price}</span>
                                    <span className="text-sm font-bold uppercase tracking-widest text-white/30">{plan.period}</span>
                                </div>

                                <div className="space-y-4 mb-12 flex-grow font-bold text-white">
                                    {plan.features.map((feature, fIndex) => (
                                        <div key={fIndex} className="flex items-center gap-3">
                                            <Check className="w-4 h-4 flex-shrink-0 text-[#ccff00]/50 group-hover:text-[#ccff00] transition-colors" />
                                            <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* FIXED: Plan buttons now lead to the signup page instead of being static */}
                                <button
                                    onClick={() => navigate('/signup')}
                                    className="w-full py-5 rounded-full font-black uppercase tracking-widest text-[10px] bg-white text-black transition-all hover:bg-[#ccff00] active:scale-90 shadow-[0_4px_20px_rgba(204,255,0,0.1)] font-bold"
                                >
                                    {plan.buttonText}
                                </button>
                            </div>
                        ))}
                    </div>
                    {/* ... (Coach Athul and Manifesto sections) */}
                </div>
            </section>
            {/* ... (Footer remains same) */}
        </div>
    );
};

export default LandingPage;