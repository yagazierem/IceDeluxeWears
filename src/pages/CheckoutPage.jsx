import React, { useState, useEffect } from "react";
import { useCart } from "../contexts/CartContext";
// import { Link, useNavigate } from "react-router-dom";
import hero from "../assets/hero.jpg";
import { motion, useViewportScroll, useTransform } from "framer-motion";
import Endpoint from '../utils/endpoint';

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  // const navigate = useNavigate();
  
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
  
  // Loading and error states
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  // Hero animation
  const { scrollY } = useViewportScroll();
  const y = useTransform(scrollY, [0, 300], [0, -50]);

  // Shipping fee calculation
  const getShippingFee = () => {
    switch (shippingMethod) {
      case 'standard':
        return 1000;
      case 'express':
        return 2500;
      default:
        return 0;
    }
  };

  const shippingFee = getShippingFee();
  const finalTotal = cartTotal + shippingFee;

  // Check if cart is empty on component mount
  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      // navigate('/');
      console.log('Cart is empty, would redirect to home');
    }
  }, [cartItems]);

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!shippingDetails.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!shippingDetails.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!shippingDetails.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(shippingDetails.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!shippingDetails.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!shippingDetails.address.trim()) newErrors.address = 'Shipping address is required';
    if (!shippingDetails.country.trim()) newErrors.country = 'Country is required';
    if (!shippingDetails.state.trim()) newErrors.state = 'State is required';
    if (!shippingDetails.city.trim()) newErrors.city = 'City is required';
    if (!shippingMethod) newErrors.shippingMethod = 'Please select a shipping method';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setShippingDetails((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleShippingMethodChange = (e) => {
    setShippingMethod(e.target.value);
    if (errors.shippingMethod) {
      setErrors(prev => ({
        ...prev,
        shippingMethod: ''
      }));
    }
  };

  // Handle payment verification (called when user returns from Paystack)
  const handlePaymentVerification = async (reference) => {
    setIsPaymentLoading(true);
    try {
      // You might want to verify payment with your backend
      const verificationResponse = await Endpoint.verifyPayment(reference);
      
      if (verificationResponse?.data?.success) {
        // Clear cart on successful payment
        clearCart();
        
        // Show success message or redirect to success page
        alert('Payment successful! Your order has been placed.');
        // navigate('/order-success');
        console.log('Would redirect to order success page');
      } else {
        throw new Error('Payment verification failed');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      setApiError('Payment verification failed. Please contact support.');
    } finally {
      setIsPaymentLoading(false);
    }
  };

  // Check for payment callback on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const reference = urlParams.get('reference');
    const status = urlParams.get('status');
    
    if (reference && status === 'success') {
      handlePaymentVerification(reference);
    } else if (reference && status === 'cancelled') {
      setApiError('Payment was cancelled. Please try again.');
    }
  }, []);

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        errorElement.focus();
      }
      return;
    }
  
    if (!cartItems || cartItems.length === 0) {
      setApiError('Your cart is empty');
      return;
    }
  
    setIsProcessing(true);
    setApiError('');
  
    try {
      // Prepare checkout data according to API requirements
      const checkoutData = {
        firstName: shippingDetails.firstName,
        lastName: shippingDetails.lastName,
        email: shippingDetails.email,
        phone: shippingDetails.phone,
        alternativePhone: shippingDetails.altPhone,
        shippingAddress: shippingDetails.address,
        country: shippingDetails.country,
        state: shippingDetails.state,
        city: shippingDetails.city,
        saveAddress: shippingDetails.saveAddress,
        note: shippingDetails.note,
        shippingMethod: shippingMethod,
        shippingFee: shippingFee, // Include shipping fee
        totalAmount: finalTotal, // Include final total with shipping
        cartItems: cartItems.map(item => ({
          productId: item.productId || item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.options?.size || item.size,
          color: item.options?.color || item.color,
          image: item.images?.[0]?.url || item.image
        }))
      };
  
      console.log('Sending checkout data:', checkoutData);
  
      // Call checkout endpoint
      const response = await Endpoint.checkout(checkoutData);
      
      console.log('Full response:', response);
  
      if (response?.data?.success) {
        // Fix: Access the nested authorization_url correctly
        if (response?.data?.data?.authorization_url) {
          // Redirect to Paystack payment page
          window.location.href = response.data.data.authorization_url;
        } else {
          throw new Error('Payment URL not received from server');
        }
      } else {
        throw new Error(response?.data?.message || 'Failed to process checkout');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setApiError(
        error.response?.data?.message || 
        error.message || 
        'Failed to process checkout. Please try again.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Show loading screen during payment processing
  if (isPaymentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Verifying Payment...</h2>
          <p className="text-gray-600">Please wait while we confirm your payment.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section
        className="relative h-[25vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${hero})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/70" />
        <div className="relative container h-full flex items-center">
          <h1 className="text-4xl md:text-6xl mx-auto text-center font-extrabold text-white animate-blink">
            Checkout
          </h1>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Shipping Details */}
        <div>
          <h2 className="text-xl font-semibold mb-6">Shipping Details</h2>
          
          {/* Error Message */}
          {apiError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {apiError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                name="firstName"
                value={shippingDetails.firstName}
                onChange={handleChange}
                placeholder="First name *"
                className={`border rounded px-3 py-2 w-full ${errors.firstName ? 'border-red-500' : ''}`}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>
            <div>
              <input
                name="lastName"
                value={shippingDetails.lastName}
                onChange={handleChange}
                placeholder="Last name *"
                className={`border rounded px-3 py-2 w-full ${errors.lastName ? 'border-red-500' : ''}`}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <input
                name="phone"
                value={shippingDetails.phone}
                onChange={handleChange}
                placeholder="Phone *"
                className={`border rounded px-3 py-2 w-full ${errors.phone ? 'border-red-500' : ''}`}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>
            <input
              name="altPhone"
              value={shippingDetails.altPhone}
              onChange={handleChange}
              placeholder="Alternative Phone"
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          
          <div className="mt-4">
            <input
              name="email"
              value={shippingDetails.email}
              onChange={handleChange}
              placeholder="Email address *"
              className={`border rounded px-3 py-2 w-full ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          
          <div className="mt-4">
            <input
              name="address"
              value={shippingDetails.address}
              onChange={handleChange}
              placeholder="Shipping address *"
              className={`border rounded px-3 py-2 w-full ${errors.address ? 'border-red-500' : ''}`}
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <select
                name="country"
                value={shippingDetails.country}
                onChange={handleChange}
                className={`border rounded px-3 py-2 w-full ${errors.country ? 'border-red-500' : ''}`}
              >
                <option value="">Country *</option>
                <option value="NG">Nigeria</option>
              </select>
              {errors.country && (
                <p className="text-red-500 text-sm mt-1">{errors.country}</p>
              )}
            </div>
            <div>
              <select
                name="state"
                value={shippingDetails.state}
                onChange={handleChange}
                className={`border rounded px-3 py-2 w-full ${errors.state ? 'border-red-500' : ''}`}
              >
                <option value="">State *</option>
                <option value="FCT">FCT</option>
                <option value="Lagos">Lagos</option>
                <option value="Abuja">Abuja</option>
              </select>
              {errors.state && (
                <p className="text-red-500 text-sm mt-1">{errors.state}</p>
              )}
            </div>
          </div>
          
          <div className="mt-4">
            <input
              name="city"
              value={shippingDetails.city}
              onChange={handleChange}
              placeholder="City *"
              className={`border rounded px-3 py-2 w-full ${errors.city ? 'border-red-500' : ''}`}
            />
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city}</p>
            )}
          </div>
          
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
          <div>
            <select
              name="shippingMethod" 
              value={shippingMethod}
              onChange={handleShippingMethodChange}
              className={`border rounded px-3 py-2 w-full ${errors.shippingMethod ? 'border-red-500' : ''}`}
            >
              <option value="">Choose a shipping method *</option>
              <option value="standard">Standard Shipping - ₦1,000</option>
              <option value="express">Express Shipping - ₦2,500</option>
            </select>
            {errors.shippingMethod && (
              <p className="text-red-500 text-sm mt-1">{errors.shippingMethod}</p>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-6">Your Order</h2>
          <div className="space-y-4">
            {cartItems && cartItems.map((item, index) => (
              <div key={item.id || index} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    Size: {item.options?.size || item.size}, Color: {item.options?.color || item.color}, Qty: {item.quantity}
                  </p>
                </div>
                <p className="font-medium">
                  ₦{(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
            
            {/* Subtotal */}
            <div className="border-t pt-4 flex justify-between">
              <span>Subtotal</span>
              <span>₦{cartTotal.toLocaleString()}</span>
            </div>
            
            {/* Shipping Fee */}
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span>
                {shippingFee > 0 ? `₦${shippingFee.toLocaleString()}` : 'Select shipping method'}
              </span>
            </div>
            
            {/* Final Total */}
            <div className="border-t pt-4 flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>₦{finalTotal.toLocaleString()}</span>
            </div>
            
            <p className="mt-4 text-sm text-yellow-700 bg-yellow-100 p-3 rounded">
              Please complete your payment within <strong>30 mins</strong> to
              avoid order cancellation.
            </p>
            <button
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className={`w-full py-3 rounded text-white font-semibold ${
                isProcessing 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                `Pay ₦${finalTotal.toLocaleString()}`
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;