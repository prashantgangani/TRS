import React, { useState } from 'react';
import OptimizedImage from './OptimizedImage';

export default function LazyImage({ 
    src, 
    alt, 
    className = "", 
    containerClassName = "",
    variant = "card",
    ...props 
}) {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div className={`relative w-full h-full bg-[#0a0a0a] overflow-hidden ${containerClassName}`}>
            {/* Shimmer/Skeleton Effect while loading */}
            {!isLoaded && (
                <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] animate-pulse"></div>
            )}
            
            <OptimizedImage
                src={src}
                alt={alt}
                variant={variant}
                loading="lazy"
                onLoad={() => setIsLoaded(true)}
                className={`relative z-10 w-full h-full object-cover transition-all duration-700 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
                {...props}
            />
        </div>
    );
}