import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { IconCalendarEvent, IconCheck, IconMapPin, IconSparkles } from '@tabler/icons-react';

import EnquiryDialog from './EnquiryDialog';
import PageHero from './PageHero';

const interests = ['Food & culture', 'Wildlife', 'Beaches', 'History', 'Adventure'];
const styles = ['Relaxed', 'Balanced', 'Packed'];

function buildPlan(destination, style, days) {
  const pace = {
    Relaxed: ['Slow morning and a long breakfast', 'One signature experience', 'Free afternoon to wander'],
    Balanced: ['Morning highlight', 'Afternoon exploration', 'Evening at leisure'],
    Packed: ['Early start, first highlight', 'Second experience and local lunch', 'Evening event or night walk']
  }[style];

  return Array.from({ length: Number(days) }, (_, index) => ({
    day: index + 1,
    title: index === 0 ? `Arrive in ${destination}` : `Discover ${destination}`,
    items: pace
  }));
}

export default function TripPlanner() {
  const [form, setForm] = useState({ destination: 'Zanzibar', style: 'Balanced', days: '4', interest: interests[0] });
  const [plan, setPlan] = useState(null);
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  const handleChange = (name) => (event) => setForm((current) => ({ ...current, [name]: event.target.value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    const destination = form.destination.trim() || 'your destination';
    setPlan(buildPlan(destination, form.style, form.days));
  };

  return (
    <>
      <PageHero
        eyebrow="Trip.Planner"
        title="Shape the trip you actually want"
        subtitle="A few choices now, a day-by-day starting point in seconds. Refine it with a specialist whenever you like."
        scene="mountain"
      />

      <Container sx={{ py: { xs: 6, md: 8 } }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper
              component="form"
              onSubmit={handleSubmit}
              elevation={0}
              sx={{ p: { xs: 2.5, md: 3.5 }, borderRadius: 4, border: '1px solid', borderColor: 'grey.200' }}
            >
              <Typography variant="h3" sx={{ fontWeight: 800, color: 'primary.main' }}>
                Plan your days
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 3 }}>
                Nothing is set in stone — this is a starting point you can change.
              </Typography>
              <Stack sx={{ gap: 2.25 }}>
                <TextField
                  fullWidth
                  label="Destination"
                  value={form.destination}
                  onChange={handleChange('destination')}
                  placeholder="Where are you going?"
                />
                <TextField select fullWidth label="Travel style" value={form.style} onChange={handleChange('style')}>
                  {styles.map((style) => (
                    <MenuItem key={style} value={style}>
                      {style}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField select fullWidth label="Number of days" value={form.days} onChange={handleChange('days')}>
                  {['2', '3', '4', '5', '7', '10'].map((days) => (
                    <MenuItem key={days} value={days}>
                      {days} days
                    </MenuItem>
                  ))}
                </TextField>
                <TextField select fullWidth label="Main interest" value={form.interest} onChange={handleChange('interest')}>
                  {interests.map((interest) => (
                    <MenuItem key={interest} value={interest}>
                      {interest}
                    </MenuItem>
                  ))}
                </TextField>
                <Button type="submit" variant="contained" size="large" startIcon={<IconSparkles size={18} />} sx={{ fontWeight: 700 }}>
                  Build my plan
                </Button>
              </Stack>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 7 }}>
            {plan ? (
              <Box>
                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                  <Box>
                    <Typography variant="overline" sx={{ color: 'orange.main', fontWeight: 700, letterSpacing: 2 }}>
                      Your draft itinerary
                    </Typography>
                    <Typography variant="h2" sx={{ fontSize: { xs: '1.4rem', md: '1.8rem' }, fontWeight: 800, color: 'primary.main' }}>
                      {form.days} days in {form.destination || 'your destination'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {form.style} pace · focused on {form.interest.toLowerCase()}
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    startIcon={<IconCheck size={17} />}
                    onClick={() => setEnquiryOpen(true)}
                    sx={{ fontWeight: 700 }}
                  >
                    Send to a specialist
                  </Button>
                </Stack>
                <Stack sx={{ gap: 2 }}>
                  {plan.map((day) => (
                    <Paper
                      key={day.day}
                      elevation={0}
                      sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'grey.200', display: 'flex', gap: 2 }}
                    >
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: 2,
                          bgcolor: 'secondary.main',
                          color: 'orange.main',
                          display: 'grid',
                          placeItems: 'center',
                          fontWeight: 800,
                          flexShrink: 0
                        }}
                      >
                        {day.day}
                      </Box>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main' }}>
                          {day.title}
                        </Typography>
                        <Stack sx={{ mt: 1, gap: 0.5 }}>
                          {day.items.map((item) => (
                            <Stack key={item} direction="row" sx={{ alignItems: 'center', gap: 0.75 }}>
                              <IconCheck size={14} color="#cb6116" />
                              <Typography variant="body2" color="text.secondary">
                                {item}
                              </Typography>
                            </Stack>
                          ))}
                        </Stack>
                      </Box>
                    </Paper>
                  ))}
                </Stack>
              </Box>
            ) : (
              <Paper
                elevation={0}
                sx={{
                  minHeight: 360,
                  borderRadius: 4,
                  bgcolor: 'grey.100',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  p: 4
                }}
              >
                <IconMapPin size={44} color="#cb6116" />
                <Typography variant="h3" sx={{ fontWeight: 800, color: 'primary.main', mt: 2 }}>
                  Your itinerary starts here
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 360 }}>
                  Fill in the details and we will sketch out a day-by-day plan you can shape with our team.
                </Typography>
                <Stack direction="row" sx={{ gap: 2, mt: 3, color: 'text.secondary' }}>
                  <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5 }}>
                    <IconCalendarEvent size={16} /> Dates
                  </Stack>
                  <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5 }}>
                    <IconMapPin size={16} /> Places
                  </Stack>
                </Stack>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>

      <EnquiryDialog
        open={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        kind="trip-planner"
        title="Share your draft with a specialist"
        intro="We will review your itinerary and come back with suggestions, availability and next steps."
        context={{ destination: form.destination, style: form.style, days: form.days, interest: form.interest, plan }}
      />
    </>
  );
}
