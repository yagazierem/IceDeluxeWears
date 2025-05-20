import React, { useState, useEffect } from "react";
import { Download, Printer } from "lucide-react";

const Receipt = ({ receiptData }) => {
  // Example data structure - replace this with your API data
  const [receipt, setReceipt] = useState(
    receiptData || {
      id: "REC-2025-0042",
      receiptNumber: "REC-2025-0042",
      issueDate: "2025-05-16",
      status: "completed",
      totalAmount: 1250.0,
      taxAmount: 125.0,
      subtotal: 1125.0,
      discountAmount: 0,
      paymentMethod: "Credit Card",
      paymentDate: "2025-05-16",
      currency: "USD",

      customer: {
        id: "CUST-1234",
        name: "Acme Corporation",
        email: "billing@acmecorp.com",
        phone: "+1 (555) 123-4567",
        billingAddress: "123 Business Ave, Suite 500, San Francisco, CA 94107",
      },

      items: [
        {
          id: "ITEM-001",
          description: "Website Development Services",
          quantity: 45,
          unitPrice: 25.0,
          totalPrice: 1125.0,
          taxRate: 10,
        },
      ],

      company: {
        name: "Your Company Name",
        logo: "/api/placeholder/200/60",
        address: "456 Business Park, Floor 3, New York, NY 10001",
        phone: "+1 (555) 987-6543",
        email: "receipts@yourcompany.com",
        website: "www.yourcompany.com",
        taxId: "12-3456789",
      },

      transactionId: "TXN-2567890",
      paymentDetails: {
        cardType: "Visa",
        lastFourDigits: "4242",
        paymentProcessor: "Stripe",
      },
    }
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: receipt.currency || "USD",
    }).format(amount);
  };

  // This would fetch receipt data from your API endpoint
  useEffect(() => {
    // Example API call:
    // const fetchReceipt = async () => {
    //   try {
    //     const response = await fetch(`/api/receipts/${receiptId}`);
    //     const data = await response.json();
    //     setReceipt(data);
    //   } catch (error) {
    //     console.error("Error fetching receipt data:", error);
    //   }
    // };
    //
    // fetchReceipt();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // PDF generation logic would go here
    alert("Download functionality would be implemented here");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Action Buttons */}
        <div className="mb-6 flex justify-end space-x-4 print:hidden">
          <button
            onClick={handlePrint}
            className="flex items-center bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
          >
            <Printer className="mr-2 h-5 w-5" />
            Print
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            <Download className="mr-2 h-5 w-5" />
            Download
          </button>
        </div>

        {/* Receipt Document */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <img
                src={receipt.company.logo}
                alt={receipt.company.name}
                className="h-16 mb-4"
              />
              <p className="text-gray-700">{receipt.company.name}</p>
              <p className="text-gray-500 text-sm">{receipt.company.address}</p>
              <p className="text-gray-500 text-sm">{receipt.company.phone}</p>
              <p className="text-gray-500 text-sm">{receipt.company.email}</p>
              <p className="text-gray-500 text-sm">{receipt.company.website}</p>
            </div>
            <div className="text-right">
              <h1 className="text-2xl font-bold text-gray-800">RECEIPT</h1>
              <p className="text-gray-600 font-semibold mt-1">
                #{receipt.receiptNumber}
              </p>
              <div className="mt-4">
                <p className="text-gray-500 text-sm">
                  Date: {receipt.issueDate}
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Status:
                  <span className="ml-2 px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                    {receipt.status.toUpperCase()}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="mb-8">
            <h2 className="text-gray-700 font-semibold mb-2">Customer:</h2>
            <p className="font-medium">{receipt.customer.name}</p>
            <p className="text-gray-600 text-sm">
              {receipt.customer.billingAddress}
            </p>
            <p className="text-gray-600 text-sm">{receipt.customer.email}</p>
            <p className="text-gray-600 text-sm">{receipt.customer.phone}</p>
          </div>

          {/* Payment Information */}
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-gray-700 font-semibold mb-3">
              Payment Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Payment Method:</p>
                <p className="font-medium">{receipt.paymentMethod}</p>
                {receipt.paymentDetails?.cardType && (
                  <p className="text-gray-600 text-sm mt-1">
                    {receipt.paymentDetails.cardType} ending in{" "}
                    {receipt.paymentDetails.lastFourDigits}
                  </p>
                )}
              </div>
              <div>
                <p className="text-gray-600 text-sm">Transaction ID:</p>
                <p className="font-medium">{receipt.transactionId}</p>
                <p className="text-gray-600 text-sm mt-1">
                  Payment Date: {receipt.paymentDate}
                </p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-3 px-4 text-left font-semibold text-gray-700">
                    Item
                  </th>
                  <th className="py-3 px-4 text-right font-semibold text-gray-700">
                    Qty
                  </th>
                  <th className="py-3 px-4 text-right font-semibold text-gray-700">
                    Unit Price
                  </th>
                  <th className="py-3 px-4 text-right font-semibold text-gray-700">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {receipt.items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-800">
                        {item.description}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">{item.quantity}</td>
                    <td className="py-4 px-4 text-right">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="py-4 px-4 text-right">
                      {formatCurrency(item.totalPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="flex justify-end mb-8">
            <div className="w-64">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">
                  {formatCurrency(receipt.subtotal)}
                </span>
              </div>
              {receipt.discountAmount > 0 && (
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Discount:</span>
                  <span className="font-medium">
                    -{formatCurrency(receipt.discountAmount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between py-2">
                <span className="text-gray-600">
                  Tax ({receipt.items[0].taxRate}%):
                </span>
                <span className="font-medium">
                  {formatCurrency(receipt.taxAmount)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-t border-gray-200 font-bold text-lg">
                <span>Total Paid:</span>
                <span>{formatCurrency(receipt.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Thank You Message */}
          <div className="text-center mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-600">Thank you for your business!</p>
            <p className="text-gray-500 text-sm mt-2">
              Company Tax ID: {receipt.company.taxId}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
