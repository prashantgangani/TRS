export function optimizeImage(url, width = 400) {
    if (!url || typeof url !== 'string' || !url.includes("res.cloudinary.com")) return url;

    // Avoid double transformations if already transformed
    if (url.includes("/upload/f_auto") || url.includes("/upload/q_auto")) return url;

    return url.replace(
        "/upload/",
        `/upload/f_auto,q_auto:good,w_${width}/`
    );
}