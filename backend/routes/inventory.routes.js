const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventory.controller');
const authMiddleware = require('../middleware/authMiddleware');

// CRUD routes
router.get('/', authMiddleware, inventoryController.getAllItems);
router.get('/low-stock', authMiddleware, inventoryController.getLowStockItems);
router.get('/expired', authMiddleware, inventoryController.getExpiredItems);
router.post('/', authMiddleware, inventoryController.createItem);
router.put('/:id', authMiddleware, inventoryController.updateItem);
router.delete('/:id', authMiddleware, inventoryController.deleteItem);

module.exports = router;
