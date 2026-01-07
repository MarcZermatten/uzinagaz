import { useState, useEffect } from 'react';
import { useDesktopStore } from '../../stores/desktopStore';
import { useGameStore } from '../../stores/gameStore';
import { DesktopIcon } from '../Icons/DesktopIcon';
import { Taskbar } from './Taskbar';
import { CRTScanlines } from '../Effects/CRTScanlines';
import { WindowManager } from '../Windows/WindowManager';
import { ScreenCalibrator } from './ScreenCalibrator';
import './Desktop.css';

interface Point {
  x: number;
  y: number;
}

interface ScreenBounds {
  // Coins
  topLeft: Point;
  topRight: Point;
  bottomLeft: Point;
  bottomRight: Point;
  // Points de courbure
  topMiddle: Point;
  rightMiddle: Point;
  bottomMiddle: Point;
  leftMiddle: Point;
}

export const Desktop = () => {
  const icons = useDesktopStore((state) => state.icons);
  const crtEnabled = useDesktopStore((state) => state.crtEnabled);
  const isPlaying = useGameStore((state) => state.isPlaying);
  const [showCalibrator, setShowCalibrator] = useState(false);
  const [screenBounds, setScreenBounds] = useState<ScreenBounds | null>(null);
  const [imageAspectRatio, setImageAspectRatio] = useState<number | null>(null);
  const [, forceUpdate] = useState({});

  useEffect(() => {
    // Load screen bounds from localStorage
    const saved = localStorage.getItem('zerver-screen-bounds');
    if (saved) {
      setScreenBounds(JSON.parse(saved));
    }

    // Load image to get aspect ratio
    const img = new Image();
    img.src = '/assets/retro-desk-scene.png';
    img.onload = () => {
      setImageAspectRatio(img.width / img.height);
    };

    // Listen for Ctrl+Shift+C to open calibrator
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        setShowCalibrator(prev => !prev);
      }
    };

    // Force re-render on window resize to recalculate positions
    const handleResize = () => {
      forceUpdate({});
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleSaveBounds = (bounds: ScreenBounds) => {
    setScreenBounds(bounds);
    setShowCalibrator(false);
  };

  // Calculate where the background image actually sits within the container
  const getImageBounds = () => {
    if (!imageAspectRatio) return null;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const windowAspectRatio = windowWidth / windowHeight;

    let imageWidth: number, imageHeight: number, offsetX: number, offsetY: number;

    if (windowAspectRatio > imageAspectRatio) {
      // Window is wider - image is letterboxed (bars on sides)
      imageHeight = windowHeight;
      imageWidth = windowHeight * imageAspectRatio;
      offsetX = (windowWidth - imageWidth) / 2;
      offsetY = 0;
    } else {
      // Window is taller - image is pillarboxed (bars on top/bottom)
      imageWidth = windowWidth;
      imageHeight = windowWidth / imageAspectRatio;
      offsetX = 0;
      offsetY = (windowHeight - imageHeight) / 2;
    }

    return {
      width: imageWidth,
      height: imageHeight,
      offsetX,
      offsetY,
      // Convert percentage to absolute within image
      toAbsolute: (x: number, y: number) => ({
        x: offsetX + (x / 100) * imageWidth,
        y: offsetY + (y / 100) * imageHeight,
      }),
    };
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

    const imageBounds = getImageBounds();
    if (!imageBounds) {
      return {
        top: '15%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '37%',
        height: '38%',
      };
    }

    // Calculate bounding box from all 8 points in percentage
    const xs = [
      screenBounds.topLeft.x,
      screenBounds.topRight.x,
      screenBounds.bottomLeft.x,
      screenBounds.bottomRight.x,
      screenBounds.topMiddle.x,
      screenBounds.rightMiddle.x,
      screenBounds.bottomMiddle.x,
      screenBounds.leftMiddle.x,
    ];
    const ys = [
      screenBounds.topLeft.y,
      screenBounds.topRight.y,
      screenBounds.bottomLeft.y,
      screenBounds.bottomRight.y,
      screenBounds.topMiddle.y,
      screenBounds.rightMiddle.y,
      screenBounds.bottomMiddle.y,
      screenBounds.leftMiddle.y,
    ];

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    // Convert to absolute pixels relative to image
    const topLeftAbs = imageBounds.toAbsolute(minX, minY);
    const bottomRightAbs = imageBounds.toAbsolute(maxX, maxY);

    return {
      position: 'absolute',
      top: `${topLeftAbs.y}px`,
      left: `${topLeftAbs.x}px`,
      width: `${bottomRightAbs.x - topLeftAbs.x}px`,
      height: `${bottomRightAbs.y - topLeftAbs.y}px`,
    };
  };

  // Don't show desktop when playing a game
  if (isPlaying) {
    return null;
  }

  if (showCalibrator) {
    return <ScreenCalibrator onSave={handleSaveBounds} />;
  }

  const renderClipPathSVG = () => {
    if (!screenBounds) return null;
    const imageBounds = getImageBounds();
    if (!imageBounds) return null;

    const { topLeft, topRight, bottomRight, bottomLeft, topMiddle, rightMiddle, bottomMiddle, leftMiddle } = screenBounds;

    // Convert percentage coords to absolute pixels
    const tl = imageBounds.toAbsolute(topLeft.x, topLeft.y);
    const tr = imageBounds.toAbsolute(topRight.x, topRight.y);
    const br = imageBounds.toAbsolute(bottomRight.x, bottomRight.y);
    const bl = imageBounds.toAbsolute(bottomLeft.x, bottomLeft.y);
    const tm = imageBounds.toAbsolute(topMiddle.x, topMiddle.y);
    const rm = imageBounds.toAbsolute(rightMiddle.x, rightMiddle.y);
    const bm = imageBounds.toAbsolute(bottomMiddle.x, bottomMiddle.y);
    const lm = imageBounds.toAbsolute(leftMiddle.x, leftMiddle.y);

    const pathData = `M ${tl.x} ${tl.y} Q ${tm.x} ${tm.y} ${tr.x} ${tr.y} Q ${rm.x} ${rm.y} ${br.x} ${br.y} Q ${bm.x} ${bm.y} ${bl.x} ${bl.y} Q ${lm.x} ${lm.y} ${tl.x} ${tl.y} Z`;

    return (
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <clipPath id="crt-screen-mask" clipPathUnits="userSpaceOnUse">
            <path d={pathData} />
          </clipPath>
        </defs>
      </svg>
    );
  };

  return (
    <div className="desktop-container">
      {renderClipPathSVG()}
      <div className="desk-background">
        <div
          className="monitor-frame"
          style={{
            ...getScreenStyle(),
            clipPath: screenBounds ? 'url(#crt-screen-mask)' : 'none',
          }}
        >
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
