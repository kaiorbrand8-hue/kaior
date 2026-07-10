const multer = require('multer');

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_TYPES.has(file.mimetype)) {
    cb(new Error('Only JPG, PNG, WEBP or GIF images are allowed'));
    return;
  }
  cb(null, true);
};

// Kept comfortably under the ~4.5MB request body cap that serverless
// hosts (Vercel) enforce on Node functions. The frontend uploads one file
// per request, so this is a per-file, not a per-batch, limit.
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 4 * 1024 * 1024, files: 8 },
});

module.exports = upload;
