import React, { useState } from 'react';
import { optimizeImage } from '../utils/imageOptimizer';

export default function OptimizedImage({ 
    src, 
    alt, 
    className, 
    variant = "card", 
    width: overrideWidth,
    quality: overrideQuality,
    onClick, 
    loading = "lazy",
    fallbackSrc = 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=400&q=70',
    ...props
}) {
    const [imgSrc, setImgSrc] = useState(src);
    const [hasError, setHasError] = useState(false);

    // Reset error state if src prop changes
    React.useEffect(() => {
        setHasError(false);
        setImgSrc(src);
    }, [src]);

    // Variant Presets
    const presets = {
        avatar: { width: 150, quality: "eco" },
        thumbnail: { width: 300, quality: "eco" },
        card: { width: 400, quality: "eco" },
        detail: { width: 800, quality: "good" },
        hero: { width: 1200, quality: "good" },
        full: { width: 1920, quality: "good" }
    };

    const config = presets[variant] || presets.card;
    const width = overrideWidth || config.width;
    const quality = overrideQuality || config.quality;

    const finalSrc = hasError ? fallbackSrc : optimizeImage(src, { width, quality });

    return (
        <img
            src={finalSrc}
            alt={alt || "Image"}
            className={className}
            loading={loading}
            decoding="async"
            onClick={onClick}
            onError={() => {
                if (!hasError) {
                    setImgSrc(fallbackSrc);
                    setHasError(true);
                }
            }}
            {...props}
        />
    );
}
