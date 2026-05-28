import api from './axios';

const productService = {
  // Get featured products
  getFeaturedProducts: async (config = {}) => {
    try {
      const response = await api.get('/products/featured', {
        timeout: 10000, // 10 second timeout
        ...config
      });
      
      // Ensure we always return an array with proper image URLs
      let productsData = response.data;
      
      // Handle different response structures
      if (Array.isArray(productsData)) {
        productsData = productsData;
      } else if (productsData?.data && Array.isArray(productsData.data)) {
        productsData = productsData.data;
      } else if (productsData?.products && Array.isArray(productsData.products)) {
        productsData = productsData.products;
      } else if (!Array.isArray(productsData)) {
        productsData = [];
      }
      
      // Transform each product to ensure it has a valid image URL
      const transformedProducts = productsData.map(product => ({
        ...product,
        imageUrl: productService.getValidImageUrl(product),
        categoryName: product.categoryName || product.category?.name || product.category || 'Uncategorized'
      }));
      
      return transformedProducts;
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  },

  // Get all products
  getAllProducts: async (config = {}) => {
    try {
      const response = await api.get('/products', {
        timeout: 10000,
        ...config
      });
      
      let productsData = response.data;
      
      if (Array.isArray(productsData)) {
        productsData = productsData;
      } else if (productsData?.data && Array.isArray(productsData.data)) {
        productsData = productsData.data;
      } else if (productsData?.products && Array.isArray(productsData.products)) {
        productsData = productsData.products;
      } else if (!Array.isArray(productsData)) {
        productsData = [];
      }
      
      const transformedProducts = productsData.map(product => ({
        ...product,
        imageUrl: productService.getValidImageUrl(product),
        categoryName: product.categoryName || product.category?.name || product.category || 'Uncategorized'
      }));
      
      return transformedProducts;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Get product by ID
  getProductById: async (id, config = {}) => {
    try {
      const response = await api.get(`/products/${id}`, {
        timeout: 10000,
        ...config
      });
      
      const product = response.data;
      
      // Transform single product
      return {
        ...product,
        imageUrl: productService.getValidImageUrl(product),
        categoryName: product.categoryName || product.category?.name || product.category || 'Uncategorized'
      };
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

    // Get product images by product ID
  getProductImages: async (productId) => {
    try {
      const response = await api.get(`/products/${productId}/images`);
      return response.data.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    } catch (error) {
      console.error(`Error fetching images for product ${productId}:`, error);
      return [];
    }
  },

  // Get products by category
  getProductsByCategory: async (categoryId, config = {}) => {
    try {
      const response = await api.get(`/products/category/${categoryId}`, {
        timeout: 10000,
        ...config
      });
      
      let productsData = response.data;
      
      if (Array.isArray(productsData)) {
        productsData = productsData;
      } else if (productsData?.data && Array.isArray(productsData.data)) {
        productsData = productsData.data;
      } else if (productsData?.products && Array.isArray(productsData.products)) {
        productsData = productsData.products;
      } else if (!Array.isArray(productsData)) {
        productsData = [];
      }
      
      const transformedProducts = productsData.map(product => ({
        ...product,
        imageUrl: productService.getValidImageUrl(product),
        categoryName: product.categoryName || product.category?.name || product.category || 'Uncategorized'
      }));
      
      return transformedProducts;
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  },

  // Helper function to ensure valid image URL
  getValidImageUrl: (product) => {
    const url = product?.imageUrl || product?.image || product?.img;
    
    // If valid URL exists, use it
    if (url && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/'))) {
      return url;
    }
    
    // FALLBACK: Always return a working placeholder image
    // This prevents continuous requests for missing images
    const fallbackImages = [
      'https://picsum.photos/id/20/300/300',  // Classic product
      'https://picsum.photos/id/26/300/300',  // Another product
      'https://picsum.photos/id/30/300/300',  // Tech product
      'https://picsum.photos/id/42/300/300',  // Industrial
      'https://picsum.photos/id/48/300/300',  // Modern
      'https://picsum.photos/id/58/300/300',  // Nature
      'https://picsum.photos/id/60/300/300',  // Abstract
      'https://picsum.photos/id/66/300/300',  // Tech
    ];
    
    // Use product ID to determine fallback image (consistent per product)
    const index = (product?.id || Math.floor(Math.random() * fallbacks.length)) % fallbackImages.length;
    return fallbackImages[index];
  }
};

export default productService;