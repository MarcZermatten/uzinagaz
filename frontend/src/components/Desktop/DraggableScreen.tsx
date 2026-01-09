import { useState, useRef, useEffect } from 'react';
import { DesktopIcon } from '../Icons/DesktopIcon';
import { Taskbar } from './Taskbar';
import { WindowManager } from '../Windows/WindowManager';
import { useDesktopStore } from '../../stores/desktopStore';
import './Desktop.css';

interface ScreenPosition {
  x: number; // percentage of viewport
  y: number;
  width: number;
  height: number;
}

const DEFAULT_POSITION: ScreenPosition = {
  x: 47.558049651849075,
  y: 25.563913414435408,
  width: 43.45782719435737,
  height: 37.18113244514107,
};

export const DraggableScreen = () => {
  const icons = useDesktopStore((state) => state.icons);
  const [position, setPosition] = useState<ScreenPosition>(DEFAULT_POSITION);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showSavedNotification, setShowSavedNotification] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isEditMode, setIsEditMode] = useState(false);
  const [imageAspectRatio, setImageAspectRatio] = useState<number | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef<ScreenPosition>(position);

  // Keep position ref in sync
  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  // Load image aspect ratio
  useEffect(() => {
    const img = new Image();
    img.src = '/assets/retro-desk-scene.png';
    img.onload = () => {
      setImageAspectRatio(img.width / img.height);
    };
  }, []);

  // Calculate where the image is with object-fit: cover
  const getImageBounds = () => {
    if (!imageAspectRatio) return null;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const windowAspectRatio = windowWidth / windowHeight;

    let imageWidth: number, imageHeight: number, offsetX: number, offsetY: number;

    if (windowAspectRatio > imageAspectRatio) {
      // Window is wider - image fills width, crops top/bottom
      imageWidth = windowWidth;
      imageHeight = windowWidth / imageAspectRatio;
      offsetX = 0;
      offsetY = (windowHeight - imageHeight) / 2;
    } else {
      // Window is taller - image fills height, crops sides
      imageHeight = windowHeight;
      imageWidth = windowHeight * imageAspectRatio;
      offsetX = (windowWidth - imageWidth) / 2;
      offsetY = 0;
    }

    return { imageWidth, imageHeight, offsetX, offsetY };
  };

  useEffect(() => {
    // MIGRATION: Clear old viewport-based positions only once
    const migrated = localStorage.getItem('zerver-screen-migration-v2');
    if (!migrated) {
      console.warn('🔄 Clearing old position data - please recalibrate with new responsive system (press E)');
      localStorage.removeItem('zerver-screen-position');
      localStorage.setItem('zerver-screen-migration-v2', 'done');
    }

    // Load saved position (if any)
    const saved = localStorage.getItem('zerver-screen-position');
    if (saved) {
      try {
        const savedPos = JSON.parse(saved);
        setPosition(savedPos);
        positionRef.current = savedPos;
        console.log('✅ Loaded saved position:', savedPos);
      } catch (e) {
        console.error('Failed to load screen position:', e);
      }
    }

    // Listen for 'E' key to toggle edit mode
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'e' || e.key === 'E') {
        const frame = frameRef.current;
        if (frame) {
          const isEditing = frame.classList.contains('editing');
          if (isEditing) {
            frame.classList.remove('editing');
            setIsEditMode(false);
            // Save position using ref to get latest value
            const currentPosition = positionRef.current;
            localStorage.setItem('zerver-screen-position', JSON.stringify(currentPosition));
            console.log('✅ Position saved!', currentPosition);
            // Show notification
            setShowSavedNotification(true);
            setTimeout(() => setShowSavedNotification(false), 2000);
          } else {
            frame.classList.add('editing');
            setIsEditMode(true);
            console.log('📐 Edit mode: Drag to move, resize corners. Press E to save.');
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!frameRef.current?.classList.contains('editing')) return;

    const rect = frameRef.current.getBoundingClientRect();
    const isOnEdge =
      e.clientX < rect.left + 20 ||
      e.clientX > rect.right - 20 ||
      e.clientY < rect.top + 20 ||
      e.clientY > rect.bottom - 20;

    if (isOnEdge) {
      setIsResizing(true);
    } else {
      setIsDragging(true);
    }

    const imageBounds = getImageBounds();
    if (!imageBounds) return;

    // Calculate current position in absolute pixels
    const currentLeft = imageBounds.offsetX + (position.x / 100) * imageBounds.imageWidth;
    const currentTop = imageBounds.offsetY + (position.y / 100) * imageBounds.imageHeight;

    setDragStart({
      x: e.clientX - currentLeft,
      y: e.clientY - currentTop,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    const imageBounds = getImageBounds();
    if (!imageBounds) return;

    if (isDragging) {
      // Convert absolute position to % of image
      const absoluteX = e.clientX - dragStart.x;
      const absoluteY = e.clientY - dragStart.y;

      const imageX = absoluteX - imageBounds.offsetX;
      const imageY = absoluteY - imageBounds.offsetY;

      const newX = (imageX / imageBounds.imageWidth) * 100;
      const newY = (imageY / imageBounds.imageHeight) * 100;

      setPosition(prev => ({
        ...prev,
        x: Math.max(0, Math.min(100 - prev.width, newX)),
        y: Math.max(0, Math.min(100 - prev.height, newY)),
      }));
    } else if (isResizing && frameRef.current) {
      const rect = frameRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;

      const newWidth = (Math.abs(dx) * 2 / imageBounds.imageWidth) * 100;
      const newHeight = (Math.abs(dy) * 2 / imageBounds.imageHeight) * 100;

      setPosition(prev => ({
        ...prev,
        width: Math.max(10, Math.min(80, newWidth)),
        height: Math.max(10, Math.min(80, newHeight)),
      }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragStart]);

  // Force re-render on window resize to recalculate position
  const [, forceUpdate] = useState({});
  useEffect(() => {
    const handleResize = () => forceUpdate({});
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate absolute position from image-relative percentages
  const getAbsoluteStyle = (): React.CSSProperties => {
    const imageBounds = getImageBounds();
    if (!imageBounds) {
      // Fallback to viewport percentages if image not loaded
      return {
        position: 'absolute',
        left: `${position.x}%`,
        top: `${position.y}%`,
        width: `${position.width}%`,
        height: `${position.height}%`,
      };
    }

    // Convert image % to absolute pixels
    const left = imageBounds.offsetX + (position.x / 100) * imageBounds.imageWidth;
    const top = imageBounds.offsetY + (position.y / 100) * imageBounds.imageHeight;
    const width = (position.width / 100) * imageBounds.imageWidth;
    const height = (position.height / 100) * imageBounds.imageHeight;

    return {
      position: 'absolute',
      left: `${left}px`,
      top: `${top}px`,
      width: `${width}px`,
      height: `${height}px`,
    };
  };

  return (
    <>
      <div
        ref={frameRef}
        className="monitor-frame draggable-frame"
        style={getAbsoluteStyle()}
        onMouseDown={handleMouseDown}
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

        {/* Resize handles (visible in edit mode) */}
        <div className="resize-handle resize-nw"></div>
        <div className="resize-handle resize-ne"></div>
        <div className="resize-handle resize-sw"></div>
        <div className="resize-handle resize-se"></div>
      </div>

      {/* Save notification */}
      {showSavedNotification && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0, 200, 0, 0.95)',
          color: '#fff',
          padding: '20px 40px',
          borderRadius: '8px',
          fontSize: '18px',
          fontWeight: 'bold',
          fontFamily: 'monospace',
          border: '3px solid #00ff00',
          boxShadow: '0 0 30px rgba(0, 255, 0, 0.8)',
          zIndex: 10000,
          animation: 'fadeIn 0.2s ease-in',
        }}>
          ✅ Position sauvegardée !
        </div>
      )}
    </>
  );
};
