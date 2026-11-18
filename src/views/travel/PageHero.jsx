import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import DestinationArt from './DestinationArt';

export default function PageHero({ eyebrow, title, subtitle, scene = 'beach', children, dense = false }) {
  useEffect(() => {
    document.title = title ? `${title} | Seravita` : 'Seravita | Travelling Agency';
    const description = document.querySelector('meta[name="description"]');
    if (description && subtitle) description.setAttribute('content', subtitle);
  }, [title, subtitle]);

  return (
    <Box sx={{ position: 'relative', bgcolor: 'primary.main', color: '#fff', overflow: 'hidden' }}>
      <DestinationArt scene={scene} sx={{ position: 'absolute', inset: 0, opacity: 0.32 }} overlay={false} />
      <Box
        sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(46,26,27,0.35) 0%, rgba(46,26,27,0.88) 100%)' }}
      />
      <Container sx={{ position: 'relative', py: { xs: dense ? 5 : 7, md: dense ? 7 : 10 }, textAlign: 'center' }}>
        {eyebrow && (
          <Typography variant="overline" sx={{ color: 'secondary.main', letterSpacing: 3, fontWeight: 700 }}>
            {eyebrow}
          </Typography>
        )}
        <Typography
          variant="h1"
          sx={{ fontSize: { xs: '2rem', md: dense ? '2.75rem' : '3.5rem' }, fontWeight: 800, lineHeight: 1.15, mt: 1 }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography sx={{ color: 'secondary.main', fontSize: { xs: '0.95rem', md: '1.1rem' }, maxWidth: 680, mx: 'auto', mt: 2, mb: 0 }}>
            {subtitle}
          </Typography>
        )}
        {children && <Box sx={{ mt: 4 }}>{children}</Box>}
      </Container>
    </Box>
  );
}
