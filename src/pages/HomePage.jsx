// HomePage.jsx
import React from 'react';
import Header from '../components/Home_Page/Header';
import HeroSection from '../components/HeroSection';
// import CategorySection from '../components/CategorySection';
import FeaturedProductsSection from '../components/FeaturedProductsSection';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="homepage">
      <Header />
      <main style={{ position: 'relative', zIndex: 1 }}>
        <HeroSection />
        {/* <CategorySection /> */}
        <FeaturedProductsSection />
      </main>
      <div className="homepage-content">
        {/* Additional content can go here */}
      </div>
    </div>
  );
};

export default HomePage;