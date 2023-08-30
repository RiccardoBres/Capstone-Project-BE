const multer = require('multer');
const {CloudinaryStorage} = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;



cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET, 
});


const storageUser = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder : "avatar",
        allowed_formats : ['jpg', 'jpeg', 'png']
    }
})

const UserImage = multer({storage: storageUser});

module.exports = UserImage;