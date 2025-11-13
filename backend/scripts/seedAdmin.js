import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

async function seedAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');

    // Check if admin exists
    const adminExists = await User.findOne({ email: 'admin@okeanmobile.com' });
    
    if (adminExists) {
      console.log('Admin user already exists');
      console.log('Email: admin@okeanmobile.com');
      console.log('Password: 123456');
      await mongoose.connection.close();
      return;
    }

    // Hash password before creating document
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash('123456', salt);

    // Create admin user with already hashed password
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@okeanmobile.com',
      password: hashedPassword,
      fullName: 'Admin',
      role: 'Admin',
      isActive: true
    });

    console.log('✓ Admin user created successfully');
    console.log('Email: admin@okeanmobile.com');
    console.log('Password: 123456');
    console.log('User ID:', adminUser._id);

    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error seeding admin:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
}

seedAdmin();
