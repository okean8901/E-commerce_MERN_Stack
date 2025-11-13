import ProductReview from '../models/ProductReview.js';
import Product from '../models/Product.js';

// Get reviews for product
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const total = await ProductReview.countDocuments({
      productId,
      isApproved: true
    });

    const reviews = await ProductReview.find({
      productId,
      isApproved: true
    })
      .populate('userId', 'username email fullName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      reviews,
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

// Create review
export const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    // Validation
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Vui lòng chọn đánh giá từ 1 đến 5 sao' });
    }

    // Check if user already reviewed
    const existingReview = await ProductReview.findOne({
      productId,
      userId: req.user.id
    });

    if (existingReview) {
      return res.status(400).json({ message: 'Bạn đã đánh giá sản phẩm này rồi' });
    }

    const review = new ProductReview({
      productId,
      userId: req.user.id,
      rating,
      comment,
      isApproved: false
    });

    await review.save();

    res.status(201).json({ message: 'Gửi đánh giá thành công', review });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi: ' + error.message });
  }
};

// Approve review (Admin only)
export const approveReview = async (req, res) => {
  try {
    const review = await ProductReview.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ message: 'Đánh giá không tìm thấy' });
    }

    // Update product rating
    const reviews = await ProductReview.find({
      productId: review.productId,
      isApproved: true
    });

    if (reviews.length > 0) {
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      await Product.findByIdAndUpdate(review.productId, {
        rating: avgRating,
        reviewCount: reviews.length
      });
    }

    res.json({ message: 'Phê duyệt đánh giá thành công', review });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi: ' + error.message });
  }
};

// Delete review (Admin or user)
export const deleteReview = async (req, res) => {
  try {
    const review = await ProductReview.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Đánh giá không tìm thấy' });
    }

    if (review.userId.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Bạn không có quyền xóa đánh giá này' });
    }

    await ProductReview.findByIdAndDelete(req.params.id);

    res.json({ message: 'Xóa đánh giá thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi: ' + error.message });
  }
};

export default {
  getProductReviews,
  createReview,
  approveReview,
  deleteReview
};
