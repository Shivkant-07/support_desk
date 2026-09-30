import express from 'express';
import {
  getAgents,
  createAgent,
  updateAgent,
  toggleAgentStatus,
  deleteAgent,
} from '../controllers/agentController.js';
import { authenticateUser, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateUser);

// All authenticated users (or at least agents/admins) can list agents for assignments or filters
router.get('/', getAgents);

// Admin only actions
router.post('/', requireAdmin, createAgent);
router.put('/:id', requireAdmin, updateAgent);
router.put('/:id/status', requireAdmin, toggleAgentStatus);
router.delete('/:id', requireAdmin, deleteAgent);

export default router;
