import { useEffect, useState } from 'react';
import { gameService } from '../../services/gameService';
import { useGameStore } from '../../stores/gameStore';
import type { Game } from '../../types';
import './FolderWindow.css';

interface FolderWindowProps {
  consoleId?: string;
}

export const FolderWindow = ({ consoleId }: FolderWindowProps) => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const launchGame = useGameStore((state) => state.launchGame);

  useEffect(() => {
    loadGames();
  }, [consoleId]);

  const loadGames = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🎮 Loading games for console:', consoleId);
      const response = await gameService.getGames(consoleId);
      console.log('✅ Loaded games:', response.games.length, 'games for console', consoleId);
      setGames(response.games);
    } catch (err) {
      setError('Failed to load games');
      console.error('Error loading games:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGameClick = (gameId: string) => {
    setSelectedGame(gameId);
  };

  const handleGameDoubleClick = (game: Game) => {
    launchGame(game);
  };

  const getConsoleName = () => {
    const consoleNames: Record<string, string> = {
      nes: 'NES',
      snes: 'Super Nintendo',
      gb: 'Game Boy',
      gbc: 'Game Boy Color',
      gba: 'Game Boy Advance',
      megadrive: 'Mega Drive / Genesis',
      n64: 'Nintendo 64',
      psx: 'PlayStation',
      dreamcast: 'Dreamcast',
      ps2: 'PlayStation 2',
    };
    return consoleId ? consoleNames[consoleId] || consoleId.toUpperCase() : 'All Games';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  if (loading) {
    return (
      <div className="folder-window">
        <div className="folder-toolbar">
          <div className="folder-path">{getConsoleName()}</div>
        </div>
        <div className="folder-content loading">
          <div className="loading-spinner">Loading games...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="folder-window">
        <div className="folder-toolbar">
          <div className="folder-path">{getConsoleName()}</div>
        </div>
        <div className="folder-content error">
          <div className="error-message">{error}</div>
          <button onClick={loadGames}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="folder-window">
      <div className="folder-toolbar">
        <div className="folder-path">{getConsoleName()}</div>
        <div className="folder-actions">
          <button className="toolbar-btn" onClick={loadGames} title="Refresh">
            ↻
          </button>
          <button className="toolbar-btn" title="Scan ROMs">
            🔍
          </button>
        </div>
      </div>

      <div className="folder-header">
        <div className="header-item name">Name</div>
        <div className="header-item size">Size</div>
        <div className="header-item date">Date Added</div>
      </div>

      <div className="folder-content">
        {games.length === 0 ? (
          <div className="empty-folder">
            <div className="empty-icon">📁</div>
            <div className="empty-message">No games found</div>
            <div className="empty-hint">Upload ROMs or scan your ROM directory</div>
          </div>
        ) : (
          <div className="game-list">
            {games.map((game) => (
              <div
                key={game.id}
                className={`game-item ${selectedGame === game.id ? 'selected' : ''}`}
                onClick={() => handleGameClick(game.id)}
                onDoubleClick={() => handleGameDoubleClick(game)}
              >
                <div className="game-icon">🎮</div>
                <div className="game-name">{game.title}</div>
                <div className="game-size">{formatFileSize(game.rom_size_bytes)}</div>
                <div className="game-date">
                  {new Date(game.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="folder-statusbar">
        <div className="status-text">
          {games.length} {games.length === 1 ? 'game' : 'games'}
        </div>
      </div>
    </div>
  );
};
