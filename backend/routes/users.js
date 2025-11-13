import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUserProfile,
  deactivateUser,
  activateUser
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, authorize('Admin'), getAllUsers);
router.get('/:id', protect, getUserById);
router.put('/profile', protect, updateUserProfile);
router.put('/:id/deactivate', protect, authorize('Admin'), deactivateUser);
router.put('/:id/activate', protect, authorize('Admin'), activateUser);

export default router;
