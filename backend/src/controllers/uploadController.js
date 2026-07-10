const asyncHandler = require('express-async-handler');
const { Readable } = require('stream');
const cloudinary = require('../config/cloudinary');

function uploadBufferToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'kaior', resource_type: 'image' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    Readable.from(buffer).pipe(uploadStream);
  });
}

// @route POST /api/uploads (admin) — field name: "images"
const uploadImages = asyncHandler(async (req, res) => {
  const files = req.files || [];
  if (!files.length) {
    res.status(400);
    throw new Error('No files uploaded');
  }

  if (!cloudinary.isConfigured()) {
    res.status(500);
    throw new Error(
      'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in backend/.env'
    );
  }

  const results = await Promise.all(files.map((file) => uploadBufferToCloudinary(file.buffer)));
  const urls = results.map((r) => r.secure_url);
  res.status(201).json({ urls });
});

module.exports = { uploadImages };
