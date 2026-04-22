import { vw } from '../App';

interface Props {
  visible: boolean;
  onClick: () => void;
}

export function GearButton({ visible, onClick }: Props) {
  return (
    <button
      style={{
        position: 'absolute',
        left: vw(67),
        top: vw(56),
        width: vw(38),
        height: vw(38),
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        color: 'inherit',
        opacity: visible ? 0.7 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        zIndex: 10,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      aria-label="設定を開く"
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 38 38"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M 31.1,14.1 L 35.8,16.6 L 35.8,21.4 L 31.1,23.9 L 29.2,27.0 L 29.5,32.4 L 25.4,34.8 L 20.8,31.9 L 17.2,31.9 L 12.6,34.8 L 8.5,32.4 L 8.8,27.0 L 6.9,23.9 L 2.2,21.4 L 2.2,16.6 L 6.9,14.1 L 8.8,11.0 L 8.5,5.6 L 12.6,3.2 L 17.2,6.1 L 20.8,6.1 L 25.4,3.2 L 29.5,5.6 L 29.2,11.0 Z M 19,14 A 5,5 0 1 0 19,24 A 5,5 0 1 0 19,14 Z"
        />
      </svg>
    </button>
  );
}
