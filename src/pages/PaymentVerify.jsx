import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Endpoint from '../utils/endpoint';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function PaymentVerify() {
  const [paymentStatus, setPaymentStatus] = useState('verifying');
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState('');
  const { transactionId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const refFromUrl = urlParams.get('reference') || urlParams.get('trxref');
        const paymentReference = refFromUrl || transactionId;

        if (!paymentReference) {
          throw new Error('No payment reference found');
        }

        const response = await Endpoint.verifyPayment(paymentReference);
        console.log('Verification Response:', response);

        if (response.success && response.data.paymentStatus === 'completed') {
          setPaymentStatus('success');
          setOrderDetails(response.data.order);
        } else {
          setPaymentStatus('failed');
          setError(response.message || 'Payment not completed');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setPaymentStatus('error');
        setError(error.message || 'Error verifying payment');
        setTimeout(() => navigate('/'), 5000);
      }
    };

    verifyPayment();
  }, [transactionId, navigate]);

  if (paymentStatus === 'verifying') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 mx-auto animate-spin text-indigo-600" />
          <p className="mt-4 text-lg">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'success' && orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-green-500 px-6 py-8 text-center">
            <CheckCircle className="w-16 h-16 mx-auto text-white" />
            <h1 className="text-2xl font-bold text-white mt-4">Payment Successful!</h1>
            <p className="text-green-100 mt-2">
              Thank you for your order #{orderDetails.orderNumber}
            </p>
          </div>

          {/* Order Summary */}
          <div className="px-6 py-8">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-4">
              {orderDetails.items.map((item, index) => (
                <div key={index} className="flex justify-between border-b pb-2">
                  <div>
                    <span className="font-medium">Item {index + 1}</span>
                    <span className="text-gray-600 ml-2">x {item.quantity}</span>
                  </div>
                  <div>₦{item.price.toLocaleString()}</div>
                </div>
              ))}

              <div className="flex justify-between font-bold border-t pt-4">
                <div>Total</div>
                <div>₦{orderDetails.totalAmount.toLocaleString()}</div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Shipping Details</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p>{orderDetails.shippingAddress.street}</p>
                <p>
                  {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state}
                </p>
                <p>{orderDetails.shippingAddress.country}</p>
              </div>
            </div>

            {/* Payment Reference */}
            <div className="mt-6">
              <p className="text-sm text-gray-500">Payment Reference</p>
              <p className="font-mono">{orderDetails.paymentDetails.reference}</p>
            </div>

            {/* Actions */}
            <div className="mt-8 flex justify-between">
              <button 
                onClick={() => navigate('/orders')}
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
              >
                View Orders
              </button>
              <button 
                onClick={() => navigate('/')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Continue Shopping
              </button>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Need help? Contact support at <a href="mailto:info@icedeluxewears.com" className="text-indigo-600">info@icedeluxewears.com</a></p>
            <p className="mt-1">© {new Date().getFullYear()} IceDeluxeWears. All rights reserved.</p>
          </div>
        </div>
      </div>
    );
  }

  // Error/Failed state
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <XCircle className="w-16 h-16 mx-auto text-red-500" />
        <h1 className="text-2xl font-bold mt-4">Payment Verification Failed</h1>
        <p className="mt-2 text-red-600">{error}</p>
        <button 
          onClick={() => navigate('/')}
          className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Return Home
        </button>
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Need help? Contact support at <a href="mailto:info@icedeluxewears.com" className="text-indigo-600">info@icedeluxewears.com</a></p>
          <p className="mt-1">© {new Date().getFullYear()} IceDeluxeWears. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}