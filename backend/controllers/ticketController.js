import mongoose from 'mongoose';
import Ticket from '../models/Ticket.js';
import User from '../models/User.js';
import Comment from '../models/Comment.js';
import { generateTicketId } from '../utils/ticketIdGenerator.js';

// @desc    Create a new support ticket
// @route   POST /api/tickets
// @access  Private (User)
export const createTicket = async (req, res, next) => {
  try {
    const { subject, description, category, priority } = req.body;

    if (!subject || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Subject, description, and category are required',
      });
    }

    const ticketId = await generateTicketId();

    // Process uploaded attachments
    const attachments = (req.files || []).map((file) => ({
      filename: file.filename,
      originalName: file.originalname,
      path: file.path,
      mimetype: file.mimetype,
      size: file.size,
      url: `/uploads/${file.filename}`,
    }));

    const ticket = await Ticket.create({
      ticketId,
      subject,
      description,
      category,
      priority: priority || 'Medium',
      status: 'Open',
      createdBy: req.user._id,
      attachments,
    });

    // Populate creator info
    const populatedTicket = await Ticket.findById(ticket._id)
      .populate('createdBy', 'name email')
      .populate('assignedAgent', 'name email department');

    res.status(201).json({
      success: true,
      message: 'Ticket Created Successfully',
      ticket: populatedTicket,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tickets with filters, search, and role scoping
// @route   GET /api/tickets
// @access  Private
export const getTickets = async (req, res, next) => {
  try {
    const { status, priority, category, search, agentId, sort = '-createdAt', limit, page } = req.query;

    const query = {};

    // Role-based scoping
    if (req.user.role === 'user') {
      // Users see only their own tickets
      query.createdBy = req.user._id;
    } else if (req.user.role === 'agent') {
      // Agents see tickets assigned to them
      query.assignedAgent = req.user._id;
    } else if (req.user.role === 'admin') {
      // Admin can filter by agent
      if (agentId) {
        query.assignedAgent = agentId === 'unassigned' ? null : agentId;
      }
    }

    // Filters
    if (status && status !== 'all') {
      query.status = status;
    }
    if (priority && priority !== 'all') {
      query.priority = priority;
    }
    if (category && category !== 'all') {
      query.category = category;
    }

    // Search query
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { ticketId: searchRegex },
        { subject: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
      ];
    }

    const ticketsQuery = Ticket.find(query)
      .populate('createdBy', 'name email')
      .populate('assignedAgent', 'name email department')
      .sort(sort);

    if (page && limit) {
      const pageNum = parseInt(page, 10) || 1;
      const limitNum = parseInt(limit, 10) || 10;
      const skip = (pageNum - 1) * limitNum;
      const total = await Ticket.countDocuments(query);
      const tickets = await ticketsQuery.skip(skip).limit(limitNum);

      return res.status(200).json({
        success: true,
        count: tickets.length,
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        tickets,
      });
    }

    const tickets = await ticketsQuery;

    res.status(200).json({
      success: true,
      count: tickets.length,
      tickets,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get ticket by ID or ticket code
// @route   GET /api/tickets/:id
// @access  Private
export const getTicketById = async (req, res, next) => {
  try {
    const { id } = req.params;

    let query;
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { _id: id };
    } else {
      query = { ticketId: id.toUpperCase() };
    }

    const ticket = await Ticket.findOne(query)
      .populate('createdBy', 'name email department phone')
      .populate('assignedAgent', 'name email department phone');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found',
      });
    }

    // Authorization checks
    if (req.user.role === 'user' && ticket.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You do not have permission to view this ticket',
      });
    }

    if (
      req.user.role === 'agent' &&
      (!ticket.assignedAgent || ticket.assignedAgent._id.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You are only allowed to view tickets assigned to you',
      });
    }

    res.status(200).json({
      success: true,
      ticket,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign ticket to an agent
// @route   PUT /api/tickets/:id/assign
// @access  Private (Admin only)
export const assignTicket = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { agentId } = req.body;

    if (!agentId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an agentId to assign',
      });
    }

    const agent = await User.findOne({ _id: agentId, role: 'agent' });
    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Assigned agent not found or user is not an agent',
      });
    }

    const ticket = await Ticket.findById(id).populate('assignedAgent', 'name');
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found',
      });
    }

    const previousAgentName = ticket.assignedAgent ? ticket.assignedAgent.name : 'Unassigned';
    ticket.assignedAgent = agent._id;

    // If ticket was Open, transition to Assigned
    if (ticket.status === 'Open') {
      ticket.status = 'Assigned';
    }

    await ticket.save();

    const updatedTicket = await Ticket.findById(ticket._id)
      .populate('createdBy', 'name email')
      .populate('assignedAgent', 'name email department');

    res.status(200).json({
      success: true,
      message: `Ticket successfully assigned to ${agent.name}`,
      ticket: updatedTicket,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update ticket status, priority, or details
// @route   PUT /api/tickets/:id
// @access  Private (Agent, Admin)
export const updateTicket = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, priority, category } = req.body;

    const ticket = await Ticket.findById(id)
      .populate('createdBy', 'name email')
      .populate('assignedAgent', 'name email');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found',
      });
    }

    // Agent permission check: can only update their assigned tickets and only status
    if (req.user.role === 'agent') {
      if (!ticket.assignedAgent || ticket.assignedAgent._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: You can only update tickets assigned to you',
        });
      }

      // Agents cannot change priority or category, only status
      if (priority && priority !== ticket.priority) {
        return res.status(403).json({
          success: false,
          message: 'Agents are not permitted to change ticket priority',
        });
      }
    }

    // Handle status change
    if (status && status !== ticket.status) {
      const oldStatus = ticket.status;
      ticket.status = status;

      if (status === 'Resolved') {
        ticket.resolvedAt = new Date();
      } else if (status === 'Closed') {
        ticket.closedAt = new Date();
      }
    }

    // Handle priority change (Admin only)
    if (priority && priority !== ticket.priority && req.user.role === 'admin') {
      ticket.priority = priority;
    }

    // Handle category change (Admin only)
    if (category && category !== ticket.category && req.user.role === 'admin') {
      ticket.category = category;
    }

    await ticket.save();

    const updated = await Ticket.findById(ticket._id)
      .populate('createdBy', 'name email')
      .populate('assignedAgent', 'name email department');

    res.status(200).json({
      success: true,
      message: 'Ticket updated successfully',
      ticket: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reopen a resolved or closed ticket
// @route   PUT /api/tickets/:id/reopen
// @access  Private (User or Admin)
export const reopenTicket = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const ticket = await Ticket.findById(id).populate('assignedAgent', 'name _id');
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found',
      });
    }

    if (req.user.role === 'user' && ticket.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only reopen your own tickets',
      });
    }

    if (ticket.status !== 'Resolved' && ticket.status !== 'Closed') {
      return res.status(400).json({
        success: false,
        message: 'Only resolved or closed tickets can be reopened',
      });
    }

    const oldStatus = ticket.status;
    ticket.status = 'Reopened';
    await ticket.save();

    const updated = await Ticket.findById(ticket._id)
      .populate('createdBy', 'name email')
      .populate('assignedAgent', 'name email department');

    res.status(200).json({
      success: true,
      message: 'Ticket reopened successfully',
      ticket: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Close ticket
// @route   PUT /api/tickets/:id/close
// @access  Private (User or Admin)
export const closeTicket = async (req, res, next) => {
  try {
    const { id } = req.params;

    const ticket = await Ticket.findById(id).populate('assignedAgent', 'name _id');
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found',
      });
    }

    if (req.user.role === 'user' && ticket.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only close your own tickets',
      });
    }

    const oldStatus = ticket.status;
    ticket.status = 'Closed';
    ticket.closedAt = new Date();
    await ticket.save();

    const updated = await Ticket.findById(ticket._id)
      .populate('createdBy', 'name email')
      .populate('assignedAgent', 'name email department');

    res.status(200).json({
      success: true,
      message: 'Ticket closed successfully',
      ticket: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete ticket
// @route   DELETE /api/tickets/:id
// @access  Private (Admin only)
export const deleteTicket = async (req, res, next) => {
  try {
    const { id } = req.params;

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found',
      });
    }

    await Ticket.findByIdAndDelete(id);
    await Comment.deleteMany({ ticketId: id });

    res.status(200).json({
      success: true,
      message: `Ticket ${ticket.ticketId} and associated records deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};
