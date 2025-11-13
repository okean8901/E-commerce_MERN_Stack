import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// Get user's cart
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
    
    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
      await cart.save();
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi: ' + error.message });
  }
};

// Add to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Sản phẩm không tìm thấy' });
    }

    // Check stock
    if (product.stockQuantity < quantity) {
      return res.status(400).json({ message: 'Sản phẩm không đủ hàng' });
    }

    let cart = await Cart.findOne({ userId: req.user.id });
    
    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
    }

    // Check if product already in cart
    const existingItem = cart.items.find(item => item.productId.toString() === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        productId,
        quantity,
        price: product.price
      });
    }

    // Calculate total
    cart.totalPrice = cart.items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    await cart.save();
    await cart.populate('items.productId');

    res.json({ message: 'Thêm vào giỏ hàng thành công', cart });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi: ' + error.message });
  }
};

// Update cart item
export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Giỏ hàng không tìm thấy' });
    }

    const item = cart.items.find(item => item.productId.toString() === productId);
    if (!item) {
      return res.status(404).json({ message: 'Sản phẩm không trong giỏ hàng' });
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    } else {
      item.quantity = quantity;
    }

    // Calculate total
    cart.totalPrice = cart.items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    await cart.save();
    await cart.populate('items.productId');

    res.json({ message: 'Cập nhật giỏ hàng thành công', cart });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi: ' + error.message });
  }
};

// Remove from cart
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Giỏ hàng không tìm thấy' });
    }

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);

    // Calculate total
    cart.totalPrice = cart.items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    await cart.save();
    res.json({ message: 'Xóa khỏi giỏ hàng thành công', cart });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi: ' + error.message });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Giỏ hàng không tìm thấy' });
    }

    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    res.json({ message: 'Xóa giỏ hàng thành công', cart });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi: ' + error.message });
  }
};

export default {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};
