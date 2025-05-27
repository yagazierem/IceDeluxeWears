import React, { useState, useEffect, useRef } from 'react';
import { FiSearch, FiFilter, FiChevronDown, FiChevronUp, FiEdit, FiTrash2, FiX, FiCheckCircle, FiAlertCircle, FiUser } from 'react-icons/fi';
import Endpoint from '../../utils/endpoint';

const CustomerTable = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [customersPerPage] = useState(10);
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    status: ''
  });

  const modalRef = useRef(null);

  // Fetch customers from API
  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const response = await Endpoint.getCustomers();
        if (response.data && response.data.success) {
          const transformed = response.data.data.map(customer => ({
            id: customer._id,
            name: customer.name,
            email: customer.email,
            orders: customer.orderCount,
            totalSpent: customer.totalSpent,
            status: customer.status,
            createdAt: customer.createdAt,
            updatedAt: customer.updatedAt
          }));
          setCustomers(transformed);
        }
      } catch (error) {
        console.error('Admin Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);
  // Close modals on ESC press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeModals();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Data processing
  const filteredData = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  // Pagination
  const indexOfLast = currentPage * customersPerPage;
  const indexOfFirst = indexOfLast - customersPerPage;
  const currentCustomers = sortedData.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedData.length / customersPerPage);

  // Admin actions
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const openEditModal = (customer) => {
    setSelectedCustomer(customer);
    setEditFormData({
      name: customer.name,
      email: customer.email,
      status: customer.status
    });
    setEditModalOpen(true);
  };

  const openDeleteModal = (customer) => {
    setSelectedCustomer(customer);
    setDeleteModalOpen(true);
  };

  const closeModals = () => {
    setEditModalOpen(false);
    setDeleteModalOpen(false);
    setSelectedCustomer(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      // Only send status to the endpoint
      await Endpoint.updateCustomerStatus(selectedCustomer.id, {
        status: editFormData.status
      });
      
      // Update local state with new status
      setCustomers(prev => prev.map(c => 
        c.id === selectedCustomer.id ? { ...c, status: editFormData.status } : c
      ));
      
      closeModals();
    } catch (error) {
      console.error('Status Update Error:', error);
      // Add error notification here
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      // Admin delete endpoint call
      await Endpoint.deleteCustomer(selectedCustomer.id);
      setCustomers(prev => prev.filter(c => c.id !== selectedCustomer.id));
      closeModals();
    } catch (error) {
      console.error('Admin Delete Error:', error);
    }
  };

  // UI components
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      active: { color: 'green', text: 'Active' },
      inactive: { color: 'red', text: 'Inactive' },
      pending: { color: 'yellow', text: 'Pending' }
    };

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${statusConfig[status].color}-100 text-${statusConfig[status].color}-800`}>
        {statusConfig[status].text}
      </span>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Admin Controls */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <FiSearch className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search customers..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Admin Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {['Customer', 'Contact', 'Orders', 'Total Spent', 'Status', 'Joined', 'Actions'].map((header) => (
                <th
                  key={header}
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-700"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center">
                  <div className="animate-pulse flex justify-center items-center h-32">
                    <div className="w-32 h-4 bg-gray-200 rounded"></div>
                  </div>
                </td>
              </tr>
            ) : currentCustomers.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  No customers found
                </td>
              </tr>
            ) : currentCustomers.map(customer => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center">
                      <FiUser className="text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-gray-500">ID: {customer.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">{customer.email}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                    {customer.orders}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium">
                  ${customer.totalSpent.toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={customer.status} />
                </td>
                <td className="px-6 py-4">
                  {new Date(customer.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-3">
                    <button
                      onClick={() => openEditModal(customer)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FiEdit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(customer)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Admin Pagination */}
      <div className="mt-6 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Showing {indexOfFirst + 1} to {Math.min(indexOfLast, sortedData.length)} of {sortedData.length} customers
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i+1}
              onClick={() => setCurrentPage(i+1)}
              className={`px-4 py-2 border rounded-md ${currentPage === i+1 ? 'bg-blue-500 text-white' : ''}`}
            >
              {i+1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Admin Edit Modal */}
{editModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
    <div ref={modalRef} className="bg-white rounded-xl w-full max-w-md">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="text-lg font-semibold">Update Customer Status</h3>
        <button onClick={closeModals} className="text-gray-500 hover:text-gray-700">
          <FiX className="w-6 h-6" />
        </button>
      </div>
      <form onSubmit={handleEditSubmit} className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Full Name</label>
          <input
            name="name"
            value={editFormData.name}
            disabled
            className="w-full px-3 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Email Address</label>
          <input
            type="email"
            name="email"
            value={editFormData.email}
            disabled
            className="w-full px-3 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Account Status</label>
          <select
            name="status"
            value={editFormData.status}
            onChange={(e) => setEditFormData(prev => ({ ...prev, status: e.target.value }))}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending Verification</option>
          </select>
        </div>
        <div className="pt-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={closeModals}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Update Status
          </button>
        </div>
      </form>
    </div>
  </div>
)}
      {/* Admin Delete Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div ref={modalRef} className="bg-white rounded-xl w-full max-w-md">
            <div className="p-6 text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <FiAlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Confirm Deletion</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to permanently delete {selectedCustomer?.name}'s account?
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={closeModals}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete Permanently
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerTable;