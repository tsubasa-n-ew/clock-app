import type { Settings, FontWeight, ColorMode } from '../types';

interface Props {
  settings: Settings;
  locationEnabled: boolean;
  onClose: () => void;
  onFontWeightChange: (fw: FontWeight) => void;
  onColorModeChange: (cm: ColorMode) => void;
  onLocationToggle: (enabled: boolean) => void;
  onRefreshWeather: () => void;
}

const FONT_WEIGHTS: { value: FontWeight; label: string }[] = [
  { value: 'thin', label: 'Thin' },
  { value: 'light', label: 'Light' },
  { value: 'regular', label: 'Regular' },
  { value: 'medium', label: 'Medium' },
  { value: 'bold', label: 'Bold' },
];

export function SettingsPanel({ settings, locationEnabled, onClose, onFontWeightChange, onColorModeChange, onLocationToggle, onRefreshWeather }: Props) {
  return (
    <div
      className="settings-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="settings-panel">
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
          <p className="settings-label">位置情報（天気・気温・湿度）</p>
          <div className="settings-row">
            <button
              className={`settings-btn${!locationEnabled ? ' settings-btn--active' : ''}`}
              onClick={() => onLocationToggle(false)}
            >
              オフ
            </button>
            <button
              className={`settings-btn${locationEnabled ? ' settings-btn--active' : ''}`}
              onClick={() => onLocationToggle(true)}
            >
              オン
            </button>
          </div>
          {locationEnabled && (
            <button
              className="settings-btn"
              style={{ marginTop: '8px', width: '100%' }}
              onClick={onRefreshWeather}
            >
              天気・気温・湿度を更新
            </button>
          )}
        </section>
      </div>
    </div>
  );
}
