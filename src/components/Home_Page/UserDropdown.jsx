import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './UserDropdown.module.css';

const UserDropdown = ({ user, onClose, onLogout }) => {
  const navigate = useNavigate();

  const getUserInitials = () => {
    if (!user?.name) return '?';
    return user.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleNavigation = (path) => {
    onClose();
    navigate(path);
  };

  const handleLogout = async () => {
    onClose();
    await onLogout();
  };

  const menuItems = [
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M20 21V19C20 16.8 18.2 15 16 15H8C5.8 15 4 16.8 4 19V21M12 11C14.2 11 16 9.2 16 7C16 4.8 14.2 3 12 3C9.8 3 8 4.8 8 7C8 9.2 9.8 11 12 11Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
      label: 'My Profile',
      path: '/profile'
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 6H21M19 6V20H5V6M8 6V4H16V6M12 10V16M9 13H15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
      label: 'My Orders',
      path: '/orders',
      badge: '2' // Example badge for new orders
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
      label: 'Wishlist',
      path: '/wishlist'
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M9 20L3 17V7L9 10M9 20L15 17M9 20V10M15 17L21 20V10L15 7M15 17V7M9 10L15 7M9 10L15 7M3 17L9 14M15 14L21 17M9 14L15 7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      label: 'Addresses',
      path: '/addresses'
    }
  ];

  return (
    <div className={styles.dropdownMenu}>
      <div className={styles.dropdownHeader}>
        <div className={styles.dropdownUserInfo}>
          <div className={styles.dropdownAvatar}>{getUserInitials()}</div>
          <div className={styles.dropdownUserDetails}>
            <p className={styles.dropdownName}>{user?.name || 'User'}</p>
            <p className={styles.dropdownEmail}>{user?.email || ''}</p>
          </div>
        </div>
      </div>

      <div className={styles.dropdownDivider}></div>

      <div className={styles.dropdownItems}>
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={styles.dropdownItem}
            onClick={() => handleNavigation(item.path)}
          >
            {item.icon}
            {item.label}
            {item.badge && <span className={styles.badge}>{item.badge}</span>}
          </button>
        ))}
      </div>

      <div className={styles.dropdownDivider}></div>

      <button className={`${styles.dropdownItem} ${styles.logout}`} onClick={handleLogout}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M9 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H9M16 17L21 12L16 7M21 12H9"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        Logout
      </button>
    </div>
  );
};

export default UserDropdown;