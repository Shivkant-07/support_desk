import Category from '../models/Category.js';
import Ticket from '../models/Ticket.js';

// @desc    Get all categories (public/active or admin full list)
// @route   GET /api/categories
// @access  Public / Private
export const getCategories = async (req, res, next) => {
  try {
    const { all } = req.query;

    const query = {};
    // If not admin requesting all, return only active
    if (!req.user || req.user.role !== 'admin' || all !== 'true') {
      query.status = 'active';
    }

    const categories = await Category.find(query).sort('name');

    // If admin is requesting, attach ticket counts
    if (req.user && req.user.role === 'admin') {
      const categoriesWithCount = await Promise.all(
        categories.map(async (cat) => {
          const count = await Ticket.countDocuments({ category: cat.name });
          return {
            ...cat.toObject(),
            ticketCount: count,
          };
        })
      );
      return res.status(200).json({
        success: true,
        count: categoriesWithCount.length,
        categories: categoriesWithCount,
      });
    }

    res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Private (Admin)
export const createCategory = async (req, res, next) => {
  try {
    const { name, description, status } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Category name is required',
      });
    }

    const exists = await Category.findOne({ name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists',
      });
    }

    const category = await Category.create({
      name: name.trim(),
      description: description || '',
      status: status || 'active',
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private (Admin)
export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, status } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    if (name && name.trim() !== category.name) {
      const exists = await Category.findOne({
        name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
        _id: { $ne: id },
      });
      if (exists) {
        return res.status(400).json({
          success: false,
          message: 'Another category with this name already exists',
        });
      }
      category.name = name.trim();
    }

    if (description !== undefined) category.description = description;
    if (status) category.status = status;

    await category.save();

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle category status
// @route   PUT /api/categories/:id/status
// @access  Private (Admin)
export const toggleCategoryStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    category.status = category.status === 'active' ? 'inactive' : 'active';
    await category.save();

    res.status(200).json({
      success: true,
      message: `Category ${category.status === 'active' ? 'activated' : 'deactivated'} successfully`,
      status: category.status,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private (Admin)
export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    // Check if tickets exist with this category
    const ticketCount = await Ticket.countDocuments({ category: category.name });
    if (ticketCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category because ${ticketCount} ticket(s) are associated with it. Please deactivate it instead.`,
      });
    }

    await Category.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
