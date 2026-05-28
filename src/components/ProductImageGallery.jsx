// src/components/ProductImageGallery.jsx
import React, { useState, useEffect } from 'react';
import productService from '../api/productService';
import styles from './ProductImageGallery.module.css';

const ProductImageGallery = ({ productId, images: propImages }) => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    if (propImages && propImages.length > 0) {
      setImages(propImages);
      setLoading(false);
    } else if (productId) {
      fetchImages();
    } else {
      setLoading(false);
    }
  }, [productId, propImages]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const data = await productService.getProductImages(productId);
      setImages(data);
    } catch (error) {
      console.error('Error fetching product images:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.galleryLoader}>Loading images...</div>;
  }

  if (!images || images.length === 0) {
    return (
      <div className={styles.noImageContainer}>
        <div className={styles.noImage}>No Image Available</div>
      </div>
    );
  }

  const currentImage = images[currentIndex];
  const hasNext = currentIndex < images.length - 1;
  const hasPrev = currentIndex > 0;

  const nextImage = () => {
    if (hasNext) setCurrentIndex(currentIndex + 1);
  };

  const prevImage = () => {
    if (hasPrev) setCurrentIndex(currentIndex - 1);
  };

  const goToImage = (index) => {
    setCurrentIndex(index);
  };

  const getImageUrl = (url) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `http://localhost:8080${url}`;
  };

  return (
    <div className={styles.gallery}>
      <div className={styles.mainImageContainer}>
        <img
          src={getImageUrl(currentImage.imageUrl)}
          alt={currentImage.altText || 'Product image'}
          className={`${styles.mainImage} ${isZoomed ? styles.zoomed : ''}`}
          onClick={() => setIsZoomed(!isZoomed)}
        />

        {images.length > 1 && (
          <>
            <button
              className={`${styles.arrow} ${styles.prevArrow}`}
              onClick={prevImage}
              disabled={!hasPrev}
            >
              ❮
            </button>
            <button
              className={`${styles.arrow} ${styles.nextArrow}`}
              onClick={nextImage}
              disabled={!hasNext}
            >
              ❯
            </button>
          </>
        )}

        <div className={styles.counter}>
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {images.length > 1 && (
        <div className={styles.thumbnails}>
          {images.map((image, index) => (
            <div
              key={image.id || index}
              className={`${styles.thumbnail} ${index === currentIndex ? styles.activeThumbnail : ''}`}
              onClick={() => goToImage(index)}
            >
              <img
                src={getImageUrl(image.imageUrl)}
                alt={`Thumbnail ${index + 1}`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;