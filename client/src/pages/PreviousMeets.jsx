import LazyImage from '../components/LazyImage';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Plus, Edit2, X, ChevronUp, ChevronDown } from 'lucide-react';
import { API_URL } from '../config';
import { logAdminAction } from '../utils/logger';

const PreviousMeets = ({ isAdmin }) => {
    const [meets, setMeets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ themeName: '', imageUrl: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Limit initial loaded meets for bandwidth
    const [visibleCount, setVisibleCount] = useState(5); // 5 meets

    useEffect(() => {
        fetchMeets();
    }, []);

    const fetchMeets = async () => {
        try {
            const res = await fetch(`${API_URL}/previous-meets`);
            const data = await res.json();
            setMeets(data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch previous meets:", error);
            setLoading(false);
        }
    };

    const handleMove = async (index, direction) => {
        const newMeets = [...meets];
        if (direction === 'up' && index > 0) {
            const temp = newMeets[index];
            newMeets[index] = newMeets[index - 1];
            newMeets[index - 1] = temp;
        } else if (direction === 'down' && index < newMeets.length - 1) {
            const temp = newMeets[index];
            newMeets[index] = newMeets[index + 1];
            newMeets[index + 1] = temp;
        } else {
            return;
        }
        
        // Optimistic UI update
        setMeets(newMeets);
        
        // Build array of new order mappings mapped to default indexing
        const updates = newMeets.map((m, i) => ({ id: m._id, order: i }));
        try {
            await fetch(`${API_URL}/previous-meets/reorder`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: updates })
            });
        } catch(e) {
            console.error("Failed to reorder meets", e);
        }
    };

    const handleAddOrEdit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        const payload = {
            themeName: formData.themeName,
            imageUrl: formData.imageUrl,
            imageUrls: [formData.imageUrl].filter(Boolean)
        };

        try {
            if (editingId) {
                const res = await fetch(`${API_URL}/previous-meets/${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (res.ok) {
                    await logAdminAction('Edited Previous Meet', `Theme: ${formData.themeName}`);
                    setFormData({ themeName: '', imageUrl: '' });
                    setEditingId(null);
                    fetchMeets();
                }
            } else {
                const res = await fetch(`${API_URL}/previous-meets`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (res.ok) {
                    await logAdminAction('Added Previous Meet', `Theme: ${formData.themeName}`);
                    setFormData({ themeName: '', imageUrl: '' });
                    fetchMeets();
                }
            }
        } catch (err) {
            console.error("Error saving previous meet:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditClick = (meet) => {
        setEditingId(meet._id);
        const urlToUse = meet.imageUrl || (meet.imageUrls && meet.imageUrls.length > 0 ? meet.imageUrls[0] : '');
        setFormData({
            themeName: meet.themeName,
            imageUrl: urlToUse
        });
        // Remove scroll to top
    };

    const cancelEdit = () => {
        setEditingId(null);
        setFormData({ themeName: '', imageUrl: '' });
    };

    const handleDelete = async (id, themeName) => {
        if (!window.confirm("Are you sure you want to remove this memory?")) return;
        try {
            const res = await fetch(`${API_URL}/previous-meets/${id}`, { method: 'DELETE' });
            if (res.ok) {
                await logAdminAction('Deleted Previous Meet', `Removed: ${themeName}`);
                fetchMeets();
            }
        } catch (err) {
            console.error("Error deleting previous meet:", err);
        }
    };

    return (
        <div className="pt-32 pb-20 px-6 md:px-12 max-w-[1600px] mx-auto min-h-screen bg-[#0b0b0b]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-16 text-center"
            >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-heading text-white uppercase drop-shadow-[0_0_15px_rgba(176,38,255,0.4)] tracking-widest mb-4">
                    Previous Meets
                </h1>

                {/* Cinematic GTA-Style Neon Divider */}
                <div className="flex justify-center items-center mt-6 mb-8 gap-4 opacity-80">
                    <div className="h-px w-24 md:w-32 bg-gradient-to-l from-neon-purple to-transparent"></div>
                    <div className="h-2 w-2 rounded-full bg-electric-blue drop-shadow-[0_0_8px_rgba(0,229,255,1)]"></div>
                    <div className="h-px w-24 md:w-32 bg-gradient-to-r from-electric-blue to-transparent"></div>
                </div>

                <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto uppercase tracking-widest font-medium">
                    A glimpse into the legacy of our meets.
                </p>
            </motion.div>

            {isAdmin && !editingId && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-16 glass-panel p-6 rounded-lg border-2 border-neon-purple/30 max-w-3xl mx-auto relative"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold font-heading text-neon-purple flex items-center gap-2">
                            {editingId ? <Edit2 size={20} /> : <Plus size={20} />} 
                            {editingId ? 'Edit Past Meet' : 'Admin Controls: Add Past Meet'}
                        </h3>
                        {editingId && (
                            <button onClick={cancelEdit} className="text-white/50 hover:text-white transition-colors" title="Cancel Edit">
                                <X size={20} />
                            </button>
                        )}
                    </div>
                    
                    <form onSubmit={handleAddOrEdit} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Car Theme Name (e.g. JDM Night, Midnight Tuners)"
                            required
                            className="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-white focus:border-neon-purple outline-none transition-colors"
                            value={formData.themeName}
                            onChange={e => setFormData({...formData, themeName: e.target.value})}
                        />
                        <div className="grid grid-cols-1 gap-4">
                            <input
                                type="url"
                                placeholder="High-Res Image URL"
                                required
                                className="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-white focus:border-neon-purple outline-none transition-colors text-sm"
                                value={formData.imageUrl}
                                onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                            />
                        </div>
                        <button disabled={isSubmitting} type="submit" className="w-full py-3 bg-neon-purple/20 text-neon-purple hover:bg-neon-purple hover:text-white border border-neon-purple font-bold tracking-widest uppercase rounded transition-colors disabled:opacity-50">
                            {isSubmitting ? 'Saving...' : (editingId ? 'Update Collection' : 'Add to Collection')}
                        </button>
                    </form>
                </motion.div>
            )}

            {loading ? (
                <div className="text-center text-white/50 py-10 uppercase tracking-widest text-sm">Loading memories...</div>
            ) : meets.length === 0 ? (
                <div className="text-center text-white/50 py-10 uppercase tracking-widest">No previous meets logged yet.</div>
            ) : (                <>                <div className="flex flex-col space-y-20 md:space-y-28">
                      {meets.slice(0, visibleCount).map((meet, idx) => {
                        const url = meet.imageUrl || (meet.imageUrls && meet.imageUrls.length > 0 ? meet.imageUrls[0] : 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80&w=1000');

                        return (
                            <motion.div
                                key={meet._id}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-10%" }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} bg-charcoal/40 border border-white/5 rounded-xl overflow-hidden shadow-2xl group lg:max-h-[400px]`}
                            >
                                {/* Image Section */}
                                <div className="w-full lg:w-[50%] h-[300px] lg:h-[400px] relative overflow-hidden shrink-0">
                                     {/* Ambient Glow */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/20 via-transparent to-electric-blue/20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 mix-blend-overlay z-10"></div>
                                    
                                    {/* Scanline Effect */}
                                    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:100%_4px] z-10 mix-blend-overlay opacity-30"></div>
                                    
                                    <LazyImage
                                        src={url}
                                        variant="detail"
                                        alt={`${meet.themeName} Showcase`}
                                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filter saturate-75 group-hover:saturate-100"
                                        fallbackSrc='https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80&w=1000'
                                    />
                                    
                                    {/* Admin Action Tray */}
                                    {isAdmin && (
                                        <div className="absolute top-4 right-4 z-20 flex gap-2">
                                            {/* Position Arrows */}
                                            <div className="flex mr-2 bg-black/60 rounded-full backdrop-blur-md overflow-hidden">
                                                <button
                                                    onClick={() => handleMove(idx, 'up')}
                                                    disabled={idx === 0}
                                                    className="p-2 text-white/70 hover:text-white hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                                                    title="Move Up"
                                                >
                                                    <ChevronUp size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleMove(idx, 'down')}
                                                    disabled={idx === meets.length - 1}
                                                    className="p-2 text-white/70 hover:text-white hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent transition-colors border-l border-white/10"
                                                    title="Move Down"
                                                >
                                                    <ChevronDown size={16} />
                                                </button>
                                            </div>

                                                <button
                                                    onClick={() => handleEditClick(meet)}
                                                    className="p-2 bg-black/60 hover:bg-electric-blue/80 text-white rounded-full transition-colors backdrop-blur-md"
                                                    title="Edit Previous Meet"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                            <button
                                                onClick={() => handleDelete(meet._id, meet.themeName)}
                                                className="p-2 bg-black/60 hover:bg-neon-red/80 text-white rounded-full transition-colors backdrop-blur-md"
                                                title="Delete Previous Meet"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Text Section */}
                                <div className="w-full lg:w-[50%] p-6 md:p-8 lg:p-10 flex flex-col justify-center relative bg-charcoal/80 h-[300px] lg:h-[400px]">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="h-0.5 w-10 bg-neon-purple shadow-[0_0_10px_rgba(176,38,255,1)]"></div>
                                        <p className="text-white/80 font-medium tracking-[0.2em] uppercase text-xs sm:text-sm font-heading">
                                            Event Memory
                                        </p>
                                    </div>
                                    
                                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-black font-heading text-white uppercase tracking-wider mb-4">
                                        {meet.themeName}
                                    </h3>
                                    
                                    <p className="text-white/60 text-sm md:text-sm lg:text-base leading-relaxed mb-6">
                                        A look back at the incredible rides and memories from the {meet.themeName} event. Each meet pushes the limits of style and performance.
                                    </p>

                                    <div className="mt-auto">
                                        <span className="inline-block px-3 py-1.5 border border-white/10 rounded-sm text-[10px] sm:text-xs tracking-widest uppercase text-white/40">
                                            Archived Meet
                                        </span>
                                    </div>
                                </div>
                            {isAdmin && editingId === meet._id && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="p-6 bg-black/60 border-t border-white/10"
                                >
                                    <form onSubmit={handleAddOrEdit} className="space-y-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="text-neon-purple font-bold tracking-widest uppercase">Edit Meet</h3>
                                            <button type="button" onClick={cancelEdit} className="text-white/50 hover:text-white"><X size={18} /></button>
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Car Theme Name"
                                            required
                                            className="w-full bg-black/50 border border-white/10 rounded px-4 py-2 text-white focus:border-neon-purple outline-none"
                                            value={formData.themeName}
                                            onChange={e => setFormData({...formData, themeName: e.target.value})}
                                        />
                                        <input
                                            type="url"
                                            placeholder="High-Res Image URL"
                                            required
                                            className="w-full bg-black/50 border border-white/10 rounded px-4 py-2 text-white focus:border-neon-purple outline-none text-sm"
                                            value={formData.imageUrl}
                                            onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                                        />
                                        <div className="flex gap-2 pt-2">
                                            <button disabled={isSubmitting} type="submit" className="flex-1 py-3 bg-neon-purple/20 text-neon-purple hover:bg-neon-purple hover:text-white border border-neon-purple font-bold tracking-widest uppercase rounded transition-colors disabled:opacity-50">
                                                {isSubmitting ? 'Saving...' : 'Update Meet'}
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}
                            </motion.div>
                        );
                    })}
                </div>
                        {meets.length > visibleCount && (
                            <div className="mt-16 flex justify-center w-full relative z-20 pb-16">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const currentScrollY = window.scrollY;
                                        setVisibleCount(prev => prev + 5);
                                        setTimeout(() => {
                                            window.scrollTo({
                                                top: currentScrollY,
                                                behavior: "instant"
                                            });
                                        }, 5);
                                    }}
                                    className="px-8 py-4 border border-white/20 hover:border-neon-purple hover:bg-neon-purple/10 transition-all uppercase tracking-widest text-sm font-bold rounded-sm text-white flex items-center justify-center gap-3 backdrop-blur-md shadow-[0_0_15px_rgba(176,38,255,0.2)] hover:shadow-[0_0_25px_rgba(176,38,255,0.4)]"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-neon-purple animate-pulse"></span>
                                    Load More Meets
                                    <span className="w-1.5 h-1.5 rounded-full bg-neon-purple animate-pulse delay-100"></span>
                                </button>
                            </div>
                        )}
                </>
            )}
        </div>
    );
};

export default PreviousMeets;
