export function optimizeImage(url, options = {}) {
    // Returning raw URL as dynamic transformations on some Cloudinary setups can cause 404/Fallback errors
    return url;
}