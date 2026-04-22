import { vw } from '../App';

interface Props {
  onAllow: () => void;
  onDeny: () => void;
}

export function LocationPrompt({ onAllow, onDeny }: Props) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
      }}
    >
      <div
        style={{
          background: '#fff',
          color: '#222',
          padding: vw(40),
          width: vw(420),
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontFamily: 'Noto Sans JP, sans-serif',
            fontSize: vw(20),
            fontWeight: 500,
            marginBottom: vw(12),
          }}
        >
          位置情報の使用
        </p>
        <p
          style={{
            fontFamily: 'Noto Sans JP, sans-serif',
            fontSize: vw(14),
            color: '#555',
            marginBottom: vw(28),
            lineHeight: 1.6,
          }}
        >
          天気・気温・湿度を表示するために
          <br />
          位置情報を使用します。
        </p>
        <div style={{ display: 'flex', gap: vw(12) }}>
          <button
            onClick={onDeny}
            style={{
              flex: 1,
              padding: `${vw(10)} 0`,
              border: '1px solid #ccc',
              background: 'transparent',
              fontFamily: 'Noto Sans JP, sans-serif',
              fontSize: vw(14),
              color: '#222',
              cursor: 'pointer',
            }}
          >
            使用しない
          </button>
          <button
            onClick={onAllow}
            style={{
              flex: 1,
              padding: `${vw(10)} 0`,
              border: '1px solid #222',
              background: '#222',
              fontFamily: 'Noto Sans JP, sans-serif',
              fontSize: vw(14),
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            許可する
          </button>
        </div>
      </div>
    </div>
  );
}
