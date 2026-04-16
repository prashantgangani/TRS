import React from 'react';
import { motion } from 'framer-motion';
import StaffManagement from '../components/StaffManagement';
import { Link } from 'react-router-dom';

const StaffCredentials = () => {
    return (
        <div className="min-h-screen bg-deep-black text-white relative selection:bg-neon-purple/50 pt-24 pb-32">
            <div className="max-w-6xl mx-auto px-6 md:px-12 mb-8">
                <Link to="/controls" className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:border-neon-purple hover:bg-neon-purple/10 rounded-full transition-all text-xs font-bold uppercase tracking-wider text-white">
                    &larr; Back to Controls
                </Link>
            </div>
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <StaffManagement />
                </motion.div>
            </div>
        </div>
    );
};

export default StaffCredentials;