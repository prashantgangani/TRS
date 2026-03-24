import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Search, Edit2, Trash2, CheckCircle, XCircle, ArrowLeft, DownloadCloud } from 'lucide-react';
import { motion } from 'framer-motion';
import { API_URL } from '../config';
import LazyImage from '../components/LazyImage';

const AdminCarLibrary = ({ isAdmin }) => {
    const navigate = useNavigate();
    const [cars, setCars] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCar, setEditingCar] = useState(null);
    const [formData, setFormData] = useState({ name: '', imageUrl: '', description: '' });
    const [message, setMessage] = useState('');
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        if (!isAdmin) return;
        fetchCars();
        fetchSettings();
    }, [isAdmin]);

    const fetchSettings = async () => {
        try {
            const res = await fetch(`${API_URL}/settings`);
            if (res.ok) {
                const data = await res.json();
                setSettings(data);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        }
    };

    const fetchCars = async () => {
        try {
            const token = localStorage.getItem('trs_token');
            const res = await fetch(`${API_URL}/car-library`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            setCars(data);
        } catch (error) {
            console.error('Error fetching library cars:', error);
            showMessage('Error fetching cars', 'error');
        }
    };

    const showMessage = (msg, type = 'success') => {
        setMessage({ text: msg, type });
        setTimeout(() => setMessage(''), 3000);
    };

    const handleOpenForm = (car = null) => {
        if (car) {
            setEditingCar(car);
            setFormData({ name: car.name, imageUrl: car.imageUrl || '', description: car.description || '' });
        } else {
            setEditingCar(null);
            setFormData({ name: '', imageUrl: '', description: '' });
        }
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingCar(null);
        setFormData({ name: '', imageUrl: '', description: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('trs_token');
            const headers = { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };
            
            if (editingCar) {
                const res = await fetch(`${API_URL}/car-library/${editingCar._id}`, {
                    method: 'PATCH',
                    headers,
                    body: JSON.stringify(formData)
                });
                if (!res.ok) {
                    const errData = await res.json();
                    throw new Error(errData.message || 'Failed to update');
                }
                showMessage('Library car updated');
            } else {
                const res = await fetch(`${API_URL}/car-library`, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(formData)
                });
                if (!res.ok) {
                    const errData = await res.json();
                    throw new Error(errData.message || 'Failed to add');
                }
                showMessage('Library car added');
            }
            
            fetchCars();
            handleCloseForm();
        } catch (error) {
            console.error('Error saving car:', error);
            showMessage(error.message || 'Error saving car', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this reusable car? (This will not remove valid/invalid cars previously created from it)')) return;
        try {
            const token = localStorage.getItem('trs_token');
            const res = await fetch(`${API_URL}/car-library/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to delete');
            showMessage('Library car deleted successfully');
            fetchCars();
        } catch (error) {
            console.error('Error deleting car:', error);
            showMessage('Error deleting car', 'error');
        }
    };

    const handlePublish = async (id, status) => {
        try {
            const token = localStorage.getItem('trs_token');
            const endpoint = status === 'valid' ? 'add-to-valid' : 'add-to-invalid';
            const res = await fetch(`${API_URL}/car-library/${id}/${endpoint}`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!res.ok) throw new Error('Failed to publish');
            showMessage(`Added to ${status === 'valid' ? 'Valid' : 'Invalid'} Cars successfully.`);
        } catch (error) {
            console.error(`Error adding to ${status}:`, error);
            showMessage('Error publishing car to list', 'error');
        }
    };

    const handleImportFromValidCars = async () => {
        if (!window.confirm('Import all current cars from the Valid/Invalid list into this library?')) return;
        try {
            const token = localStorage.getItem('trs_token');
            const res = await fetch(`${API_URL}/car-library/import-from-valid`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!res.ok) throw new Error('Failed to import');
            const data = await res.json();
            showMessage(data.message);
            fetchCars();
        } catch (error) {
            console.error('Error importing cars:', error);
            showMessage('Error importing cars', 'error');
        }
    };

    const filteredCars = cars.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!isAdmin || (settings && settings.manageMasterLibrary === false)) {
        return (
            <div className="pt-24 min-h-screen text-center text-white">
                <h2 className="text-2xl font-bold text-neon-red">
                    {!isAdmin ? 'Access Denied' : 'Master Library Disabled by Super Admin'}
                </h2>
            </div>
        );
    }

    return (
        <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto text-white min-h-screen">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6"
            >
                <div>
                    <div className="flex items-center gap-4 mb-2">
                        <button 
                            onClick={() => navigate('/valid-cars')}
                            className="text-white/40 hover:text-white transition-colors flex items-center gap-2 text-sm font-bold uppercase tracking-wider"
                        >
                            <ArrowLeft size={16} /> Back
                        </button>
                        <h1 className="text-4xl md:text-5xl font-black font-heading text-white" style={{ textShadow: "0 0 15px rgba(255,255,255,0.7), 0 0 25px rgba(255,255,255,0.4)" }}>
                            Master Library
                        </h1>
                    </div>
                    <p className="text-white/60 mt-2 text-lg max-w-xl ml-0 md:ml-[88px] leading-relaxed">
                        A reusable master archive of all uploaded cars for quick weekly valid/invalid list management.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={handleImportFromValidCars}
                        className="group relative flex items-center justify-center gap-2 px-6 py-3 bg-black text-ls-orange font-bold uppercase tracking-wider rounded-lg border-2 border-ls-orange hover:bg-ls-orange hover:text-white transition-all shadow-[0_0_15px_rgba(255,0,255,0.2)] hover:shadow-[0_0_25px_rgba(255,0,255,0.5)] overflow-hidden"
                    >
                        <div className="absolute w-[200%] h-full bg-white/10 group-hover:translate-x-full -translate-x-full transition-transform duration-700 ease-in-out skew-x-12"></div>
                        <DownloadCloud size={20} className="relative z-10 group-hover:-translate-y-1 transition-transform" />
                        <span className="relative z-10">Import Active Cars</span>
                    </button>
                    <button
                        onClick={() => handleOpenForm()}
                        className="group relative flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-neon-blue to-blue-600 text-white font-black uppercase tracking-widest rounded-lg transition-all hover:scale-105 shadow-[0_0_20px_rgba(0,255,255,0.4)] hover:shadow-[0_0_30px_rgba(0,255,255,0.7)] overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-white/20 group-hover:translate-x-[150%] -translate-x-[150%] transition-transform duration-500 ease-out skew-x-12"></div>
                        <PlusCircle size={22} className="relative z-10 group-hover:rotate-90 transition-transform duration-300" />
                        <span className="relative z-10 drop-shadow-md">Add New Car</span>
                    </button>
                </div>
            </motion.div>

            {message && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`mb-6 p-4 rounded text-center font-bold glass-panel border ${message.type === 'error' ? 'bg-red-500/10 text-neon-red border-red-500/50' : 'bg-green-500/10 text-green-400 border-green-500/50'}`}
                >
                    {message.text}
                </motion.div>
            )}

            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col md:flex-row justify-end mb-10 mt-2 relative z-10"
            >
                <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-4 flex items-center gap-4 shadow-lg w-full md:w-[450px]">
                    <Search size={22} className="text-neon-blue drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]" />
                    <input
                        type="text"
                        placeholder="Search master library by car name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent border-none text-white focus:outline-none placeholder:text-white/30 text-lg"
                    />
                </div>
            </motion.div>

            {isFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-black/90 glass-panel border border-neon-blue/50 rounded-xl p-8 w-full max-w-lg shadow-[0_0_30px_rgba(0,255,255,0.2)] relative"
                    >
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-neon-blue via-ls-orange to-neon-blue rounded-t-xl"></div>
                        <h2 className="text-3xl font-black mb-6 font-heading text-glow">
                            {editingCar ? 'Edit Library Car' : 'Add New Library Car'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Car Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData(formData => ({ ...formData, name: e.target.value }))}
                                    className="w-full p-4 bg-black/50 border border-white/10 rounded-lg text-white focus:border-neon-blue focus:shadow-[0_0_10px_rgba(0,255,255,0.3)] focus:outline-none transition-all"
                                    placeholder="e.g. Ocelot Pariah"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Image URL</label>
                                <input
                                    type="text"
                                    value={formData.imageUrl}
                                    onChange={(e) => setFormData(formData => ({ ...formData, imageUrl: e.target.value }))}
                                    className="w-full p-4 bg-black/50 border border-white/10 rounded-lg text-white focus:border-neon-blue focus:shadow-[0_0_10px_rgba(0,255,255,0.3)] focus:outline-none transition-all"
                                    placeholder="https://..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Description</label>
                                <textarea
                                    rows="4"
                                    value={formData.description}
                                    onChange={(e) => setFormData(formData => ({ ...formData, description: e.target.value }))}
                                    className="w-full p-4 bg-black/50 border border-white/10 rounded-lg text-white focus:border-neon-blue focus:shadow-[0_0_10px_rgba(0,255,255,0.3)] focus:outline-none transition-all resize-none"
                                    placeholder="Add any specific requirements, allowed modifications, etc..."
                                />
                            </div>
                            <div className="flex gap-4 pt-4 mt-2 border-t border-white/10">
                                <button
                                    type="button"
                                    onClick={handleCloseForm}
                                    className="flex-1 py-3 bg-white/5 text-white/70 rounded border border-white/10 hover:bg-white/10 hover:text-white transition-all font-bold uppercase tracking-widest text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-ls-gold text-black font-bold uppercase tracking-widest text-sm rounded hover:bg-white hover:shadow-[0_0_15px_rgba(0,229,255,0.6)] transition-all"
                                >
                                    {editingCar ? 'Update Car' : 'Save Car'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredCars.map((car, idx) => (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        key={car._id} 
                        className="group relative h-full flex flex-col"
                    >
                        <div className="absolute -inset-0.5 bg-gradient-to-br from-neon-blue to-ls-orange rounded-lg blur opacity-20 group-hover:opacity-50 transition duration-500"></div>
                        <div className="relative h-full bg-black/80 rounded-lg overflow-hidden border border-neon-blue/30 group-hover:border-neon-blue/60 transition-colors flex flex-col shadow-xl">
                            {car.imageUrl ? (
                                <div className="h-48 overflow-hidden relative mask-image-b group-hover:mask-image-none transition-all duration-500 shrink-0">
                                    <LazyImage src={car.imageUrl} variant="card" alt={car.name} className="group-hover:scale-110 transition-transform duration-700 saturate-50 group-hover:saturate-100" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-transparent to-transparent opacity-90"></div>
                                </div>
                            ) : (
                                <div className="h-48 bg-gray-900/50 flex items-center justify-center text-white/20 font-bold uppercase tracking-widest border-b border-white/5 shrink-0">
                                    No Image
                                </div>
                            )}
                            
                            <div className="p-5 flex-1 flex flex-col z-10 relative">
                                <h3 className="text-xl font-bold font-heading text-white mb-2 group-hover:text-glow transition-all">{car.name}</h3>
                                <p className="text-white/50 text-sm line-clamp-3 mb-6 flex-1 italic">
                                    {car.description || 'No description provided.'}
                                </p>
                                
                                <div className="grid grid-cols-2 gap-3 mb-4 mt-auto">
                                    <button
                                        onClick={() => handlePublish(car._id, 'valid')}
                                        className="flex items-center justify-center gap-1 py-2 bg-green-500/10 text-green-400 border border-green-500/30 rounded hover:bg-green-500 hover:text-black transition-all hover:shadow-[0_0_10px_rgba(74,222,128,0.5)]"
                                        title="Add this car to the current weekly Valid list"
                                    >
                                        <CheckCircle size={16} />
                                        <span className="text-xs font-bold uppercase tracking-wider">Valid</span>
                                    </button>
                                    <button
                                        onClick={() => handlePublish(car._id, 'invalid')}
                                        className="flex items-center justify-center gap-1 py-2 bg-red-500/10 text-neon-red border border-red-500/30 rounded hover:bg-neon-red hover:text-white transition-all hover:shadow-[0_0_10px_rgba(255,51,102,0.5)]"
                                        title="Add this car to the current weekly Invalid list"
                                    >
                                        <XCircle size={16} />
                                        <span className="text-xs font-bold uppercase tracking-wider">Invalid</span>
                                    </button>
                                </div>
                                
                                <div className="flex border-t border-white/10 pt-3">
                                    <button
                                        onClick={() => handleOpenForm(car)}
                                        className="flex-1 flex justify-center py-2 text-white/50 hover:text-neon-blue transition-colors"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <div className="w-px bg-white/10 mx-2"></div>
                                    <button
                                        onClick={() => handleDelete(car._id)}
                                        className="flex-1 flex justify-center py-2 text-white/50 hover:text-neon-red transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {filteredCars.length === 0 && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20 text-white/40 border border-white/5 rounded-lg bg-black/30"
                >
                    <p className="text-xl font-heading mb-2">
                        {searchQuery ? 'No cars found matching your search.' : 'Library is currently empty.'}
                    </p>
                    {!searchQuery && (
                        <p className="text-sm">Click 'Add New Car' or 'Import Active Cars' to populate the master library.</p>
                    )}
                </motion.div>
            )}
        </div>
    );
};

export default AdminCarLibrary;