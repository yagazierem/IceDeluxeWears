
import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';
import Endpoint from '../utils/endpoint';
import { useParams } from 'react-router-dom';


export default function PaymentVerify() {
     const [paymentStatus, setPaymentStatus] = useState('verifying'); 
   const [paymentDetails, setPaymentDetails] = useState(null);
  const [reference, setReference] = useState('');
   const [error, setError] = useState('');
     const { transactionId } = useParams();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refFromUrl = urlParams.get('reference') 
    console.log(refFromUrl, "refFromUrl")

       const paymentReference = refFromUrl || transactionId;

    if (paymentReference) {
      setReference(paymentReference);
      verifyPayment(paymentReference);
    } else {
      setPaymentStatus('error');
      setError('No payment reference found');
    }
  }, [transactionId]);

 const verifyPayment = async (paymentReference) => {
    try {
      const response = await Endpoint.verifyPayment(paymentReference);
      console.log(response, "RESPONSEEE====");
      
      if (response.status === 'success') {
        setPaymentStatus('success');
        setPaymentDetails(response.data);
      } else {
        setPaymentStatus('failed');
        setError(response.message || 'Payment verification failed');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      setPaymentStatus('error');
      setError(error.message || 'Error verifying payment');
    }
  };

 

  
  return (
     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-6 py-8 text-center">
            <h1 className="text-3xl font-bold text-white">Payment Confirmation</h1>
            <p className="text-indigo-200 mt-2">
              {paymentStatus === 'verifying' && 'Verifying your payment...'}
              {paymentStatus === 'success' && 'Your payment was successful!'}
              {paymentStatus === 'failed' && 'Payment verification failed'}
              {paymentStatus === 'error' && 'Error verifying payment'}
            </p>
          </div>
          
          {/* Body */}
          <div className="px-6 py-8">
            {paymentStatus === 'verifying' && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-6">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
                </div>
                <p className="text-gray-600">We're verifying your payment details. This may take a moment.</p>
              </div>
            )}
            
            {paymentStatus === 'success' && paymentDetails && (
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                </div>
                
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-gray-800">Thank you for your order!</h2>
                  <p className="text-gray-600 mt-2">
                    Your payment of <span className="font-bold">₦{(paymentDetails.amount / 100).toLocaleString()}</span> was successful.
                  </p>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
                  
                  <div className="space-y-4">
                    {paymentDetails.items.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <div>
                          <span className="font-medium">{item.name}</span>
                          <span className="text-gray-600 ml-2">x {item.quantity}</span>
                        </div>
                        <div className="font-medium">₦{(item.price * item.quantity).toLocaleString()}</div>
                      </div>
                    ))}
                    
                    <div className="flex justify-between border-t border-gray-200 pt-4">
                      <div className="font-bold">Total</div>
                      <div className="font-bold">₦{(paymentDetails.amount / 100).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Reference Number</p>
                      <p className="font-medium">{paymentDetails.reference}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Transaction ID</p>
                      <p className="font-medium">{paymentDetails.transactionId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium">{new Date(paymentDetails.date).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Payment Method</p>
                      <p className="font-medium">Paystack</p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>
                  <div className="flex items-center space-x-4">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                    <div>
                      <p className="font-medium">{paymentDetails.customer.name}</p>
                      <p className="text-gray-600">{paymentDetails.customer.email}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between pt-8">
                  <button className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                    View Order History
                  </button>
                  <button className="px-6 py-3 bg-indigo-600 rounded-lg text-white font-medium hover:bg-indigo-700 transition-colors">
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
            
            {(paymentStatus === 'failed' || paymentStatus === 'error') && (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Payment Verification Failed</h2>
                <p className="text-gray-600 mt-4 max-w-md mx-auto">{error}</p>
                <div className="mt-8 space-x-4">
                  <button className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors" >
                    Try Again
                  </button>
                  <button className="px-6 py-3 bg-indigo-600 rounded-lg text-white font-medium hover:bg-indigo-700 transition-colors">
                    Contact Support
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 text-center">
            <p className="text-sm text-gray-600">
              Need help? Contact our support team at <span className="text-indigo-600">info@icedeluxewears.com
</span>
            </p>
          </div>
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} IceDeluxeWears. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
