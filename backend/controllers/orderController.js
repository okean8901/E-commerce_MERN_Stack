import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// Create order from cart
export const createOrder = async (req, res) => {
  try {
    const { shippingAddress, phoneNumber, note, paymentMethod, items, totalAmount } = req.body;

    // Validation
    if (!shippingAddress || !phoneNumber) {
      return res.status(400).json({ message: 'Vui lòng nhập địa chỉ và số điện thoại' });
    }

    // Get cart items from request or database
    let cartItems = items;
    
    if (!cartItems || cartItems.length === 0) {
      // Fallback to database cart
      const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: 'Giỏ hàng trống' });
      }
      cartItems = cart.items;
    }

    // Create order details
    const orderDetails = await Promise.all(cartItems.map(async (item) => {
      const product = await Product.findById(item.productId);
      
      // Update stock
      product.stockQuantity -= item.quantity;
      await product.save();

      return {
        productId: item.productId,
        productName: item.productName || product.name,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.quantity * item.price
      };
    }));

    const finalTotalAmount = totalAmount || orderDetails.reduce((sum, item) => sum + item.subtotal, 0);

    const order = new Order({
      userId: req.user.id,
      orderDetails,
      shippingAddress,
      phoneNumber,
      note,
      paymentMethod,
      totalAmount: finalTotalAmount,
      status: 'Pending',
      orderDate: new Date()
    });

    await order.save();

    // Clear cart from database if exists
    const userCart = await Cart.findOne({ userId: req.user.id });
    if (userCart) {
      userCart.items = [];
      userCart.totalPrice = 0;
      await userCart.save();
    }

    res.status(201).json({ message: 'Tạo đơn hàng thành công', order });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi: ' + error.message });
  }
};

// Get user's orders
export const getUserOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const total = await Order.countDocuments({ userId: req.user.id });
    const orders = await Order.find({ userId: req.user.id })
      .populate('orderDetails.productId')
      .sort({ orderDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      orders,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi: ' + error.message });
  }
};

// Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('orderDetails.productId')
      .populate('userId');

    if (!order) {
      return res.status(404).json({ message: 'Đơn hàng không tìm thấy' });
    }

    // Check authorization
    if (order.userId._id.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Bạn không có quyền xem đơn hàng này' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi: ' + error.message });
  }
};

// Update order status (Admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Đơn hàng không tìm thấy' });
    }

    res.json({ message: 'Cập nhật trạng thái đơn hàng thành công', order });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi: ' + error.message });
  }
};

// Cancel order
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Đơn hàng không tìm thấy' });
    }

    // Check authorization
    if (order.userId.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Bạn không có quyền hủy đơn hàng này' });
    }

    if (order.status !== 'Pending') {
      return res.status(400).json({ message: 'Chỉ có thể hủy đơn hàng ở trạng thái Chờ xử lý' });
    }

    // Restore stock
    await Promise.all(order.orderDetails.map(async (item) => {
      const product = await Product.findById(item.productId);
      product.stockQuantity += item.quantity;
      await product.save();
    }));

    order.status = 'Cancelled';
    await order.save();

    res.json({ message: 'Hủy đơn hàng thành công', order });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi: ' + error.message });
  }
};

export default {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder
};
