import React, { createContext, useState, useContext } from "react";

// Create the context
const CartContext = createContext();

// Create a provider component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  console.log(cartItems, "cartItems!!!");

  // Add item to cart
  const addToCart = (product, options = {}) => {
    const { size, color, quantity } = options;

    // 1) Validate options
    if (!size) {
      setToastMessage("Please select a size");
      setToastType("error");
      setShowToast(true);
      return false;
    }
    if (!color) {
      setToastMessage("Please select a color");
      setToastType("error");
      setShowToast(true);
      return false;
    }
    if (!quantity || isNaN(quantity) || quantity < 1) {
      setToastMessage("Please enter a valid quantity");
      setToastType("error");
      setShowToast(true);
      return false;
    }

    // Success case
    setToastMessage(`${product.name} added to cart!`);
    setToastType("success");
    setShowToast(true);

    // 2) All good—add item
    const itemToAdd = {
      ...product,
      options,
      quantity,
      id: `${product.id}-${size}-${color}`,
    };

    setCartItems((prev) => {
      const idx = prev.findIndex((item) => item.id === itemToAdd.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx].quantity += quantity;
        return updated;
      }
      return [...prev, itemToAdd];
    });

    // 3) Success toast
    setToastMessage(`${product.name} added to cart!`);
    setShowToast(true);
    return true;
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  // Update item quantity
  const updateQuantity = (itemId, quantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  // Calculate total number of items in cart
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Calculate total price
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Value to be provided to consumers
  const value = {
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    showToast,
    toastMessage,
    setShowToast,
    toastType,
    setToastType,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook for using the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
