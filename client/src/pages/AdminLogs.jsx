import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, AlertTriangle, Terminal, Activity, ArrowLeft } from 'lucide-react';
import { API_URL } from '../config';
import { Link } from 'react-router-dom';

const AdminLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLogs = async () => {
        try {
            const response = await fetch(`${API_URL}/logs`);
            const data = await response.json();
            setLogs(data);
        } catch (error) {
            console.error("Failed to fetch logs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
        // Optional: auto-refresh logs every 30 seconds
        const interval = setInterval(fetchLogs, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Permanently delete this log entry?")) return;
        try {
            const response = await fetch(`${API_URL}/logs/${id}`, { method: 'DELETE' });
            if (response.ok) {
                setLogs(logs.filter(log => log._id !== id));
            }
        } catch (error) {
            console.error("Error deleting log:", error);
        }
    };

    const handleClearAll = async () => {
        if (!window.confirm("WARNING: This will permanently delete ALL system logs. Proceed?")) return;
        try {
            const response = await fetch(`${API_URL}/logs`, { method: 'DELETE' });
            if (response.ok) {
                setLogs([]);
            }
        } catch (error) {
            console.error("Error clearing logs:", error);
        }
    };

    return (
        <section className="min-h-screen bg-deep-black pt-32 pb-24 px-6 md:px-12 relative overflow-hidden font-mono">
            {/* Background */}
            <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-electric-blue/5 to-transparent pointer-events-none -z-10"></div>
            
            <div className="max-w-6xl mx-auto mb-8">
                <Link to="/controls" className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:border-[#FFD700] hover:bg-[#FFD700]/10 rounded-full transition-all text-xs font-bold uppercase tracking-wider text-white">
                    <ArrowLeft size={16} /> Back to Controls
                </Link>
            </div>

            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6"
                >
                    <div>
                        <span className="px-3 py-1 rounded-sm text-[10px] uppercase tracking-widest text-[#FFD700] border border-[#FFD700]/30 mb-4 inline-block bg-[#FFD700]/10 shadow-[0_0_10px_rgba(255,215,0,0.2)]">
                            Superadmin Vision
                        </span>
                        <h1 className="text-3xl md:text-5xl font-bold font-heading text-white flex items-center gap-3 drop-shadow-lg">
                            <Terminal className="text-[#FFD700]" size={40} /> SYSTEM <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-yellow-600">LOGS</span>
                        </h1>
                    </div>
                    
                    {logs.length > 0 && (
                        <button 
                            onClick={handleClearAll}
                            className="px-6 py-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded border border-red-500/30 transition-colors flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(255,0,0,0.3)]"
                        >
                            <AlertTriangle size={16} /> Purge All Records
                        </button>
                    )}
                </motion.div>

                {/* Log Console */}
                <div className="glass-panel border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                    <div className="bg-black/80 px-6 py-4 border-b border-white/10 flex items-center gap-3">
                        <Activity className="text-green-400" size={18} />
                        <span className="text-xs uppercase tracking-widest text-white/50">Live Audit Trail</span>
                        <span className="ml-auto text-[10px] uppercase tracking-widest bg-white/5 px-2 py-1 rounded text-white/30">Auto-refreshing</span>
                    </div>

                    <div className="p-1">
                        {loading ? (
                            <div className="text-[#FFD700]/50 text-center py-20 tracking-widest uppercase text-sm animate-pulse">Tracing actions...</div>
                        ) : logs.length === 0 ? (
                            <div className="text-white/30 text-center py-20 tracking-widest uppercase text-sm">No activity recorded.</div>
                        ) : (
                            <div className="overflow-x-auto hide-scrollbar max-h-[600px] overflow-y-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-[#FFD700]/5 sticky top-0 backdrop-blur-md z-10 hidden md:table-header-group">
                                        <tr>
                                            <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-[#FFD700]/70 font-bold border-b border-white/5">Timestamp</th>
                                            <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-[#FFD700]/70 font-bold border-b border-white/5">Admin</th>
                                            <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-[#FFD700]/70 font-bold border-b border-white/5">Action Executed</th>
                                            <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-[#FFD700]/70 font-bold border-b border-white/5">Reference Details</th>
                                            <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-[#FFD700]/70 font-bold border-b border-white/5 text-right">Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        <AnimatePresence>
                                            {logs.map(log => (
                                                <motion.tr 
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    key={log._id} 
                                                    className="hover:bg-white/5 transition-colors group flex flex-col md:table-row"
                                                >
                                                    <td className="px-6 py-4 md:py-3 whitespace-nowrap text-xs text-white/40">
                                                        {new Date(log.createdAt).toLocaleString()}
                                                    </td>
                                                    <td className="px-6 py-1 md:py-3 whitespace-nowrap text-sm font-bold text-white">
                                                        {log.adminName}
                                                    </td>
                                                    <td className="px-6 py-1 md:py-3 whitespace-nowrap text-sm text-electric-blue">
                                                        {log.action}
                                                    </td>
                                                    <td className="px-6 py-1 md:py-3 text-sm text-white/70 max-w-[300px] truncate">
                                                        {log.details || 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 md:py-3 whitespace-nowrap text-right">
                                                        <button 
                                                            onClick={() => handleDelete(log._id)}
                                                            className="text-white/20 hover:text-red-500 transition-colors opacity-100 md:opacity-0 group-hover:opacity-100 p-2"
                                                            title="Delete Reference"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </AnimatePresence>
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AdminLogs;