import { useState } from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { IconArrowRight, IconSparkles } from '@tabler/icons-react';

import { useTravelContent } from 'contexts/TravelContentContext';
import DestinationArt from './DestinationArt';
import PageHero from './PageHero';

export default function TravelInspiration() {
  const { articles } = useTravelContent();
  const tags = ['All', ...new Set(articles.map((article) => article.tag))];
  const [activeTag, setActiveTag] = useState('All');
  const shown = activeTag === 'All' ? articles : articles.filter((article) => article.tag === activeTag);
  const featured = articles[0];

  return (
    <>
      <PageHero
        eyebrow="Travel Inspiration"
        title="Stories for your next somewhere"
        subtitle="Practical guides, honest notes and a little wanderlust from the Seravita team."
        scene="island"
      />

      <Container sx={{ py: { xs: 6, md: 8 } }}>
        <Card
          elevation={0}
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'grey.200',
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.1fr 1fr' }
          }}
        >
          <Box sx={{ minHeight: { xs: 220, md: 320 } }}>
            <DestinationArt scene={featured.scene} sx={{ height: '100%' }} />
          </Box>
          <CardContent sx={{ p: { xs: 3, md: 4 }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Stack direction="row" sx={{ alignItems: 'center', gap: 1, mb: 1.5 }}>
              <Chip label="Featured story" size="small" sx={{ bgcolor: 'orange.main', color: '#fff', fontWeight: 700 }} />
              <Typography variant="caption" color="text.secondary">
                {featured.read}
              </Typography>
            </Stack>
            <Typography variant="h2" sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 800, color: 'primary.main' }}>
              {featured.title}
            </Typography>
            <Typography sx={{ color: 'text.secondary', mt: 1.5 }}>{featured.excerpt}</Typography>
            <Button
              component={Link}
              to="/deals"
              variant="contained"
              endIcon={<IconArrowRight size={17} />}
              sx={{ mt: 3, alignSelf: 'flex-start', fontWeight: 700 }}
            >
              Find your island escape
            </Button>
          </CardContent>
        </Card>

        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-end', mt: 6, mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="overline" sx={{ color: 'orange.main', fontWeight: 700, letterSpacing: 2 }}>
              The journal
            </Typography>
            <Typography variant="h2" sx={{ fontSize: { xs: '1.5rem', md: '1.9rem' }, fontWeight: 800, color: 'primary.main' }}>
              More to read
            </Typography>
          </Box>
          <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}>
            {tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                onClick={() => setActiveTag(tag)}
                color={activeTag === tag ? 'primary' : 'default'}
                variant={activeTag === tag ? 'filled' : 'outlined'}
                sx={{ fontWeight: 600, textTransform: 'none' }}
              />
            ))}
          </Stack>
        </Stack>

        <Grid container spacing={3}>
          {shown.map((article) => (
            <Grid key={article.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                elevation={0}
                sx={{ height: '100%', borderRadius: 3, overflow: 'hidden', border: '1px solid', borderColor: 'grey.200' }}
              >
                <Box sx={{ height: 170 }}>
                  <DestinationArt scene={article.scene} sx={{ height: '100%' }} />
                </Box>
                <CardContent sx={{ p: 2.5 }}>
                  <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Chip label={article.tag} size="small" sx={{ bgcolor: 'secondary.main', color: 'orange.main', fontWeight: 700 }} />
                  </Stack>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {article.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                    {article.excerpt}
                  </Typography>
                  <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5, mt: 2 }}>
                    <IconSparkles size={14} color="#cb6116" />
                    <Typography variant="caption" color="text.secondary">
                      {article.read}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}
