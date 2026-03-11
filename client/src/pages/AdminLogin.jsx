import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Shield, UserPlus } from 'lucide-react';

const AdminLogin = ({ setAuthContext }) => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

        const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            const response = await fetch(`http://localhost:5000/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Update global App state and save token
                setAuthContext(data.admin.role);
                localStorage.setItem('trs_token', data.token);
                localStorage.setItem('trs_role', data.admin.role);
                localStorage.setItem('trs_name', data.admin.name);
                navigate(data.admin.role === 'superadmin' ? '/members' : '/');
            } else {
                setError(data.message || 'Authentication failed');
            }
        } catch (err) {
            setError('Server connection failed. Is the backend running?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-deep-black flex items-center justify-center p-6 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-electric-blue/5 blur-[150px] rounded-full pointer-events-none -z-10"></div>
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md glass-panel p-8 md:p-12 rounded-xl relative overflow-hidden"
            >
                {/* Decorative top border */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-electric-blue to-transparent"></div>
                
                <div className="text-center mb-8">
                    <Shield className="w-12 h-12 text-electric-blue mx-auto mb-4 drop-shadow-[0_0_10px_rgba(0,229,255,0.4)]" />
                    <h2 className="text-2xl md:text-3xl font-black font-heading tracking-tight mb-2">RESTRICTED ACCESS</h2>
                    <p className="text-white/50 text-sm tracking-widest uppercase">The Royal Sorcerers</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Clearance Name</label>
                        <input 
                            required 
                            type="text" 
                            value={name} 
                            onChange={e => setName(e.target.value)} 
                            className="w-full bg-black/60 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-electric-blue transition-colors" 
                            placeholder="Enter Name"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Passcode</label>
                        <input 
                            required 
                            type="password" 
                            value={password} 
                            onChange={e => setPassword(e.target.value)} 
                            className="w-full bg-black/60 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-electric-blue transition-colors" 
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div className={`p-3 rounded text-sm text-center font-medium ${error.includes('Complete') ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                            {error}
                        </div>
                    )}

                    <button 
                        disabled={loading}
                        type="submit" 
                        className={`w-full py-4 text-deep-black text-sm font-bold uppercase tracking-widest rounded transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)] ${loading ? 'bg-electric-blue/50 cursor-not-allowed' : 'bg-electric-blue hover:bg-electric-blue/80 hover:shadow-[0_0_25px_rgba(0,229,255,0.6)]'}`}
                    >
                        {loading ? 'Authenticating...' : 'Access Terminal'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
