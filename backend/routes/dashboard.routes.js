const express = require('express');
const InventoryItem = require('../models/InventoryItem');
const Supplier = require('../models/Supplier');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    // Basic counts
    const totalItems = await InventoryItem.countDocuments();
    const totalSuppliers = await Supplier.countDocuments({ status: 'active' });
    const totalUsers = await User.countDocuments({ isActive: true });

    // Stock alerts
    const lowStockItems = await InventoryItem.countDocuments({
      $or: [
        { status: 'low' },
        { status: 'out-of-stock' }
      ]
    });

    const expiredItems = await InventoryItem.countDocuments({ status: 'expired' });

    // Items expiring in next 30 days
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const expiringSoonItems = await InventoryItem.countDocuments({
      expiryDate: {
        $gte: new Date(),
        $lte: thirtyDaysFromNow
      },
      status: { $ne: 'expired' }
    });

    // Total inventory value
    const inventoryValue = await InventoryItem.aggregate([
      {
        $group: {
          _id: null,
          totalValue: {
            $sum: { $multiply: ['$currentStock', '$price'] }
          }
        }
      }
    ]);

    // Monthly consumption (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const monthlyConsumption = await Transaction.aggregate([
      {
        $match: {
          type: 'out',
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: null,
          totalValue: { $sum: '$totalValue' },
          totalQuantity: { $sum: '$quantity' }
        }
      }
    ]);

    // Category breakdown
    const categoryBreakdown = await InventoryItem.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalValue: { $sum: { $multiply: ['$currentStock', '$price'] } }
        }
      }
    ]);

    // Recent transactions
    const recentTransactions = await Transaction.find()
      .populate('item', 'name category')
      .populate('performedBy', 'name role')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        overview: {
          totalItems,
          totalSuppliers,
          totalUsers,
          lowStockItems,
          expiredItems,
          expiringSoonItems,
          totalInventoryValue: inventoryValue[0]?.totalValue || 0,
          monthlyConsumptionValue: monthlyConsumption[0]?.totalValue || 0,
          monthlyConsumptionQuantity: monthlyConsumption[0]?.totalQuantity || 0
        },
        categoryBreakdown,
        recentTransactions
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard statistics'
    });
  }
});

// @desc    Get recent activities
// @route   GET /api/dashboard/activities
// @access  Private
router.get('/activities', protect, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;

    const activities = await Transaction.find()
      .populate('item', 'name category')
      .populate('performedBy', 'name role')
      .populate('supplier', 'name')
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json({
      success: true,
      count: activities.length,
      data: activities
    });
  } catch (error) {
    console.error('Dashboard activities error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching recent activities'
    });
  }
});

// @desc    Get alerts and notifications
// @route   GET /api/dashboard/alerts
// @access  Private
router.get('/alerts', protect, async (req, res) => {
  try {
    // Low stock alerts
    const lowStockAlerts = await InventoryItem.find({
      $or: [
        { status: 'low' },
        { status: 'out-of-stock' }
      ]
    })
    .select('name currentStock minStock status category')
    .populate('supplier', 'name')
    .sort({ currentStock: 1 })
    .limit(10);

    // Expiry alerts (items expiring in next 30 days)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const expiryAlerts = await InventoryItem.find({
      expiryDate: {
        $gte: new Date(),
        $lte: thirtyDaysFromNow
      },
      status: { $ne: 'expired' }
    })
    .select('name expiryDate category currentStock')
    .populate('supplier', 'name')
    .sort({ expiryDate: 1 })
    .limit(10);

    // Expired items
    const expiredAlerts = await InventoryItem.find({ status: 'expired' })
      .select('name expiryDate category currentStock')
      .populate('supplier', 'name')
      .sort({ expiryDate: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        lowStock: lowStockAlerts,
        expiringSoon: expiryAlerts,
        expired: expiredAlerts,
        totalAlerts: lowStockAlerts.length + expiryAlerts.length + expiredAlerts.length
      }
    });
  } catch (error) {
    console.error('Dashboard alerts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching alerts'
    });
  }
});

// @desc    Get usage trends
// @route   GET /api/dashboard/trends
// @access  Private
router.get('/trends', protect, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Daily usage trends
    const dailyTrends = await Transaction.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            type: '$type'
          },
          totalQuantity: { $sum: '$quantity' },
          totalValue: { $sum: '$totalValue' },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.date',
          transactions: {
            $push: {
              type: '$_id.type',
              quantity: '$totalQuantity',
              value: '$totalValue',
              count: '$count'
            }
          }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);

    // Category-wise consumption
    const categoryConsumption = await Transaction.aggregate([
      {
        $match: {
          type: 'out',
          createdAt: { $gte: startDate }
        }
      },
      {
        $lookup: {
          from: 'inventoryitems',
          localField: 'item',
          foreignField: '_id',
          as: 'itemDetails'
        }
      },
      {
        $unwind: '$itemDetails'
      },
      {
        $group: {
          _id: '$itemDetails.category',
          totalQuantity: { $sum: '$quantity' },
          totalValue: { $sum: '$totalValue' },
          transactionCount: { $sum: 1 }
        }
      },
      {
        $sort: { totalValue: -1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        dailyTrends,
        categoryConsumption,
        period: {
          days,
          startDate,
          endDate: new Date()
        }
      }
    });
  } catch (error) {
    console.error('Dashboard trends error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching usage trends'
    });
  }
});

module.exports = router;