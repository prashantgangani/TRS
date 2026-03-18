import { optimizeImage } from '../utils/imageOptimizer';
import OptimizedImage from '../components/OptimizedImage';
import LazyImage from '../components/LazyImage';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Plus, Edit2, X, ChevronUp, ChevronDown } from 'lucide-react';
import { API_URL } from '../config';
import { logAdminAction } from '../utils/logger';

const PreviousMeets = ({ isAdmin }) => {
    const [meets, setMeets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ themeName: '', url1: '', url2: '', url3: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Limit initial loaded meets for bandwidth
    const [visibleCount, setVisibleCount] = useState(5); // 5 meets, each has up to 3 images

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
        
        const imageUrls = [formData.url1, formData.url2, formData.url3].filter(Boolean);
        const payload = {
            themeName: formData.themeName,
            imageUrls
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
                    setFormData({ themeName: '', url1: '', url2: '', url3: '' });
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
                    setFormData({ themeName: '', url1: '', url2: '', url3: '' });
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
        const urls = meet.imageUrls && meet.imageUrls.length > 0 ? meet.imageUrls : [meet.imageUrl];
        setFormData({
            themeName: meet.themeName,
            url1: urls[0] || '',
            url2: urls[1] || '',
            url3: urls[2] || ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setFormData({ themeName: '', url1: '', url2: '', url3: '' });
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

            {isAdmin && (
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input
                                type="url"
                                placeholder="Image URL 1"
                                required={!formData.url2 && !formData.url3}
                                className="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-white focus:border-neon-purple outline-none transition-colors text-sm"
                                value={formData.url1}
                                onChange={e => setFormData({...formData, url1: e.target.value})}
                            />
                            <input
                                type="url"
                                placeholder="Image URL 2 (Optional)"
                                className="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-white focus:border-neon-purple outline-none transition-colors text-sm"
                                value={formData.url2}
                                onChange={e => setFormData({...formData, url2: e.target.value})}
                            />
                            <input
                                type="url"
                                placeholder="Image URL 3 (Optional)"
                                className="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-white focus:border-neon-purple outline-none transition-colors text-sm"
                                value={formData.url3}
                                onChange={e => setFormData({...formData, url3: e.target.value})}
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
                        const urls = meet.imageUrls && meet.imageUrls.length > 0 
                            ? meet.imageUrls 
                            : [meet.imageUrl || 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80&w=1000'];

                        return (
                            <motion.div
                                key={meet._id}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-10%" }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                className="w-full"
                            >
                                {/* Master Topic/Title Area */}
                                <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-white/5 pb-4 mb-8">
                                    <h3 className="text-3xl md:text-5xl font-black font-heading text-white uppercase tracking-wider drop-shadow-[0_0_12px_rgba(0,0,0,1)]">
                                        {meet.themeName}
                                    </h3>
                                    
                                    {/* Admin Action Tray */}
                                    {isAdmin && (
                                        <div className="flex items-center gap-2 mt-4 md:mt-0">
                                            {/* Position Arrows */}
                                            <div className="flex mr-4 bg-black/40 rounded-lg border border-white/10 overflow-hidden">
                                                <button
                                                    onClick={() => handleMove(idx, 'up')}
                                                    disabled={idx === 0}
                                                    className="p-2 text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                                                    title="Move Up"
                                                >
                                                    <ChevronUp size={20} />
                                                </button>
                                                <button
                                                    onClick={() => handleMove(idx, 'down')}
                                                    disabled={idx === meets.length - 1}
                                                    className="p-2 text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors border-l border-white/10"
                                                    title="Move Down"
                                                >
                                                    <ChevronDown size={20} />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => handleEditClick(meet)}
                                                className="p-3 bg-electric-blue/10 border border-electric-blue/30 text-electric-blue hover:bg-electric-blue hover:text-white rounded-lg transition-colors"
                                                title="Edit Previous Meet"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(meet._id, meet.themeName)}
                                                className="p-3 bg-neon-red/10 border border-neon-red/30 text-neon-red hover:bg-neon-red hover:text-white rounded-lg transition-colors"
                                                title="Delete Previous Meet"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Dynamic Grid Render based on image count */}
                                <div className={`grid gap-6 md:gap-10 perspective-[1000px] ${
                                    urls.length === 1 ? 'grid-cols-1' :
                                    urls.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
                                    'grid-cols-1 md:grid-cols-3'
                                }`}>
                                    {urls.map((url, i) => (
                                        <motion.div
                                            key={`${meet._id}-img-${i}`}
                                            className="group relative w-full h-[200px] md:h-[270px] rounded-tr-3xl rounded-bl-3xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] p-[2px]"
                                            whileHover={{ rotateX: 2, rotateY: -2, z: 10, boxShadow: "0 25px 50px -12px rgba(176,38,255,0.3)" }}
                                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-br from-neon-purple via-charcoal to-electric-blue opacity-50 group-hover:opacity-100 transition-opacity duration-700 animate-pulse-slow"></div>
                                            <div className="absolute inset-[2px] rounded-tr-[22px] rounded-bl-[22px] bg-charcoal overflow-hidden relative">
                                                  <LazyImage
                                                      src={url}
                                                      variant="card"
                                                      alt={`${meet.themeName} Plaque ${i + 1}`}
                                                      className="transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.03]"
                                                      fallbackSrc='https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80&w=1000'
                                                />
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
                {meets.length > visibleCount && (
                    <div className="mt-12 flex justify-center pb-8">
                        <button
                            onClick={() => setVisibleCount(prev => prev + 5)}
                            className="px-8 py-4 border border-neon-purple/50 hover:bg-neon-purple/20 text-white transition-all uppercase tracking-widest text-sm font-bold rounded-sm"
                        >
                            Load More Meets
                        </button>
                    </div>
                )}
                </>
            )}
        </div>
    );
};

export default PreviousMeets;
