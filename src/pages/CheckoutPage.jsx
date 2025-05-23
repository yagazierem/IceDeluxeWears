import React, { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { Link } from "react-router-dom";
import hero from "../assets/hero.jpg";
import { motion, useViewportScroll, useTransform } from "framer-motion";

const CheckoutPage = () => {
  const { cartItems, cartTotal } = useCart();
  const [shippingDetails, setShippingDetails] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    altPhone: "",
    email: "",
    address: "",
    country: "",
    state: "",
    city: "",
    saveAddress: false,
    note: "",
  });
  const [shippingMethod, setShippingMethod] = useState("");

  // Hero animation
  const { scrollY } = useViewportScroll();
  const y = useTransform(scrollY, [0, 300], [0, -50]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setShippingDetails((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePlaceOrder = () => {
    // TODO: order submission logic
    console.log("Placing order", { shippingDetails, cartItems });
  };

  return (
    <>
      {/* Hero Section */}
      <section
        className="relative h-[25vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${hero})` }}
      >
        {/* dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/70" />

        {/* Content wrapper */}
        <div className="relative container  h-full flex items-center">
          <h1 className="text-4xl md:text-6xl mx-auto text-center font-extrabold text-white animate-blink">
           Checkout
          </h1>
        </div>
        {/* <div className="container mx-auto px-4 py-16 md:py-24 text-center">
                    <div >
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">Shop</h1>
                        
                    </div>
                </div> */}
      </section>

      <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Shipping Details */}
        <div>
          <h2 className="text-xl font-semibold mb-6">Shipping Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="firstName"
              value={shippingDetails.firstName}
              onChange={handleChange}
              placeholder="First name *"
              className="border rounded px-3 py-2 w-full"
            />
            <input
              name="lastName"
              value={shippingDetails.lastName}
              onChange={handleChange}
              placeholder="Last name"
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <input
              name="phone"
              value={shippingDetails.phone}
              onChange={handleChange}
              placeholder="Phone *"
              className="border rounded px-3 py-2 w-full"
            />
            <input
              name="altPhone"
              value={shippingDetails.altPhone}
              onChange={handleChange}
              placeholder="Alternative Phone"
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          <input
            name="email"
            value={shippingDetails.email}
            onChange={handleChange}
            placeholder="Email address *"
            className="border rounded px-3 py-2 w-full mt-4"
          />
          <input
            name="address"
            value={shippingDetails.address}
            onChange={handleChange}
            placeholder="Shipping address *"
            className="border rounded px-3 py-2 w-full mt-4"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <select
              name="country"
              value={shippingDetails.country}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
            >
              <option value="">Country *</option>
              <option value="NG">Nigeria</option>
            </select>
            <select
              name="state"
              value={shippingDetails.state}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
            >
              <option value="">State *</option>
              <option value="FCT">FCT</option>
            </select>
          </div>
          <input
            name="city"
            value={shippingDetails.city}
            onChange={handleChange}
            placeholder="City"
            className="border rounded px-3 py-2 w-full mt-4"
          />
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              name="saveAddress"
              checked={shippingDetails.saveAddress}
              onChange={handleChange}
              className="mr-2"
            />
            <label>Save the above shipping address?</label>
          </div>
          <textarea
            name="note"
            value={shippingDetails.note}
            onChange={handleChange}
            placeholder="Note (Optional)"
            className="border rounded px-3 py-2 w-full mt-4"
            rows={3}
          />

          <h2 className="text-xl font-semibold mt-8 mb-4">Shipping Method</h2>
          <select
            name="shippingMethod"
            value={shippingMethod}
            onChange={(e) => setShippingMethod(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          >
            <option value="">Choose a shipping method *</option>
            <option value="standard">Standard (₦1,000)</option>
            <option value="express">Express (₦2,500)</option>
          </select>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-6">Your Order</h2>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    Size: {item.options.size}, Qty: {item.quantity}
                  </p>
                </div>
                <p className="font-medium">
                  ₦{(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
            <div className="border-t pt-4 flex justify-between">
              <span>Subtotal</span>
              <span>₦{cartTotal.toLocaleString()}</span>
            </div>
            {/* <div className="mt-4">
              <input
                type="text"
                placeholder="Enter coupon code"
                className="border rounded px-3 py-2 w-full"
              />
              <button className="mt-2 w-full bg-gray-900 text-white py-2 rounded hover:bg-gray-800">
                Apply
              </button>
            </div> */}
            <div className="border-t pt-4 flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>₦{cartTotal.toLocaleString()}</span>
            </div>
            <p className="mt-4 text-sm text-yellow-700 bg-yellow-100 p-3 rounded">
              Please complete your payment within <strong>30 mins</strong> to
              avoid order cancellation.
            </p>
            <button
              onClick={handlePlaceOrder}
              className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
