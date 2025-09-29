import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Package,
  Users,
  BarChart3,
  Menu,
  X,
  LogOut,
  AlertTriangle,
  ClipboardList,
  Settings,
  Bell,
  UserCog,
  Building2,
} from 'lucide-react';
import { FaHandHoldingMedical } from "react-icons/fa";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // 🔹 Role-based navigation
  const navigationByRole: Record<string, any[]> = {
    admin: [
      { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { path: '/inventory', icon: Package, label: 'Inventory' },
      { path: '/suppliers', icon: Users, label: 'Suppliers' },
      { path: '/requests', icon: ClipboardList, label: 'Requests' },
      { path: '/expiry-tracker', icon: AlertTriangle, label: 'Expiry Tracker' },
      { path: '/reports', icon: BarChart3, label: 'Reports' },
      // { path: '/users', icon: UserCog, label: 'User Management' },
      // { path: '/branches', icon: Building2, label: 'Hospital Branches' },
    ],
    staff: [
      { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { path: '/inventory', icon: Package, label: 'Inventory' },
      { path: '/requests', icon: ClipboardList, label: 'My Requests' },
      { path: '/suppliers', icon: Users, label: 'Suppliers (View)' },
    ],
    pharmacist: [
      { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { path: '/inventory', icon: Package, label: 'Inventory' },
      { path: '/expiry-tracker', icon: AlertTriangle, label: 'Expiry Tracker' },
      { path: '/requests', icon: ClipboardList, label: 'Approve Requests' },
      { path: '/reports', icon: BarChart3, label: 'Reports' },
    ],
  };

  const navigationItems = navigationByRole[user?.role] || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform 
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        transition-transform duration-300 lg:translate-x-0`}
      >
        <div className="flex items-center justify-center h-16 bg-blue-600">
          <FaHandHoldingMedical className="w-8 h-8 text-white mr-2" />
          <span className="text-xl font-bold text-white">MedInventory</span>
        </div>

        <nav className="mt-8">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                    : ''
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
              {user?.name?.charAt(0)}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <h1 className="ml-4 text-2xl font-semibold text-gray-900 lg:ml-0">
                {navigationItems.find((item) => item.path === location.pathname)?.label || 'Dashboard'}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-100 relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
