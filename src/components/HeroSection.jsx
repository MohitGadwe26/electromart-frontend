// src/components/HeroSection.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bannerService from '../api/bannerService';
import homepageService from '../api/homepageService';  // ✅ NEW import
import styles from './HeroSection.module.css';

const HeroSection = () => {
  const navigate = useNavigate();
  const [banners, setBanners] = useState([]);
  const [productCards, setProductCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // ✅ Fetch banners from API
      const bannersData = await bannerService.getActiveBanners();
      setBanners(bannersData || []);
      
      // ✅ Fetch product cards dynamically from backend
      const cardsData = await homepageService.getHomepageCards();
      console.log('Dynamic cards loaded:', cardsData);
      setProductCards(cardsData || []);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data');
      // Fallback: set empty array, don't use static data
      setProductCards([]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-play functionality
  useEffect(() => {
    let interval;
    if (isAutoPlaying && banners.length > 1) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, banners.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
    resetAutoPlay();
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    resetAutoPlay();
  };

  const resetAutoPlay = () => {
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const handleImageClick = (e, banner) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const imageHeight = rect.height;
    const clickPercentage = (clickY / imageHeight) * 100;
    
    if (clickPercentage <= 30 && banner.redirectUrl) {
      navigate(banner.redirectUrl);
    }
  };

  const handleProductClick = (e, product) => {
    e.stopPropagation();
    if (product.redirectUrl) {
      navigate(product.redirectUrl);
    }
  };

  const handleCardTextClick = (e, card) => {
    e.stopPropagation();
    if (card.categoryLink) {
      navigate(card.categoryLink);
    }
  };

  const handleSignInClick = () => {
    navigate('/login');
  };

  if (loading) {
    return <div className={styles.carouselLoading}>Loading amazing deals...</div>;
  }

  if (error && banners.length === 0 && productCards.length === 0) {
    return <div className={styles.carouselError}>{error}</div>;
  }

  if (banners.length === 0) {
    return null;
  }

  const currentBanner = banners[currentIndex];
  const fullImageUrl = `http://localhost:8080${currentBanner.imageUrl}`;

  // ✅ Show ALL cards when logged in, show 1 less when not logged in (for sign in card)
  // This is dynamic - works with any number of cards
  const maxCards = isLoggedIn ? productCards.length : productCards.length - 1;
  const displayedCards = productCards.slice(0, maxCards);

  return (
    <div 
      className={styles.heroCarousel}
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Main Banner Image */}
      <div className={styles.carouselSlide}>
        <div 
          className={styles.imageClickZone}
          onClick={(e) => handleImageClick(e, currentBanner)}
        >
          <img 
            src={fullImageUrl}
            alt={currentBanner.title || 'Banner'}
            className={styles.carouselImage}
            loading="eager"
          />
        </div>
      </div>

      {/* Bottom Cards Section */}
      <div className={styles.bottomCardsContainer}>
        <div className={styles.cardsWrapper}>
          {/* ✅ Product Cards - DYNAMIC from backend */}
          {displayedCards.map((card) => (
            <div key={card.id} className={styles.productCard}>
              <div 
                className={styles.cardHeaderText}
                onClick={(e) => handleCardTextClick(e, card)}
              >
                {card.cardText}
              </div>
              <div className={styles.cardImagesGrid}>
                {card.items && card.items.map((product) => (
                  <div 
                    key={product.id} 
                    className={styles.cardImageItem}
                    onClick={(e) => handleProductClick(e, product)}
                  >
                    <img 
                      src={product.imageUrl?.startsWith('http') ? product.imageUrl : `http://localhost:8080${product.imageUrl || ''}`}
                      alt={product.productName}
                      className={styles.cardProductImage}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150x150/f0f0f0/999?text=Product';
                      }}
                    />
                    <div className={styles.productOfferText}>{product.offerText}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* ✅ Sign In Card - ONLY SHOW WHEN NOT LOGGED IN */}
          {!isLoggedIn && (
            <div className={styles.signInCard}>
              <div className={styles.signInContent}>
                <div className={styles.signInIcon}>🔐</div>
                <h3 className={styles.signInTitle}>Sign in for your best experience</h3>
                <p className={styles.signInDescription}>
                  Get personalized recommendations, track orders, and enjoy exclusive offers
                </p>
                <button className={styles.signInButton} onClick={handleSignInClick}>
                  Sign in securely →
                </button>
              </div>
              <div className={styles.signInFooter}>
                <span>New customer? </span>
                <button className={styles.createAccountLink} onClick={() => navigate('/signup')}>
                  Start here
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button className={`${styles.arrow} ${styles.prev}`} onClick={prevSlide}>
            ❮
          </button>
          <button className={`${styles.arrow} ${styles.next}`} onClick={nextSlide}>
            ❯
          </button>
        </>
      )}

      {/* Dots */}
      {banners.length > 1 && (
        <div className={styles.dots}>
          {banners.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${index === currentIndex ? styles.active : ''}`}
              onClick={() => {
                setCurrentIndex(index);
                resetAutoPlay();
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroSection;