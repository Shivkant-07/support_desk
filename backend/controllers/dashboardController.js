import Ticket from '../models/Ticket.js';
import User from '../models/User.js';
import Category from '../models/Category.js';

// @desc    Get dashboard statistics according to role
// @route   GET /api/dashboard/stats
// @access  Private
export const getDashboardStats = async (req, res, next) => {
  try {
    const role = req.user.role;

    if (role === 'user') {
      // User Dashboard Stats
      const userId = req.user._id;

      const [total, open, inProgress, resolved, closed, reopened, recent] = await Promise.all([
        Ticket.countDocuments({ createdBy: userId }),
        Ticket.countDocuments({ createdBy: userId, status: { $in: ['Open', 'Assigned'] } }),
        Ticket.countDocuments({ createdBy: userId, status: 'In Progress' }),
        Ticket.countDocuments({ createdBy: userId, status: 'Resolved' }),
        Ticket.countDocuments({ createdBy: userId, status: 'Closed' }),
        Ticket.countDocuments({ createdBy: userId, status: 'Reopened' }),
        Ticket.find({ createdBy: userId })
          .sort({ createdAt: -1 })
          .limit(5)
          .populate('assignedAgent', 'name email department'),
      ]);

      return res.status(200).json({
        success: true,
        role: 'user',
        stats: {
          total,
          open,
          inProgress,
          resolved,
          closed,
          reopened,
        },
        recentTickets: recent,
      });
    }

    if (role === 'agent') {
      // Agent Dashboard Stats
      const agentId = req.user._id;

      const [total, open, inProgress, resolved, closed, reopened, recent] = await Promise.all([
        Ticket.countDocuments({ assignedAgent: agentId }),
        Ticket.countDocuments({ assignedAgent: agentId, status: { $in: ['Open', 'Assigned'] } }),
        Ticket.countDocuments({ assignedAgent: agentId, status: 'In Progress' }),
        Ticket.countDocuments({ assignedAgent: agentId, status: 'Resolved' }),
        Ticket.countDocuments({ assignedAgent: agentId, status: 'Closed' }),
        Ticket.countDocuments({ assignedAgent: agentId, status: 'Reopened' }),
        Ticket.find({ assignedAgent: agentId })
          .sort({ updatedAt: -1 })
          .limit(5)
          .populate('createdBy', 'name email')
          .populate('assignedAgent', 'name email department'),
      ]);

      return res.status(200).json({
        success: true,
        role: 'agent',
        stats: {
          total,
          open,
          inProgress,
          resolved,
          closed,
          reopened,
        },
        recentTickets: recent,
      });
    }

    if (role === 'admin') {
      // Admin Dashboard Stats
      const [
        totalUsers,
        totalAgents,
        totalTickets,
        open,
        inProgress,
        resolved,
        closed,
        reopened,
        highPriorityCount,
        recentTickets,
        highPriorityTickets,
      ] = await Promise.all([
        User.countDocuments({ role: 'user' }),
        User.countDocuments({ role: 'agent' }),
        Ticket.countDocuments(),
        Ticket.countDocuments({ status: { $in: ['Open', 'Assigned'] } }),
        Ticket.countDocuments({ status: 'In Progress' }),
        Ticket.countDocuments({ status: 'Resolved' }),
        Ticket.countDocuments({ status: 'Closed' }),
        Ticket.countDocuments({ status: 'Reopened' }),
        Ticket.countDocuments({
          priority: { $in: ['High', 'Critical'] },
          status: { $nin: ['Resolved', 'Closed'] },
        }),
        Ticket.find()
          .sort({ createdAt: -1 })
          .limit(6)
          .populate('createdBy', 'name email')
          .populate('assignedAgent', 'name email department'),
        Ticket.find({
          priority: { $in: ['High', 'Critical'] },
          status: { $nin: ['Resolved', 'Closed'] },
        })
          .sort({ createdAt: -1 })
          .limit(5)
          .populate('createdBy', 'name email')
          .populate('assignedAgent', 'name email department'),
      ]);

      // Tickets by Status aggregation
      const statusCounts = await Ticket.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]);

      // Tickets by Priority aggregation
      const priorityCounts = await Ticket.aggregate([
        {
          $group: {
            _id: '$priority',
            count: { $sum: 1 },
          },
        },
      ]);

      // Tickets by Category aggregation
      const categoryCounts = await Ticket.aggregate([
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 8 },
      ]);

      // Agent Workload list
      const agents = await User.find({ role: 'agent', status: 'active' }).select('name email department');
      const agentWorkload = await Promise.all(
        agents.map(async (agent) => {
          const [totalAssigned, pending] = await Promise.all([
            Ticket.countDocuments({ assignedAgent: agent._id }),
            Ticket.countDocuments({
              assignedAgent: agent._id,
              status: { $in: ['Open', 'Assigned', 'In Progress', 'Reopened'] },
            }),
          ]);
          return {
            agentId: agent._id,
            name: agent.name,
            email: agent.email,
            department: agent.department,
            totalAssigned,
            pending,
          };
        })
      );

      return res.status(200).json({
        success: true,
        role: 'admin',
        stats: {
          totalUsers,
          totalAgents,
          totalTickets,
          open,
          inProgress,
          resolved,
          closed,
          reopened,
          highPriorityCount,
        },
        recentTickets,
        highPriorityTickets,
        agentWorkload,
        charts: {
          byStatus: statusCounts.map((s) => ({ status: s._id, count: s.count })),
          byPriority: priorityCounts.map((p) => ({ priority: p._id, count: p.count })),
          byCategory: categoryCounts.map((c) => ({ category: c._id, count: c.count })),
        },
      });
    }

    res.status(400).json({ success: false, message: 'Invalid role' });
  } catch (error) {
    next(error);
  }
};
