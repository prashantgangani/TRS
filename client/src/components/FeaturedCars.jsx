import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Edit2, X } from 'lucide-react';
import { API_URL } from '../config';
import { logAdminAction } from '../utils/logger';

const FeaturedCars = ({ isAdmin }) => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [carName, setCarName] = useState('');
    const [builtBy, setBuiltBy] = useState('');
    const [image, setImage] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await fetch(`${API_URL}/featured-cars`);
                const data = await response.json();
                setCars(data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch featured cars:", error);
                setLoading(false);
            }
        };
        fetchCars();
    }, []);

    const handleAddOrUpdateCar = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const randomImages = [
                'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=1920&q=80&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1542362567-b07e54358753?w=1920&q=80&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1611016186353-9af58c69a533?w=1920&q=80&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1920&q=80&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=1920&q=80&auto=format&fit=crop'
            ];
            const defaultImage = randomImages[Math.floor(Math.random() * randomImages.length)];
            
            const payload = { 
                carName, 
                builtBy, 
                image: image || defaultImage 
            };

            if (editingId) {
                const response = await fetch(`${API_URL}/featured-cars/${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const updatedCar = await response.json();
                await logAdminAction('Updated Featured Garage Car', `Car: ${updatedCar.carName} | Owner: ${updatedCar.builtBy}`);
                setCars(cars.map(c => c._id === editingId ? updatedCar : c));
                setEditingId(null);
            } else {
                 const response = await fetch(`${API_URL}/featured-cars`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const newCar = await response.json();
                await logAdminAction('Added Featured Garage Car', `Car: ${newCar.carName} | Owner: ${newCar.builtBy}`);
                setCars([newCar, ...cars]);
            }
            
            // Reset form
            setCarName(''); setBuiltBy(''); setImage('');
            setIsFormOpen(false);
        } catch (error) {
            console.error("Error saving featured car:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (car) => {
        setEditingId(car._id);
        setCarName(car.carName);
        setBuiltBy(car.builtBy);
        setImage(car.image);
        setIsFormOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this featured car?")) return;
        try {
            const response = await fetch(`${API_URL}/featured-cars/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                const deletedCar = cars.find(c => c._id === id);
                await logAdminAction('Deleted Featured Garage Car', `Removed: ${deletedCar?.carName} | Owner: ${deletedCar?.builtBy}`);
                setCars(cars.filter(c => c._id !== id));
            }
        } catch (error) {
            console.error("Error deleting featured car:", error);
        }
    };

    return (
        <section id="garage" className="py-32 bg-deep-black border-y border-white/5 relative overflow-hidden">
            {/* Creative Backgrounds */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-electric-blue/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-neon-purple/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="max-w-2xl relative">
                        <motion.div 
                            initial={{ x: -20, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            className="absolute -left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-electric-blue to-neon-purple"
                        />
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 font-heading uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40 drop-shadow-lg">
                            The <span className="text-electric-blue drop-shadow-[0_0_15px_rgba(0,229,255,0.5)] text-glow-blue">Garage</span>
                        </h2>
                        <p className="text-white/60 text-lg md:text-xl font-light tracking-wide max-w-xl">
                            A curated selection of the most aggressive and meticulously crafted builds from the underground.
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-4 flex-wrap">
                        {isAdmin && (
                            <button 
                                onClick={() => setIsFormOpen(!isFormOpen)}
                                className="px-6 py-3 bg-white hover:bg-white/90 text-deep-black transition-all uppercase tracking-widest text-sm font-bold rounded-sm flex items-center gap-2"
                            >
                                {isFormOpen ? <X size={18} /> : <Plus size={18} />}
                                {isFormOpen ? 'Cancel' : 'Add Build'}
                            </button>
                        )}
                        <Link to="/showroom" className="px-6 py-3 border border-white/20 hover:border-white hover:bg-white/5 transition-all uppercase tracking-widest text-sm font-bold rounded-sm inline-block group">
                            Full Showroom <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                        </Link>
                    </div>
                </div>

                {/* Form Animation */}
                <AnimatePresence>
                    {isAdmin && isFormOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-12"
                        >
                            <div className="glass-panel p-8 rounded-xl border-t border-electric-blue/30 bg-black/40 backdrop-blur-xl relative shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                                <h3 className="text-2xl font-bold mb-6 font-heading text-white flex items-center gap-3">
                                    {editingId ? 'Edit Garage Build' : 'Feature New Build'}
                                </h3>
                                <form onSubmit={handleAddOrUpdateCar} className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest text-white/50 pl-1">Car Name</label>
                                            <input required type="text" placeholder="e.g. Annis Remus" value={carName} onChange={e => setCarName(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-md px-4 py-3.5 text-sm text-white focus:outline-none focus:border-electric-blue transition-colors" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest text-white/50 pl-1">Built By</label>
                                            <input required type="text" placeholder="Owner / Tuner Name" value={builtBy} onChange={e => setBuiltBy(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-md px-4 py-3.5 text-sm text-white focus:outline-none focus:border-electric-blue transition-colors" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest text-white/50 pl-1">Image URL (Optional)</label>
                                        <input type="url" placeholder="Leave empty for a random car image..." value={image} onChange={e => setImage(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-md px-4 py-3.5 text-sm text-white focus:outline-none focus:border-electric-blue transition-colors" />
                                    </div>
                                    
                                    <button disabled={isSubmitting} type="submit" className="w-full py-4 mt-6 bg-gradient-to-r from-electric-blue to-neon-purple hover:from-electric-blue/80 hover:to-neon-purple/80 text-white text-sm font-bold uppercase tracking-widest rounded-md transition-all shadow-[0_0_20px_rgba(0,229,255,0.3)]">
                                        {isSubmitting ? 'Saving...' : (editingId ? 'Update Build' : 'Deploy to Garage')}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {loading ? (
                    <div className="flex justify-center items-center py-32">
                        <div className="w-12 h-12 border-4 border-white/10 border-t-electric-blue rounded-full animate-spin"></div>
                    </div>
                ) : cars.length === 0 ? (
                    <div className="text-white/40 text-center py-32 tracking-widest uppercase font-bold text-xl border border-dashed border-white/10 rounded-xl bg-white/5">
                        Garage is currently empty.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-12">
                        {cars.map((car, i) => (
                            <motion.div
                                key={car._id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.6, delay: i * 0.1 }}
                                className="group relative"
                            >
                                <div className="relative aspect-[4/3] sm:aspect-[3/2] rounded-xl overflow-hidden shadow-2xl transition-all duration-500 transform group-hover:-translate-y-2 group-hover:shadow-[0_20px_50px_rgba(0,229,255,0.15)] bg-black/50">
                                    {/* Image with extreme effects */}
                                    <img
                                        src={car.image}
                                        alt={car.carName}
                                        className="w-full h-full object-cover transition-all duration-700 ease-out sm:grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-110"
                                    />
                                    
                                    {/* Creative Overlays */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <div className="absolute inset-0 bg-electric-blue/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    
                                    {/* Admin Controls */}
                                    {isAdmin && (
                                        <div className="absolute top-4 right-4 z-30 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-[-10px] group-hover:translate-y-0 duration-300">
                                            <button onClick={() => handleEdit(car)} className="p-2.5 bg-black/80 hover:bg-white text-white hover:text-black rounded-full transition-all backdrop-blur-md">
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(car._id)} className="p-2.5 bg-black/80 hover:bg-red-500 text-white rounded-full transition-all backdrop-blur-md">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    )}

                                    {/* Content - ONLY Car Name && Built by */}
                                    <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 pt-20 z-20 flex flex-col justify-end opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-out">
                                        <p 
                                            className="text-[11px] sm:text-xs text-electric-blue uppercase tracking-[0.3em] font-bold mb-2 transition-transform duration-500"
                                        >
                                            Built By <span className="text-white ml-2">— {car.builtBy}</span>
                                        </p>
                                        <h3 
                                            className="text-3xl sm:text-4xl font-black font-heading tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] transition-transform duration-500 delay-75"
                                        >
                                            {car.carName}
                                        </h3>
                                    </div>
                                    
                                    {/* Animated border line on hover */}
                                    <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-electric-blue to-neon-purple w-0 group-hover:w-full transition-all duration-700 ease-out z-30"></div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default FeaturedCars;
