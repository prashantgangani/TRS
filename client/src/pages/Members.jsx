import LazyImage from '../components/LazyImage';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ArrowUp, ArrowDown, Edit2 } from 'lucide-react';
import { API_URL } from '../config';

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" } }
};

const Members = ({ isSuperAdmin }) => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form State for Add Member
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [image, setImage] = useState('');
    const [color, setColor] = useState('from-neon-purple to-purple-900');
    const [editingId, setEditingId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Limit visible members for bandwidth
    const [visibleCount, setVisibleCount] = useState(12);

    const fetchMembers = async () => {
        try {
            const response = await fetch(`${API_URL}/members`);
            const data = await response.json();
            setMembers(data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch members:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    const handleAddOrUpdateMember = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const payload = { name, role, color, image };
        try {
            if (editingId) {
                const response = await fetch(`${API_URL}/members/${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (response.ok) {
                    const updatedMember = await response.json();
                    setMembers(members.map(m => m._id === editingId ? updatedMember : m));
                    setEditingId(null);
                    setName(''); setRole(''); setImage(''); setColor('from-neon-purple to-purple-900');
                }
            } else {
                const response = await fetch(`${API_URL}/members`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (response.ok) {
                    fetchMembers();
                    setName(''); setRole(''); setImage(''); setColor('from-neon-purple to-purple-900');
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (member) => {
        setEditingId(member._id);
        setName(member.name);
        setRole(member.role);
        setImage(member.image || '');
        setColor(member.color || 'from-neon-purple to-purple-900');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteMember = async (id) => {
        if (!window.confirm("Are you sure you want to remove this member?")) return;
        try {
            const response = await fetch(`${API_URL}/members/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setMembers(members.filter(m => m._id !== id));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleMove = async (index, direction) => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === members.length - 1) return;

        const newMembers = [...members];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        
        // Swap orders locally
        const tempOrder = newMembers[index].order;
        newMembers[index].order = newMembers[swapIndex].order;
        newMembers[swapIndex].order = tempOrder;

        // Visual Optimistic update
        const tempObj = newMembers[index];
        newMembers[index] = newMembers[swapIndex];
        newMembers[swapIndex] = tempObj;
        setMembers(newMembers);

        // Send backend updates
        try {
            await fetch(`${API_URL}/members/${newMembers[index]._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order: newMembers[index].order })
            });
            await fetch(`${API_URL}/members/${newMembers[swapIndex]._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order: newMembers[swapIndex].order })
            });
        } catch (error) {
            console.error("Failed to update hierarchy:", error);
            fetchMembers(); // Revert on failure
        }
    };

    return (
        <section className="min-h-screen bg-deep-black pt-32 pb-24 px-6 md:px-12 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-neon-purple/5 to-transparent pointer-events-none -z-10"></div>
            <div className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vw] bg-electric-blue/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <span className="glassmorphism px-3 py-1 rounded-sm text-xs uppercase tracking-widest text-neon-purple border-neon-purple/30 mb-4 inline-block shadow-[0_0_10px_rgba(176,38,255,0.2)]">
                        The Roster
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold font-heading mb-4 text-white drop-shadow-lg">
                        Meet The <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-electric-blue">Crew</span>
                    </h1>
                    <p className="text-white/60 max-w-2xl mx-auto text-sm md:text-base">
                        The drivers, builders, and organizers that keep the Los Santos underground scene alive. These are the elite members of The Royal Sorcerers.
                    </p>
                </motion.div>

                {/* Members Grid & Admin Add Card */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    
                    {/* SUPERADMIN ONLY: ADD NEW MEMBER */}
                    {isSuperAdmin && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-panel p-6 rounded-lg border-2 border-dashed border-electric-blue/50 bg-electric-blue/5 relative flex flex-col justify-center"
                        >
                            <h3 className="text-xl font-bold mb-4 font-heading text-electric-blue flex items-center gap-2 drop-shadow-md">
                                <Plus size={20} /> {editingId ? 'Modify Member File' : 'Appoint New Member'}
                            </h3>
                            <form onSubmit={handleAddOrUpdateMember} className="space-y-3">
                                <input required type="text" placeholder="Alias (e.g. GhostRider99)" value={name} onChange={e => setName(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-electric-blue" />
                                <input required type="text" placeholder="Crew Rank (e.g. Muscle)" value={role} onChange={e => setRole(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-electric-blue" />
                                <input type="text" placeholder="Crew Image Link (e.g. /images/me.jpg)" value={image} onChange={e => setImage(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-electric-blue" />
                                
                                <select value={color} onChange={e => setColor(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-sm text-white/70 focus:outline-none focus:border-electric-blue outline-none cursor-pointer">
                                    <option value="from-neon-purple to-purple-900">Purple Aura</option>
                                    <option value="from-electric-blue to-blue-900">Blue Aura</option>
                                    <option value="from-red-500 to-red-900">Red Aura</option>
                                    <option value="from-emerald-500 to-emerald-900">Green Aura</option>
                                    <option value="from-electric-blue to-yellow-900">Gold Aura</option>
                                </select>
                                
                                <button disabled={isSubmitting} type="submit" className="w-full py-3 mt-4 bg-electric-blue hover:bg-electric-blue/80 text-white text-xs font-bold uppercase tracking-widest rounded transition-colors shadow-[0_0_15px_rgba(0,240,255,0.4)]">
                                    {isSubmitting ? (editingId ? 'Updating...' : 'Appointing...') : (editingId ? 'Update Record' : 'Register Member')}
                                </button>
                                {editingId && (
                                    <button type="button" onClick={() => {
                                        setEditingId(null);
                                        setName(''); setRole(''); setImage(''); setColor('from-neon-purple to-purple-900');
                                    }} className="w-full py-2 mt-2 bg-black/50 border border-white/20 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest rounded transition-colors">
                                        Cancel Edit
                                    </button>
                                )}
                            </form>
                        </motion.div>
                    )}

                    {loading ? (
                        <div className="text-white/50 col-span-1 text-center py-10 tracking-widest uppercase text-sm">Loading Roster Data...</div>
                    ) : (
                    <AnimatePresence>
                      {members.slice(0, visibleCount).map((member, index) => (
                        <motion.div key={member._id} variants={cardVariants} initial="hidden" animate="show" exit={{ opacity: 0, scale: 0.9 }} className="group relative" layout>
                            {/* SuperAdmin Hierarchy Controls */}
                            {isSuperAdmin && (
                                <div className="absolute -left-12 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20">
                                    <button onClick={() => handleMove(index, 'up')} disabled={index === 0} className="w-8 h-8 rounded-full bg-black/80 border border-white/20 text-white flex items-center justify-center hover:bg-electric-blue hover:text-white disabled:opacity-30 transition-colors">
                                        <ArrowUp size={16} />
                                    </button>
                                    <button onClick={() => handleMove(index, 'down')} disabled={index === members.length - 1} className="w-8 h-8 rounded-full bg-black/80 border border-white/20 text-white flex items-center justify-center hover:bg-electric-blue hover:text-white disabled:opacity-30 transition-colors">
                                        <ArrowDown size={16} />
                                    </button>
                                </div>
                            )}

                            {/* Card Glow Background on Hover */}
                            <div className={`absolute -inset-0.5 bg-gradient-to-br ${member.color} rounded-lg blur opacity-0 group-hover:opacity-40 transition duration-500`}></div>

                            {/* Card Content */}
                            <div className="relative h-full glass-panel rounded-lg overflow-hidden border border-white/10 hover:border-white/20 transition-colors flex flex-col">

                                {/* Image Section */}
                                <div className="relative h-64 overflow-hidden mask-image-b group-hover:mask-image-none transition-all duration-500 bg-deep-black/50">
                                    {isSuperAdmin && (
                                        <div className="absolute top-4 right-4 z-20 flex gap-2">
                                            <button onClick={() => handleEdit(member)} className="p-2 bg-black/60 hover:bg-electric-blue/80 text-white rounded-full transition-colors backdrop-blur-md">
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => handleDeleteMember(member._id)} className="p-2 bg-black/60 hover:bg-neon-red/80 text-white rounded-full transition-colors backdrop-blur-md">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    )}
                                      <LazyImage
                                          src={member.image}
                                          variant="card"
                                          fallbackSrc="https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&auto=format&fit=crop"
                                          alt={member.name}
                                          containerClassName="p-2"
                                          className="group-hover:scale-110 transition-transform duration-700 saturate-50 group-hover:saturate-100"
                                    />
                                    {/* Vignette */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-transparent to-transparent opacity-90 pointer-events-none"></div>
                                </div>

                                {/* Text Detail Section */}
                                <div className="p-6 relative z-10 flex-1 flex flex-col">
                                    <div className="mb-4">
                                        <p className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5"></p>
                                        <h3 className="text-2xl font-bold font-heading text-white mb-1 group-hover:text-glow transition-all">{member.name}</h3>
                                    </div>
                                    <p className="text-neon-purple text-xs font-bold uppercase tracking-widest mb-4 inline-block drop-shadow-[0_0_8px_rgba(176,38,255,0.4)]">
                                        {member.role}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    </AnimatePresence>
                    )}
                </div>

                  {!loading && members.length > visibleCount && (
                      <div className="mt-12 flex justify-center w-full">
                          <button
                              onClick={(e) => {
                                  e.preventDefault();
                                  const currentScrollY = window.scrollY;
                                  setVisibleCount(prev => prev + 12);
                                  setTimeout(() => {
                                      window.scrollTo({
                                          top: currentScrollY,
                                          behavior: "instant"
                                      });
                                  }, 5);
                              }}
                              className="px-8 py-4 border border-white/20 hover:border-electric-blue hover:text-electric-blue transition-all uppercase tracking-widest text-sm font-bold rounded-sm text-white"
                          >
                              Load More
                          </button>
                      </div>
                  )}
            </div>

            {/* SUPERADMIN STAFF MANAGEMENT */}
            {/* Staff clearance removed, moved to Staff Credentials */}
        </section>
    );
};

export default Members;
