import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Settings, Key, FileText, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Controls = () => {
    const options = [
        {
            title: 'Smart Admin Panel',
            description: 'Toggle admin access down to granular features.',
            icon: <Settings size={28} className="text-neon-purple" />,
            link: '/smart-admin',
            color: 'neon-purple'
        },
        {
            title: 'Credential Management',
            description: 'Generate, manage, and revoke administrator access.',
            icon: <Key size={28} className="text-neon-red" />,
            link: '/staff-credentials',
            color: 'neon-red'
        },
        {
            title: 'Password Manager',
            description: 'Manage secure passwords for crew systems.',
            icon: <Lock size={28} className="text-electric-blue" />,
            link: '/password-manager',
            color: 'electric-blue'
        },
        {
            title: 'System Logs',
            description: 'Review crew access and activity logs.',
            icon: <FileText size={28} className="text-[#FFD700]" />,
            link: '/logs',
            color: '[#FFD700]'
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-deep-black text-white relative selection:bg-neon-purple/50 pt-32 pb-32">
            <div className="max-w-6xl mx-auto px-6 md:px-12">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <span className="glassmorphism px-3 py-1 rounded-sm text-xs uppercase tracking-widest text-[#FF00FF] border-[#FF00FF]/30 mb-4 inline-flex items-center gap-2 shadow-[0_0_10px_rgba(255,0,255,0.2)]">
                        <Shield size={14} /> Master Terminal
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4 text-white drop-shadow-lg">
                        Super Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-[#FF00FF]">Controls</span>
                    </h1>
                    <p className="text-white/60 max-w-xl mx-auto text-sm">
                        Centralized control hub for all advanced master administrator capabilities.
                    </p>
                </motion.div>

                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {options.map((opt, i) => (
                        <motion.div key={i} variants={itemVariants}>
                            <Link 
                                to={opt.link}
                                className={`block h-full glass-panel p-8 rounded-xl border border-white/5 bg-charcoal/40 group hover:bg-${opt.color}/5 hover:border-${opt.color}/30 transition-all duration-300 relative overflow-hidden`}
                            >
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-${opt.color}/10 rounded-bl-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500`}></div>
                                
                                <div className="mb-6 relative z-10 glassmorphism w-14 h-14 rounded-lg flex items-center justify-center border-white/10 group-hover:scale-110 transition-transform duration-300">
                                    {opt.icon}
                                </div>
                                <h3 className={`text-xl font-bold font-heading uppercase tracking-wide text-white group-hover:text-${opt.color} transition-colors mb-3`}>
                                    {opt.title}
                                </h3>
                                <p className="text-sm text-white/50 group-hover:text-white/70 transition-colors">
                                    {opt.description}
                                </p>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default Controls;