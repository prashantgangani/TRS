import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Loader2, AlertTriangle, FileText } from 'lucide-react';
import { API_URL } from '../config';

const SubmitFeedback = () => {
    const [text, setText] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!text.trim()) {
            setMessage({ type: 'error', text: 'Feedback cannot be empty.' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });
        
        try {
            const response = await fetch(`${API_URL}/feedbacks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text })
            });
            
            if (response.ok) {
                setMessage({ type: 'success', text: 'Feedback submitted anonymously. Thank you!' });
                setText('');
            } else {
                const errorData = await response.json().catch(() => ({}));
                setMessage({ type: 'error', text: errorData.message || 'Failed to submit feedback.' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Server connection failed.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-deep-black flex items-center justify-center p-6 relative pt-32 pb-24">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-electric-blue/5 blur-[150px] rounded-full pointer-events-none -z-10"></div>
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl glass-panel p-8 md:p-12 rounded-xl relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-electric-blue to-transparent"></div>
                
                <div className="text-center mb-8">
                    <MessageSquare className="w-12 h-12 text-electric-blue mx-auto mb-4 drop-shadow-[0_0_10px_rgba(0,229,255,0.4)]" />
                    <h2 className="text-3xl md:text-4xl font-black font-heading tracking-tight mb-2 text-white drop-shadow-lg">CREW <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-blue-500">FEEDBACK</span></h2>
                    <p className="text-white/50 text-sm tracking-widest uppercase">Have a suggestion or complaint? Let us know.</p>
                </div>

                <div className="mb-8 p-5 bg-neon-red/5 border border-neon-red/20 rounded-lg">
                    <div className="flex items-start gap-3 mb-3">
                        <AlertTriangle className="text-neon-red w-5 h-5 flex-shrink-0 mt-0.5" />
                        <h3 className="text-neon-red font-bold uppercase tracking-widest text-sm">Reporting & Complaints</h3>
                    </div>
                    <p className="text-white/70 text-sm mb-4 leading-relaxed">
                        If a player is repeatedly misbehaving, disrupting car meets, breaking crew rules, or if you have any complaint related to crew activities, you may use this feedback form to report the issue. Please provide complete and accurate details so the matter can be reviewed fairly.
                    </p>
                    <div className="bg-black/40 p-4 rounded text-xs text-white/60 font-mono leading-loose border border-white/5 relative group">
                        <p><span className="text-electric-blue/70">Name:</span></p>
                        <p><span className="text-electric-blue/70">Reported Player:</span></p>
                        <p><span className="text-electric-blue/70">Date:</span></p>
                        <p><span className="text-electric-blue/70">Location / Event Name:</span></p>
                        <p><span className="text-electric-blue/70">Complaint Type:</span></p>
                        <p><span className="text-electric-blue/70">Description of the Incident:</span></p>
                        <p><span className="text-electric-blue/70">Requested Action:</span></p>
                        
                        <button 
                            type="button"
                            onClick={() => {
                                const template = `Name: \nReported Player: \nDate: \nLocation / Event Name: \nComplaint Type: \nDescription of the Incident: \nProof / Evidence: \nRequested Action: `;
                                setText(text ? text + '\n\n' + template : template);
                            }}
                            className="absolute top-3 right-3 p-2 bg-white/5 hover:bg-electric-blue/20 hover:text-electric-blue text-white/40 rounded transition-colors group-hover:opacity-100 flex items-center gap-2 text-[10px] uppercase font-bold"
                            title="Copy Template to Input"
                        >
                            <FileText size={14} /> Use Template
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Message</label>
                        <textarea 
                            required 
                            rows="6"
                            value={text} 
                            onChange={e => setText(e.target.value)} 
                            className="w-full bg-black/60 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-electric-blue transition-colors resize-none" 
                            placeholder="Enter your feedback here..."
                        ></textarea>
                    </div>

                    {message.text && (
                        <div className={`p-3 rounded text-sm text-center font-medium ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                            {message.text}
                        </div>
                    )}

                    <button 
                        disabled={loading}
                        type="submit" 
                        className={`w-full py-4 text-deep-black text-sm font-bold uppercase tracking-widest rounded transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)] ${loading ? 'bg-electric-blue/50 cursor-not-allowed flex justify-center items-center gap-2' : 'bg-electric-blue hover:bg-electric-blue/80 hover:shadow-[0_0_25px_rgba(0,229,255,0.6)]'}`}
                    >
                        {loading ? <><Loader2 className="animate-spin" size={18} /> Submitting...</> : 'Transmit Feedback'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default SubmitFeedback;