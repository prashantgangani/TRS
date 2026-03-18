import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ArrowUp, ArrowDown, Edit2 } from 'lucide-react';
import { API_URL } from '../config';
import { optimizeImage } from '../utils/imageOptimizer';
import OptimizedImage from '../components/OptimizedImage';
import LazyImage from '../components/LazyImage';

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" } }
};

const Memes = ({ isAdmin, isSuperAdmin }) => {
    const [memes, setMemes] = useState([]);
    const [loading, setLoading] = useState(true);

    const [imageUrl, setImageUrl] = useState('');
    const [title, setTitle] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Limit initial visible loaded memes
    const [visibleCount, setVisibleCount] = useState(12);

    const canEdit = isAdmin || isSuperAdmin;
    const adminUsername = localStorage.getItem('trs_username') || 'Unknown';

    const fetchMemes = async () => {
        try {
            const response = await fetch(`${API_URL}/memes`);
            const data = await response.json();
            setMemes(data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch memes:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMemes();
    }, []);

    const handleAddOrUpdateMeme = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const payload = { imageUrl, title, adminUsername };

        try {
            const method = editingId ? 'PUT' : 'POST';
            const endpoint = editingId ? `${API_URL}/memes/${editingId}` : `${API_URL}/memes`;
            const res = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                await fetchMemes();
                setImageUrl('');
                setTitle('');
                setEditingId(null);
            }
        } catch (error) {
            console.error("Failed to save meme:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this meme?")) return;
        try {
            await fetch(`${API_URL}/memes/${id}?adminUsername=${encodeURIComponent(adminUsername)}`, { method: 'DELETE' });
            fetchMemes();
        } catch (error) {
            console.error("Failed to delete meme", error);
        }
    };

    const handleEdit = (m) => {
        setEditingId(m._id);
        setImageUrl(m.imageUrl);
        setTitle(m.title || '');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleMove = async (index, direction) => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === memes.length - 1) return;

        const newItems = [...memes];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        
        const tempOrder = newItems[index].order;
        newItems[index].order = newItems[swapIndex].order;
        newItems[swapIndex].order = tempOrder;

        const tempObj = newItems[index];
        newItems[index] = newItems[swapIndex];
        newItems[swapIndex] = tempObj;
        setMemes(newItems);

        try {
            await fetch(`${API_URL}/memes/${newItems[index]._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order: newItems[index].order })
            });
            await fetch(`${API_URL}/memes/${newItems[swapIndex]._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order: newItems[swapIndex].order })
            });
        } catch (error) {
            console.error("Failed to update order:", error);
            fetchMemes(); 
        }
    };

    return (
        <section className="min-h-screen bg-deep-black pt-32 pb-24 px-6 md:px-12 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-[#FF00FF]/5 to-transparent pointer-events-none -z-10"></div>
            <div className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vw] bg-[#FF00FF]/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
            
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <span className="glassmorphism px-3 py-1 rounded-sm text-xs uppercase tracking-widest text-[#FF00FF] border-[#FF00FF]/30 mb-4 inline-block shadow-[0_0_10px_rgba(255,0,255,0.2)]">
                        The Gallery
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold font-heading mb-4 text-white drop-shadow-lg">
                        Crew <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF00FF] to-electric-blue">Memes</span>
                    </h1>
                    <p className="text-white/60 max-w-2xl mx-auto text-sm md:text-base">
                        The finest collection of Los Santos Underground memes.
                    </p>
                </motion.div>

                {loading ? (
                    <div className="text-center text-white/50 py-20 font-heading tracking-widest animate-pulse">Loading Database...</div>
                ) : (
                    <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {canEdit && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="glass-panel p-6 rounded-lg border-2 border-dashed border-[#FF00FF]/50 bg-[#FF00FF]/5 relative flex flex-col justify-center"
                            >
                                <h3 className="text-xl font-bold mb-4 font-heading text-[#FF00FF] flex items-center gap-2 drop-shadow-md">
                                    <Plus size={20} /> {editingId ? 'Modify Meme' : 'Upload Meme'}
                                </h3>
                                <form onSubmit={handleAddOrUpdateMeme} className="space-y-3">
                                    <input required type="text" placeholder="Image URL (e.g. https://...)" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF00FF]" />
                                    <input type="text" placeholder="Optional Title/Caption" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF00FF]" />
                                    <button disabled={isSubmitting} type="submit" className="w-full py-3 mt-4 bg-[#FF00FF] hover:bg-[#FF00FF]/80 text-white text-xs font-bold uppercase tracking-widest rounded transition-colors shadow-[0_0_15px_rgba(255,0,255,0.4)]">
                                        {isSubmitting ? (editingId ? 'Updating...' : 'Uploading...') : (editingId ? 'Update Record' : 'Upload Image')}
                                    </button>
                                    {editingId && (
                                        <button type="button" onClick={() => {
                                            setEditingId(null);
                                            setImageUrl(''); setTitle('');
                                        }} className="w-full py-2 mt-2 bg-black/50 border border-white/20 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest rounded transition-colors">
                                            Cancel Editing
                                        </button>
                                    )}
                                </form>
                            </motion.div>
                        )}

                        <AnimatePresence>
                            {memes.slice(0, visibleCount).map((meme, index) => (
                                <motion.div
                                    key={meme._id}
                                    variants={cardVariants}
                                    initial="hidden"
                                    animate="show"
                                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                    className="group relative h-96 md:h-[450px] rounded-lg overflow-hidden border border-white/10 shadow-lg hover:shadow-[0_0_25px_rgba(255,0,255,0.3)] transition-all duration-500"
                                >
                                        <LazyImage
                                            src={meme.imageUrl}
                                            variant="card"
                                            alt={meme.title}
                                            className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                                        />
                                    
                                    <div className="absolute bottom-0 w-full p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                        {meme.title && (
                                            <h3 className="text-xl font-bold font-heading text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                                                {meme.title}
                                            </h3>
                                        )}
                                    </div>

                                    {canEdit && (
                                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 p-2 rounded-lg backdrop-blur-sm border border-white/10">
                                            <button onClick={() => handleMove(index, 'up')} disabled={index === 0} className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                                                <ArrowUp size={16} />
                                            </button>
                                            <button onClick={() => handleMove(index, 'down')} disabled={index === memes.length - 1} className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                                                <ArrowDown size={16} />
                                            </button>
                                            <button onClick={() => handleEdit(meme)} className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-400/20 rounded transition-colors">
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(meme._id)} className="p-1.5 text-red-500 hover:text-red-400 hover:bg-red-500/20 rounded transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                    {memes.length > visibleCount && (
                        <div className="mt-12 flex justify-center w-full">
                            <button
                                onClick={() => setVisibleCount(prev => prev + 12)}
                                className="px-8 py-4 border border-white/20 hover:border-pink-500 hover:text-pink-500 transition-all uppercase tracking-widest text-sm font-bold rounded-sm text-white"
                            >
                                Load More
                            </button>
                        </div>
                    )}
                    </>
                )}
            </div>
        </section>
    );
};

export default Memes;
