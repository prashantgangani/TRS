import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ShieldAlert } from 'lucide-react';
import { API_URL } from '../config';
import { logAdminAction } from '../utils/logger';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const Laws = ({ isAdmin, isSuperAdmin }) => {
    const [laws, setLaws] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form State for SuperAdmin
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('General');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchLaws = async () => {
        try {
            const response = await fetch(`${API_URL}/laws`);
            const data = await response.json();
            setLaws(data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch laws:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLaws();
    }, []);

    const handleAddLaw = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await fetch(`${API_URL}/laws`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description, category, order: laws.length })
            });
            if (response.ok) {
                await logAdminAction('Added Law', `Title: ${title} | Category: ${category}`);
                fetchLaws();
                setTitle(''); setDescription('');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${API_URL}/laws/${id}`, { method: 'DELETE' });
            if (response.ok) {
                const deletedLaw = laws.find(law => law._id === id);
                await logAdminAction('Deleted Law', `Title: ${deletedLaw?.title} | Category: ${deletedLaw?.category}`);
                setLaws(laws.filter(law => law._id !== id));
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-deep-black text-white relative pt-32 pb-32">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon-red/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
            
            <div className="max-w-5xl mx-auto px-6 md:px-12">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <span className="glassmorphism px-3 py-1 rounded-sm text-xs uppercase tracking-widest text-neon-red border-neon-red/30 mb-4 inline-block shadow-[0_0_10px_rgba(255,51,102,0.2)]">
                        Crew Protocol
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black font-heading tracking-tight mb-4 flex items-center justify-center gap-4 text-glow">
                        <ShieldAlert className="text-neon-red hidden sm:block" size={48} /> The Laws
                    </h1>
                    <p className="text-white/60 max-w-2xl mx-auto text-sm md:text-base">
                        Violating crew protocols will result in immediate termination or blacklisting from all Los Santos meets. Read carefully.
                    </p>
                </motion.div>

                {isAdmin && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-panel p-8 rounded-xl border-l-4 border-l-neon-red mb-16"
                    >
                         <h3 className="text-xl font-bold mb-6 font-heading text-white flex items-center gap-2">
                            <Plus size={20} className="text-neon-red" /> Establish New Protocol
                        </h3>
                        <form onSubmit={handleAddLaw} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input required type="text" placeholder="Protocol Title (e.g. No Weaponized Vehicles)" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-neon-red" />
                                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-neon-red">
                                    <option value="General">General</option>
                                    <option value="Meets">Meets</option>
                                    <option value="Conduct">Conduct</option>
                                    <option value="Bans">Bans & Strikes</option>
                                </select>
                            </div>
                            <textarea required placeholder="Detailed Description of the Rule..." value={description} onChange={e => setDescription(e.target.value)} rows="3" className="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-neon-red resize-none"></textarea>
                            <button disabled={isSubmitting} type="submit" className="w-full py-4 bg-neon-red hover:bg-neon-red/80 text-white text-sm font-bold uppercase tracking-widest rounded transition-colors shadow-[0_0_15px_rgba(255,51,102,0.4)]">
                                Encode Law
                            </button>
                        </form>
                    </motion.div>
                )}

                {loading ? (
                    <div className="text-white/50 text-center py-20 tracking-widest uppercase">Accessing Database...</div>
                ) : (
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-6"
                    >
                        <AnimatePresence>
                            {laws.map((law, index) => (
                                <motion.div 
                                    key={law._id}
                                    variants={itemVariants}
                                    exit={{ opacity: 0, x: -50 }}
                                    className="bg-charcoal/40 border border-white/5 rounded-lg p-6 md:p-8 relative group hover:bg-white/5 transition-colors"
                                >
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex gap-4">
                                            <div className="text-neon-red/50 font-black font-heading text-4xl leading-none select-none">
                                                {String(index + 1).padStart(2, '0')}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-xl md:text-2xl font-bold font-heading text-white">{law.title}</h3>
                                                    <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-sm border border-white/20 text-white/50">{law.category}</span>
                                                </div>
                                                <p className="text-white/70 text-sm md:text-base leading-relaxed">
                                                    {law.description}
                                                </p>
                                            </div>
                                        </div>
                                        {isAdmin && (
                                            <button 
                                                onClick={() => handleDelete(law._id)}
                                                className="text-white/20 hover:text-neon-red transition-colors p-2 shrink-0"
                                                title="Abolish Law"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        )}
                                    </div>
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-neon-red opacity-0 group-hover:opacity-100 transition-opacity rounded-l-lg"></div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {laws.length === 0 && !loading && (
                            <div className="text-white/50 text-center py-20 tracking-widest uppercase">No protocols found. Complete Anarchy.</div>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Laws;
