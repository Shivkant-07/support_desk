import User from '../models/User.js';
import Ticket from '../models/Ticket.js';

// @desc    Get all users (with filters: role, status, search)
// @route   GET /api/users
// @access  Private (Admin)
export const getUsers = async (req, res, next) => {
  try {
    const { role, status, search, page, limit } = req.query;

    const query = {};

    if (role && role !== 'all') {
      query.role = role;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: searchRegex }, { email: searchRegex }, { department: searchRegex }];
    }

    const usersQuery = User.find(query).select('-password').sort('-createdAt');

    if (page && limit) {
      const pageNum = parseInt(page, 10) || 1;
      const limitNum = parseInt(limit, 10) || 10;
      const skip = (pageNum - 1) * limitNum;
      const total = await User.countDocuments(query);
      const users = await usersQuery.skip(skip).limit(limitNum);

      return res.status(200).json({
        success: true,
        count: users.length,
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        users,
      });
    }

    const users = await usersQuery;

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private (Admin)
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Get ticket counts for this user
    const totalTickets = await Ticket.countDocuments({ createdBy: user._id });

    res.status(200).json({
      success: true,
      user,
      totalTickets,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create user/agent from admin panel
// @route   POST /api/users
// @access  Private (Admin)
export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role, department, phone, status } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email already exists',
      });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: role || 'user',
      department: department || 'General',
      phone: phone || '',
      status: status || 'active',
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        department: user.department,
        phone: user.phone,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Admin)
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, role, status, department, phone, password } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Prevent admin from removing their own active admin access
    if (req.user._id.toString() === id) {
      if (role && role !== 'admin') {
        return res.status(400).json({
          success: false,
          message: 'Cannot revoke your own admin role',
        });
      }
      if (status && status !== 'active') {
        return res.status(400).json({
          success: false,
          message: 'Cannot deactivate your own admin account',
        });
      }
    }

    if (name) user.name = name;
    if (email) user.email = email.toLowerCase();
    if (role) user.role = role;
    if (status) user.status = status;
    if (department !== undefined) user.department = department;
    if (phone !== undefined) user.phone = phone;
    if (password && password.trim() !== '') {
      user.password = password; // will be hashed by pre-save
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        department: user.department,
        phone: user.phone,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user status (activate / deactivate)
// @route   PUT /api/users/:id/status
// @access  Private (Admin)
export const toggleUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user._id.toString() === id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot deactivate your own account',
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.status = user.status === 'active' ? 'inactive' : 'active';
    await user.save();

    res.status(200).json({
      success: true,
      message: `User account ${user.status === 'active' ? 'activated' : 'deactivated'} successfully`,
      status: user.status,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin)
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user._id.toString() === id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account',
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
