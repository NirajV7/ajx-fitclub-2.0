import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Shield, Wind, ArrowRight, X, Check, Phone, MessageCircle, Monitor, Video, Home, User, Lock, Award, ChevronDown, Activity, Cpu , ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

const InstagramIcon = ({ size = 24, className = "" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
);

const BrandLogo = ({ onClick }) => (
    <div
        onClick={onClick}
        className="flex flex-row items-center group cursor-pointer select-none"
    >
        <span className="text-lg md:text-2xl font-black italic tracking-tighter text-white leading-none transition-all duration-500 font-bold">
            AJX
        </span>
        <span className="text-lg md:text-2xl font-black italic tracking-tighter uppercase text-[#ccff00] leading-none transition-all font-bold">
            FITCLUB
        </span>
    </div>
);

const MobileMenuToggle = ({ isOpen, onClick, side }) => (
    <button
        onClick={onClick}
        className={`group relative w-10 h-10 flex items-center transition-all duration-300 active:scale-90 z-[1100] ${side === 'left' ? 'justify-start' : 'justify-end'}`}
    >
        <div className="relative w-4 h-4 flex flex-wrap gap-0.5 items-center justify-center">
            <div className={`w-1.5 h-1.5 rounded-[1px] transition-all duration-500 ${isOpen ? 'bg-white rotate-45 translate-x-[4px] translate-y-[4px]' : 'bg-[#ccff00] group-hover:bg-white shadow-[0_0_8px_rgba(204,255,0,0.4)] animate-pulse'}`}></div>
            <div className={`w-1.5 h-1.5 rounded-[1px] transition-all duration-500 ${isOpen ? 'bg-white -rotate-45 -translate-x-[4px] translate-y-[4px]' : 'bg-white/40 group-hover:bg-[#ccff00]'}`}></div>
            <div className={`w-1.5 h-1.5 rounded-[1px] transition-all duration-500 ${isOpen ? 'bg-white -rotate-45 translate-x-[4px] -translate-y-[4px]' : 'bg-white/40 group-hover:bg-[#ccff00]'}`}></div>
            <div className={`w-1.5 h-1.5 rounded-[1px] transition-all duration-500 ${isOpen ? 'bg-white rotate-45 -translate-x-[4px] -translate-y-[4px]' : 'bg-[#ccff00] group-hover:bg-white shadow-[0_0_8px_rgba(204,255,0,0.4)] animate-pulse'}`}></div>
        </div>
    </button>
);

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

    const pillars = [
        {
            title: "ACCESS.",
            icon: <MapPin className="w-5 h-5" />,
            description: "Forget the commute and the crowds. We bring the elite gym experience, equipment, and expertise directly to your doorstep. Your home, transformed."
        },
        {
            title: "JOIN.",
            icon: <Shield className="w-5 h-5" />,
            description: "Enter an exclusive circle of movement. Whether it’s high-intensity training or refined mobility, you are joining a club dedicated to individual excellence and elite coaching."
        },
        {
            title: "X-HALE.",
            icon: <Wind className="w-5 h-5" />,
            description: "The ultimate finish. Experience the deep satisfaction and stress relief of a world-class workout, followed by the immediate comfort of being in your own space."
        }
    ];

    const plans = [
        {
            name: "ONLINE MONITORING",
            price: "₹2000",
            period: "/ month",
            subtitle: "Professional guidance, remotely managed.",
            icon: <Monitor className="w-6 h-6" />,
            buttonText: "UNLOCK MY PLAN",
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
            icon: <Video className="w-6 h-6" />,
            buttonText: "CONNECT LIVE",
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
            icon: <Home className="w-6 h-6" />,
            buttonText: "BRING THE CLUB HOME",
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

    return (
        <div className="min-h-screen bg-black text-white font-sans antialiased relative overflow-x-hidden selection:bg-[#ccff00] selection:text-black">

            <div className="fixed inset-0 pointer-events-none z-0">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-[#ccff00] rounded-full blur-[1px] opacity-20"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animation: `float ${10 + Math.random() * 20}s linear infinite`,
                            animationDelay: `-${Math.random() * 20}s`
                        }}
                    />
                ))}
            </div>

            <style>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
                @keyframes scan { 0% { top: 0%; } 100% { top: 100%; } }
                .scan-line { animation: scan 3s linear infinite; }
                
                @keyframes float {
                  0% { transform: translateY(0) translateX(0); opacity: 0; }
                  20% { opacity: 0.2; }
                  80% { opacity: 0.2; }
                  100% { transform: translateY(-100vh) translateX(50px); opacity: 0; }
                }

                @keyframes drift {
                  0%, 100% { transform: translateY(0px) rotate(0deg); }
                  50% { transform: translateY(-10px) rotate(0.5deg); }
                }

                .animate-drift { animation: drift 6s ease-in-out infinite; }

                @keyframes ticker {
                  0% { transform: translateX(100%); }
                  100% { transform: translateX(-100%); }
                }
                .animate-ticker { animation: ticker 20s linear infinite; }
            `}</style>

            <nav className={`fixed w-full z-[100] transition-all duration-700 ${isScrolled ? 'bg-black/95 backdrop-blur-xl py-4 border-b border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]' : 'bg-transparent py-8'}`}>
                <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between relative font-bold text-white">
                    <div className="md:hidden">
                        <MobileMenuToggle isOpen={mobileMenuOpen} onClick={() => setMobileMenuOpen(!mobileMenuOpen)} side="left" />
                    </div>

                    <div className="flex-1 md:flex-none flex justify-center md:justify-start">
                        <BrandLogo onClick={scrollToTop} />
                    </div>

                    <div className="hidden md:flex items-center space-x-12 text-[10px] font-bold tracking-[0.3em] uppercase font-black">
                        {['About', 'Pillars', 'Plans', 'Experience'].map((item) => (
                            <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-[#ccff00] transition-colors cursor-pointer tracking-widest text-white relative group/link">
                                {item}
                                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#ccff00] group-hover/link:w-full transition-all"></span>
                            </a>
                        ))}
                        <Link to="/signup">
                            <button className="px-6 py-2 border border-white/20 rounded-full hover:bg-[#ccff00] hover:text-black hover:border-[#ccff00] active:scale-95 transition-all duration-500 font-black tracking-widest text-[10px] uppercase">
                                LOGIN
                            </button>
                        </Link>
                    </div>

                    <div className="md:hidden">
                        <MobileMenuToggle isOpen={mobileMenuOpen} onClick={() => setMobileMenuOpen(!mobileMenuOpen)} side="right" />
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black z-10" />
                    <div className="absolute inset-0 scale-110">
                        <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center grayscale brightness-50 opacity-40 animate-[pulse_8s_ease-in-out_infinite]" />
                    </div>
                </div>

                <div className={`relative z-20 text-center px-6 transition-all duration-1000 transform animate-drift ${isVideoLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <div className="inline-flex items-center gap-3 px-4 py-2 border border-white/10 rounded-full bg-white/5 backdrop-blur-md mb-8">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ccff00] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ccff00]"></span>
                        </span>
                        <span className="text-[10px] font-black tracking-[0.2em] uppercase opacity-80 text-white italic">DPIIT Recognized Startup</span>
                    </div>

                    <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-6 leading-[0.85] uppercase italic text-white drop-shadow-2xl">
                        ACCESS.<br/>
                        JOIN.<br/>
                        <span className="text-[#ccff00] drop-shadow-[0_0_20px_rgba(204,255,0,0.4)]">X-HALE.</span>
                    </h1>

                    <p className="text-lg md:text-xl font-light text-white/50 tracking-wide max-w-2xl mx-auto mb-12 leading-relaxed uppercase italic">
                        The caliber of a club.<br className="md:hidden" /> The convenience of home.
                    </p>

                    <Link to="/signup">
                        <button className="group relative flex items-center justify-center gap-3 px-10 py-6 bg-white hover:bg-[#ccff00] text-black font-black uppercase tracking-[0.2em] text-[12px] rounded-full transition-all duration-500 hover:scale-105 active:scale-95 shadow-[0_15px_40px_rgba(255,255,255,0.1)] hover:shadow-[0_15px_40px_rgba(204,255,0,0.3)] mx-auto font-bold">
                            <span className="relative z-10 font-bold">Start Transformation</span>
                            <div className="w-6 h-6 flex items-center justify-center bg-black/5 rounded-full group-hover:translate-x-1 transition-transform duration-300">
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </button>
                    </Link>
                </div>

                <div className="absolute bottom-4 left-0 w-full overflow-hidden opacity-20 pointer-events-none">
                    <div className="whitespace-nowrap animate-ticker text-[8px] font-mono tracking-[0.4em] uppercase text-[#ccff00]">
                        ESTABLISHING CONNECTION... PERFORMANCE METRICS ACTIVE... 100% RECOGNIZED... AJX.COLLECTIVE ONLINE... NO COMMUTE DETECTED... ELITE TRAINING PROTOCOL ENGAGED...
                    </div>
                </div>

                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center z-30">
                    <div className="w-px h-24 bg-gradient-to-b from-[#ccff00] to-transparent text-[#ccff00]"></div>
                    <div className="w-3 h-3 rounded-full border border-[#ccff00] bg-black"></div>
                </div>
            </section>

            {/* Pillars Section */}
            <section id="pillars" className="relative pt-24 pb-12 px-8 bg-black">
                <div className="max-w-7xl mx-auto text-white font-bold">
                    <div className="grid lg:grid-cols-3 gap-px bg-white/10 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                        {pillars.map((pillar, index) => (
                            <div key={index} className="group bg-black p-12 lg:p-16 transition-all duration-700 hover:bg-neutral-900/50 active:bg-neutral-900 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-[#ccff00] scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left shadow-[0_0_15px_rgba(204,255,0,0.5)]" />
                                <div className="mb-12 text-white/30 group-hover:text-[#ccff00] transition-colors transform group-hover:scale-110 group-hover:-rotate-12">
                                    {pillar.icon}
                                </div>
                                <h3 className="text-3xl font-black mb-6 tracking-tighter italic group-hover:text-[#ccff00] transition-colors text-white uppercase font-bold">{pillar.title}</h3>
                                <p className="text-white/40 leading-relaxed text-lg font-light group-hover:text-white/70 transition-colors">
                                    {pillar.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-12 flex flex-col items-center">
                    <div className="w-px h-16 bg-[#ccff00]/20"></div>
                    <ChevronDown className="text-[#ccff00] w-6 h-6 animate-bounce opacity-40" />
                </div>
            </section>

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
                        className="flex overflow-x-auto lg:grid lg:grid-cols-3 gap-6 md:gap-8 pb-6 lg:pb-0 snap-x snap-mandatory scrollbar-hide"
                    >
                        {plans.map((plan, index) => (
                            <div
                                key={index}
                                className="relative flex flex-col min-w-[290px] w-[85vw] md:w-full snap-center p-8 md:p-10 rounded-3xl border border-[#ccff00]/10 lg:border-white/5 bg-neutral-900/40 text-white transition-all duration-500 hover:scale-[1.02] active:scale-95 hover:border-[#ccff00]/30 group"
                            >
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

                                <button
                                    onClick={() => navigate('/signup')}
                                    className="w-full py-5 rounded-full font-black uppercase tracking-widest text-[10px] bg-white text-black transition-all hover:bg-[#ccff00] active:scale-90 shadow-[0_4px_20px_rgba(204,255,0,0.1)] font-bold"
                                >
                                    {plan.buttonText}
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* SCROLL INDICATOR: Added tactical pagination for mobile swipe awareness */}
                    <div className="flex lg:hidden justify-center items-center gap-2 mt-4">
                        {plans.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1 rounded-full transition-all duration-500 ${activePlanIndex === i ? 'w-8 bg-[#ccff00] shadow-[0_0_10px_rgba(204,255,0,0.5)]' : 'w-2 bg-white/10'}`}
                            />
                        ))}
                    </div>

                    <div className="p-6 md:p-12 rounded-[40px] border border-white/5 bg-neutral-900/20 group hover:border-[#ccff00]/20 transition-all duration-700 overflow-hidden relative text-white font-bold mt-16">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ccff00]/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>

                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-16">
                            <div className="relative w-40 h-40 md:w-64 md:h-64 flex-shrink-0">
                                <div className="absolute inset-0 border border-[#ccff00]/20 rounded-3xl rotate-6 group-hover:rotate-0 transition-transform duration-700"></div>
                                <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                                    <img
                                        src="/IMG_7495.jpg"
                                        alt="Coach Athul"
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 scale-110 group-hover:scale-100 transition-all duration-1000"
                                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400&auto=format&fit=crop'; }}
                                    />
                                </div>
                            </div>

                            <div className="flex-grow text-center md:text-left w-full">
                                <span className="text-[9px] md:text-[10px] font-black tracking-[0.4em] uppercase text-[#ccff00] mb-3 block italic text-white/60">Head of Performance</span>
                                <h4 className="text-4xl md:text-6xl font-black italic uppercase mb-6 tracking-tighter leading-none font-bold">Coach Athul</h4>

                                <div className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-4 mb-8">
                                    {["Resp india level 3", "Nsqf level 4", "Human Performance Nutrition"].map((cert) => (
                                        <div key={cert} className="group/cert flex items-center gap-2 px-3 py-2 md:px-5 md:py-3 rounded-xl bg-white/5 border border-white/10 hover:border-[#ccff00]/40 transition-all">
                                            <Award className="w-3 h-3 md:w-4 md:h-4 text-[#ccff00] opacity-70 group-hover/cert:opacity-100" />
                                            <span className="text-[10px] md:sm font-bold uppercase tracking-widest text-white/80 group-hover/cert:text-white transition-colors">{cert}</span>
                                        </div>
                                    ))}
                                </div>

                                <p className="text-white/40 font-medium text-xs md:text-base mb-8 max-w-xl leading-relaxed uppercase italic tracking-wider mx-auto md:mx-0 font-bold">
                                    Dedicated to delivering elite training results directly to your doorstep.
                                </p>

                                <div className="flex items-center justify-center md:justify-start gap-4 md:gap-6">
                                    <a href="https://wa.me/917736720936" className="group flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-2xl border border-[#ccff00]/40 text-[#ccff00] transition-all duration-500 hover:bg-[#ccff00] hover:text-black active:scale-90 hover:scale-110 hover:-rotate-6">
                                        <MessageCircle size={22} />
                                    </a>
                                    <a href="https://www.instagram.com/athul_muralidharan_?igsh=MW9haDB2M25tMm52Mw==" className="group flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-2xl border border-[#ccff00]/40 text-[#ccff00] transition-all duration-500 hover:bg-[#ccff00] hover:text-black active:scale-90 hover:scale-110 hover:-rotate-6">
                                        <InstagramIcon size={22} />
                                    </a>
                                    <a href="tel:+917736720936" className="group flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-2xl border border-[#ccff00]/40 text-[#ccff00] transition-all duration-500 hover:bg-[#ccff00] hover:text-black active:scale-90 hover:scale-110 hover:-rotate-6">
                                        <Phone size={22} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Manifesto Section */}
            <section id="about" className="py-24 md:py-40 px-6 md:px-8 relative overflow-hidden bg-black text-white font-bold">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center opacity-[0.02] select-none pointer-events-none">
                    <span className="text-[30vw] font-black tracking-tighter italic uppercase leading-none block">MANIFESTO</span>
                </div>

                <div className="max-w-4xl mx-auto relative z-10">
                    <div className="flex flex-col items-start gap-12 md:gap-20">
                        <div className="relative pl-6 md:pl-10 border-l border-[#ccff00]/40">
                            <span className="text-[10px] font-black tracking-[0.6em] uppercase text-[#ccff00] block mb-4">Vision 01</span>
                            <h2 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.8] font-bold">
                                Fitness, <br/>
                                <span className="text-transparent stroke-text" style={{ WebkitTextStroke: '1px white' }}>Redefined.</span>
                            </h2>
                        </div>

                        <div className="group relative w-full p-8 md:p-12 bg-white/5 border border-white/10 rounded-[32px] overflow-hidden backdrop-blur-xl transition-all duration-700 hover:border-[#ccff00]/30">
                            <div className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#ccff00]/20 to-transparent scan-line"></div>
                            <p className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter leading-tight mb-8">
                                AjxFitClub is a <span className="text-[#ccff00]">club without walls</span>. We believe elite fitness shouldn't require a commute.
                            </p>
                            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                                <div className="w-12 h-[1px] bg-white/20"></div>
                                <p className="text-sm md:text-base text-white/50 font-bold tracking-wide leading-relaxed max-w-xl uppercase italic">
                                    We deliver high-end coaching and meaningful human connection directly to your doorstep.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <footer id="experience" className="relative pt-32 pb-20 px-8 bg-black overflow-hidden border-t border-white/5 text-white font-bold">
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-24">
                        <span className="text-[10px] font-black tracking-[0.6em] uppercase text-[#ccff00] block mb-8 font-black tracking-widest text-white">Authorized Access Only</span>
                        <h2 className="text-[12vw] lg:text-[10vw] font-black tracking-tighter italic uppercase leading-[0.8] mb-16 opacity-90 transition-all hover:opacity-100 duration-700 font-bold">
                            JOIN THE <br/>
                            <span className="text-[#ccff00]">COLLECTIVE.</span>
                        </h2>

                        <div className="max-w-2xl mx-auto group relative p-[1px] bg-gradient-to-b from-white/10 to-transparent rounded-[48px] overflow-hidden transition-all duration-700 hover:from-[#ccff00]/40">
                            <div className="relative p-10 md:p-16 h-full flex flex-col items-center justify-center border border-white/5 rounded-[47px] bg-neutral-900/40 backdrop-blur-3xl overflow-hidden">
                                <div className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#ccff00]/20 to-transparent scan-line opacity-40"></div>

                                <ShieldCheck size={48} className="text-[#ccff00] mb-8 opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />

                                <h3 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter mb-4 text-white">The AJX Terminal</h3>
                                <p className="text-white/40 text-[11px] md:text-xs uppercase font-bold tracking-widest leading-relaxed mb-10 max-w-sm mx-auto">
                                    One portal for all members. Access your training protocols, track your biometrics, or start your recruitment process.
                                </p>

                                <Link to="/signup" className="w-full max-w-xs">
                                    <button className="group/btn w-full py-5 bg-white text-black font-black uppercase tracking-[0.4em] text-[11px] rounded-2xl hover:bg-[#ccff00] active:scale-95 transition-all duration-500 shadow-2xl flex items-center justify-center gap-3">
                                        <span>ENTER THE PORTAL</span>
                                        <ArrowRight size={16} className="group-hover/btn:translate-x-2 transition-transform" />
                                    </button>
                                </Link>
                            </div>
                        </div>

                        <p className="mt-16 text-white/30 font-medium tracking-[0.3em] text-[10px] uppercase italic">Secure Handshake Protocol • Encrypted Member Entry</p>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center gap-12 pt-16 border-t border-white/5 uppercase relative">
                        <div className="flex-1 md:flex-none flex justify-center md:justify-start">
                            <BrandLogo onClick={scrollToTop} />
                        </div>
                        <div className="flex gap-10">
                            <a href="https://www.instagram.com/ajxfitclub?igsh=MXVpaGVzbWpnbzhkaw==" className="p-3 rounded-full border border-white/5 hover:border-[#ccff00] hover:text-[#ccff00] transition-all">
                                <InstagramIcon size={18} />
                            </a>
                            <a href="https://wa.me/917736720936" className="p-3 rounded-full border border-white/5 hover:border-[#ccff00] hover:text-[#ccff00] transition-all">
                                <MessageCircle size={18} />
                            </a>
                        </div>
                        <div className="text-[10px] font-bold tracking-[0.3em] uppercase text-center md:text-right font-mono">
                            <span className="opacity-30">© 2024 AJXFITCLUB LLP • All Rights Reserved</span><br/>
                            <span className="opacity-30">Designed for Elite Performance</span><br/>
                            <span className="opacity-80">Website created and managed by</span> <span className="text-[#ccff00] opacity-100 font-black">Njx</span>
                        </div>
                    </div>
                </div>
            </footer>

            {mobileMenuOpen && (
                <div className="fixed inset-0 z-[1000] bg-black/98 backdrop-blur-3xl p-8 flex flex-col justify-between animate-in slide-in-from-right duration-500 overflow-hidden font-bold">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] rotate-12 opacity-[0.03] select-none pointer-events-none text-[80vw] font-black italic font-bold">
                        AJX
                    </div>
                    <div className="relative z-10 flex items-center justify-between">
                        <MobileMenuToggle isOpen={true} onClick={() => setMobileMenuOpen(false)} side="left" />
                        <div className="flex justify-center flex-1">
                            <BrandLogo onClick={scrollToTop} />
                        </div>
                        <MobileMenuToggle isOpen={true} onClick={() => setMobileMenuOpen(false)} side="right" />
                    </div>

                    <div className="relative z-10 grid grid-cols-2 gap-4 py-12">
                        {[
                            { label: 'About', href: '#about', id: '01', sub: 'Core Identity' },
                            { label: 'Pillars', href: '#pillars', id: '02', sub: 'Tactical Edge' },
                            { label: 'Plans', href: '#plans', id: '03', sub: 'Access Tiers' },
                            { label: 'Connect', href: '#experience', id: '04', sub: 'Terminal' }
                        ].map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="group relative flex flex-col items-start p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl active:bg-[#ccff00]/10 transition-all duration-300"
                            >
                                <span className="text-[10px] font-black tracking-widest text-[#ccff00] mb-2">{item.id}</span>
                                <span className="text-3xl font-black italic uppercase tracking-tighter group-active:text-[#ccff00] transition-colors">{item.label}</span>
                                <span className="text-[7px] font-bold uppercase tracking-[0.3em] opacity-40 mt-1">{item.sub}</span>
                            </a>
                        ))}
                    </div>

                    <div className="relative z-10 flex flex-col gap-8 items-center border-t border-white/10 pt-12">
                        <div className="flex gap-12">
                            <a href="https://wa.me/917736720936" className="text-white hover:text-[#ccff00] transition-all"><MessageCircle size={28} /></a>
                            <a href="https://www.instagram.com/ajxfitclub?igsh=MXVpaGVzbWpnbzhkaw==" className="text-white hover:text-[#ccff00] transition-all"><InstagramIcon size={28} /></a>
                            <a href="tel:+917736720936" className="text-white hover:text-[#ccff00] transition-all"><Phone size={28} /></a>
                        </div>
                        <div className="text-[8px] font-black tracking-[0.6em] uppercase text-white/30 italic">
                            Fitness Redefined
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LandingPage;