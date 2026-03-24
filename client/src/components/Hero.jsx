import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, X, Save } from 'lucide-react';
import { API_URL } from '../config';
import OptimizedImage from './OptimizedImage';

const Hero = ({ isAdmin }) => {
    const [heroData, setHeroData] = useState({
        tonightsMeetTitle: 'Weekly Showcase',
        tonightsMeetLocation: 'Los Santos Custom',
        tonightsMeetTime: '8:00 PM',
        atmosphereImage: '/leftside.jpg',
        meetImage: '/rightside.png',
        featuredBuildImage: 'https://images.unsplash.com/photo-1611821064430-0d40220e4b98?auto=format&fit=crop&q=80&w=1000',
        featuredBuildName: 'Tornado',
        featuredBuildOwner: 'JOYBOY'
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState(heroData);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchHeroData = async () => {
            try {
                const res = await fetch(`${API_URL}/hero`);
                const data = await res.json();
                if (data && data._id) {
                    setHeroData(data);
                    setEditForm(data);
                }
            } catch (error) {
                console.error("Failed to load hero data", error);
            }
        };
        fetchHeroData();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await fetch(`${API_URL}/hero`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm)
            });
            const data = await res.json();
            if (res.ok) {
                setHeroData(data);
                setIsEditing(false);
                alert("Hero section updated successfully!");
            } else {
                alert(`Error: ${data.message || 'Failed to update'}`);
            }
        } catch (error) {
            console.error("Failed to update hero data", error);
            alert("Network error. Please make sure the server is running.");
        } finally {
            setIsSaving(false);
        }
    };
    // Stagger text animations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    // Stagger car animations for the lineup
    const carVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: (custom) => ({
            opacity: 1,
            scale: 1,
            transition: { duration: 1.2, ease: "easeOut", delay: custom * 0.2 + 0.6 }
        })
    };

    // New Parallax hover effect for the entire right side composition
    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const x = (clientX / window.innerWidth - 0.5) * 20; // Max 20px movement
        const y = (clientY / window.innerHeight - 0.5) * 20;

        const collage = document.getElementById('hero-collage');
        if (collage) {
            collage.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg)`;
        }
    };

    return (
        <section className="relative w-full min-h-[100svh] bg-[#050505] overflow-hidden flex flex-col lg:flex-row items-center pt-20 lg:pt-0">

            {/* --- Background Atmosphere --- */}
            {/* Base dark gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#020202] via-[#050505] to-[#010101] -z-20"></div>

            {/* Background Grid Pattern (Technical Vibe) */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] opacity-30 pointer-events-none -z-20 mask-image-radial-center"></div>

            {/* Ambient Neon Glows behind the scene */}
            <div className="absolute top-[20%] right-[10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-neon-purple/15 blur-[120px] rounded-full pointer-events-none -z-10 translate-x-1/2 -translate-y-1/2 opacity-70"></div>
            <div className="absolute bottom-[-10%] right-[30%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-electric-blue/15 blur-[100px] rounded-full pointer-events-none -z-10 translate-x-1/2 opacity-70"></div>

            {/* subtle Vignette */}
            <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.9)] pointer-events-none -z-10"></div>

            {/* Giant Faded Background Monogram */}
            <div className="absolute top-1/2 left-[60%] -translate-x-1/2 -translate-y-1/2 text-[40vw] font-black font-heading text-white/[0.02] pointer-events-none select-none z-0">
                TRS
            </div>


            {/* --- Left Side: Content --- */}
            <div className="w-full lg:w-[45%] lg:min-h-[100svh] flex flex-col justify-center px-6 sm:px-12 lg:pl-16 xl:pl-24 pt-10 pb-16 lg:py-0 z-20 relative shrink-0">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-2xl"
                >
                    <motion.div variants={itemVariants} className="flex gap-2 sm:gap-3 mb-6 sm:mb-8 flex-wrap items-center">
                        <div className="flex items-center gap-2 pr-4 border-r border-white/20">
                            <span className="w-2 h-2 rounded-full bg-neon-purple animate-pulse shadow-[0_0_10px_#b026ff]"></span>
                            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white/50">Elite Night Drive Society</span>
                        </div>
                        <span className="glassmorphism px-3 py-1.5 rounded-sm text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-white/90 border border-white/10 shadow-sm">
                            Los Santos Meet Division
                        </span>
                    </motion.div>

                    {/* Main Heading */}
                    <motion.div variants={itemVariants} className="relative mb-6">
                        <div className="absolute -left-6 top-2 bottom-2 w-1 bg-gradient-to-b from-neon-purple via-electric-blue to-transparent hidden sm:block rounded-full shadow-[0_0_15px_rgba(0,229,255,0.5)]"></div>
                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold font-heading leading-[1.1] drop-shadow-2xl text-white tracking-tight">
                            Where Los Santos <br className="hidden sm:block" />
                            Car Culture <br className="hidden lg:block" />
                            <span className="relative inline-block mt-1 sm:mt-2">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-electric-blue relative z-10 animate-gradient-x bg-[length:200%_auto]">
                                    Comes Alive
                                </span>
                                {/* Text glow behind */}
                                <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-electric-blue blur-[20px] opacity-80 pointer-events-none mix-blend-screen animate-pulse-slow">Comes Alive</span>
                            </span>
                        </h1>
                    </motion.div>

                    {/* Description */}
                    <motion.p variants={itemVariants} className="text-base sm:text-lg lg:text-xl text-white/70 max-w-xl mb-10 leading-relaxed font-light drop-shadow-md">
                        The premium destination for curated meets, high-end builds, and an uncompromising racing community. Not just a crew. An aesthetic.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center">
                        <div className="w-full sm:w-auto flex flex-col items-center sm:items-start gap-2">
                            <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Current Operations</span>
                            <button className="w-full sm:w-auto px-6 md:px-10 py-4 bg-gradient-to-tr from-white to-gray-200 text-deep-black font-extrabold uppercase tracking-widest text-xs md:text-sm rounded-sm transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.6)] hover:-translate-y-1 active:scale-[0.98] duration-300 relative overflow-hidden group">
                                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full group-hover:animate-shimmer skew-x-12 opacity-50"></span>
                                <span className="relative z-10">Upcoming Meets</span>
                            </button>
                        </div>

                        <div className="w-full sm:w-auto flex flex-col items-center sm:items-start gap-2">
                            <span className="text-[10px] uppercase tracking-widest text-electric-blue/60 font-bold ml-1">Network Access</span>
                            <button className="w-full sm:w-auto px-6 md:px-10 py-4 glass-panel border border-white/10 text-white font-bold uppercase tracking-widest text-xs md:text-sm rounded-sm hover:border-neon-purple/50 transition-all hover:bg-neon-purple/10 group relative overflow-hidden">
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    Explore the Crew
                                    <span className="inline-block group-hover:translate-x-2 transition-transform text-neon-purple">→</span>
                                </span>
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            </div>


            {/* --- Right Side: Cinematic Interactive Showcase --- */}
            <div
                className="w-full lg:w-[55%] h-[60vh] sm:h-[70vh] lg:h-[100svh] relative z-10 flex items-center justify-center mt-8 lg:mt-0 lg:pr-12 perspective-1000"
                onMouseMove={handleMouseMove}
                onMouseLeave={(e) => {
                    const collage = document.getElementById('hero-collage');
                    if (collage) collage.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg)`;
                }}
            >
                {/* 3D Container */}
                <div id="hero-collage" className="relative w-full max-w-[850px] aspect-square sm:aspect-video lg:aspect-auto lg:h-[70%] flex items-center justify-center transition-transform duration-700 ease-out preserve-3d">

                    {/* Floor Reflection Effect */}
                    <div className="absolute -bottom-[20%] w-[120%] h-32 bg-white/[0.02] blur-2xl rounded-[100%] pointer-events-none transform rotate-x-60"></div>

                    {/* Floating Particles (CSS only) */}
                    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none transform translate-z-[-50px]">
                        {[...Array(15)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute rounded-full bg-white transition-opacity duration-1000 animate-float-slow"
                                style={{
                                    width: Math.random() * 4 + 1 + 'px',
                                    height: Math.random() * 4 + 1 + 'px',
                                    left: Math.random() * 100 + '%',
                                    top: Math.random() * 100 + '%',
                                    animationDelay: `${Math.random() * 5}s`,
                                    animationDuration: `${Math.random() * 10 + 10}s`,
                                    opacity: Math.random() * 0.4 + 0.1,
                                    boxShadow: Math.random() > 0.5 ? '0 0 12px 2px rgba(176,38,255,0.6)' : '0 0 12px 2px rgba(0,229,255,0.6)'
                                }}
                            />
                        ))}
                    </div>

                    {/* Card 1: Back Left (Atmosphere/Secondary) */}
                    <motion.div
                        custom={1}
                        variants={carVariants}
                        initial="hidden"
                        animate="visible"
                        className="absolute left-[0%] top-[15%] w-[45%] lg:w-[48%] z-10 group transform transition-all duration-500 hover:-translate-y-4 hover:translate-z-10"
                        style={{ transform: 'translateZ(-40px)' }}
                    >
                        <div className="absolute -inset-2 bg-gradient-to-r from-electric-blue/40 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative w-full aspect-[4/3] bg-black rounded-lg shadow-[0_20px_40px_rgba(0,0,0,0.8)] border border-white/5 overflow-hidden">
                            <img src="/leftside.jpg" alt="Night Drive Atmosphere" className="w-full h-full object-cover object-center mix-blend-luminosity opacity-40 group-hover:opacity-100 group-hover:mix-blend-normal transition-all duration-700 blur-[2px] group-hover:blur-0" />


                        </div>
                    </motion.div>

                    {/* Card 2: Top Right (Meet/Secondary) */}
                    <motion.div
                        custom={2}
                        variants={carVariants}
                        initial="hidden"
                        animate="visible"
                        className="absolute right-[5%] top-[5%] w-[40%] lg:w-[42%] z-20 group transform transition-all duration-500 hover:-translate-y-4 hover:translate-z-20"
                        style={{ transform: 'translateZ(-20px)' }}
                    >
                        <div className="absolute -inset-2 bg-gradient-to-l from-neon-purple/40 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative w-full aspect-square sm:aspect-[4/3] bg-black rounded-lg shadow-[0_20px_40px_rgba(0,0,0,0.8)] border border-white/5 overflow-hidden">
                            <img src="/rightside.png" alt="Meet Scene" className="w-full h-full object-cover object-center mix-blend-luminosity opacity-50 group-hover:opacity-100 group-hover:mix-blend-normal transition-all duration-700 blur-[1px] group-hover:blur-0 scale-x-[-1]" />


                        </div>
                    </motion.div>

                    {/* Card 3: Center Featured Profile (Dominant) */}
                    <motion.div
                        custom={0}
                        variants={carVariants}
                        initial="hidden"
                        animate="visible"
                        className="absolute right-[10%] lg:right-[15%] bottom-[5%] lg:bottom-[10%] w-[65%] lg:w-[60%] z-40 group transform transition-all duration-500 hover:-translate-y-2 hover:translate-z-40"
                        style={{ transform: 'translateZ(20px)' }}
                    >
                        {/* Dynamic Core Shadow/Underglow */}
                        <div className="absolute -inset-3 bg-gradient-to-br from-neon-purple rounded-xl opacity-30 blur-2xl group-hover:opacity-70 group-hover:blur-3xl transition-all duration-700"></div>

                        <div className="relative w-full aspect-[4/5] sm:aspect-square bg-[#0a0a0a] rounded-xl shadow-[0_30px_60px_rgba(0,0,0,0.9)] border border-white/20 group-hover:border-white/40 overflow-hidden">
                            <OptimizedImage src={heroData.featuredBuildImage} variant="hero" loading="eager" alt="Featured Build" className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-[1.5s] ease-out saturate-150 contrast-125 bg-black" />

                            {/* Glass tint overlay */}
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700"></div>

                            {/* Glossy top reflection */}
                            <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent mix-blend-overlay pointer-events-none"></div>

                            {/* Info Plate Overlay */}
                            <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 bg-gradient-to-t from-black via-black/80 to-transparent translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                <div className="inline-block px-2 py-1 bg-white/10 backdrop-blur-md rounded border border-white/20 mb-2">
                                    <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-white">Car of the Week</span>
                                </div>
                                <h3 className="text-xl sm:text-2xl font-black font-heading tracking-tight drop-shadow-lg text-white group-hover:text-glow transition-all">{heroData.featuredBuildName}</h3>
                                <p className="text-xs sm:text-sm text-white/50 font-bold tracking-widest uppercase mt-1">Owner: {heroData.featuredBuildOwner}</p>
                            </div>

                            {/* Interactive Scanline Sheen */}
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-transparent via-white/10 to-transparent -translate-y-full group-hover:animate-scanline pointer-events-none"></div>
                        </div>

                        {/* Floating Micro-Panel: Top Left "Tonight's Theme" attached to featured card */}
                        <div className="absolute -left-8 sm:-left-12 -top-6 sm:-top-8 glass-panel border border-neon-purple/30 p-3 rounded-lg shadow-2xl backdrop-blur-xl z-50 transform translate-z-20 scale-90 sm:scale-100 group-hover:-translate-y-1 transition-transform duration-500 delay-100">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 rounded-full bg-neon-red animate-pulse"></div>
                                <span className="text-[9px] uppercase tracking-widest font-bold text-white/60">Live Radar</span>
                            </div>
                            <h4 className="text-xs font-bold text-white tracking-widest uppercase mb-0.5">This Week's Meet</h4>
                            <p className="text-neon-purple text-sm font-black font-heading tracking-tight drop-shadow-[0_0_5px_rgba(176,38,255,0.5)]">{heroData.tonightsMeetTitle}</p>
                            <p className="text-[10px] text-white/40 mt-1">{heroData.tonightsMeetLocation} • {heroData.tonightsMeetTime}</p>
                        </div>
                    </motion.div>

                    {/* Lower Status Strip Component */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5, duration: 1 }}
                        className="absolute bottom-[-15%] sm:bottom-[-10%] lg:bottom-4 left-1/2 -translate-x-1/2 w-[90%] sm:w-auto glass-panel border border-white/10 bg-black/40 backdrop-blur-xl rounded-full py-2 sm:py-3 px-6 sm:px-8 flex items-center justify-between sm:justify-center gap-4 sm:gap-8 z-50 isolate"
                    >
                        <div className="flex flex-col items-center">
                            <span className="text-sm sm:text-base font-black text-white">42</span>
                            <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-white/40 whitespace-nowrap">Active Crew</span>
                        </div>
                        <div className="w-[1px] h-6 sm:h-8 bg-white/10"></div>
                        <div className="flex flex-col items-center">
                            <span className="text-sm sm:text-base font-black text-electric-blue">8</span>
                            <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-white/40 whitespace-nowrap">Meets Scheduled</span>
                        </div>
                        <div className="w-[1px] h-6 sm:h-8 bg-white/10"></div>
                        <div className="flex flex-col items-center">
                            <span className="text-sm sm:text-base font-black text-neon-purple">126</span>
                            <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-white/40 whitespace-nowrap">Featured Builds</span>
                        </div>
                    </motion.div>

                </div>
            </div>


            {/* Bottom Floating Scroll Cue */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-4 md:bottom-6 left-1/2 lg:left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3 pointer-events-none"
            >
                <div className="text-[10px] sm:text-xs uppercase tracking-widest font-bold text-white/50 drop-shadow-md">Enter the Garage</div>
                <div className="w-[2px] h-8 md:h-12 relative overflow-hidden bg-white/10 rounded-full">
                    <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-white to-transparent animate-scanline"></div>
                </div>
            </motion.div>

            {/* --- Admin Edit Controls --- */}
            {isAdmin && (
                <div className="absolute top-28 right-6 z-[100]">
                    <button
                        onClick={() => {
                            console.log("Edit button clicked, current heroData:", heroData);
                            setEditForm(heroData);
                            setIsEditing(true);
                        }}
                        className="bg-neon-purple p-3 rounded-full shadow-[0_0_20px_rgba(176,38,255,0.6)] hover:scale-110 active:scale-95 transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest px-5 border border-white/20"
                    >
                        <Edit2 size={14} /> Admin: Edit Hero
                    </button>
                </div>
            )}

            {/* --- Edit Modal --- */}
            <AnimatePresence>
                {isEditing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="glass-panel w-full max-w-2xl p-8 rounded-lg border border-white/20 relative max-h-[90vh] overflow-y-auto"
                        >
                            <button
                                onClick={() => setIsEditing(false)}
                                className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>

                            <h2 className="text-2xl font-black font-heading tracking-tight mb-8 text-glow">
                                Dispatch Console: <span className="text-neon-purple font-black">Hero Update</span>
                            </h2>

                            <form onSubmit={handleSave} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* This Week's Meet Info */}
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-neon-purple border-b border-white/10 pb-2">Meet Radar</h3>
                                        <div>
                                            <label className="block text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2">Meet Theme</label>
                                            <input
                                                type="text"
                                                value={editForm.tonightsMeetTitle}
                                                onChange={(e) => setEditForm({ ...editForm, tonightsMeetTitle: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-sm p-3 text-sm focus:border-neon-purple outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2">Location</label>
                                            <input
                                                type="text"
                                                value={editForm.tonightsMeetLocation}
                                                onChange={(e) => setEditForm({ ...editForm, tonightsMeetLocation: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-sm p-3 text-sm focus:border-neon-purple outline-none"
                                                placeholder="e.g. Vinewood Hills"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2">Time</label>
                                            <input
                                                type="text"
                                                value={editForm.tonightsMeetTime}
                                                onChange={(e) => setEditForm({ ...editForm, tonightsMeetTime: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-sm p-3 text-sm focus:border-neon-purple outline-none"
                                                placeholder="e.g. 10:30 PM"
                                            />
                                        </div>
                                    </div>

                                    {/* Featured Build Info */}
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-electric-blue border-b border-white/10 pb-2">Featured Showcase</h3>
                                        <div>
                                            <label className="block text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2">Build Name</label>
                                            <input
                                                type="text"
                                                value={editForm.featuredBuildName}
                                                onChange={(e) => setEditForm({ ...editForm, featuredBuildName: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-sm p-3 text-sm focus:border-electric-blue outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2">Owner Name</label>
                                            <input
                                                type="text"
                                                value={editForm.featuredBuildOwner}
                                                onChange={(e) => setEditForm({ ...editForm, featuredBuildOwner: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-sm p-3 text-sm focus:border-electric-blue outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Asset Logic */}
                                <div className="space-y-4 mt-8 pt-4 border-t border-white/10">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-white/60">Asset Dispatch (URLs)</h3>
                                    <div>
                                        <label className="block text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2">Featured Build Image (Center Card)</label>
                                        <input
                                            type="text"
                                            value={editForm.featuredBuildImage}
                                            onChange={(e) => setEditForm({ ...editForm, featuredBuildImage: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-sm p-3 text-sm focus:border-white/40 outline-none"
                                            placeholder="Paste Image URL here..."
                                        />
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="w-full py-4 bg-white text-deep-black font-black uppercase tracking-widest text-sm rounded-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.2)] disabled:opacity-50"
                                    >
                                        {isSaving ? (
                                            <span className="animate-pulse">Saving Updates...</span>
                                        ) : (
                                            <>
                                                <Save size={18} /> Update Hero Content
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default Hero;
