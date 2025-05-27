import React, { useState, useEffect, useCallback } from 'react';
import { 
  Package, Clock, CheckCircle, XCircle, DollarSign, TrendingUp,
  Search, Filter, Download, Eye, Edit, MoreHorizontal, X,
  MapPin, CreditCard, Calendar, User, Phone, Mail, Truck, Save, RefreshCw, AlertCircle
} from 'lucide-react';
import Endpoint from '../../utils/endpoint';

const OrderPage = () => {
// State declarations
const [allOrders, setAllOrders] = useState([]);
const [filteredOrders, setFilteredOrders] = useState([]);
const [displayedOrders, setDisplayedOrders] = useState([]);
const [metrics, setMetrics] = useState({});
const [filters, setFilters] = useState({
  status: 'all',
  search: ''
});
const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage] = useState(5);
const [totalPages, setTotalPages] = useState(1);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [showDetailModal, setShowDetailModal] = useState(false);
const [showEditModal, setShowEditModal] = useState(false);
const [selectedOrder, setSelectedOrder] = useState(null);
const [editForm, setEditForm] = useState({
  status: '',
  paymentStatus: '',
  trackingNumber: '',
  internalNotes: ''
});

// Helper functions
const getStatusColor = (status) => {
  switch (status) {
    case 'completed': return 'bg-green-100 text-green-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'processing': return 'bg-blue-100 text-blue-800';
    case 'shipped': return 'bg-purple-100 text-purple-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getPaymentStatusColor = (status) => {
  switch (status) {
    case 'paid': return 'bg-green-100 text-green-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'failed': return 'bg-red-100 text-red-800';
    case 'refunded': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN'
  }).format(amount);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Event handlers
const handleViewOrder = (order) => {
  setSelectedOrder(order);
  setShowDetailModal(true);
};

const handleFilterChange = (name, value) => {
  setFilters(prev => ({
    ...prev,
    [name]: value
  }));
};

const handleEditOrder = (order) => {
  setSelectedOrder(order);
  setEditForm({
    status: order.status,
    paymentStatus: order.paymentStatus,
    trackingNumber: order.trackingNumber || '',
    internalNotes: order.internalNotes || ''
  });
  setShowEditModal(true);
};

const handleSaveChanges = async () => {
  try {
    await Endpoint.updateOrder(selectedOrder._id, editForm);
    await fetchData();
    setShowEditModal(false);
  } catch (err) {
    console.error('Error updating order:', err);
    setError('Failed to update order. Please try again.');
  }
};

// Data fetching and filtering logic
const fetchData = useCallback(async () => {
  try {
    setLoading(true);
    const response = await Endpoint.getOrders();
    
    // Assuming your original response structure:
    // response.data.data - array of orders
    // response.data.stats - metrics object
    setAllOrders(response.data.data);
    setFilteredOrders(response.data.data);
    setMetrics(response.data.stats || {});
    setTotalPages(Math.ceil(response.data.data.length / itemsPerPage));

  } catch (err) {
    setError(err.message);
    console.error('Error fetching orders:', err);
  } finally {
    setLoading(false);
  }
}, []);

useEffect(() => {
  fetchData();
}, [fetchData]);

useEffect(() => {
  let filtered = allOrders;
  if (filters.status !== 'all') {
    filtered = filtered.filter(order => order.status === filters.status);
  }
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filtered = filtered.filter(order =>
      order.orderNumber.toLowerCase().includes(searchTerm) ||
      order.user.name.toLowerCase().includes(searchTerm) ||
      order.user.email.toLowerCase().includes(searchTerm)
    );
  }
  setFilteredOrders(filtered);
  setTotalPages(Math.ceil(filtered.length / itemsPerPage));
  setCurrentPage(1);
}, [filters, allOrders]);

useEffect(() => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  setDisplayedOrders(filteredOrders.slice(startIndex, startIndex + itemsPerPage));
}, [currentPage, filteredOrders, itemsPerPage]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Management</h1>
        <p className="text-gray-600">Manage and track all customer orders</p>
      </div>

        {/* Metrics Cards */}
      <div className="mb-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {/* Total Orders */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {metrics?.totalOrders?.toLocaleString() || 0}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Pending Orders */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {metrics?.pendingOrders?.toLocaleString() || 0}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          {/* Processing Orders */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Processing Orders</p>
                <p className="text-2xl font-bold text-blue-600">
                  {metrics?.processingOrders?.toLocaleString() || 0}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <RefreshCw className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Shipped Orders */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Shipped Orders</p>
                <p className="text-2xl font-bold text-purple-600">
                  {metrics?.shippedOrders?.toLocaleString() || 0}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Truck className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {/* Completed Orders */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Orders</p>
                <p className="text-2xl font-bold text-green-600">
                  {metrics?.completedOrders?.toLocaleString() || 0}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Cancelled Orders */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cancelled Orders</p>
                <p className="text-2xl font-bold text-red-600">
                  {metrics?.cancelledOrders?.toLocaleString() || 0}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(metrics?.totalRevenue) || 0}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Average Order Value */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Order Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  {metrics?.averageOrderValue || 0}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search orders..."
              className="pl-10 pr-4 py-2 border rounded w-full"
              value={filters.search}
              onChange={e => handleFilterChange('search', e.target.value)}
            />
          </div>
          <select
            className="border rounded py-2 px-4"
            value={filters.status}
            onChange={e => handleFilterChange('status', e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
  <table className="w-full">
    <thead>
      <tr className="border-b border-gray-200 bg-gray-50">
        <th className="text-left py-3 px-6 font-medium text-gray-700">Order Number</th>
        <th className="text-left py-3 px-6 font-medium text-gray-700">Customer</th>
        <th className="text-left py-3 px-6 font-medium text-gray-700">Amount</th>
        <th className="text-left py-3 px-6 font-medium text-gray-700">Items</th>
        <th className="text-left py-3 px-6 font-medium text-gray-700">Status</th>
        <th className="text-left py-3 px-6 font-medium text-gray-700">Payment</th>
        <th className="text-left py-3 px-6 font-medium text-gray-700">Date</th>
        <th className="text-left py-3 px-6 font-medium text-gray-700">Actions</th>
      </tr>
    </thead>
    <tbody>
      {displayedOrders.map(order => (
        <tr key={order._id} className="border-t hover:bg-gray-50">
          {/* Order Number */}
          <td className="py-4 px-6 font-medium text-gray-900">{order.orderNumber}</td>
          
          {/* Customer */}
          <td className="py-4 px-6">
            <div className="font-medium text-gray-900">{order.user.name}</div>
            <div className="text-sm text-gray-500">{order.user.email}</div>
          </td>
          
          {/* Amount */}
          <td className="py-4 px-6 font-medium text-gray-900">
            {formatCurrency(order.totalAmount)}
          </td>
          
          {/* Items */}
          <td className="py-4 px-6 text-gray-900">
            {order.items.length} items
          </td>
          
          {/* Status */}
          <td className="py-4 px-6">
            <span className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
          </td>
          
          {/* Payment */}
          <td className="py-4 px-6">
            <span className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${getPaymentStatusColor(order.paymentStatus)}`}>
              {order.paymentStatus}
            </span>
          </td>
          
          {/* Date */}
          <td className="py-4 px-6 text-sm text-gray-900">
            {formatDate(order.createdAt)}
          </td>
          
          {/* Actions */}
          <td className="py-4 px-6">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleViewOrder(order)}
                className="text-gray-400 hover:text-blue-600"
              >
                <Eye className="h-4 w-4" />
              </button>
              <button 
                onClick={() => handleEditOrder(order)}
                className="text-gray-400 hover:text-green-600"
              >
                <Edit className="h-4 w-4" />
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

        {/* Pagination */}
        <div className="p-4 border-t flex justify-between items-center">
          <div>Showing {displayedOrders.length} of {filteredOrders.length} results</div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i+1}
                onClick={() => setCurrentPage(i+1)}
                className={`px-3 py-1 ${currentPage === i+1 ? 'bg-blue-500 text-white' : ''}`}
              >
                {i+1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Order Details - {selectedOrder.orderNumber}</h2>
              <button onClick={() => setShowDetailModal(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Items */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Order Items</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-4">Product ID</th>
                        <th className="text-left py-3 px-4">Quantity</th>
                        <th className="text-left py-3 px-4">Price</th>
                        <th className="text-left py-3 px-4">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item, index) => (
                        <tr key={index} className="border-t border-gray-200">
                          <td className="py-3 px-4">{item.product}</td>
                          <td className="py-3 px-4">{item.quantity}</td>
                          <td className="py-3 px-4">{formatCurrency(item.price)}</td>
                          <td className="py-3 px-4">{formatCurrency(item.price * item.quantity)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Shipping Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5" />
                    <div>
                      <p>{selectedOrder.shippingAddress.street}</p>
                      <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}</p>
                      <p>{selectedOrder.shippingAddress.country}</p>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Payment Details</h3>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span>{selectedOrder.paymentMethod}</span>
                  </div>
                  <div className="mt-2">
                    Status: <span className={`px-2 py-1 text-xs rounded-full ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                      {selectedOrder.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Customer Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{selectedOrder.user.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{selectedOrder.user.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {showEditModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Edit Order - {selectedOrder.orderNumber}</h2>
              <button onClick={() => setShowEditModal(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Order Status</label>
                <select
                  className="w-full p-2 border rounded-lg"
                  value={editForm.status}
                  onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Payment Status</label>
                <select
                  className="w-full p-2 border rounded-lg"
                  value={editForm.paymentStatus}
                  onChange={(e) => setEditForm({...editForm, paymentStatus: e.target.value})}
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              <div className="flex gap-4 justify-end">
                <button
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg"
                  onClick={handleSaveChanges}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderPage;