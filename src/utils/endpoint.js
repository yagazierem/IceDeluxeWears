import axios from "axios";
import { TOKEN_KEY, getUserToken } from "./auth";

const token = getUserToken();

// let headers = {
//   Accept: "application/json",
//   "Content-Type": "application/json",
//   Authorization: localStorage.getItem(TOKEN_KEY),
// };
// const formDataHeaders = {
//   Accept: "application/json",
//   "Content-Type": "multipart/form-data",
//   Authorization: localStorage.getItem(TOKEN_KEY),
// };

const Endpoint = {
  init: (tokenOverride = null) => {
    // Use the provided token or get it from localStorage
    const token = tokenOverride || localStorage.getItem(TOKEN_KEY);

    // Set the Authorization header if token exists
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }

    // axios.defaults.baseURL = "https://api.icedeluxewears.com";

    axios.defaults.baseURL =
      process.env.REACT_APP_API_URL || "https://api.icedeluxewears.com";

    // Set default headers
    axios.defaults.headers.common["Accept"] = "application/json";
    axios.defaults.headers.common["Content-Type"] = "application/json";

    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (!error.response) {
          console.error("Network error occurred");
        } else if (
          error.response &&
          error.response.status === 401 &&
          error.response.config.url !== "/"
        ) {
          // Handle unauthorized access - could dispatch logout here
          console.error("Authentication error");
          // You could call logout function here if you export it properly
          localStorage.removeItem(TOKEN_KEY);
          window.location.href = "/admin/login";
          return;
        }

        return Promise.reject(error.response || error);
      }
    );
  },

  login: (data) => {
    return axios.post("/auth/login", data);
  },
  getDashboardData: (data) => {
    return axios.get("/admin/dashboard", data);
  },
  getAllCategories: (data) => {
    return axios.get("/categories", data);
  },
  createCategory: (data) => {
    return axios.post("/categories", data);
  },
  getProducts: (data) => {
    return axios.get("/products", data);
  },
  createProduct: (data) => {
    const customHeaders = {
      "Content-Type": "multipart/form-data",
    };

    return axios.post("/products", data, { headers: customHeaders });
  },
  updateProduct: (productId, data) => {
    const customHeaders = { "Content-Type": "multipart/form-data" };
    return axios.patch(`/products/${productId}`, data, {
      headers: customHeaders,
    });
  },
  deleteProduct: (productId) => {
    return axios.delete(`/products/${productId}`);
  },
  updateCategory: (categoryId, data) => {
    return axios.patch(`/categories/${categoryId}`, data);
  },
  deleteCategory: (categoryId) => {
    return axios.delete(`/categories/${categoryId}`);
  },
  createUsers: (data) => {
    return axios.post(`/admin/users`, data);
  },
  getUsers: (data) => {
    return axios.get(`/admin/users`, data);
  },
  checkout: (data) => {
    return axios.post(`/checkout/guest`, data);
  },
};

export default Endpoint;
