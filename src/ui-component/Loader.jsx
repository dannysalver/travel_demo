// material-ui
import Box from '@mui/material/Box';

// ==============================|| LOADER ||============================== //

export default function Loader() {
  return (
    <Box
      role="status"
      aria-label="Loading"
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default'
      }}
    >
      <Box sx={{ position: 'relative', width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box
          sx={{
            position: 'absolute',
            bottom: 14,
            width: 52,
            height: 8,
            borderRadius: '50%',
            bgcolor: 'primary.main',
            opacity: 0.12,
            animation: 'planeShadow 2.4s ease-in-out infinite',
            '@keyframes planeShadow': {
              '0%, 100%': { transform: 'scaleX(1)', opacity: 0.12 },
              '50%': { transform: 'scaleX(0.7)', opacity: 0.06 }
            }
          }}
        />
        <Box
          component="svg"
          width="88"
          height="88"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          sx={{
            position: 'relative',
            animation: 'planeHover 2.4s ease-in-out infinite',
            filter: 'drop-shadow(0 6px 8px rgba(46, 26, 27, 0.12))',
            '@keyframes planeHover': {
              '0%, 100%': { transform: 'translateY(4px) rotate(-3deg)' },
              '50%': { transform: 'translateY(-8px) rotate(3deg)' }
            }
          }}
        >
          <rect width="48" height="48" rx="14" fill="#2e1a1b" />
          <circle cx="32" cy="16" r="6" fill="#cb6116" />
          <path d="M8 33.5 40 21l-9.5 15-5.5-7.5-6 1.5-3.5 6.5Z" fill="#ffe1cb" />
          <path d="M25 28.5 40 21l-9.5 15Z" fill="#cb6116" />
        </Box>
      </Box>
    </Box>
  );
}
