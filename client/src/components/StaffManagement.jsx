import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Shield, ShieldCheck, Trash2, X, AlertTriangle, ListFilter, Search, ShieldAlert, KeyRound, Users } from 'lucide-react';
import { API_URL } from '../config';

const StaffManagement = () => {
    const [admins, setAdmins] = useState([]);
    const [newName, setNewName] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newSmartName, setNewSmartName] = useState('');
    const [newSmartPassword, setNewSmartPassword] = useState('');
    
    // Member generation state
    const [newMemberName, setNewMemberName] = useState('');
    const [newMemberPassword, setNewMemberPassword] = useState('');
    const [memberError, setMemberError] = useState('');
    const [memberSuccess, setMemberSuccess] = useState('');
    const [crewMembers, setCrewMembers] = useState([]);
    const [loadingMembers, setLoadingMembers] = useState(true);
    const [searchCrew, setSearchCrew] = useState('');

    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [smartError, setSmartError] = useState('');
    
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

    const fetchMembers = async () => {
        try {
            const response = await fetch(`${API_URL}/member-system/superadmin/members`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setCrewMembers(data);
            }
            setLoadingMembers(false);
        } catch (error) {
            console.error("Failed to fetch members:", error);
            setLoadingMembers(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchAdmins();
            fetchMembers();
        }
    }, [token]);

    const handleAddAdmin = async (e, roleType = 'admin') => {
        e.preventDefault();
        setIsSubmitting(true);
        if (roleType === 'admin') setError('');
        else setSmartError('');
        
        try {
            const reqName = roleType === 'admin' ? newName : newSmartName;
            const reqPass = roleType === 'admin' ? newPassword : newSmartPassword;
            
            const response = await fetch(`${API_URL}/auth/register-admin`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ name: reqName, password: reqPass, role: roleType })
            });
            const data = await response.json();
            
            if (response.ok) {
                fetchAdmins();
                if (roleType === 'admin') {
                    setNewName('');
                    setNewPassword('');
                } else {
                    setNewSmartName('');
                    setNewSmartPassword('');
                }
            } else {
                if (roleType === 'admin') setError(data.message || 'Failed to create admin');
                else setSmartError(data.message || 'Failed to create admin');
            }
        } catch (err) {
            if (roleType === 'admin') setError('Server error.');
            else setSmartError('Server error.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddMember = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMemberError('');
        setMemberSuccess('');
        
        try {
            const response = await fetch(`${API_URL}/member-system/superadmin/members`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ username: newMemberName, password: newMemberPassword })
            });
            const data = await response.json();
            
            if (response.ok) {
                setMemberSuccess('Member & Garage Card Generated.');
                setNewMemberName('');
                setNewMemberPassword('');
                fetchMembers();
                setTimeout(() => setMemberSuccess(''), 4000);
            } else {
                setMemberError(data.message || 'Failed to create member');
            }
        } catch (err) {
            setMemberError('Server error.');
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

    const handleDeleteMember = async (id) => {
        if (!window.confirm("Revoke member access for this user? Their garage card will become orphaned.")) return;
        try {
            const response = await fetch(`${API_URL}/member-system/superadmin/members/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setCrewMembers(crewMembers.filter(m => m._id !== id));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleResetMemberPassword = async (id) => {
        const newPassword = window.prompt("Enter new password for this member:");
        if (!newPassword) return;
        
        try {
            const response = await fetch(`${API_URL}/member-system/superadmin/members/${id}/reset-password`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ password: newPassword })
            });
            if (response.ok) {
                alert("Password updated successfully.");
            } else {
                alert("Failed to reset password.");
            }
        } catch (error) {
            console.error(error);
            alert("Error resetting password.");
        }
    };

    const filteredCrewMembers = crewMembers.filter(member => 
        member.username.toLowerCase().includes(searchCrew.toLowerCase())
    );

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
                            <span className="text-xs text-neon-red font-bold px-2 py-1 bg-neon-red/20 rounded">{admins.filter(a => a.role === 'admin').length} Systems Online</span>
                        </div>
                        
                        <div className="p-4 flex-1 overflow-y-auto max-h-[300px] space-y-3">
                            {loading ? (
                                <div className="text-white/30 text-xs uppercase tracking-widest text-center py-10">Accessing Mainframe...</div>
                            ) : admins.filter(a => a.role === 'admin').length === 0 ? (
                                <div className="text-white/30 text-xs uppercase tracking-widest text-center py-10">No active administrators found.</div>
                            ) : (
                                <AnimatePresence>
                                    {admins.filter(a => a.role === 'admin').map(admin => (
                                        <motion.div 
                                            key={admin._id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="flex items-center justify-between p-3 bg-black/40 border border-white/5 rounded hover:border-white/20 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shadow-[0_0_10px_rgba(255,51,102,0.1)] ${admin.role === 'smartadmin' ? 'text-neon-purple' : 'text-neon-red'}`}>
                                                    <ShieldAlert size={14} />
                                                </div>
                                                <div>
                                                    <div className="text-white font-bold">{admin.name} <span className="text-[9px] uppercase ml-2 text-white/40 bg-black px-1.5 py-0.5 rounded">{admin.role}</span></div>
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

            {/* Additional Generation Terminals - Smart Admin */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Smart Admin Generation Terminal */}
                <div className="md:col-span-1 glass-panel p-6 rounded-xl border border-neon-purple/30 bg-neon-purple/5">
                    <h3 className="text-lg font-bold font-heading text-white flex items-center gap-2 mb-2 justify-center">
                        <KeyRound className="text-neon-purple" size={20} /> Smart Admin Access
                    </h3>
                    <p className="text-[10px] text-center text-white/50 uppercase tracking-widest mb-6">Create credentials restricted strictly to the Smart Admin Panel.</p>
                    
                    <form onSubmit={(e) => handleAddAdmin(e, 'smartadmin')} className="space-y-4">
                        <div>
                            <input required type="text" value={newSmartName} onChange={e => setNewSmartName(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-purple text-center" placeholder="Smart Admin Alias" />
                        </div>
                        <div>
                            <input required type="password" value={newSmartPassword} onChange={e => setNewSmartPassword(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-purple text-center" placeholder="••••••••" />
                        </div>
                        
                        {smartError && <p className="text-red-400 text-xs font-bold text-center">{smartError}</p>}
                        
                        <button disabled={isSubmitting} type="submit" className="w-full py-3 mt-2 bg-neon-purple hover:bg-neon-purple/80 text-white text-xs font-bold uppercase tracking-widest rounded transition-colors shadow-[0_0_15px_rgba(176,38,255,0.4)]">
                            {isSubmitting ? 'Encrypting...' : 'Generate Smart Admin'}
                        </button>
                    </form>
                </div>

                {/* Active Smart Admin Log */}
                <div className="md:col-span-2">
                    <div className="glass-panel rounded-xl border border-white/10 overflow-hidden h-full flex flex-col">
                        <div className="bg-white/5 p-4 border-b border-white/10 flex justify-between items-center">
                            <h3 className="font-bold text-sm uppercase tracking-widest text-white/80">Smart Admin Network</h3>
                            <span className="text-xs text-neon-purple font-bold px-2 py-1 bg-neon-purple/20 rounded">{admins.filter(a => a.role === 'smartadmin').length} Systems Online</span>
                        </div>
                        
                        <div className="p-4 flex-1 overflow-y-auto max-h-[300px] space-y-3">
                            {loading ? (
                                <div className="text-white/30 text-xs uppercase tracking-widest text-center py-10">Accessing Mainframe...</div>
                            ) : admins.filter(a => a.role === 'smartadmin').length === 0 ? (
                                <div className="text-white/30 text-xs uppercase tracking-widest text-center py-10">No active smart administrators found.</div>
                            ) : (
                                <AnimatePresence>
                                    {admins.filter(a => a.role === 'smartadmin').map(admin => (
                                        <motion.div 
                                            key={admin._id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="flex items-center justify-between p-3 bg-black/40 border border-white/5 rounded hover:border-white/20 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shadow-[0_0_10px_rgba(176,38,255,0.1)] text-neon-purple">
                                                    <ShieldAlert size={14} />
                                                </div>
                                                <div>
                                                    <div className="text-white font-bold">{admin.name} <span className="text-[9px] uppercase ml-2 text-white/40 bg-black px-1.5 py-0.5 rounded">{admin.role}</span></div>
                                                    <div className="text-[10px] text-white/40 uppercase tracking-widest font-mono">ID: {admin._id.slice(-6)}</div>
                                                </div>
                                            </div>
                                            
                                            <button 
                                                onClick={() => handleDelete(admin._id)}
                                                className="px-3 py-1.5 text-[10px] text-white/50 hover:text-white hover:bg-neon-purple bg-black border border-white/10 rounded uppercase tracking-widest transition-colors font-bold"
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

            {/* Crew Member Access Module */}
            <div className="mt-16 text-center mb-8 border-t border-white/10 pt-16">
                <span className="glassmorphism px-3 py-1 rounded-sm text-xs uppercase tracking-widest text-electric-blue border-electric-blue/30 mb-4 inline-block shadow-[0_0_10px_rgba(0,255,255,0.2)]">
                    Crew Matrix
                </span>
                <h2 className="text-3xl font-bold font-heading text-white flex items-center justify-center gap-3 drop-shadow-lg">
                    <Users className="text-electric-blue" size={32} /> Crew Member Access
                </h2>
                <p className="text-[10px] uppercase tracking-widest text-white/50 mt-2">Manage restricted credentials allowing members to sync their own Garage Cards.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {/* Crew Member Generation Terminal */}
                <div className="md:col-span-1 glass-panel p-6 rounded-xl border border-electric-blue/30 bg-electric-blue/5">
                    <h3 className="text-lg font-bold font-heading text-white flex items-center gap-2 mb-6 justify-center">
                        <KeyRound className="text-electric-blue" size={20} /> Grant Sync Access
                    </h3>
                    
                    <form onSubmit={handleAddMember} className="space-y-4">
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-2">Assign Alias</label>
                            <input required type="text" value={newMemberName} onChange={e => setNewMemberName(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-electric-blue" placeholder="Discord Tag" />
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-2">Assign Passcode</label>
                            <input required type="password" value={newMemberPassword} onChange={e => setNewMemberPassword(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-electric-blue" placeholder="••••••••" />
                        </div>
                        
                        {memberError && <p className="text-red-400 text-xs font-bold">{memberError}</p>}
                        {memberSuccess && <p className="text-electric-blue text-xs font-bold">{memberSuccess}</p>}
                        
                        <button disabled={isSubmitting} type="submit" className="w-full py-3 mt-2 bg-electric-blue hover:bg-electric-blue/80 text-black text-xs font-bold uppercase tracking-widest rounded transition-colors shadow-[0_0_15px_rgba(0,255,255,0.4)]">
                            {isSubmitting ? 'Provisioning...' : 'Generate Member Setup'}
                        </button>
                    </form>
                </div>

                {/* Active Crew Network */}
                <div className="md:col-span-2">
                    <div className="glass-panel rounded-xl border border-white/10 overflow-hidden h-full flex flex-col">
                        <div className="bg-white/5 p-4 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <h3 className="font-bold text-sm uppercase tracking-widest text-white/80">Active Crew Network</h3>
                            <span className="text-xs text-electric-blue font-bold px-2 py-1 bg-electric-blue/20 rounded whitespace-nowrap">{crewMembers.length} Accounts Active</span>
                        </div>
                        
                        {/* Search Bar */}
                        <div className="p-4 border-b border-white/5 bg-black/20">
                            <div className="relative flex items-center">
                                <Search className="absolute left-3 text-electric-blue/50" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search crew members by alias..."
                                    value={searchCrew}
                                    onChange={(e) => setSearchCrew(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-electric-blue/50 transition-colors placeholder:text-white/30"
                                />
                            </div>
                        </div>
                        
                        <div className="p-4 flex-1 overflow-y-auto max-h-[300px] space-y-3">
                            {loadingMembers ? (
                                <div className="text-white/30 text-xs uppercase tracking-widest text-center py-10">Accessing Mainframe...</div>
                            ) : filteredCrewMembers.length === 0 ? (
                                <div className="text-white/30 text-xs uppercase tracking-widest text-center py-10">
                                    {searchCrew ? 'No matching crew members found.' : 'No active members found.'}
                                </div>
                            ) : (
                                <AnimatePresence>
                                    {filteredCrewMembers.map(member => (
                                        <motion.div 
                                            key={member._id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="flex items-center justify-between p-3 bg-black/40 border border-white/5 rounded hover:border-white/20 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shadow-[0_0_10px_rgba(0,255,255,0.1)] text-electric-blue`}>
                                                    <Users size={14} />
                                                </div>
                                                <div>
                                                    <div className="text-white font-bold">{member.username}</div>
                                                    <div className="text-[10px] text-white/40 uppercase tracking-widest font-mono">STATUS: <span className={member.isActive ? 'text-green-400' : 'text-red-400'}>{member.isActive ? 'ONLINE' : 'OFFLINE'}</span></div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => handleResetMemberPassword(member._id)}
                                                    className="px-3 py-1.5 text-[10px] text-white/50 hover:text-electric-blue hover:bg-electric-blue/10 bg-black border border-white/10 rounded uppercase tracking-widest transition-colors font-bold flex items-center gap-1"
                                                >
                                                    <KeyRound size={12} /> Reset
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteMember(member._id)}
                                                    className="px-3 py-1.5 text-[10px] text-white/50 hover:text-white hover:bg-neon-red bg-black border border-white/10 rounded uppercase tracking-widest transition-colors font-bold flex items-center gap-1"
                                                >
                                                    <Trash2 size={12} /> Revoke
                                                </button>
                                            </div>
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
