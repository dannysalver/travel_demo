import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useTravelContent } from 'contexts/TravelContentContext';
import DealCard from './DealCard';
import PageHero from './PageHero';

export default function Deals() {
  const { categories, deals, destinations, getCategory } = useTravelContent();
  const dealCategories = categories.map((category) => ({ id: category.id, title: category.title }));
  const [searchParams, setSearchParams] = useSearchParams();
  const destinationId = searchParams.get('destination');
  const destination = destinations.find((item) => item.id === destinationId);
  const [activeId, setActiveId] = useState('all');

  const filtered = deals.filter((deal) => {
    const matchesCategory = activeId === 'all' || deal.category === activeId;
    const matchesDestination = !destination || deal.location.toLowerCase().includes(destination.name.toLowerCase());
    return matchesCategory && matchesDestination;
  });

  return (
    <>
      <PageHero
        eyebrow="Deals"
        title={destination ? `Deals in ${destination.name}` : 'Every deal, in one place'}
        subtitle="Fresh fares, limited-time savings and handpicked escapes. Filter to find the one that fits."
        scene="beach"
      />

      <Container sx={{ py: { xs: 6, md: 8 } }}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Showing <strong>{filtered.length}</strong> of {deals.length} deals
          </Typography>
          <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label="All deals"
              onClick={() => setActiveId('all')}
              color={activeId === 'all' ? 'primary' : 'default'}
              variant={activeId === 'all' ? 'filled' : 'outlined'}
              sx={{ fontWeight: 600 }}
            />
            {dealCategories.map((category) => (
              <Chip
                key={category.id}
                label={category.title}
                onClick={() => setActiveId(category.id)}
                color={activeId === category.id ? 'primary' : 'default'}
                variant={activeId === category.id ? 'filled' : 'outlined'}
                sx={{ fontWeight: 600 }}
              />
            ))}
          </Stack>
        </Stack>

        {filtered.length ? (
          <Grid container spacing={3}>
            {filtered.map((deal) => (
              <Grid key={deal.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <DealCard deal={deal} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h3" sx={{ fontWeight: 800, color: 'primary.main' }}>
              No deals match those filters
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Try another category or clear the destination filter.
            </Typography>
            <Chip
              label="Show all deals"
              onClick={() => {
                setActiveId('all');
                setSearchParams({});
              }}
              sx={{ mt: 2, bgcolor: 'orange.main', color: '#fff', fontWeight: 700 }}
            />
          </Box>
        )}

        {activeId !== 'all' && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
            Looking for something specific? <strong>{getCategory(activeId)?.title}</strong> can be combined with any other service on this
            site.
          </Typography>
        )}
      </Container>
    </>
  );
}
