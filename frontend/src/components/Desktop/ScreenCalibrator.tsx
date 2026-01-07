import { useState, useEffect } from 'react';
import './ScreenCalibrator.css';

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
  // Points de courbure (milieu de chaque côté)
  topMiddle: Point;
  rightMiddle: Point;
  bottomMiddle: Point;
  leftMiddle: Point;
}

const DEFAULT_BOUNDS: ScreenBounds = {
  topLeft: { x: 31, y: 15 },
  topRight: { x: 69, y: 15 },
  bottomLeft: { x: 31, y: 53 },
  bottomRight: { x: 69, y: 53 },
  topMiddle: { x: 50, y: 14 },
  rightMiddle: { x: 70, y: 34 },
  bottomMiddle: { x: 50, y: 54 },
  leftMiddle: { x: 30, y: 34 },
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

  const getSVGPath = () => {
    const { topLeft, topRight, bottomRight, bottomLeft, topMiddle, rightMiddle, bottomMiddle, leftMiddle } = bounds;

    // Créer un path SVG avec des courbes de Bézier quadratiques pour les courbures CRT
    return `
      M ${topLeft.x} ${topLeft.y}
      Q ${topMiddle.x} ${topMiddle.y} ${topRight.x} ${topRight.y}
      Q ${rightMiddle.x} ${rightMiddle.y} ${bottomRight.x} ${bottomRight.y}
      Q ${bottomMiddle.x} ${bottomMiddle.y} ${bottomLeft.x} ${bottomLeft.y}
      Q ${leftMiddle.x} ${leftMiddle.y} ${topLeft.x} ${topLeft.y}
      Z
    `.trim();
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
          {/* Screen area avec courbes CRT */}
          <path
            d={getSVGPath()}
            fill="rgba(0, 200, 255, 0.1)"
            stroke="rgba(0, 200, 255, 0.8)"
            strokeWidth="0.3"
          />

          {/* Lignes de guidage vers les points de courbure */}
          <line x1={bounds.topLeft.x} y1={bounds.topLeft.y} x2={bounds.topMiddle.x} y2={bounds.topMiddle.y} stroke="rgba(255, 200, 0, 0.3)" strokeWidth="0.1" strokeDasharray="0.5,0.5" />
          <line x1={bounds.topMiddle.x} y1={bounds.topMiddle.y} x2={bounds.topRight.x} y2={bounds.topRight.y} stroke="rgba(255, 200, 0, 0.3)" strokeWidth="0.1" strokeDasharray="0.5,0.5" />

          <line x1={bounds.topRight.x} y1={bounds.topRight.y} x2={bounds.rightMiddle.x} y2={bounds.rightMiddle.y} stroke="rgba(255, 200, 0, 0.3)" strokeWidth="0.1" strokeDasharray="0.5,0.5" />
          <line x1={bounds.rightMiddle.x} y1={bounds.rightMiddle.y} x2={bounds.bottomRight.x} y2={bounds.bottomRight.y} stroke="rgba(255, 200, 0, 0.3)" strokeWidth="0.1" strokeDasharray="0.5,0.5" />

          <line x1={bounds.bottomRight.x} y1={bounds.bottomRight.y} x2={bounds.bottomMiddle.x} y2={bounds.bottomMiddle.y} stroke="rgba(255, 200, 0, 0.3)" strokeWidth="0.1" strokeDasharray="0.5,0.5" />
          <line x1={bounds.bottomMiddle.x} y1={bounds.bottomMiddle.y} x2={bounds.bottomLeft.x} y2={bounds.bottomLeft.y} stroke="rgba(255, 200, 0, 0.3)" strokeWidth="0.1" strokeDasharray="0.5,0.5" />

          <line x1={bounds.bottomLeft.x} y1={bounds.bottomLeft.y} x2={bounds.leftMiddle.x} y2={bounds.leftMiddle.y} stroke="rgba(255, 200, 0, 0.3)" strokeWidth="0.1" strokeDasharray="0.5,0.5" />
          <line x1={bounds.leftMiddle.x} y1={bounds.leftMiddle.y} x2={bounds.topLeft.x} y2={bounds.topLeft.y} stroke="rgba(255, 200, 0, 0.3)" strokeWidth="0.1" strokeDasharray="0.5,0.5" />
        </svg>

        {/* Draggable points */}
        {(Object.keys(bounds) as Array<keyof ScreenBounds>).map((pointName) => {
          const isCorner = pointName.includes('Left') || pointName.includes('Right');
          const isCurvePoint = pointName.includes('Middle');

          return (
            <div
              key={pointName}
              className={`calibration-point ${dragging === pointName ? 'dragging' : ''} ${isCurvePoint ? 'curve-point' : 'corner-point'}`}
              style={{
                left: `${bounds[pointName].x}%`,
                top: `${bounds[pointName].y}%`,
              }}
              onMouseDown={() => handleMouseDown(pointName)}
            >
              <div className="point-label">
                {pointName.replace(/([A-Z])/g, ' $1').trim()}
                <br />
                <span className="point-coords">
                  {bounds[pointName].x.toFixed(1)}%, {bounds[pointName].y.toFixed(1)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="calibrator-controls">
        <h2>🖥️ Calibration de l'écran CRT</h2>
        <p>Déplace les points pour mapper l'écran Windows XP sur ton moniteur CRT avec ses courbures</p>
        <div style={{ fontSize: '11px', color: '#aaa', marginBottom: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '5px' }}>
            <div style={{ width: '12px', height: '12px', background: 'rgba(0, 200, 255, 0.8)', borderRadius: '50%' }}></div>
            <span>Points de coins (bleus) - 4 angles de l'écran</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '12px', height: '12px', background: 'rgba(255, 165, 0, 0.8)', borderRadius: '50%' }}></div>
            <span>Points de courbure (oranges) - milieu des bords</span>
          </div>
        </div>

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
