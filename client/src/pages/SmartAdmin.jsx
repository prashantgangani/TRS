import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Check, X, Users } from 'lucide-react';
import { API_URL } from '../config';
import { Link } from 'react-router-dom';

const SmartAdmin = () => {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await fetch(`${API_URL}/settings`);
            const data = await response.json();
            setSettings(data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch settings", error);
            setLoading(false);
        }
    };

    const handleToggle = async (key) => {
        // Handle defaults based on key since older db entries might not have them
        const defaultValues = {
            memberLoginEnabled: false,
            allowAdminCarArrange: true
        };
        const currentValue = settings.hasOwnProperty(key) ? settings[key] : (defaultValues[key] !== undefined ? defaultValues[key] : true);
        const newSettings = { ...settings, [key]: !currentValue };
        setSettings(newSettings);

        try {
            await fetch(`${API_URL}/settings`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSettings)
            });
        } catch (error) {
            console.error("Failed to update settings", error);
            // Revert on error
            setSettings({ ...settings, [key]: settings[key] });
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-deep-black text-white flex items-center justify-center pt-32 pb-32 uppercase tracking-widest text-lg">Loading Protocol...</div>;
    }

    const features = [
        { key: 'editHero', name: 'Admin, Edit hero' },
        { key: 'publishMeet', name: 'Publish meet' },
        { key: 'updateValidCars', name: 'Update valid car list' },
        { key: 'manageGarage', name: 'The Garage' },
        { key: 'manageShowroom', name: 'The showroom' },
        { key: 'manageLaws', name: 'The laws' },
        { key: 'manageTimezones', name: 'Timezone' },
        { key: 'managePreviousMeets', name: 'Previous Meets' },
        { key: 'manageMasterLibrary', name: 'Master Car Library Access' },
        { key: 'memberLoginEnabled', name: 'Member Login' },
        { key: 'allowAdminCarArrange', name: 'Admin Arrange Garage Cars' }
    ];

    return (
        <div className="min-h-screen bg-deep-black text-white relative selection:bg-neon-purple/50 pt-32 pb-32">
            <div className="max-w-4xl mx-auto px-6 md:px-12">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <span className="glassmorphism px-3 py-1 rounded-sm text-xs uppercase tracking-widest text-neon-purple border-neon-purple/30 mb-4 inline-flex items-center gap-2 shadow-[0_0_10px_rgba(176,38,255,0.2)]">
                        <Shield size={14} /> Super Admin Only
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4 text-white drop-shadow-lg">
                        Smart Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-electric-blue">Panel</span>
                    </h1>
                    <p className="text-white/60 max-w-xl mx-auto text-sm">
                        Toggle admin access to specific features across the crew system.
                    </p>
                    <div className="mt-8 flex justify-center">
                        <Link to="/manage-crew-members" className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 hover:border-electric-blue hover:bg-electric-blue/10 rounded-full transition-all text-sm font-bold uppercase tracking-wider text-white">
                            <Users size={18} /> Manage Crew Logins
                        </Link>
                    </div>
                </motion.div>

                <div className="space-y-4">
                    {features.map((feature, i) => {
                        const defaultValues = { memberLoginEnabled: false, allowAdminCarArrange: true };
                        const isEnabled = settings.hasOwnProperty(feature.key) 
                            ? settings[feature.key] 
                            : (defaultValues[feature.key] !== undefined ? defaultValues[feature.key] : true);
                        return (
                            <motion.div 
                                key={feature.key}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-panel p-6 rounded-xl border border-white/5 bg-charcoal/40 flex items-center justify-between group hover:border-electric-blue/30 transition-colors"
                            >
                                <span className="text-lg font-bold font-heading uppercase tracking-wide text-white group-hover:text-electric-blue transition-colors">
                                    {feature.name}
                                </span>
                                
                                <button
                                    onClick={() => handleToggle(feature.key)}
                                    className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 focus:outline-none ${isEnabled ? 'bg-electric-blue' : 'bg-white/20'}`}
                                >
                                    <span className="sr-only">Toggle {feature.name}</span>
                                    <span
                                        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 flex items-center justify-center ${isEnabled ? 'translate-x-9' : 'translate-x-1'}`}
                                    >
                                        {isEnabled ? <Check size={14} className="text-electric-blue" /> : <X size={14} className="text-gray-400" />}
                                    </span>
                                </button>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default SmartAdmin;