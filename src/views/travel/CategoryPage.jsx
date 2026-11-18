import { Link, useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { IconArrowRight, IconCheck, IconSearchOff, IconShieldCheck } from '@tabler/icons-react';

import { useTravelContent } from 'contexts/TravelContentContext';
import DealCard from './DealCard';
import PageHero from './PageHero';
import SearchPanel from './SearchPanel';
import { criteriaFromParams, describeSearch, filterDealsByCriteria, hasSearch, paramsFromCriteria } from './search';
import { defaultWhyBook, whyBookByCategory } from './whyBook';

export default function CategoryPage({ categoryId }) {
  const { categories, deals, getCategory } = useTravelContent();
  const category = getCategory(categoryId) || categories[0];
  const whyBook = whyBookByCategory[category.id] || defaultWhyBook;
  const [searchParams, setSearchParams] = useSearchParams();
  const searched = hasSearch(searchParams);
  const criteria = criteriaFromParams(searchParams, category.fields);
  const categoryDeals = deals.filter((deal) => deal.category === category.id);
  const shownDeals = searched ? filterDealsByCriteria(categoryDeals, criteria, category.fields) : categoryDeals;
  const searchLabels = describeSearch(criteria, category.fields);

  const handleSearch = ({ criteria: nextCriteria, fields }) => {
    setSearchParams(paramsFromCriteria(nextCriteria, fields));
    document.getElementById('category-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <PageHero
        eyebrow="Book with Seravita"
        title={category.title}
        subtitle={`${category.caption}. Compare trusted providers and reserve in minutes — all in one place.`}
        scene={category.scene}
      >
        <SearchPanel categoryId={category.id} tabs={[category]} onSearch={handleSearch} />
      </PageHero>

      <Container sx={{ py: { xs: 5, md: 7 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
          <IconShieldCheck size={26} color="#cb6116" />
          <Box>
            <Typography variant="h2" sx={{ fontSize: { xs: '1.35rem', md: '1.7rem' }, fontWeight: 800, color: 'primary.main' }}>
              Why book {category.title.toLowerCase()} with us
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {whyBook.subtitle}
            </Typography>
          </Box>
        </Box>
        <Grid container spacing={2.5}>
          {whyBook.points.map(({ icon: Icon, title, body }) => (
            <Grid key={title} size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper elevation={0} sx={{ height: '100%', p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}>
                <Icon size={24} color="#cb6116" />
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 1.5, color: 'primary.main' }}>
                  {title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {body}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box component="section" id="category-results" sx={{ bgcolor: 'grey.100', py: { xs: 5, md: 7 }, scrollMarginTop: 72 }}>
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
                  : `Popular ${category.title.toLowerCase()}`}
              </Typography>
              <Typography sx={{ color: 'text.secondary', mt: 0.5 }}>
                {searched && searchLabels.length
                  ? searchLabels.join(' · ')
                  : 'A few favourites to get you started. Prices are per person and change with availability.'}
              </Typography>
            </Box>
            <Stack direction="row" sx={{ gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
              {searched && <Chip label="Clear search" onClick={() => setSearchParams({})} variant="outlined" sx={{ fontWeight: 700 }} />}
              <Button component={Link} to="/deals" variant="text" sx={{ fontWeight: 700 }}>
                See all deals
              </Button>
            </Stack>
          </Stack>

          {shownDeals.length ? (
            <Grid container spacing={3}>
              {shownDeals.map((deal) => (
                <Grid key={deal.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <DealCard deal={deal} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper elevation={0} sx={{ textAlign: 'center', py: 8, px: 2, borderRadius: 3, border: '1px dashed', borderColor: 'grey.300' }}>
              <IconSearchOff size={44} color="#cb6116" />
              <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', mt: 2 }}>
                No {category.title.toLowerCase()} found
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 480, mx: 'auto' }}>
                Nothing in {category.title} matches your search. Try a different place or clear the search to see every option.
              </Typography>
              <Button variant="contained" onClick={() => setSearchParams({})} sx={{ mt: 3, fontWeight: 700 }}>
                Show all {category.title.toLowerCase()}
              </Button>
            </Paper>
          )}
        </Container>
      </Box>

      <Container sx={{ py: { xs: 5, md: 7 } }}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-end', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="overline" sx={{ color: 'orange.main', fontWeight: 700, letterSpacing: 2 }}>
              Keep exploring
            </Typography>
            <Typography variant="h2" sx={{ fontSize: { xs: '1.35rem', md: '1.7rem' }, fontWeight: 800, color: 'primary.main' }}>
              More ways to travel
            </Typography>
          </Box>
          <Button component={Link} to="/deals" variant="text" endIcon={<IconArrowRight size={17} />} sx={{ fontWeight: 700 }}>
            Browse every deal
          </Button>
        </Stack>
        <Grid container spacing={2}>
          {categories
            .filter((item) => item.id !== category.id)
            .slice(0, 6)
            .map((item) => {
              const Icon = item.icon;
              return (
                <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Button
                    component={Link}
                    to={item.path}
                    variant="outlined"
                    startIcon={<Icon size={18} />}
                    endIcon={<IconCheck size={16} />}
                    sx={{ width: '100%', justifyContent: 'flex-start', textTransform: 'none', fontWeight: 600, borderRadius: 2, py: 1.3 }}
                  >
                    {item.title}
                  </Button>
                </Grid>
              );
            })}
        </Grid>
      </Container>
    </>
  );
}
