import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Package, Users, ShoppingCart, BarChart3, Plus } from 'lucide-react';
import AdminOverview from '../components/admin/AdminOverview';
import ManageProducts from '../components/admin/ManageProducts';
import AllOrders from '../components/admin/AllOrders';
import AddProduct from '../components/admin/AddProduct';
import ProductDetails from '../components/admin/ProductDetails';

const AdminDashboard = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const sidebarItems = [
    { path: '/admin', label: 'Dashboard', icon: BarChart3 },
    { path: '/admin/products', label: 'Manage Products', icon: Package },
    { path: '/admin/products/add', label: 'Add Product', icon: Plus },
    { path: '/admin/orders', label: 'All Orders', icon: ShoppingCart },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900">Admin Panel</h2>
          </div>
          <nav className="mt-6">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path || 
                (item.path === '/admin' && currentPath === '/admin');
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <Routes>
            <Route index element={<AdminOverview />} />
            <Route path="products" element={<ManageProducts />} />
            <Route path="products/add" element={<AddProduct />} />
            <Route path="products/:id" element={<ProductDetails />} />
            <Route path="orders" element={<AllOrders />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;