import { useState } from 'react';
import type { DesktopIcon as DesktopIconType } from '../../types';
import { useWindowStore } from '../../stores/windowStore';
import './DesktopIcon.css';

interface DesktopIconProps {
  icon: DesktopIconType;
}

export const DesktopIcon = ({ icon }: DesktopIconProps) => {
  const [selected, setSelected] = useState(false);
  const openWindow = useWindowStore((state) => state.openWindow);

  const handleClick = () => {
    setSelected(true);
  };

  const handleDoubleClick = () => {
    // Open window based on icon type
    switch (icon.type) {
      case 'settings':
        openWindow('settings', 'Settings');
        break;
      case 'achievements':
        openWindow('achievements', 'Achievements');
        break;
      case 'game':
        // Launch game
        console.log('Launch game:', icon.data);
        break;
      case 'folder':
        openWindow('folder', icon.label, icon.data);
        break;
    }
  };

  const getIconImage = () => {
    switch (icon.type) {
      case 'settings':
        return '⚙️';
      case 'achievements':
        return '🏆';
      case 'recycle':
        return '🗑️';
      case 'folder':
        return '📁';
      case 'game':
        return '🎮';
      default:
        return '📄';
    }
  };

  return (
    <div
      className={`desktop-icon ${selected ? 'selected' : ''}`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onBlur={() => setSelected(false)}
      tabIndex={0}
      style={{
        position: 'absolute',
        left: icon.position.x,
        top: icon.position.y,
      }}
    >
      <div className="icon-image">{getIconImage()}</div>
      <div className="icon-label">{icon.label}</div>
    </div>
  );
};
