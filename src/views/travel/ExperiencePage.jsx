import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { IconCheck, IconSearchOff } from '@tabler/icons-react';

import { useTravelContent } from 'contexts/TravelContentContext';
import DealCard from './DealCard';
import EnquiryDialog from './EnquiryDialog';
import PageHero from './PageHero';
import SearchPanel from './SearchPanel';
import { criteriaFromParams, describeSearch, filterDealsByCriteria, hasSearch, paramsFromCriteria } from './search';

export default function ExperiencePage({ kind }) {
  const { deals, getExperience } = useTravelContent();
  const config = getExperience(kind) || getExperience('privatetours');
  const Icon = config.icon;
  const [searchParams, setSearchParams] = useSearchParams();
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const searched = hasSearch(searchParams);
  const criteria = criteriaFromParams(searchParams, config.fields);
  const searchCategory = {
    id: kind,
    title: config.title,
    fields: config.fields
  };
  const experienceDeals = deals.filter((deal) => deal.category === kind);
  const shownDeals = searched ? filterDealsByCriteria(experienceDeals, criteria, config.fields) : experienceDeals;
  const searchLabels = describeSearch(criteria, config.fields);

  const handleSearch = ({ criteria: nextCriteria, fields }) => setSearchParams(paramsFromCriteria(nextCriteria, fields));

  return (
    <>
      <PageHero eyebrow={config.eyebrow} title={config.title} subtitle={config.subtitle} scene={config.scene}>
        <SearchPanel override={searchCategory} onSearch={handleSearch} />
      </PageHero>

      <Container sx={{ py: { xs: 6, md: 8 } }}>
        <Grid container spacing={4} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box sx={{ width: 52, height: 52, borderRadius: 2, bgcolor: 'secondary.main', display: 'grid', placeItems: 'center' }}>
                <Icon size={26} color="#cb6116" />
              </Box>
              <Typography variant="overline" sx={{ color: 'orange.main', fontWeight: 700, letterSpacing: 2 }}>
                {config.tagline}
              </Typography>
            </Stack>
            <Typography variant="h2" sx={{ fontSize: { xs: '1.6rem', md: '2.1rem' }, fontWeight: 800, color: 'primary.main' }}>
              A better way to see the world
            </Typography>
            <Typography sx={{ color: 'text.secondary', mt: 1.5 }}>{config.intro}</Typography>
            <Stack sx={{ mt: 3, gap: 1.5 }}>
              {config.highlights.map((highlight) => (
                <Stack key={highlight} direction="row" sx={{ alignItems: 'flex-start', gap: 1.25 }}>
                  <Box
                    sx={{
                      mt: 0.25,
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      bgcolor: 'orange.main',
                      color: '#fff',
                      display: 'grid',
                      placeItems: 'center',
                      flexShrink: 0
                    }}
                  >
                    <IconCheck size={14} />
                  </Box>
                  <Typography variant="body2" sx={{ color: 'text.primary' }}>
                    {highlight}
                  </Typography>
                </Stack>
              ))}
            </Stack>
            <Button variant="contained" size="large" onClick={() => setEnquiryOpen(true)} sx={{ mt: 3, fontWeight: 700 }}>
              Ask a travel specialist
            </Button>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper elevation={0} sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 4, bgcolor: 'primary.main', color: 'common.white' }}>
              <Typography variant="h3" sx={{ fontWeight: 800, color: 'secondary.main' }}>
                How it works
              </Typography>
              <Stack sx={{ mt: 3, gap: 2.5 }}>
                {[
                  ['Tell us your idea', 'Share where you want to go and roughly when. No firm dates needed.'],
                  ['We build options', 'A specialist puts together two or three ways to make it happen.'],
                  ['You choose, we book', 'Approve the one you love and we handle every reservation.']
                ].map(([title, body], index) => (
                  <Stack key={title} direction="row" sx={{ gap: 2 }}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        bgcolor: 'orange.main',
                        display: 'grid',
                        placeItems: 'center',
                        fontWeight: 800,
                        fontSize: 14,
                        flexShrink: 0
                      }}
                    >
                      {index + 1}
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        {title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,225,203,0.8)', mt: 0.25 }}>
                        {body}
                      </Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Box component="section" sx={{ bgcolor: 'grey.100', py: { xs: 5, md: 7 } }}>
        <Container>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'flex-end' }, gap: 2, mb: 4 }}
          >
            <Box>
              <Typography variant="overline" sx={{ color: 'orange.main', fontWeight: 700, letterSpacing: 2 }}>
                {searched ? 'Search results' : 'Featured'}
              </Typography>
              <Typography variant="h2" sx={{ fontSize: { xs: '1.6rem', md: '2.1rem' }, fontWeight: 800, color: 'primary.main' }}>
                {searched
                  ? `${shownDeals.length} ${shownDeals.length === 1 ? 'option' : 'options'} for you`
                  : `${config.title} to remember`}
              </Typography>
              <Typography sx={{ color: 'text.secondary', mt: 0.5 }}>
                {searched && searchLabels.length
                  ? searchLabels.join(' · ')
                  : 'Handpicked departures with great reviews and transparent pricing.'}
              </Typography>
            </Box>
            {searched && <Chip label="Clear search" onClick={() => setSearchParams({})} variant="outlined" sx={{ fontWeight: 700 }} />}
          </Stack>

          {shownDeals.length ? (
            <Grid container spacing={3}>
              {shownDeals.map((deal) => (
                <Grid key={deal.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <DealCard deal={deal} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper elevation={0} sx={{ textAlign: 'center', py: 8, px: 2, borderRadius: 3, border: '1px dashed', borderColor: 'grey.300' }}>
              <IconSearchOff size={44} color="#cb6116" />
              <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', mt: 2 }}>
                No {config.title.toLowerCase()} found
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 480, mx: 'auto' }}>
                Nothing matches your search. Try a different place or clear the search to see every departure.
              </Typography>
              <Button variant="contained" onClick={() => setSearchParams({})} sx={{ mt: 3, fontWeight: 700 }}>
                Show all {config.title.toLowerCase()}
              </Button>
            </Paper>
          )}
        </Container>
      </Box>

      <EnquiryDialog
        open={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        kind={kind}
        title={`Ask about ${config.title}`}
        intro="Share your travel idea and a specialist will come back with options, dates and pricing."
        context={{ experience: config.title }}
      />
    </>
  );
}
