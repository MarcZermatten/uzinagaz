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
  x: 31.5,
  y: 24.5,
  width: 37,
  height: 38.5,
};

export const DraggableScreen = () => {
  const icons = useDesktopStore((state) => state.icons);
  const [position, setPosition] = useState<ScreenPosition>(DEFAULT_POSITION);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showSavedNotification, setShowSavedNotification] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef<ScreenPosition>(position);

  // Keep position ref in sync
  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  useEffect(() => {
    // Load saved position
    const saved = localStorage.getItem('zerver-screen-position');
    if (saved) {
      try {
        const savedPos = JSON.parse(saved);
        setPosition(savedPos);
        positionRef.current = savedPos;
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

    setDragStart({
      x: e.clientX - (position.x * window.innerWidth / 100),
      y: e.clientY - (position.y * window.innerHeight / 100),
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newX = ((e.clientX - dragStart.x) / window.innerWidth) * 100;
      const newY = ((e.clientY - dragStart.y) / window.innerHeight) * 100;
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

      const newWidth = (Math.abs(dx) * 2 / window.innerWidth) * 100;
      const newHeight = (Math.abs(dy) * 2 / window.innerHeight) * 100;

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

  return (
    <>
      <div
        ref={frameRef}
        className="monitor-frame draggable-frame"
        style={{
          position: 'absolute',
          left: `${position.x}%`,
          top: `${position.y}%`,
          width: `${position.width}%`,
          height: `${position.height}%`,
        }}
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

      {/* Instructions */}
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
        Appuyez sur <strong>E</strong> pour déplacer/redimensionner l'écran
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
