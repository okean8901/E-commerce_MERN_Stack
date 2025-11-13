import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Vui lòng nhập tên đăng nhập'],
      unique: true,
      trim: true,
      maxlength: [100, 'Tên đăng nhập không được vượt quá 100 ký tự']
    },
    email: {
      type: String,
      required: [true, 'Vui lòng nhập email'],
      unique: true,
      match: [/.+@.+\..+/, 'Vui lòng nhập email hợp lệ'],
      maxlength: [100, 'Email không được vượt quá 100 ký tự']
    },
    password: {
      type: String,
      required: [true, 'Vui lòng nhập mật khẩu'],
      minlength: [6, 'Mật khẩu phải ít nhất 6 ký tự'],
      select: false
    },
    fullName: {
      type: String,
      maxlength: [100, 'Họ tên không được vượt quá 100 ký tự']
    },
    role: {
      type: String,
      enum: ['Admin', 'Customer'],
      default: 'Customer',
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash if password is new or modified, and not already hashed
  if (!this.isModified('password')) return next();
  
  try {
    // Check if password is already hashed (bcrypt hashes start with $2a$, $2b$, $2x$, $2y$)
    if (this.password && this.password.startsWith('$2')) {
      return next();
    }
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
