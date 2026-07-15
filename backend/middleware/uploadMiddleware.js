const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('../services/cloudinaryService')

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'recruitment/cv',
        allowed_formats: ['pdf'],
        resource_type: 'raw',
        access_mode: 'public',
        format: 'pdf', // ép định dạng
        public_id: (req, file) => {
            // đảm bảo tên file có đuôi .pdf
            const name = file.originalname.replace(/\.pdf$/i, '');
            return '${ Date.now() }.pdf';
        },
    },
})

module.exports = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
})