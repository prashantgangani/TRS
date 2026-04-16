import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Key, Users, Search, ArrowLeft, LogOut } from 'lucide-react';
import { API_URL } from '../config';
import { useNavigate, Link } from 'react-router-dom';

const PasswordManager = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const fetchMembers = async () => {
        try {
            const token = localStorage.getItem('trs_token');
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

    useEffect(() => {
        const role = localStorage.getItem('trs_role');
        if (role !== 'superadmin' && role !== 'passwordmanager') {
            navigate('/admin-login');
        } else {
            fetchMembers();
        }
    }, [navigate]);

    const handleResetPassword = async (id, memberName) => {
        const newPassword = window.prompt(`Enter new password for ${memberName}:`);
        if (!newPassword) return;

        try {
            const token = localStorage.getItem('trs_token');
            const res = await fetch(`${API_URL}/member-system/superadmin/members/${id}/reset-password`, {
                method: 'PATCH',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password: newPassword })
            });
            
            if (!res.ok) throw new Error('Password reset failed');
            setMessage({ text: `Password for ${memberName} updated successfully`, type: 'success' });
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        } catch (err) {
            setMessage({ text: err.message, type: 'error' });
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-deep-black text-white flex items-center justify-center pt-32 pb-32 uppercase tracking-widest text-lg">Loading Members...</div>;
    }

    const filteredMembers = (Array.isArray(members) ? members : []).filter(member => 
        member.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-deep-black text-white font-sans selection:bg-electric-blue/50 pt-24 pb-20">
            <div className="max-w-4xl mx-auto px-6">
                <div className="flex justify-between mb-8">
                    {localStorage.getItem('trs_role') === 'superadmin' ? (
                        <Link to="/controls" className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:border-electric-blue hover:bg-electric-blue/10 rounded-full transition-all text-xs font-bold uppercase tracking-wider text-white">
                            <ArrowLeft size={16} /> Back to Controls
                        </Link>
                    ) : (
                        <button onClick={() => { localStorage.clear(); navigate('/admin-login'); }} className="inline-flex items-center gap-2 px-4 py-2 bg-neon-red/10 border border-neon-red/30 hover:border-neon-red hover:bg-neon-red/20 rounded-full transition-all text-xs font-bold uppercase tracking-wider text-white">
                            <LogOut size={16} /> Logout
                        </button>
                    )}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl font-bold font-heading mb-4 text-white drop-shadow-lg flex items-center justify-between">
                        <span>Password <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-yellow-500">Manager</span></span>
                        <div className="glassmorphism p-3 rounded-full border border-white/10">
                            <Users className="text-electric-blue" size={28} />
                        </div>
                    </h1>
                    <p className="text-white/60">Secure vault for resetting crew member passwords.</p>
                </motion.div>

                {message.text && (
                    <div className={`p-4 mb-8 rounded border ${message.type === 'error' ? 'bg-red-500/10 border-red-500/50 text-red-400' : 'bg-green-500/10 border-green-500/50 text-green-400'}`}>
                        {message.text}
                    </div>
                )}

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <h2 className="text-xl font-heading font-bold uppercase tracking-wider">Crew Members</h2>
                        <span className="bg-[#2a2211] text-electric-blue font-sans px-3 py-1.5 rounded-md text-sm font-bold border border-electric-blue/20 w-fit">
                            {members.length} Total Members
                        </span>
                    </div>

                    <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-3 flex items-center gap-3 mb-6 shadow-md transition-all focus-within:border-electric-blue/50 focus-within:shadow-[0_0_15px_rgba(255,215,0,0.15)]">
                        <Search size={18} className="text-electric-blue drop-shadow-[0_0_8px_rgba(0,229,255,0.6)] ml-2" />
                        <input
                            type="text"
                            placeholder="Search member username..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-transparent border-none text-white focus:outline-none placeholder:text-white/30 text-sm"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredMembers.length === 0 ? (
                            <div className="p-8 text-center text-white/40 border border-white/5 rounded-xl border-dashed col-span-2">
                                {searchQuery ? 'No members found matching your search.' : 'No members found.'}
                            </div>
                        ) : (
                            filteredMembers.map(member => (
                                <div key={member._id} className="glass-panel p-5 rounded-xl border border-white/10 flex items-center justify-between group">
                                    <div>
                                        <div className="font-bold text-lg text-electric-blue">{member.username}</div>
                                    </div>
                                    <button 
                                        onClick={() => handleResetPassword(member._id, member.username)}
                                        className="px-4 py-2 bg-white/5 hover:bg-electric-blue/20 text-white/80 hover:text-electric-blue rounded border border-white/10 hover:border-electric-blue/50 transition-all flex items-center gap-2 text-sm"
                                    >
                                        <Key size={14} /> Reset 
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default PasswordManager;
