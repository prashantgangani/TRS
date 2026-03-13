import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Database, Grid, RefreshCw, Zap } from 'lucide-react';

const FeaturedCars = () => {
    // Subtle float animation for right-side visual elements
    const floatAnim = {
        animate: (i) => ({
            y: [0, -10, 0],
            transition: {
                duration: 4 + i,
                repeat: Infinity,
                ease: "easeInOut",
            },
        }),
    };

    return (
        <section id="garage" className="py-32 bg-deep-black border-y border-white/5 relative overflow-hidden">
            {/* Cinematic Background */}
            <div className="absolute top-1/2 left-3/4 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-electric-blue/5 rounded-full blur-[150px] mix-blend-screen pointer-events-none animate-pulse-slow"></div>
            <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-neon-purple/5 rounded-full blur-[120px] mix-blend-screen pointer-events-none animate-pulse-slower"></div>
            
            {/* Grid & Technical Overlay */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none"></div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                    
                    {/* Left Side: Text Content */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="w-full lg:w-1/2 flex flex-col items-start"
                    >
                        {/* Premium Mini Label */}
                        <div className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 border border-white/10 rounded-sm bg-white/5 backdrop-blur-md shadow-[0_0_10px_rgba(0,229,255,0.1)]">
                            <Zap size={14} className="text-electric-blue" />
                            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-white/80">
                                Crew Collection
                            </span>
                        </div>

                        {/* Title */}
                        <div className="relative pl-6 mb-8">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-electric-blue to-neon-purple" />
                            <h2 className="text-5xl md:text-7xl font-black tracking-tighter font-heading uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/50 drop-shadow-lg mb-4">
                                The <span className="text-electric-blue drop-shadow-[0_0_15px_rgba(0,229,255,0.6)] text-glow-blue block sm:inline">Garage</span>
                            </h2>
                            <p className="text-white/70 text-lg sm:text-xl font-light tracking-wide max-w-md leading-relaxed">
                                A curated collection of standout builds from across The Royal Sorcerers crew — preserved in one evolving showroom.
                            </p>
                        </div>
                        
                        {/* 3-Point Feature Strip */}
                        <div className="flex flex-wrap gap-4 mb-8">
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 rounded-full">
                                <div className="w-1.5 h-1.5 rounded-full bg-electric-blue shadow-[0_0_8px_rgba(0,229,255,0.8)]"></div>
                                <span className="text-xs uppercase tracking-widest text-white/80">Crew Builds</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 rounded-full">
                                <div className="w-1.5 h-1.5 rounded-full bg-neon-purple shadow-[0_0_8px_rgba(188,19,254,0.8)]"></div>
                                <span className="text-xs uppercase tracking-widest text-white/80">Rotating Lineup</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 rounded-full">
                                <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
                                <span className="text-xs uppercase tracking-widest text-white/80">Full Access</span>
                            </div>
                        </div>

                        {/* Mini Garage Stats */}
                        <div className="flex items-center gap-6 sm:gap-10 mb-10 pb-6 border-b border-white/10 w-full max-w-md">
                            <div className="flex flex-col">
                                <span className="text-2xl font-black font-heading tracking-wider text-white">48+</span>
                                <span className="text-[10px] uppercase tracking-widest text-white/40">Builds Archived</span>
                            </div>
                            <div className="w-px h-8 bg-white/10"></div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-black font-heading tracking-wider text-white">12</span>
                                <span className="text-[10px] uppercase tracking-widest text-white/40">Categories</span>
                            </div>
                            <div className="w-px h-8 bg-white/10"></div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-black font-heading tracking-wider text-electric-blue drop-shadow-[0_0_5px_rgba(0,229,255,0.5)]">LIVE</span>
                                <span className="text-[10px] uppercase tracking-widest text-white/40">Updated Weekly</span>
                            </div>
                        </div>
                        
                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
                            <Link 
                                to="/garage" 
                                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-electric-blue to-neon-purple hover:from-electric-blue/90 hover:to-neon-purple/90 text-white min-w-[200px] text-center font-bold uppercase tracking-widest text-sm rounded-sm transition-all shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:shadow-[0_0_30px_rgba(0,229,255,0.6)] group relative overflow-hidden"
                            >
                                <span className="relative z-10">Enter Garage</span>
                                <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-sm"></span>
                            </Link>
                            <Link 
                                to="/showroom" 
                                className="w-full sm:w-auto px-8 py-4 border border-white/20 hover:border-electric-blue/50 text-white/80 hover:text-white hover:bg-white/5 font-bold uppercase tracking-widest text-sm rounded-sm transition-all group text-center min-w-[200px] shadow-[inset_0_0_0_rgba(0,229,255,0)] hover:shadow-[inset_0_0_15px_rgba(0,229,255,0.15)] relative overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    Full Showroom <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                                </span>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Right Side: Creative Abstract Digital Showroom Visual */}
                    <div className="w-full lg:w-1/2 relative h-[500px] sm:h-[600px] flex items-center justify-center group">
                        <div className="relative w-full max-w-[500px] h-full flex items-center justify-center transition-transform duration-700 ease-out group-hover:-translate-y-2">
                            
                            {/* Scanning Ring Background */}
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                                className="absolute w-[350px] h-[350px] sm:w-[450px] sm:h-[450px] rounded-full border border-dashed border-white/10 flex items-center justify-center opacity-50 group-hover:opacity-80 group-hover:border-electric-blue/30 transition-all duration-700 pointer-events-none"
                            >
                                <div className="absolute w-[80%] h-[80%] rounded-full border border-neon-purple/20 border-t-neon-purple/60 shadow-[0_0_20px_rgba(188,19,254,0.1)] blur-[1px]"></div>
                            </motion.div>

                            {/* Main Archive Frame Placeholder */}
                            <motion.div
                                custom={0}
                                variants={floatAnim}
                                animate="animate"
                                className="relative w-[280px] sm:w-[340px] aspect-[4/5] rounded-xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col justify-between overflow-hidden z-20 transition-all duration-500 group-hover:border-electric-blue/40 group-hover:shadow-[0_20px_50px_rgba(0,229,255,0.15)]"
                            >
                                {/* Shimmer Line Effect */}
                                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-electric-blue to-transparent -translate-x-full animate-[shimmer_2.5s_infinite] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                {/* Top Bar UI */}
                                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                                    <div className="flex items-center gap-2">
                                        <Database size={14} className="text-electric-blue" />
                                        <span className="text-[10px] uppercase font-bold tracking-widest text-white/60">System.Archive</span>
                                    </div>
                                    <div className="flex gap-1.5">
                                        <div className="w-2 h-2 rounded-full bg-white/20"></div>
                                        <div className="w-2 h-2 rounded-full bg-white/20"></div>
                                        <div className="w-2 h-2 rounded-full bg-electric-blue shadow-[0_0_5px_rgba(0,229,255,0.5)] animate-pulse"></div>
                                    </div>
                                </div>

                                {/* Center UI Hologram / Grid */}
                                <div className="flex-1 flex flex-col items-center justify-center relative p-6">
                                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,229,255,0.1)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                    <Grid size={48} strokeWidth={1} className="text-white/20 mb-4 group-hover:text-neon-purple/50 transition-colors duration-500" />
                                    <div className="h-px w-16 bg-gradient-to-r from-transparent via-electric-blue/50 to-transparent mb-4"></div>
                                    <p className="text-xs uppercase tracking-[0.3em] font-bold text-white/40 text-center">
                                        Scan Ready<br/>
                                        <span className="text-[9px] text-white/20 mt-1 block">Awaiting Input</span>
                                    </p>
                                    
                                    {/* Corner Brackets */}
                                    <div className="absolute top-6 left-6 w-4 h-4 border-t border-l border-white/20 group-hover:border-electric-blue transition-colors duration-500"></div>
                                    <div className="absolute top-6 right-6 w-4 h-4 border-t border-r border-white/20 group-hover:border-electric-blue transition-colors duration-500"></div>
                                    <div className="absolute bottom-6 left-6 w-4 h-4 border-b border-l border-white/20 group-hover:border-electric-blue transition-colors duration-500"></div>
                                    <div className="absolute bottom-6 right-6 w-4 h-4 border-b border-r border-white/20 group-hover:border-electric-blue transition-colors duration-500"></div>
                                </div>

                                {/* Bottom Bar UI */}
                                <div className="p-4 border-t border-white/5 bg-white/[0.02] flex justify-between items-center">
                                    <span className="text-[10px] uppercase tracking-widest text-neon-purple font-bold">TRS Index</span>
                                    <RefreshCw size={12} className="text-white/40 group-hover:text-electric-blue group-hover:animate-spin transition-colors" />
                                </div>
                            </motion.div>

                            {/* Floating Offset Panels */}
                            <motion.div
                                custom={1}
                                variants={floatAnim}
                                animate="animate"
                                className="absolute top-1/4 -right-4 sm:-right-12 w-32 sm:w-40 p-3 rounded-lg border border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md shadow-2xl z-30 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-700"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-1.5 h-1.5 bg-neon-purple rounded-full"></div>
                                    <span className="text-[8px] uppercase tracking-widest text-white/60 font-bold">Access Log</span>
                                </div>
                                <div className="space-y-1.5">
                                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-neon-purple w-[80%]"></div>
                                    </div>
                                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-electric-blue w-[45%]"></div>
                                    </div>
                                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-white/40 w-[60%]"></div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                custom={2}
                                variants={floatAnim}
                                animate="animate"
                                className="absolute bottom-1/4 -left-4 sm:-left-12 px-4 py-2.5 rounded-lg border border-white/5 bg-gradient-to-r from-electric-blue/10 to-transparent backdrop-blur-md shadow-2xl z-30 group-hover:-translate-x-2 group-hover:translate-y-2 transition-transform duration-700 flex flex-col"
                            >
                                <span className="text-[8px] uppercase tracking-[0.2em] text-electric-blue font-bold">Status</span>
                                <span className="text-xs uppercase tracking-widest text-white font-bold inline-flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-electric-blue animate-pulse"></div>
                                    Encrypted
                                </span>
                            </motion.div>

                            {/* Watermark */}
                            <div className="absolute -bottom-10 right-0 text-white/[0.02] text-8xl font-black font-heading tracking-tighter pointer-events-none select-none">
                                TRS
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            
            {/* Global Keyframes adjustment for shimmer */}
            <style jsx>{`
                @keyframes shimmer {
                    100% {
                        transform: translateX(100%);
                    }
                }
            `}</style>
        </section>
    );
};

export default FeaturedCars;
