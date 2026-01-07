import { useDesktopStore } from '../../stores/desktopStore';
import { useGameStore } from '../../stores/gameStore';
import { DesktopIcon } from '../Icons/DesktopIcon';
import { Taskbar } from './Taskbar';
import { CRTScanlines } from '../Effects/CRTScanlines';
import { WindowManager } from '../Windows/WindowManager';
import './Desktop.css';

export const Desktop = () => {
  const icons = useDesktopStore((state) => state.icons);
  const crtEnabled = useDesktopStore((state) => state.crtEnabled);
  const isPlaying = useGameStore((state) => state.isPlaying);

  // Don't show desktop when playing a game
  if (isPlaying) {
    return null;
  }

  return (
    <div className="desktop-container">
      <div className="desk-background">
        {/* The pixel art desk will go here */}
        <div className="monitor-frame">
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
    </div>
  );
};
