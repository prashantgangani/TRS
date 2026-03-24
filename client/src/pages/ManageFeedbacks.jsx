import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, CheckCircle, MessageSquare, Clock } from 'lucide-react';
import { API_URL } from '../config';

const ManageFeedbacks = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchFeedbacks = async () => {
        try {
            const response = await fetch(`${API_URL}/feedbacks`);
            const data = await response.json();
            setFeedbacks(data);
        } catch (error) {
            console.error("Failed to fetch feedbacks:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Permanently delete this feedback?")) return;
        try {
            const response = await fetch(`${API_URL}/feedbacks/${id}`, { method: 'DELETE' });
            if (response.ok) {
                setFeedbacks(feedbacks.filter(f => f._id !== id));
            }
        } catch (error) {
            console.error("Error deleting feedback:", error);
        }
    };

    const handleReview = async (id) => {
        try {
            const response = await fetch(`${API_URL}/feedbacks/${id}/review`, { method: 'PUT' });
            if (response.ok) {
                const updatedFeedback = await response.json();
                setFeedbacks(feedbacks.map(f => f._id === id ? updatedFeedback : f));
            }
        } catch (error) {
            console.error("Error reviewing feedback:", error);
        }
    };

    // Sort: Unreviewed first (top), then Reviewed (bottom), then by creation date.
    const sortedFeedbacks = [...feedbacks].sort((a, b) => {
        if (a.reviewed === b.reviewed) {
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return a.reviewed ? 1 : -1;
    });

    return (
        <section className="min-h-screen bg-deep-black pt-32 pb-24 px-6 md:px-12 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none -z-10"></div>
            
            <div className="max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <span className="glassmorphism px-3 py-1 rounded-sm text-xs uppercase tracking-widest text-electric-blue border-electric-blue/30 mb-4 inline-block shadow-[0_0_10px_rgba(0,229,255,0.2)]">
                        Command Center
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4 text-white drop-shadow-lg">
                        Manage <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-blue-500">Feedback</span>
                    </h1>
                </motion.div>

                {loading ? (
                    <div className="text-white/50 text-center py-10 tracking-widest uppercase text-sm">Loading Communications...</div>
                ) : (
                    <div className="space-y-4">
                        {sortedFeedbacks.length === 0 ? (
                            <div className="glass-panel p-10 text-center rounded-xl border border-white/10">
                                <MessageSquare className="mx-auto mb-4 text-white/30" size={48} />
                                <p className="text-white/50 text-sm tracking-widest uppercase">No feedback records found</p>
                            </div>
                        ) : (
                            <AnimatePresence>
                                {sortedFeedbacks.map(feedback => (
                                    <motion.div
                                        key={feedback._id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.3 }}
                                        className={`glass-panel p-6 rounded-xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-all duration-500 ${
                                            feedback.reviewed 
                                                ? 'border-green-500/30 bg-green-500/5' 
                                                : 'border-white/10 hover:border-electric-blue/50'
                                        }`}
                                    >
                                        <div className="flex-1 w-full text-left">
                                            <div className="flex items-center gap-3 mb-2">
                                                {feedback.reviewed ? (
                                                    <span className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-green-400 font-bold bg-green-400/10 px-2 py-1 rounded">
                                                        <CheckCircle size={12} /> Reviewed
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-electric-blue font-bold bg-electric-blue/10 px-2 py-1 rounded">
                                                        <Clock size={12} /> Pending Review
                                                    </span>
                                                )}
                                                <span className="text-[10px] text-white/40 tracking-widest uppercase">
                                                    {new Date(feedback.createdAt).toLocaleString()}
                                                </span>
                                            </div>
                                            <p className={`text-sm md:text-base leading-relaxed ${feedback.reviewed ? 'text-white/60' : 'text-white/90'}`}>
                                                {feedback.text}
                                            </p>
                                        </div>
                                        
                                        <div className="flex gap-3 w-full md:w-auto shrink-0 justify-end">
                                            {!feedback.reviewed && (
                                                <button 
                                                    onClick={() => handleReview(feedback._id)} 
                                                    className="px-4 py-2 bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white rounded border border-green-500/30 transition-colors flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider flex-1 md:flex-auto"
                                                >
                                                    <CheckCircle size={16} /> Mark Reviewed
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => handleDelete(feedback._id)} 
                                                className="px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded border border-red-500/30 transition-colors flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider flex-1 md:flex-auto"
                                            >
                                                <Trash2 size={16} /> Delete
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default ManageFeedbacks;