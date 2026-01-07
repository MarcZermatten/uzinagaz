import { useState, useEffect } from 'react';
import { useDesktopStore } from '../../stores/desktopStore';
import { useGameStore } from '../../stores/gameStore';
import { DesktopIcon } from '../Icons/DesktopIcon';
import { Taskbar } from './Taskbar';
import { CRTScanlines } from '../Effects/CRTScanlines';
import { WindowManager } from '../Windows/WindowManager';
import { ScreenCalibrator } from './ScreenCalibrator';
import './Desktop.css';

interface ScreenBounds {
  topLeft: { x: number; y: number };
  topRight: { x: number; y: number };
  bottomLeft: { x: number; y: number };
  bottomRight: { x: number; y: number };
}

export const Desktop = () => {
  const icons = useDesktopStore((state) => state.icons);
  const crtEnabled = useDesktopStore((state) => state.crtEnabled);
  const isPlaying = useGameStore((state) => state.isPlaying);
  const [showCalibrator, setShowCalibrator] = useState(false);
  const [screenBounds, setScreenBounds] = useState<ScreenBounds | null>(null);

  useEffect(() => {
    // Load screen bounds from localStorage
    const saved = localStorage.getItem('zerver-screen-bounds');
    if (saved) {
      setScreenBounds(JSON.parse(saved));
    }

    // Listen for Ctrl+Shift+C to open calibrator
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        setShowCalibrator(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSaveBounds = (bounds: ScreenBounds) => {
    setScreenBounds(bounds);
    setShowCalibrator(false);
  };

  const getClipPath = () => {
    if (!screenBounds) return 'none';
    const { topLeft, topRight, bottomRight, bottomLeft } = screenBounds;
    return `polygon(${topLeft.x}% ${topLeft.y}%, ${topRight.x}% ${topRight.y}%, ${bottomRight.x}% ${bottomRight.y}%, ${bottomLeft.x}% ${bottomLeft.y}%)`;
  };

  const getScreenStyle = (): React.CSSProperties => {
    if (!screenBounds) {
      // Default positioning if no calibration
      return {
        top: '15%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '37%',
        height: '38%',
      };
    }

    // Calculate bounding box from the 4 corners
    const xs = [screenBounds.topLeft.x, screenBounds.topRight.x, screenBounds.bottomLeft.x, screenBounds.bottomRight.x];
    const ys = [screenBounds.topLeft.y, screenBounds.topRight.y, screenBounds.bottomLeft.y, screenBounds.bottomRight.y];

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    return {
      top: `${minY}%`,
      left: `${minX}%`,
      width: `${maxX - minX}%`,
      height: `${maxY - minY}%`,
      transform: 'none',
      clipPath: getClipPath(),
    };
  };

  // Don't show desktop when playing a game
  if (isPlaying) {
    return null;
  }

  if (showCalibrator) {
    return <ScreenCalibrator onSave={handleSaveBounds} />;
  }

  return (
    <div className="desktop-container">
      <div className="desk-background">
        <div className="monitor-frame" style={getScreenStyle()}>
          <div className="monitor-screen">
            <div className="desktop-wallpaper">
              <div className="desktop-icons">
                {icons.map((icon) => (
                  <DesktopIcon key={icon.id} icon={icon} />
                ))}
              </div>
              <WindowManager />
            </div>
            <Taskbar />
          </div>
        </div>
      </div>
      {crtEnabled && <CRTScanlines />}

      {/* Calibration hint */}
      <div style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        background: 'rgba(0, 0, 0, 0.8)',
        color: '#00ff00',
        padding: '8px 12px',
        borderRadius: '4px',
        fontSize: '12px',
        fontFamily: 'monospace',
        border: '1px solid #00ff00',
        zIndex: 9999,
      }}>
        Appuyez sur <strong>Ctrl+Shift+C</strong> pour calibrer l'écran
      </div>
    </div>
  );
};
