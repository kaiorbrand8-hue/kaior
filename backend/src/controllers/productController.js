const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const Category = require('../models/Category');
const recomputeRating = require('../utils/recomputeRating');

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// @route GET /api/products
const getProducts = asyncHandler(async (req, res) => {
  const {
    keyword,
    category,
    minPrice,
    maxPrice,
    size,
    color,
    featured,
    isNewArrival,
    sort,
    page = 1,
    limit = 12,
    includeInactive,
  } = req.query;

  const filter = {};
  if (!(includeInactive === 'true' && req.user?.role === 'admin')) {
    filter.active = true;
  }

  if (keyword && typeof keyword === 'string') {
    const regex = new RegExp(escapeRegex(keyword.trim()), 'i');
    filter.$or = [{ name: regex }, { nameAr: regex }, { tags: regex }];
  }

  if (category && typeof category === 'string') {
    const cat = await Category.findOne({ slug: category });
    if (cat) filter.category = cat._id;
    else filter.category = null;
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  if (size && typeof size === 'string') filter.sizes = size;
  if (color && typeof color === 'string') filter.colors = color;
  if (featured === 'true') filter.featured = true;
  if (isNewArrival === 'true') filter.isNewArrival = true;

  const sortMap = {
    'price-asc': { price: 1 },
    'price-desc': { price: -1 },
    newest: { createdAt: -1 },
    rating: { rating: -1 },
  };
  const sortOption = sortMap[sort] || { createdAt: -1 };

  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.min(Math.max(Number(limit), 1), 48);

  const [items, total] = await Promise.all([
    Product.find(filter)
      .populate('category', 'name nameAr slug')
      .sort(sortOption)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Product.countDocuments(filter),
  ]);

  res.json({
    items,
    page: pageNum,
    pages: Math.ceil(total / limitNum) || 1,
    total,
  });
});

// @route GET /api/products/:slug
const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, active: true }).populate(
    'category',
    'name nameAr slug'
  );
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Only approved reviews are public; a signed-in reviewer can still see
  // their own review while it's pending or if it was rejected.
  const productObj = product.toObject();
  productObj.reviews = productObj.reviews.filter(
    (r) => r.status === 'approved' || (req.user && String(r.user) === String(req.user._id))
  );
  res.json(productObj);
});

// @route GET /api/products/id/:id  (admin only)
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category', 'name nameAr slug');
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json(product);
});

// Reviews, rating and stock are computed by the app (from customer reviews /
// variant stock), never set directly from an admin form payload.
const SYSTEM_OWNED_PRODUCT_FIELDS = ['reviews', 'rating', 'numReviews', 'totalStock', 'slug'];

function stripSystemOwnedFields(body) {
  const clean = { ...body };
  SYSTEM_OWNED_PRODUCT_FIELDS.forEach((field) => delete clean[field]);
  return clean;
}

// @route POST /api/products (admin)
const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(stripSystemOwnedFields(req.body));
  res.status(201).json(product);
});

// @route PUT /api/products/:id (admin)
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  Object.assign(product, stripSystemOwnedFields(req.body));
  const updated = await product.save();
  res.json(updated);
});

// @route DELETE /api/products/:id (admin)
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  await product.deleteOne();
  res.json({ message: 'Product removed' });
});

// @route POST /api/products/:id/reviews
const createReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );
  if (alreadyReviewed) {
    res.status(400);
    throw new Error('You already reviewed this product');
  }

  product.reviews.push({
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
    status: 'pending',
  });

  recomputeRating(product);

  await product.save();
  res.status(201).json({ message: 'Review submitted and awaiting approval' });
});

module.exports = {
  getProducts,
  getProductBySlug,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createReview,
};
