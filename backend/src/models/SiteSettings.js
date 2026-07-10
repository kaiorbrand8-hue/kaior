const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema(
  {
    heroImage: { type: String, default: '' },
    lookbookMainImage: { type: String, default: '' },
    lookbookFeatureImage: { type: String, default: '' },
    lookbookSuitingImage: { type: String, default: '' },
    lookbookKnitwearImage: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
