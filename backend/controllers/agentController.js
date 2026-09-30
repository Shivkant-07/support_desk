import User from '../models/User.js';
import Ticket from '../models/Ticket.js';

// @desc    Get all agents with workload statistics
// @route   GET /api/agents
// @access  Private (Admin or Authenticated for select dropdowns)
export const getAgents = async (req, res, next) => {
  try {
    const { status, search } = req.query;

    const query = { role: 'agent' };

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: searchRegex }, { email: searchRegex }, { department: searchRegex }];
    }

    const agents = await User.find(query).select('-password').sort('name');

    // Aggregate workload for each agent
    const agentsWithWorkload = await Promise.all(
      agents.map(async (agent) => {
        const [totalAssigned, openTickets, inProgressTickets, resolvedTickets] =
          await Promise.all([
            Ticket.countDocuments({ assignedAgent: agent._id }),
            Ticket.countDocuments({
              assignedAgent: agent._id,
              status: { $in: ['Open', 'Assigned'] },
            }),
            Ticket.countDocuments({ assignedAgent: agent._id, status: 'In Progress' }),
            Ticket.countDocuments({
              assignedAgent: agent._id,
              status: { $in: ['Resolved', 'Closed'] },
            }),
          ]);

        return {
          ...agent.toObject(),
          workload: {
            total: totalAssigned,
            open: openTickets,
            inProgress: inProgressTickets,
            resolved: resolvedTickets,
          },
        };
      })
    );

    res.status(200).json({
      success: true,
      count: agentsWithWorkload.length,
      agents: agentsWithWorkload,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new agent
// @route   POST /api/agents
// @access  Private (Admin)
export const createAgent = async (req, res, next) => {
  try {
    const { name, email, password, department, phone, status } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and temporary password are required',
      });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    const agent = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: 'agent',
      department: department || 'Technical Support',
      phone: phone || '',
      status: status || 'active',
    });

    res.status(201).json({
      success: true,
      message: 'Agent created successfully',
      agent: {
        id: agent._id,
        name: agent.name,
        email: agent.email,
        role: agent.role,
        status: agent.status,
        department: agent.department,
        phone: agent.phone,
        createdAt: agent.createdAt,
        workload: { total: 0, open: 0, inProgress: 0, resolved: 0 },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update agent
// @route   PUT /api/agents/:id
// @access  Private (Admin)
export const updateAgent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, department, phone, status, password } = req.body;

    const agent = await User.findOne({ _id: id, role: 'agent' });
    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found',
      });
    }

    if (name) agent.name = name;
    if (email) agent.email = email.toLowerCase();
    if (department !== undefined) agent.department = department;
    if (phone !== undefined) agent.phone = phone;
    if (status) agent.status = status;
    if (password && password.trim() !== '') {
      agent.password = password;
    }

    await agent.save();

    res.status(200).json({
      success: true,
      message: 'Agent updated successfully',
      agent: {
        id: agent._id,
        name: agent.name,
        email: agent.email,
        role: agent.role,
        status: agent.status,
        department: agent.department,
        phone: agent.phone,
        createdAt: agent.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle agent status
// @route   PUT /api/agents/:id/status
// @access  Private (Admin)
export const toggleAgentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const agent = await User.findOne({ _id: id, role: 'agent' });
    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found',
      });
    }

    agent.status = agent.status === 'active' ? 'inactive' : 'active';
    await agent.save();

    res.status(200).json({
      success: true,
      message: `Agent ${agent.status === 'active' ? 'activated' : 'deactivated'} successfully`,
      status: agent.status,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete agent
// @route   DELETE /api/agents/:id
// @access  Private (Admin)
export const deleteAgent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const agent = await User.findOne({ _id: id, role: 'agent' });
    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found',
      });
    }

    // Unassign tickets assigned to this agent
    await Ticket.updateMany(
      { assignedAgent: id },
      { $set: { assignedAgent: null, status: 'Open' } }
    );

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Agent deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
