import { InventoryItem, Supplier, DashboardStats, UsageRecord } from '../types';

export const mockInventoryItems: InventoryItem[] = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    category: 'medicine',
    currentStock: 150,
    minStock: 50,
    maxStock: 500,
    unit: 'tablets',
    expiryDate: '2024-08-15',
    supplier: 'MedPharm Inc.',
    batchNumber: 'PC2024001',
    location: 'Pharmacy-A1',
    price: 0.25,
    lastUpdated: '2024-01-15',
    status: 'available'
  },
  {
    id: '2',
    name: 'Digital Thermometer',
    category: 'equipment',
    currentStock: 25,
    minStock: 30,
    maxStock: 100,
    unit: 'units',
    supplier: 'MedTech Solutions',
    location: 'Equipment-B2',
    price: 35.00,
    lastUpdated: '2024-01-14',
    status: 'low'
  },
  {
    id: '3',
    name: 'Insulin Vials',
    category: 'medicine',
    currentStock: 80,
    minStock: 20,
    maxStock: 200,
    unit: 'vials',
    expiryDate: '2024-03-20',
    supplier: 'BioPharma Ltd.',
    batchNumber: 'IN2024005',
    location: 'Cold-Storage-C1',
    price: 24.50,
    lastUpdated: '2024-01-16',
    status: 'available'
  },
  {
    id: '4',
    name: 'Aspirin 100mg',
    category: 'medicine',
    currentStock: 0,
    minStock: 100,
    maxStock: 1000,
    unit: 'tablets',
    expiryDate: '2023-12-01',
    supplier: 'MedPharm Inc.',
    batchNumber: 'AS2023012',
    location: 'Pharmacy-A2',
    price: 0.15,
    lastUpdated: '2024-01-10',
    status: 'expired'
  },
  {
    id: '5',
    name: 'Surgical Gloves',
    category: 'supplies',
    currentStock: 500,
    minStock: 100,
    maxStock: 2000,
    unit: 'pairs',
    supplier: 'MedSupply Co.',
    location: 'Storage-D1',
    price: 0.50,
    lastUpdated: '2024-01-16',
    status: 'available'
  },
  {
    id: '6',
    name: 'Blood Pressure Monitor',
    category: 'equipment',
    currentStock: 15,
    minStock: 10,
    maxStock: 50,
    unit: 'units',
    supplier: 'HealthTech Inc.',
    location: 'Equipment-B1',
    price: 120.00,
    lastUpdated: '2024-01-15',
    status: 'available'
  }
];

export const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'MedPharm Inc.',
    contact: '+1-555-0123',
    email: 'orders@medpharm.com',
    address: '123 Medical District, Healthcare City, HC 12345',
    category: 'Pharmaceuticals',
    rating: 4.8,
    totalOrders: 245,
    lastOrderDate: '2024-01-15',
    status: 'active'
  },
  {
    id: '2',
    name: 'MedTech Solutions',
    contact: '+1-555-0234',
    email: 'sales@medtech.com',
    address: '456 Tech Avenue, Innovation District, ID 54321',
    category: 'Medical Equipment',
    rating: 4.6,
    totalOrders: 89,
    lastOrderDate: '2024-01-12',
    status: 'active'
  },
  {
    id: '3',
    name: 'BioPharma Ltd.',
    contact: '+1-555-0345',
    email: 'support@biopharma.com',
    address: '789 Biotech Park, Research City, RC 67890',
    category: 'Specialty Medicines',
    rating: 4.9,
    totalOrders: 156,
    lastOrderDate: '2024-01-16',
    status: 'active'
  },
  {
    id: '4',
    name: 'MedSupply Co.',
    contact: '+1-555-0456',
    email: 'orders@medsupply.com',
    address: '321 Supply Chain Blvd, Logistics Hub, LH 13579',
    category: 'Medical Supplies',
    rating: 4.4,
    totalOrders: 334,
    lastOrderDate: '2024-01-14',
    status: 'active'
  },
  {
    id: '5',
    name: 'HealthTech Inc.',
    contact: '+1-555-0567',
    email: 'info@healthtech.com',
    address: '654 Innovation Drive, Tech Valley, TV 24680',
    category: 'Diagnostic Equipment',
    rating: 4.7,
    totalOrders: 67,
    lastOrderDate: '2024-01-11',
    status: 'active'
  }
];

export const mockDashboardStats: DashboardStats = {
  totalItems: mockInventoryItems.length,
  lowStockItems: mockInventoryItems.filter(item => item.status === 'low' || item.status === 'out-of-stock').length,
  expiredItems: mockInventoryItems.filter(item => item.status === 'expired').length,
  totalSuppliers: mockSuppliers.length,
  totalValue: mockInventoryItems.reduce((sum, item) => sum + (item.currentStock * item.price), 0),
  monthlyConsumption: 15420.50
};

export const mockUsageData: UsageRecord[] = [
  { date: '2024-01-01', consumed: 120, restocked: 200, expired: 5 },
  { date: '2024-01-02', consumed: 95, restocked: 150, expired: 3 },
  { date: '2024-01-03', consumed: 110, restocked: 0, expired: 2 },
  { date: '2024-01-04', consumed: 130, restocked: 300, expired: 8 },
  { date: '2024-01-05', consumed: 85, restocked: 100, expired: 1 },
  { date: '2024-01-06', consumed: 140, restocked: 250, expired: 4 },
  { date: '2024-01-07', consumed: 105, restocked: 0, expired: 2 }
];