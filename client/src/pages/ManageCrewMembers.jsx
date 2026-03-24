import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Key, Users, Search, RefreshCw, Save } from 'lucide-react';
import { API_URL } from '../config';
import { useNavigate } from 'react-router-dom';

const ManageCrewMembers = () => {
    const [members, setMembers] = useState([]);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [searchQuery, setSearchQuery] = useState('');
    const [garageLimit, setGarageLimit] = useState(3);
    const [isSavingLimit, setIsSavingLimit] = useState(false);
    const navigate = useNavigate();

    const fetchMembers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/member-system/superadmin/members`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to fetch members');
            const data = await res.json();
            setMembers(data);
        } catch (err) {
            setMessage({ text: err.message, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const fetchSettings = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/settings`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                if (data.garageUpdateLimit !== undefined) {
                    setGarageLimit(data.garageUpdateLimit);
                }
            }
        } catch (err) {
            console.error('Error fetching settings:', err);
        }
    };

    useEffect(() => {
        // Simple client-side superadmin check
        const role = localStorage.getItem('role');
        if (role !== 'superadmin') {
            navigate('/admin-login');
        } else {
            fetchMembers();
            fetchSettings();
        }
    }, [navigate]);

    const handleCreateMember = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/member-system/superadmin/members`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Creation failed');
            
            setMessage({ text: 'Member and Garage Card created successfully!', type: 'success' });
            setUsername('');
            setPassword('');
            fetchMembers();
        } catch (err) {
            setMessage({ text: err.message, type: 'error' });
        }
    };

    const handleDeleteMember = async (id) => {
        if (!window.confirm('Delete this member? Their garage card will be orphaned.')) return;
        
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/member-system/superadmin/members/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (!res.ok) throw new Error('Deletion failed');
            fetchMembers();
        } catch (err) {
            setMessage({ text: err.message, type: 'error' });
        }
    };

    const handleResetPassword = async (id) => {
        const newPassword = window.prompt('Enter new password for member:');
        if (!newPassword) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/member-system/superadmin/members/${id}/reset-password`, {
                method: 'PATCH',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password: newPassword })
            });
            
            if (!res.ok) throw new Error('Password reset failed');
            setMessage({ text: 'Password reset successfully', type: 'success' });
        } catch (err) {
            setMessage({ text: err.message, type: 'error' });
        }
    };

    const handleUpdateLimit = async () => {
        setIsSavingLimit(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/settings`, {
                method: 'PUT',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ garageUpdateLimit: parseInt(garageLimit) })
            });
            if (!res.ok) throw new Error('Failed to update limit');
            setMessage({ text: 'Garage update limit saved successfully', type: 'success' });
            // re-fetch to sync just in case
            fetchSettings();
        } catch (err) {
            setMessage({ text: err.message, type: 'error' });
        } finally {
            setIsSavingLimit(false);
        }
    };

    const handleResetAllLimits = async () => {
        if (!window.confirm('Are you sure you want to reset the push update limits for ALL members to 0?')) return;
        
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/member-system/superadmin/reset-push-limits`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to reset limits');
            setMessage({ text: 'All member push limits have been reset to 0.', type: 'success' });
            fetchMembers();
        } catch (err) {
            setMessage({ text: err.message, type: 'error' });
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-deep-black text-white flex items-center justify-center pt-32 pb-32 uppercase tracking-widest text-lg">Loading Members...</div>;
    }

    const filteredMembers = members.filter(member => 
        member.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-deep-black text-white font-sans selection:bg-ls-orange/50 pt-24 pb-20">
            <div className="max-w-4xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <button onClick={() => navigate('/smart-admin')} className="text-sm text-ls-gold hover:text-white transition-colors mb-4 inline-block">&larr; Back to Smart Admin</button>
                    <h1 className="text-4xl font-bold font-heading mb-4 text-white drop-shadow-lg flex items-center justify-between">
                        <span>Manage <span className="text-transparent bg-clip-text bg-gradient-to-r from-ls-orange to-ls-gold">Crew Models</span></span>
                        <div className="glassmorphism p-3 rounded-full border border-white/10">
                            <Users className="text-ls-orange" size={28} />
                        </div>
                    </h1>
                    <p className="text-white/60">Create self-service logins for crew members. Generating a member automatically creates a default Garage Card linked to them.</p>
                </motion.div>

                {message.text && (
                    <div className={`p-4 mb-8 rounded border ${message.type === 'error' ? 'bg-red-500/10 border-red-500/50 text-red-400' : 'bg-green-500/10 border-green-500/50 text-green-400'}`}>
                        {message.text}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1 space-y-6">
                        {/* Add Member Form */}
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass-panel border border-white/10 rounded-xl p-6 h-fit"
                        >
                            <h2 className="text-xl font-heading font-bold mb-6 flex items-center gap-2"><Plus size={18} className="text-ls-gold"/> New Member</h2>
                            <form onSubmit={handleCreateMember} className="space-y-4">
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-white/50 mb-2">Username (Discord Tag)</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-charcoal border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-ls-orange transition-colors"
                                        placeholder="e.g. ghost_rider"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-white/50 mb-2">Temporary Password</label>
                                    <input 
                                        type="password" 
                                        className="w-full bg-charcoal border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-ls-orange transition-colors"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required 
                                    />
                                </div>
                                <button type="submit" className="w-full py-3 bg-white text-black font-bold uppercase tracking-wider rounded border border-transparent hover:bg-transparent hover:border-white hover:text-white transition-all text-sm">
                                    Create Account
                                </button>
                            </form>
                        </motion.div>

                        {/* Push Limit Panel */}
                        <motion.div 
                            initial={{ opacity: 0, x: -20, y: 20 }}
                            animate={{ opacity: 1, x: 0, y: 0 }}
                            className="glass-panel border border-white/10 rounded-xl p-6 h-fit"
                        >
                            <h2 className="text-xl font-heading font-bold mb-4 flex items-center gap-2"><RefreshCw size={18} className="text-ls-orange"/> Sync Limits</h2>
                            <p className="text-xs text-white/50 mb-6">Set how many times a crew member can push image updates to their Garage Card.</p>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-white/50 mb-2">Max Push Updates</label>
                                    <div className="flex gap-2">
                                        <input 
                                            type="number" 
                                            min="1"
                                            className="w-full bg-charcoal border border-white/10 rounded px-4 py-2 text-white focus:outline-none focus:border-ls-orange transition-colors"
                                            value={garageLimit}
                                            onChange={(e) => setGarageLimit(e.target.value)}
                                        />
                                        <button 
                                            onClick={handleUpdateLimit}
                                            disabled={isSavingLimit}
                                            className="px-4 py-2 bg-ls-orange/20 text-ls-orange hover:bg-ls-orange hover:text-white rounded transition-colors flex items-center justify-center"
                                            title="Save Limit"
                                        >
                                            <Save size={18} />
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="pt-4 border-t border-white/10">
                                    <button 
                                        onClick={handleResetAllLimits}
                                        className="w-full py-3 bg-red-500/10 text-red-400 font-bold uppercase tracking-wider rounded border border-red-500/30 hover:bg-red-500 hover:text-white transition-all text-sm flex items-center justify-center gap-2"
                                    >
                                        <RefreshCw size={16} /> Reset All Limits to 0
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Member List */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="md:col-span-2 space-y-4"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                            <h2 className="text-xl font-heading font-bold uppercase tracking-wider">Active Crew Network</h2>
                            <span className="bg-[#112a2e] text-[#00e5ff] font-sans px-3 py-1.5 rounded-md text-sm font-bold border border-[#00e5ff]/20 w-fit">
                                {members.length} Accounts Active
                            </span>
                        </div>

                        <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-3 flex items-center gap-3 mb-6 shadow-md transition-all focus-within:border-ls-gold/50 focus-within:shadow-[0_0_15px_rgba(0,229,255,0.15)]">
                            <Search size={18} className="text-ls-gold drop-shadow-[0_0_8px_rgba(0,229,255,0.6)] ml-2" />
                            <input
                                type="text"
                                placeholder="Search active crew members..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-transparent border-none text-white focus:outline-none placeholder:text-white/30 text-sm"
                            />
                        </div>

                        {filteredMembers.length === 0 ? (
                            <div className="p-8 text-center text-white/40 border border-white/5 rounded-xl border-dashed">
                                {searchQuery ? 'No active members found.' : 'No active members found.'}
                            </div>
                        ) : (
                            filteredMembers.map(member => (
                                <div key={member._id} className="glass-panel p-5 rounded-xl border border-white/10 flex items-center justify-between group">
                                    <div>
                                        <div className="font-bold text-lg">{member.username}</div>
                                        <div className="text-xs text-white/40 flex items-center gap-2 mt-1">
                                            Status: <span className={member.isActive ? 'text-green-400' : 'text-red-400'}>{member.isActive ? 'ACTIVE' : 'INACTIVE'}</span>
                                        </div>
                                        <div className="text-xs text-white/50 flex items-center gap-2 mt-1">
                                            Push Updates: <span className={(member.usedPushUpdates || 0) >= garageLimit ? 'text-red-400 font-bold' : 'text-ls-orange'}>{member.usedPushUpdates || 0} / {garageLimit}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button 
                                            onClick={() => handleResetPassword(member._id)}
                                            className="p-2 bg-white/5 hover:bg-ls-gold/20 text-white/60 hover:text-ls-gold rounded transition-colors"
                                            title="Reset Password"
                                        >
                                            <Key size={16} />
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteMember(member._id)}
                                            className="p-2 bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-400 rounded transition-colors"
                                            title="Delete Member"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ManageCrewMembers;
