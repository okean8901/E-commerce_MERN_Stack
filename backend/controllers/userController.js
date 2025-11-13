import User from '../models/User.js';

// Get all users (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (role) {
      query.role = role;
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      users,
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

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tìm thấy' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi: ' + error.message });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const { fullName, email } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { fullName, email },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ message: 'Cập nhật hồ sơ thành công', user });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi: ' + error.message });
  }
};

// Deactivate user (Admin only)
export const deactivateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tìm thấy' });
    }

    res.json({ message: 'Vô hiệu hóa người dùng thành công', user });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi: ' + error.message });
  }
};

// Activate user (Admin only)
export const activateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tìm thấy' });
    }

    res.json({ message: 'Kích hoạt người dùng thành công', user });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi: ' + error.message });
  }
};

export default {
  getAllUsers,
  getUserById,
  updateUserProfile,
  deactivateUser,
  activateUser
};
