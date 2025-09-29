export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'pharmacist';
  avatar?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'medicine' | 'equipment' | 'supplies';
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  expiryDate?: string;
  supplier: string;
  batchNumber?: string;
  location: string;
  price: number;
  lastUpdated: string;
  status: 'available' | 'low' | 'expired' | 'out-of-stock';
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  address: string;
  category: string;
  rating: number;
  totalOrders: number;
  lastOrderDate: string;
  status: 'active' | 'inactive';
}

export interface DashboardStats {
  totalItems: number;
  lowStockItems: number;
  expiredItems: number;
  totalSuppliers: number;
  totalValue: number;
  monthlyConsumption: number;
}

export interface UsageRecord {
  date: string;
  consumed: number;
  restocked: number;
  expired: number;
}