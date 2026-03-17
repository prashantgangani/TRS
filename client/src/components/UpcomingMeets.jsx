import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Target, Plus, Car, User, Clock, ShieldAlert, X, Info, Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { API_URL } from '../config';
import { logAdminAction } from '../utils/logger';
import { optimizeImage } from '../utils/imageOptimizer';

const UpcomingMeets = ({ isAdmin }) => {
    const [meets, setMeets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMeet, setSelectedMeet] = useState(null);
    const navigate = useNavigate();

    // Prevent background scrolling when modal is open
    useEffect(() => {
        if (selectedMeet) {
            document.body.style.overflow = 'hidden';
            
            // Add ESC key listener
            const handleEsc = (e) => {
                if (e.key === 'Escape') setSelectedMeet(null);
            };
            window.addEventListener('keydown', handleEsc);
            
            return () => { 
                document.body.style.overflow = 'unset'; 
                window.removeEventListener('keydown', handleEsc);
            };
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [selectedMeet]);

    // Fetch Meets
    useEffect(() => {
        const fetchMeets = async () => {
            try {
                const response = await fetch(`${API_URL}/meets`);
                const data = await response.json();
                setMeets(data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch meets:", error);
                setLoading(false);
            }
        };
        fetchMeets();
    }, []);

    return (
        <section id="meets" className="py-32 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
            <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-glow">Upcoming <span className="text-neon-purple">Meets</span></h2>
                    <p className="text-white/60 text-lg max-w-2xl">The streets are calling. Check out the schedule, prep your ride, and join the crew at our next organized showcase.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                        onClick={() => navigate('/previous-meets')}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-black border border-white/20 rounded-full hover:bg-white/5 transition-all font-bold tracking-widest text-sm uppercase whitespace-nowrap"
                    >
                        <Clock size={18} className="text-white/70" />
                        Previous Meets
                    </button>
                    <button 
                        onClick={() => navigate('/valid-cars')}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-black border border-neon-purple/50 rounded-full hover:bg-neon-purple/10 hover:shadow-[0_0_15px_rgba(176,38,255,0.4)] transition-all font-bold tracking-widest text-sm uppercase whitespace-nowrap"
                    >
                        <Car size={18} className="text-neon-purple" />
                        Valid Cars List
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                
                {/* ADMIN ONLY: ADD NEW MEET ACTION CARD */}
                {isAdmin && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-panel p-6 rounded-sm border-2 border-dashed border-neon-purple/50 bg-neon-purple/5 relative flex flex-col justify-center items-center text-center min-h-[300px]"
                    >
                        <h3 className="text-xl font-bold mb-4 font-heading text-neon-purple flex items-center gap-2">
                            <Plus size={20} /> Publish New Meet
                        </h3>
                        <p className="text-white/50 text-sm mb-6">Enter official dispatch interface to detail Theme, Date, Time, Location, Dress Code, Vehicle Requirements, Cml/Lead, Rules, and Host.</p>
                        
                        <button onClick={() => navigate('/admin/add-meet')} className="w-full py-4 bg-neon-purple hover:bg-neon-purple/80 text-white text-sm font-bold uppercase tracking-widest rounded transition-colors shadow-[0_0_15px_rgba(176,38,255,0.4)]">
                            Open Console
                        </button>
                    </motion.div>
                )}

                {loading ? (
                    <div className="text-white/50 col-span-3 text-center py-10 tracking-widest uppercase text-sm">Loading Underground Intel...</div>
                ) : (
                    meets.map((meet, index) => (
                    <motion.div
                        key={meet._id || index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="glass-panel p-6 rounded-sm group hover:border-neon-purple/50 transition-colors duration-500 overflow-hidden relative flex flex-col"
                    >
                        {/* Background Image on Card */}
                        <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-40 transition-opacity duration-700">
                            <img src={optimizeImage(meet.image, 400) || 'https://images.unsplash.com/photo-1511407397940-d57f68e81203?w=800&auto=format&fit=crop'} alt="Meet Thumbnail" className="w-full h-full object-cover grayscale group-hover:grayscale-0" />
                            <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-deep-black/80 to-transparent"></div>
                        </div>

                        {/* Subtle glow effect behind card */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-neon-purple/10 rounded-full blur-3xl -z-10 group-hover:bg-neon-purple/20 transition-all duration-500"></div>

                        {isAdmin && (
                            <div className="absolute top-4 right-4 z-20 flex gap-2">
                                <button onClick={(e) => { 
                                    e.stopPropagation(); 
                                    navigate('/admin/add-meet', { state: { editMeet: meet } }); 
                                }} className="p-2 bg-black/60 hover:bg-electric-blue/80 text-white rounded-full transition-colors backdrop-blur-md z-30 relative">
                                    <Edit2 size={16} />
                                </button>
                                <button onClick={async (e) => {
                                    e.stopPropagation();
                                    if (!window.confirm("Delete this meet?")) return;
                                    try {
                                        const response = await fetch(`${API_URL}/meets/${meet._id}`, { method: 'DELETE' });
                                        if (response.ok) {
                                            setMeets(meets.filter(m => m._id !== meet._id));
                                            await logAdminAction('Deleted Meet', `Theme: ${meet.theme}`);
                                        }
                                    } catch (err) { console.error(err); }
                                }} className="p-2 bg-black/60 hover:bg-neon-red/80 text-white rounded-full transition-colors backdrop-blur-md z-30 relative">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        )}

                        <div className="relative z-10 flex flex-col flex-1 mt-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="inline-block px-3 py-1 border border-white/20 rounded-full text-xs uppercase tracking-widest text-white/80 glassmorphism shadow-lg backdrop-blur-md">
                                    {meet.dressCode || meet.type || 'Standard'}
                                </div>
                            </div>

                            <h3 className="text-3xl font-bold mb-6 font-heading group-hover:text-glow transition-all drop-shadow-md">{meet.theme || meet.title}</h3>

                            <div className="space-y-4 mb-6 text-white/70 flex-1 drop-shadow-md">
                                <div className="flex items-center gap-3">
                                    <Calendar className="text-neon-purple" size={16} />
                                    <span className="text-sm font-medium">{meet.date} <span className="text-white/40">|</span> {meet.time || 'TBA'}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <MapPin className="text-electric-blue" size={16} />
                                    <span className="text-sm font-medium">{meet.location}</span>
                                </div>
                            </div>

                            <button onClick={() => setSelectedMeet(meet)} className="w-full py-3 mt-auto rounded-sm border border-white/10 hover:border-neon-purple text-white/70 hover:text-neon-purple transition-colors text-sm font-bold uppercase tracking-widest bg-black/40 backdrop-blur-sm">
                                RSVP Details
                            </button>
                        </div>
                    </motion.div>
                )))}
            </div>

            {/* MODAL DIALOG */}
            {createPortal(
                <AnimatePresence>
                    {selectedMeet && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-deep-black/90 backdrop-blur-md"
                            onClick={() => setSelectedMeet(null)}
                        >
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                className="w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-panel border border-white/10 rounded-xl relative overflow-hidden flex flex-col hide-scrollbar"
                                onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
                            >
                                {/* Close Button */}
                                <button 
                                    onClick={() => setSelectedMeet(null)}
                                    className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-neon-red/20 text-white hover:text-neon-red rounded-full transition-colors backdrop-blur-md"
                                >
                                    <X size={24} />
                                </button>

                                {/* Modal Header / Cover Image */}
                                <div className="relative w-full h-64 md:h-80 shrink-0">
                                    <img src={optimizeImage(selectedMeet.image, 800) || 'https://images.unsplash.com/photo-1511407397940-d57f68e81203?w=800&auto=format&fit=crop'} alt="Cover" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent"></div>
                                    
                                    <div className="absolute bottom-0 left-0 p-8 w-full">
                                        <div className="inline-block px-3 py-1 mb-3 border border-neon-purple/50 bg-neon-purple/20 rounded-sm text-xs uppercase tracking-widest text-neon-purple font-bold shadow-[0_0_10px_rgba(176,38,255,0.3)]">
                                            {selectedMeet.dressCode || selectedMeet.type || 'Standard Meet'}
                                        </div>
                                        <h2 className="text-4xl md:text-5xl font-black font-heading tracking-tight text-white drop-shadow-lg text-glow">
                                            {selectedMeet.theme || selectedMeet.title}
                                        </h2>
                                    </div>
                                </div>

                                {/* Modal Body */}
                                <div className="p-8 md:p-10 bg-[#0a0a0a] flex-1">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        
                                        {/* Left Column: Core Logistics */}
                                        <div className="space-y-6">
                                            <div>
                                                <h4 className="text-xs uppercase tracking-widest text-electric-blue mb-3 font-bold border-l-2 border-electric-blue pl-2">Time & Location</h4>
                                                <div className="space-y-3 bg-white/5 p-4 rounded border border-white/5">
                                                    <div className="flex items-center gap-3">
                                                        <Calendar className="text-white/60" size={18} />
                                                        <span className="text-sm font-medium text-white">{selectedMeet.date}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <Clock className="text-white/60" size={18} />
                                                        <span className="text-sm font-medium text-white">{selectedMeet.time || 'TBA'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <MapPin className="text-white/60" size={18} />
                                                        <span className="text-sm font-medium text-white">{selectedMeet.location}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="text-xs uppercase tracking-widest text-neon-purple mb-3 font-bold border-l-2 border-neon-purple pl-2">Requirements & Command</h4>
                                                <div className="space-y-3 bg-white/5 p-4 rounded border border-white/5">
                                                    {selectedMeet.car && (
                                                        <div className="flex items-center gap-3">
                                                            <Car className="text-white/60" size={18} />
                                                            <span className="text-sm text-white/60">Vehicle: <span className="font-bold text-white">{selectedMeet.car}</span></span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-3">
                                                        <Target className="text-neon-red" size={18} />
                                                        <span className="text-sm text-white/60">Host: <span className="font-bold text-white">{selectedMeet.host || 'System Admin'}</span></span>
                                                    </div>
                                                    {selectedMeet.cmlLead && (
                                                        <div className="flex items-center gap-3">
                                                            <User className="text-white/60" size={18} />
                                                            <span className="text-sm text-white/60">Lead: <span className="font-bold text-white">{selectedMeet.cmlLead}</span></span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Column: Lore & Rules */}
                                        <div className="space-y-8">
                                            {selectedMeet.description && (
                                                <div>
                                                    <div className="flex items-center gap-2 mb-3 text-white">
                                                        <Info size={16} />
                                                        <h4 className="text-xs uppercase tracking-widest font-bold">Briefing</h4>
                                                    </div>
                                                    <p className="text-sm text-white/70 leading-relaxed bg-white/5 p-4 rounded border border-white/5 whitespace-pre-wrap">
                                                        {selectedMeet.description}
                                                    </p>
                                                </div>
                                            )}

                                            {selectedMeet.rules && (
                                                <div>
                                                    <div className="flex items-center gap-2 mb-3 text-neon-red">
                                                        <ShieldAlert size={16} />
                                                        <h4 className="text-xs uppercase tracking-widest font-bold">Official Rules</h4>
                                                    </div>
                                                    <p className="text-sm text-white/70 leading-relaxed bg-neon-red/5 p-4 rounded border border-neon-red/20 whitespace-pre-wrap">
                                                        {selectedMeet.rules}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </section>
    );
};

export default UpcomingMeets;
