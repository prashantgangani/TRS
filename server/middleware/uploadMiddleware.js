const multer = require('multer');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    // accept image files only
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/webp') {
        cb(null, true);
    } else {
        cb(new Error('Invalid image file. Only JPEG, PNG, JPG and WEBP are allowed.'), false);
    }
};

const upload = multer({
    storage,
    limits: {
        fileSize: 800 * 1024, // 800KB
    },
    fileFilter
});

module.exports = upload;