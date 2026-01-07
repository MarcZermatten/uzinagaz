import { useEffect } from 'react';
import { EmulatorJS } from 'react-emulatorjs';
import { useGameStore } from '../../stores/gameStore';
import './GamePlayer.css';

export const GamePlayer = () => {
  const currentGame = useGameStore((state) => state.currentGame);
  const exitGame = useGameStore((state) => state.exitGame);
  const isPlaying = useGameStore((state) => state.isPlaying);

  useEffect(() => {
    // Disable scrolling when playing
    if (isPlaying) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isPlaying]);

  useEffect(() => {
    // Handle Escape key to exit game
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleExit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleExit = () => {
    if (confirm('Exit game? Any unsaved progress will be lost.')) {
      exitGame();
    }
  };

  if (!isPlaying || !currentGame) {
    return null;
  }

  const getCoreSystem = (consoleId: string): string => {
    const coreMapping: Record<string, string> = {
      nes: 'nes',
      snes: 'snes',
      gb: 'gb',
      gbc: 'gbc',
      gba: 'gba',
      megadrive: 'segaMD',
      n64: 'n64',
      psx: 'psx',
      dreamcast: 'segaDC',
      ps2: 'ps2',
    };
    return coreMapping[consoleId] || consoleId;
  };

  return (
    <div className="game-player-container">
      <div className="game-player-header">
        <div className="game-info">
          <span className="game-title">{currentGame.title}</span>
          <span className="game-console">{currentGame.console_id.toUpperCase()}</span>
        </div>
        <div className="game-controls">
          <button className="control-btn" title="Fullscreen (F11)">
            ⛶
          </button>
          <button className="control-btn" title="Save State (F5)">
            💾
          </button>
          <button className="control-btn" title="Load State (F9)">
            📂
          </button>
          <button className="control-btn exit-btn" onClick={handleExit} title="Exit (ESC)">
            ✕
          </button>
        </div>
      </div>

      <div className="emulator-wrapper">
        <EmulatorJS
          EJS_core={getCoreSystem(currentGame.console_id) as any}
          EJS_gameUrl={`http://localhost:8080/api/v1/games/${currentGame.id}/rom`}
          EJS_pathtodata="/data/"
        />
      </div>
    </div>
  );
};
