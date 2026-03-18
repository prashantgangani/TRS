export function optimizeImage(url, options = {}) {
    if (!url || typeof url !== 'string' || !url.includes("res.cloudinary.com")) return url;

    // Avoid double transformations if already transformed
    if (url.includes("/upload/f_auto") || url.includes("/upload/q_auto")) return url;

    // Handle both old signature (url, width) and new signature (url, {width, quality})
    let width = 400;
    let quality = "eco";
    let dpr = "auto";
    let fit = "limit";
    
    if (typeof options === 'number') {
        width = options;
    } else {
        width = options.width || width;
        quality = options.quality || quality;
        dpr = options.dpr || dpr;
        fit = options.fit || fit;
    }

    // Example: f_auto,q_auto:eco,c_limit,w_400,dpr_auto
    const transformations = `f_auto,q_auto:${quality},c_${fit},w_${width},dpr_${dpr}`;

    return url.replace(
        "/upload/",
        `/upload/${transformations}/`
    );
}