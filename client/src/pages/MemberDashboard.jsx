import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, LogOut, Check, AlertCircle, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import { optimizeImage } from '../utils/imageOptimizer';
import OptimizedImage from '../components/OptimizedImage';

const MemberDashboard = ({ setAuthContext }) => {
    const [garageCard, setGarageCard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        carName: '',
        imageUrl: '',
        imageFile: null
    });
    const [previewUrl, setPreviewUrl] = useState('');

    useEffect(() => {
        const fetchGarageCard = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('No auth token');

                const res = await fetch(`${API_URL}/member-system/garage/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (res.status === 401 || res.status === 403) {
                    handleLogout();
                    return;
                }

                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.message || 'Failed to fetch your garage card');
                }

                const data = await res.json();
                setGarageCard(data);
                setFormData({
                    carName: data.carName || '',
                    imageUrl: data.image || '',
                    imageFile: null
                });
                setPreviewUrl(data.image || '');
            } catch (err) {
                setMessage({ text: err.message, type: 'error' });
            } finally {
                setLoading(false);
            }
        };

        fetchGarageCard();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('trs_role');
        localStorage.removeItem('trs_username');
        if (setAuthContext) setAuthContext('user');
        navigate('/member-login');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ text: '', type: '' });

        try {
            const token = localStorage.getItem('token');
            const data = new FormData();
            data.append('carName', formData.carName);
            if (formData.imageFile) {
                data.append('image', formData.imageFile);
            } else if (formData.imageUrl) {
                data.append('imageUrl', formData.imageUrl);
            }

            const res = await fetch(`${API_URL}/member-system/garage/me`, {
                method: 'PATCH',
                headers: { 
                    'Authorization': `Bearer ${token}`
                },
                body: data
            });

            const resData = await res.json();
            if (!res.ok) throw new Error(resData.message || 'Failed to update garage card');

            setGarageCard(resData);
            setFormData(prev => ({
                ...prev,
                imageUrl: resData.image || '',
                imageFile: null
            }));
            setPreviewUrl(resData.image || '');
            setMessage({ text: 'Garage Card sync successful.', type: 'success' });
        } catch (err) {
            setMessage({ text: err.message, type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 800 * 1024) {
                setMessage({ text: 'Image size should be less than 800KB', type: 'error' });
                return;
            }
            setFormData(prev => ({ ...prev, imageFile: file }));
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-deep-black text-white flex items-center justify-center pt-32 pb-32 uppercase tracking-widest text-lg">Initializing Workspace...</div>;
    }

    return (
        <div className="min-h-screen bg-deep-black text-white selection:bg-neon-purple/50 pt-24 pb-20">
            <div className="max-w-6xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12"
                >
                    <div>
                        <h1 className="text-3xl font-bold font-heading mb-2 text-white drop-shadow-lg uppercase tracking-widest">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-electric-blue">Garage</span> Terminal
                        </h1>
                        <p className="text-white/40 text-sm uppercase tracking-wider">Welcome back, {localStorage.getItem('trs_username')}</p>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 rounded-full transition-colors text-xs font-bold uppercase tracking-widest self-start md:self-auto"
                    >
                        <LogOut size={14} /> Disconnect
                    </button>
                </motion.div>

                {message.text && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`p-4 mb-8 rounded-xl border flex items-center gap-3 ${message.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-green-500/10 border-green-500/30 text-green-400'}`}
                    >
                        {message.type === 'error' ? <AlertCircle size={18} /> : <Check size={18} />}
                        <p className="text-sm font-medium">{message.text}</p>
                    </motion.div>
                )}

                {!garageCard && !loading && message.type !== 'error' ? (
                    <div className="text-center p-12 border border-white/5 bg-white/5 rounded-2xl">
                        <p className="text-white/50 mb-4 tracking-widest uppercase">No associated garage card found.</p>
                        <p className="text-sm text-white/30">Please contact a superadmin to link your profile to a vehicle.</p>
                    </div>
                ) : garageCard && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
                        {/* Editor Form */}
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass-panel border border-white/10 rounded-2xl p-6 md:p-8"
                        >
                            <h2 className="text-xl font-heading font-bold mb-6 flex items-center gap-2 uppercase tracking-widest">
                                <Save size={18} className="text-electric-blue"/> Data Matrix
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-white/50 mb-2">Build Designation</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-neon-purple transition-all text-sm"
                                        placeholder="e.g. Pegassi Zentorno - Time Attack Build"
                                        value={formData.carName}
                                        onChange={(e) => setFormData(prev => ({...prev, carName: e.target.value}))}
                                        required 
                                    />
                                    <p className="text-white/30 text-xs mt-2">The public name displayed for your vehicle.</p>
                                </div>
                                
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-white/50 mb-2">Vehicle Image</label>
                                    <div className="flex flex-col gap-3">
                                        <input
                                            type="file"
                                            accept="image/jpeg, image/png, image/webp"
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-purple transition-all text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-neon-purple/20 file:text-neon-purple hover:file:bg-neon-purple/30"
                                            onChange={handleImageChange}
                                        />
                                        <div className="flex items-center gap-2">
                                            <div className="h-px bg-white/10 flex-1"></div>
                                            <span className="text-white/30 text-xs uppercase">OR PASTE URL</span>
                                            <div className="h-px bg-white/10 flex-1"></div>
                                        </div>
                                        <input
                                            type="url"
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-neon-purple transition-all text-sm disabled:opacity-50"
                                            placeholder="https://..."
                                            value={formData.imageUrl}
                                            onChange={(e) => {
                                                setFormData(prev => ({...prev, imageUrl: e.target.value, imageFile: null}));
                                                setPreviewUrl(e.target.value);
                                            }}
                                            disabled={!!formData.imageFile}
                                        />
                                    </div>
                                    <p className="text-white/30 text-xs mt-2">Upload a high-quality image of your vehicle (Max 800KB), or paste a direct URL.</p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={saving || (formData.carName === garageCard.carName && formData.imageUrl === garageCard.image && !formData.imageFile)}
                                    className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg hover:shadow-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-4"
                                >
                                    {saving ? 'Syncing...' : 'Push Update'}
                                </button>
                            </form>
                        </motion.div>

                        {/* Real-time Preview */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="w-full"
                        >
                            <h2 className="text-sm font-heading font-medium mb-4 flex items-center gap-2 uppercase tracking-widest text-white/60">
                                <Camera size={14} className="text-neon-purple"/> Live Preview
                            </h2>
                            <div className="group relative rounded-2xl overflow-hidden aspect-[16/11] border border-white/5 bg-[#0a0a0a] block shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                                  <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                                      <OptimizedImage 
                                          src={previewUrl || formData.imageUrl} 
                                          fallbackSrc="https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=1920&q=80&auto=format&fit=crop" 
                                          variant="detail" 
                                          className="w-full h-full object-cover" 
                                      />
                                  </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MemberDashboard;