import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { IconArrowRight, IconSparkles } from '@tabler/icons-react';

import { useTravelContent } from 'contexts/TravelContentContext';
import DestinationArt from './DestinationArt';
import FeaturedDeals from './FeaturedDeals';
import PageHero from './PageHero';
import SearchPanel from './SearchPanel';
import { paramsFromCriteria } from './search';

export default function HomePage() {
  const { articles, categories, destinations, deals, perks } = useTravelContent();
  const [activeId, setActiveId] = useState(categories[0].id);
  const navigate = useNavigate();

  const handleSearch = ({ criteria, fields, category }) => {
    const params = paramsFromCriteria(criteria, fields);
    navigate({ pathname: category.path, search: `?${params.toString()}` });
  };

  return (
    <>
      <PageHero
        eyebrow="Seravita Travelling Agency"
        title="Your world, beautifully arranged"
        subtitle="Flights, stays, trains, cars, tours and events — compare them all and book in one calm place."
        scene="island"
      >
        <SearchPanel categoryId={activeId} onCategoryChange={setActiveId} tabs={categories} onSearch={handleSearch} />
      </PageHero>

      <Container sx={{ py: { xs: 6, md: 8 } }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="overline" sx={{ color: 'orange.main', fontWeight: 700, letterSpacing: 2 }}>
            Everything you need
          </Typography>
          <Typography variant="h2" sx={{ fontSize: { xs: '1.6rem', md: '2.1rem' }, fontWeight: 800, color: 'primary.main' }}>
            One agency for the whole journey
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 620, mx: 'auto', mt: 1 }}>
            Mix and match any combination. We will keep the pieces together so you can enjoy the trip.
          </Typography>
        </Box>
        <Grid container spacing={2.5}>
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Grid key={category.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Paper
                  component={Link}
                  to={category.path}
                  elevation={0}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 2.5,
                    borderRadius: 3,
                    height: '100%',
                    textDecoration: 'none',
                    border: '1px solid',
                    borderColor: 'grey.200',
                    transition: 'transform .2s, box-shadow .2s, border-color .2s',
                    '&:hover': { transform: 'translateY(-4px)', boxShadow: 6, borderColor: 'orange.main' }
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: 'secondary.main',
                      display: 'grid',
                      placeItems: 'center',
                      flexShrink: 0
                    }}
                  >
                    <Icon size={24} color="#cb6116" />
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      {category.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {category.caption}
                    </Typography>
                  </Box>
                  <IconArrowRight size={18} color="#cb6116" />
                </Paper>
              </Grid>
            );
          })}
        </Grid>
        <Stack direction="row" sx={{ justifyContent: 'center', mt: 3, flexWrap: 'wrap', gap: 1.5 }}>
          <Button component={Link} to="/privatetours" variant="outlined" sx={{ textTransform: 'none', fontWeight: 600 }}>
            Private Tours
          </Button>
          <Button component={Link} to="/grouptours" variant="outlined" sx={{ textTransform: 'none', fontWeight: 600 }}>
            Group Tours
          </Button>
          <Button component={Link} to="/cruises" variant="outlined" sx={{ textTransform: 'none', fontWeight: 600 }}>
            Cruises
          </Button>
          <Button component={Link} to="/tripplanner" variant="outlined" sx={{ textTransform: 'none', fontWeight: 600 }}>
            Trip.Planner
          </Button>
          <Button component={Link} to="/tripmap" variant="outlined" sx={{ textTransform: 'none', fontWeight: 600 }}>
            Map
          </Button>
        </Stack>
      </Container>

      <Box sx={{ bgcolor: 'grey.100', py: { xs: 6, md: 8 } }}>
        <Container>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-end', mb: 4, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="overline" sx={{ color: 'orange.main', fontWeight: 700, letterSpacing: 2 }}>
                Trending now
              </Typography>
              <Typography variant="h2" sx={{ fontSize: { xs: '1.6rem', md: '2.1rem' }, fontWeight: 800, color: 'primary.main' }}>
                Destinations our travellers love
              </Typography>
            </Box>
            <Button component={Link} to="/travelinspiration" variant="text" endIcon={<IconArrowRight size={17} />} sx={{ fontWeight: 700 }}>
              Get inspired
            </Button>
          </Stack>
          <Grid container spacing={2.5}>
            {destinations.map((destination) => {
              const Icon = destination.icon;
              return (
                <Grid key={destination.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Paper
                    component={Link}
                    to={`/deals?destination=${destination.id}`}
                    elevation={0}
                    sx={{
                      display: 'block',
                      borderRadius: 3,
                      overflow: 'hidden',
                      textDecoration: 'none',
                      border: '1px solid',
                      borderColor: 'grey.200'
                    }}
                  >
                    <Box sx={{ position: 'relative', height: 160 }}>
                      <DestinationArt scene={destination.scene} sx={{ height: '100%' }} />
                      <Chip
                        icon={<Icon size={15} />}
                        label={`${destination.trips} trips`}
                        size="small"
                        sx={{ position: 'absolute', bottom: 10, left: 10, bgcolor: 'common.white', fontWeight: 700 }}
                      />
                    </Box>
                    <Box sx={{ p: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        {destination.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {destination.country}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>

      <Box sx={{ bgcolor: 'background.paper' }}>
        <FeaturedDeals items={deals.slice(0, 8)} />
      </Box>

      <Box sx={{ bgcolor: 'secondary.light', py: { xs: 6, md: 8 } }}>
        <Container>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="overline" sx={{ color: 'orange.main', fontWeight: 700, letterSpacing: 2 }}>
              The Seravita difference
            </Typography>
            <Typography variant="h2" sx={{ fontSize: { xs: '1.6rem', md: '2.1rem' }, fontWeight: 800, color: 'primary.main' }}>
              Travel should feel this easy
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {perks.map((perk) => {
              const Icon = perk.icon;
              return (
                <Grid key={perk.id} size={{ xs: 12, sm: 6, md: 3 }}>
                  <Stack sx={{ alignItems: 'center', textAlign: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: '50%',
                        bgcolor: 'secondary.main',
                        display: 'grid',
                        placeItems: 'center'
                      }}
                    >
                      <Icon size={26} color="#cb6116" />
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      {perk.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {perk.body}
                    </Typography>
                  </Stack>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>

      <Container sx={{ py: { xs: 6, md: 8 } }}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-end', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="overline" sx={{ color: 'orange.main', fontWeight: 700, letterSpacing: 2 }}>
              From the journal
            </Typography>
            <Typography variant="h2" sx={{ fontSize: { xs: '1.6rem', md: '2.1rem' }, fontWeight: 800, color: 'primary.main' }}>
              Travel inspiration
            </Typography>
          </Box>
          <Button component={Link} to="/travelinspiration" variant="text" endIcon={<IconArrowRight size={17} />} sx={{ fontWeight: 700 }}>
            Read more
          </Button>
        </Stack>
        <Grid container spacing={2.5}>
          {articles.slice(0, 3).map((article) => (
            <Grid key={article.id} size={{ xs: 12, md: 4 }}>
              <Paper
                elevation={0}
                sx={{ borderRadius: 3, overflow: 'hidden', height: '100%', border: '1px solid', borderColor: 'grey.200' }}
              >
                <Box sx={{ height: 140 }}>
                  <DestinationArt scene={article.scene} sx={{ height: '100%' }} />
                </Box>
                <Box sx={{ p: 2.5 }}>
                  <Chip
                    label={article.tag}
                    size="small"
                    sx={{ bgcolor: 'secondary.main', color: 'orange.main', fontWeight: 700, mb: 1.5 }}
                  />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {article.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {article.excerpt}
                  </Typography>
                  <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5, mt: 2 }}>
                    <IconSparkles size={14} color="#cb6116" />
                    <Typography variant="caption" color="text.secondary">
                      {article.read}
                    </Typography>
                  </Stack>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Container sx={{ pb: { xs: 6, md: 8 } }}>
        <Box
          sx={{
            borderRadius: 4,
            bgcolor: 'secondary.main',
            p: { xs: 3, md: 5 },
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { md: 'center' },
            justifyContent: 'space-between',
            gap: 3
          }}
        >
          <Box>
            <Typography variant="h2" sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 800, color: 'primary.main' }}>
              Not sure where to start?
            </Typography>
            <Typography sx={{ color: 'text.secondary', mt: 1, maxWidth: 560 }}>
              Build an itinerary, explore the map or talk to a real travel specialist. We are here to make the planning part enjoyable.
            </Typography>
          </Box>
          <Stack direction="row" sx={{ gap: 1.5, flexWrap: 'wrap' }}>
            <Button component={Link} to="/tripplanner" variant="contained" size="large" sx={{ fontWeight: 700 }}>
              Plan a trip
            </Button>
            <Button
              component={Link}
              to="/deals"
              variant="outlined"
              size="large"
              sx={{ fontWeight: 700, borderColor: 'primary.main', color: 'primary.main' }}
            >
              See deals
            </Button>
          </Stack>
        </Box>
      </Container>
    </>
  );
}
