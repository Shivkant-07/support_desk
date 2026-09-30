import mongoose from 'mongoose';
import Comment from '../models/Comment.js';
import Ticket from '../models/Ticket.js';

// @desc    Get comments for a ticket
// @route   GET /api/tickets/:id/comments
// @access  Private
export const getComments = async (req, res, next) => {
  try {
    const { id } = req.params;

    let ticketQuery;
    if (mongoose.Types.ObjectId.isValid(id)) {
      ticketQuery = { _id: id };
    } else {
      ticketQuery = { ticketId: id.toUpperCase() };
    }

    const ticket = await Ticket.findOne(ticketQuery);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found',
      });
    }

    // Role access check
    if (req.user.role === 'user' && ticket.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You cannot view comments for another user\'s ticket',
      });
    }

    if (
      req.user.role === 'agent' &&
      (!ticket.assignedAgent || ticket.assignedAgent.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You cannot view comments for unassigned tickets',
      });
    }

    const comments = await Comment.find({ ticketId: ticket._id })
      .populate('userId', 'name role email department')
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: comments.length,
      comments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a comment to a ticket
// @route   POST /api/tickets/:id/comments
// @access  Private
export const addComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Comment message is required',
      });
    }

    let ticketQuery;
    if (mongoose.Types.ObjectId.isValid(id)) {
      ticketQuery = { _id: id };
    } else {
      ticketQuery = { ticketId: id.toUpperCase() };
    }

    const ticket = await Ticket.findOne(ticketQuery)
      .populate('createdBy', 'name email')
      .populate('assignedAgent', 'name email');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found',
      });
    }

    // Role access check
    if (req.user.role === 'user' && ticket.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You cannot comment on this ticket',
      });
    }

    if (
      req.user.role === 'agent' &&
      (!ticket.assignedAgent || ticket.assignedAgent._id.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only comment on tickets assigned to you',
      });
    }

    // Process optional attachment
    const attachments = (req.files || []).map((file) => ({
      filename: file.filename,
      originalName: file.originalname,
      path: file.path,
      mimetype: file.mimetype,
      size: file.size,
      url: `/uploads/${file.filename}`,
    }));

    const comment = await Comment.create({
      ticketId: ticket._id,
      userId: req.user._id,
      message: message.trim(),
      attachments,
    });

    // If ticket was Reopened and Agent replies, automatically advance status to In Progress
    if (ticket.status === 'Reopened' && (req.user.role === 'agent' || req.user.role === 'admin')) {
      ticket.status = 'In Progress';
      await ticket.save();
    }

    // If ticket was Assigned and Agent replies, also set status to In Progress
    if (ticket.status === 'Assigned' && req.user.role === 'agent') {
      ticket.status = 'In Progress';
      await ticket.save();
    }

    const populatedComment = await Comment.findById(comment._id).populate(
      'userId',
      'name role email department'
    );

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      comment: populatedComment,
      ticketStatus: ticket.status,
    });
  } catch (error) {
    next(error);
  }
};
