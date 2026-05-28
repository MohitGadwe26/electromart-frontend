import api from './axios';

const userService = {
  // Get current user profile
  getCurrentUser: async () => {
    try {
      const response = await api.get('/users/profile');
      console.log('User profile response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      
      // Clear tokens on 403/401
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log('Authentication failed, clearing tokens');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
      
      throw error;
    }
  },

  // Logout user
  logout: async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          await api.post('/auth/logout', {}, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        } catch (backendError) {
          console.log('Backend logout error (ignored):', backendError);
        }
      }
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      // Always clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      const response = await api.put('/users/profile', userData);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }
};

export default userService;