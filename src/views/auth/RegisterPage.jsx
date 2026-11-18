import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { IconEye, IconEyeOff, IconLock, IconMail, IconUser } from '@tabler/icons-react';

import useAuth from 'hooks/useAuth';
import { CUSTOMER_LANDING_PATH } from 'utils/auth';

export default function RegisterPage() {
  const { register, user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) navigate(CUSTOMER_LANDING_PATH, { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    document.title = 'Create account | Seravita';
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
    } catch (err) {
      setError(err.message || 'Could not create your account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Stack sx={{ gap: 0.75, mb: 3 }}>
        <Typography variant="h3" sx={{ fontWeight: 800, color: 'primary.main' }}>
          Join Seravita
        </Typography>
        <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>Create a free account to save trips and manage bookings.</Typography>
      </Stack>

      <Stack sx={{ gap: 2 }}>
        <TextField
          fullWidth
          required
          label="Full name"
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconUser size={18} />
              </InputAdornment>
            )
          }}
        />
        <TextField
          fullWidth
          required
          type="email"
          label="Email address"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconMail size={18} />
              </InputAdornment>
            )
          }}
        />
        <TextField
          fullWidth
          required
          label="Password"
          autoComplete="new-password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          helperText="At least 6 characters"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconLock size={18} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton aria-label="Toggle password visibility" onClick={() => setShowPassword((value) => !value)} edge="end">
                  {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <TextField
          fullWidth
          required
          label="Confirm password"
          autoComplete="new-password"
          type={showPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
        />
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <Button type="submit" fullWidth size="large" variant="contained" disabled={loading} sx={{ mt: 3, py: 1.3, fontWeight: 700 }}>
        {loading ? <CircularProgress size={22} color="inherit" /> : 'Create account'}
      </Button>

      <Divider sx={{ my: 3 }} />

      <Stack direction="row" sx={{ gap: 0.5, justifyContent: 'center' }}>
        <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>Already have an account?</Typography>
        <Typography
          component={Link}
          to="/login"
          sx={{ fontSize: 14, fontWeight: 700, textDecoration: 'none', color: 'orange.main', '&:hover': { textDecoration: 'underline' } }}
        >
          Sign in
        </Typography>
      </Stack>
    </Box>
  );
}
