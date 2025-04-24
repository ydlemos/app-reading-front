import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // Replace with your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add a response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token'); // Clear the token
      window.location.reload(); // Reload the app to log out the user
    }
    return Promise.reject(error);
  }
);

const apiMethods = {
  addBook: (bookData) => api.post('/books', bookData),
  getBooks: () => api.get('/books'),
  updateBook: (bookId, bookData) => api.put(`/books/${bookId}`, bookData),
  connectUser: (userData) => api.post('/auth/login', userData),
  createUser: (userData) => api.post('/auth/register', userData),
  deleteBook: (bookId) => api.delete(`/books/${bookId}`),
  markAsRead: (bookId) => api.patch(`/books/${bookId}/complete`),
  getUserLevelAndXp: () => api.get('/auth/xp'),
  getUserBadges: () => api.get('/badges'),
};

export default api;
export { apiMethods };
