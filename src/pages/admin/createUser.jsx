import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Lock,
  Shield,
  Plus,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  X,
} from "lucide-react";
import Endpoint from "../../utils/endpoint";

const AdminCreateUser = () => {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "user" });
  const [loadingForm, setLoadingForm] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Fetch users
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await Endpoint.getUsers();
      console.log(res?.data?.data, "getusers")
      setUsers(res?.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => { 
    fetchUsers(); 
  }, []);

  // Validation
  const validateForm = () => {
    const newErr = {};
    if (!formData.name.trim()) newErr.name = "Name is required";
    if (!formData.email.trim()) newErr.email = "Email is required";
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErr.email = "Valid email required";
    if (!formData.password.trim()) newErr.password = "Password is required";
    if (formData.password && formData.password.length < 6) newErr.password = "Min 6 chars";
    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  // Handle form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  // Submit new user
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoadingForm(true);
    setMessage({ type: "", text: "" });
    try {
     const response = await Endpoint.createUsers(formData);
     console.log(response, "createuser!")
      setMessage({ type: "success", text: `Created ${formData.name}` });
      setFormData({ name: "", email: "", password: "", role: "user" });
      setShowModal(false)
      fetchUsers();
    } catch (err) {
      const msg = err.response?.data?.message || "Creation failed";
      setMessage({ type: "error", text: msg });
    } finally {
      setLoadingForm(false);
    }
  };

  const handleReset = () => {
    setFormData({ name: "", email: "", password: "", role: "user" });
    setErrors({});
    setMessage({ type: "", text: "" });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Admin Users</h1>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          <Plus /> Add User
        </button>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
            </tr>
          </thead>
          <tbody>
            {loadingUsers ? (
              <tr><td colSpan={3} className="px-4 py-2">Loading...</td></tr>
            ) : users?.length ? (
              users.map(u => (
                <tr key={u.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{u.name}</td>
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2 capitalize">{u.role}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={3} className="px-4 py-2">No users.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"><X /></button>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Plus className="text-blue-600" /> Create User</h2>

            {message.text && (
              <div className={`mb-4 p-3 rounded flex items-center gap-2 ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                {message.type === "success" ? <CheckCircle /> : <AlertCircle />} {message.text}
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name *</label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input name="name" value={formData.name} onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded ${errors.name ? "border-red-500" : "border-gray-300"}`} placeholder="Name" />
                </div>
                {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Email *</label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded ${errors.email ? "border-red-500" : "border-gray-300"}`} placeholder="Email" />
                </div>
                {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Password *</label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleInputChange}
                    className={`w-full pl-10 pr-10 py-2 border rounded ${errors.password ? "border-red-500" : "border-gray-300"}`} placeholder="Password" />
                  <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <div className="relative mt-1">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select name="role" value={formData.role} onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border rounded appearance-none">
                    <option>User</option><option>Admin</option><option>Moderator</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={handleReset} disabled={loadingForm}
                  className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100">Reset</button>
                <button type="submit" disabled={loadingForm}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2">
                  {loadingForm && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />} Create
                </button>
              </div>
            </form>
            <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h4 className="text-sm font-medium text-gray-800 mb-2">Password Security Tips:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Use at least 8 characters</li>
          <li>• Include uppercase and lowercase letters</li>
          <li>• Add numbers and special characters</li>
          <li>• Avoid common words or personal information</li>
        </ul>
      </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCreateUser;
