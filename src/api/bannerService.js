// src/api/bannerService.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const bannerService = {
  // Get active banners for homepage carousel (Public)
  getActiveBanners: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/banners/active`);
      return response.data;
    } catch (error) {
      console.error('Error fetching active banners:', error);
      throw error;
    }
  },

  // Get all banners (Admin only)
  getAllBanners: async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`${API_BASE_URL}/banners`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching all banners:', error);
      throw error;
    }
  },

  // Get banner by ID (Admin only)
  getBannerById: async (id) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`${API_BASE_URL}/banners/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching banner ${id}:`, error);
      throw error;
    }
  },

  // Create new banner (Admin only)
  createBanner: async (bannerData) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(`${API_BASE_URL}/banners`, bannerData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating banner:', error);
      throw error;
    }
  },

  // Update banner (Admin only)
  updateBanner: async (id, bannerData) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.put(`${API_BASE_URL}/banners/${id}`, bannerData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating banner ${id}:`, error);
      throw error;
    }
  },

  // Delete banner (Admin only)
  deleteBanner: async (id) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.delete(`${API_BASE_URL}/banners/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error deleting banner ${id}:`, error);
      throw error;
    }
  },

  // Toggle banner active status (Admin only)
  toggleBannerActive: async (id, active) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.patch(`${API_BASE_URL}/banners/${id}/toggle?active=${active}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error toggling banner ${id}:`, error);
      throw error;
    }
  }
};

export default bannerService;