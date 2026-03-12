import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Shield, ShieldCheck, Trash2, X, AlertTriangle, ListFilter, Search, ShieldAlert, KeyRound } from 'lucide-react';
import { API_URL } from '../config';

const StaffManagement = () => {
    const [admins, setAdmins] = useState([]);
    const [newName, setNewName] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    
    // Retrieve token for authenticated SuperAdmin requests
    const token = localStorage.getItem('trs_token');

    const fetchAdmins = async () => {
        try {
            const response = await fetch(`${API_URL}/auth/admins`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setAdmins(data);
            } else {
                console.error("Auth error:", data.message);
            }
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch admins:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchAdmins();
    }, [token]);

    const handleAddAdmin = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        
        try {
            const response = await fetch(`${API_URL}/auth/register-admin`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ name: newName, password: newPassword })
            });
            const data = await response.json();
            
            if (response.ok) {
                fetchAdmins();
                setNewName('');
                setNewPassword('');
            } else {
                setError(data.message || 'Failed to create admin');
            }
        } catch (err) {
            setError('Server error.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Revoke admin access for this user?")) return;
        
        try {
            const response = await fetch(`${API_URL}/auth/admins/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setAdmins(admins.filter(admin => admin._id !== id));
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="mt-32 max-w-5xl mx-auto border-t border-white/10 pt-16">
            <div className="text-center mb-12">
                <span className="glassmorphism px-3 py-1 rounded-sm text-xs uppercase tracking-widest text-neon-red border-neon-red/30 mb-4 inline-block shadow-[0_0_10px_rgba(255,51,102,0.2)]">
                    Highly Classified
                </span>
                <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4 text-white flex items-center justify-center gap-3 drop-shadow-lg">
                    <ShieldAlert className="text-neon-red" size={36} /> Staff Clearance
                </h2>
                <p className="text-white/60 text-sm max-w-xl mx-auto">
                    Master terminal. Generate new Administrator credentials to grant access to Meets and Showroom posting. Revoke access from compromised individuals instantly.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Generation Terminal */}
                <div className="md:col-span-1">
                    <div className="glass-panel p-6 rounded-xl border border-neon-red/30 bg-neon-red/5">
                        <h3 className="text-lg font-bold font-heading text-white flex items-center gap-2 mb-6">
                            <KeyRound className="text-neon-red" size={20} /> Grant Access
                        </h3>
                        
                        <form onSubmit={handleAddAdmin} className="space-y-4">
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-2">Assign Alias</label>
                                <input required type="text" value={newName} onChange={e => setNewName(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-red" placeholder="Officer Name" />
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-2">Assign Passcode</label>
                                <input required type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-red" placeholder="••••••••" />
                            </div>
                            
                            {error && <p className="text-red-400 text-xs font-bold">{error}</p>}
                            
                            <button disabled={isSubmitting} type="submit" className="w-full py-3 mt-2 bg-neon-red hover:bg-neon-red/80 text-white text-xs font-bold uppercase tracking-widest rounded transition-colors shadow-[0_0_15px_rgba(255,51,102,0.4)]">
                                {isSubmitting ? 'Encrypting...' : 'Generate Credentials'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Active Credentials Log */}
                <div className="md:col-span-2">
                    <div className="glass-panel rounded-xl border border-white/10 overflow-hidden h-full flex flex-col">
                        <div className="bg-white/5 p-4 border-b border-white/10 flex justify-between items-center">
                            <h3 className="font-bold text-sm uppercase tracking-widest text-white/80">Active Admin Network</h3>
                            <span className="text-xs text-neon-purple font-bold px-2 py-1 bg-neon-purple/20 rounded">{admins.length} Systems Online</span>
                        </div>
                        
                        <div className="p-4 flex-1 overflow-y-auto max-h-[300px] space-y-3">
                            {loading ? (
                                <div className="text-white/30 text-xs uppercase tracking-widest text-center py-10">Accessing Mainframe...</div>
                            ) : admins.length === 0 ? (
                                <div className="text-white/30 text-xs uppercase tracking-widest text-center py-10">No active standard administrators found.</div>
                            ) : (
                                <AnimatePresence>
                                    {admins.map(admin => (
                                        <motion.div 
                                            key={admin._id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="flex items-center justify-between p-3 bg-black/40 border border-white/5 rounded hover:border-white/20 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-neon-red shadow-[0_0_10px_rgba(255,51,102,0.1)]">
                                                    <ShieldAlert size={14} />
                                                </div>
                                                <div>
                                                    <div className="text-white font-bold">{admin.name}</div>
                                                    <div className="text-[10px] text-white/40 uppercase tracking-widest font-mono">ID: {admin._id.slice(-6)}</div>
                                                </div>
                                            </div>
                                            
                                            <button 
                                                onClick={() => handleDelete(admin._id)}
                                                className="px-3 py-1.5 text-[10px] text-white/50 hover:text-white hover:bg-neon-red bg-black border border-white/10 rounded uppercase tracking-widest transition-colors font-bold"
                                            >
                                                Revoke
                                            </button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffManagement;
