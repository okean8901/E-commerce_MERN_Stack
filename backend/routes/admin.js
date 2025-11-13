import express from 'express';
import {
  getDashboardStats,
  getAllOrders,
  getSalesReport,
  exportData,
  // Product management
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  // Category management
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  // User management
  getAllUsers,
  updateUserStatus,
  updateUser,
  deleteUser,
  // Order management
  updateOrderStatus
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Dashboard
router.get('/stats', protect, authorize('Admin'), getDashboardStats);

// Orders
router.get('/orders', protect, authorize('Admin'), getAllOrders);
router.put('/orders/:id/status', protect, authorize('Admin'), updateOrderStatus);
router.get('/sales-report', protect, authorize('Admin'), getSalesReport);

// Products
router.get('/products', protect, authorize('Admin'), getAllProducts);
router.post('/products', protect, authorize('Admin'), createProduct);
router.put('/products/:id', protect, authorize('Admin'), updateProduct);
router.delete('/products/:id', protect, authorize('Admin'), deleteProduct);

// Categories
router.get('/categories', protect, authorize('Admin'), getAllCategories);
router.post('/categories', protect, authorize('Admin'), createCategory);
router.put('/categories/:id', protect, authorize('Admin'), updateCategory);
router.delete('/categories/:id', protect, authorize('Admin'), deleteCategory);

// Users
router.get('/users', protect, authorize('Admin'), getAllUsers);
router.put('/users/:id/status', protect, authorize('Admin'), updateUserStatus);
router.put('/users/:id', protect, authorize('Admin'), updateUser);
router.delete('/users/:id', protect, authorize('Admin'), deleteUser);

// Export
router.get('/export', protect, authorize('Admin'), exportData);

export default router;
