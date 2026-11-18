import { useState } from 'react';
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useSWRConfig } from 'swr';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconLock,
  IconMapPin,
  IconMinus,
  IconPlus,
  IconShieldCheck,
  IconStar
} from '@tabler/icons-react';

import { post } from 'api';
import { useTravelContent } from 'contexts/TravelContentContext';
import useAuth from 'hooks/useAuth';
import DestinationArt from './DestinationArt';
import PageHero from './PageHero';
import SeatPicker, { seatTotal } from './SeatPicker';

const emptyCard = { name: '', number: '', expiry: '', cvc: '' };

function formatCardNumber(value) {
  return value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(.{4})/g, '$1 ')
    .trim();
}

function formatExpiry(value) {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

export default function DealDetailPage() {
  const { dealId } = useParams();
  const { deals, getCategory, getExperience } = useTravelContent();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { mutate: mutateBookings } = useSWRConfig();

  const deal = deals.find((item) => String(item.id) === String(dealId));
  const [activeStep, setActiveStep] = useState(0);
  const [travellers, setTravellers] = useState(1);
  const [seats, setSeats] = useState([]);
  const [card, setCard] = useState(emptyCard);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [booking, setBooking] = useState(null);

  if (!deal) {
    return (
      <>
        <PageHero
          eyebrow="Deal not found"
          title="That deal has moved on"
          subtitle="It may have been removed or the link is out of date."
          scene="beach"
        />
        <Container sx={{ py: 8, textAlign: 'center' }}>
          <Button component={Link} to="/deals" variant="contained" startIcon={<IconArrowLeft size={18} />} sx={{ fontWeight: 700 }}>
            Browse all deals
          </Button>
        </Container>
      </>
    );
  }

  const categoryLabel = getCategory(deal.category)?.title || getExperience(deal.category)?.title || 'Travel deal';
  const steps = ['Deal details', ...(deal.vehicleType ? ['Choose seats'] : []), 'Payment'];
  const seatCharge = deal.vehicleType ? seatTotal(seats, deal) : 0;
  const total = deal.price * travellers + seatCharge;

  const setCardField = (name, value) => setCard((current) => ({ ...current, [name]: value }));

  const handleNext = () => {
    if (activeStep === 1 && deal.vehicleType && seats.length !== travellers) {
      setNotice(`Choose ${travellers} ${travellers === 1 ? 'seat' : 'seats'} before continuing.`);
      return;
    }
    setError('');
    setActiveStep((step) => step + 1);
  };

  const handlePay = async () => {
    const digits = card.number.replace(/\D/g, '');
    if (card.name.trim().length < 3) return setError('Enter the name printed on the card.');
    if (digits.length !== 16) return setError('Enter a 16-digit demo card number.');
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expiry)) return setError('Use MM/YY for the expiry date.');
    if (!/^\d{3,4}$/.test(card.cvc)) return setError('Enter a valid CVC.');

    setError('');
    setSubmitting(true);
    try {
      const tripDetails = Object.fromEntries(searchParams.entries());
      const data = await post('/travel/bookings', {
        dealId: deal.id,
        travellers,
        seats,
        seatCharge,
        total,
        paymentLast4: digits.slice(-4),
        tripDetails
      });
      setBooking(data.booking);
      mutateBookings('/travel/bookings');
    } catch (err) {
      setError(err.message || 'We could not complete your booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const summaryCard = (
    <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="overline" sx={{ color: 'orange.main', fontWeight: 700, letterSpacing: 1.5 }}>
          Your booking
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main', mt: 0.5 }}>
          {deal.title}
        </Typography>
        <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5, mt: 1 }}>
          <IconMapPin size={15} color="#cb6116" />
          <Typography variant="body2" color="text.secondary">
            {deal.location}
          </Typography>
        </Stack>
        <Divider sx={{ my: 2 }} />
        <Stack sx={{ gap: 1.25 }}>
          <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              {deal.vehicleType ? 'Fare' : 'Price'} × {travellers}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              ${deal.price * travellers}
            </Typography>
          </Stack>
          {deal.vehicleType && (
            <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Seat selection
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                ${seatCharge}
              </Typography>
            </Stack>
          )}
          <Divider />
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
            <Typography sx={{ fontWeight: 800 }}>Total</Typography>
            <Typography variant="h4" sx={{ color: 'orange.main', fontWeight: 800 }}>
              ${total}
            </Typography>
          </Stack>
        </Stack>
        <Stack direction="row" sx={{ alignItems: 'center', gap: 0.75, mt: 2 }}>
          <IconShieldCheck size={18} color="#cb6116" />
          <Typography variant="caption" color="text.secondary">
            Demo checkout — no real payment is taken.
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );

  return (
    <>
      <PageHero eyebrow={categoryLabel} title={deal.title} subtitle={deal.summary} scene={deal.scene} dense />

      <Container sx={{ py: { xs: 5, md: 7 } }}>
        <Button component={Link} to={`/${deal.category}`} startIcon={<IconArrowLeft size={17} />} sx={{ fontWeight: 700, mb: 3 }}>
          Back to {categoryLabel}
        </Button>

        {booking ? (
          <Paper
            elevation={0}
            sx={{ p: { xs: 3, md: 5 }, borderRadius: 3, border: '1px solid', borderColor: 'grey.200', textAlign: 'center' }}
          >
            <Box
              sx={{
                width: 72,
                height: 72,
                mx: 'auto',
                borderRadius: '50%',
                bgcolor: 'secondary.main',
                color: 'orange.main',
                display: 'grid',
                placeItems: 'center'
              }}
            >
              <IconCheck size={38} />
            </Box>
            <Typography variant="overline" sx={{ color: 'orange.main', fontWeight: 700, letterSpacing: 2, mt: 2, display: 'block' }}>
              Booking confirmed
            </Typography>
            <Typography variant="h2" sx={{ fontSize: { xs: '1.8rem', md: '2.4rem' }, fontWeight: 800, color: 'primary.main', mt: 1 }}>
              You're all set
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 560, mx: 'auto' }}>
              Your demo booking for {deal.title} is confirmed and saved to your account. Keep the reference below handy.
            </Typography>
            <Box sx={{ display: 'inline-block', mt: 3, px: 4, py: 2, borderRadius: 2, bgcolor: 'grey.100' }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', letterSpacing: 1 }}>
                BOOKING REFERENCE
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', letterSpacing: 2 }}>
                {booking.reference}
              </Typography>
            </Box>
            <Stack direction="row" sx={{ justifyContent: 'center', gap: 2, flexWrap: 'wrap', mt: 4 }}>
              <Button component={Link} to="/account" variant="contained" sx={{ fontWeight: 700 }}>
                View my bookings
              </Button>
              <Button component={Link} to="/deals" variant="outlined" sx={{ fontWeight: 700 }}>
                Explore more deals
              </Button>
            </Stack>
          </Paper>
        ) : (
          <>
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 5 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 8 }}>
                {activeStep === 0 && (
                  <Stack sx={{ gap: 3 }}>
                    <Box sx={{ height: { xs: 200, md: 280 }, borderRadius: 3, overflow: 'hidden' }}>
                      <DestinationArt scene={deal.scene} sx={{ height: '100%' }} />
                    </Box>
                    <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3.5 }, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}>
                      <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap', mb: 2 }}>
                        <Chip label={deal.badge} sx={{ bgcolor: 'orange.main', color: '#fff', fontWeight: 700 }} />
                        <Chip label={deal.nights} variant="outlined" sx={{ fontWeight: 700 }} />
                        <Chip icon={<IconStar size={15} />} label={`${deal.rating} rating`} variant="outlined" sx={{ fontWeight: 700 }} />
                      </Stack>
                      <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', mb: 1.5 }}>
                        About this deal
                      </Typography>
                      <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
                        {deal.summary}
                      </Typography>
                      <Divider sx={{ my: 3 }} />
                      <Grid container spacing={3}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main', mb: 1.5 }}>
                            Highlights
                          </Typography>
                          <Stack sx={{ gap: 1.25 }}>
                            {deal.highlights.map((item) => (
                              <Stack key={item} direction="row" sx={{ gap: 1, alignItems: 'flex-start' }}>
                                <IconCheck size={17} color="#cb6116" style={{ marginTop: 2, flexShrink: 0 }} />
                                <Typography variant="body2" color="text.secondary">
                                  {item}
                                </Typography>
                              </Stack>
                            ))}
                          </Stack>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main', mb: 1.5 }}>
                            What's included
                          </Typography>
                          <Stack sx={{ gap: 1.25 }}>
                            {deal.includes.map((item) => (
                              <Stack key={item} direction="row" sx={{ gap: 1, alignItems: 'flex-start' }}>
                                <IconCheck size={17} color="#cb6116" style={{ marginTop: 2, flexShrink: 0 }} />
                                <Typography variant="body2" color="text.secondary">
                                  {item}
                                </Typography>
                              </Stack>
                            ))}
                          </Stack>
                        </Grid>
                      </Grid>
                      <Divider sx={{ my: 3 }} />
                      <Typography variant="body2" color="text.secondary">
                        Provided by <strong>{deal.provider}</strong> · Free cancellation on selected options
                      </Typography>
                    </Paper>
                  </Stack>
                )}

                {activeStep === 1 && deal.vehicleType && (
                  <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3.5 }, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}>
                    <Typography variant="overline" sx={{ color: 'orange.main', fontWeight: 700, letterSpacing: 1.5 }}>
                      {deal.vehicleType === 'flight' ? 'Flight seats' : deal.vehicleType === 'train' ? 'Train seats' : 'Bus seats'}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', mb: 1 }}>
                      Pick your places
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Select {travellers} {travellers === 1 ? 'seat' : 'seats'} on this {deal.provider} service. Taken seats are
                      unavailable.
                    </Typography>
                    <SeatPicker deal={deal} travellers={travellers} seats={seats} onChange={setSeats} />
                  </Paper>
                )}

                {activeStep === steps.length - 1 && (
                  <Stack sx={{ gap: 3 }}>
                    {!isAuthenticated && (
                      <Alert
                        severity="info"
                        action={
                          <Button
                            color="inherit"
                            size="small"
                            sx={{ fontWeight: 700 }}
                            onClick={() => navigate('/login', { state: { from: location } })}
                          >
                            Sign in
                          </Button>
                        }
                      >
                        Sign in to save this booking to your account and complete checkout.
                      </Alert>
                    )}
                    <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3.5 }, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}>
                      <Stack direction="row" sx={{ alignItems: 'center', gap: 1, mb: 1 }}>
                        <IconLock size={20} color="#cb6116" />
                        <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>
                          Demo payment
                        </Typography>
                      </Stack>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        This is a demonstration checkout. Use any 16-digit number, a future MM/YY date and any 3-digit CVC. No card is
                        charged.
                      </Typography>
                      <Grid container spacing={2.5}>
                        <Grid size={{ xs: 12 }}>
                          <TextField
                            fullWidth
                            label="Name on card"
                            autoComplete="cc-name"
                            value={card.name}
                            onChange={(event) => setCardField('name', event.target.value)}
                          />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <TextField
                            fullWidth
                            label="Card number"
                            autoComplete="cc-number"
                            inputProps={{ inputMode: 'numeric', maxLength: 19 }}
                            value={card.number}
                            onChange={(event) => setCardField('number', formatCardNumber(event.target.value))}
                          />
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                          <TextField
                            fullWidth
                            label="Expiry (MM/YY)"
                            autoComplete="cc-exp"
                            inputProps={{ inputMode: 'numeric', maxLength: 5 }}
                            value={card.expiry}
                            onChange={(event) => setCardField('expiry', formatExpiry(event.target.value))}
                          />
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                          <TextField
                            fullWidth
                            label="CVC"
                            autoComplete="cc-csc"
                            inputProps={{ inputMode: 'numeric', maxLength: 4 }}
                            value={card.cvc}
                            onChange={(event) => setCardField('cvc', event.target.value.replace(/\D/g, '').slice(0, 4))}
                          />
                        </Grid>
                      </Grid>
                      {error && (
                        <Alert severity="error" sx={{ mt: 2.5 }}>
                          {error}
                        </Alert>
                      )}
                    </Paper>
                  </Stack>
                )}
              </Grid>

              <Grid size={{ xs: 12, md: 4 }} sx={{ alignSelf: 'flex-start' }}>
                <Stack sx={{ gap: 3, position: { md: 'sticky' }, top: 88 }}>
                  {summaryCard}
                  <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}>
                    <Typography sx={{ fontWeight: 800, color: 'primary.main', mb: 2 }}>Travellers</Typography>
                    <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        Number of {deal.vehicleType === 'flight' ? 'passengers' : 'people'}
                      </Typography>
                      <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
                        <IconButton
                          size="small"
                          aria-label="Remove traveller"
                          disabled={travellers <= 1 || activeStep !== 0}
                          onClick={() => {
                            setTravellers((value) => Math.max(1, value - 1));
                            setSeats((value) => value.slice(0, travellers - 1));
                          }}
                        >
                          <IconMinus size={16} />
                        </IconButton>
                        <Typography sx={{ fontWeight: 800, minWidth: 20, textAlign: 'center' }}>{travellers}</Typography>
                        <IconButton
                          size="small"
                          aria-label="Add traveller"
                          disabled={travellers >= 8 || activeStep !== 0}
                          onClick={() => setTravellers((value) => Math.min(8, value + 1))}
                        >
                          <IconPlus size={16} />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </Paper>
                  <Stack direction="row" sx={{ gap: 1.5 }}>
                    {activeStep > 0 && (
                      <Button variant="outlined" onClick={() => setActiveStep((step) => step - 1)} sx={{ fontWeight: 700 }}>
                        Back
                      </Button>
                    )}
                    {activeStep < steps.length - 1 ? (
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={handleNext}
                        endIcon={<IconArrowRight size={18} />}
                        sx={{ fontWeight: 700 }}
                      >
                        {activeStep === 0 ? 'Continue' : 'To payment'}
                      </Button>
                    ) : (
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={handlePay}
                        disabled={submitting || !isAuthenticated}
                        sx={{ fontWeight: 700 }}
                      >
                        {submitting ? <CircularProgress size={22} color="inherit" /> : `Pay $${total}`}
                      </Button>
                    )}
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          </>
        )}
      </Container>

      <Snackbar
        open={Boolean(notice)}
        autoHideDuration={4000}
        onClose={() => setNotice('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setNotice('')} severity="warning" variant="filled" sx={{ width: '100%' }}>
          {notice}
        </Alert>
      </Snackbar>
    </>
  );
}
