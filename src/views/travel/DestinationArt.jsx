import { useId } from 'react';
import Box from '@mui/material/Box';

const palettes = {
  beach: ['#8ed6e8', '#f7d9a8', '#f6c48c'],
  island: ['#7cc9e0', '#bfe8df', '#f5d9a6'],
  city: ['#f0b48a', '#e98a5b', '#7d4a45'],
  mountain: ['#b9d9e8', '#7fa8b8', '#e5d8c6'],
  safari: ['#f6c98b', '#e79a5a', '#a55b35'],
  desert: ['#f8d6a3', '#e8a766', '#b96b3a'],
  cruise: ['#8fd2e4', '#5aa7c4', '#f1d4a4']
};

export default function DestinationArt({ scene = 'beach', sx, overlay = true }) {
  const uid = useId().replace(/:/g, '');
  const [top, middle, ground] = palettes[scene] || palettes.beach;
  const skyId = `sky-${uid}`;
  const seaId = `sea-${uid}`;

  return (
    <Box sx={{ position: 'relative', overflow: 'hidden', ...sx }}>
      <Box
        component="svg"
        viewBox="0 0 400 240"
        preserveAspectRatio="xMidYMid slice"
        sx={{ display: 'block', width: '100%', height: '100%' }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={skyId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={top} />
            <stop offset="100%" stopColor={middle} />
          </linearGradient>
          <linearGradient id={seaId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3f93b5" />
            <stop offset="100%" stopColor="#1e627f" />
          </linearGradient>
        </defs>

        <rect width="400" height="240" fill={`url(#${skyId})`} />
        <circle cx="312" cy="58" r="30" fill="#fff3d1" opacity="0.9" />

        {scene === 'beach' && (
          <>
            <rect y="126" width="400" height="62" fill={`url(#${seaId})`} />
            <path d="M0 176 Q90 160 190 180 T400 174 L400 240 L0 240Z" fill={ground} />
            <path d="M64 176 C60 148 70 128 84 118" stroke="#6b7139" strokeWidth="5" fill="none" />
            <path d="M84 118 Q54 106 38 124 Q62 118 84 126 Q106 110 130 122 Q112 104 84 118" fill="#4f7a46" />
            <path d="M0 196 Q100 188 200 198 T400 194" stroke="#ffffff" strokeWidth="3" fill="none" opacity="0.7" />
          </>
        )}

        {scene === 'island' && (
          <>
            <rect y="120" width="400" height="120" fill={`url(#${seaId})`} />
            <path d="M120 154 Q200 96 288 154Z" fill={ground} />
            <path d="M150 150 Q200 118 254 150Z" fill="#6f9a58" />
            <path d="M0 196 Q100 188 200 198 T400 194" stroke="#ffffff" strokeWidth="3" fill="none" opacity="0.6" />
          </>
        )}

        {scene === 'city' && (
          <>
            <path
              d="M0 240 L0 150 L42 150 L42 118 L84 118 L84 168 L126 168 L126 92 L176 92 L176 150 L214 150 L214 120 L262 120 L262 172 L306 172 L306 104 L352 104 L352 152 L400 152 L400 240Z"
              fill={ground}
              opacity="0.85"
            />
            <path
              d="M0 240 L0 186 L56 186 L56 160 L112 160 L112 206 L170 206 L170 176 L228 176 L228 214 L292 214 L292 168 L348 168 L348 198 L400 198 L400 240Z"
              fill="#5e342f"
              opacity="0.75"
            />
            {[20, 64, 108, 152, 196, 240, 284, 328, 372].map((x) => (
              <g key={x}>
                <rect x={x} y="196" width="10" height="12" fill="#ffd9a8" opacity="0.8" />
                <rect x={x} y="218" width="10" height="12" fill="#ffd9a8" opacity="0.5" />
              </g>
            ))}
          </>
        )}

        {scene === 'mountain' && (
          <>
            <path d="M-20 240 L110 84 L236 240Z" fill="#5f7d8a" />
            <path d="M110 84 L150 138 L70 138Z" fill="#f4f0e6" />
            <path d="M128 240 L262 108 L400 240Z" fill="#425f6c" />
            <path d="M262 108 L298 152 L226 152Z" fill="#f4f0e6" />
            <path d="M0 240 Q100 212 200 236 T400 226 L400 240Z" fill={ground} />
          </>
        )}

        {scene === 'safari' && (
          <>
            <path d="M0 158 Q100 142 200 162 T400 154 L400 240 L0 240Z" fill={middle} />
            <path d="M0 204 Q120 184 240 208 T400 198 L400 240 L0 240Z" fill={ground} />
            <path
              d="M108 196 L108 148 M108 158 Q80 140 66 162 Q92 154 108 166 Q126 148 148 160 Q132 142 108 158"
              stroke="#5b3a26"
              strokeWidth="7"
              fill="#5b3a26"
              strokeLinecap="round"
            />
            <ellipse cx="288" cy="202" rx="26" ry="12" fill="#5b3a26" opacity="0.7" />
          </>
        )}

        {scene === 'desert' && (
          <>
            <path d="M0 170 Q100 122 200 170 T400 158 L400 240 L0 240Z" fill={middle} />
            <path d="M0 210 Q120 168 240 210 T400 196 L400 240 L0 240Z" fill={ground} />
            <path d="M0 236 Q140 212 260 234 T400 226" stroke="#f6dfb6" strokeWidth="4" fill="none" opacity="0.6" />
          </>
        )}

        {scene === 'cruise' && (
          <>
            <rect y="128" width="400" height="112" fill={`url(#${seaId})`} />
            <path d="M96 150 L304 150 L284 182 L118 182Z" fill="#fff5e7" />
            <rect x="176" y="112" width="58" height="38" fill="#fff5e7" />
            <rect x="190" y="122" width="12" height="12" fill="#cb6116" />
            <rect x="212" y="122" width="12" height="12" fill="#cb6116" />
            <path d="M0 204 Q100 196 200 206 T400 200" stroke="#ffffff" strokeWidth="3" fill="none" opacity="0.6" />
          </>
        )}
      </Box>
      {overlay && (
        <Box
          sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(46,26,27,0) 40%, rgba(46,26,27,0.55) 100%)' }}
        />
      )}
    </Box>
  );
}
