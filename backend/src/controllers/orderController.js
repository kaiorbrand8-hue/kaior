const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');

const SHIPPING_FLAT_RATE = 70;
const FREE_SHIPPING_THRESHOLD = 2000;

// @route POST /api/orders
const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  const productIds = items.map((i) => i.product);
  const products = await Product.find({ _id: { $in: productIds } });

  let itemsPrice = 0;
  const orderItems = items.map((item) => {
    const dbProduct = products.find((p) => p._id.toString() === item.product);
    if (!dbProduct) {
      res.status(400);
      throw new Error(`Product not found: ${item.product}`);
    }
    const lineTotal = dbProduct.price * item.quantity;
    itemsPrice += lineTotal;
    return {
      product: dbProduct._id,
      name: dbProduct.name,
      image: dbProduct.images?.[0] || '',
      price: dbProduct.price,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
    };
  });

  const shippingPrice = itemsPrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT_RATE;
  const totalPrice = itemsPrice + shippingPrice;

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    paymentMethod: 'cod',
    itemsPrice,
    shippingPrice,
    totalPrice,
  });

  res.status(201).json(order);
});

// @route GET /api/orders/my
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// @route GET /api/orders/:id
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  const isOwner = order.user._id.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }
  res.json(order);
});

// @route GET /api/orders (admin)
const getAllOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status) {
    filter.status = status;
  } else {
    // Default view hides cancelled orders so they don't clutter the active
    // list; pick "Cancelled" from the status filter to see them.
    filter.status = { $ne: 'cancelled' };
  }

  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.min(Math.max(Number(limit), 1), 100);

  const [items, total] = await Promise.all([
    Order.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Order.countDocuments(filter),
  ]);

  res.json({ items, page: pageNum, pages: Math.ceil(total / limitNum) || 1, total });
});

// @route PUT /api/orders/:id/status (admin)
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  order.status = status;
  if (status === 'delivered') order.deliveredAt = new Date();
  const updated = await order.save();
  res.json(updated);
});

module.exports = { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus };
