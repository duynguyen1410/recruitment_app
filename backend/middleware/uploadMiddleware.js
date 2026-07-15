const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('../services/cloudinaryService')

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'recruitment/cv',
        resource_type: 'image',
        format: 'jpg',
        transformation: [{ width: 1200, crop: 'limit' }],
        pages: true,  // ← lưu tất cả trang
    },
})

module.exports = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
})