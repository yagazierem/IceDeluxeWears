import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Search, Menu, X, ShoppingBagIcon } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import CartDrawer from '../CartDrawer';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { cartCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  return (
    // <header className="bg-white shadow">
    //   <div className="container mx-auto px-4">
    //     <div className="flex justify-between items-center py-4">
    //       {/* Logo */}
    //       <div className="flex items-center">
    //         <Link to="/" className="text-xl font-bold text-gray-800"> ICE LUXURY WEARS</Link>
    //       </div>
          
    //       {/* Desktop Navigation */}
    //       {/* <nav className="hidden md:flex space-x-8">
    //         <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
    //         <Link to="/products" className="text-gray-600 hover:text-gray-900">Shop</Link>
    //         <Link to="/categories" className="text-gray-600 hover:text-gray-900">Categories</Link>
    //         <Link to="/sale" className="text-gray-600 hover:text-gray-900">Sale</Link>
    //         <Link to="/about" className="text-gray-600 hover:text-gray-900">About</Link>
    //       </nav>
    //        */}
    //       {/* Icons */}
    //       <div className="flex items-center space-x-4">
    //         <button className="text-gray-600 hover:text-gray-900">
    //           <Search size={20} />
    //         </button>
    //         {/* <button className="text-gray-600 hover:text-gray-900">
    //           <Heart size={20} />
    //         </button> */}
    //         <Link to="/cart" className="text-gray-600 hover:text-gray-900 relative">
    //           <ShoppingCart size={20} />
    //           <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">0</span>
    //         </Link>
            
    //         {/* Mobile menu button */}
    //         <button 
    //           className="md:hidden text-gray-600 hover:text-gray-900"
    //           onClick={() => setIsMenuOpen(!isMenuOpen)}
    //         >
    //           {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
    //         </button>
    //       </div>
    //     </div>
        
    //     {/* Mobile Navigation */}
    //     {isMenuOpen && (
    //       <div className="md:hidden py-4">
    //         <div className="flex flex-col space-y-3">
    //           <Link to="/" className="text-gray-600 hover:text-gray-900 py-2">Home</Link>
    //           <Link to="/products" className="text-gray-600 hover:text-gray-900 py-2">Shop</Link>
    //           <Link to="/categories" className="text-gray-600 hover:text-gray-900 py-2">Categories</Link>
    //           <Link to="/sale" className="text-gray-600 hover:text-gray-900 py-2">Sale</Link>
    //           <Link to="/about" className="text-gray-600 hover:text-gray-900 py-2">About</Link>
    //         </div>
    //       </div>
    //     )}
    //   </div>
    // </header>
    <>
        <header className="bg-white shadow">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between py-3 relative">
                    
                    {/* If mobile search is open, show inline search bar... */}
                    {isSearchOpen ? (
                    <div className="flex flex-1 items-center">
                        <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                            autoFocus
                        />
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        </div>
                        <button
                        onClick={() => setIsSearchOpen(false)}
                        className="ml-3 text-gray-600 hover:text-gray-800"
                        >
                        <X size={24} />
                        </button>
                    </div>
                    ) : (
                    <>
                        {/* Brand */}
                        <Link
                        to="/"
                        className="font-small text-md md:text-xl text-gray-800"
                        >
                        ICE LUXURY WEARS
                        </Link>

                        {/* Desktop Search */}
                        <div className="hidden md:flex flex-1 mx-5">
                        <div className="relative w-full">
                            <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                            />
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        </div>
                        </div>

                        {/* Icons & Mobile Search Toggle */}
                        <div className="flex items-center space-x-4">
                        {/* Mobile Search Icon */}
                        <button
                            className="md:hidden text-gray-600 hover:text-gray-900"
                            onClick={() => setIsSearchOpen(true)}
                        >
                            <Search size={20} />
                        </button>

                        {/* Cart Icon */}
                        <button 
                    onClick={() => setIsCartOpen(true)} 
                    className="relative text-gray-600 hover:text-gray-800"
                    aria-label="Open shopping cart"
                  >
                    <ShoppingBagIcon className="h-6 w-6" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {cartCount}
                      </span>
                    )}
                  </button>
                        </div>
                    </>
                    )}

                </div>
            </div>
        </header>
        <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
    </>
  );
};

export default Navbar;