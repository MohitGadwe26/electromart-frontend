// src/api/homepageService.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const homepageService = {
  // Get dynamic homepage cards from backend
  getHomepageCards: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/homepage/cards`);
      return response.data;
    } catch (error) {
      console.error('Error fetching homepage cards:', error);
      return []; // Return empty array on error
    }
  }
};

export default homepageService;