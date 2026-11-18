import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function Logo() {
  return (
    <Stack direction="row" sx={{ alignItems: 'center', gap: 1.25 }}>
      <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect width="48" height="48" rx="14" fill="#2e1a1b" />
        <circle cx="32" cy="16" r="6" fill="#cb6116" />
        <path d="M8 33.5 40 21l-9.5 15-5.5-7.5-6 1.5-3.5 6.5Z" fill="#ffe1cb" />
        <path d="M25 28.5 40 21l-9.5 15Z" fill="#cb6116" />
      </svg>
      <Stack sx={{ lineHeight: 1 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: 0.4, color: 'primary.main' }}>
          Seravita
        </Typography>
        <Typography variant="caption" sx={{ fontSize: '9px', letterSpacing: 2.4, textTransform: 'uppercase', color: 'orange.main' }}>
          travelling
        </Typography>
      </Stack>
    </Stack>
  );
}
