import { useState } from 'react';
import { useSettingsStore } from '../../stores/settingsStore';
import { useDesktopStore } from '../../stores/desktopStore';
import './SettingsWindow.css';

export const SettingsWindow = () => {
  const [activeTab, setActiveTab] = useState<'video' | 'audio' | 'controls'>('video');

  const {
    crtEffect,
    scanlineIntensity,
    audioVolume,
    keyMappings,
    toggleCRT,
    setScanlineIntensity,
    setAudioVolume,
    setKeyMapping,
  } = useSettingsStore();

  const desktopCrtEnabled = useDesktopStore((state) => state.crtEnabled);
  const desktopToggleCRT = useDesktopStore((state) => state.toggleCRT);
  const desktopSetScanlineIntensity = useDesktopStore(
    (state) => state.setScanlineIntensity
  );

  const handleCRTToggle = () => {
    toggleCRT();
    desktopToggleCRT();
  };

  const handleScanlineChange = (value: number) => {
    setScanlineIntensity(value);
    desktopSetScanlineIntensity(value);
  };

  return (
    <div className="settings-window">
      <div className="settings-tabs">
        <button
          className={`settings-tab ${activeTab === 'video' ? 'active' : ''}`}
          onClick={() => setActiveTab('video')}
        >
          Video
        </button>
        <button
          className={`settings-tab ${activeTab === 'audio' ? 'active' : ''}`}
          onClick={() => setActiveTab('audio')}
        >
          Audio
        </button>
        <button
          className={`settings-tab ${activeTab === 'controls' ? 'active' : ''}`}
          onClick={() => setActiveTab('controls')}
        >
          Controls
        </button>
      </div>

      <div className="settings-content">
        {activeTab === 'video' && (
          <div className="settings-section">
            <h3>Video Settings</h3>

            <div className="setting-item">
              <label className="setting-label">
                <input
                  type="checkbox"
                  checked={crtEffect && desktopCrtEnabled}
                  onChange={handleCRTToggle}
                />
                <span>Enable CRT Scanlines Effect</span>
              </label>
              <p className="setting-description">
                Adds authentic CRT monitor scanlines for retro feel
              </p>
            </div>

            <div className="setting-item">
              <label className="setting-label">
                Scanline Intensity: {Math.round(scanlineIntensity * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={scanlineIntensity}
                onChange={(e) => handleScanlineChange(parseFloat(e.target.value))}
                disabled={!crtEffect || !desktopCrtEnabled}
                className="setting-slider"
              />
              <p className="setting-description">
                Adjust the visibility of scanlines
              </p>
            </div>
          </div>
        )}

        {activeTab === 'audio' && (
          <div className="settings-section">
            <h3>Audio Settings</h3>

            <div className="setting-item">
              <label className="setting-label">
                Master Volume: {Math.round(audioVolume * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={audioVolume}
                onChange={(e) => setAudioVolume(parseFloat(e.target.value))}
                className="setting-slider"
              />
              <p className="setting-description">
                Control the global audio volume
              </p>
            </div>

            <div className="setting-item">
              <label className="setting-label">
                <input type="checkbox" defaultChecked />
                <span>Enable Sound Effects</span>
              </label>
              <p className="setting-description">
                UI sounds (clicks, notifications)
              </p>
            </div>
          </div>
        )}

        {activeTab === 'controls' && (
          <div className="settings-section">
            <h3>Control Settings</h3>
            <p className="info-text">
              Configure keyboard mappings for game controls
            </p>

            <div className="controls-grid">
              {Object.entries(keyMappings).map(([action, key]) => (
                <div key={action} className="control-mapping">
                  <label>{action.toUpperCase()}:</label>
                  <input
                    type="text"
                    value={key}
                    onChange={(e) => setKeyMapping(action, e.target.value)}
                    className="control-input"
                    placeholder="Press a key..."
                  />
                </div>
              ))}
            </div>

            <button className="reset-btn">Reset to Defaults</button>
          </div>
        )}
      </div>
    </div>
  );
};
