import React from 'react';
import { motion } from 'framer-motion';
import { optimizeImage } from '../utils/imageOptimizer';
import OptimizedImage from './OptimizedImage';
import LazyImage from './LazyImage';

const CrewIdentity = () => {
    return (
        <section id="crew" className="py-32 bg-deep-black relative">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="flex flex-col md:flex-row items-center gap-16">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="w-full md:w-1/2"
                    >
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 leading-tight">
                            Built Around the Meet, <br />
                            <span className="text-neon-purple text-glow-purple">Not the Madness.</span>
                        </h2>
                        <div className="space-y-6 text-white/70 text-lg">
                            <p>
                                We are more than just a crew. We are individuals united by an unshakable passion for automotive culture in Los Santos. We prefer rolling low and slow to flying on MK2s.
                            </p>
                            <p>
                                Every scratch, every dial, and every mod tells a story. We organize dedicated, heavily-themed meets where presentation matters more than speed. Respect the builds, respect the rules, respect the meet.
                            </p>
                        </div>

                        <div className="mt-12 grid grid-cols-2 gap-6">
                            <div className="border-l-2 border-neon-purple pl-4">
                                <div className="text-3xl font-bold text-white mb-1">No PvP</div>
                                <div className="text-sm uppercase tracking-widest text-white/50">During Meets</div>
                            </div>
                            <div className="border-l-2 border-electric-blue pl-4">
                                <div className="text-3xl font-bold text-white mb-1">Clean</div>
                                <div className="text-sm uppercase tracking-widest text-white/50">Smooth Drives</div>
                            </div>
                            <div className="border-l-2 border-white/20 pl-4">
                                <div className="text-3xl font-bold text-white mb-1">150+</div>
                                <div className="text-sm uppercase tracking-widest text-white/50">Active Drivers</div>
                            </div>
                            <div className="border-l-2 border-neon-red pl-4">
                                <div className="text-3xl font-bold text-white mb-1">Weekly</div>
                                <div className="text-sm uppercase tracking-widest text-white/50">Themed Events</div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="w-full md:w-1/2 relative aspect-square md:aspect-auto md:h-[600px] rounded-sm overflow-hidden"
                    >
                        {/* Dark Cinematic overlay */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-deep-black via-transparent to-transparent z-10 pointer-events-none"></div>
                        <div className="absolute inset-0 border border-white/10 z-20 mix-blend-overlay pointer-events-none"></div>

                        <LazyImage
                            src="/meet.png"
                            alt="Car Meet Atmosphere"
                            className="filter brightness-50 contrast-125 saturate-50"
                        />

                        <div className="absolute bottom-8 right-8 z-30 flex items-center gap-3 glass-panel px-6 py-4 rounded-sm border-l-4 border-l-neon-purple">
                            <div className="w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center bg-white/5">
                                <span className="font-heading font-bold">UM</span>
                            </div>
                            <div>
                                <div className="text-sm font-bold uppercase tracking-widest">Est. 2026</div>
                                <div className="text-xs text-white/50">Los Santos</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default CrewIdentity;
