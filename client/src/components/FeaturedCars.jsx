import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const cars = [
    { id: 1, owner: 'Ghost', style: 'Clean Stance', car: 'Elegy Retro Custom', img: 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&auto=format&fit=crop' },
    { id: 2, owner: 'Apex', style: 'Track Focused', car: 'Jester RR', img: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=800&auto=format&fit=crop' },
    { id: 3, owner: 'VIP', style: 'VIP Luxury', car: 'Schlagen GT', img: 'https://i.redd.it/schlagen-gt-v0-as5glu9kn0j81.png?width=3840&format=png&auto=webp&s=510cdb900a36115696957ae056dba4155b816834' },
];

const FeaturedCars = () => {
    return (
        <section id="garage" className="py-32 bg-charcoal/30 border-y border-white/5 relative overflow-hidden">
            {/* Background accents */}
            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-electric-blue/5 rounded-full blur-[120px] -translate-y-1/2 -z-10"></div>

            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="max-w-xl">
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Featured <span className="text-electric-blue text-glow-blue">Builds</span></h2>
                        <p className="text-white/60 text-lg">A handpicked selection of the cleanest rides from our community. True appreciation for the art of tuning.</p>
                    </div>
                    <Link to="/showroom" className="px-6 py-2 border border-white/20 hover:border-white transition-colors uppercase tracking-widest text-sm font-semibold rounded-sm inline-block">
                        View Showroom
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {cars.map((car, i) => (
                        <motion.div
                            key={car.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: i * 0.15 }}
                            className="group relative cursor-pointer"
                        >
                            <div className="aspect-[4/3] sm:aspect-[3/2] overflow-hidden rounded-sm relative">
                                {/* Overlay gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10"></div>

                                {/* Image (Using unsplash placeholders styled darkly) */}
                                <img
                                    src={car.img}
                                    alt={car.car}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter grayscale group-hover:grayscale-0 brightness-75 group-hover:brightness-100"
                                />

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 p-6 z-20 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    <div className="uppercase tracking-widest text-electric-blue text-xs font-bold mb-2 break-words">
                                        {car.style}
                                    </div>
                                    <h3 className="text-2xl font-bold mb-1 font-heading">{car.car}</h3>
                                    <p className="text-white/60 text-sm">Built by <span className="text-white font-medium">{car.owner}</span></p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedCars;
