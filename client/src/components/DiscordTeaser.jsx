import React from 'react';
import { Terminal, Send, Server, Users, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';

const DiscordTeaser = () => {
    return (
        <section className="py-24 border-t border-white/5 bg-charcoal/50 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-64 bg-neon-purple/5 blur-[150px] -z-10 rounded-full"></div>

            <div className="max-w-5xl mx-auto px-6 md:px-12 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 glassmorphism mb-8"
                >
                    <Server size={14} className="text-neon-purple" />
                    <span className="text-xs font-bold uppercase tracking-widest text-white/80">Network Connected</span>
                </motion.div>

                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                    Connect to the <span className="text-neon-purple text-glow-purple">Dispatch</span>
                </h2>

                <p className="text-white/60 text-lg max-w-2xl mx-auto mb-12">
                    Announcements, event coordinates, meet themes, and community voting. Everything happens in the Discord server. Join the hub to get verified.
                </p>

                {/* Discord Terminal UI Mockup */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="glass-panel text-left max-w-3xl mx-auto p-1 rounded-md border border-white/10 shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-black/80 px-4 py-3 border-b border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Terminal size={16} className="text-white/50" />
                            <span className="text-sm font-bold tracking-widest text-white/80 font-mono">UM_DISPATCH_TERMINAL</span>
                        </div>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-white/20"></div>
                            <div className="w-3 h-3 rounded-full bg-white/20"></div>
                            <div className="w-3 h-3 rounded-full bg-neon-purple/50"></div>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-6 bg-[#0a0a0a]/90 font-mono text-sm space-y-4">
                        <div className="text-electric-blue/80">SYSTEM: Connection established on port 443.</div>
                        <div className="text-white/60">LOAD: Verifying driver credentials... [OK]</div>
                        <div className="text-white/60">MEMO: New meet scheduled. Topic: 'Midnight Muscle'. Date: SEC-05992.</div>

                        <div className="border-l-2 border-neon-purple pl-4 py-2 my-4 bg-neon-purple/5">
                            <div className="text-neon-purple font-bold mb-1">[ANNOUNCEMENT] @Driver</div>
                            <div className="text-white/80">The garage doors are open. Read #rules before submitting your build in #showroom. Be ready for the weekend cruise.</div>
                        </div>

                        <div className="flex items-center gap-2 text-white/40 mt-6 pt-4 border-t border-white/10">
                            <span className="text-neon-purple font-bold">_</span>
                            <span className="animate-pulse">Awaiting input...</span>
                        </div>
                    </div>
                </motion.div>

                <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
                    <motion.a
                        href="https://discord.gg/Ch3CCyFD5"
                        target="_blank"
                        rel="noreferrer"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="group relative w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-white text-black font-bold uppercase tracking-widest rounded-sm overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-neon-purple translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                        <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors duration-300">
                            <Send size={18} />
                            Join The Server
                        </span>
                    </motion.a>

                    <motion.a
                        href="https://www.instagram.com/theroyalsorcerers?igsh=MWRub3ltYjMwOGJrOQ=="
                        target="_blank"
                        rel="noreferrer"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                        className="group relative w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 font-bold uppercase tracking-widest rounded-sm overflow-hidden cursor-pointer"
                    >
                        {/* Glow effect behind the button when hovering */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] opacity-0 group-hover:opacity-75 transition-opacity duration-500 blur"></div>
                        
                        {/* Gradient border */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045]"></div>
                        
                        {/* Inner background */}
                        <div className="absolute inset-[2px] bg-black/95 backdrop-blur-md group-hover:bg-black/60 transition-colors duration-300 ease-in-out"></div>
                        
                        <span className="relative z-10 flex items-center gap-2 text-white/90 group-hover:text-white transition-colors duration-300">
                            <Instagram size={18} className="group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 ease-out" />
                            Follow on IG
                        </span>
                    </motion.a>
                </div>
            </div>
        </section>
    );
};

export default DiscordTeaser;
