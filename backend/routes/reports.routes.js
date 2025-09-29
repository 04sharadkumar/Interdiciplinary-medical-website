const express = require('express');
const InventoryItem = require('../models/InventoryItem');
const Transaction = require('../models/Transaction');
const Supplier = require('../models/Supplier');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get inventory report
// @route   GET /api/reports/inventory
// @access  Private
router.get('/inventory', protect, async (req, res) => {
  try {
    const { category, status, startDate, endDate } = req.query;

    // Build query
    let query = {};
    if (category) query.category = category;
    if (status) query.status = status;

    const items = await InventoryItem.find(query)
      .populate('supplier', 'name category')
      .sort({ name: 1 });

    // Calculate totals
    const totalValue = items.reduce((sum, item) => sum + (item.currentStock * item.price), 0);
    const totalItems = items.length;
    const lowStockCount = items.filter(item => item.status === 'low' || item.status === 'out-of-stock').length;
    const expiredCount = items.filter(item => item.status === 'expired').length;

    // Category breakdown
    const categoryBreakdown = items.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = {
          count: 0,
          value: 0,
          lowStock: 0,
          expired: 0
        };
      }
      acc[item.category].count++;
      acc[item.category].value += item.currentStock * item.price;
      if (item.status === 'low' || item.status === 'out-of-stock') {
        acc[item.category].lowStock++;
      }
      if (item.status === 'expired') {
        acc[item.category].expired++;
      }
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        items,
        summary: {
          totalItems,
          totalValue,
          lowStockCount,
          expiredCount,
          categoryBreakdown
        },
        generatedAt: new Date(),
        filters: { category, status }
      }
    });
  } catch (error) {
    console.error('Inventory report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while generating inventory report'
    });
  }
});

// @desc    Get usage report
// @route   GET /api/reports/usage
// @access  Private
router.get('/usage', protect, async (req, res) => {
  try {
    const { startDate, endDate, category, type } = req.query;

    // Default to last 30 days if no dates provided
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate ? new Date(startDate) : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Build query
    let query = {
      createdAt: { $gte: start, $lte: end }
    };
    if (type) query.type = type;

    const transactions = await Transaction.find(query)
      .populate('item', 'name category unit')
      .populate('performedBy', 'name role')
      .populate('supplier', 'name')
      .sort({ createdAt: -1 });

    // Filter by category if specified
    let filteredTransactions = transactions;
    if (category) {
      filteredTransactions = transactions.filter(t => t.item && t.item.category === category);
    }

    // Calculate statistics
    const totalTransactions = filteredTransactions.length;
    const totalValue = filteredTransactions.reduce((sum, t) => sum + t.totalValue, 0);
    const totalQuantity = filteredTransactions.reduce((sum, t) => sum + t.quantity, 0);

    // Group by type
    const typeBreakdown = filteredTransactions.reduce((acc, t) => {
      if (!acc[t.type]) {
        acc[t.type] = {
          count: 0,
          quantity: 0,
          value: 0
        };
      }
      acc[t.type].count++;
      acc[t.type].quantity += t.quantity;
      acc[t.type].value += t.totalValue;
      return acc;
    }, {});

    // Daily breakdown
    const dailyBreakdown = filteredTransactions.reduce((acc, t) => {
      const date = t.createdAt.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = {
          date,
          transactions: 0,
          quantity: 0,
          value: 0,
          types: {}
        };
      }
      acc[date].transactions++;
      acc[date].quantity += t.quantity;
      acc[date].value += t.totalValue;
      
      if (!acc[date].types[t.type]) {
        acc[date].types[t.type] = { count: 0, quantity: 0, value: 0 };
      }
      acc[date].types[t.type].count++;
      acc[date].types[t.type].quantity += t.quantity;
      acc[date].types[t.type].value += t.totalValue;
      
      return acc;
    }, {});

    // Top consumed items
    const itemConsumption = filteredTransactions
      .filter(t => t.type === 'out')
      .reduce((acc, t) => {
        const itemId = t.item._id.toString();
        if (!acc[itemId]) {
          acc[itemId] = {
            item: t.item,
            totalQuantity: 0,
            totalValue: 0,
            transactionCount: 0
          };
        }
        acc[itemId].totalQuantity += t.quantity;
        acc[itemId].totalValue += t.totalValue;
        acc[itemId].transactionCount++;
        return acc;
      }, {});

    const topConsumedItems = Object.values(itemConsumption)
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, 10);

    res.json({
      success: true,
      data: {
        transactions: filteredTransactions,
        summary: {
          totalTransactions,
          totalValue,
          totalQuantity,
          typeBreakdown,
          topConsumedItems
        },
        dailyBreakdown: Object.values(dailyBreakdown).sort((a, b) => new Date(a.date) - new Date(b.date)),
        period: { start, end },
        filters: { category, type },
        generatedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Usage report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while generating usage report'
    });
  }
});

// @desc    Get supplier report
// @route   GET /api/reports/suppliers
// @access  Private
router.get('/suppliers', protect, async (req, res) => {
  try {
    const { status, category, minRating } = req.query;

    // Build query
    let query = {};
    if (status) query.status = status;
    if (category) query.category = { $regex: category, $options: 'i' };
    if (minRating) query.rating = { $gte: parseFloat(minRating) };

    const suppliers = await Supplier.find(query).sort({ name: 1 });

    // Get items for each supplier
    const suppliersWithItems = await Promise.all(
      suppliers.map(async (supplier) => {
        const items = await InventoryItem.find({ supplier: supplier._id })
          .select('name category currentStock price status');
        
        const totalItemsSupplied = items.length;
        const totalInventoryValue = items.reduce((sum, item) => sum + (item.currentStock * item.price), 0);
        const lowStockItems = items.filter(item => item.status === 'low' || item.status === 'out-of-stock').length;
        
        return {
          ...supplier.toObject(),
          suppliedItems: items,
          statistics: {
            totalItemsSupplied,
            totalInventoryValue,
            lowStockItems
          }
        };
      })
    );

    // Calculate overall statistics
    const totalSuppliers = suppliersWithItems.length;
    const activeSuppliers = suppliersWithItems.filter(s => s.status === 'active').length;
    const averageRating = suppliersWithItems.reduce((sum, s) => sum + s.rating, 0) / totalSuppliers;
    const totalOrders = suppliersWithItems.reduce((sum, s) => sum + s.totalOrders, 0);

    // Category breakdown
    const categoryBreakdown = suppliersWithItems.reduce((acc, supplier) => {
      if (!acc[supplier.category]) {
        acc[supplier.category] = {
          count: 0,
          averageRating: 0,
          totalOrders: 0
        };
      }
      acc[supplier.category].count++;
      acc[supplier.category].totalOrders += supplier.totalOrders;
      return acc;
    }, {});

    // Calculate average ratings for categories
    Object.keys(categoryBreakdown).forEach(category => {
      const categorySuppliers = suppliersWithItems.filter(s => s.category === category);
      categoryBreakdown[category].averageRating = 
        categorySuppliers.reduce((sum, s) => sum + s.rating, 0) / categorySuppliers.length;
    });

    res.json({
      success: true,
      data: {
        suppliers: suppliersWithItems,
        summary: {
          totalSuppliers,
          activeSuppliers,
          averageRating: parseFloat(averageRating.toFixed(2)),
          totalOrders,
          categoryBreakdown
        },
        generatedAt: new Date(),
        filters: { status, category, minRating }
      }
    });
  } catch (error) {
    console.error('Supplier report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while generating supplier report'
    });
  }
});

// @desc    Get expiry report
// @route   GET /api/reports/expiry
// @access  Private
router.get('/expiry', protect, async (req, res) => {
  try {
    const { days = 90 } = req.query;
    const daysAhead = parseInt(days);

    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);

    // Get items with expiry dates
    const itemsWithExpiry = await InventoryItem.find({
      expiryDate: { $exists: true, $ne: null }
    })
    .populate('supplier', 'name contact')
    .sort({ expiryDate: 1 });

    // Categorize items
    const expiredItems = itemsWithExpiry.filter(item => item.expiryDate < now);
    const expiringSoonItems = itemsWithExpiry.filter(item => 
      item.expiryDate >= now && item.expiryDate <= futureDate
    );
    const validItems = itemsWithExpiry.filter(item => item.expiryDate > futureDate);

    // Calculate values
    const expiredValue = expiredItems.reduce((sum, item) => sum + (item.currentStock * item.price), 0);
    const expiringSoonValue = expiringSoonItems.reduce((sum, item) => sum + (item.currentStock * item.price), 0);
    const validValue = validItems.reduce((sum, item) => sum + (item.currentStock * item.price), 0);

    // Group by time periods
    const timeGroups = {
      expired: expiredItems,
      next7Days: expiringSoonItems.filter(item => {
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
        return item.expiryDate <= sevenDaysFromNow;
      }),
      next30Days: expiringSoonItems.filter(item => {
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
        return item.expiryDate > sevenDaysFromNow && item.expiryDate <= thirtyDaysFromNow;
      }),
      next90Days: expiringSoonItems.filter(item => {
        const ninetyDaysFromNow = new Date();
        ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90);
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        return item.expiryDate > thirtyDaysFromNow && item.expiryDate <= ninetyDaysFromNow;
      })
    };

    // Category breakdown
    const categoryBreakdown = itemsWithExpiry.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = {
          total: 0,
          expired: 0,
          expiringSoon: 0,
          valid: 0,
          expiredValue: 0,
          expiringSoonValue: 0,
          validValue: 0
        };
      }
      
      acc[item.category].total++;
      const itemValue = item.currentStock * item.price;
      
      if (item.expiryDate < now) {
        acc[item.category].expired++;
        acc[item.category].expiredValue += itemValue;
      } else if (item.expiryDate <= futureDate) {
        acc[item.category].expiringSoon++;
        acc[item.category].expiringSoonValue += itemValue;
      } else {
        acc[item.category].valid++;
        acc[item.category].validValue += itemValue;
      }
      
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        summary: {
          totalItemsWithExpiry: itemsWithExpiry.length,
          expiredCount: expiredItems.length,
          expiringSoonCount: expiringSoonItems.length,
          validCount: validItems.length,
          expiredValue,
          expiringSoonValue,
          validValue,
          totalValue: expiredValue + expiringSoonValue + validValue
        },
        timeGroups,
        categoryBreakdown,
        period: {
          daysAhead,
          reportDate: now,
          cutoffDate: futureDate
        },
        generatedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Expiry report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while generating expiry report'
    });
  }
});

// @desc    Get financial report
// @route   GET /api/reports/financial
// @access  Private (Admin only)
router.get('/financial', protect, authorize('admin'), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Default to last 30 days if no dates provided
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate ? new Date(startDate) : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get all transactions in the period
    const transactions = await Transaction.find({
      createdAt: { $gte: start, $lte: end }
    })
    .populate('item', 'name category')
    .populate('supplier', 'name')
    .sort({ createdAt: -1 });

    // Calculate financial metrics
    const inboundValue = transactions
      .filter(t => t.type === 'in')
      .reduce((sum, t) => sum + t.totalValue, 0);

    const outboundValue = transactions
      .filter(t => t.type === 'out')
      .reduce((sum, t) => sum + t.totalValue, 0);

    const wasteValue = transactions
      .filter(t => ['expired', 'damaged'].includes(t.type))
      .reduce((sum, t) => sum + t.totalValue, 0);

    const adjustmentValue = transactions
      .filter(t => t.type === 'adjustment')
      .reduce((sum, t) => sum + (t.newStock > t.previousStock ? t.totalValue : -t.totalValue), 0);

    // Current inventory value
    const currentInventoryValue = await InventoryItem.aggregate([
      {
        $group: {
          _id: null,
          totalValue: { $sum: { $multiply: ['$currentStock', '$price'] } }
        }
      }
    ]);

    // Monthly breakdown
    const monthlyBreakdown = transactions.reduce((acc, t) => {
      const month = t.createdAt.toISOString().substring(0, 7); // YYYY-MM
      if (!acc[month]) {
        acc[month] = {
          month,
          inbound: 0,
          outbound: 0,
          waste: 0,
          adjustment: 0,
          net: 0
        };
      }
      
      switch (t.type) {
        case 'in':
          acc[month].inbound += t.totalValue;
          break;
        case 'out':
          acc[month].outbound += t.totalValue;
          break;
        case 'expired':
        case 'damaged':
          acc[month].waste += t.totalValue;
          break;
        case 'adjustment':
          acc[month].adjustment += (t.newStock > t.previousStock ? t.totalValue : -t.totalValue);
          break;
      }
      
      acc[month].net = acc[month].inbound - acc[month].outbound - acc[month].waste + acc[month].adjustment;
      return acc;
    }, {});

    // Supplier spending
    const supplierSpending = transactions
      .filter(t => t.type === 'in' && t.supplier)
      .reduce((acc, t) => {
        const supplierId = t.supplier._id.toString();
        if (!acc[supplierId]) {
          acc[supplierId] = {
            supplier: t.supplier,
            totalSpent: 0,
            transactionCount: 0
          };
        }
        acc[supplierId].totalSpent += t.totalValue;
        acc[supplierId].transactionCount++;
        return acc;
      }, {});

    const topSuppliersBySpending = Object.values(supplierSpending)
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 10);

    res.json({
      success: true,
      data: {
        summary: {
          inboundValue,
          outboundValue,
          wasteValue,
          adjustmentValue,
          netValue: inboundValue - outboundValue - wasteValue + adjustmentValue,
          currentInventoryValue: currentInventoryValue[0]?.totalValue || 0,
          wastePercentage: inboundValue > 0 ? ((wasteValue / inboundValue) * 100).toFixed(2) : 0
        },
        monthlyBreakdown: Object.values(monthlyBreakdown).sort((a, b) => a.month.localeCompare(b.month)),
        topSuppliersBySpending,
        transactions,
        period: { start, end },
        generatedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Financial report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while generating financial report'
    });
  }
});

module.exports = router;