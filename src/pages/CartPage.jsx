import React from 'react';
import { Link } from 'react-router-dom';

const CartPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 text-center py-10">Your cart is currently empty.</p>
        <div className="text-center">
          <Link to="/" className="bg-gray-900 text-white px-6 py-2 rounded hover:bg-gray-800 inline-block">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;