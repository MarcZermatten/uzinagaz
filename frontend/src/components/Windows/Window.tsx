import { Rnd } from 'react-rnd';
import { motion, AnimatePresence } from 'framer-motion';
import type { WindowData } from '../../types';
import { useWindowStore } from '../../stores/windowStore';
import './Window.css';

interface WindowProps {
  window: WindowData;
  children?: React.ReactNode;
}

export const Window = ({ window, children }: WindowProps) => {
  const {
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    bringToFront,
    updateWindowPosition,
    updateWindowSize,
  } = useWindowStore();

  const handleDragStop = (_e: any, data: { x: number; y: number }) => {
    console.log('Drag stop:', window.id, 'Position:', data.x, data.y);
    updateWindowPosition(window.id, data.x, data.y);
  };

  const handleResizeStop = (
    _e: any,
    _direction: any,
    ref: HTMLElement,
    _delta: any,
    position: { x: number; y: number }
  ) => {
    updateWindowSize(
      window.id,
      parseInt(ref.style.width),
      parseInt(ref.style.height)
    );
    updateWindowPosition(window.id, position.x, position.y);
  };

  if (window.minimized) {
    return null;
  }

  const width = window.maximized ? '100%' : window.size.width;
  const height = window.maximized ? 'calc(100% - 40px)' : window.size.height;
  const x = window.maximized ? 0 : window.position.x;
  const y = window.maximized ? 0 : window.position.y;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.15 }}
      >
        <Rnd
          size={{ width, height }}
          position={{ x, y }}
          onDragStop={handleDragStop}
          onResizeStop={handleResizeStop}
          minWidth={400}
          minHeight={300}
          dragHandleClassName="window-titlebar"
          enableResizing={!window.maximized}
          disableDragging={window.maximized}
          style={{ zIndex: window.zIndex }}
          onMouseDown={() => bringToFront(window.id)}
        >
          <div className="xp-window">
            <div className="window-titlebar">
              <span className="window-title">{window.title}</span>
              <div className="window-controls">
                <button
                  className="window-btn minimize-btn"
                  onClick={() => minimizeWindow(window.id)}
                  title="Minimize"
                >
                  _
                </button>
                <button
                  className="window-btn maximize-btn"
                  onClick={() => maximizeWindow(window.id)}
                  title={window.maximized ? 'Restore' : 'Maximize'}
                >
                  {window.maximized ? '❐' : '□'}
                </button>
                <button
                  className="window-btn close-btn"
                  onClick={() => closeWindow(window.id)}
                  title="Close"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="window-content">{children}</div>
          </div>
        </Rnd>
      </motion.div>
    </AnimatePresence>
  );
};
