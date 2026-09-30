import express from 'express';
import {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  assignTicket,
  reopenTicket,
  closeTicket,
  deleteTicket,
} from '../controllers/ticketController.js';
import { getComments, addComment } from '../controllers/commentController.js';
import { authenticateUser, requireAdmin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Base ticket routes
router
  .route('/')
  .get(authenticateUser, getTickets)
  .post(authenticateUser, upload.array('attachments', 5), createTicket);

// Specific ticket actions
router.put('/:id/assign', authenticateUser, requireAdmin, assignTicket);
router.put('/:id/reopen', authenticateUser, reopenTicket);
router.put('/:id/close', authenticateUser, closeTicket);

// Comments on tickets
router
  .route('/:id/comments')
  .get(authenticateUser, getComments)
  .post(authenticateUser, upload.array('attachments', 3), addComment);

// Ticket by ID
router
  .route('/:id')
  .get(authenticateUser, getTicketById)
  .put(authenticateUser, updateTicket)
  .delete(authenticateUser, requireAdmin, deleteTicket);

export default router;
