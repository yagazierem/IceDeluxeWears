// src/pages/admin/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Package, ShoppingCart, Users } from 'lucide-react';
import Endpoint from '../../utils/endpoint';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await Endpoint.getDashboardData();
        console.log(response?.data?.data, "responseee")
        
        // Check if response has the expected structure
        if (response.data && response.data.success && response.data.data) {
          setDashboardData(response?.data?.data);
        } else {
          throw new Error('Unexpected API response format');
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    // Call the function when component mounts
    fetchDashboardData();
  }, []);

  // Sample data (fallback if API data is not available)
  const sampleSalesData = [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 5000 },
    { name: 'Apr', sales: 2780 },
    { name: 'May', sales: 1890 },
    { name: 'Jun', sales: 2390 },
    { name: 'Jul', sales: 3490 },
  ];

  const sampleTopProducts = [
    { name: 'Premium T-Shirt', value: 400 },
    { name: 'Designer Jeans', value: 300 },
    { name: 'Leather Jacket', value: 200 },
    { name: 'Running Shoes', value: 150 },
    { name: 'Casual Watch', value: 100 },
  ];

  const sampleRecentOrders = [
    { id: '#ORD-001', customer: 'John Doe', date: '2023-05-04', total: 129.99, status: 'Completed' },
    { id: '#ORD-002', customer: 'Jane Smith', date: '2023-05-04', total: 79.99, status: 'Processing' },
    { id: '#ORD-003', customer: 'Robert Johnson', date: '2023-05-03', total: 249.99, status: 'Shipped' },
    { id: '#ORD-004', customer: 'Emily Davis', date: '2023-05-03', total: 59.99, status: 'Pending' },
    { id: '#ORD-005', customer: 'Michael Brown', date: '2023-05-02', total: 199.99, status: 'Completed' },
  ];

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Transform API data into the format expected by the UI
  // If no API data is available, use sample data
  const transformData = () => {
    if (!dashboardData) {
      return {
        revenueStats: { total: 10245.70, change: 12.5 },
        orderStats: { total: 156, change: 8.2 },
        productStats: { total: 89, change: 3.7 },
        customerStats: { total: 562, change: 15.3 },
        salesData: sampleSalesData,
        topProducts: sampleTopProducts,
        recentOrders: sampleRecentOrders,
      };
    }

    // Transform API data
    return {
      revenueStats: { 
        total: dashboardData.overview.totalRevenue, 
        // If no growth data is available, use 0 or a default value
        change: dashboardData.orderAnalytics?.salesGrowth || 0
      },
      orderStats: { 
        total: dashboardData.overview.totalOrders, 
        // You might need to calculate this if not provided by API
        change: 0
      },
      productStats: { 
        total: dashboardData.overview.totalProducts, 
        change: 0
      },
      customerStats: { 
        total: dashboardData.overview.totalUsers, 
        change: dashboardData.userAnalytics.userGrowth
      },
      // Transform newUsers data for the sales chart
      salesData: dashboardData.userAnalytics.newUsers.map(item => ({
        name: new Date(item._id).toLocaleDateString('en-US', { month: 'short' }),
        sales: item.count * 100 // Just a placeholder calculation for visualization
      })) || sampleSalesData,
      // No direct equivalent in API response, use sample data or empty array
      topProducts: dashboardData.inventoryAnalytics?.stockSummary?.map(item => ({
        name: item.productName || item.category || 'Unknown',
        value: item.count || item.value || 0
      })) || sampleTopProducts,
      // Map recentOrders if available
      recentOrders: dashboardData.orderAnalytics.recentOrders.map(order => ({
        id: order.orderId || '#ORD-???',
        customer: order.customerName || 'Unknown Customer',
        date: order.date || new Date().toISOString(),
        total: order.total || 0,
        status: order.status || 'Pending'
      })) || sampleRecentOrders
    };
  };

  const displayData = transformData();

  // Helper function to format currency
  const formatCurrency = (amt) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amt);

  const StatCard = ({ title, value, change, icon: Icon }) => (
    <div className="bg-white rounded-lg shadow p-5">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <h3 className="text-2xl font-bold mt-2">{value}</h3>
        </div>
        <div className="p-3 bg-blue-100 rounded-lg">
          <Icon size={24} className="text-blue-600" />
        </div>
      </div>
      <div className="mt-4 flex items-center">
        {change >= 0 ? (
          <TrendingUp size={18} className="text-green-500 mr-1" />
        ) : (
          <TrendingDown size={18} className="text-red-500 mr-1" />
        )}
        <span className={change >= 0 ? 'text-green-500' : 'text-red-500'}>
          {Math.abs(change)}% {change >= 0 ? 'increase' : 'decrease'}
        </span>
        <span className="text-gray-500 ml-1 text-sm">from last month</span>
      </div>
    </div>
  );

  // Show loading state
  if (loading && !dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !dashboardData) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={() => {
            setLoading(true);
            Endpoint.getDashboardData()
              .then(response => {
                if (response.data && response.data.success && response.data.data) {
                  setDashboardData(response.data.data);
                } else {
                  throw new Error('Unexpected API response format');
                }
                setError(null);
              })
              .catch(err => {
                console.error('Error refreshing dashboard data:', err);
                setError('Failed to refresh dashboard data. Please try again.');
              })
              .finally(() => {
                setLoading(false);
              });
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's an overview of your store.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(displayData.revenueStats.total)}
          change={displayData.revenueStats.change}
          icon={DollarSign}
        />
        <StatCard
          title="Total Orders"
          value={displayData.orderStats.total}
          change={displayData.orderStats.change}
          icon={ShoppingCart}
        />
        <StatCard
          title="Total Products"
          value={displayData.productStats.total}
          change={displayData.productStats.change}
          icon={Package}
        />
        <StatCard
          title="Total Customers"
          value={displayData.customerStats.total}
          change={displayData.customerStats.change}
          icon={Users}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* User Growth Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">User Growth</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={displayData.salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(v) => [v, 'New Users']} />
                <Legend />
                <Line type="monotone" dataKey="sales" name="New Users" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inventory Distribution Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Inventory Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={displayData.topProducts}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {displayData.topProducts.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [v, 'Units']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Recent Orders</h2>
        </div>
        {displayData.recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Order ID', 'Customer', 'Date', 'Total', 'Status'].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayData.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {order.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === 'Completed'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'Processing'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'Shipped'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            No orders yet. Orders will appear here once customers start making purchases.
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;