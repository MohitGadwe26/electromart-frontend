// src/components/ProductCard.jsx
import React, { memo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ProductCard.module.css';

const ProductCard = memo(({ product, onAddToCart }) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [usePlaceholder, setUsePlaceholder] = useState(false);
  
  // Reset error state when product changes
  useEffect(() => {
    setImageError(false);
    setRetryCount(0);
    setUsePlaceholder(false);
  }, [product.id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  // Don't render if product is invalid
  if (!product || !product.id) {
    console.warn('Invalid product:', product);
    return null;
  }

  const getImageUrl = () => {
    if (usePlaceholder) {
      const productName = product.name.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);
      return `http://localhost:8080/api/images/placeholder/${product.id}/${productName}`;
    }
    
    if (imageError) {
      return null;
    }
    
    const url = product.imageUrl || product.image || product.img;
    
    if (!url) {
      return null;
    }
    
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    if (url.startsWith('/')) {
      const backendUrl = 'http://localhost:8080';
      return `${backendUrl}${url}`;
    }
    
    return `http://localhost:8080/${url}`;
  };

  const handleImageError = () => {
    console.warn(`Image failed to load for product ${product.id}`);
    
    if (retryCount === 0 && !usePlaceholder) {
      console.log(`Using backend placeholder for product ${product.id}`);
      setUsePlaceholder(true);
      setRetryCount(1);
    } else if (retryCount === 1 && !imageError) {
      console.log(`All image attempts failed for product ${product.id}`);
      setImageError(true);
    }
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart && onAddToCart(product);
  };

  const imageUrl = getImageUrl();
  
  return (
    <div className={styles.productCard} onClick={handleCardClick}>
      <div className={styles.productImageContainer}>
        {imageUrl && !imageError ? (
          <img 
            src={imageUrl}
            alt={product.name || 'Product'}
            className={styles.productImage}
            loading="lazy"
            onError={handleImageError}
            onLoad={() => console.log(`✅ Image loaded for ${product.name}`)}
          />
        ) : (
          <div className={styles.noImage}>
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="2" width="20" height="20" rx="2.18" />
              <circle cx="8.5" cy="8.5" r="2.5" />
              <path d="M21 15l-5-4-3 3-4-4-5 5" />
            </svg>
            <p>No Image</p>
          </div>
        )}
        {(product.featured || product.isFeatured) && (
          <span className={styles.featuredBadgeSmall}>Featured</span>
        )}
      </div>
      
      <div className={styles.productInfo}>
        <h3 className={styles.productName}>{product.name || 'Product Name'}</h3>
        <p className={styles.productCategory}>
          {product.categoryName || product.category?.name || product.category || 'Uncategorized'}
        </p>
        <div className={styles.productPriceRow}>
          <span className={styles.productPrice}>{formatPrice(product.price)}</span>
          <button 
            className={styles.addToCartBtn}
            onClick={handleAddToCartClick}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;