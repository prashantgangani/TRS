import React, { useState, useEffect } from 'react';

const loadingMessages = [
  "Initializing Garage System...",
  "Syncing Crew Builds...",
  "Fetching Real-time Metrics...",
  "Loading Member Data...",
  "Preparing Showroom Spotlight...",
  "Bypassing Security Firewalls...",
  "Finalizing Experience..."
];

const PremiumLoader = ({ isLoading, onComplete }) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [expandGlow, setExpandGlow] = useState(false);
  const [progress, setProgress] = useState(0);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  // Enforce a minimum 5-second loading time
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Message rotation
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 1500);

    // Progress bar simulation (up to 95% while still loading)
    const progressInterval = setInterval(() => {
      setProgress(p => {
        if (!isLoading && minTimeElapsed) return 100;
        if (p >= 95) return 95 + Math.random() * 2; // hover around 95-97%
        // Slower increment to match the ~5 second timeframe
        const inc = Math.random() * 4 + 2; 
        return Math.min(p + inc, 95);
      });
    }, 200);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, [isLoading, minTimeElapsed]);

  useEffect(() => {
    if (!isLoading && minTimeElapsed) {
      setProgress(100);
      setTimeout(() => {
        setExpandGlow(true);
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 1000); // 1s fade out duration
        }, 400); // Let the glow expand slightly before fading out completely
      }, 500); // Wait briefly at 100% to let user see "100%"
    }
  }, [isLoading, minTimeElapsed, onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050505] transition-all duration-[1000ms] ${fadeOut ? 'opacity-0 bg-transparent blur-sm pointer-events-none' : 'opacity-100'}`}
    >
      {/* Dark gradient & glowing vignette */}
      <div className={`absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_transparent_0%,_#000000_100%)] z-0 transition-opacity duration-1000 ${fadeOut ? 'opacity-0' : 'opacity-80'}`}></div>
      
      {/* Faint Grid Texture */}
      <div className={`absolute inset-0 pointer-events-none z-[1] transition-opacity duration-1000 ${fadeOut ? 'opacity-0' : 'opacity-[0.03]'}`} 
           style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      {/* Explosive Glow on Finish */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[10vw] h-[10vw] bg-cyan-400/20 rounded-full blur-[100px] mix-blend-screen transition-all duration-[1500ms] ease-out z-[2] ${expandGlow ? 'scale-[20] opacity-0' : 'scale-0 opacity-0'}`}></div>
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[15vw] h-[15vw] bg-purple-500/20 rounded-full blur-[120px] mix-blend-screen transition-all duration-[1200ms] ease-out z-[2] ${expandGlow ? 'scale-[15] opacity-0' : 'scale-0 opacity-0'}`}></div>

      {/* Background ambient glows (Cyan/Purple) */}
      <div className={`absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-cyan-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse z-[1] transition-opacity duration-1000 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}></div>
      <div className={`absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse z-[1] transition-opacity duration-1000 ${fadeOut ? 'opacity-0' : 'opacity-100'}`} style={{ animationDelay: '1s' }}></div>

      {/* Corner Tech Accents */}
      <div className={`absolute top-8 left-8 w-16 h-16 border-t border-l border-cyan-500/30 z-10 transition-all duration-700 ${fadeOut ? 'opacity-0 -translate-x-4 -translate-y-4' : 'opacity-100'}`}></div>
      <div className={`absolute top-8 right-8 w-16 h-16 border-t border-r border-purple-500/30 z-10 transition-all duration-700 ${fadeOut ? 'opacity-0 translate-x-4 -translate-y-4' : 'opacity-100'}`}></div>
      <div className={`absolute bottom-8 left-8 w-16 h-16 border-b border-l border-cyan-500/30 z-10 transition-all duration-700 ${fadeOut ? 'opacity-0 -translate-x-4 translate-y-4' : 'opacity-100'}`}></div>
      <div className={`absolute bottom-8 right-8 w-16 h-16 border-b border-r border-purple-500/30 z-10 transition-all duration-700 ${fadeOut ? 'opacity-0 translate-x-4 translate-y-4' : 'opacity-100'}`}></div>
      
      {/* Micro-labels */}
      <div className={`absolute top-8 right-12 text-[10px] tracking-[0.2em] text-white/40 flex items-center gap-2 z-10 transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
         <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-[pulse_1.5s_ease-in-out_infinite]"></span>
         SYSTEM ACTIVE
      </div>
      <div className={`absolute bottom-8 left-12 text-[10px] tracking-[0.2em] text-white/30 z-10 transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
         TRS CORE: v2.4.0
      </div>

      <div className={`relative z-20 flex flex-col items-center w-full max-w-lg px-8 transition-all duration-700 ${fadeOut ? 'opacity-0 scale-110' : 'opacity-100 scale-100'} animate-[slideUpFade_1s_ease-out]`}>
        {/* Logo */}
        <div className="relative w-20 h-20 md:w-24 md:h-24 mb-6 rounded-full overflow-hidden border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center justify-center bg-black/50 z-20 animate-[pulse_4s_ease-in-out_infinite]">
          <img src="/TRS_LOGO.png" alt="TRS Logo" className="w-[85%] h-[85%] object-contain" />
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-5xl font-bold tracking-[0.15em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-purple-500 animate-[pulse_3s_ease-in-out_infinite] mb-2 drop-shadow-[0_0_15px_rgba(0,255,255,0.3)] text-center">
          The Royal Sorcerers
        </h1>
        <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-purple-500/70 to-transparent mt-4 mb-16"></div>

        {/* Central Scanner/Loader - Cyberpunk Style */}
        <div className={`relative flex items-center justify-center mb-12 transition-transform duration-1000 ${expandGlow ? 'scale-150' : ''}`}>
          {/* Outer Ring */}
          <div className="w-24 h-24 rounded-full border border-white/5 shadow-[0_0_30px_rgba(168,85,247,0.1)] absolute"></div>
          {/* Rotating scanner rings */}
          <div className={`w-24 h-24 rounded-full border-t border-r border-cyan-500/70 animate-[spin_3s_linear_infinite] absolute mix-blend-screen drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] ${expandGlow ? 'opacity-0 transition-opacity duration-300' : ''}`}></div>
          <div className={`w-20 h-20 rounded-full border-b border-l border-purple-500/70 animate-[spin_2s_linear_infinite_reverse] absolute mix-blend-screen drop-shadow-[0_0_8px_rgba(168,85,247,0.8)] ${expandGlow ? 'opacity-0 transition-opacity duration-300' : ''}`}></div>
          {/* Central Core */}
          <div className={`w-8 h-8 bg-black rounded-full shadow-[inset_0_0_15px_rgba(168,85,247,0.6)] flex items-center justify-center z-10 ${expandGlow ? 'bg-cyan-400 shadow-[0_0_50px_rgba(6,182,212,1)] transition-all duration-500' : 'animate-[pulse_2s_ease-in-out_infinite]'}`}>
            <div className={`w-2 h-2 bg-cyan-400 rounded-full ${expandGlow ? 'opacity-0' : 'animate-ping'}`}></div>
          </div>
        </div>

        {/* Loading Bar Container */}
        <div className={`w-full max-w-xs relative bg-white/5 h-[3px] rounded-full overflow-hidden shadow-[0_0_10px_rgba(0,0,0,0.5)] transition-opacity duration-500 ${expandGlow ? 'opacity-0' : 'opacity-100'}`}>
          {/* Animated Progress Bar */}
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-purple-600 transition-all duration-[200ms] shadow-[0_0_12px_rgba(168,85,247,0.8)] relative"
            style={{ width: `${progress}%` }}
          >
            {/* moving light streak inside the progress bar */}
            <div className="absolute top-0 left-0 w-full h-full bg-white/40 skew-x-[-20deg] animate-[translate_1.5s_infinite]"></div>
          </div>
        </div>

        {/* Percentage Text */}
        <div className={`mt-4 flex justify-between w-full max-w-xs text-[10px] tracking-widest text-white/50 font-mono transition-opacity duration-500 ${expandGlow ? 'opacity-0' : 'opacity-100'}`}>
          <span>{expandGlow ? 'SYSTEM READY' : 'INITIALIZING'}</span>
          <span>{Math.floor(progress)}%</span>
        </div>

        {/* Dynamic System Message */}
        <div className={`mt-12 h-6 flex items-center justify-center transition-opacity duration-500 ${expandGlow ? 'opacity-0' : 'opacity-100'}`}>
          <p 
            key={messageIndex}
            className="text-sm tracking-widest text-[#00e5ff] animate-[fadeInOut_1.2s_ease-in-out_infinite]"
            style={{ textShadow: "0 0 8px rgba(0, 229, 255, 0.4)" }}
          >
            {loadingMessages[messageIndex]}
          </p>
        </div>
      </div>
      
      {/* Global minimal keyframes injected via style tag */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes translate {
          0% { transform: translateX(-150%); }
          100% { transform: translateX(150%); }
        }
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(5px); }
          20% { opacity: 1; transform: translateY(0); }
          80% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-5px); }
        }
        @keyframes slideUpFade {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
};

export default PremiumLoader;
