import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockInventoryItems } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { 
  Search, Plus, Edit, Trash2, Package, AlertTriangle,
  Calendar, MapPin, DollarSign, Download
} from 'lucide-react';

const InventoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const itemsPerPage = 6;

  // Role-based permissions
  const canAdd = user?.role === 'admin';
  const canEdit = user?.role === 'admin' || user?.role === 'pharmacist';
  const canDelete = user?.role === 'admin';
  const canExport = user?.role === 'admin';

  // Filtered & paginated inventory
  const filteredItems = useMemo(() => {
    return mockInventoryItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [searchTerm, selectedCategory, selectedStatus]);

  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalValue = filteredItems.reduce((sum, item) => sum + item.currentStock * item.price, 0);
  const lowStockCount = filteredItems.filter(i => i.status === 'low').length;
  const expiredCount = filteredItems.filter(i => i.status === 'expired').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'low': return 'bg-yellow-100 text-yellow-800';
      case 'out-of-stock': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'medicine': return '💊';
      case 'equipment': return '🔬';
      case 'supplies': return '🧪';
      default: return '📦';
    }
  };

  const toggleSelectItem = (id: number) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">

      {/* Header + KPIs */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
        <div className="flex flex-wrap gap-4 items-center">
         {canAdd && (
  <button
    onClick={() => navigate("/inventory/add")}
    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
  >
    <Plus className="w-5 h-5 mr-2"/> Add Item
  </button>
)}
          {canExport && selectedItems.length > 0 && (
            <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Download className="w-5 h-5 mr-2"/> Export Selected
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border flex items-center">
          <Package className="w-6 h-6 text-blue-600"/>
          <div className="ml-3">
            <p className="text-sm text-gray-600">Total Items</p>
            <p className="text-xl font-bold text-gray-900">{filteredItems.length}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border flex items-center">
          <DollarSign className="w-6 h-6 text-green-600"/>
          <div className="ml-3">
            <p className="text-sm text-gray-600">Total Value</p>
            <p className="text-xl font-bold text-gray-900">₹{totalValue.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border flex items-center">
          <AlertTriangle className="w-6 h-6 text-yellow-600"/>
          <div className="ml-3">
            <p className="text-sm text-gray-600">Low Stock</p>
            <p className="text-xl font-bold text-gray-900">{lowStockCount}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border flex items-center">
          <AlertTriangle className="w-6 h-6 text-red-600"/>
          <div className="ml-3">
            <p className="text-sm text-gray-600">Expired</p>
            <p className="text-xl font-bold text-gray-900">{expiredCount}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow border flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"/>
          <input
            type="text"
            placeholder="Search items or suppliers..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Categories</option>
          <option value="medicine">Medicine</option>
          <option value="equipment">Equipment</option>
          <option value="supplies">Supplies</option>
        </select>

        <select
          value={selectedStatus}
          onChange={e => setSelectedStatus(e.target.value)}
          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="available">Available</option>
          <option value="low">Low Stock</option>
          <option value="out-of-stock">Out of Stock</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {paginatedItems.map(item => (
          <div key={item.id} className="bg-white p-6 rounded-lg shadow border hover:shadow-md transition relative">
            
            {/* Bulk Select */}
            {canDelete && (
              <input 
                type="checkbox"
                checked={selectedItems.includes(item.id)}
                onChange={() => toggleSelectItem(item.id)}
                className="absolute top-3 right-3 w-4 h-4"
              />
            )}

            <div className="flex justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getCategoryIcon(item.category)}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-600 capitalize">{item.category}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                {item.status.replace('-', ' ')}
              </span>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <div className="flex items-center"><Package className="w-4 h-4 mr-2"/> Stock</div>
                <span>{item.currentStock} {item.unit}</span>
              </div>
              {item.status === 'low' && (
                <div className="flex items-center text-yellow-600">
                  <AlertTriangle className="w-4 h-4 mr-2"/> Below minimum ({item.minStock} {item.unit})
                </div>
              )}
              {item.expiryDate && (
                <div className="flex justify-between">
                  <div className="flex items-center"><Calendar className="w-4 h-4 mr-2"/> Expiry</div>
                  <span>{new Date(item.expiryDate).toLocaleDateString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <div className="flex items-center"><MapPin className="w-4 h-4 mr-2"/> Location</div>
                <span>{item.location}</span>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center"><DollarSign className="w-4 h-4 mr-2"/> Unit Price</div>
                <span className="font-medium">${item.price.toFixed(2)}</span>
              </div>
            </div>

           {/* Role-based Actions */}
{(canEdit || canDelete) && (
  <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-200">
    {canEdit && (
      <button
        onClick={() => navigate("/inventory/add", { state: { item } })}
        className="flex-1 flex items-center justify-center px-3 py-2 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50"
      >
        <Edit className="w-4 h-4 mr-2"/>
        {user?.role === 'pharmacist' ? 'Update Stock' : 'Edit'}
      </button>
    )}
    {canDelete && (
      <button className="flex items-center justify-center px-3 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50">
        <Trash2 className="w-4 h-4"/>
      </button>
    )}
  </div>
)}

          </div>
        ))}
      </div>

      {/* No Items Found */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400"/>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No items found</h3>
          <p className="mt-1 text-sm text-gray-500">Adjust search or filters.</p>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-end gap-2 mt-6">
        {Array.from({length: Math.ceil(filteredItems.length / itemsPerPage)}, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default InventoryPage;
