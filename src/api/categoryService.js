// src/api/categoryService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const categoryService = {
  // Get all categories
  getAllCategories: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },
  
  // Get category by ID
  getCategoryById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      throw error;
    }
  },
  
  // Get products by category
  getProductsByCategory: async (categoryId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories/${categoryId}/products`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching products for category ${categoryId}:`, error);
      throw error;
    }
  },
  
  // Get category filters
  getCategoryFilters: async (categoryId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories/${categoryId}/filters`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching filters for category ${categoryId}:`, error);
      throw error;
    }
  }
};

export default categoryService;