const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Supplier = require('../models/Supplier');
const InventoryItem = require('../models/InventoryItem');
const Transaction = require('../models/Transaction');
require('dotenv').config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hospital_inventory');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Supplier.deleteMany({});
    await InventoryItem.deleteMany({});
    await Transaction.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const users = [
      {
        name: 'Dr. Sarah Johnson',
        email: 'admin@hospital.com',
        password: 'password123',
        role: 'admin',
        department: 'Administration',
        phone: '+1-555-0101',
        employeeId: 'EMP001'
      },
      {
        name: 'John Smith',
        email: 'staff@hospital.com',
        password: 'password123',
        role: 'staff',
        department: 'General Ward',
        phone: '+1-555-0102',
        employeeId: 'EMP002'
      },
      {
        name: 'Emma Wilson',
        email: 'pharmacist@hospital.com',
        password: 'password123',
        role: 'pharmacist',
        department: 'Pharmacy',
        phone: '+1-555-0103',
        employeeId: 'EMP003'
      },
      {
        name: 'Dr. Michael Brown',
        email: 'doctor@hospital.com',
        password: 'password123',
        role: 'staff',
        department: 'Emergency',
        phone: '+1-555-0104',
        employeeId: 'EMP004'
      }
    ];

    const createdUsers = await User.create(users);
    console.log('Created users');

    // Create suppliers
    const suppliers = [
      {
        name: 'MedPharm Inc.',
        contact: '+1-555-0123',
        email: 'orders@medpharm.com',
        address: {
          street: '123 Medical District',
          city: 'Healthcare City',
          state: 'California',
          zipCode: '12345',
          country: 'USA'
        },
        category: 'Pharmaceuticals',
        rating: 4.8,
        totalOrders: 245,
        lastOrderDate: new Date('2024-01-15'),
        status: 'active',
        paymentTerms: 'Net 30',
        taxId: 'TAX123456',
        website: 'https://medpharm.com',
        createdBy: createdUsers[0]._id,
        lastUpdatedBy: createdUsers[0]._id
      },
      {
        name: 'MedTech Solutions',
        contact: '+1-555-0234',
        email: 'sales@medtech.com',
        address: {
          street: '456 Tech Avenue',
          city: 'Innovation District',
          state: 'New York',
          zipCode: '54321',
          country: 'USA'
        },
        category: 'Medical Equipment',
        rating: 4.6,
        totalOrders: 89,
        lastOrderDate: new Date('2024-01-12'),
        status: 'active',
        paymentTerms: 'Net 45',
        taxId: 'TAX234567',
        website: 'https://medtech.com',
        createdBy: createdUsers[0]._id,
        lastUpdatedBy: createdUsers[0]._id
      },
      {
        name: 'BioPharma Ltd.',
        contact: '+1-555-0345',
        email: 'support@biopharma.com',
        address: {
          street: '789 Biotech Park',
          city: 'Research City',
          state: 'Massachusetts',
          zipCode: '67890',
          country: 'USA'
        },
        category: 'Specialty Medicines',
        rating: 4.9,
        totalOrders: 156,
        lastOrderDate: new Date('2024-01-16'),
        status: 'active',
        paymentTerms: 'Net 30',
        taxId: 'TAX345678',
        website: 'https://biopharma.com',
        createdBy: createdUsers[0]._id,
        lastUpdatedBy: createdUsers[0]._id
      },
      {
        name: 'MedSupply Co.',
        contact: '+1-555-0456',
        email: 'orders@medsupply.com',
        address: {
          street: '321 Supply Chain Blvd',
          city: 'Logistics Hub',
          state: 'Texas',
          zipCode: '13579',
          country: 'USA'
        },
        category: 'Medical Supplies',
        rating: 4.4,
        totalOrders: 334,
        lastOrderDate: new Date('2024-01-14'),
        status: 'active',
        paymentTerms: 'Net 30',
        taxId: 'TAX456789',
        createdBy: createdUsers[0]._id,
        lastUpdatedBy: createdUsers[0]._id
      },
      {
        name: 'HealthTech Inc.',
        contact: '+1-555-0567',
        email: 'info@healthtech.com',
        address: {
          street: '654 Innovation Drive',
          city: 'Tech Valley',
          state: 'California',
          zipCode: '24680',
          country: 'USA'
        },
        category: 'Diagnostic Equipment',
        rating: 4.7,
        totalOrders: 67,
        lastOrderDate: new Date('2024-01-11'),
        status: 'active',
        paymentTerms: 'Net 45',
        taxId: 'TAX567890',
        website: 'https://healthtech.com',
        createdBy: createdUsers[0]._id,
        lastUpdatedBy: createdUsers[0]._id
      }
    ];

    const createdSuppliers = await Supplier.create(suppliers);
    console.log('Created suppliers');

    // Create inventory items
    const inventoryItems = [
      {
        name: 'Paracetamol 500mg',
        category: 'medicine',
        currentStock: 150,
        minStock: 50,
        maxStock: 500,
        unit: 'tablets',
        expiryDate: new Date('2024-08-15'),
        supplier: createdSuppliers[0]._id,
        batchNumber: 'PC2024001',
        location: 'Pharmacy-A1',
        price: 0.25,
        description: 'Pain relief and fever reducer',
        manufacturer: 'PharmaCorp',
        createdBy: createdUsers[2]._id,
        lastUpdatedBy: createdUsers[2]._id
      },
      {
        name: 'Digital Thermometer',
        category: 'equipment',
        currentStock: 25,
        minStock: 30,
        maxStock: 100,
        unit: 'units',
        supplier: createdSuppliers[1]._id,
        location: 'Equipment-B2',
        price: 35.00,
        description: 'Digital infrared thermometer',
        manufacturer: 'MedDevice Inc.',
        createdBy: createdUsers[0]._id,
        lastUpdatedBy: createdUsers[0]._id
      },
      {
        name: 'Insulin Vials',
        category: 'medicine',
        currentStock: 80,
        minStock: 20,
        maxStock: 200,
        unit: 'vials',
        expiryDate: new Date('2024-03-20'),
        supplier: createdSuppliers[2]._id,
        batchNumber: 'IN2024005',
        location: 'Cold-Storage-C1',
        price: 24.50,
        description: 'Rapid-acting insulin',
        manufacturer: 'BioPharma Ltd.',
        createdBy: createdUsers[2]._id,
        lastUpdatedBy: createdUsers[2]._id
      },
      {
        name: 'Aspirin 100mg',
        category: 'medicine',
        currentStock: 0,
        minStock: 100,
        maxStock: 1000,
        unit: 'tablets',
        expiryDate: new Date('2023-12-01'),
        supplier: createdSuppliers[0]._id,
        batchNumber: 'AS2023012',
        location: 'Pharmacy-A2',
        price: 0.15,
        description: 'Low-dose aspirin for cardiovascular protection',
        manufacturer: 'PharmaCorp',
        createdBy: createdUsers[2]._id,
        lastUpdatedBy: createdUsers[2]._id
      },
      {
        name: 'Surgical Gloves',
        category: 'supplies',
        currentStock: 500,
        minStock: 100,
        maxStock: 2000,
        unit: 'pairs',
        supplier: createdSuppliers[3]._id,
        location: 'Storage-D1',
        price: 0.50,
        description: 'Latex-free surgical gloves',
        manufacturer: 'MedSupply Co.',
        createdBy: createdUsers[1]._id,
        lastUpdatedBy: createdUsers[1]._id
      },
      {
        name: 'Blood Pressure Monitor',
        category: 'equipment',
        currentStock: 15,
        minStock: 10,
        maxStock: 50,
        unit: 'units',
        supplier: createdSuppliers[4]._id,
        location: 'Equipment-B1',
        price: 120.00,
        description: 'Automatic digital blood pressure monitor',
        manufacturer: 'HealthTech Inc.',
        createdBy: createdUsers[0]._id,
        lastUpdatedBy: createdUsers[0]._id
      },
      {
        name: 'Amoxicillin 250mg',
        category: 'medicine',
        currentStock: 200,
        minStock: 75,
        maxStock: 600,
        unit: 'capsules',
        expiryDate: new Date('2024-06-30'),
        supplier: createdSuppliers[0]._id,
        batchNumber: 'AM2024003',
        location: 'Pharmacy-A3',
        price: 0.45,
        description: 'Broad-spectrum antibiotic',
        manufacturer: 'PharmaCorp',
        createdBy: createdUsers[2]._id,
        lastUpdatedBy: createdUsers[2]._id
      },
      {
        name: 'Disposable Syringes 5ml',
        category: 'supplies',
        currentStock: 1000,
        minStock: 200,
        maxStock: 5000,
        unit: 'pieces',
        supplier: createdSuppliers[3]._id,
        location: 'Storage-D2',
        price: 0.15,
        description: 'Sterile disposable syringes',
        manufacturer: 'MedSupply Co.',
        createdBy: createdUsers[1]._id,
        lastUpdatedBy: createdUsers[1]._id
      }
    ];

    const createdItems = await InventoryItem.create(inventoryItems);
    console.log('Created inventory items');

    // Create sample transactions
    const transactions = [];
    const transactionTypes = ['in', 'out', 'adjustment'];
    const reasons = [
      'Initial stock entry',
      'Patient dispensing',
      'Emergency use',
      'Stock adjustment',
      'Expired items removal',
      'Damaged items',
      'Restocking',
      'Transfer to ward'
    ];

    // Generate transactions for the last 30 days
    for (let i = 0; i < 50; i++) {
      const randomItem = createdItems[Math.floor(Math.random() * createdItems.length)];
      const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const randomType = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
      const randomReason = reasons[Math.floor(Math.random() * reasons.length)];
      
      const quantity = Math.floor(Math.random() * 50) + 1;
      const previousStock = randomItem.currentStock;
      let newStock;
      
      if (randomType === 'in') {
        newStock = previousStock + quantity;
      } else if (randomType === 'out') {
        newStock = Math.max(0, previousStock - quantity);
      } else {
        newStock = Math.max(0, previousStock + (Math.random() > 0.5 ? quantity : -quantity));
      }

      const transactionDate = new Date();
      transactionDate.setDate(transactionDate.getDate() - Math.floor(Math.random() * 30));

      transactions.push({
        type: randomType,
        item: randomItem._id,
        quantity,
        previousStock,
        newStock,
        reason: randomReason,
        batchNumber: randomItem.batchNumber,
        supplier: randomItem.supplier,
        unitPrice: randomItem.price,
        performedBy: randomUser._id,
        createdAt: transactionDate
      });
    }

    await Transaction.create(transactions);
    console.log('Created sample transactions');

    console.log('✅ Database seeded successfully!');
    console.log('\n📋 Demo Accounts:');
    console.log('Admin: admin@hospital.com / password123');
    console.log('Staff: staff@hospital.com / password123');
    console.log('Pharmacist: pharmacist@hospital.com / password123');
    console.log('Doctor: doctor@hospital.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedData();