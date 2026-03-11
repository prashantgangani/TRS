import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
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

    return (
        <section className="relative w-full min-h-[100svh] bg-[#050505] overflow-hidden flex flex-col lg:flex-row items-center pt-20 lg:pt-0">
            
            {/* --- Background Atmosphere --- */}
            {/* Base dark gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#020202] via-[#050505] to-[#010101] -z-20"></div>
            
            {/* Abstract Neon Glows behind the scene */}
            <div className="absolute top-[20%] right-[10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-neon-purple/10 blur-[120px] rounded-full pointer-events-none -z-10 translate-x-1/2 -translate-y-1/2 opacity-70"></div>
            <div className="absolute bottom-[-10%] right-[30%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-electric-blue/10 blur-[100px] rounded-full pointer-events-none -z-10 translate-x-1/2 opacity-70"></div>
            
            {/* Subtle grain overlay (optional, achieved via pseudo-element or small tiled png if available. Using CSS radial here for depth) */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] opacity-20 pointer-events-none"></div>


            {/* --- Left Side: Content --- */}
            <div className="w-full lg:w-[45%] lg:min-h-[100svh] flex flex-col justify-center px-6 sm:px-12 lg:pl-16 xl:pl-24 pt-10 pb-16 lg:py-0 z-20 relative shrink-0">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-2xl"
                >
                    {/* Small Tags */}
                    <motion.div variants={itemVariants} className="flex gap-2 sm:gap-3 mb-6 sm:mb-8 flex-wrap">
                        <span className="glassmorphism px-3 py-1.5 rounded-sm text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-white/90 border border-white/10 shadow-sm">
                            Night Drives
                        </span>
                        <span className="glassmorphism px-3 py-1.5 rounded-sm text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-neon-purple border border-neon-purple/30 shadow-[0_0_10px_rgba(176,38,255,0.15)] relative overflow-hidden group">
                            <span className="absolute inset-0 bg-neon-purple/10 w-full h-full"></span>
                            Themed Meets
                        </span>
                        <span className="glassmorphism px-3 py-1.5 rounded-sm text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-electric-blue border border-electric-blue/30 shadow-[0_0_10px_rgba(0,229,255,0.15)] relative overflow-hidden">
                            <span className="absolute inset-0 bg-electric-blue/10 w-full h-full"></span>
                            GTA Online
                        </span>
                    </motion.div>

                    {/* Main Heading */}
                    <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold font-heading leading-[1.1] mb-6 drop-shadow-2xl text-white">
                        Where Los Santos <br className="hidden sm:block"/>
                        Car Culture <br className="hidden lg:block"/>
                        <span className="relative inline-block mt-1 sm:mt-2">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-electric-blue relative z-10">
                                Comes Alive
                            </span>
                            {/* Text glow behind */}
                            <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-electric-blue blur-[12px] opacity-60 pointer-events-none mix-blend-screen">Comes Alive</span>
                        </span>
                    </motion.h1>

                    {/* Description */}
                    <motion.p variants={itemVariants} className="text-base sm:text-lg lg:text-xl text-white/70 max-w-xl mb-10 leading-relaxed font-light drop-shadow-md">
                        A premium GTA Online crew website for themed car meets, event announcements, featured builds, and community showcases.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 sm:gap-5">
                        <button className="px-6 md:px-8 py-4 bg-white text-deep-black font-bold uppercase tracking-widest text-xs md:text-sm rounded-sm transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-[1.02] active:scale-[0.98] duration-300 relative overflow-hidden group">
                            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-shimmer skew-x-12"></span>
                            <span className="relative z-10">View Upcoming Meets</span>
                        </button>
                        
                        <button className="px-6 md:px-8 py-4 glass-panel border border-white/10 text-white font-bold uppercase tracking-widest text-xs md:text-sm rounded-sm hover:border-white/40 transition-all hover:bg-white/5 group relative overflow-hidden">
                            <span className="relative z-10 flex items-center justify-center">
                                Explore the Crew
                                <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
                            </span>
                        </button>
                    </motion.div>
                </motion.div>
            </div>


            {/* --- Right Side: 2D Car Lineup Showcase --- */}
            <div className="w-full lg:w-[55%] h-[50vh] sm:h-[60vh] lg:h-[100svh] relative z-10 flex items-center justify-center mt-8 lg:mt-0 xl:pr-12">
                
                {/* Showcase Container - maintains aspect ratio and holds the composition */}
                <div className="relative w-full max-w-[800px] aspect-[4/3] sm:aspect-[16/9] lg:aspect-square xl:aspect-[4/3] flex items-center justify-center">
                    
                    {/* Floating Particles (CSS only) */}
                    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-50">
                        {/* We use basic CSS animations for floating dust specs */}
                        {[...Array(12)].map((_, i) => (
                            <div 
                                key={i}
                                className="absolute rounded-full bg-white transition-opacity duration-1000 animate-float-slow"
                                style={{
                                    width: Math.random() * 3 + 1 + 'px',
                                    height: Math.random() * 3 + 1 + 'px',
                                    left: Math.random() * 100 + '%',
                                    top: Math.random() * 100 + '%',
                                    animationDelay: `${Math.random() * 5}s`,
                                    animationDuration: `${Math.random() * 10 + 10}s`,
                                    opacity: Math.random() * 0.5 + 0.1,
                                    boxShadow: Math.random() > 0.5 ? '0 0 8px 1px #b026ff' : '0 0 8px 1px #00e5ff'
                                }}
                            />
                        ))}
                    </div>

                    {/* Left Supporting Car */}
                    <motion.div 
                        custom={1}
                        variants={carVariants}
                        initial="hidden"
                        animate="visible"
                        className="absolute left-[5%] top-[25%] w-[45%] z-10 drop-shadow-2xl"
                    >
                        {/* Underglow Reflection */}
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[80%] h-8 bg-electric-blue/40 blur-xl rounded-full"></div>
                        {/* Placeholder image struct - will use realistic Unsplash/styled images */}
                        <div className="relative w-full aspect-[16/9] bg-gradient-to-br from-gray-800 to-black rounded-lg shadow-2xl border border-white/5 overflow-hidden group">
                            <img src="https://images.unsplash.com/photo-1627454819213-f938a16dbd78?auto=format&fit=crop&q=80&w=800" alt="Tuner Car Left" className="w-full h-full object-cover object-center mix-blend-luminosity opacity-80 group-hover:opacity-100 transition-opacity duration-700" />
                            {/* Blue lighting tint */}
                            <div className="absolute inset-0 bg-electric-blue/20 mix-blend-overlay"></div>
                        </div>
                    </motion.div>

                    {/* Right Supporting Car */}
                    <motion.div 
                        custom={2}
                        variants={carVariants}
                        initial="hidden"
                        animate="visible"
                        className="absolute right-[5%] top-[20%] w-[42%] z-10 drop-shadow-2xl"
                    >
                         {/* Underglow Reflection */}
                         <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[80%] h-8 bg-neon-purple/30 blur-xl rounded-full"></div>
                        <div className="relative w-full aspect-[16/9] bg-gradient-to-bl from-gray-800 to-black rounded-lg shadow-2xl border border-white/5 overflow-hidden group">
                            <img src="https://images.unsplash.com/photo-1596489394602-0e427ed4caeb?auto=format&fit=crop&q=80&w=800" alt="Tuner Car Right" className="w-full h-full object-cover object-center mix-blend-luminosity opacity-80 group-hover:opacity-100 transition-opacity duration-700 scale-x-[-1]" />
                             {/* Purple lighting tint */}
                             <div className="absolute inset-0 bg-neon-purple/20 mix-blend-overlay"></div>
                        </div>
                    </motion.div>

                    {/* Center Main Car */}
                    <motion.div 
                        custom={0}
                        variants={carVariants}
                        initial="hidden"
                        animate="visible"
                        className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 w-[65%] sm:w-[55%] z-30 drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
                    >
                         {/* Underglow Reflection for Main Car (Stronger) */}
                         <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[90%] h-12 bg-gradient-to-r from-neon-purple/50 via-electric-blue/40 to-neon-purple/50 blur-2xl rounded-full"></div>
                        
                         {/* Continuous floating animation wrapper */}
                         <motion.div
                            animate={{ y: [-5, 5, -5] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="relative w-full aspect-[16/10] bg-gradient-to-b from-gray-700 to-black rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden"
                         >
                            <img src="https://images.unsplash.com/photo-1611821064430-0d40220e4b98?auto=format&fit=crop&q=80&w=1200" alt="Hero Featured Car" className="w-full h-full object-cover object-center saturate-150 contrast-125" />
                            
                            {/* Cinematic Lighting Overlays */}
                            {/* Top Reflection */}
                            <div className="absolute top-0 inset-x-0 h-1/3 bg-gradient-to-b from-white/20 to-transparent mix-blend-overlay pointer-events-none"></div>
                            {/* Bottom Shadow */}
                            <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-[#020202] to-transparent pointer-events-none"></div>
                            {/* Side glowing glints */}
                            <div className="absolute top-1/2 left-0 w-1/4 h-full -translate-y-1/2 bg-gradient-to-r from-neon-purple/40 to-transparent mix-blend-soft-light pointer-events-none"></div>
                            <div className="absolute top-1/2 right-0 w-1/4 h-full -translate-y-1/2 bg-gradient-to-l from-electric-blue/40 to-transparent mix-blend-soft-light pointer-events-none"></div>
                         </motion.div>

                         {/* Foreground mist crossing over the car base */}
                         <div className="absolute bottom-[-10%] inset-x-[-20%] h-24 bg-gradient-to-t from-[#020202] via-[#020202]/80 to-transparent blur-md z-40 pointer-events-none"></div>
                    </motion.div>

                </div>
            </div>


        </section>
    );
};

export default Hero;
