import React, { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'react-toastify';
import productService from '../api/productService';
import ProductCard from './ProductCard';
import styles from './FeaturedProductsSection.module.css';

const FeaturedProductsSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchCalled = useRef(false);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    // Cleanup function to abort pending requests
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    // Prevent double fetching in React StrictMode
    if (!fetchCalled.current) {
      fetchCalled.current = true;
      fetchFeaturedProducts();
    }
  }, []); // Empty dependency array - fetch only once

  const fetchFeaturedProducts = useCallback(async () => {
    // Cancel previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    try {
      setLoading(true);
      const response = await productService.getFeaturedProducts({
        signal: abortControllerRef.current.signal
      });
      
      // Handle different response structures
      let productsData = [];
      if (Array.isArray(response)) {
        productsData = response;
      } else if (response?.data && Array.isArray(response.data)) {
        productsData = response.data;
      } else if (response?.products && Array.isArray(response.products)) {
        productsData = response.products;
      } else {
        console.warn('Unexpected API response format:', response);
        productsData = [];
      }
      
      // Transform products with guaranteed image URL
      const transformedProducts = productsData.map(product => ({
        ...product,
        // CRITICAL FIX: Always provide a valid image URL
        imageUrl: getValidImageUrl(product),
        categoryName: product.categoryName || product.category?.name || product.category
      }));
      
      setProducts(transformedProducts);
      setError(null);
    } catch (err) {
      // Don't set error if request was aborted
      if (err.name === 'AbortError') {
        console.log('Fetch aborted');
        return;
      }
      
      console.error('Error loading featured products:', err);
      setError(err.response?.status === 403 || err.response?.status === 401 
        ? 'Please login to view products' 
        : 'Failed to load products');
      toast.error('Failed to load featured products');
    } finally {
      setLoading(false);
    }
  }, []);

  // Helper function to ensure valid image URL
  const getValidImageUrl = (product) => {
    const url = product.imageUrl || product.image || product.img;
    
    // If URL exists and is valid, use it
    if (url && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/'))) {
      return url;
    }
    
    // FALLBACK: Use a working placeholder image
    // This prevents continuous requests for missing images
    return 'https://picsum.photos/id/20/300/300';
  };

  const handleAddToCart = (product) => {
    toast.success(`${product.name} added to cart!`);
  };

  const handleRetry = () => {
    fetchCalled.current = false;
    fetchFeaturedProducts();
  };

  if (loading) {
    return (
      <section className={styles.featuredProducts}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Featured Products</h2>
          </div>
          <div className={styles.productsGrid}>
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className={styles.productCardSkeleton}>
                <div className={styles.skeletonImage}></div>
                <div className={styles.skeletonInfo}>
                  <div className={styles.skeletonTitle}></div>
                  <div className={styles.skeletonCategory}></div>
                  <div className={styles.skeletonPrice}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.featuredProducts}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Featured Products</h2>
          </div>
          <div className={styles.errorContainer}>
            <p className={styles.errorMessage}>{error}</p>
            <button onClick={handleRetry} className={styles.retryBtn}>
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className={styles.featuredProducts}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Featured Products</h2>
          <a href="/shop" className={styles.viewAllLink}>
            View All <span className={styles.arrow}>→</span>
          </a>
        </div>
        
        <div className={styles.productsGrid}>
          {products.slice(0, 8).map((product) => (
            <ProductCard 
              key={product.id || product._id || Math.random()} 
              product={product} 
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProductsSection;