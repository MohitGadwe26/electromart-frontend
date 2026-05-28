import React from 'react';
import styles from './UserAvatar.module.css';

const UserAvatar = ({ user, onClick }) => {
  const getUserInitials = () => {
    if (!user?.name) return '?';
    return user.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <button className={styles.userAvatar} onClick={onClick}>
      {user && user.name ? (
        <div className={styles.avatarInitials}>{getUserInitials()}</div>
      ) : (
        <svg className={styles.guestAvatar} width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M20 21V19C20 16.8 18.2 15 16 15H8C5.8 15 4 16.8 4 19V21M12 11C14.2 11 16 9.2 16 7C16 4.8 14.2 3 12 3C9.8 3 8 4.8 8 7C8 9.2 9.8 11 12 11Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      )}
    </button>
  );
};

export default UserAvatar;