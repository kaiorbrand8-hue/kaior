const asyncHandler = require('express-async-handler');
const { Readable } = require('stream');
const cloudinary = require('../config/cloudinary');

// multer's fileFilter only sees the client-supplied Content-Type header,
// which a malicious client can set to anything — check the real file bytes
// against known image signatures before trusting an upload.
function isAllowedImageBuffer(buffer) {
  if (!buffer || buffer.length < 12) return false;
  const bytes = buffer;

  const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const isPng =
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a;
  const isGif =
    bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38;
  const isWebp =
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50;

  return isJpeg || isPng || isGif || isWebp;
}

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

  if (files.some((file) => !isAllowedImageBuffer(file.buffer))) {
    res.status(400);
    throw new Error('One or more files are not valid images');
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
