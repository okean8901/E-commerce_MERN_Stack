import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
}

// Product API
export const productAPI = {
  getAllProducts: (page = 1, limit = 10, params = {}) =>
    api.get(`/products?page=${page}&limit=${limit}`, { params }),
  getProductById: (id) => api.get(`/products/${id}`),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
}

// Category API
export const categoryAPI = {
  getAllCategories: () => api.get('/categories'),
  getCategoryById: (id) => api.get(`/categories/${id}`),
  createCategory: (data) => api.post('/categories', data),
  updateCategory: (id, data) => api.put(`/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/categories/${id}`),
}

// Cart API
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (data) => api.post('/cart/add', data),
  updateCartItem: (data) => api.put('/cart/update', data),
  removeFromCart: (data) => api.delete('/cart/remove', { data }),
  clearCart: () => api.delete('/cart/clear'),
}

// Order API
export const orderAPI = {
  createOrder: (data) => api.post('/orders', data),
  getUserOrders: (page = 1, limit = 10) =>
    api.get(`/orders?page=${page}&limit=${limit}`),
  getOrderById: (id) => api.get(`/orders/${id}`),
  updateOrderStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  cancelOrder: (id) => api.put(`/orders/${id}/cancel`),
}

// Review API
export const reviewAPI = {
  getProductReviews: (productId, page = 1, limit = 10) =>
    api.get(`/reviews/product/${productId}?page=${page}&limit=${limit}`),
  createReview: (data) => api.post('/reviews', data),
  approveReview: (id) => api.put(`/reviews/${id}/approve`),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
}

// User API
export const userAPI = {
  getAllUsers: (page = 1, limit = 10, role = '') =>
    api.get(`/users?page=${page}&limit=${limit}&role=${role}`),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUserProfile: (data) => api.put('/users/profile', data),
  deactivateUser: (id) => api.put(`/users/${id}/deactivate`),
  activateUser: (id) => api.put(`/users/${id}/activate`),
}

// Admin API
export const adminAPI = {
  getDashboardStats: () => api.get('/admin/stats'),
  
  // Orders
  getAllOrders: (page = 1, limit = 10, status = '') =>
    api.get(`/admin/orders?page=${page}&limit=${limit}&status=${status}`),
  updateOrderStatus: (id, status) => api.put(`/admin/orders/${id}/status`, { status }),
  
  // Products
  getAllProducts: (page = 1, limit = 10, search = '') =>
    api.get(`/admin/products?page=${page}&limit=${limit}&search=${search}`),
  createProduct: (data) => api.post('/admin/products', data),
  updateProduct: (id, data) => api.put(`/admin/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  
  // Categories
  getAllCategories: () => api.get('/admin/categories'),
  createCategory: (data) => api.post('/admin/categories', data),
  updateCategory: (id, data) => api.put(`/admin/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),
  
  // Users
  getAllUsers: (page = 1, limit = 10, role = '', search = '') =>
    api.get(`/admin/users?page=${page}&limit=${limit}&role=${role}&search=${search}`),
  updateUserStatus: (id, isActive) => api.put(`/admin/users/${id}/status`, { isActive }),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  
  // Reports
  getSalesReport: (startDate, endDate) =>
    api.get('/admin/sales-report', { params: { startDate, endDate } }),
  exportData: (type) => api.get(`/admin/export?type=${type}`),
}

// Payment API
export const paymentAPI = {
  createVNPayPayment: (data) => api.post('/payment/vnpay', data),
  handleVNPayCallback: (data) => api.post('/payment/vnpay-callback', data),
  createStripePayment: (data) => api.post('/payment/stripe', data),
}

// Chatbot API
export const chatbotAPI = {
  sendMessage: (message) => api.post('/chatbot/message', { message }),
  getCommonQuestions: () => api.get('/chatbot/questions'),
}

export default api
