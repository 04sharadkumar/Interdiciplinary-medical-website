const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, 'Transaction type is required'],
    enum: ['in', 'out', 'adjustment', 'expired', 'damaged'],
    lowercase: true
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InventoryItem',
    required: [true, 'Item reference is required']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  previousStock: {
    type: Number,
    required: [true, 'Previous stock level is required'],
    min: [0, 'Previous stock cannot be negative']
  },
  newStock: {
    type: Number,
    required: [true, 'New stock level is required'],
    min: [0, 'New stock cannot be negative']
  },
  reason: {
    type: String,
    required: [true, 'Transaction reason is required'],
    trim: true,
    maxlength: [200, 'Reason cannot exceed 200 characters']
  },
  batchNumber: {
    type: String,
    trim: true,
    maxlength: [50, 'Batch number cannot exceed 50 characters']
  },
  expiryDate: {
    type: Date,
    default: null
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    default: null
  },
  unitPrice: {
    type: Number,
    min: [0, 'Unit price cannot be negative'],
    default: 0
  },
  totalValue: {
    type: Number,
    min: [0, 'Total value cannot be negative'],
    default: 0
  },
  department: {
    type: String,
    trim: true,
    maxlength: [50, 'Department cannot exceed 50 characters']
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
transactionSchema.index({ item: 1, createdAt: -1 });
transactionSchema.index({ type: 1, createdAt: -1 });
transactionSchema.index({ performedBy: 1 });
transactionSchema.index({ createdAt: -1 });

// Pre-save middleware to calculate total value
transactionSchema.pre('save', function(next) {
  this.totalValue = this.quantity * this.unitPrice;
  next();
});

// Static method to get transactions by date range
transactionSchema.statics.getTransactionsByDateRange = function(startDate, endDate, type = null) {
  const query = {
    createdAt: {
      $gte: startDate,
      $lte: endDate
    }
  };
  
  if (type) {
    query.type = type;
  }
  
  return this.find(query)
    .populate('item', 'name category unit')
    .populate('performedBy', 'name role')
    .populate('supplier', 'name')
    .sort({ createdAt: -1 });
};

// Static method to get usage statistics
transactionSchema.statics.getUsageStats = function(days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
        type: 'out'
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
        },
        totalQuantity: { $sum: '$quantity' },
        totalValue: { $sum: '$totalValue' },
        transactionCount: { $sum: 1 }
      }
    },
    {
      $sort: { '_id': 1 }
    }
  ]);
};

module.exports = mongoose.model('Transaction', transactionSchema);