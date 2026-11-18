import { Link, Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { IconArrowLeft, IconCompass, IconPlane, IconShieldCheck, IconSparkles } from '@tabler/icons-react';

import Logo from 'ui-component/Logo';

const highlights = [
  { icon: IconCompass, title: 'Plan every detail', text: 'Flights, stays and experiences in one itinerary.' },
  { icon: IconShieldCheck, title: 'Book with confidence', text: 'Your trips and bookings saved to your account.' },
  { icon: IconSparkles, title: 'Handpicked deals', text: 'Offers chosen for members, updated regularly.' }
];

export default function AuthLayout() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          position: 'relative',
          overflow: 'hidden',
          width: '48%',
          p: { md: 5, lg: 7 },
          color: '#ffe1cb',
          background: 'linear-gradient(155deg, #2e1a1b 0%, #4a2623 55%, #a94f13 100%)'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            width: 420,
            height: 420,
            borderRadius: '50%',
            border: '1px solid rgba(255,225,203,0.14)',
            top: -140,
            right: -120
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: 520,
            height: 520,
            borderRadius: '50%',
            border: '1px solid rgba(255,225,203,0.1)',
            bottom: -260,
            left: -180
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: 180,
            height: 180,
            borderRadius: '50%',
            bgcolor: 'rgba(203,97,22,0.35)',
            top: '42%',
            right: -60
          }}
        />

        <Stack sx={{ position: 'relative', zIndex: 1, justifyContent: 'space-between', width: '100%' }}>
          <Stack sx={{ gap: 1 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                alignSelf: 'flex-start',
                px: 1.5,
                py: 0.6,
                borderRadius: 10,
                bgcolor: 'rgba(255,225,203,0.12)'
              }}
            >
              <IconPlane size={15} />
              <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: 2 }}>SERAVITA TRAVELLING AGENCY</Typography>
            </Box>
            <Typography variant="h2" sx={{ color: '#fff', fontWeight: 800, lineHeight: 1.12, mt: 4, maxWidth: 520 }}>
              The world is waiting. Let&apos;s go.
            </Typography>
            <Typography sx={{ fontSize: 16, lineHeight: 1.8, maxWidth: 440, color: 'rgba(255,225,203,0.85)' }}>
              Sign in to save your favourite trips, manage bookings and discover member-only fares.
            </Typography>
          </Stack>

          <Stack sx={{ gap: 3.5, mt: 6 }}>
            {highlights.map(({ icon: Icon, title, text }) => (
              <Stack key={title} direction="row" sx={{ gap: 2, alignItems: 'flex-start' }}>
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: 2,
                    display: 'grid',
                    placeItems: 'center',
                    bgcolor: 'rgba(255,225,203,0.14)',
                    flexShrink: 0
                  }}
                >
                  <Icon size={20} />
                </Box>
                <Box>
                  <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>{title}</Typography>
                  <Typography sx={{ fontSize: 13, color: 'rgba(255,225,203,0.75)' }}>{text}</Typography>
                </Box>
              </Stack>
            ))}
          </Stack>

          <Typography sx={{ fontSize: 12, color: 'rgba(255,225,203,0.55)', mt: 6 }}>Your world, beautifully arranged.</Typography>
        </Stack>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0 }}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', px: { xs: 2, sm: 4 }, py: 2.5 }}>
          <Box component={Link} to="/" sx={{ textDecoration: 'none' }}>
            <Logo />
          </Box>
          <Typography
            component={Link}
            to="/"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.75,
              fontSize: 13,
              fontWeight: 600,
              textDecoration: 'none',
              color: 'text.secondary',
              '&:hover': { color: 'orange.main' }
            }}
          >
            <IconArrowLeft size={16} /> Back to website
          </Typography>
        </Stack>

        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', px: { xs: 2, sm: 4 }, pb: 5 }}>
          <Box sx={{ width: '100%', maxWidth: 460 }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
