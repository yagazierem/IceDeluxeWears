// src/components/admin/AdminLayout.jsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, Package, ShoppingCart, Users, BarChart2, 
  Settings, Tag, Grid, FileText, LogOut, Menu, X 
} from 'lucide-react';
import { Outlet } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActiveRoute = (route) => {
    return location.pathname.startsWith(`/admin/${route}`);
  };
  
  const handleLogout = () => {
    // Clear admin auth token
    localStorage.removeItem('adminToken');
    // Redirect to login
    navigate('/admin/login');
  };
  
  const navigation = [
    { name: 'Dashboard', icon: Home, path: 'dashboard' },
    { name: 'Products', icon: Package, path: 'products' },
    { name: 'Orders', icon: ShoppingCart, path: 'order' },
    { name: 'Shipping', icon: Tag, path: 'shipping' },
    { name: 'Customers', icon: Users, path: 'customer' },
    { name: 'Create User', icon: Users, path: 'createUser' },
    { name: 'Change Password', icon: Settings, path: 'changePassword' },
    // { name: 'Reports', icon: BarChart2, path: 'reports' },
    // { name: 'Settings', icon: Settings, path: 'settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 ">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b flex items-center justify-between px-4 h-16">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 p-2"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <span className="text-xl font-semibold">Admin</span>
        <div className="w-10"></div> {/* Empty div for flex spacing */}
      </div>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 z-30 h-full bg-gray-900 text-white w-64 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex items-center justify-center h-16 border-b border-gray-800">
          <h2 className="text-xl font-bold">Store Admin</h2>
        </div>
        
        <nav className="mt-5 px-2">
          <div className="space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={`/admin/${item.path}`}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                  isActiveRoute(item.path)
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
        
        <div className="absolute bottom-0 w-full px-2 pb-5">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white rounded-md"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`lg:pl-64 ${sidebarOpen ? 'overflow-hidden h-screen' : ''}`}>
        {/* Top Bar */}
        <header className="hidden lg:flex sticky top-0 bg-white shadow z-10 h-16 items-center px-6">
          <div className="flex-1"></div>
            <div className="flex items-center space-x-4">
                <div className="relative">
                    <div className="flex items-center">
                        <img 
                            className="h-10 w-10 rounded-full border-2 border-gray-200" 
                        //   src="/api/placeholder/40/40" 
                        alt="Admin avatar" 
                        />
                        <span className="ml-2 text-sm font-medium text-gray-700">Admin User</span>
                    </div>
                </div>
                <button
                onClick={handleLogout}
                className="p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                <LogOut size={20} />
                </button>
            </div>
        </header>

        {/* Page content */}
        <main className="pt-16 lg:pt-0 p-6">
          <Outlet />   
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;