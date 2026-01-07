import { useState, useEffect } from 'react';
import './ScreenCalibrator.css';

interface ScreenBounds {
  topLeft: { x: number; y: number };
  topRight: { x: number; y: number };
  bottomLeft: { x: number; y: number };
  bottomRight: { x: number; y: number };
}

const DEFAULT_BOUNDS: ScreenBounds = {
  topLeft: { x: 31, y: 15 },
  topRight: { x: 69, y: 15 },
  bottomLeft: { x: 31, y: 53 },
  bottomRight: { x: 69, y: 53 },
};

export const ScreenCalibrator = ({ onSave }: { onSave: (bounds: ScreenBounds) => void }) => {
  const [bounds, setBounds] = useState<ScreenBounds>(DEFAULT_BOUNDS);
  const [dragging, setDragging] = useState<keyof ScreenBounds | null>(null);
  const [showGrid, setShowGrid] = useState(true);

  useEffect(() => {
    // Load saved bounds from localStorage
    const saved = localStorage.getItem('zerver-screen-bounds');
    if (saved) {
      setBounds(JSON.parse(saved));
    }
  }, []);

  const handleMouseDown = (corner: keyof ScreenBounds) => {
    setDragging(corner);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragging) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setBounds(prev => ({
      ...prev,
      [dragging]: { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) }
    }));
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  const handleSave = () => {
    localStorage.setItem('zerver-screen-bounds', JSON.stringify(bounds));
    onSave(bounds);
  };

  const handleReset = () => {
    setBounds(DEFAULT_BOUNDS);
    localStorage.removeItem('zerver-screen-bounds');
  };

  const getPolygonPath = () => {
    const { topLeft, topRight, bottomRight, bottomLeft } = bounds;
    return `${topLeft.x}% ${topLeft.y}%, ${topRight.x}% ${topRight.y}%, ${bottomRight.x}% ${bottomRight.y}%, ${bottomLeft.x}% ${bottomLeft.y}%`;
  };

  return (
    <div className="screen-calibrator">
      <div
        className="calibrator-canvas"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className="background-preview" />

        {showGrid && (
          <div className="calibration-grid">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={`h-${i}`} className="grid-line horizontal" style={{ top: `${i * 10}%` }} />
            ))}
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={`v-${i}`} className="grid-line vertical" style={{ left: `${i * 10}%` }} />
            ))}
          </div>
        )}

        <svg className="calibration-overlay" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Screen area polygon */}
          <polygon
            points={getPolygonPath()}
            fill="rgba(0, 200, 255, 0.1)"
            stroke="rgba(0, 200, 255, 0.8)"
            strokeWidth="0.3"
            strokeDasharray="1,1"
          />

          {/* Connection lines */}
          <line x1={bounds.topLeft.x} y1={bounds.topLeft.y} x2={bounds.topRight.x} y2={bounds.topRight.y} stroke="rgba(0, 200, 255, 0.6)" strokeWidth="0.2" />
          <line x1={bounds.topRight.x} y1={bounds.topRight.y} x2={bounds.bottomRight.x} y2={bounds.bottomRight.y} stroke="rgba(0, 200, 255, 0.6)" strokeWidth="0.2" />
          <line x1={bounds.bottomRight.x} y1={bounds.bottomRight.y} x2={bounds.bottomLeft.x} y2={bounds.bottomLeft.y} stroke="rgba(0, 200, 255, 0.6)" strokeWidth="0.2" />
          <line x1={bounds.bottomLeft.x} y1={bounds.bottomLeft.y} x2={bounds.topLeft.x} y2={bounds.topLeft.y} stroke="rgba(0, 200, 255, 0.6)" strokeWidth="0.2" />
        </svg>

        {/* Draggable corners */}
        {(Object.keys(bounds) as Array<keyof ScreenBounds>).map((corner) => (
          <div
            key={corner}
            className={`calibration-point ${dragging === corner ? 'dragging' : ''}`}
            style={{
              left: `${bounds[corner].x}%`,
              top: `${bounds[corner].y}%`,
            }}
            onMouseDown={() => handleMouseDown(corner)}
          >
            <div className="point-label">
              {corner.replace(/([A-Z])/g, ' $1').trim()}
              <br />
              <span className="point-coords">
                {bounds[corner].x.toFixed(1)}%, {bounds[corner].y.toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="calibrator-controls">
        <h2>🖥️ Calibration de l'écran CRT</h2>
        <p>Déplace les 4 coins pour mapper l'écran Windows XP sur ton moniteur CRT</p>

        <div className="control-buttons">
          <button onClick={handleSave} className="btn-save">
            ✅ Sauvegarder
          </button>
          <button onClick={handleReset} className="btn-reset">
            🔄 Réinitialiser
          </button>
          <button onClick={() => setShowGrid(!showGrid)} className="btn-toggle">
            {showGrid ? '🔲 Masquer grille' : '🔳 Afficher grille'}
          </button>
        </div>

        <div className="bounds-info">
          <h3>Coordonnées actuelles:</h3>
          <pre>{JSON.stringify(bounds, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
};
