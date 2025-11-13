import Product from '../models/Product.js';

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search, sort } = req.query;
    const skip = (page - 1) * limit;

    let query = { isActive: true };

    if (category) {
      query.categoryId = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('categoryId')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      products,
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

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('categoryId');
    if (!product) {
      return res.status(404).json({ message: 'Sản phẩm không tìm thấy' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi: ' + error.message });
  }
};

// Create product (Admin only)
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stockQuantity, imageUrl, categoryId } = req.body;

    const product = new Product({
      name,
      description,
      price,
      stockQuantity,
      imageUrl,
      categoryId
    });

    await product.save();
    res.status(201).json({ message: 'Sản phẩm tạo thành công', product });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi: ' + error.message });
  }
};

// Update product (Admin only)
export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, stockQuantity, imageUrl, categoryId, isActive } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, stockQuantity, imageUrl, categoryId, isActive },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Sản phẩm không tìm thấy' });
    }

    res.json({ message: 'Sản phẩm cập nhật thành công', product });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi: ' + error.message });
  }
};

// Delete product (Admin only)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Sản phẩm không tìm thấy' });
    }

    res.json({ message: 'Sản phẩm đã bị xóa', product });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi: ' + error.message });
  }
};

export default {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
