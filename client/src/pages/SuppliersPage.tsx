import React, { useState, useMemo } from 'react';
import { mockUsageData, mockInventoryItems, mockSuppliers } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,PieChart, Pie, Cell } from 'recharts';
import { 
  TrendingUp, Package, AlertTriangle, DollarSign, Calendar, Download, Filter, Star
} from 'lucide-react';

const ReportsPage: React.FC = () => {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState('7days');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSupplier, setSelectedSupplier] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filtered Inventory
  const filteredInventory = useMemo(() => {
    return mockInventoryItems.filter(item => 
      (selectedCategory === 'All' || item.category === selectedCategory) &&
      (selectedSupplier === 'All' || item.supplier === selectedSupplier) &&
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [selectedCategory, selectedSupplier, searchTerm]);

  // Category-wise inventory value
  const categoryData = filteredInventory.reduce((acc, item) => {
    const category = item.category;
    if (!acc[category]) acc[category] = { name: category, value: 0, count: 0 };
    acc[category].value += item.currentStock * item.price;
    acc[category].count += 1;
    return acc;
  }, {} as Record<string, { name: string; value: number; count: number }>);
  const categoryChartData = Object.values(categoryData);

  // Status-wise item count
  const statusData = filteredInventory.reduce((acc, item) => {
    const status = item.status;
    if (!acc[status]) acc[status] = 0;
    acc[status] += 1;
    return acc;
  }, {} as Record<string, number>);
  const statusChartData = Object.entries(statusData).map(([status, count]) => ({
    name: status.replace('-', ' '),
    value: count
  }));
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  // Supplier data
  const supplierData = mockSuppliers.map(supplier => ({
    name: supplier.name.split(' ')[0],
    orders: supplier.totalOrders,
    rating: supplier.rating
  }));

  // Key metrics
  const totalValue = filteredInventory.reduce((sum, item) => sum + (item.currentStock * item.price), 0);
  const lowStockValue = filteredInventory
    .filter(item => item.status === 'low' || item.status === 'out-of-stock')
    .reduce((sum, item) => sum + (item.currentStock * item.price), 0);
  const lowStockPercent = ((lowStockValue / totalValue) * 100).toFixed(1);

  const expiredItemsCount = filteredInventory.filter(item => item.status === 'expired').length;
  const avgItemValue = (totalValue / filteredInventory.length) || 0;
  const topSupplierRating = Math.max(...mockSuppliers.map(s => s.rating));

  // Pagination
  const paginatedInventory = filteredInventory.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="1year">Last Year</option>
          </select>
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option>All</option>
            {Array.from(new Set(mockInventoryItems.map(i => i.category))).map(c => <option key={c}>{c}</option>)}
          </select>
          <select
            value={selectedSupplier}
            onChange={e => setSelectedSupplier(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option>All</option>
            {mockSuppliers.map(s => <option key={s.id}>{s.name}</option>)}
          </select>
          {user?.role === 'admin' && (
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Download className="w-4 h-4 mr-2"/> Export
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200 flex items-center">
          <DollarSign className="w-6 h-6 text-blue-600" />
          <div className="ml-4">
            <p className="text-sm text-gray-600">Total Inventory Value</p>
            <p className="text-2xl font-bold text-gray-900">₹{totalValue.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200 flex items-center">
          <AlertTriangle className="w-6 h-6 text-yellow-600" />
          <div className="ml-4">
            <p className="text-sm text-gray-600">At Risk Value</p>
            <p className="text-2xl font-bold text-gray-900">₹{lowStockValue.toLocaleString()}</p>
            <p className="text-xs text-gray-500">{lowStockPercent}% of total inventory</p>
          </div>
        </div>
        {user?.role !== 'pharmacist' && (
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200 flex items-center">
            <Package className="w-6 h-6 text-green-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{filteredInventory.length}</p>
            </div>
          </div>
        )}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200 flex items-center">
          <Star className="w-6 h-6 text-purple-600" />
          <div className="ml-4">
            <p className="text-sm text-gray-600">Top Supplier Rating</p>
            <p className="text-2xl font-bold text-gray-900">{topSupplierRating} ★</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200 flex items-center">
          <AlertTriangle className="w-6 h-6 text-red-600" />
          <div className="ml-4">
            <p className="text-sm text-gray-600">Expired Items</p>
            <p className="text-2xl font-bold text-gray-900">{expiredItemsCount}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200 flex items-center">
          <TrendingUp className="w-6 h-6 text-pink-600" />
          <div className="ml-4">
            <p className="text-sm text-gray-600">Average Item Value</p>
            <p className="text-2xl font-bold text-gray-900">₹{avgItemValue.toFixed(0)}</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Usage Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockUsageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="consumed" stroke="#3B82F6" strokeWidth={3} name="Consumed"/>
              {user?.role !== 'pharmacist' && <Line type="monotone" dataKey="restocked" stroke="#10B981" strokeWidth={3} name="Restocked"/>}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={statusChartData} dataKey="value" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}>
                {statusChartData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category & Supplier Charts */}
      {user?.role === 'admin' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Value by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={value => [`₹${value.toLocaleString()}`, 'Value']} />
                <Bar dataKey="value" fill="#3B82F6"/>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Supplier Orders vs Rating</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={supplierData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#10B981" name="Orders"/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Searchable & Paginated Inventory Table */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory Items</h3>
        <input 
          type="text" 
          placeholder="Search by name..." 
          value={searchTerm} 
          onChange={e => setSearchTerm(e.target.value)}
          className="px-3 py-2 mb-4 border rounded w-full focus:ring-2 focus:ring-blue-500"
        />
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedInventory.map(item => (
                <tr key={item.id}>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.supplier}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">₹{(item.currentStock*item.price).toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.currentStock} {item.unit}</td>
                  <td className={`px-6 py-4 text-xs font-medium rounded-full ${
                    item.status==='expired'?'bg-red-100 text-red-800':
                    item.status==='low'?'bg-yellow-100 text-yellow-800':
                    'bg-gray-100 text-gray-800'
                  }`}>{item.status.replace('-',' ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="mt-4 flex justify-end space-x-2">
          {Array.from({length: Math.ceil(filteredInventory.length / itemsPerPage)}, (_, i) => (
            <button 
              key={i} 
              onClick={() => setCurrentPage(i+1)}
              className={`px-3 py-1 rounded ${currentPage===i+1?'bg-blue-600 text-white':'bg-gray-200 text-gray-700'}`}
            >
              {i+1}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ReportsPage;
