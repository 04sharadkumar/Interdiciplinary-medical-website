const mongoose = require('mongoose');

const inventoryItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
    maxlength: [100, 'Item name cannot exceed 100 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['medicine', 'equipment', 'supplies'],
    lowercase: true
  },
  currentStock: {
    type: Number,
    required: [true, 'Current stock is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  minStock: {
    type: Number,
    required: [true, 'Minimum stock level is required'],
    min: [0, 'Minimum stock cannot be negative'],
    default: 10
  },
  maxStock: {
    type: Number,
    required: [true, 'Maximum stock level is required'],
    min: [1, 'Maximum stock must be at least 1'],
    default: 1000
  },
  unit: {
    type: String,
    required: [true, 'Unit is required'],
    trim: true,
    maxlength: [20, 'Unit cannot exceed 20 characters']
  },
  expiryDate: {
    type: Date,
    default: null
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: [true, 'Supplier is required']
  },
  batchNumber: {
    type: String,
    trim: true,
    maxlength: [50, 'Batch number cannot exceed 50 characters']
  },
  location: {
    type: String,
    required: [true, 'Storage location is required'],
    trim: true,
    maxlength: [100, 'Location cannot exceed 100 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  manufacturer: {
    type: String,
    trim: true,
    maxlength: [100, 'Manufacturer name cannot exceed 100 characters']
  },
  status: {
    type: String,
    enum: ['available', 'low', 'out-of-stock', 'expired'],
    default: 'available'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
inventoryItemSchema.index({ name: 'text', description: 'text' });
inventoryItemSchema.index({ category: 1 });
inventoryItemSchema.index({ status: 1 });
inventoryItemSchema.index({ expiryDate: 1 });
inventoryItemSchema.index({ supplier: 1 });

// Virtual for calculating status based on stock levels and expiry
inventoryItemSchema.pre('save', function(next) {
  // Check if expired
  if (this.expiryDate && new Date() > this.expiryDate) {
    this.status = 'expired';
  }
  // Check stock levels
  else if (this.currentStock === 0) {
    this.status = 'out-of-stock';
  }
  else if (this.currentStock <= this.minStock) {
    this.status = 'low';
  }
  else {
    this.status = 'available';
  }
  
  next();
});

// Method to check if item is expiring soon (within 30 days)
inventoryItemSchema.methods.isExpiringSoon = function() {
  if (!this.expiryDate) return false;
  
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  
  return this.expiryDate <= thirtyDaysFromNow && this.expiryDate > new Date();
};

// Static method to get low stock items
inventoryItemSchema.statics.getLowStockItems = function() {
  return this.find({
    $or: [
      { status: 'low' },
      { status: 'out-of-stock' }
    ]
  }).populate('supplier', 'name');
};

// Static method to get expired items
inventoryItemSchema.statics.getExpiredItems = function() {
  return this.find({ status: 'expired' }).populate('supplier', 'name');
};

module.exports = mongoose.model('InventoryItem', inventoryItemSchema);