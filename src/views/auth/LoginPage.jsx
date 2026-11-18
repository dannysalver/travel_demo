import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
import { IconEye, IconEyeOff, IconLock, IconMail } from '@tabler/icons-react';

import useAuth from 'hooks/useAuth';
import { getLandingPath } from 'utils/auth';

export default function LoginPage() {
  const { login, user, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) navigate(from || getLandingPath(role), { replace: true });
  }, [user, role, from, navigate]);

  useEffect(() => {
    document.title = 'Sign in | Seravita';
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Stack sx={{ gap: 0.75, mb: 3 }}>
        <Typography variant="h3" sx={{ fontWeight: 800, color: 'primary.main' }}>
          Welcome back
        </Typography>
        <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>Sign in to continue to your Seravita account.</Typography>
      </Stack>

      <Stack sx={{ gap: 2 }}>
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
          autoComplete="current-password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
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
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <Button type="submit" fullWidth size="large" variant="contained" disabled={loading} sx={{ mt: 3, py: 1.3, fontWeight: 700 }}>
        {loading ? <CircularProgress size={22} color="inherit" /> : 'Sign in'}
      </Button>

      <Divider sx={{ my: 3 }} />

      <Stack direction="row" sx={{ gap: 0.5, justifyContent: 'center' }}>
        <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>New to Seravita?</Typography>
        <Typography
          component={Link}
          to="/register"
          sx={{ fontSize: 14, fontWeight: 700, textDecoration: 'none', color: 'orange.main', '&:hover': { textDecoration: 'underline' } }}
        >
          Create an account
        </Typography>
      </Stack>

      <Box sx={{ mt: 3, p: 2, borderRadius: 2, bgcolor: 'grey.50', border: 1, borderColor: 'grey.200' }}>
        <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary', mb: 0.5 }}>DEMO ACCOUNTS</Typography>
        <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>Customer: guest@seravita.travel / guest123</Typography>
      </Box>
    </Box>
  );
}
