// src/pages/ProductDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import productService from '../api/productService';
import ProductImageGallery from '../components/ProductImageGallery';
import styles from './ProductDetailPage.module.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const [productData, imagesData] = await Promise.all([
        productService.getProductById(id),
        productService.getProductImages(id)
      ]);
      setProduct(productData);
      setImages(imagesData);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    toast.success(`${product?.name} added to cart!`);
  };

  const handleBuyNow = () => {
    toast.success(`Proceeding to checkout for ${product?.name}`);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.errorContainer}>
        <h2>Product Not Found</h2>
        <button onClick={() => navigate('/')} className={styles.backBtn}>
          Back to Home
        </button>
      </div>
    );
  }

  const originalPrice = product.originalPrice || product.price;
  const discountPercentage = product.discountPercentage || 0;
  const discountedPrice = discountPercentage > 0 
    ? originalPrice - (originalPrice * discountPercentage / 100)
    : product.price;

  return (
    <div className={styles.productDetailPage}>
      <div className={styles.container}>
        <div className={styles.breadcrumb}>
          <span onClick={() => navigate('/')}>Home</span>
          <span>/</span>
          <span onClick={() => navigate(`/category/${product.categoryId}`)}>
            {product.categoryName || 'Products'}
          </span>
          <span>/</span>
          <span className={styles.current}>{product.name}</span>
        </div>

        <div className={styles.productContent}>
          <div className={styles.productGallery}>
            <ProductImageGallery productId={id} images={images} />
          </div>

          <div className={styles.productInfo}>
            <h1 className={styles.productTitle}>{product.name}</h1>
            
            <div className={styles.priceSection}>
              {discountPercentage > 0 ? (
                <>
                  <span className={styles.discountedPrice}>₹{discountedPrice.toFixed(2)}</span>
                  <span className={styles.originalPrice}>₹{originalPrice.toFixed(2)}</span>
                  <span className={styles.discountBadge}>{discountPercentage}% OFF</span>
                </>
              ) : (
                <span className={styles.price}>₹{product.price}</span>
              )}
            </div>

            <div className={styles.stockStatus}>
              {product.stock > 0 ? (
                <span className={styles.inStock}>✓ In Stock ({product.stock} available)</span>
              ) : (
                <span className={styles.outOfStock}>✗ Out of Stock</span>
              )}
            </div>

            <div className={styles.descriptionSection}>
              <h3>Product Description</h3>
              <p>{product.description}</p>
            </div>

            {product.stock > 0 && (
              <div className={styles.quantitySection}>
                <label>Quantity:</label>
                <div className={styles.quantitySelector}>
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>-</button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} disabled={quantity >= product.stock}>+</button>
                </div>
              </div>
            )}

            <div className={styles.actionButtons}>
              <button className={styles.addToCartBtn} onClick={handleAddToCart} disabled={product.stock === 0}>
                🛒 Add to Cart
              </button>
              <button className={styles.buyNowBtn} onClick={handleBuyNow} disabled={product.stock === 0}>
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;