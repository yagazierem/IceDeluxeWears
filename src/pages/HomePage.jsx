import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import shirt from "../assets/shirt-removebg.png";
import Modal from '../components/Modal';
import $ from "jquery";
import { motion, useViewportScroll, useTransform } from 'framer-motion';
import hero from "../assets/hero.jpg";
import { useCart } from '../contexts/CartContext';
import Endpoint from '../utils/endpoint';

const HomePage = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedTab, setSelectedTab] = useState('All'); 
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState("");
  const { addToCart } = useCart();
  const [errors, setErrors] = useState({
    size: '',
    color: '',
    quantity: ''
  });
  
  // States for dynamic categories and products
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await Endpoint.getAllCategories();
      console.log(response?.data?.data, "Categories response data");
      
      // Check if response has the expected structure
      if (response?.data && response?.data.success && response?.data?.data) {
        // Process the categories from API
        const categoryData = response.data.data.map(category => ({
          id: category._id, // Make sure to include category ID
          name: category.name,
          image: category.image || "default", // Use a default image if none provided
          path: `/categories/${category.name.toLowerCase()}`
        }));

        // Add "All" category at the beginning
        const allCategories = [
          { id: 'all', name: 'All', path: '/products' },
          ...categoryData
        ];
        
        setCategories(allCategories);
        setSelectedTab('All');
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

  // Fetch products based on category
  const fetchProducts = async (categoryId = 'all') => {
    try {
      setLoading(true);
      setError(null);
  
      let response;
  
      if (categoryId === 'all') {
        response = await Endpoint.getProducts();
      } else {
        response = await Endpoint.getProducts({ category: categoryId });
      }
  
      if (response?.data?.success && response?.data?.data) {
        setProducts(response.data.data);
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
  

  // Handle category tab change
  const handleCategoryChange = (categoryName) => {
    setSelectedTab(categoryName);
  
    const selected = categories.find(c => c.name === categoryName);
    const categoryId = selected ? selected.id : 'all';
  
    fetchProducts(categoryId);
  };

  useEffect(() => {
    // Fetch categories when component mounts
    fetchCategories();
    // Initially fetch all products
    fetchProducts();
  }, []);

  // Helper function to check if product is in stock
  const isProductInStock = (product) => {
    return product.stock && product.stock > 0;
  };

  // Helper function to get stock status display
  const getStockStatus = (product) => {
    if (!product.stock || product.stock === 0) {
      return { text: 'Sold Out', className: 'text-red-600 bg-red-100' };
    } else if (product.stock <= 5) {
      return { text: `Only ${product.stock} left`, className: 'text-orange-600 bg-orange-100' };
    } else {
      return { text: 'Available', className: 'text-green-600 bg-green-100' };
    }
  };

  const validateField = (name, value) => {
    let errorMessage = '';
    
    switch (name) {
      case 'size':
        errorMessage = value === '' ? 'Please select a size' : '';
        break;
      case 'color':
        errorMessage = value === '' ? 'Please select a color' : '';
        break;
      case 'quantity':
        if (value === '' || isNaN(value)) {
          errorMessage = 'Please enter a valid quantity';
        } else if (parseInt(value) < 1) {
          errorMessage = 'Quantity must be at least 1';
        } else if (selectedProduct && parseInt(value) > selectedProduct.stock) {
          errorMessage = `Only ${selectedProduct.stock} items available in stock`;
        }
        break;
      default:
        break;
    }
    
    return errorMessage;
  };     
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Update the appropriate state based on the input name
    if (name === 'size') {
      setSelectedSize(value);
    } else if (name === 'color') {
      setSelectedColor(value);
    } else if (name === 'quantity') {
      setQuantity(value);
    }
    
    // Clear error when user changes input
    setErrors({
      ...errors,
      [name]: ''
    });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const errorMessage = validateField(name, value);
    
    setErrors({
      ...errors,
      [name]: errorMessage
    });
  };
  
  const handleAddToCart = () => {
    // Additional validation for stock before adding to cart
    const qty = Number(quantity);
    
    if (selectedProduct && qty > selectedProduct.stock) {
      setErrors({
        ...errors,
        quantity: `Only ${selectedProduct.stock} items available in stock`
      });
      return;
    }
    
    // Delegate validation & add-to-cart to context
    const success = addToCart(selectedProduct, {
      size: selectedSize,
      color: selectedColor,
      quantity: qty,
    });
  
    if (success) {
      handleClose();
    } 
  };

  const handleClose = () => {
    setSelectedProduct(null);
    setSelectedSize('');
    setSelectedColor('');
    setQuantity('');
    setErrors({
      size: '',
      color: '',
      quantity: ''
    });
  };
  
  const productsPerPage = 8;

 
  const totalPages = Math.ceil(products.length / productsPerPage);

  
  const start = (currentPage - 1) * productsPerPage;
  const paginatedProducts = products.slice(start, start + productsPerPage);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const { scrollY } = useViewportScroll();
  const y = useTransform(scrollY, [0, 300], [0, -50]); 

  useEffect(() => {
    setTimeout(() => {
      $("#fadeInText").delay(450).fadeIn("slow");
      window.scrollTo(0, 0);
    }, 6000);
    setTimeout(() => {
      $("#typewriter_body").delay(450).fadeOut("slow");
    }, 5000);
  }, []);

  return (
    <div>
      <div>
        <div id="typewriter_body">
          <div className="typewriter_container">
            <div>
              <h1
                className="typewriter_h1 dancing-script-600"
                style={{ marginTop: "-10vh" }}
              >
                Ice Luxury
              </h1>
            </div>
          </div>
        </div>
      </div>
      <div>
        {/* Hero Section */}
        <section className="relative h-[25vh] bg-cover bg-center"
          style={{ backgroundImage: `url(${hero})` }}>
          {/* dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/70" />

          {/* Content wrapper */}
          <div className="relative container h-full flex items-center">
            <h1
              className="text-4xl md:text-6xl mx-auto text-center font-extrabold text-white animate-blink"
            >
              Shop New Arrivals
            </h1>
          </div>
        </section>

        {/* Categories Section - Desktop Tabs & Mobile Dropdown */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 text-center">Shop by Category</h2>
            
            {loading && products.length === 0 ? (
              <div className="text-center py-10">
                <p>Loading...</p>
              </div>
            ) : error ? (
              <div className="text-center py-6 text-red-500">
                <p>{error}</p>
                <button 
                  onClick={() => {
                    fetchCategories();
                    fetchProducts();
                  }}
                  className="mt-2 bg-gray-900 text-white px-4 py-2 rounded"
                >
                  Retry
                </button>
              </div>
            ) : (
              <>
                {/* Mobile Dropdown */}
                <div className="block md:hidden mb-6">
                  <select 
                    className="w-full p-3 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
                    value={selectedTab}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                  >
                    {categories.map(cat => (
                      <option key={cat.name} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                
                {/* Desktop Tabs */}
                <div className="hidden md:flex justify-center space-x-1 mb-6">
                  {categories.map((cat) => (
                    <button
                      key={cat.name}
                      className={`px-6 py-3 text-lg font-medium rounded-t transition-colors ${
                        selectedTab === cat.name
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                      onClick={() => handleCategoryChange(cat.name)}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
                
                {/* Unified Products Display Section */}
                <section className="py-8 bg-white rounded shadow-sm">
                  <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-8 text-center">
                      {selectedTab === 'All' ? 'All Products' : `${selectedTab} Collection`}
                    </h2>
                    
                    {loading && products.length > 0 ? (
                      <div className="text-center py-6">
                        <p>Loading products...</p>
                      </div>
                    ) : products.length === 0 ? (
                      <div className="text-center py-6">
                        <p>No products found in this category.</p>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                          {paginatedProducts.map(product => {
                            const stockStatus = getStockStatus(product);
                            const inStock = isProductInStock(product);
                            
                            return (
                              <div
                                key={product._id}
                                className={`bg-[#FCFFFF] rounded-lg shadow-none hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col h-70 ${!inStock ? 'opacity-75' : ''}`}
                              >
                                <div className="bg-gray-200 flex items-center justify-center h-40 relative">
                                  {product.images?.[0]?.url ? (
                                    <img
                                      src={product.images[0].url}
                                      alt={product.name}
                                      className={`object-cover h-full w-full ${!inStock ? 'grayscale' : ''}`}
                                    />
                                  ) : (
                                    <div className="text-gray-500">No image</div>
                                  )}
                                  
                                  {/* Stock Status Badge */}
                                  <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${stockStatus.className}`}>
                                    {stockStatus.text}
                                  </div>
                                </div>
                                <div className="p-4 flex flex-col justify-between flex-grow">
                                  <h3 className="font-normal text-small mb-1 overflow-hidden whitespace-nowrap text-ellipsis">{product.name}</h3>
                                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mt-auto">
                                    <span className="font-normal text-small">₦{product.price}</span>
                                    <button
                                      onClick={() => setSelectedProduct(product)}
                                      disabled={!inStock}
                                      className={`px-4 py-2 rounded text-sm w-full sm:w-auto transition-colors ${
                                        inStock 
                                          ? 'bg-gray-900 hover:bg-gray-800 text-white' 
                                          : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                      }`}
                                    >
                                      {inStock ? 'Select Options' : 'Sold Out'}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        
                        {/* Pagination */}
                        {totalPages > 1 && (
                          <div className="flex justify-center mt-12">
                            <nav className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-2 py-1 shadow-sm bg-white">
                              {/* Prev */}
                              <button
                                className="p-2 text-gray-500 hover:text-gray-900"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(cp => Math.max(cp - 1, 1))}
                              >
                                &larr;
                              </button>
                
                              {/* Page Numbers */}
                              {pages.map(page => (
                                <button
                                  key={page}
                                  onClick={() => setCurrentPage(page)}
                                  className={`px-4 py-2 text-sm rounded-md font-medium ${
                                    currentPage === page
                                      ? 'bg-gray-900 text-white'
                                      : 'text-gray-700 hover:bg-gray-100'
                                  }`}
                                >
                                  {page}
                                </button>
                              ))}
                
                              {/* Next */}
                              <button
                                className="p-2 text-gray-500 hover:text-gray-900"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(cp => Math.min(cp + 1, totalPages))}
                              >
                                &rarr;
                              </button>
                            </nav>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </section>
              </>
            )}
          </div>
        </section>

        {/* Modal */}
        <Modal
          isOpen={!!selectedProduct}
          onClose={handleClose}
          title={selectedProduct?.name}
        >
          {selectedProduct && (
            <div className="space-y-4">
              <img
                src={selectedProduct.images && selectedProduct.images.length > 0 
                  ? selectedProduct.images[0].url 
                  : '/api/placeholder/400/320'}
                alt={selectedProduct.name}
                className="w-full h-64 object-cover rounded"
              />
              <p className="text-gray-700">{selectedProduct.description}</p>
              <div className="flex justify-between items-center">
                <p className="text-lg font-semibold">₦{selectedProduct.price}</p>
                {/* Stock info in modal */}
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStockStatus(selectedProduct).className}`}>
                  {getStockStatus(selectedProduct).text}
                </div>
              </div>

              {/* Product options form */}
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium">Size</label>
                  <select 
                    name="size"
                    className={`w-full border rounded px-3 py-2 ${errors.size ? 'border-red-500' : 'border-gray-300'}`}
                    value={selectedSize}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option value="">Select Size</option>
                    <option value="Small">Small</option>
                    <option value="Medium">Medium</option>
                    <option value="Large">Large</option>
                  </select>
                  {errors.size && (
                    <p className="text-red-500 text-sm mt-1">{errors.size}</p>
                  )}
                </div>
                
                <div>
                  <label className="block mb-1 font-medium">Color</label>
                  <select 
                    name="color"
                    className={`w-full border rounded px-3 py-2 ${errors.color ? 'border-red-500' : 'border-gray-300'}`}
                    value={selectedColor}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option value="">Select Color</option>
                    <option value="Brown">Brown</option>
                    <option value="Black">Black</option>
                    <option value="Blue">Blue</option>
                  </select>
                  {errors.color && (
                    <p className="text-red-500 text-sm mt-1">{errors.color}</p>
                  )}
                </div>
                
                <div>
                  <label className="block mb-1 font-medium">
                    Quantity 
                    {selectedProduct.stock && (
                      <span className="text-gray-500 font-normal">
                        (Max: {selectedProduct.stock})
                      </span>
                    )}
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    className={`w-full border rounded px-3 py-2 ${errors.quantity ? 'border-red-500' : 'border-gray-300'}`}
                    value={quantity}
                    min="1"
                    max={selectedProduct.stock}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.quantity && (
                    <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
                  )}
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!isProductInStock(selectedProduct)}
                  className={`w-full py-3 rounded font-semibold mt-2 transition-colors ${
                    isProductInStock(selectedProduct)
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  }`}
                >
                  {isProductInStock(selectedProduct) ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default HomePage;