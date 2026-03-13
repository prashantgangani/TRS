import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Clock, Zap } from 'lucide-react';
import { API_URL } from '../config';

const CountdownBlock = ({ label, value }) => {
    return (
        <motion.div 
            whileHover={{ y: -6, boxShadow: "0 10px 25px -5px rgba(0, 229, 255, 0.4)" }}
            className="flex flex-col items-center justify-center bg-black/50 backdrop-blur-lg border border-electric-blue/30 rounded-xl py-6 px-4 md:px-8 shadow-[0_0_15px_rgba(0,229,255,0.15)] relative overflow-hidden group min-w-[90px] md:min-w-[120px]"
        >
            {/* Background Glow Pulse */}
            <motion.div 
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-br from-electric-blue/20 via-neon-purple/10 to-transparent"
            ></motion.div>
            
            {/* Glowing circle behind numbers */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-electric-blue/20 rounded-full blur-xl group-hover:bg-electric-blue/40 transition-colors duration-500"></div>
            
            <div className="text-4xl md:text-6xl font-black font-heading text-white drop-shadow-[0_0_12px_rgba(0,229,255,0.8)] tabular-nums relative z-10 w-16 md:w-20 text-center flex justify-center perspective-[1000px]">
                <AnimatePresence mode="popLayout">
                    <motion.span
                        key={value}
                        initial={{ opacity: 0, rotateX: -90, y: 15 }}
                        animate={{ opacity: 1, rotateX: 0, y: 0 }}
                        exit={{ opacity: 0, rotateX: 90, y: -15 }}
                        transition={{ duration: 0.4, type: "spring" }}
                        className="inline-block transform-style-3d origin-center"
                    >
                        {value.toString().padStart(2, '0')}
                    </motion.span>
                </AnimatePresence>
            </div>
            <span className="text-[10px] md:text-sm font-bold uppercase tracking-widest text-electric-blue mt-3 relative z-10">
                {label}
            </span>
        </motion.div>
    );
};

const CountdownTimer = () => {
    const [targetDate, setTargetDate] = useState(null);
    const [eventName, setEventName] = useState("MIDNIGHT TUNERS");
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const fetchNextMeet = async () => {
            try {
                const response = await fetch(`${API_URL}/meets`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.length > 0) {
                        setEventName(data[0].theme);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch next meet theme:", error);
            }

            // Always calculate next Saturday at 10:00 PM IST (16:30 UTC)
            const now = new Date();
            const nextSaturday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 16, 30, 0));
            
            // Find how many days to add until it's Saturday (day 6 in getUTCDay)
            let daysUntilSaturday = (6 - nextSaturday.getUTCDay() + 7) % 7;
            
            // If today is Saturday but 16:30 UTC has already passed, target the NEXT Saturday
            if (daysUntilSaturday === 0 && now.getTime() > nextSaturday.getTime()) {
                daysUntilSaturday = 7;
            }
            
            nextSaturday.setUTCDate(nextSaturday.getUTCDate() + daysUntilSaturday);
            
            setTargetDate(nextSaturday);
            setIsLoaded(true);
        };
        fetchNextMeet();
    }, []);

    useEffect(() => {
        if (!targetDate) return;

        const calculateTimeLeft = () => {
            const difference = +targetDate - +new Date();
            
            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        };

        // Call immediately right after parsing date
        calculateTimeLeft();

        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, [targetDate]);

    // Progress line animation ratio - pseudo realistic (just continuous loop driving)
    // Or we could map it to actual seconds (0 to 60) just for a repeatable cycle
    const progressPercent = (1 - (timeLeft.seconds / 60)) * 100;

    if (!isLoaded) return null;

    return (
        <section className="py-16 md:py-24 relative overflow-hidden bg-[#050505]">
            {/* Background Effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-electric-blue/5 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-electric-blue/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-purple/30 to-transparent"></div>

            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-sm md:text-base font-bold tracking-[0.3em] text-electric-blue uppercase mb-2 flex items-center justify-center gap-2">
                            <Zap size={16} className="text-electric-blue" />
                            Next Crew Meet
                            <Zap size={16} className="text-electric-blue" />
                        </h2>
                        
                        <h1 className="text-4xl md:text-6xl font-black font-heading text-white uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] mb-4">
                            {eventName}
                        </h1>

                        {/* Neon underline animation */}
                        <div className="flex justify-center items-center mt-2 mb-8">
                            <div className="h-0.5 w-12 bg-transparent"></div>
                            <motion.div 
                                className="h-1 w-24 bg-gradient-to-r from-electric-blue via-neon-purple to-electric-blue rounded-full shadow-[0_0_10px_rgba(0,229,255,0.8)]"
                                animate={{ width: ["60px", "120px", "60px"], opacity: [0.7, 1, 0.7] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            />
                            <div className="h-0.5 w-12 bg-transparent"></div>
                        </div>
                    </motion.div>
                </div>

                <div className="flex flex-col items-center">
                    {/* Timer Blocks */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mb-12 w-full max-w-4xl"
                    >
                        <CountdownBlock label="Days" value={timeLeft.days} />
                        <CountdownBlock label="Hours" value={timeLeft.hours} />
                        <CountdownBlock label="Minutes" value={timeLeft.minutes} />
                        <CountdownBlock label="Seconds" value={timeLeft.seconds} />
                    </motion.div>

                    {/* Progress Line with Car */}
                    <div className="w-full max-w-2xl mt-4 mb-10 relative">
                        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden relative">
                            {/* Animated glowing progress track */}
                            <motion.div 
                                className="h-full bg-gradient-to-r from-electric-blue to-neon-purple"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                        {/* Car Icon Driving */}
                        <motion.div 
                            className="absolute top-1/2 -translate-y-1/2 text-electric-blue drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]"
                            style={{ left: `calc(${progressPercent}% - 12px)` }}
                        >
                            <Car size={24} />
                        </motion.div>
                    </div>

                    {/* Timezone Info */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="bg-black/40 border border-white/5 rounded-lg p-5 max-w-md w-full text-center backdrop-blur-sm relative"
                    >
                        {/* Decorative subtle border top */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-electric-blue/50 to-transparent"></div>
                        
                        <div className="flex items-center justify-center gap-2 text-white/50 mb-2">
                            <Clock size={16} />
                            <p className="text-sm font-medium">Official Time: <span className="text-white">10:00 PM IST (India) - Saturday</span></p>
                        </div>
                        {targetDate && (
                            <p className="text-sm font-medium text-electric-blue/90 mb-3">
                                Your Local Time: <span className="text-white font-bold">{targetDate.toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}</span>
                            </p>
                        )}
                        <p className="text-xs text-white/40 italic">
                            *Time automatically adjusted to your region
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default CountdownTimer;
