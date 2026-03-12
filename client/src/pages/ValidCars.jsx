import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Edit2, CheckCircle, XCircle } from 'lucide-react';
import { API_URL } from '../config';
import { logAdminAction } from '../utils/logger';

const ValidCars = ({ isAdmin }) => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        carName: '',
        description: '',
        imageUrl: '',
        isValid: true
    });

    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = async () => {
        try {
            const res = await fetch(`${API_URL}/valid-cars`);
            const data = await res.json();
            setCars(data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch cars:", err);
            setLoading(false);
        }
    };

    const handleAddOrUpdate = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                const res = await fetch(`${API_URL}/valid-cars/${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                if (res.ok) {
                    await logAdminAction('Updated Car Status', `Edited ${formData.carName}`);
                    setEditingId(null);
                    setFormData({ carName: '', description: '', imageUrl: '', isValid: true });
                    fetchCars();
                }
            } else {
                const res = await fetch(`${API_URL}/valid-cars`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                if (res.ok) {
                    await logAdminAction('Added Car to List', `Added ${formData.carName} as ${formData.isValid ? 'Valid' : 'Invalid'}`);
                    setFormData({ carName: '', description: '', imageUrl: '', isValid: true });
                    fetchCars();
                }
            }
        } catch (err) {
            console.error("Error saving car:", err);
        }
    };

    const handleEdit = (car) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setEditingId(car._id);
        setFormData({
            carName: car.carName,
            description: car.description,
            imageUrl: car.imageUrl || '',
            isValid: car.isValid
        });
    };

    const handleDelete = async (id, carName) => {
        if (!window.confirm("Are you sure you want to remove this car?")) return;
        try {
            const res = await fetch(`${API_URL}/valid-cars/${id}`, { method: 'DELETE' });
            if (res.ok) {
                await logAdminAction('Deleted Car from List', `Removed ${carName}`);
                fetchCars();
            }
        } catch (err) {
            console.error("Error deleting car:", err);
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setFormData({ carName: '', description: '', imageUrl: '', isValid: true });
    };

    const validCarsList = cars.filter(c => c.isValid);
    const invalidCarsList = cars.filter(c => !c.isValid);

    const fallBackImage = 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=800';

    return (
        <div className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12 text-center"
            >
                <h1 className="text-4xl md:text-5xl font-black font-heading text-glow mb-4">Meet <span className="text-neon-purple">Valid Cars</span></h1>
                <p className="text-white/60 text-lg max-w-2xl mx-auto">
                    Check the list below to see which vehicles are permitted and which are restricted for the current meet.
                </p>
            </motion.div>

            {isAdmin && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-16 glass-panel p-6 rounded-lg border-2 border-neon-purple/30 max-w-3xl mx-auto relative"
                >
                    <h3 className="text-xl font-bold mb-4 font-heading text-neon-purple">
                        Admin Controls: {editingId ? 'Edit Car Details' : 'Add Car'}
                    </h3>
                    <form onSubmit={handleAddOrUpdate} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input 
                                type="text" 
                                placeholder="Car Name" 
                                required
                                className="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-white focus:border-neon-purple outline-none"
                                value={formData.carName}
                                onChange={e => setFormData({...formData, carName: e.target.value})}
                            />
                            <input 
                                type="url" 
                                placeholder="Image URL (Optional)" 
                                className="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-white focus:border-neon-purple outline-none"
                                value={formData.imageUrl}
                                onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                            />
                        </div>
                        <textarea 
                            placeholder="Description (e.g. Allowed modifications, exact trim requirements)" 
                            required
                            className="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-white focus:border-neon-purple outline-none h-24"
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                        />
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="radio" 
                                    checked={formData.isValid === true} 
                                    onChange={() => setFormData({...formData, isValid: true})}
                                />
                                <span className="text-green-400 font-bold">Valid Car</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="radio" 
                                    checked={formData.isValid === false} 
                                    onChange={() => setFormData({...formData, isValid: false})}
                                />
                                <span className="text-neon-red font-bold">Invalid Car</span>
                            </label>
                        </div>
                        
                        <div className="flex gap-4 mt-4">
                            <button type="submit" className="flex-1 py-3 bg-neon-purple/20 text-neon-purple hover:bg-neon-purple hover:text-white border border-neon-purple font-bold tracking-widest uppercase rounded transition-colors">
                                {editingId ? 'Update Car Details' : 'Add Car to List'}
                            </button>
                            {editingId && (
                                <button type="button" onClick={cancelEdit} className="py-3 px-6 bg-black/50 hover:bg-white/10 text-white border border-white/20 font-bold tracking-widest uppercase rounded transition-colors">
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </motion.div>
            )}

            {loading ? (
                <div className="text-center text-white/50 py-10 uppercase tracking-widest text-sm">Loading vehicle data...</div>
            ) : (
                <div className="space-y-20">
                    {/* Valid Cars Section */}
                    <div>
                        <div className="flex items-center justify-center gap-3 mb-8">
                            <CheckCircle className="text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]" size={28} />
                            <h2 className="text-3xl font-bold font-heading text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]">Valid Cars</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {validCarsList.length === 0 ? (
                                <p className="text-white/40 italic text-center col-span-full">No valid cars listed yet.</p>
                            ) : (
                                validCarsList.map((car, idx) => (
                                    <motion.div 
                                        key={car._id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="group relative h-full"
                                    >
                                        <div className="absolute -inset-0.5 bg-gradient-to-br from-green-500 to-green-900 rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                                        <div className="relative h-full glass-panel bg-black/80 rounded-lg overflow-hidden border border-green-500/30 hover:border-green-400/60 transition-colors flex flex-col">
                                            <div className="relative h-64 overflow-hidden mask-image-b group-hover:mask-image-none transition-all duration-500 bg-deep-black/50 shrink-0">
                                                {isAdmin && (
                                                    <div className="absolute top-4 right-4 z-20 flex gap-2">
                                                        <button onClick={() => handleEdit(car)} className="p-2 bg-black/60 hover:bg-electric-blue/80 text-white rounded-full transition-colors backdrop-blur-md">
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button onClick={() => handleDelete(car._id, car.carName)} className="p-2 bg-black/60 hover:bg-neon-red/80 text-white rounded-full transition-colors backdrop-blur-md">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                )}
                                                <img src={car.imageUrl || fallBackImage} alt={car.carName} className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 saturate-50 group-hover:saturate-100" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-transparent to-transparent opacity-90"></div>
                                            </div>
                                            <div className="p-6 relative z-10 flex-1 flex flex-col">
                                                <div className="mb-4">
                                                    <h3 className="text-2xl font-bold font-heading text-white mb-1 group-hover:text-glow-green transition-all">{car.carName}</h3>
                                                </div>
                                                <div className="space-y-3 mb-2 flex-1">
                                                    <div>
                                                        <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Details</p>
                                                        <p className="text-sm italic text-white/70 whitespace-pre-wrap">{car.description}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Invalid Cars Section */}
                    <div>
                        <div className="flex items-center justify-center gap-3 mb-8">
                            <XCircle className="text-neon-red drop-shadow-[0_0_8px_rgba(255,51,102,0.5)]" size={28} />
                            <h2 className="text-3xl font-bold font-heading text-neon-red drop-shadow-[0_0_8px_rgba(255,51,102,0.5)]">Invalid Cars</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {invalidCarsList.length === 0 ? (
                                <p className="text-white/40 italic text-center col-span-full">No invalid cars listed yet.</p>
                            ) : (
                                invalidCarsList.map((car, idx) => (
                                    <motion.div 
                                        key={car._id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="group relative h-full"
                                    >
                                        <div className="absolute -inset-0.5 bg-gradient-to-br from-red-500 to-red-900 rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                                        <div className="relative h-full glass-panel bg-black/80 rounded-lg overflow-hidden border border-red-500/30 hover:border-red-400/60 transition-colors flex flex-col">
                                            <div className="relative h-64 overflow-hidden mask-image-b group-hover:mask-image-none transition-all duration-500 bg-deep-black/50 shrink-0">
                                                {isAdmin && (
                                                    <div className="absolute top-4 right-4 z-20 flex gap-2">
                                                        <button onClick={() => handleEdit(car)} className="p-2 bg-black/60 hover:bg-electric-blue/80 text-white rounded-full transition-colors backdrop-blur-md">
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button onClick={() => handleDelete(car._id, car.carName)} className="p-2 bg-black/60 hover:bg-neon-red/80 text-white rounded-full transition-colors backdrop-blur-md">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                )}
                                                <img src={car.imageUrl || fallBackImage} alt={car.carName} className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 grayscale group-hover:grayscale-0 opacity-80 group-hover:opacity-100" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-transparent to-transparent opacity-90"></div>
                                            </div>
                                            <div className="p-6 relative z-10 flex-1 flex flex-col">
                                                <div className="mb-4">
                                                    <h3 className="text-2xl font-bold font-heading text-white mb-1 group-hover:text-glow-red transition-all">{car.carName}</h3>
                                                </div>
                                                <div className="space-y-3 mb-2 flex-1">
                                                    <div>
                                                        <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Reason / Details</p>
                                                        <p className="text-sm italic text-white/70 whitespace-pre-wrap">{car.description}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ValidCars;