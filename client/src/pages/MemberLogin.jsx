import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

const MemberLogin = ({ setAuthContext }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/member-system/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Login failed');
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('trs_role', data.member.role);
            localStorage.setItem('trs_username', data.member.username);
            
            if (setAuthContext) setAuthContext(data.member.role);
            navigate('/member-dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center">
            <div className="max-w-md w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel p-8 md:p-12 rounded-2xl relative overflow-hidden shadow-2xl shadow-ls-orange/5 border border-white/5"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-ls-orange/10 rounded-full blur-[80px] -z-10 translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

                    <div className="flex flex-col items-center justify-center mb-8">
                        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                            <LogIn size={24} className="text-ls-orange" />
                        </div>
                        <h2 className="text-3xl font-heading font-medium text-white tracking-widest text-center">CREW LOGIN</h2>
                        <p className="text-sm text-white/40 mt-3 text-center uppercase tracking-widest">Update Your Garage Card</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-500/90 p-4 rounded-xl mb-6 text-sm flex items-center gap-3">
                            <AlertCircle size={16} className="shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white/90 placeholder-white/20 focus:outline-none focus:border-ls-orange/50 focus:bg-white/5 transition-all text-sm"
                                placeholder="Your discord tag"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white/90 placeholder-white/20 focus:outline-none focus:border-ls-orange/50 focus:bg-white/5 transition-all text-sm mb-2"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-ls-orange hover:bg-ls-orange/90 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(176,38,255,0.3)] hover:shadow-[0_0_30px_rgba(176,38,255,0.5)] flex items-center justify-center gap-2 tracking-widest text-sm disabled:opacity-50 mt-4"
                        >
                            {loading ? 'AUTHENTICATING...' : 'ACCESS SYNC'}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default MemberLogin;