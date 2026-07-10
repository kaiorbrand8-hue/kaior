const asyncHandler = require('express-async-handler');
const SiteSettings = require('../models/SiteSettings');

async function getSingleton() {
  let settings = await SiteSettings.findOne();
  if (!settings) settings = await SiteSettings.create({});
  return settings;
}

// @route GET /api/settings
const getSettings = asyncHandler(async (req, res) => {
  const settings = await getSingleton();
  res.json(settings);
});

// @route PUT /api/settings (admin)
const updateSettings = asyncHandler(async (req, res) => {
  const settings = await getSingleton();
  const {
    heroImage,
    lookbookMainImage,
    lookbookFeatureImage,
    lookbookSuitingImage,
    lookbookKnitwearImage,
  } = req.body;
  if (heroImage !== undefined) settings.heroImage = heroImage;
  if (lookbookMainImage !== undefined) settings.lookbookMainImage = lookbookMainImage;
  if (lookbookFeatureImage !== undefined) settings.lookbookFeatureImage = lookbookFeatureImage;
  if (lookbookSuitingImage !== undefined) settings.lookbookSuitingImage = lookbookSuitingImage;
  if (lookbookKnitwearImage !== undefined) settings.lookbookKnitwearImage = lookbookKnitwearImage;
  await settings.save();
  res.json(settings);
});

module.exports = { getSettings, updateSettings };
