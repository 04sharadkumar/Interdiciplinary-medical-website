import React from 'react';
import { useAuth } from '../../context/AuthContext';
import StatsCard from '../../components/StatsCard';
import { mockDashboardStats, mockInventoryItems, mockUsageData } from '../../data/mockData';
import { 
  Package, 
  AlertTriangle, 
  Calendar, 
  Users, 
  TrendingUp,
  Activity,
  Clock
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line 
} from 'recharts';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  const lowStockItems = mockInventoryItems.filter(item => item.status === 'low' || item.status === 'out-of-stock');
  const expiredItems = mockInventoryItems.filter(item => item.status === 'expired');
  const nearExpiryItems = mockInventoryItems.filter(item => {
    if (!item.expiryDate) return false;
    const expiry = new Date(item.expiryDate);
    const today = new Date();
    const daysUntilExpiry = (expiry.getTime() - today.getTime()) / (1000 * 3600 * 24);
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  });

  const recentActivity = [
    { action: 'Stock Updated', item: 'Paracetamol 500mg', user: 'Dr. Sarah Johnson', time: '2 hours ago' },
    { action: 'Low Stock Alert', item: 'Digital Thermometer', user: 'System', time: '3 hours ago' },
    { action: 'New Supplier Added', item: 'HealthTech Inc.', user: 'John Smith', time: '5 hours ago' },
    { action: 'Expiry Alert', item: 'Aspirin 100mg', user: 'System', time: '1 day ago' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-blue-100">
          Here's what's happening with your hospital inventory today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Items"
          value={mockDashboardStats.totalItems.toLocaleString()}
          icon={Package}
          color="blue"
          trend={{ value: '+12%', isPositive: true }}
        />
        <StatsCard
          title="Low Stock Alerts"
          value={mockDashboardStats.lowStockItems}
          icon={AlertTriangle}
          color="yellow"
          trend={{ value: '-5%', isPositive: true }}
        />
        <StatsCard
          title="Expired Items"
          value={mockDashboardStats.expiredItems}
          icon={Calendar}
          color="red"
          trend={{ value: '+2', isPositive: false }}
        />
        <StatsCard
          title="Total Suppliers"
          value={mockDashboardStats.totalSuppliers}
          icon={Users}
          color="green"
          trend={{ value: '+1', isPositive: true }}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Daily Usage Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-600" />
            Daily Usage Overview
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockUsageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="consumed" fill="#3B82F6" name="Consumed" />
                <Bar dataKey="restocked" fill="#10B981" name="Restocked" />
                <Bar dataKey="expired" fill="#EF4444" name="Expired" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inventory Value Trend */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
            Inventory Value Trend
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockUsageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="consumed" stroke="#3B82F6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Low Stock Items */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-yellow-600" />
            Low Stock Items
          </h3>
          <div className="space-y-3">
            {lowStockItems.slice(0, 5).map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">{item.currentStock} {item.unit} remaining</p>
                </div>
                <div className="text-yellow-600">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expiring Soon */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-orange-600" />
            Expiring Soon
          </h3>
          <div className="space-y-3">
            {nearExpiryItems.slice(0, 5).map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">Expires: {item.expiryDate}</p>
                </div>
                <div className="text-orange-600">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.item}</p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
