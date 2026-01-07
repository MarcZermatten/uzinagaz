import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import './Taskbar.css';

export const Taskbar = () => {
  const [showStartMenu, setShowStartMenu] = useState(false);
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const handleLogout = () => {
    clearAuth();
    setShowStartMenu(false);
  };

  const formatTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const [time, setTime] = useState(formatTime());

  // Update time every minute
  useState(() => {
    const interval = setInterval(() => {
      setTime(formatTime());
    }, 60000);
    return () => clearInterval(interval);
  });

  return (
    <div className="taskbar">
      <button
        className="start-button"
        onClick={() => setShowStartMenu(!showStartMenu)}
      >
        <span className="start-icon">🪟</span>
        <span className="start-text">Start</span>
      </button>

      {showStartMenu && (
        <div className="start-menu">
          <div className="start-menu-header">
            <div className="user-info">
              <div className="user-avatar">👤</div>
              <div className="user-name">{user?.username || 'Guest'}</div>
            </div>
          </div>
          <div className="start-menu-items">
            <div className="menu-item" onClick={() => setShowStartMenu(false)}>
              <span className="menu-icon">📁</span>
              <span>My Games</span>
            </div>
            <div className="menu-item" onClick={() => setShowStartMenu(false)}>
              <span className="menu-icon">⚙️</span>
              <span>Settings</span>
            </div>
            <div className="menu-item" onClick={() => setShowStartMenu(false)}>
              <span className="menu-icon">🏆</span>
              <span>Achievements</span>
            </div>
            <div className="menu-separator"></div>
            <div className="menu-item" onClick={handleLogout}>
              <span className="menu-icon">🚪</span>
              <span>Log Out</span>
            </div>
          </div>
        </div>
      )}

      <div className="taskbar-windows">
        {/* Open windows will appear here */}
      </div>

      <div className="system-tray">
        <div className="tray-icon">🔊</div>
        <div className="tray-clock">{time}</div>
      </div>
    </div>
  );
};
