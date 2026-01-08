import { useDesktopStore } from '../../stores/desktopStore';
import { useGameStore } from '../../stores/gameStore';
import { CRTScanlines } from '../Effects/CRTScanlines';
import { DraggableScreen } from './DraggableScreen';
import './Desktop.css';

export const Desktop = () => {
  const crtEnabled = useDesktopStore((state) => state.crtEnabled);
  const isPlaying = useGameStore((state) => state.isPlaying);

  // Don't show desktop when playing a game
  if (isPlaying) {
    return null;
  }

  return (
    <div className="desktop-container">
      <div className="desk-background">
        {/* Background image fills entire screen */}
        <img
          src="/assets/retro-desk-scene.png"
          alt="Retro desk scene"
          className="desk-background-image"
        />

        <DraggableScreen />
      </div>
      {crtEnabled && <CRTScanlines />}
    </div>
  );
};
