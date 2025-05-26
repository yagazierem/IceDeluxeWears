import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/layout";
// import HomePage from "./pages/HomePage";
import HomePage from "./pages/HomePage";
import ProductManagementDashboard from "./pages/admin/products";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import NotFoundPage from "./pages/NotFoundPage";
import AdminLogin from "./pages/admin/adminLogin";
import Dashboard from "./pages/admin/dashboard";
import CustomerTable from "./pages/admin/customer";
//  // Correct path
import ProtectedAdminLayout from "./components/AdminProtectedLayout";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import Toast from "./components/toast";
import OrderPage from "./pages/admin/orderPage";
import AdminCreateUser from "./pages/admin/createUser";
import ChangePassword from "./pages/admin/changePassword";
import ShippingModule from "./pages/admin/shipping";

function App() {
  return (
    <CartProvider>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Customer routes wrapped in Layout */}
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              {/* <Route path="products" element={<ProductsPage />} /> */}
              <Route path="cart" element={<CartPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Admin routes */}
            <Route path="admin/login" element={<AdminLogin />} />

            <Route path="admin" element={<ProtectedAdminLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<ProductManagementDashboard />} />
              <Route path="customer" element={<CustomerTable />} />
              <Route path="order" element={<OrderPage />} />
              <Route path="createUser" element={<AdminCreateUser />} />
              <Route path="changePassword" element={<ChangePassword />} />
              <Route path="shipping" element={<ShippingModule />} />

              {/* …other nested admin/* routes… */}
            </Route>
          </Routes>

          <Toast />
        </AuthProvider>
      </Router>
    </CartProvider>
  );
}

export default App;
