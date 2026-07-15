const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('../services/cloudinaryService')

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'recruitment/cv',
        allowed_formats: ['pdf'],
        resource_type: 'raw',
    },
})


module.exports = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
})