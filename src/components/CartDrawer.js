import React from "react";
import { X, MinusCircle, PlusCircle } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { Link } from "react-router-dom";

const CartDrawer = ({ isOpen, onClose }) => {
  const { cartItems, cartTotal, removeFromCart, updateQuantity } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Shopping Cart</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart content */}
        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center py-4 border-b">
                  {/* Item image */}
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded mr-4"
                    />
                  )}

                  {/* Item details */}
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      {item.options?.size && `Size: ${item.options.size}`}
                      {item.options?.size && item.options?.color && " | "}
                      {item.options?.color && `Color: ${item.options.color}`}
                    </p>
                    <div className="flex items-center mt-2">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            Math.max(1, item.quantity - 1)
                          )
                        }
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <MinusCircle size={18} />
                      </button>
                      <span className="mx-2">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <PlusCircle size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Price and remove */}
                  <div className="text-right">
                    <p className="font-medium">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-sm text-red-500 hover:text-red-700 mt-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with total and action buttons */}
        {cartItems.length > 0 && (
          <div className="border-t p-4 space-y-4">
            <div className="flex justify-between items-center font-semibold">
              <span>Total</span>
              <span>₦{cartTotal.toLocaleString()}</span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Link
                to="/"
                className="w-full py-3 px-4 border border-gray-300 rounded text-center font-medium hover:bg-gray-50"
                onClick={onClose}
              >
                Continue Shopping
              </Link>

              <Link
                to="/checkout"
                className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded text-center font-medium"
                onClick={onClose}
              >
                Proceed to checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
