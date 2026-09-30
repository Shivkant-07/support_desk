import express from 'express';
import {
  getCategories,
  createCategory,
  updateCategory,
  toggleCategoryStatus,
  deleteCategory,
} from '../controllers/categoryController.js';
import { authenticateUser, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Optional auth for GET: if token is present, decode it so admin sees all categories
router.get('/', (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return authenticateUser(req, res, () => getCategories(req, res, next));
  }
  getCategories(req, res, next);
});

router.post('/', authenticateUser, requireAdmin, createCategory);
router.put('/:id', authenticateUser, requireAdmin, updateCategory);
router.put('/:id/status', authenticateUser, requireAdmin, toggleCategoryStatus);
router.delete('/:id', authenticateUser, requireAdmin, deleteCategory);

export default router;
