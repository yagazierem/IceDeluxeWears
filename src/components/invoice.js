import React, { useState, useEffect } from "react";
import { Download, Printer, Send } from "lucide-react";

const Invoice = ({ invoiceData }) => {
  // Example data structure - replace this with your API data
  const [invoice, setInvoice] = useState(
    invoiceData || {
      id: "INV-2025-0042",
      invoiceNumber: "INV-2025-0042",
      issueDate: "2025-05-16",
      dueDate: "2025-06-15",
      status: "pending",
      totalAmount: 1250.0,
      taxAmount: 125.0,
      subtotal: 1125.0,
      discountAmount: 0,
      paymentMethod: "",
      currency: "USD",

      customer: {
        id: "CUST-1234",
        name: "Acme Corporation",
        email: "billing@acmecorp.com",
        phone: "+1 (555) 123-4567",
        billingAddress: "123 Business Ave, Suite 500, San Francisco, CA 94107",
        shippingAddress: "123 Business Ave, Suite 500, San Francisco, CA 94107",
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
        email: "invoices@yourcompany.com",
        website: "www.yourcompany.com",
        taxId: "12-3456789",
      },

      transactionId: "",
      notes:
        "Payment due within 30 days. Please include invoice number with your payment.",
    }
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: invoice.currency || "USD",
    }).format(amount);
  };

  // This would fetch invoice data from your API endpoint
  useEffect(() => {
    // Example API call:
    // const fetchInvoice = async () => {
    //   try {
    //     const response = await fetch(/api/invoices/${invoiceId});
    //     const data = await response.json();
    //     setInvoice(data);
    //   } catch (error) {
    //     console.error("Error fetching invoice data:", error);
    //   }
    // };
    //
    // fetchInvoice();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // PDF generation logic would go here
    alert("Download functionality would be implemented here");
  };

  const handleSend = () => {
    // Email sending logic would go here
    alert("Email sending functionality would be implemented here");
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
          <button
            onClick={handleSend}
            className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            <Send className="mr-2 h-5 w-5" />
            Send
          </button>
        </div>

        {/* Invoice Document */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <img
                src={invoice.company.logo}
                alt={invoice.company.name}
                className="h-16 mb-4"
              />
              <p className="text-gray-700">{invoice.company.name}</p>
              <p className="text-gray-500 text-sm">{invoice.company.address}</p>
              <p className="text-gray-500 text-sm">{invoice.company.phone}</p>
              <p className="text-gray-500 text-sm">{invoice.company.email}</p>
              <p className="text-gray-500 text-sm">{invoice.company.website}</p>
            </div>
            <div className="text-right">
              <h1 className="text-2xl font-bold text-gray-800">INVOICE</h1>
              <p className="text-gray-600 font-semibold mt-1">
                #{invoice.invoiceNumber}
              </p>
              <div className="mt-4">
                <p className="text-gray-500 text-sm">
                  Issue Date: {invoice.issueDate}
                </p>
                <p className="text-gray-500 text-sm">
                  Due Date: {invoice.dueDate}
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Status:
                  <span
                    className={`ml-2 px-2 py-1 text-xs rounded-full ${
                      invoice.status === "paid"
                        ? "bg-green-100 text-green-800"
                        : invoice.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {invoice.status.toUpperCase()}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Bill To / Ship To */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-gray-700 font-semibold mb-2">Bill To:</h2>
              <p className="font-medium">{invoice.customer.name}</p>
              <p className="text-gray-600 text-sm">
                {invoice.customer.billingAddress}
              </p>
              <p className="text-gray-600 text-sm">{invoice.customer.email}</p>
              <p className="text-gray-600 text-sm">{invoice.customer.phone}</p>
            </div>
            <div>
              <h2 className="text-gray-700 font-semibold mb-2">Ship To:</h2>
              <p className="text-gray-600 text-sm">
                {invoice.customer.shippingAddress}
              </p>
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
                {invoice.items.map((item) => (
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
                  {formatCurrency(invoice.subtotal)}
                </span>
              </div>
              {invoice.discountAmount > 0 && (
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Discount:</span>
                  <span className="font-medium">
                    -{formatCurrency(invoice.discountAmount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between py-2">
                <span className="text-gray-600">
                  Tax ({invoice.items[0].taxRate}%):
                </span>
                <span className="font-medium">
                  {formatCurrency(invoice.taxAmount)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-t border-gray-200 font-bold text-lg">
                <span>Total:</span>
                <span>{formatCurrency(invoice.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold text-gray-700 mb-2">Notes</h3>
              <p className="text-gray-600 text-sm">{invoice.notes}</p>
            </div>
          )}

          {/* Payment Info */}
          <div className="border-t border-gray-200 mt-6 pt-4">
            <h3 className="font-semibold text-gray-700 mb-2">
              Payment Information
            </h3>
            <p className="text-gray-600 text-sm">
              Please make payment by the due date.
            </p>
            <p className="text-gray-600 text-sm mt-1">
              Company Tax ID: {invoice.company.taxId}
            </p>
          </div>

          {/* Thank You Message */}
          <div className="text-center mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-600">Thank you for your business!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
