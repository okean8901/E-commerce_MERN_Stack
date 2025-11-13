import User from '../models/User.js';
import { generateToken } from '../utils/jwtUtils.js';
import { sendEmail } from '../utils/emailService.js';

// Register
export const register = async (req, res) => {
  try {
    const { username, email, password, confirmPassword, fullName } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Vui lòng điền tất cả các trường bắt buộc' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Mật khẩu không khớp' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email hoặc username đã tồn tại' });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      fullName,
      role: 'Customer'
    });

    await user.save();

    // Send welcome email
    try {
      await sendEmail(
        email,
        'Chào mừng đến với Okean Mobile',
        `<h1>Xin chào ${fullName || username}</h1><p>Cảm ơn bạn đã đăng ký tài khoản tại Okean Mobile</p>`
      );
    } catch (emailError) {
      console.log('Email sending failed, but user created successfully');
    }

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      message: 'Đăng ký thành công',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi đăng ký: ' + error.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login request:', { email, password });

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu' });
    }

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(400).json({ message: 'Tài khoản của bạn đã bị khóa' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    console.log('Password valid:', isPasswordValid);
    
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    const token = generateToken(user._id, user.role);

    res.json({
      message: 'Đăng nhập thành công',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Lỗi đăng nhập: ' + error.message });
  }
};

// Get current user
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi: ' + error.message });
  }
};

// Logout
export const logout = (req, res) => {
  res.json({ message: 'Đăng xuất thành công' });
};

export default { register, login, getCurrentUser, logout };
