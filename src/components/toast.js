import React, { useEffect } from "react";
import { useCart } from "../contexts/CartContext";
import { CheckCircle, AlertCircle } from "lucide-react";

const Toast = () => {
  const { showToast, toastMessage, setShowToast, toastType } = useCart();

  // Add auto-dismiss functionality after 5 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 5000); // 5 seconds

      // Clear timeout if the component unmounts or toast is dismissed
      return () => clearTimeout(timer);
    }
  }, [showToast, setShowToast]);

  if (!showToast) return null;

  const isSuccess = toastType === "success";

  return (
    <div
      className="fixed top-4 right-4 flex items-center bg-white shadow-lg rounded-md px-4 py-3 border-l-4 z-50"
      style={{ borderLeftColor: isSuccess ? "#10B981" : "#EF4444" }}
    >
      <div className="mr-3">
        {isSuccess ? (
          <CheckCircle className="h-6 w-6 text-green-500" />
        ) : (
          <AlertCircle className="h-6 w-6 text-red-500" />
        )}
      </div>
      <div className="text-gray-700">{toastMessage}</div>
      <button
        onClick={() => setShowToast(false)}
        className="ml-4 text-gray-400 hover:text-gray-600"
      >
        ×
      </button>
    </div>
  );
};

export default Toast;
