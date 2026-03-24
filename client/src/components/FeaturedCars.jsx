import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Layers, Star, LayoutGrid } from 'lucide-react';

const FeaturedCars = () => {
    // Subtle float animation
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
    
    // Additional floating variations
    const floatAnim2 = {
        animate: (i) => ({
            y: [0, -8, 0],
            x: [0, 4, 0],
            transition: {
                duration: 5 + i,
                repeat: Infinity,
                ease: "easeInOut",
            },
        }),
    };

    return (
        <section id="garage-intro" className="py-32 bg-deep-black border-y border-white/5 relative overflow-hidden">
            {/* Cinematic Background */}
            <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-electric-blue/5 rounded-full blur-[150px] mix-blend-screen pointer-events-none animate-pulse-slow"></div>
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-neon-purple/5 rounded-full blur-[120px] mix-blend-screen pointer-events-none animate-pulse-slower"></div>
            
            {/* Grid & Technical Overlay */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none"></div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none"></div>
            
            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
                    
                    {/* Left Side: Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="w-full lg:w-[50%] flex flex-col items-start z-20"
                    >
                        {/* Premium Mini Label */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-px bg-electric-blue"></div>
                            <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-electric-blue px-4 py-1.5 border border-electric-blue/30 bg-electric-blue/5 backdrop-blur-sm shadow-[0_0_10px_rgba(0,229,255,0.1)] rounded-sm">
                                CREW VEHICLE SYSTEM
                            </span>
                        </div>

                        {/* Main Heading */}
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black font-heading tracking-tight mb-8 leading-[1.1]">
                            Explore the Crew Garage.<br className="hidden md:block" /> Discover the <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-neon-purple drop-shadow-[0_0_15px_rgba(0,229,255,0.4)]">Weekly Spotlight.</span>
                        </h2>

                        {/* Supporting Paragraph */}
                      

                        {/* Feature Split Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10 w-full">
                            {/* Block 1 */}
                            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6 backdrop-blur-md relative overflow-hidden group hover:bg-white/[0.05] transition-colors">
                                <div className="absolute top-0 left-0 w-1 h-full bg-white/20 group-hover:bg-white/50 transition-colors"></div>
                                <Layers className="text-white/50 w-6 h-6 mb-4 group-hover:text-white transition-colors" strokeWidth={1.5} />
                                <h3 className="font-bold text-white mb-2 tracking-wider uppercase text-sm">The Garage</h3>
                                <p className="text-white/50 text-sm leading-relaxed">See the cars of the crew members in one dedicated collection.</p>
                            </div>

                            {/* Block 2 */}
                            <div className="bg-electric-blue/[0.03] border border-electric-blue/20 rounded-xl p-6 backdrop-blur-md relative overflow-hidden group hover:bg-electric-blue/[0.08] transition-colors hover:shadow-[0_0_20px_rgba(0,229,255,0.05)_inset]">
                                <div className="absolute top-0 left-0 w-1 h-full bg-electric-blue shadow-[0_0_10px_rgba(0,229,255,0.8)]"></div>
                                <Star className="text-electric-blue w-6 h-6 mb-4 group-hover:drop-shadow-[0_0_8px_rgba(0,229,255,0.6)] transition-all" strokeWidth={1.5} />
                                <h3 className="font-bold text-electric-blue mb-2 tracking-wider uppercase text-sm drop-shadow-[0_0_5px_rgba(0,229,255,0.3)]">The Showroom</h3>
                                <p className="text-electric-blue/70 text-sm leading-relaxed">See the best car of the week selected for the spotlight.</p>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap items-center gap-4">
                            <Link to="/garage" className="px-8 py-3.5 bg-electric-blue hover:bg-white text-deep-black font-bold uppercase tracking-widest text-sm rounded transition-colors shadow-[0_0_15px_rgba(0,229,255,0.4)] hover:shadow-[0_0_25px_rgba(255,255,255,0.6)] text-center flex-1 sm:flex-none">
                                Enter Garage
                            </Link>
                            <Link to="/showroom" className="px-8 py-3.5 bg-transparent border border-electric-blue/50 hover:bg-electric-blue/10 text-electric-blue font-bold uppercase tracking-widest text-sm rounded transition-all backdrop-blur-md hover:shadow-[inset_0_0_15px_rgba(0,229,255,0.2)] text-center flex-1 sm:flex-none">
                                View Showroom
                            </Link>
                        </div>
                    </motion.div>

                    {/* Right Side: Dual Independent Systems Concept */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="w-full lg:w-[50%] relative h-[500px] lg:h-[600px] flex items-center justify-center mt-12 lg:mt-0 z-10"
                    >
                        {/* Wrapper for the entire visual structure */}
                        <div className="w-full h-full relative perspective-[1200px] flex md:flex-row flex-col items-center justify-between gap-8 py-8 md:py-0">
                            
                            {/* Module 1: Crew Garage System (Left side of right panel) */}
                            <motion.div 
                                className="relative w-[80%] md:w-[45%] h-[200px] md:h-[60%] z-10 group flex flex-col justify-center items-center"
                                variants={floatAnim2}
                                custom={1}
                                animate="animate"
                            >
                                {/* Micro Label */}
                                <div className="absolute top-[-30px] md:-top-10 left-0 md:left-1/2 md:-translate-x-1/2 flex items-center gap-2 w-max">
                                    <div className="w-1.5 h-1.5 bg-electric-blue/60 rounded-full group-hover:bg-electric-blue transition-colors duration-500 shadow-[0_0_8px_rgba(0,229,255,0.8)]"></div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] text-white/50 group-hover:text-electric-blue/90 font-bold uppercase tracking-[0.2em] transition-colors duration-500">CREW GARAGE</span>
                                        <span className="text-[7px] text-white/30 tracking-[0.1em] uppercase">Member Builds Archive</span>
                                    </div>
                                </div>
                                
                                {/* Garage Cluster Visual */}
                                <div className="relative w-full max-w-[200px] aspect-square flex items-center justify-center transform-style-3d transform -rotate-y-[15deg] rotate-x-[10deg] group-hover:rotate-y-[0deg] transition-transform duration-700">
                                    {/* Ambient Glow */}
                                    <div className="absolute inset-0 bg-electric-blue/10 blur-[40px] rounded-full group-hover:bg-electric-blue/20 transition-all duration-700 pointer-events-none"></div>
                                    
                                    {/* Layered Tiles */}
                                    {[0, 1, 2, 3].map((i) => (
                                        <motion.div 
                                            key={"garage-tile-" + i}
                                            className="absolute w-full h-[60px] rounded-md border border-electric-blue/20 bg-black/40 backdrop-blur-md shadow-[0_8px_20px_rgba(0,0,0,0.5)] flex items-center px-4 overflow-hidden"
                                            style={{ 
                                                top: (10 + i * 20) + "%", 
                                                left: (i * 8) + "%", 
                                                zIndex: 4 - i,
                                                transform: "translateZ(" + (i * 20) + "px)"
                                            }}
                                            animate={{ y: [0, -5, 0] }}
                                            transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                                        >
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-electric-blue/50 to-transparent"></div>
                                            <div className="flex gap-2">
                                                <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center border border-white/10">
                                                    <LayoutGrid className="w-3.5 h-3.5 text-white/40" />
                                                </div>
                                                <div className="flex flex-col gap-1.5 justify-center">
                                                    <div className="w-16 h-1.5 rounded-full bg-white/20"></div>
                                                    <div className="w-10 h-1 space-x-1 flex">
                                                        <div className="w-4 h-full bg-electric-blue/40 rounded-full"></div>
                                                        <div className="w-4 h-full bg-white/10 rounded-full"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                    
                                    {/* Decorative scattered elements */}
                                    {[...Array(5)].map((_, i) => (
                                        <motion.div 
                                            key={"frag-" + i}
                                            className="absolute w-1 h-1 bg-electric-blue/50 rounded-sm"
                                            style={{ left: (20 + i * 15) + "%", top: (-10 + (i%2) * 110) + "%", transform: "translateZ(" + (i * 10) + "px)" }}
                                            animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.5, 1] }}
                                            transition={{ duration: 2 + i, repeat: Infinity, ease: "easeInOut", delay: i }}
                                        />
                                    ))}
                                </div>
                            </motion.div>

                            {/* Separator / Divider (Subtle) */}
                            <div className="hidden md:flex h-[40%] w-px bg-gradient-to-b from-transparent via-white/10 to-transparent z-0"></div>

                            {/* Module 2: Weekly Meet Showroom (Right side of right panel) */}
                            <motion.div 
                                className="relative w-[85%] md:w-[50%] h-[250px] md:h-[70%] z-20 group flex flex-col justify-center items-center"
                                variants={floatAnim} 
                                custom={0.5} 
                                animate="animate"
                            >
                                {/* Micro Label */}
                                <div className="absolute top-[-30px] md:-top-10 right-0 md:left-1/2 md:-translate-x-1/2 flex items-center gap-2 w-max justify-end md:justify-start">
                                    <div className="flex flex-col text-right md:text-left">
                                        <span className="text-[9px] text-white/50 group-hover:text-neon-purple/90 font-bold uppercase tracking-[0.2em] transition-colors duration-500">SHOWROOM SPOTLIGHT</span>
                                        <span className="text-[7px] text-white/30 tracking-[0.1em] uppercase">Best Car of the Meet</span>
                                    </div>
                                    <div className="w-1.5 h-1.5 bg-neon-purple/60 rounded-full group-hover:bg-neon-purple transition-colors duration-500 shadow-[0_0_8px_rgba(180,0,255,0.8)]"></div>
                                </div>

                                {/* Showroom Spotlight Visual */}
                                <div className="relative w-full max-w-[220px] aspect-[4/5] perspective-[1000px] flex items-center justify-center">
                                    {/* Large rotating neon aura */}
                                    <div className="absolute inset-[-20%] flex items-center justify-center pointer-events-none">
                                        <motion.div 
                                            className="w-[80%] h-[80%] rounded-full border border-neon-purple/20 border-t-neon-purple/60"
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 15, ease: "linear", repeat: Infinity }}
                                        />
                                        <motion.div 
                                            className="absolute w-[60%] h-[60%] rounded-full border border-electric-blue/10 border-b-electric-blue/50"
                                            animate={{ rotate: -360 }}
                                            transition={{ duration: 10, ease: "linear", repeat: Infinity }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-tr from-neon-purple/10 to-electric-blue/10 blur-[40px] rounded-full scale-110 opacity-70 group-hover:opacity-100 transition-opacity duration-700"></div>
                                    </div>
                                    
                                    {/* Trophy / Prestige Panel */}
                                    <div className="relative w-full h-full bg-black/70 backdrop-blur-2xl border border-neon-purple/40 rounded-xl flex flex-col items-center justify-between p-5 shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(180,0,255,0.1)] group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_0_30px_rgba(180,0,255,0.25)] transition-all duration-700 transform-style-3d group-hover:rotate-y-[5deg] group-hover:-translate-y-2">
                                        
                                        {/* Top Badge */}
                                        <div className="w-full flex justify-center z-10">
                                            <div className="px-3 py-1 bg-neon-purple/10 border border-neon-purple/30 rounded-full flex items-center gap-2 backdrop-blur-md">
                                                <Star className="w-3 h-3 text-neon-purple drop-shadow-[0_0_5px_rgba(180,0,255,0.8)]" fill="currentColor" />
                                                <span className="text-[8px] font-bold text-neon-purple uppercase tracking-[0.15em]">Weekly Pick</span>
                                            </div>
                                        </div>

                                        {/* Center Abstract Feature */}
                                        <div className="relative flex-grow w-full flex items-center justify-center my-4">
                                            {/* Pedestal line */}
                                            <div className="absolute bottom-4 w-24 h-0.5 bg-neon-purple/60 shadow-[0_0_15px_rgba(180,0,255,0.8)] rounded-full"></div>
                                            <div className="absolute bottom-4 w-32 h-4 bg-gradient-to-t from-neon-purple/20 to-transparent blur-md"></div>
                                            
                                            {/* Glowing featured object */}
                                            <motion.div 
                                                className="w-20 h-20 bg-gradient-to-br from-neon-purple to-electric-blue rounded-lg transform rotate-45 shadow-[0_0_30px_rgba(180,0,255,0.6)] flex items-center justify-center relative overflow-hidden"
                                                animate={{ 
                                                    boxShadow: ["0 0 20px rgba(180,0,255,0.4)", "0 0 40px rgba(180,0,255,0.8)", "0 0 20px rgba(180,0,255,0.4)"] 
                                                }}
                                                transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
                                            >
                                                <div className="absolute inset-0 bg-white/20 blur-md transform -rotate-45 translate-y-[-30%]"></div>
                                                <div className="w-8 h-8 rounded-sm border border-white/80 transform -rotate-45 flex items-center justify-center glass-effect">
                                                    <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,1)]"></div>
                                                </div>
                                            </motion.div>
                                        </div>

                                        {/* Bottom abstract UI lines */}
                                        <div className="w-full z-10 border-t border-white/10 pt-3">
                                            <div className="mx-auto w-16 h-1 bg-white/20 rounded-full mb-1.5"></div>
                                            <div className="mx-auto w-10 h-1 bg-white/10 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                        </div>
                    </motion.div>

                </div>
            </div>

            {/* Custom Animations & Styles */}
            <style>{`
                .glass-effect {
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(10px);
                }
            `}</style>
        </section>
    );
};

export default FeaturedCars;
