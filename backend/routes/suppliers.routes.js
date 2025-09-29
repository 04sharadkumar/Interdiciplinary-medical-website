const express = require('express');
const Supplier = require('../models/Supplier');
const InventoryItem = require('../models/InventoryItem');
const { protect, authorize } = require('../middleware/auth');
const { validateSupplier, validateObjectId, validatePagination } = require('../middleware/validation');

const router = express.Router();

// @desc    Get all suppliers
// @route   GET /api/suppliers
// @access  Private
router.get('/', protect, validatePagination, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};
    
    // Search functionality
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
        { category: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter by category
    if (req.query.category) {
      query.category = { $regex: req.query.category, $options: 'i' };
    }

    // Filter by rating
    if (req.query.minRating) {
      query.rating = { $gte: parseFloat(req.query.minRating) };
    }

    const suppliers = await Supplier.find(query)
      .populate('createdBy', 'name role')
      .populate('lastUpdatedBy', 'name role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Supplier.countDocuments(query);

    res.json({
      success: true,
      count: suppliers.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: suppliers
    });
  } catch (error) {
    console.error('Get suppliers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching suppliers'
    });
  }
});

// @desc    Get single supplier
// @route   GET /api/suppliers/:id
// @access  Private
router.get('/:id', protect, validateObjectId, async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id)
      .populate('createdBy', 'name role department')
      .populate('lastUpdatedBy', 'name role department');

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: 'Supplier not found'
      });
    }

    // Get items supplied by this supplier
    const suppliedItems = await InventoryItem.find({ supplier: req.params.id })
      .select('name category currentStock minStock status price')
      .sort({ name: 1 });

    res.json({
      success: true,
      data: {
        ...supplier.toObject(),
        suppliedItems,
        totalItemsSupplied: suppliedItems.length
      }
    });
  } catch (error) {
    console.error('Get supplier error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching supplier'
    });
  }
});

// @desc    Create supplier
// @route   POST /api/suppliers
// @access  Private (Admin only)
router.post('/', protect, authorize('admin'), validateSupplier, async (req, res) => {
  try {
    const supplierData = {
      ...req.body,
      createdBy: req.user.id,
      lastUpdatedBy: req.user.id
    };

    const supplier = await Supplier.create(supplierData);

    const populatedSupplier = await Supplier.findById(supplier._id)
      .populate('createdBy', 'name role');

    res.status(201).json({
      success: true,
      message: 'Supplier created successfully',
      data: populatedSupplier
    });
  } catch (error) {
    console.error('Create supplier error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating supplier'
    });
  }
});

// @desc    Update supplier
// @route   PUT /api/suppliers/:id
// @access  Private (Admin only)
router.put('/:id', protect, authorize('admin'), validateObjectId, async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: 'Supplier not found'
      });
    }

    const updateData = {
      ...req.body,
      lastUpdatedBy: req.user.id
    };

    const updatedSupplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('lastUpdatedBy', 'name role');

    res.json({
      success: true,
      message: 'Supplier updated successfully',
      data: updatedSupplier
    });
  } catch (error) {
    console.error('Update supplier error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating supplier'
    });
  }
});

// @desc    Delete supplier
// @route   DELETE /api/suppliers/:id
// @access  Private (Admin only)
router.delete('/:id', protect, authorize('admin'), validateObjectId, async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: 'Supplier not found'
      });
    }

    // Check if supplier has associated inventory items
    const associatedItems = await InventoryItem.countDocuments({ supplier: req.params.id });
    
    if (associatedItems > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete supplier. ${associatedItems} inventory items are associated with this supplier.`
      });
    }

    await Supplier.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Supplier deleted successfully'
    });
  } catch (error) {
    console.error('Delete supplier error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting supplier'
    });
  }
});

// @desc    Get top suppliers by rating
// @route   GET /api/suppliers/top/rating
// @access  Private
router.get('/top/rating', protect, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const topSuppliers = await Supplier.getTopSuppliers(limit);

    res.json({
      success: true,
      count: topSuppliers.length,
      data: topSuppliers
    });
  } catch (error) {
    console.error('Get top suppliers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching top suppliers'
    });
  }
});

// @desc    Update supplier rating
// @route   PUT /api/suppliers/:id/rating
// @access  Private (Admin only)
router.put('/:id/rating', protect, authorize('admin'), validateObjectId, async (req, res) => {
  try {
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: 'Supplier not found'
      });
    }

    await supplier.updateRating(rating);

    res.json({
      success: true,
      message: 'Supplier rating updated successfully',
      data: {
        id: supplier._id,
        name: supplier.name,
        rating: supplier.rating
      }
    });
  } catch (error) {
    console.error('Update supplier rating error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating supplier rating'
    });
  }
});

// @desc    Get supplier statistics
// @route   GET /api/suppliers/stats
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const totalSuppliers = await Supplier.countDocuments();
    const activeSuppliers = await Supplier.countDocuments({ status: 'active' });
    const inactiveSuppliers = await Supplier.countDocuments({ status: 'inactive' });
    
    const avgRating = await Supplier.aggregate([
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);

    const totalOrders = await Supplier.aggregate([
      { $group: { _id: null, totalOrders: { $sum: '$totalOrders' } } }
    ]);

    const categoryStats = await Supplier.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        totalSuppliers,
        activeSuppliers,
        inactiveSuppliers,
        averageRating: avgRating[0]?.avgRating || 0,
        totalOrders: totalOrders[0]?.totalOrders || 0,
        categoryBreakdown: categoryStats
      }
    });
  } catch (error) {
    console.error('Get supplier stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching supplier statistics'
    });
  }
});

module.exports = router;