import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Logo.module.css';

const Logo = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.logo} onClick={() => navigate('/')}>
      <div className={styles.logoIcon}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M13 2L4 14H12L11 22L20 10H12L13 2Z" 
            fill="url(#gradient)"
            stroke="url(#gradient)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#6366f1' }} />
              <stop offset="100%" style={{ stopColor: '#8b5cf6' }} />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className={styles.logoText}>
        <span className={styles.logoMain}>ELECTRO</span>
        <span className={styles.logoSub}>SOURCE</span>
      </div>
    </div>
  );
};

export default Logo;