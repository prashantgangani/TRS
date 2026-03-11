import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Globe2, Clock } from 'lucide-react';
import { API_URL } from '../config';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const Timezones = ({ isAdmin, isSuperAdmin }) => {
    const [timezones, setTimezones] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form State for SuperAdmin
    const [region, setRegion] = useState('');
    const [time, setTime] = useState('');
    const [day, setDay] = useState('');
    const [offset, setOffset] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchTimezones = async () => {
        try {
            const response = await fetch(`${API_URL}/timezones`);
            const data = await response.json();
            setTimezones(data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch timezones:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTimezones();
    }, []);

    const handleAddTimezone = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await fetch(`${API_URL}/timezones`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ region, time, day, offset })
            });
            if (response.ok) {
                fetchTimezones();
                setRegion(''); setTime(''); setDay(''); setOffset('');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await fetch(`${API_URL}/timezones/${id}`, { method: 'DELETE' });
            setTimezones(timezones.filter(tz => tz._id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-deep-black text-white relative pt-32 pb-32">
            <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-electric-blue/5 blur-[150px] rounded-full pointer-events-none -z-10"></div>
            
            <div className="max-w-6xl mx-auto px-6 md:px-12">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <span className="glassmorphism px-3 py-1 rounded-sm text-xs uppercase tracking-widest text-electric-blue border-electric-blue/30 mb-4 inline-block shadow-[0_0_10px_rgba(0,229,255,0.2)]">
                        Global Dispatch
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black font-heading tracking-tight mb-4 flex items-center justify-center gap-4 text-glow">
                        <Globe2 className="text-electric-blue hidden sm:block" size={48} /> Official Meet Times
                    </h1>
                    <p className="text-white/60 max-w-2xl mx-auto text-sm md:text-base">
                        Our crew operates worldwide. Find the exact standard dispatch time for your region below so you never miss a lobby.
                    </p>
                </motion.div>

                {isAdmin && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-panel p-8 rounded-xl border-l-4 border-l-electric-blue mb-16 max-w-4xl mx-auto"
                    >
                         <h3 className="text-xl font-bold mb-6 font-heading text-white flex items-center gap-2">
                            <Plus size={20} className="text-electric-blue" /> Add Regional Timezone
                        </h3>
                        <form onSubmit={handleAddTimezone} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input required type="text" placeholder="Region (e.g. NA East, EU Central, IST)" value={region} onChange={e => setRegion(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-electric-blue" />
                            <input required type="text" placeholder="Time (e.g. 10:00 PM)" value={time} onChange={e => setTime(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-electric-blue" />
                            <input required type="text" placeholder="Day (e.g. Saturday)" value={day} onChange={e => setDay(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-electric-blue" />
                            <input required type="text" placeholder="UTC Offset (e.g. UTC-5, UTC+5:30)" value={offset} onChange={e => setOffset(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-electric-blue" />
                            
                            <button disabled={isSubmitting} type="submit" className="w-full md:col-span-2 py-4 mt-2 bg-electric-blue hover:bg-electric-blue/80 text-deep-black text-sm font-bold uppercase tracking-widest rounded transition-colors shadow-[0_0_15px_rgba(0,229,255,0.4)]">
                                Register Timezone
                            </button>
                        </form>
                    </motion.div>
                )}

                {loading ? (
                    <div className="text-white/50 text-center py-20 tracking-widest uppercase">Syncing Clocks...</div>
                ) : (
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        <AnimatePresence>
                            {timezones.map(tz => (
                                <motion.div 
                                    key={tz._id}
                                    variants={itemVariants}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="bg-charcoal/40 border border-white/5 rounded-xl p-6 relative group hover:border-electric-blue/30 transition-colors overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-10 font-black font-heading tracking-widest text-4xl pointer-events-none">
                                        {tz.offset}
                                    </div>
                                    
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h3 className="text-2xl font-bold font-heading text-white mb-1 group-hover:text-glow-blue transition-all">{tz.region}</h3>
                                            <p className="text-xs uppercase tracking-widest text-electric-blue font-semibold">{tz.offset}</p>
                                        </div>
                                        {isAdmin && (
                                            <button 
                                                onClick={() => handleDelete(tz._id)}
                                                className="text-white/20 hover:text-neon-red transition-colors p-2 z-10"
                                                title="Delete Timezone"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                    
                                    <div className="flex items-center gap-3 bg-black/50 rounded-lg p-4 border border-white/5 object-cover">
                                        <Clock className="text-white/50 flex-shrink-0" size={24} />
                                        <div>
                                            <div className="text-white font-bold tracking-wider">{tz.time}</div>
                                            <div className="text-white/50 text-sm uppercase tracking-wider">{tz.day}</div>
                                        </div>
                                    </div>
                                    
                                    {/* Bottom aesthetic line */}
                                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-electric-blue/0 via-electric-blue/50 to-electric-blue/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Timezones;
