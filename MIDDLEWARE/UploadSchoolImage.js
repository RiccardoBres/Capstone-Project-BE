const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET, 
});

const storageSchool = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'schoolImage', 
    allowed_formats: ['jpg', 'jpeg', 'png'], 
  },
});

const SchoolImage = multer({ storage: storageSchool });

module.exports = SchoolImage;
