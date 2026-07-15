const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('../services/cloudinaryService')

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
        folder: 'recruitment/cv',
        resource_type: 'raw',
        format: 'pdf',
        flags: 'attachment:false',
    }),
})

module.exports = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
})