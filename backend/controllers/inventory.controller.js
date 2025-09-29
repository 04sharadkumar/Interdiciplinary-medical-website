const InventoryItem = require('../models/InventoryItem.js');

// Get all items
exports.getAllItems = async (req, res, next) => {
  try {
    const items = await InventoryItem.find().populate('supplier', 'name');
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
};

// Get low stock items
exports.getLowStockItems = async (req, res, next) => {
  try {
    const items = await InventoryItem.getLowStockItems();
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
};

// Get expired items
exports.getExpiredItems = async (req, res, next) => {
  try {
    const items = await InventoryItem.getExpiredItems();
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
};

// Create new item
exports.createItem = async (req, res, next) => {
  try {
    const newItem = await InventoryItem.create({
      ...req.body,
      createdBy: req.user._id,
      lastUpdatedBy: req.user._id
    });
    res.status(201).json({ success: true, data: newItem });
  } catch (err) {
    next(err);
  }
};

// Update item
exports.updateItem = async (req, res, next) => {
  try {
    const updatedItem = await InventoryItem.findByIdAndUpdate(
      req.params.id,
      { ...req.body, lastUpdatedBy: req.user._id },
      { new: true, runValidators: true }
    );
    res.json({ success: true, data: updatedItem });
  } catch (err) {
    next(err);
  }
};

// Delete item
exports.deleteItem = async (req, res, next) => {
  try {
    await InventoryItem.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Item deleted successfully' });
  } catch (err) {
    next(err);
  }
};
