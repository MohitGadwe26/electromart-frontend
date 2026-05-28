import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import userService from '../../api/userService';
import Logo from './Logo';
import NavigationLinks from './NavigationLinks';
import SearchBar from './SearchBar';
import UserAvatar from './UserAvatar';
import UserDropdown from './UserDropdown';
import styles from './Header.module.css';

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const dropdownRef = useRef(null);

  // Check if user is logged in
  const isLoggedIn = () => {
    const token = localStorage.getItem('accessToken');
    return !!token;
  };

  // Fetch current user on component mount
  useEffect(() => {
    if (isLoggedIn()) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchCurrentUser = async () => {
    try {
      console.log('Fetching current user...');
      const userData = await userService.getCurrentUser();
      console.log('User data:', userData);
      
      let userInfo = userData;
      if (userData.user) {
        userInfo = userData.user;
      } else if (userData.data) {
        userInfo = userData.data;
      }
      
      setUser(userInfo);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        setSessionExpired(true);
        toast.error('Session expired. Please login again.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await userService.logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  // Show loading state
  if (loading) {
    return (
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <Logo />
          <div className={styles.loadingPlaceholder}>Loading...</div>
        </div>
      </header>
    );
  }

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <Logo />
        <NavigationLinks />
        <SearchBar />
        
        {/* User Profile Dropdown */}
        <div className={styles.userMenu} ref={dropdownRef}>
          <UserAvatar user={user} onClick={() => setIsDropdownOpen(!isDropdownOpen)} />
          
          {isDropdownOpen && (
            <UserDropdown 
              user={user} 
              onClose={() => setIsDropdownOpen(false)}
              onLogout={handleLogout}
            />
          )}
        </div>
      </div>
      
      {sessionExpired && (
        <div className={styles.sessionExpiredMessage}>
          Session expired. Redirecting to login...
        </div>
      )}
    </header>
  );
};

export default Header;