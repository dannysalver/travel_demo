import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import DealCard from './DealCard';

export default function FeaturedDeals({
  items,
  title = 'Deals worth packing for',
  subtitle = 'Handpicked offers across every way you travel.',
  showAll = true
}) {
  return (
    <Box component="section" sx={{ py: { xs: 6, md: 8 } }}>
      <Container>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'flex-end' },
            gap: 2,
            mb: 4,
            flexWrap: 'wrap'
          }}
        >
          <Box>
            <Typography variant="overline" sx={{ color: 'orange.main', fontWeight: 700, letterSpacing: 2 }}>
              Featured
            </Typography>
            <Typography variant="h2" sx={{ fontSize: { xs: '1.6rem', md: '2.1rem' }, fontWeight: 800, color: 'primary.main' }}>
              {title}
            </Typography>
            <Typography sx={{ color: 'text.secondary', mt: 0.5 }}>{subtitle}</Typography>
          </Box>
          {showAll && (
            <Button component={Link} to="/deals" variant="text" sx={{ fontWeight: 700 }}>
              See all deals
            </Button>
          )}
        </Box>
        <Grid container spacing={3}>
          {items.map((deal) => (
            <Grid key={deal.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <DealCard deal={deal} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
