import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { API_URL } from '../config';
import { logAdminAction } from '../utils/logger';
import { optimizeImage } from '../utils/imageOptimizer';

const Showroom = ({ isAdmin }) => {
    const [showroomCars, setShowroomCars] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [meetTheme, setMeetTheme] = useState('');
    const [carName, setCarName] = useState('');
    const [carOwner, setCarOwner] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch Cars from Backend
    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await fetch(`${API_URL}/cars`);
                const data = await response.json();
                setShowroomCars(data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch cars:", error);
                setLoading(false);
            }
        };
        fetchCars();
    }, []);

    const handleAddOrUpdateCar = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const payload = { 
                meetTheme, 
                carName, 
                carOwner, 
                description,
                image: image || 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=1920&q=80&auto=format&fit=crop' 
            };

            if (editingId) {
                const response = await fetch(`${API_URL}/cars/${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const updatedCar = await response.json();
                await logAdminAction('Updated Featured Build', `Car: ${updatedCar.carName} | Owner: ${updatedCar.carOwner}`);
                setShowroomCars(showroomCars.map(c => c._id === editingId ? updatedCar : c));
                setEditingId(null);
            } else {
                 const response = await fetch(`${API_URL}/cars`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const newCar = await response.json();
                await logAdminAction('Featured Build in Showroom', `Car: ${newCar.carName} | Owner: ${newCar.carOwner}`);
                setShowroomCars([newCar, ...showroomCars]);
            }
            
            // Reset form
            setMeetTheme(''); setCarName(''); setCarOwner(''); setDescription(''); setImage('');
        } catch (error) {
            console.error("Error saving car:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (car) => {
        setEditingId(car._id);
        setMeetTheme(car.meetTheme);
        setCarName(car.carName);
        setCarOwner(car.carOwner);
        setDescription(car.description);
        setImage(car.image);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this car?")) return;
        try {
            const response = await fetch(`${API_URL}/cars/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                const deletedCar = showroomCars.find(c => c._id === id);
                await logAdminAction('Deleted Featured Build', `Removed: ${deletedCar?.carName} | Owner: ${deletedCar?.carOwner}`);
                setShowroomCars(showroomCars.filter(c => c._id !== id));
            }
        } catch (error) {
            console.error("Error deleting car:", error);
        }
    };

    return (
        <div className="min-h-screen bg-deep-black text-white relative selection:bg-neon-purple/50 pt-32 pb-32">
            {/* Background Details */}
            <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-electric-blue/5 to-transparent pointer-events-none -z-10"></div>
            
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <span className="glassmorphism px-3 py-1 rounded-sm text-xs uppercase tracking-widest text-electric-blue border-electric-blue/30 mb-4 inline-block shadow-[0_0_10px_rgba(0,229,255,0.2)]">
                        Hall of Fame
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold font-heading mb-4 text-white drop-shadow-lg">
                        The <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-neon-purple">Showroom</span>
                    </h1>
                    <p className="text-white/60 max-w-2xl mx-auto text-sm md:text-base">
                        The absolute pinnacle of our car meets. These rides represent the highest tier of creativity, tuning, and dedication in Los Santos.
                    </p>
                </motion.div>

                {/* Cards List */}
                <div className="space-y-20">
                    {/* ADMIN ONLY: ADD NEW SHOWROOM CAR FORM */}
                    {isAdmin && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-panel p-8 md:p-12 rounded-xl border-2 border-dashed border-electric-blue/50 bg-electric-blue/5 relative max-w-4xl mx-auto"
                        >
                            <h3 className="text-2xl font-bold mb-6 font-heading text-electric-blue flex items-center gap-3">
                                <Plus size={24} /> {editingId ? 'Edit Showroom Build' : 'Submit New Showroom Build'}
                            </h3>
                            <form onSubmit={handleAddOrUpdateCar} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input required type="text" placeholder="Meet Theme (e.g. Neon Nights)" value={meetTheme} onChange={e => setMeetTheme(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-electric-blue" />
                                    <input required type="text" placeholder="Car Name (e.g. Annis Remus)" value={carName} onChange={e => setCarName(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-electric-blue" />
                                </div>
                                <input required type="text" placeholder="Car Owner/Builder" value={carOwner} onChange={e => setCarOwner(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-electric-blue" />
                                <input type="text" placeholder="Image Name/Path (e.g. /images/car1.jpg)" value={image} onChange={e => setImage(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-electric-blue" />
                                <textarea required placeholder="Machine Details & Lore" value={description} onChange={e => setDescription(e.target.value)} rows="3" className="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-electric-blue resize-none"></textarea>
                                
                                <button disabled={isSubmitting} type="submit" className="w-full py-4 mt-4 bg-electric-blue hover:bg-electric-blue/80 text-deep-black text-sm font-bold uppercase tracking-widest rounded transition-colors shadow-[0_0_15px_rgba(0,229,255,0.4)]">
                                    {isSubmitting ? (editingId ? 'Updating...' : 'Uploading to Garage...') : (editingId ? 'Update Build' : 'Feature Build')}
                                </button>
                                {editingId && (
                                    <button type="button" onClick={() => {
                                        setEditingId(null);
                                        setMeetTheme(''); setCarName(''); setCarOwner(''); setDescription(''); setImage('');
                                    }} className="w-full py-3 mt-2 bg-black/50 border border-white/20 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest rounded transition-colors">
                                        Cancel Edit
                                    </button>
                                )}
                            </form>
                        </motion.div>
                    )}

                    {loading ? (
                        <div className="text-white/50 text-center py-20 tracking-widest uppercase text-lg">Loading Showroom Archives...</div>
                    ) : showroomCars.length === 0 ? (
                        <div className="text-white/50 text-center py-20 tracking-widest uppercase">The showroom is currently empty. Wait for the next meet.</div>
                    ) : (
                        showroomCars.map((car, index) => (
                        <motion.div 
                            key={car._id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                            className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} bg-charcoal/40 border border-white/5 rounded-xl overflow-hidden shadow-2xl group`}
                        >
                            {/* Image Section */}
                            <div className="w-full lg:w-[55%] h-[300px] sm:h-[400px] lg:h-auto min-h-[400px] relative overflow-hidden">
                                <img 
                                    src={optimizeImage(car.image, 800)} 
                                    alt={car.carName}
                                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filter saturate-50 group-hover:saturate-100"
                                />
                                {isAdmin && (
                                    <div className="absolute top-4 right-4 z-20 flex gap-2">
                                        <button onClick={() => handleEdit(car)} className="p-2 bg-black/60 hover:bg-electric-blue/80 text-white rounded-full transition-colors backdrop-blur-md">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(car._id)} className="p-2 bg-black/60 hover:bg-neon-red/80 text-white rounded-full transition-colors backdrop-blur-md">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-deep-black/60 via-transparent to-transparent"></div>
                                <div className="absolute inset-0 bg-neon-purple/5 mix-blend-overlay"></div>
                            </div>

                            {/* Content Section */}
                            <div className="w-full lg:w-[45%] p-8 md:p-12 lg:p-16 flex flex-col justify-center relative bg-charcoal/60 backdrop-blur-md">
                                <div className="absolute -inset-10 bg-electric-blue/5 blur-[100px] rounded-full pointer-events-none -z-10 group-hover:bg-electric-blue/10 transition-colors duration-500"></div>

                                <div className="mb-6">
                                    <p className="text-[10px] sm:text-xs text-white/40 uppercase tracking-[0.2em] font-semibold mb-3">Meet Theme</p>
                                    <div className="px-3 py-1.5 border border-neon-purple/50 bg-neon-purple/10 rounded-sm inline-block">
                                        <span className="text-neon-purple font-bold tracking-widest uppercase text-[10px] sm:text-xs drop-shadow-[0_0_5px_rgba(176,38,255,0.6)]">{car.meetTheme}</span>
                                    </div>
                                </div>

                                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight mb-6 text-glow">
                                    {car.carName}
                                </h2>

                                <div className="flex items-center gap-3 mb-8 pb-8 border-b border-white/10">
                                    <p className="text-[10px] text-white/40 uppercase tracking-widest">Built By</p>
                                    <p className="text-white font-bold tracking-wider">{car.carOwner}</p>
                                </div>

                                <div>
                                    <p className="text-[10px] text-electric-blue uppercase tracking-widest mb-3 font-bold border-l-2 border-electric-blue pl-2">Machine Details</p>
                                    <p className="text-white/70 text-sm leading-relaxed">
                                        {car.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )))}
                </div>
            </div>
        </div>
    );
};

export default Showroom;
