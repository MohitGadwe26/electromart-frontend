import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './NavigationLinks.module.css';

const NavigationLinks = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Brands', path: '/brands' },
    { name: 'Services', path: '/services' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className={styles.navLinks}>
      {navLinks.map((link) => (
        <a
          key={link.name}
          href={link.path}
          onClick={(e) => {
            e.preventDefault();
            navigate(link.path);
          }}
          className={`${styles.navLink} ${location.pathname === link.path ? styles.active : ''}`}
        >
          {link.name}
        </a>
      ))}
    </nav>
  );
};

export default NavigationLinks;