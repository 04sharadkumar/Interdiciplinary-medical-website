import React, { useState } from 'react';
import { mockInventoryItems } from '../data/mockData';
import { 
  Calendar, 
  AlertTriangle, 
  Clock, 
  Package,
  Search,
  Download,
  Mail
} from 'lucide-react';

const ExpiryTrackerPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');

  const today = new Date();
  
  const getExpiryStatus = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { status: 'expired', days: Math.abs(diffDays), color: 'red' };
    if (diffDays <= 7) return { status: 'critical', days: diffDays, color: 'red' };
    if (diffDays <= 30) return { status: 'warning', days: diffDays, color: 'yellow' };
    if (diffDays <= 90) return { status: 'caution', days: diffDays, color: 'blue' };
    return { status: 'safe', days: diffDays, color: 'green' };
  };

  const itemsWithExpiry = mockInventoryItems
    .filter(item => item.expiryDate)
    .map(item => ({
      ...item,
      expiryInfo: getExpiryStatus(item.expiryDate!)
    }));

  const filteredItems = itemsWithExpiry.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    
    let matchesTime = true;
    if (timeFilter === 'expired') matchesTime = item.expiryInfo.status === 'expired';
    else if (timeFilter === 'critical') matchesTime = item.expiryInfo.status === 'critical';
    else if (timeFilter === 'warning') matchesTime = item.expiryInfo.status === 'warning';
    else if (timeFilter === 'caution') matchesTime = item.expiryInfo.status === 'caution';
    
    return matchesSearch && matchesCategory && matchesTime;
  });

  const stats = {
    expired: itemsWithExpiry.filter(item => item.expiryInfo.status === 'expired').length,
    critical: itemsWithExpiry.filter(item => item.expiryInfo.status === 'critical').length,
    warning: itemsWithExpiry.filter(item => item.expiryInfo.status === 'warning').length,
    total: itemsWithExpiry.length
  };

  const getStatusBadge = (status: string, days: number) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    
    switch (status) {
      case 'expired':
        return (
          <span className={`${baseClasses} bg-red-100 text-red-800`}>
            Expired {days} days ago
          </span>
        );
      case 'critical':
        return (
          <span className={`${baseClasses} bg-red-100 text-red-800`}>
            {days} days left
          </span>
        );
      case 'warning':
        return (
          <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
            {days} days left
          </span>
        );
      case 'caution':
        return (
          <span className={`${baseClasses} bg-blue-100 text-blue-800`}>
            {days} days left
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            {days} days left
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expiry Tracker</h1>
          <p className="text-gray-600 mt-1">Monitor medicine and supply expiration dates</p>
        </div>
        <div className="flex space-x-2 mt-4 sm:mt-0">
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Mail className="w-4 h-4 mr-2" />
            Send Alerts
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Expired</p>
              <p className="text-xl font-semibold text-gray-900">{stats.expired}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <Clock className="w-5 h-5 text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Critical (≤7 days)</p>
              <p className="text-xl font-semibold text-gray-900">{stats.critical}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Calendar className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Warning (≤30 days)</p>
              <p className="text-xl font-semibold text-gray-900">{stats.warning}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-xl font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
          >
            <option value="all">All Categories</option>
            <option value="medicine">Medicine</option>
            <option value="equipment">Equipment</option>
            <option value="supplies">Supplies</option>
          </select>

          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
          >
            <option value="all">All Items</option>
            <option value="expired">Expired</option>
            <option value="critical">Critical (≤7 days)</option>
            <option value="warning">Warning (≤30 days)</option>
            <option value="caution">Caution (≤90 days)</option>
          </select>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    <div className="text-sm text-gray-500">{item.supplier}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full capitalize">{item.category}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.currentStock} {item.unit}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.expiryDate && new Date(item.expiryDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(item.expiryInfo.status, item.expiryInfo.days)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.batchNumber || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No items found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default ExpiryTrackerPage;
