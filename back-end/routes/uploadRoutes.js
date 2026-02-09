const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

require('dotenv').config();
const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/', upload.single('image'),async (req, res) => {
    try{
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        //function to handle the stream to cloudinary
        const streamUpload = (fileBuffer) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream((error, result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        reject(error);
                    }
                });
                streamifier.createReadStream(fileBuffer).pipe(stream);
            });

    };
    //call the function to upload the file
    const result = await streamUpload(req.file.buffer);
    //respond with the uploaded image url
    res.json({imageUrl: result.secure_url});
}
    catch(error){
        console.error(error);
        res.status(500).json({ error: 'Server Error' });


    }
 
});

// Export the router
module.exports = router;