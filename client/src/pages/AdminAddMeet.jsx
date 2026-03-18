import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_URL } from '../config';
import { logAdminAction } from '../utils/logger';

const AdminAddMeet = ({ isAdmin }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const editMeet = location.state?.editMeet || null;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState(editMeet ? {
        theme: editMeet.theme || '',
        date: editMeet.date || '',
        time: editMeet.time || '',
        location: editMeet.location || '',
        dressCode: editMeet.dressCode || '',
        car: editMeet.car || '',
        cmlLead: editMeet.cmlLead || '',
        host: editMeet.host || '',
        description: editMeet.description || '',
        rules: editMeet.rules || '',
        image: editMeet.image || ''
    } : {
        theme: '', date: '', time: '', location: '',
        dressCode: '', car: '', cmlLead: '', host: '', description: '', rules: '', image: ''
    });

    React.useEffect(() => {
        if (!isAdmin) {
            navigate('/');
        }
    }, [isAdmin, navigate]);

    if (!isAdmin) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddMeet = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const url = editMeet ? `${API_URL}/meets/${editMeet._id}` : `${API_URL}/meets`;
            const method = editMeet ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                const actionName = editMeet ? 'Updated Meet' : 'Created Meet';
                const actionDetails = editMeet 
                    ? `Theme: ${editMeet.theme} to ${formData.theme}`
                    : `Theme: ${formData.theme} | Date: ${formData.date}`;
                await logAdminAction(actionName, actionDetails);
                navigate('/');
            } else {
                console.error("Failed to add meet");
            }
        } catch (error) {
            console.error("Error adding meet:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-deep-black text-white pt-32 pb-32">
            <div className="max-w-4xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="glass-panel p-8 md:p-12 rounded-xl border border-neon-purple/30 relative"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-neon-purple/5 blur-3xl -z-10 rounded-full"></div>
                    
                    <h1 className="text-3xl md:text-5xl font-black font-heading tracking-tight mb-2 text-glow">
                        {editMeet ? 'Update ' : 'Publish '}<span className="text-neon-purple">Meet intel</span>
                    </h1>
                    <p className="text-white/50 mb-10 text-sm uppercase tracking-widest gap-2">Official Dispatch Console</p>

                    <form onSubmit={handleAddMeet} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-white/50 mb-2 font-bold">Theme</label>
                                <input required type="text" name="theme" value={formData.theme} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-neon-purple transition-colors" placeholder="e.g. Midnight Muscle" />
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-white/50 mb-2 font-bold">Location</label>
                                <input required type="text" name="location" value={formData.location} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-neon-purple transition-colors" placeholder="e.g. Cypress Flats" />
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-white/50 mb-2 font-bold">Date</label>
                                <input required type="text" name="date" value={formData.date} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-neon-purple transition-colors" placeholder="e.g. 24th October" />
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-white/50 mb-2 font-bold">Time</label>
                                <input required type="text" name="time" value={formData.time} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-neon-purple transition-colors" placeholder="e.g. 10:00 PM EST" />
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-white/50 mb-2 font-bold">Dress Code</label>
                                <input required type="text" name="dressCode" value={formData.dressCode} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-neon-purple transition-colors" placeholder="e.g. Tuner Casual" />
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-white/50 mb-2 font-bold">Car Required</label>
                                <input required type="text" name="car" value={formData.car} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-neon-purple transition-colors" placeholder="e.g. JDM Only" />
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-white/50 mb-2 font-bold">Cml/Lead</label>
                                <input required type="text" name="cmlLead" value={formData.cmlLead} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-neon-purple transition-colors" placeholder="Crew Management Lead" />
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-white/50 mb-2 font-bold">Host</label>
                                <input required type="text" name="host" value={formData.host} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-neon-purple transition-colors" placeholder="Host Tag/Name" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs uppercase tracking-widest text-white/50 mb-2 font-bold">Cover Image Path</label>
                                <input type="text" name="image" value={formData.image} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-neon-purple transition-colors" placeholder="e.g. /images/meet1.jpg (Leave empty for default)" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-widest text-white/50 mb-2 font-bold">Lore / Description</label>
                            <textarea required name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-neon-purple transition-colors resize-none" placeholder="Enter a brief background or lore description for this meet..."></textarea>
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-widest text-white/50 mb-2 font-bold">Rules / Guidelines</label>
                            <textarea required name="rules" value={formData.rules} onChange={handleChange} rows="6" className="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-neon-purple transition-colors resize-none" placeholder="Enter rules here... Use Enter for new lines"></textarea>
                        </div>

                        <div className="pt-6 border-t border-white/10 flex justify-end gap-4">
                            <button type="button" onClick={() => navigate('/')} className="px-8 py-3 bg-transparent border border-white/20 hover:border-white text-white text-sm font-bold uppercase tracking-widest rounded transition-colors">
                                Cancel
                            </button>
                            <button disabled={isSubmitting} type="submit" className="px-8 py-3 bg-neon-purple hover:bg-neon-purple/80 text-white text-sm font-bold uppercase tracking-widest rounded transition-colors shadow-[0_0_15px_rgba(176,38,255,0.4)]">
                                {isSubmitting ? 'Transmitting...' : (editMeet ? 'Update Meet' : 'Upload Meet')}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminAddMeet;
