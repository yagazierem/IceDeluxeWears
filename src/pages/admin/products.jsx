import { useState, useEffect, useRef } from 'react';
import { Plus, Pencil, Trash2, Search, X, Save, Check, Tag,  Upload, Image, } from 'lucide-react';
import Endpoint from '../../utils/endpoint';


export default function ProductManagementDashboard() {
  // State for products and categories
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isManagingCategories, setIsManagingCategories] = useState(false);
  const [editingCategoryIndex, setEditingCategoryIndex] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [confirmDelete, setConfirmDelete] = useState({
    isOpen: false,
    productId: null,
  });
  
  // Form state
  const [productImages, setProductImages] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '', // This will store the category ID, not the name
    price: '',
    stock: '',
    description: ''
  });
  
  // Category form state
  const [newCategory, setNewCategory] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [categoryParent, setCategoryParent] = useState('');
  const [originalProduct, setOriginalProduct] = useState(null);
  
  // Refs
  const fileInputRef = useRef(null);
  const editFileInputRef = useRef(null);
  
  // Status state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
const [pendingDeleteCategoryId, setPendingDeleteCategoryId] = useState(null);


  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await Endpoint.getAllCategories();
      
      if (response?.data && response?.data.success && response?.data?.data) {
        setCategories(response.data.data);
      } else {
        throw new Error('Unexpected API response format');
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await Endpoint.getProducts();
      
      if (response?.data && response?.data.success && response?.data?.data) {
        console.log(response.data.data, "productresss-")
        setProducts(response.data.data);
        setFilteredProducts(response.data.data);
      } else {
        throw new Error('Unexpected API response format');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Create a new category
  const createCategory = async () => {
    if (!newCategory.trim()) {
      setError("Category name is required");
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const categoryData = {
        name: newCategory.trim(),
        description: categoryDescription.trim(),
        parent: categoryParent.trim() || undefined
      };
      
      const response = await Endpoint.createCategory(categoryData);
      
      if (response?.data && response?.data.success) {
        // Add the new category to the list
        fetchCategories(); // Refresh categories
        
        // Reset form fields
        setNewCategory('');
        setCategoryDescription('');
        setCategoryParent('');
        
        setSuccessMessage("Category created successfully");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        throw new Error('Failed to create category');
      }
    } catch (err) {
      console.error('Error creating category:', err);
      setError('Failed to create category. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Create a new product
  const createProduct = async () => {
    try {
      setLoading(true);
      setError(null);
  
      // Validation
      if (!formData.name || !formData.price || !formData.category || !formData.stock || !formData.description) {
        setError("All fields are required");
        setLoading(false);
        return;
      }
      
      if (productImages.length === 0) {
        setError("At least one product image is required");
        setLoading(false);
        return;
      }
  
      // Parse numbers
      const price = parseFloat(formData.price);
      const stock = parseInt(formData.stock, 10);
      
      if (isNaN(price) || isNaN(stock)) {
        setError("Price and stock must be valid numbers");
        setLoading(false);
        return;
      }
  
      // Build FormData
      const data = new FormData();
      data.append("name", formData.name.trim());
      data.append("price", price.toString());
      data.append("description", formData.description.trim());  
      data.append("category", formData.category); // This should be the category ID
      data.append("stock", stock.toString());
  
      // Append each file under 'images'
      productImages.forEach((file) => {
        data.append("images", file);
      });
      
      // Debug FormData
      console.log("FormData entries:");
      for (let [key, val] of data.entries()) {
        console.log(key, val);
      }
  
      // Send to API
      const response = await Endpoint.createProduct(data);
      console.log("API Response:", response?.data);
  
      if (response.data?.success) {
        // Update UI
        await fetchProducts(); // Refresh products
        resetFormData();
        setProductImages([]);
        setPreviewImage(null);
        setIsAddingProduct(false);
        setSuccessMessage("Product created successfully");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        throw new Error(response.data.message || "Unknown error");
      }
    } catch (err) {
      console.error("Error creating product:", err);
      // Extract server error if available
      if (err.response) {
        const msg = err.response?.data?.message || err.response?.data?.error;
        setError(msg || `Request failed: ${err.response.status}`);
      } else {
        setError(err.message || "Failed to create product");
      }
    } finally {
      setLoading(false);
    }
  };

  // Update a product
  const updateProduct = async (productId, data) => {
    try {
      setLoading(true);
      setError(null);
  
      const resp = await Endpoint.updateProduct(productId, data);
      if (!resp.data?.success) {
        throw new Error(resp.data?.message || "Unknown error");
      }
  console.log(resp, "respppp")
      await fetchProducts();
      setSuccessMessage("Product updated successfully");
      setTimeout(() => setSuccessMessage(null), 3000);
      return true;
    } catch (err) {
      console.error("Update failed:", err);
      setError(err.response?.data?.message || err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete a product
  const deleteProduct = async (productId) => {
    try {
      setLoading(true);
      setError(null);

     
      // Send to API
      const response = await Endpoint.deleteProduct(productId);

      if (response.data?.success) {
        // Update UI
        await fetchProducts(); // Refresh products
        if (editingId === productId) {
          setEditingId(null);
          resetFormData();
        }
        setSuccessMessage("Product deleted successfully");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        throw new Error(response.data.message || "Unknown error");
      }
    } catch (err) {
      console.error("Error deleting product:", err);
      // Extract server error if available
      if (err.response) {
        const msg = err.response?.data?.message || err.response?.data?.error;
        setError(msg || `Request failed: ${err.response.status}`);
      } else {
        setError(err.message || "Failed to delete product");
      }
    } finally {
      setLoading(false);
    }
  };

  // Update a category
  const updateCategory = async (id, payload) => {
    try {
      setLoading(true);
      setError(null);
  
      const resp = await Endpoint.updateCategory(id, payload);
      if (!resp.data?.success) {
        throw new Error(resp.data?.message || "Failed to update category");
      }
  
      // Refresh your list
      await fetchCategories();
      setSuccessMessage("Category updated successfully");
      setTimeout(() => setSuccessMessage(null), 3000);
      return true;
    } catch (err) {
      console.error("Error updating category:", err);
      setError("Failed to update category. Please try again.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete a category
  const deleteCategory = async (id) => {
    try {
      setLoading(true);
      setError(null);

     
      const response = await Endpoint.deleteCategory(id);

      if (response?.data && response?.data.success) {
        // Refresh categories
        await fetchCategories();
        setShowDeleteModal(false)
        
        // Reset state if currently editing this category
        if (editingCategoryIndex !== null && categories[editingCategoryIndex]?._id === id) {
          setEditingCategoryIndex(null);
          setNewCategory('');
          setCategoryDescription('');
          setCategoryParent('');
        }
        
        setSuccessMessage("Category deleted successfully");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        throw new Error('Failed to delete category');
      }
    } catch (err) {
      console.error('Error deleting category:', err);
      setError('Failed to delete category. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Initialize data
  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  // Effect for filtering and searching products
  useEffect(() => {
    if (!products.length) return;
    
    let result = [...products];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.category?.name && product.category.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply category filter
    if (categoryFilter) {
      result = result.filter(product => 
        product.category?._id === categoryFilter
      );
    }
    
    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        // Handle nested properties (like category.name)
        const aValue = sortConfig.key.includes('.') ? 
          sortConfig.key.split('.').reduce((obj, key) => obj?.[key], a) : 
          a[sortConfig.key];
          
        const bValue = sortConfig.key.includes('.') ? 
          sortConfig.key.split('.').reduce((obj, key) => obj?.[key], b) : 
          b[sortConfig.key];
          
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFilteredProducts(result);
  }, [products, searchTerm, categoryFilter, sortConfig]);

  // Reset form data
  const resetFormData = () => {
    setFormData({
      name: '',
      category: '',
      price: '',
      stock: '',
      description: ''
    });
  };

  // Start editing a product
  const startEditing = (product) => {
    setEditingId(product._id);
    setOriginalProduct(product);
    setFormData({
      name: product.name,
      category: product.category?._id || "",
      price: product.price.toString(),
      stock: product.stock.toString(),
      description: product.description || "",
    });
  };

  // Handle saving edited product
  const handleSaveEdit = async (productId) => {
    // if user somehow clicked “Save” before startEditing ran, bail:
    if (!originalProduct) {
      console.warn("No originalProduct—did you click edit first?");
      return;
    }
    // build the minimal FormData
    const data = new FormData();
    let hasChanges = false;
  
    if (formData?.name !== originalProduct?.name) {
      data.append("name", formData.name.trim());
      hasChanges = true;
    }
    if (formData?.category !== (originalProduct?.category?._id || "")) {
      data.append("category", formData.category);
      hasChanges = true;
    }
    if (formData.price !== originalProduct?.price.toString()) {
      data.append("price", formData.price);
      hasChanges = true;
    }
    if (formData.stock !== originalProduct.stock.toString()) {
      data.append("stock", formData.stock);
      hasChanges = true;
    }
    if (formData.description !== (originalProduct.description || "")) {
      data.append("description", formData.description.trim());
      hasChanges = true;
    }
  
    if (productImages.length > 0) {
      productImages.forEach(f => data.append("images", f));
      hasChanges = true;
    }
  
    // bail out if truly nothing changed
    if (!hasChanges) {
      // Simply exit edit mode without error or API call
      setEditingId(null);
      return;
    }
  
    // otherwise, carry on with the update
    const ok = await updateProduct(productId, data);
    if (ok) {
      setEditingId(null);
      resetFormData();
      setProductImages([]);
      setPreviewImage(null);
    }
  };

 

  // Handle adding a new category
  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.some(cat => cat.name === newCategory.trim())) {
      createCategory();
    } else {
      setError("Category name already exists or is invalid");
    }
  };

  // Handle editing a category
  const startEditingCategory = (index) => {
    setEditingCategoryIndex(index);
    setNewCategory(categories[index].name);
    setCategoryDescription(categories[index].description || '');
    setCategoryParent(categories[index].parent || '');
  };

  // Handle saving category changes
  const handleSaveCategory = async (index) => {
    const category = categories[index];
    const payload = {
      name: newCategory.trim(),
      description: categoryDescription.trim() || undefined,
      parent: categoryParent || undefined,
    };
  
    try {
      const response = await Endpoint.updateCategory(category._id, payload); // your backend call
      if (response.data?.success) {
        await fetchCategories();
        setEditingCategoryIndex(null);
        setNewCategory('');
        setCategoryDescription('');
        setCategoryParent('');
        setSuccessMessage("Category updated successfully");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        throw new Error(response.data?.message || 'Update failed');
      }
    } catch (err) {
      console.error("Update error:", err);
      setError("Failed to update category. Please try again.");
      setTimeout(() => setError(null), 3000);
    }
  };
  // Handle deleting a category
  const handleDeleteCategory = async (index) => {
    const categoryId = categories[index]._id;
  setPendingDeleteCategoryId(categoryId);
  setShowDeleteModal(true);
  };

  // Handle sorting changes
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Sort indicator
  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? '↑' : '↓';
  };

  // Form input handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setProductImages([...productImages, ...files]);
      
      // Create preview URL for the first image
      if (!previewImage) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result);
        };
        reader.readAsDataURL(files[0]);
      }
    }
  };
  console.log(filteredProducts, "FORMDATA")

  // Remove image
  const removeImage = () => {
    setProductImages([]);
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Trigger file input
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Trigger file input for editing
  const triggerEditFileInput = () => {
    editFileInputRef?.current?.click();
  };


  return (
    <div className="flex flex-col p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Product Management Dashboard</h1>

      {/* Error and Success Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          <p className="font-medium">{error}</p>
        </div>
      )}
      
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          <p className="font-medium">{successMessage}</p>
        </div>
      )}
      
      
        {/* Filters Section */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search products..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setSearchTerm('')}
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          )}
        </div>
        
        <div className="flex-shrink-0">
          <select
            className="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories?.map(category => (
              <option key={category._id} value={category._id}>{category?.name}</option>
            ))}
          </select>
        </div>
        
        <div className="flex gap-2 flex-shrink-0">
          <button
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            onClick={() => {
              setIsAddingProduct(true);
              setIsManagingCategories(false);
              setEditingId(null);
              resetFormData();
              setError(null);
            }}
          >
            <Plus className="h-5 w-5" />
            <span>Add Product</span>
          </button>
          
          <button
            className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
            onClick={() => {
              setIsManagingCategories(!isManagingCategories);
              setIsAddingProduct(false);
              setNewCategory('');
              setEditingCategoryIndex(null);
              setError(null);
            }}
          >
            <Tag className="h-5 w-5" />
            <span>Manage Categories</span>
          </button>
        </div>
        </div>
      
      {/* Category Management Section */}
      {isManagingCategories && (
  <div className="mb-6 p-4 bg-white rounded-md shadow-md">
    {/* Header */}
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-medium">Manage Categories</h2>
      <button 
        onClick={() => {
          setIsManagingCategories(false);
          setEditingCategoryIndex(null);
          setNewCategory('');
          setCategoryDescription('');
          setCategoryParent('');
        }}
        className="text-gray-500 hover:text-gray-700"
      >
        <X className="h-5 w-5" />
      </button>
    </div>

    {/* Category Form (Add / Edit) */}
    <div className="flex flex-col gap-4 mb-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Category name"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
        <input
          type="text"
          value={categoryDescription}
          onChange={(e) => setCategoryDescription(e.target.value)}
          placeholder="Category description"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Parent Category (optional)</label>
        <select
          value={categoryParent}
          onChange={(e) => setCategoryParent(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">No parent</option>
          {categories.map(category => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        {editingCategoryIndex === null ? (
          <button
            onClick={handleAddCategory}
            disabled={!newCategory.trim()}
            className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors disabled:bg-purple-300"
          >
            Add Category
          </button>
        ) : (
          <button
            onClick={() => handleSaveCategory(editingCategoryIndex)}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            Save Changes
          </button>
        )}
      </div>
    </div>

    {/* Category List */}
    <div className="mt-4">
      <h3 className="text-md font-medium mb-2">Current Categories</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {categories.map((category, index) => (
          <div
            key={category._id}
            className="flex items-center p-2 border border-gray-200 rounded-md bg-gray-50"
          >
            <span className="flex-grow">{category.name}</span>
            <button
              onClick={() => {
                const cat = categories[index];
                setEditingCategoryIndex(index);
                setNewCategory(cat.name);
                setCategoryDescription(cat.description || '');
                setCategoryParent(cat.parent || '');
              }}
              className="p-1 text-blue-600 hover:text-blue-800"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDeleteCategory(index)}
              className="p-1 text-red-600 hover:text-red-800"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
)}


      
      {/* Add Product Form */}
      {isAddingProduct && (
        <div className="mb-6 p-4 bg-white rounded-md shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Add New Product</h2>
            <button
              onClick={() => setIsAddingProduct(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter product name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select category</option>
                {categories.map(category => (
                  <option key={category._id} value={category._id}>{category.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₦)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
                min="0"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter product description"
                rows="3"
              ></textarea>
            </div>
          </div>
        
        {/* Image Upload Section */}
        <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Images</label>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
            
            {previewImage ? (
              <div className="relative mt-2 w-full h-48 border border-gray-300 rounded-md overflow-hidden">
                <img 
                  src={previewImage} 
                  alt="Product preview" 
                  className="w-full h-full object-contain"
                />
                <div className="absolute bottom-2 left-2 bg-gray-800 bg-opacity-70 text-white px-2 py-1 rounded">
                  {productImages.length} image{productImages.length !== 1 ? 's' : ''} selected
                </div>
                <button 
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div 
                onClick={triggerFileInput}
                className="mt-2 flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-md hover:border-blue-500 cursor-pointer"
              >
                <Image className="h-8 w-8 text-gray-400" />
                <Upload className="h-6 w-6 text-gray-400 mt-2" />
                <p className="mt-1 text-sm text-gray-500">Click to upload product images</p>
                <p className="text-xs text-gray-400">PNG, JPG, WEBP up to 5MB each</p>
              </div>
            )}
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => {
                setIsAddingProduct(false);
                resetFormData();
                setProductImages([]);
                setPreviewImage(null);
              }}
              className="mr-2 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={createProduct}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              disabled={loading || !formData.name || !formData.category || !formData.price || !formData.stock || productImages.length === 0}
            >
              {loading ? 'Adding...' : 'Add Product'}
            </button>
          </div>
        </div>
      )}
      
       {/* Stats summary */}
       <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-md shadow-md">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Total Products</h3>
          <p className="text-3xl font-bold text-blue-600">{products.length}</p>
        </div>
        <div className="bg-white p-4 rounded-md shadow-md">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Total Stock</h3>
          <p className="text-3xl font-bold text-green-600">
            {products.reduce((sum, product) => sum + (product.stock || 0), 0)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-md shadow-md">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Categories</h3>
          <p className="text-3xl font-bold text-purple-600">
            {categories.length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-md shadow-md">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Low Stock Items</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {products.filter(p => (p.stock || 0) < 10).length}
          </p>
        </div>
      </div>

       {/* Loading Indicator */}
      {loading && (
        <div className="flex justify-center my-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}


      {/* Product Table */}
      <div className="bg-white rounded-md shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-600 text-sm">
                <th 
                  className="px-6 py-3 font-medium cursor-pointer"
                  onClick={() => requestSort('_id')}
                >
                  ID {getSortIndicator('_id')}
                </th>
                <th 
                  className="px-6 py-3 font-medium cursor-pointer"
                  onClick={() => requestSort('name')}
                >
                  Product Name {getSortIndicator('name')}
                </th>
                {/* <th 
                  className="px-6 py-3 font-medium cursor-pointer"
                  onClick={() => requestSort('category.name')}
                >
                  Category {getSortIndicator('category.name')}
                </th> */}
                <th 
                  className="px-6 py-3 font-medium cursor-pointer"
                  onClick={() => requestSort('price')}
                >
                  Price {getSortIndicator('price')}
                </th>
                <th 
                  className="px-6 py-3 font-medium cursor-pointer"
                  onClick={() => requestSort('stock')}
                >
                  Stock {getSortIndicator('stock')}
                </th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts?.length > 0 ? (
                filteredProducts?.map(product => (
                  <tr key={product?._id} className="hover:bg-gray-50">
                    {editingId === product._id ? (
                      // Edit mode row
                      <>
                        <td className="px-6 py-4">{product?._id}</td>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            name="name"
                            value={formData?.name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        

                        <td className="px-6 py-4">
                          <input
                            type="number"
                            name="price"
                            value={formData?.price}
                            onChange={handleInputChange}
                            className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="0"
                            step="0.01"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="number"
                            name="stock"
                            value={formData?.stock}
                            onChange={handleInputChange}
                            className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="0"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col space-y-2">
                            {/* Hidden file input for editing */}
                            <input
                              type="file"
                              ref={editFileInputRef}
                              className="hidden"
                              accept="image/*"
                              multiple
                              onChange={handleImageChange}
                            />

                            {/* Image upload for editing */}
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => {
                                  // Explicit guard before triggering
                                  if (editFileInputRef.current) {
                                    editFileInputRef.current.click();
                                  }
                                }}
                                className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                              >
                                {productImages.length > 0 ? "Change Images" : "Add Images"}
                              </button>
                              {productImages.length > 0 && (
                                <div className="flex items-center space-x-1">
                                  <span className="text-xs text-green-600">
                                    {productImages.length} new image
                                    {productImages.length !== 1 ? "s" : ""}
                                  </span>
                                  <button
                                    onClick={() => {
                                      // clear state and reset input
                                      setProductImages([]);
                                      setPreviewImage(null);
                                      if (editFileInputRef.current) {
                                        editFileInputRef.current.value = "";
                                      }
                                    }}
                                    className="text-xs text-red-500 hover:text-red-700"
                                  >
                                    ✕
                                  </button>
                                </div>
                              )}
                            </div>

                            {/* Action buttons */}
                            <div className="flex space-x-2">
                              <button
                                className="p-1 text-green-600 hover:text-green-800"
                                onClick={() => handleSaveEdit(product._id)}
                              >
                                <Save className="h-4 w-4" />
                              </button>
                              <button
                                className="p-1 text-gray-600 hover:text-gray-800"
                                onClick={() => {
                                  // cancel edit: reset everything
                                  setEditingId(null);
                                  resetFormData();
                                  setProductImages([]);
                                  setPreviewImage(null);
                                  if (editFileInputRef.current) {
                                    editFileInputRef.current.value = "";
                                  }
                                }}
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </td>

                      </>
                    ) : (
                      // View mode row
                      <>
                        <td className="px-6 py-4">{product?._id}</td>
                        <td className="px-6 py-4 font-medium">{product?.name}</td>
                        {/* <td className="px-6 py-4">
                          {product?.category ? (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                              {product?.category?.name}
                            </span>
                          ) : (
                            <span className="text-gray-400">None</span>
                          )}
                        </td> */}
                        <td className="px-6 py-4">₦{product?.price.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <span className={`${
                            product?.stock > 10 ? 'text-green-600' : product?.stock > 0 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {product?.stock}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              className="p-1 text-blue-600 hover:text-blue-800"
                              onClick={() => startEditing(product)}
                            >
                              <Pencil className="h-5 w-5" />
                            </button>
                            <button
                              className="p-1 text-red-600 hover:text-red-800"
                              onClick={() =>
                                setConfirmDelete({ isOpen: true, productId: product._id })
                              }
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {confirmDelete.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-6">Are you sure you want to delete this product?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() =>
                  setConfirmDelete({ isOpen: false, productId: null })
                }
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  // call your delete function
                  await deleteProduct(confirmDelete.productId);
                  setConfirmDelete({ isOpen: false, productId: null });
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

{showDeleteModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Delete Category</h2>
      <p className="text-sm text-gray-700 mb-6">
        Are you sure you want to delete this category? This might affect products linked to it.
      </p>
      <div className="flex justify-end gap-3">
        <button
          onClick={() => {
            setShowDeleteModal(false);
            setPendingDeleteCategoryId(null);
          }}
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={() => deleteCategory(pendingDeleteCategoryId)}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}


    </div>
  );
}