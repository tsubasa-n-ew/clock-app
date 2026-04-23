import { useState } from 'react';
import type { Settings, FontWeight, ColorMode } from '../types';

interface Props {
  settings: Settings;
  city: string;
  onClose: () => void;
  onFontWeightChange: (fw: FontWeight) => void;
  onColorModeChange: (cm: ColorMode) => void;
  onCityChange: (city: string) => void;
  onRefreshWeather: () => void;
}

const FONT_WEIGHTS: { value: FontWeight; label: string }[] = [
  { value: 'thin', label: 'Thin' },
  { value: 'light', label: 'Light' },
  { value: 'regular', label: 'Regular' },
  { value: 'medium', label: 'Medium' },
  { value: 'bold', label: 'Bold' },
];

export function SettingsPanel({ settings, city, onClose, onFontWeightChange, onColorModeChange, onCityChange, onRefreshWeather }: Props) {
  const [cityInput, setCityInput] = useState(city);

  function handleCitySubmit() {
    onCityChange(cityInput);
    onRefreshWeather();
  }

  return (
    <div
      className="settings-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
        <button className="settings-close" onClick={onClose} aria-label="閉じる">✕</button>
        <h2 className="settings-title">設定</h2>

        <section className="settings-section">
          <p className="settings-label">フォントウェイト</p>
          <div className="settings-row">
            {FONT_WEIGHTS.map((fw) => (
              <button
                key={fw.value}
                className={`settings-btn${settings.fontWeight === fw.value ? ' settings-btn--active' : ''}`}
                onClick={() => onFontWeightChange(fw.value)}
              >
                {fw.label}
              </button>
            ))}
          </div>
        </section>

        <section className="settings-section">
          <p className="settings-label">カラーモード</p>
          <div className="settings-row">
            <button
              className={`settings-btn${settings.colorMode === 'light' ? ' settings-btn--active' : ''}`}
              onClick={() => onColorModeChange('light')}
            >
              ライト
            </button>
            <button
              className={`settings-btn${settings.colorMode === 'dark' ? ' settings-btn--active' : ''}`}
              onClick={() => onColorModeChange('dark')}
            >
              ダーク
            </button>
          </div>
        </section>

        <section className="settings-section">
          <p className="settings-label">天気・気温・湿度（都市名を入力）</p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              placeholder="例: 福岡"
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #ccc',
                fontFamily: 'Noto Sans JP, sans-serif',
                fontSize: '14px',
                color: '#222',
                outline: 'none',
              }}
            />
            <button
              className="settings-btn settings-btn--active"
              style={{ flex: 'none', width: '60px' }}
              onClick={handleCitySubmit}
            >
              設定
            </button>
          </div>
          {city && (
            <button
              className="settings-btn"
              style={{ marginTop: '8px', width: '100%' }}
              onClick={() => { onCityChange(''); setCityInput(''); }}
            >
              天気表示をオフ
            </button>
          )}
        </section>
      </div>
    </div>
  );
}
