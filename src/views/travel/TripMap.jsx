import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { IconMapPin, IconNavigation } from '@tabler/icons-react';

import { useTravelContent } from 'contexts/TravelContentContext';
import EnquiryDialog from './EnquiryDialog';
import PageHero from './PageHero';

export default function TripMap() {
  const { mapPins } = useTravelContent();
  const [selected, setSelected] = useState(mapPins[0]);
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  return (
    <>
      <PageHero
        eyebrow="Map"
        title="See where your next trip could take you"
        subtitle="Explore the places we love, compare starting prices and jump straight into the details."
        scene="island"
      />

      <Container sx={{ py: { xs: 6, md: 8 } }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 4,
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'grey.200',
                position: 'relative',
                aspectRatio: { xs: '4 / 3', md: '16 / 10' },
                bgcolor: '#dceef2'
              }}
            >
              <Box
                component="svg"
                viewBox="0 0 800 500"
                preserveAspectRatio="xMidYMid slice"
                sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                aria-hidden="true"
              >
                <rect width="800" height="500" fill="#dceef2" />
                <path
                  d="M0 210 Q80 180 150 200 Q220 150 300 175 Q370 140 430 170 Q500 130 570 165 Q650 140 720 180 L800 165 L800 500 L0 500Z"
                  fill="#e6d6b8"
                />
                <path
                  d="M0 285 Q100 250 180 285 Q260 245 340 280 Q420 240 500 275 Q590 240 670 280 Q740 250 800 285 L800 500 L0 500Z"
                  fill="#d8c39d"
                />
                <path d="M40 320 Q160 290 260 330 Q360 285 470 330 Q580 290 690 335 Q750 310 800 330 L800 500 L40 500Z" fill="#cfb98f" />
                <path d="M250 355 Q330 330 400 365 Q480 335 560 370 Q640 340 720 380 L720 500 L250 500Z" fill="#c6ab7c" />
                {[90, 190, 290, 390, 490, 590, 690].map((x) => (
                  <path key={`v-${x}`} d={`M${x} 190 L${x + 18} 500`} stroke="#bda77f" strokeWidth="1" opacity="0.35" />
                ))}
                {[230, 290, 350, 410, 470].map((y) => (
                  <path key={`h-${y}`} d={`M0 ${y} L800 ${y}`} stroke="#bda77f" strokeWidth="1" opacity="0.3" />
                ))}
              </Box>
              {mapPins.map((pin) => {
                const active = selected?.id === pin.id;
                return (
                  <Button
                    key={pin.id}
                    onClick={() => setSelected(pin)}
                    sx={{
                      position: 'absolute',
                      left: `${pin.x}%`,
                      top: `${pin.y}%`,
                      transform: 'translate(-50%, -100%)',
                      minWidth: 0,
                      px: 1.25,
                      py: 0.5,
                      borderRadius: 3,
                      bgcolor: active ? 'orange.main' : 'common.white',
                      color: active ? '#fff' : 'primary.main',
                      boxShadow: 3,
                      fontSize: 12,
                      fontWeight: 800,
                      whiteSpace: 'nowrap',
                      zIndex: active ? 2 : 1,
                      '&:hover': { bgcolor: 'orange.main', color: '#fff' }
                    }}
                  >
                    <IconMapPin size={14} style={{ marginRight: 4 }} />${pin.price}
                  </Button>
                );
              })}
              <Chip
                icon={<IconNavigation size={14} />}
                label="Tap a pin for details"
                size="small"
                sx={{ position: 'absolute', top: 12, left: 12, bgcolor: 'common.white', fontWeight: 600 }}
              />
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            {selected && (
              <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'grey.200', height: '100%' }}>
                <Typography variant="overline" sx={{ color: 'orange.main', fontWeight: 700, letterSpacing: 2 }}>
                  Selected place
                </Typography>
                <Typography variant="h2" sx={{ fontSize: '1.7rem', fontWeight: 800, color: 'primary.main', mt: 0.5 }}>
                  {selected.name}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  Trips from <strong style={{ color: '#cb6116' }}>${selected.price}</strong> per person. Prices shift with season and
                  availability.
                </Typography>
                <Stack sx={{ mt: 3, gap: 1 }}>
                  {['Compare flights and stays', 'Add a guided experience', 'Build a day-by-day plan'].map((item) => (
                    <Stack key={item} direction="row" sx={{ alignItems: 'center', gap: 1 }}>
                      <IconMapPin size={15} color="#cb6116" />
                      <Typography variant="body2">{item}</Typography>
                    </Stack>
                  ))}
                </Stack>
                <Button variant="contained" fullWidth onClick={() => setEnquiryOpen(true)} sx={{ mt: 3, fontWeight: 700 }}>
                  Enquire about {selected.name}
                </Button>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>

      <EnquiryDialog
        open={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        kind="destination"
        title={`Enquire about ${selected?.name || 'your trip'}`}
        intro="Tell us a little about your plans and a specialist will send options and current prices."
        context={{ destination: selected?.name, startingPrice: selected?.price }}
      />
    </>
  );
}
