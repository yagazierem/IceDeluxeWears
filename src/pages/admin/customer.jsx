import React, { useState, useEffect, useRef } from 'react';
import { FiSearch, FiFilter, FiChevronDown, FiChevronUp, FiMoreVertical, FiEye, FiEdit, FiTrash2, FiX, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const CustomerTable = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [customersPerPage] = useState(10);
  const [sortField, setSortField] = useState('registrationDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [statusFilter, setStatusFilter] = useState('all');
  const [openActionMenu, setOpenActionMenu] = useState(null);
  
  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: ''
  });
  
  const actionMenuRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    // Fetch customers data from your API
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        // Replace with your actual API endpoint
        const response = await fetch('/api/customers');
        const data = await response.json();
        setCustomers(data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // Close action menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target)) {
        setOpenActionMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close modal when pressing escape key
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        closeAllModals();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, []);

  // Example data structure for customers
  const mockCustomers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', orders: 5, totalSpent: 567.89, status: 'active', registrationDate: '2023-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '234-567-8901', orders: 12, totalSpent: 1204.50, status: 'active', registrationDate: '2023-03-22' },
    { id: 3, name: 'Robert Johnson', email: 'robert@example.com', phone: '345-678-9012', orders: 2, totalSpent: 129.99, status: 'inactive', registrationDate: '2023-05-10' },
    { id: 4, name: 'Emily Davis', email: 'emily@example.com', phone: '456-789-0123', orders: 8, totalSpent: 789.33, status: 'active', registrationDate: '2023-02-05' },
    { id: 5, name: 'Michael Wilson', email: 'michael@example.com', phone: '567-890-1234', orders: 0, totalSpent: 0, status: 'pending', registrationDate: '2023-06-18' },
  ];

  // Filter customers based on search term and status filter
  const filteredCustomers = (customers.length ? customers : mockCustomers).filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
      customer.id.toString().includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Sort customers
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Calculate pagination
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = sortedCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);
  const totalPages = Math.ceil(sortedCustomers.length / customersPerPage);

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Render status badge with appropriate color
  const renderStatusBadge = (status) => {
    let colorClass = '';
    
    switch(status) {
      case 'active':
        colorClass = 'bg-green-100 text-green-800';
        break;
      case 'inactive':
        colorClass = 'bg-red-100 text-red-800';
        break;
      case 'pending':
        colorClass = 'bg-yellow-100 text-yellow-800';
        break;
      default:
        colorClass = 'bg-gray-100 text-gray-800';
    }
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorClass}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Toggle action menu
  const toggleActionMenu = (customerId) => {
    setOpenActionMenu(openActionMenu === customerId ? null : customerId);
  };

  // Close all modals
  const closeAllModals = () => {
    setViewModalOpen(false);
    setEditModalOpen(false);
    setDeleteModalOpen(false);
    setSelectedCustomer(null);
  };

  // Handle view details
  const handleViewDetails = (customer) => {
    setSelectedCustomer(customer);
    setViewModalOpen(true);
  };

  // Handle edit customer
  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer);
    setEditFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      status: customer.status
    });
    setEditModalOpen(true);
  };

  // Handle delete customer
  const handleDeleteCustomer = (customer) => {
    setSelectedCustomer(customer);
    setDeleteModalOpen(true);
  };

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  // Handle form submit
  const handleEditSubmit = (e) => {
    e.preventDefault();
    console.log('Updated customer data:', { ...selectedCustomer, ...editFormData });
    // Implement API call to update customer
    
    // Close modal after successful edit
    closeAllModals();
    
    // Show success toast (you would implement a toast system)
    console.log('Customer updated successfully');
  };

  // Handle delete confirm
  const handleDeleteConfirm = () => {
    console.log(`Delete customer ${selectedCustomer.id}`);
    // Implement delete functionality
    
    // Close modal after successful delete
    closeAllModals();
    
    // Show success toast (you would implement a toast system)
    console.log('Customer deleted successfully');
  };

  // Modal backdrop click handler
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      closeAllModals();
    }
  };

  return (
    <div className="w-full mt-5">
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search customers..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
          
          <button className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 bg-white hover:bg-gray-50">
            <FiFilter className="h-5 w-5 text-gray-500" />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('id')}
              >
                <div className="flex items-center">
                  ID
                  {sortField === 'id' ? (
                    sortDirection === 'asc' ? (
                      <FiChevronUp className="ml-1 w-4 h-4" />
                    ) : (
                      <FiChevronDown className="ml-1 w-4 h-4" />
                    )
                  ) : null}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  Customer
                  {sortField === 'name' ? (
                    sortDirection === 'asc' ? (
                      <FiChevronUp className="ml-1 w-4 h-4" />
                    ) : (
                      <FiChevronDown className="ml-1 w-4 h-4" />
                    )
                  ) : null}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('email')}
              >
                <div className="flex items-center">
                  Email
                  {sortField === 'email' ? (
                    sortDirection === 'asc' ? (
                      <FiChevronUp className="ml-1 w-4 h-4" />
                    ) : (
                      <FiChevronDown className="ml-1 w-4 h-4" />
                    )
                  ) : null}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('orders')}
              >
                <div className="flex items-center">
                  Orders
                  {sortField === 'orders' ? (
                    sortDirection === 'asc' ? (
                      <FiChevronUp className="ml-1 w-4 h-4" />
                    ) : (
                      <FiChevronDown className="ml-1 w-4 h-4" />
                    )
                  ) : null}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('totalSpent')}
              >
                <div className="flex items-center">
                  Total Spent
                  {sortField === 'totalSpent' ? (
                    sortDirection === 'asc' ? (
                      <FiChevronUp className="ml-1 w-4 h-4" />
                    ) : (
                      <FiChevronDown className="ml-1 w-4 h-4" />
                    )
                  ) : null}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center">
                  Status
                  {sortField === 'status' ? (
                    sortDirection === 'asc' ? (
                      <FiChevronUp className="ml-1 w-4 h-4" />
                    ) : (
                      <FiChevronDown className="ml-1 w-4 h-4" />
                    )
                  ) : null}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('registrationDate')}
              >
                <div className="flex items-center">
                  Date Joined
                  {sortField === 'registrationDate' ? (
                    sortDirection === 'asc' ? (
                      <FiChevronUp className="ml-1 w-4 h-4" />
                    ) : (
                      <FiChevronDown className="ml-1 w-4 h-4" />
                    )
                  ) : null}
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                  Loading customers...
                </td>
              </tr>
            ) : currentCustomers.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                  No customers found
                </td>
              </tr>
            ) : (
              currentCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    #{customer.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-medium">
                          {customer.name.split(' ').map(name => name[0]).join('')}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                        <div className="text-sm text-gray-500">{customer.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.orders}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${customer.totalSpent.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderStatusBadge(customer.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(customer.registrationDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                    <div className="relative inline-block text-left" ref={actionMenuRef}>
                      <div className="flex justify-center space-x-2">
                       
                        <button
                          onClick={() => handleEditCustomer(customer)}
                          className="text-green-600 hover:text-green-800 focus:outline-none transition duration-150 ease-in-out"
                          title="Edit Customer"
                        >
                          <FiEdit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCustomer(customer)}
                          className="text-red-600 hover:text-red-800 focus:outline-none transition duration-150 ease-in-out"
                          title="Delete Customer"
                        >
                          <FiTrash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && sortedCustomers.length > 0 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{indexOfFirstCustomer + 1}</span> to{" "}
            <span className="font-medium">
              {Math.min(indexOfLastCustomer, sortedCustomers.length)}
            </span>{" "}
            of <span className="font-medium">{sortedCustomers.length}</span> customers
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Logic to show current page in the middle when possible
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md ${
                    currentPage === pageNum
                      ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                      : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* View Customer Modal */}
      {viewModalOpen && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={handleBackdropClick}>
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto" ref={modalRef} onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Customer Details</h3>
              <button 
                onClick={closeAllModals}
                className="text-gray-400 hover:text-gray-500 transition-colors duration-150 ease-in-out"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-medium text-2xl">
                  {selectedCustomer.name.split(' ').map(name => name[0]).join('')}
                </div>
                <div className="ml-4">
                  <h4 className="text-xl font-medium text-gray-900">{selectedCustomer.name}</h4>
                  <p className="text-sm text-gray-500">Customer #{selectedCustomer.id}</p>
                </div>
                <div className="ml-auto">
                  {renderStatusBadge(selectedCustomer.status)}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="text-sm font-medium text-gray-500 mb-2">Contact Information</h5>
                  <div className="space-y-2">
                    <p className="text-sm"><span className="font-medium">Email:</span> {selectedCustomer.email}</p>
                    <p className="text-sm"><span className="font-medium">Phone:</span> {selectedCustomer.phone}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="text-sm font-medium text-gray-500 mb-2">Account Information</h5>
                  <div className="space-y-2">
                    <p className="text-sm"><span className="font-medium">Date Joined:</span> {new Date(selectedCustomer.registrationDate).toLocaleDateString()}</p>
                    <p className="text-sm"><span className="font-medium">Status:</span> {selectedCustomer.status.charAt(0).toUpperCase() + selectedCustomer.status.slice(1)}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="text-sm font-medium text-gray-500 mb-2">Order Summary</h5>
                  <div className="space-y-2">
                    <p className="text-sm"><span className="font-medium">Total Orders:</span> {selectedCustomer.orders}</p>
                    <p className="text-sm"><span className="font-medium">Total Spent:</span> ${selectedCustomer.totalSpent.toFixed(2)}</p>
                    <p className="text-sm"><span className="font-medium">Avg. Order Value:</span> ${selectedCustomer.orders > 0 ? (selectedCustomer.totalSpent / selectedCustomer.orders).toFixed(2) : '0.00'}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end p-6 border-t">
              <button
                onClick={() => handleEditCustomer(selectedCustomer)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition duration-150 ease-in-out"
              >
                Edit Customer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Customer Modal */}
      {editModalOpen && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={handleBackdropClick}>
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full" ref={modalRef} onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Edit Customer</h3>
              <button 
                onClick={closeAllModals}
                className="text-gray-400 hover:text-gray-500 transition-colors duration-150 ease-in-out"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={editFormData.phone}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={editFormData.status}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 p-6 border-t">
                <button
                  type="button"
                  onClick={closeAllModals}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 font-medium transition duration-150 ease-in-out"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition duration-150 ease-in-out"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={handleBackdropClick}>
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full" ref={modalRef} onClick={e => e.stopPropagation()}>
            <div className="p-6 text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                <FiAlertCircle className="h-10 w-10 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Customer</h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete <span className="font-medium">{selectedCustomer.name}</span>?
                This action cannot be undone.
              </p>
              
              <div className="flex justify-center gap-3">
                <button
                  onClick={closeAllModals}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 font-medium transition duration-150 ease-in-out"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition duration-150 ease-in-out"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Success Toast Notification - Will appear after successful operations */}
      {false && ( // Set to true when you want to show the toast
        <div className="fixed bottom-4 right-4 bg-green-50 border-l-4 border-green-400 p-4 rounded shadow-lg flex items-center max-w-xs">
          <FiCheckCircle className="h-5 w-5 text-green-500 mr-3" />
          <div>
            <p className="text-sm font-medium text-green-800">Success!</p>
            <p className="text-xs text-green-700">Your changes have been saved.</p>
          </div>
          <button onClick={() => {/* Hide toast */}} className="ml-4 text-green-500 hover:text-green-600">
            <FiX className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomerTable;