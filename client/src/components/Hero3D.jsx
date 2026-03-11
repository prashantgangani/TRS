import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
    Environment,
    ContactShadows,
    PerspectiveCamera,
    Float,
    MeshReflectorMaterial,
    Sparkles,
    OrbitControls,
    SpotLight
} from '@react-three/drei';
import { motion } from 'framer-motion';

// High-detail abstract tuner car
function StylizedCar() {
    const group = useRef();
    const wheelsFrontRef = useRef([]);
    
    // Simple state to hold a random flicker for headlights on load
    const [flicker, setFlicker] = useState(1);
    
    useEffect(() => {
        // Headlight flicker effect on initial load
        let count = 0;
        const interval = setInterval(() => {
            setFlicker(Math.random() > 0.5 ? 1 : 0.2);
            count++;
            if (count > 5) {
                setFlicker(1);
                clearInterval(interval);
            }
        }, 150);
        return () => clearInterval(interval);
    }, []);

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        // Idle breathing suspension (very subtle)
        group.current.position.y = 0.35 + Math.sin(t * 1.5) * 0.005;
        
        // Gentle wheel steering back and forth
        const steeringAngle = Math.sin(t * 0.8) * 0.15;
        wheelsFrontRef.current.forEach(wheel => {
            if (wheel) wheel.rotation.y = steeringAngle;
        });
    });

    const bodyMaterial = <meshStandardMaterial color="#050505" metalness={0.95} roughness={0.05} envMapIntensity={2.5} />;
    const glassMaterial = <meshStandardMaterial color="#000000" metalness={1} roughness={0} envMapIntensity={3} />;
    const darkTrimMaterial = <meshStandardMaterial color="#0a0a0a" metalness={0.8} roughness={0.6} />;

    return (
        <group ref={group} dispose={null} position={[0, 0.35, 0]}>
            {/* Lower Chassis / Skirts */}
            <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
                <boxGeometry args={[1.9, 0.2, 4.4]} />
                {darkTrimMaterial}
            </mesh>
            
            {/* Front Splitter */}
            <mesh position={[0, 0.12, 2.25]} castShadow receiveShadow>
                <boxGeometry args={[1.95, 0.04, 0.4]} />
                {darkTrimMaterial}
            </mesh>

            {/* Rear Diffuser */}
            <mesh position={[0, 0.15, -2.25]} castShadow receiveShadow>
                <boxGeometry args={[1.8, 0.1, 0.3]} />
                {darkTrimMaterial}
            </mesh>

            {/* Main Body Upper */}
            <mesh position={[0, 0.4, -0.1]} castShadow receiveShadow>
                <boxGeometry args={[1.85, 0.3, 4.2]} />
                {bodyMaterial}
            </mesh>
            
            {/* Hood contour */}
            <mesh position={[0, 0.5, 1.4]} castShadow receiveShadow rotation={[0.05, 0, 0]}>
                <boxGeometry args={[1.7, 0.1, 1.4]} />
                {bodyMaterial}
            </mesh>

            {/* Greenhouse / Cabin */}
            <mesh position={[0, 0.75, -0.4]} castShadow receiveShadow>
                {/* Slanted windshields accomplished by abstract rotation or geometry, keeping it simple with a tapered look if possible, or just a box */}
                <boxGeometry args={[1.4, 0.4, 2.2]} />
                {glassMaterial}
            </mesh>

            {/* Spoiler */}
            <group position={[0, 0.7, -1.9]}>
                {/* Wing */}
                <mesh position={[0, 0.2, 0]} castShadow>
                    <boxGeometry args={[1.7, 0.05, 0.3]} />
                    {darkTrimMaterial}
                </mesh>
                {/* Struts */}
                <mesh position={[-0.6, 0.1, 0]} castShadow>
                    <boxGeometry args={[0.05, 0.2, 0.1]} />
                    {darkTrimMaterial}
                </mesh>
                <mesh position={[0.6, 0.1, 0]} castShadow>
                    <boxGeometry args={[0.05, 0.2, 0.1]} />
                    {darkTrimMaterial}
                </mesh>
            </group>

            {/* Headlights */}
            <group position={[0, 0.45, 2.16]}>
                <mesh position={[-0.65, 0, 0]} castShadow>
                    <boxGeometry args={[0.4, 0.06, 0.02]} />
                    <meshBasicMaterial color="#ffffff" toneMapped={false} transparent opacity={flicker} />
                    <pointLight color="#ffffff" intensity={2 * flicker} distance={6} decay={2} />
                </mesh>
                <mesh position={[0.65, 0, 0]} castShadow>
                    <boxGeometry args={[0.4, 0.06, 0.02]} />
                    <meshBasicMaterial color="#ffffff" toneMapped={false} transparent opacity={flicker} />
                    <pointLight color="#ffffff" intensity={2 * flicker} distance={6} decay={2} />
                </mesh>
                
                {/* DRL Neon Accents */}
                <mesh position={[-0.65, 0.05, 0]}>
                    <boxGeometry args={[0.4, 0.015, 0.02]} />
                    <meshBasicMaterial color="#00e5ff" toneMapped={false} />
                </mesh>
                <mesh position={[0.65, 0.05, 0]}>
                    <boxGeometry args={[0.4, 0.015, 0.02]} />
                    <meshBasicMaterial color="#00e5ff" toneMapped={false} />
                </mesh>
            </group>

            {/* Taillights */}
            <group position={[0, 0.45, -2.16]}>
                <mesh position={[-0.65, 0, 0]}>
                    <boxGeometry args={[0.5, 0.08, 0.02]} />
                    <meshBasicMaterial color="#ff0044" toneMapped={false} />
                    <pointLight color="#ff0044" intensity={3} distance={4} decay={2} />
                </mesh>
                <mesh position={[0.65, 0, 0]}>
                    <boxGeometry args={[0.5, 0.08, 0.02]} />
                    <meshBasicMaterial color="#ff0044" toneMapped={false} />
                </mesh>
                
                {/* Lightbar connecting them */}
                <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[0.8, 0.02, 0.02]} />
                    <meshBasicMaterial color="#ff0044" toneMapped={false} />
                </mesh>
            </group>

            {/* Underglow (Neon Purple) */}
            <pointLight position={[0, -0.1, 0]} color="#b026ff" intensity={15} distance={5} decay={2} />
            <mesh position={[0, 0.1, 0]} rotation={[-Math.PI/2, 0, 0]}>
                <planeGeometry args={[1.8, 4.2]} />
                <meshBasicMaterial color="#b026ff" transparent opacity={0.6} toneMapped={false} />
            </mesh>

            {/* Wheels */}
            {[-1.3, 1.4].map((z, j) => (
                <group key={j}>
                    {[-0.95, 0.95].map((x, i) => {
                        const isFront = z > 0;
                        return (
                            <group 
                                key={`${i}-${j}`} 
                                position={[x, 0.1, z]} 
                                ref={isFront ? (el) => (wheelsFrontRef.current[i] = el) : null}
                            >
                                {/* Tire */}
                                <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
                                    <cylinderGeometry args={[0.38, 0.38, 0.25, 32]} />
                                    <meshStandardMaterial color="#0a0a0a" roughness={0.9} metalness={0.1} />
                                </mesh>
                                {/* Rim Inner */}
                                <mesh rotation={[0, 0, Math.PI / 2]}>
                                    <cylinderGeometry args={[0.25, 0.25, 0.27, 24]} />
                                    <meshStandardMaterial color="#111" metalness={0.9} roughness={0.2} />
                                </mesh>
                                {/* Rim Spokes / Outer Glow */}
                                <mesh rotation={[0, 0, Math.PI / 2]}>
                                    <cylinderGeometry args={[0.24, 0.24, 0.28, 8]} />
                                    <meshStandardMaterial color="#b026ff" emissive="#b026ff" emissiveIntensity={0.8} />
                                </mesh>
                            </group>
                        );
                    })}
                </group>
            ))}
        </group>
    );
}

const Hero3D = () => {
    return (
        <section className="relative w-full min-h-[100svh] bg-deep-black overflow-hidden flex flex-col-reverse lg:flex-row items-center">
            
            {/* Background Base */}
            <div className="absolute inset-0 bg-[#030303] -z-10"></div>
            
            {/* Ambient Background Glow mapping to layout */}
            <div className="absolute top-1/2 right-1/4 w-[800px] h-[800px] bg-neon-purple/5 blur-[150px] rounded-full pointer-events-none -z-10 translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-1/2 w-[600px] h-[600px] bg-electric-blue/5 blur-[150px] rounded-full pointer-events-none -z-10 translate-x-1/2"></div>

            {/* Left Side - Content */}
            <div className="w-full lg:w-[45%] lg:min-h-[100svh] flex flex-col justify-center px-6 sm:px-12 lg:pl-16 xl:pl-24 pt-12 pb-24 lg:py-0 z-20 relative shrink-0">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="max-w-2xl pointer-events-auto"
                >
                    <div className="flex gap-3 mb-6 flex-wrap">
                        <span className="glassmorphism px-3 py-1 rounded-sm text-[10px] sm:text-xs uppercase tracking-widest text-white/80 border-white/20">Night Drives</span>
                        <span className="glassmorphism px-3 py-1 rounded-sm text-[10px] sm:text-xs uppercase tracking-widest text-white/80 border-neon-purple/50 text-neon-purple drop-shadow-[0_0_8px_rgba(176,38,255,0.5)]">Themed Meets</span>
                        <span className="glassmorphism px-3 py-1 rounded-sm text-[10px] sm:text-xs uppercase tracking-widest text-white/80 border-electric-blue/50 text-electric-blue drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]">GTA Online</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold font-heading leading-[1.1] mb-6 drop-shadow-2xl">
                        Where Los Santos <br />
                        Car Culture <br className="hidden lg:block"/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-electric-blue">Comes Alive</span>
                    </h1>

                    <p className="text-base sm:text-lg lg:text-xl text-white/70 max-w-xl mb-10 leading-relaxed font-light">
                        A GTA Online crew website for themed car meets, event announcements, featured builds, and community showcases.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
                        <button className="px-6 md:px-8 py-4 bg-white text-deep-black font-bold uppercase tracking-widest text-xs md:text-sm rounded-sm hover:bg-white/90 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 duration-300">
                            Upcoming Meets
                        </button>
                        <button className="px-6 md:px-8 py-4 glass-panel border border-white/20 text-white font-bold uppercase tracking-widest text-xs md:text-sm rounded-sm hover:border-white transition-all hover:bg-white/10 group hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                            Explore Crew
                            <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Right Side - 3D Showcase */}
            <div className="w-full lg:w-[55%] h-[50vh] lg:h-[100svh] relative z-10 shrink-0">
                
                {/* 3D Canvas wrapper */}
                <div className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing">
                    <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, toneMappingExposure: 1.2 }}>
                        {/* Cinematic front 3/4 angle camera */}
                        <PerspectiveCamera makeDefault position={[5.5, 2.5, 6]} fov={35} />

                        {/* Minimal fog to blend the horizon */}
                        <fog attach="fog" args={['#030303', 10, 25]} />

                        {/* Environment map for realistic automotive reflections */}
                        <Environment preset="city" />

                        {/* Lighting Setup */}
                        <ambientLight intensity={0.1} />
                        
                        {/* Key light aimed at the car body */}
                        <SpotLight
                            position={[0, 6, 4]}
                            angle={0.6}
                            penumbra={1}
                            intensity={150}
                            color="#ffffff"
                            castShadow
                            shadow-bias={-0.0001}
                        />
                        
                        {/* Rim lights to define silhouette */}
                        <SpotLight position={[4, 2, -5]} angle={0.8} penumbra={1} intensity={150} color="#b026ff" />
                        <SpotLight position={[-4, 2, -5]} angle={0.8} penumbra={1} intensity={120} color="#00e5ff" />
                        <SpotLight position={[5, 1, 5]} angle={0.5} penumbra={1} intensity={80} color="#ffffff" />

                        {/* Car Group */}
                        <Float speed={1.2} rotationIntensity={0} floatIntensity={0} floatingRange={[0, 0]}>
                            {/* We use Float to optionally add more overarching motion, but keeping it inside StylizedCar for control */}
                            <group rotation={[0, -0.4, 0]}>
                                <StylizedCar />
                            </group>
                        </Float>

                        {/* Ambient Particles */}
                        <Sparkles count={150} scale={14} size={1.5} speed={0.2} opacity={0.15} color="#00e5ff" />
                        <Sparkles count={50} scale={10} size={2} speed={0.4} opacity={0.2} color="#b026ff" />

                        {/* Polished Garage Floor */}
                        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                            <planeGeometry args={[60, 60]} />
                            <MeshReflectorMaterial
                                blur={[400, 100]}
                                resolution={1024}
                                mixBlur={1.5}
                                mixStrength={80}
                                roughness={0.8}
                                depthScale={1.2}
                                minDepthThreshold={0.4}
                                maxDepthThreshold={1.4}
                                color="#020202"
                                metalness={0.6}
                            />
                        </mesh>

                        {/* Soft ambient shadow plane immediately under the car to ground it perfectly */}
                        <ContactShadows position={[0, 0.01, 0]} scale={12} resolution={512} blur={2.5} opacity={0.8} far={2} />

                        {/* Interactive Orbit - gentle auto rotation */}
                        <OrbitControls 
                            enableZoom={false} 
                            enablePan={false} 
                            autoRotate 
                            autoRotateSpeed={0.5}
                            minPolarAngle={Math.PI / 3}
                            maxPolarAngle={Math.PI / 2 - 0.05} // Keep camera above floor
                            target={[0, 0.5, 0]}
                        />
                    </Canvas>
                </div>

                {/* Fade gradients to smoothly blend the 3D canvas into the site's dark mode UI */}
                {/* Desktop Left Fade */}
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#030303] to-transparent hidden lg:block pointer-events-none"></div>
                {/* Mobile Bottom Fade (since text is below car on mobile) */}
                <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#030303] to-transparent block lg:hidden pointer-events-none"></div>
                {/* Top Fade */}
                <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#030303] to-transparent pointer-events-none"></div>
                {/* Right edge Fade for super wide screens */}
                <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#030303] to-transparent pointer-events-none"></div>
                
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-6 md:bottom-10 left-1/2 lg:left-[22.5%] -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none"
            >
                <div className="text-[10px] sm:text-xs uppercase tracking-widest text-white/50">Scroll</div>
                <div className="w-[1px] h-8 md:h-12 bg-gradient-to-b from-white/50 to-transparent"></div>
            </motion.div>
        </section>
    );
};

export default Hero3D;
