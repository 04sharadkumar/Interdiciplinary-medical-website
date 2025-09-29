import React, { useState } from 'react';
import { mockUsageData, mockInventoryItems, mockSuppliers } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';
import { 
  TrendingUp, Package, AlertTriangle, DollarSign, Download 
} from 'lucide-react';

const ReportsPage: React.FC = () => {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState('7days');

  // --- Aggregations ---
  const categoryData = mockInventoryItems.reduce((acc, item) => {
    const category = item.category;
    if (!acc[category]) acc[category] = { name: category, value: 0, count: 0, lowStock: 0 };
    acc[category].value += item.currentStock * item.price;
    acc[category].count += 1;
    if (item.status === 'low' || item.status === 'out-of-stock') acc[category].lowStock += 1;
    return acc;
  }, {} as Record<string, { name: string; value: number; count: number; lowStock: number }>);
  const categoryChartData = Object.values(categoryData);

  const statusData = mockInventoryItems.reduce((acc, item) => {
    const status = item.status;
    if (!acc[status]) acc[status] = 0;
    acc[status] += 1;
    return acc;
  }, {} as Record<string, number>);
  const statusChartData = Object.entries(statusData).map(([status, count]) => ({
    name: status.replace('-', ' '),
    value: count,
  }));
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const supplierData = mockSuppliers.map(supplier => ({
    name: supplier.name.split(' ')[0],
    orders: supplier.totalOrders,
    rating: supplier.rating,
  }));

  const totalValue = mockInventoryItems.reduce((sum, item) => sum + item.currentStock * item.price, 0);
  const lowStockValue = mockInventoryItems
    .filter(item => item.status === 'low' || item.status === 'out-of-stock')
    .reduce((sum, item) => sum + item.currentStock * item.price, 0);
  const lowStockPercent = ((lowStockValue / totalValue) * 100).toFixed(1);

  const monthlyConsumptionData = [
    { month: 'Jan', consumed: 4000, restocked: 5000 },
    { month: 'Feb', consumed: 3000, restocked: 4000 },
    { month: 'Mar', consumed: 5000, restocked: 3500 },
    { month: 'Apr', consumed: 4500, restocked: 4000 },
    { month: 'May', consumed: 4800, restocked: 4200 },
    { month: 'Jun', consumed: 5200, restocked: 4500 },
  ];

  return (
    <div className="space-y-6 bg-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-black">Reports & Analytics</h1>

        {user?.role === 'admin' && (
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="1year">Last Year</option>
            </select>
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-neutral-600">Total Inventory Value</p>
              <p className="text-2xl font-bold text-black">₹{totalValue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-neutral-600">At Risk Value</p>
              <p className="text-2xl font-bold text-black">₹{lowStockValue.toLocaleString()}</p>
              <p className="text-xs text-neutral-500">{lowStockPercent}% of total inventory</p>
            </div>
          </div>
        </div>

        {(user?.role === 'admin' || user?.role === 'staff') && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-neutral-600">Total Items</p>
                <p className="text-2xl font-bold text-black">{mockInventoryItems.length}</p>
              </div>
            </div>
          </div>
        )}

        {(user?.role === 'admin' || user?.role === 'pharmacist') && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-neutral-600">Monthly Consumption</p>
                <p className="text-2xl font-bold text-black">₹10K</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-black mb-6">Daily Usage Trends</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockUsageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="consumed" stroke="#3B82F6" strokeWidth={3} name="Consumed" />
                {(user?.role === 'admin' || user?.role === 'staff') && (
                  <Line type="monotone" dataKey="restocked" stroke="#10B981" strokeWidth={3} name="Restocked" />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-black mb-6">Inventory Status Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Admin Only */}
      {user?.role === 'admin' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-black mb-6">Value by Category</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Value']} />
                  <Bar dataKey="value" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-black mb-6">Supplier Orders vs Rating</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={supplierData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#10B981" name="Total Orders" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Tables */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-black mb-4">Top Items by Value</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Item</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Stock</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {mockInventoryItems
                  .sort((a, b) => b.currentStock * b.price - a.currentStock * a.price)
                  .slice(0, 5)
                  .map(item => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">{item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        ₹{(item.currentStock * item.price).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                        {item.currentStock} {item.unit}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-black mb-4">Items Requiring Attention</h3>
          <div className="space-y-4">
            {mockInventoryItems
              .filter(item => ['low', 'expired', 'out-of-stock'].includes(item.status))
              .slice(0, 5)
              .map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-black">{item.name}</p>
                    <p className="text-sm text-neutral-600">
                      {item.currentStock} {item.unit} • {item.status.replace('-', ' ')}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === 'expired'
                        ? 'bg-red-100 text-red-800'
                        : item.status === 'low'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-neutral-100 text-neutral-800'
                    }`}
                  >
                    {item.status.replace('-', ' ')}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
