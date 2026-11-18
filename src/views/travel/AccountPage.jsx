import { Link, useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
  IconArrowRight,
  IconBookmark,
  IconCompass,
  IconDiscount,
  IconLogout,
  IconMap,
  IconRoute,
  IconSparkles,
  IconTicket
} from '@tabler/icons-react';

import { del, get } from 'api';
import useAuth from 'hooks/useAuth';
import DestinationArt from './DestinationArt';
import PageHero from './PageHero';

const shortcuts = [
  { title: 'Explore deals', text: 'See the latest member-friendly offers.', path: '/deals', icon: IconDiscount },
  { title: 'Plan a trip', text: 'Build your day-by-day itinerary.', path: '/tripplanner', icon: IconRoute },
  { title: 'Find inspiration', text: 'Stories and guides from our team.', path: '/travelinspiration', icon: IconCompass },
  { title: 'Open the map', text: 'Discover destinations at a glance.', path: '/tripmap', icon: IconMap }
];

export default function AccountPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { data: bookings, isLoading: bookingsLoading } = useSWR(user ? '/travel/bookings' : null, get);
  const { data: savedDeals, isLoading: savedLoading, mutate: mutateSaved } = useSWR(user ? '/travel/saved-deals' : null, get);

  const handleRemoveSaved = async (dealId) => {
    try {
      await del(`/travel/saved-deals/${dealId}`);
      mutateSaved();
    } catch {
      // Keep the item visible if removal fails.
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <>
      <PageHero
        eyebrow="YOUR SERAVITA ACCOUNT"
        title={`Welcome back, ${user?.name?.split(' ')[0] || 'traveller'}`}
        subtitle="Everything you need for your next journey, in one place."
        scene="city"
        dense
      />
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: 1, borderColor: 'grey.200' }}>
              <Stack sx={{ alignItems: 'center', textAlign: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 72,
                    height: 72,
                    borderRadius: '50%',
                    display: 'grid',
                    placeItems: 'center',
                    bgcolor: 'secondary.main',
                    color: 'primary.main',
                    fontSize: 28,
                    fontWeight: 800
                  }}
                >
                  {user?.name?.charAt(0)?.toUpperCase() || 'S'}
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', mt: 1 }}>
                  {user?.name}
                </Typography>
                <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>{user?.email}</Typography>
                <Box sx={{ mt: 1, px: 1.5, py: 0.5, borderRadius: 10, bgcolor: 'grey.100' }}>
                  <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'text.secondary' }}>
                    Member
                  </Typography>
                </Box>
              </Stack>
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                startIcon={<IconLogout size={18} />}
                onClick={handleLogout}
                sx={{ mt: 3, textTransform: 'none', fontWeight: 700 }}
              >
                Sign out
              </Button>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack sx={{ gap: 2 }}>
              <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
                <IconSparkles size={20} color="#cb6116" />
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>
                  Your travel toolkit
                </Typography>
              </Stack>
              {shortcuts.map(({ title, text, path, icon: Icon }) => (
                <Paper
                  key={title}
                  component={Link}
                  to={path}
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    border: 1,
                    borderColor: 'grey.200',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    '&:hover': { borderColor: 'orange.main', bgcolor: 'grey.50' }
                  }}
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
                      flexShrink: 0
                    }}
                  >
                    <Icon size={20} />
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography sx={{ fontWeight: 700, color: 'text.primary' }}>{title}</Typography>
                    <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>{text}</Typography>
                  </Box>
                  <IconArrowRight size={18} color="#cb6116" />
                </Paper>
              ))}
            </Stack>
          </Grid>
        </Grid>

        <Box sx={{ mt: 6 }}>
          <Stack direction="row" sx={{ alignItems: 'center', gap: 1, mb: 2.5 }}>
            <IconTicket size={22} color="#cb6116" />
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>
              Your bookings
            </Typography>
          </Stack>
          {bookingsLoading ? (
            <Stack sx={{ alignItems: 'center', py: 5 }}>
              <CircularProgress size={28} />
            </Stack>
          ) : bookings?.length ? (
            <Grid container spacing={2}>
              {bookings.map((booking) => (
                <Grid key={booking.id} size={{ xs: 12 }}>
                  <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 2, alignItems: { xs: 'flex-start', sm: 'center' } }}>
                      <Box sx={{ flexGrow: 1 }}>
                        <Stack direction="row" sx={{ gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                          <Typography sx={{ fontWeight: 800, color: 'primary.main' }}>{booking.title}</Typography>
                          <Chip
                            label={booking.status}
                            size="small"
                            sx={{ bgcolor: 'secondary.main', color: 'primary.main', fontWeight: 700, textTransform: 'capitalize' }}
                          />
                        </Stack>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          {booking.location} · {booking.duration_label} · {booking.travellers}{' '}
                          {booking.travellers === 1 ? 'traveller' : 'travellers'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {booking.reference} · Booked {new Date(booking.created_at).toLocaleDateString()} · Paid ${booking.total}
                          {booking.seats?.length ? ` · Seats ${booking.seats.map((seat) => seat.label).join(', ')}` : ''}
                        </Typography>
                      </Box>
                      <Button
                        component={Link}
                        to={`/deal/${booking.deal_id}`}
                        variant="outlined"
                        size="small"
                        endIcon={<IconArrowRight size={16} />}
                        sx={{ fontWeight: 700, textTransform: 'none' }}
                      >
                        View deal
                      </Button>
                    </Stack>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper elevation={0} sx={{ textAlign: 'center', py: 6, px: 2, borderRadius: 3, border: '1px dashed', borderColor: 'grey.300' }}>
              <IconTicket size={38} color="#cb6116" />
              <Typography sx={{ fontWeight: 800, color: 'primary.main', mt: 1.5 }}>No bookings yet</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                When you reserve a deal, your confirmation and booking reference will appear here.
              </Typography>
              <Button component={Link} to="/deals" variant="contained" sx={{ mt: 2, fontWeight: 700 }}>
                Explore deals
              </Button>
            </Paper>
          )}
        </Box>

        <Box sx={{ mt: 6 }}>
          <Stack direction="row" sx={{ alignItems: 'center', gap: 1, mb: 2.5 }}>
            <IconBookmark size={22} color="#cb6116" />
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>
              Saved deals
            </Typography>
          </Stack>
          {savedLoading ? (
            <Stack sx={{ alignItems: 'center', py: 5 }}>
              <CircularProgress size={28} />
            </Stack>
          ) : savedDeals?.length ? (
            <Grid container spacing={2}>
              {savedDeals.map((deal) => (
                <Grid key={deal.id} size={{ xs: 12, sm: 6 }}>
                  <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid', borderColor: 'grey.200', height: '100%' }}>
                    <Box sx={{ height: 120, borderRadius: 2, overflow: 'hidden', mb: 2 }}>
                      <DestinationArt scene={deal.scene} sx={{ height: '100%' }} />
                    </Box>
                    <Typography sx={{ fontWeight: 800, color: 'primary.main' }}>{deal.title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {deal.location} · {deal.duration_label}
                    </Typography>
                    <Stack direction="row" sx={{ alignItems: 'baseline', gap: 1, mt: 1 }}>
                      {deal.old_price && (
                        <Typography variant="caption" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                          ${deal.old_price}
                        </Typography>
                      )}
                      <Typography sx={{ fontWeight: 800, color: 'orange.main' }}>${deal.price}</Typography>
                    </Stack>
                    <Stack direction="row" sx={{ gap: 1, mt: 2 }}>
                      <Button
                        component={Link}
                        to={`/deal/${deal.id}`}
                        variant="contained"
                        size="small"
                        endIcon={<IconArrowRight size={15} />}
                      >
                        View deal
                      </Button>
                      <Button variant="outlined" size="small" onClick={() => handleRemoveSaved(deal.id)}>
                        Remove
                      </Button>
                    </Stack>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper elevation={0} sx={{ textAlign: 'center', py: 6, px: 2, borderRadius: 3, border: '1px dashed', borderColor: 'grey.300' }}>
              <IconBookmark size={38} color="#cb6116" />
              <Typography sx={{ fontWeight: 800, color: 'primary.main', mt: 1.5 }}>No saved deals yet</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Tap the bookmark on any deal to keep it here for later.
              </Typography>
              <Button component={Link} to="/deals" variant="contained" sx={{ mt: 2, fontWeight: 700 }}>
                Browse deals
              </Button>
            </Paper>
          )}
        </Box>
      </Container>
    </>
  );
}
